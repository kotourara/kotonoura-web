import { findContent } from "../_shared/content.ts";
import { readContentReference } from "../_shared/community.ts";
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
import { validateCommentInput } from "../_shared/validation.ts";
import {
  createVisitorHash,
  readValidVisitorId,
} from "../_shared/visitor.ts";

const TEN_MINUTES_MS = 10 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const DAILY_COMMENT_LIMIT = 3;

Deno.serve(async (request: Request): Promise<Response> => {
  const rejected = rejectDisallowedRequest(request);
  if (rejected) return rejected;

  try {
    const input = await readJsonObject(request);
    if (!input) {
      return jsonResponse(request, { error: "invalid_json" }, 400);
    }

    const contentReference = readContentReference(input);
    const visitorId = readValidVisitorId(input.visitor_id);
    const commentValidation = validateCommentInput(
      input.display_name,
      input.body,
    );

    if (!contentReference || !visitorId) {
      return jsonResponse(request, { error: "invalid_input" }, 400);
    }

    if (!commentValidation.value) {
      return jsonResponse(
        request,
        { error: commentValidation.error ?? "invalid_comment" },
        400,
      );
    }

    const client = getAdminClient();
    const [content, visitorHash] = await Promise.all([
      findContent(
        client,
        contentReference.contentType,
        contentReference.contentSlug,
      ),
      createVisitorHash(visitorId),
    ]);

    if (!content) {
      return jsonResponse(request, { error: "content_not_found" }, 404);
    }

    if (!content.is_comment_open) {
      return jsonResponse(request, { error: "comment_closed" }, 403);
    }

    const visitor = await touchCommunityVisitor(client, visitorHash);
    if (visitor.status === "blocked") {
      return jsonResponse(request, { error: "visitor_blocked" }, 403);
    }
    const now = Date.now();
    const tenMinutesAgo = new Date(now - TEN_MINUTES_MS).toISOString();
    const oneDayAgo = new Date(now - ONE_DAY_MS).toISOString();

    const [sameContentResult, dailyResult, duplicateResult] =
      await Promise.all([
        client
          .from("community_comments")
          .select("id", { count: "exact", head: true })
          .eq("visitor_hash", visitorHash)
          .eq("content_id", content.id)
          .gte("created_at", tenMinutesAgo),
        client
          .from("community_comments")
          .select("id", { count: "exact", head: true })
          .eq("visitor_hash", visitorHash)
          .gte("created_at", oneDayAgo),
        client
          .from("community_comments")
          .select("id")
          .eq("visitor_hash", visitorHash)
          .eq("content_id", content.id)
          .eq(
            "body_normalized",
            commentValidation.value.bodyNormalized,
          )
          .limit(1),
      ]);

    if (sameContentResult.error) throw sameContentResult.error;
    if (dailyResult.error) throw dailyResult.error;
    if (duplicateResult.error) throw duplicateResult.error;

    if ((sameContentResult.count ?? 0) >= 1) {
      recordCommunityEventInBackground(client, {
        contentId: content.id,
        visitorHash,
        targetType: "content",
        eventType: "comment_submit",
        eventResult: "blocked",
      });
      return jsonResponse(
        request,
        { error: "content_comment_rate_limited" },
        429,
      );
    }

    if ((dailyResult.count ?? 0) >= DAILY_COMMENT_LIMIT) {
      recordCommunityEventInBackground(client, {
        contentId: content.id,
        visitorHash,
        targetType: "content",
        eventType: "comment_submit",
        eventResult: "blocked",
      });
      return jsonResponse(
        request,
        { error: "daily_comment_limit_reached" },
        429,
      );
    }

    if ((duplicateResult.data?.length ?? 0) > 0) {
      recordCommunityEventInBackground(client, {
        contentId: content.id,
        visitorHash,
        targetType: "content",
        eventType: "comment_submit",
        eventResult: "rejected",
      });
      return jsonResponse(request, { error: "duplicate_comment" }, 409);
    }

    const { data: inserted, error: insertError } = await client
      .from("community_comments")
      .insert({
        content_id: content.id,
        visitor_hash: visitorHash,
        display_name_raw: commentValidation.value.displayNameRaw,
        display_name_public: null,
        body_raw: commentValidation.value.bodyRaw,
        body_normalized: commentValidation.value.bodyNormalized,
        status: "pending",
      })
      .select("public_id, status")
      .single();

    if (insertError) throw insertError;

    recordCommunityEventInBackground(client, {
      contentId: content.id,
      visitorHash,
      targetType: "content",
      eventType: "comment_submit",
      eventResult: "accepted",
    });

    return jsonResponse(
      request,
      {
        accepted: true,
        public_id: inserted.public_id,
        status: inserted.status,
      },
      201,
    );
  } catch (error) {
    console.error("submit-comment failed", error);
    return jsonResponse(request, { error: "internal_error" }, 500);
  }
});
