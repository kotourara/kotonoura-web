import {
  findCommentTarget,
  findContent,
  type ContentRecord,
} from "../_shared/content.ts";
import {
  readCommentPublicId,
  readContentReference,
  readReactionType,
  readTargetType,
} from "../_shared/community.ts";
import {
  recordCommunityEventInBackground,
} from "../_shared/community-events.ts";
import { touchCommunityVisitor } from "../_shared/community-visitor.ts";
import { getAdminClient } from "../_shared/db.ts";
import {
  jsonResponse,
  readJsonObject,
  rejectDisallowedRequest,
} from "../_shared/http.ts";
import {
  createVisitorHash,
  readValidVisitorId,
} from "../_shared/visitor.ts";

const MIN_TOGGLE_INTERVAL_MS = 2_000;
const MAX_TOGGLES_PER_MINUTE = 12;

type ResolvedTarget = {
  targetType: "content" | "comment";
  content: ContentRecord;
  contentId: string;
  commentId: string | null;
};

async function resolveTarget(
  input: Record<string, unknown>,
): Promise<ResolvedTarget | null> {
  const client = getAdminClient();
  const targetType = readTargetType(input.target_type) ?? "content";

  if (targetType === "content") {
    const reference = readContentReference(input);
    if (!reference) return null;

    const content = await findContent(
      client,
      reference.contentType,
      reference.contentSlug,
    );
    if (!content) return null;

    return {
      targetType,
      content,
      contentId: content.id,
      commentId: null,
    };
  }

  const publicId = readCommentPublicId(input.comment_public_id);
  if (!publicId) return null;

  const comment = await findCommentTarget(client, publicId);
  if (!comment || comment.status !== "published") return null;

  const { data: contentData, error: contentError } = await client
    .from("content_items")
    .select(
      "id, content_type, slug, title, publication_state, is_reaction_open, is_comment_open, is_comment_public, is_comment_reaction_open",
    )
    .eq("id", comment.content_id)
    .maybeSingle();

  if (contentError) throw contentError;
  if (!contentData) return null;

  return {
    targetType,
    content: contentData as ContentRecord,
    contentId: comment.content_id,
    commentId: comment.id,
  };
}

Deno.serve(async (request: Request): Promise<Response> => {
  const rejected = rejectDisallowedRequest(request);
  if (rejected) return rejected;

  try {
    const input = await readJsonObject(request);
    if (!input) {
      return jsonResponse(request, { error: "invalid_json" }, 400);
    }

    const visitorId = readValidVisitorId(input.visitor_id);
    const reactionType = readReactionType(input.reaction_type);
    const includeCount = input.include_count !== false;
    const desiredActive = typeof input.desired_active === "boolean"
      ? input.desired_active
      : null;
    const target = await resolveTarget(input);

    if (!visitorId || !reactionType || !target) {
      return jsonResponse(request, { error: "invalid_input" }, 400);
    }

    if (
      target.targetType === "content" &&
      !target.content.is_reaction_open
    ) {
      return jsonResponse(request, { error: "reaction_closed" }, 403);
    }

    if (
      target.targetType === "comment" &&
      (!target.content.is_comment_public ||
        !target.content.is_comment_reaction_open)
    ) {
      return jsonResponse(
        request,
        { error: "comment_reaction_closed" },
        403,
      );
    }

    const client = getAdminClient();
    const visitorHash = await createVisitorHash(visitorId);
    const visitor = await touchCommunityVisitor(client, visitorHash);
    if (visitor.status === "blocked") {
      return jsonResponse(request, { error: "visitor_blocked" }, 403);
    }
    const now = Date.now();
    const oneMinuteAgo = new Date(now - 60_000).toISOString();

    let rateQuery = client
      .from("community_events")
      .select("created_at")
      .eq("visitor_hash", visitorHash)
      .eq("target_type", target.targetType)
      .eq("reaction_type", reactionType)
      .eq("event_result", "accepted")
      .in("event_type", ["reaction_add", "reaction_remove"])
      .gte("created_at", oneMinuteAgo)
      .order("created_at", { ascending: false })
      .limit(MAX_TOGGLES_PER_MINUTE);

    if (target.targetType === "content") {
      rateQuery = rateQuery.eq("content_id", target.contentId);
    } else {
      rateQuery = rateQuery.eq("comment_id", target.commentId);
    }

    let existingQuery = client
      .from("community_reactions")
      .select("id")
      .eq("target_type", target.targetType)
      .eq("visitor_hash", visitorHash)
      .eq("reaction_type", reactionType);

    if (target.targetType === "content") {
      existingQuery = existingQuery.eq("content_id", target.contentId);
    } else {
      existingQuery = existingQuery.eq("comment_id", target.commentId);
    }

    const [rateResult, existingResult] = await Promise.all([
      rateQuery,
      existingQuery.maybeSingle(),
    ]);

    if (rateResult.error) throw rateResult.error;
    if (existingResult.error) throw existingResult.error;

    const recentEvents = rateResult.data;
    const existing = existingResult.data;

    /*
     * desired_active指定時は単純な反転ではなく、要求された状態へ揃える。
     * 端末内キャッシュとDBが一時的に食い違っていても、同じ操作を
     * 重ねて逆状態へ戻してしまわないための冪等処理。
     */
    const alreadyDesired = desiredActive !== null
      && Boolean(existing) === desiredActive;

    if (alreadyDesired) {
      const responseBody: Record<string, unknown> = {
        target_type: target.targetType,
        reaction_type: reactionType,
        active: desiredActive,
        favored: reactionType === "fav" ? desiredActive : undefined,
        reaction_delta: 0,
        changed: false,
      };

      if (!includeCount) {
        return jsonResponse(request, responseBody);
      }

      let countQuery = client
        .from("community_reactions")
        .select("id", { count: "exact", head: true })
        .eq("target_type", target.targetType)
        .eq("reaction_type", reactionType);

      if (target.targetType === "content") {
        countQuery = countQuery.eq("content_id", target.contentId);
      } else {
        countQuery = countQuery.eq("comment_id", target.commentId);
      }

      const { count, error: countError } = await countQuery;
      if (countError) throw countError;

      responseBody.reaction_count = count ?? 0;
      if (reactionType === "fav") responseBody.fav_count = count ?? 0;
      return jsonResponse(request, responseBody);
    }

    const latestCreatedAt = recentEvents?.[0]?.created_at as string | undefined;
    const tooSoon = latestCreatedAt
      ? now - new Date(latestCreatedAt).getTime() < MIN_TOGGLE_INTERVAL_MS
      : false;
    const tooMany = (recentEvents?.length ?? 0) >= MAX_TOGGLES_PER_MINUTE;

    if (tooSoon || tooMany) {
      recordCommunityEventInBackground(client, {
        contentId: target.contentId,
        commentId: target.commentId,
        visitorHash,
        targetType: target.targetType,
        eventType: "reaction_toggle",
        reactionType,
        eventResult: "blocked",
      });
      return jsonResponse(request, { error: "rate_limited" }, 429);
    }

    const shouldActivate = desiredActive ?? !existing;
    let active: boolean;
    let eventType: "reaction_add" | "reaction_remove";

    if (!shouldActivate && existing) {
      const { error: deleteError } = await client
        .from("community_reactions")
        .delete()
        .eq("id", existing.id);
      if (deleteError) throw deleteError;

      active = false;
      eventType = "reaction_remove";
    } else {
      const insertValues = target.targetType === "content"
        ? {
          target_type: "content",
          content_id: target.contentId,
          comment_id: null,
          visitor_hash: visitorHash,
          reaction_type: reactionType,
        }
        : {
          target_type: "comment",
          content_id: null,
          comment_id: target.commentId,
          visitor_hash: visitorHash,
          reaction_type: reactionType,
        };

      const { error: insertError } = await client
        .from("community_reactions")
        .insert(insertValues);

      if (insertError && insertError.code !== "23505") {
        throw insertError;
      }

      active = true;
      eventType = "reaction_add";
    }

    recordCommunityEventInBackground(client, {
      contentId: target.contentId,
      commentId: target.commentId,
      visitorHash,
      targetType: target.targetType,
      eventType,
      reactionType,
      eventResult: "accepted",
    });

    const responseBody: Record<string, unknown> = {
      target_type: target.targetType,
      reaction_type: reactionType,
      active,
      favored: reactionType === "fav" ? active : undefined,
      reaction_delta: active ? 1 : -1,
      changed: true,
    };

    if (!includeCount) {
      return jsonResponse(request, responseBody);
    }

    let countQuery = client
      .from("community_reactions")
      .select("id", { count: "exact", head: true })
      .eq("target_type", target.targetType)
      .eq("reaction_type", reactionType);

    if (target.targetType === "content") {
      countQuery = countQuery.eq("content_id", target.contentId);
    } else {
      countQuery = countQuery.eq("comment_id", target.commentId);
    }

    const { count, error: countError } = await countQuery;
    if (countError) throw countError;

    responseBody.reaction_count = count ?? 0;
    if (reactionType === "fav") responseBody.fav_count = count ?? 0;
    return jsonResponse(request, responseBody);
  } catch (error) {
    console.error("toggle-reaction failed", error);
    return jsonResponse(request, { error: "internal_error" }, 500);
  }
});
