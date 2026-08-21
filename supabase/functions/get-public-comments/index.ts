import { findContent } from "../_shared/content.ts";
import {
  readContentReference,
  readLimit,
} from "../_shared/community.ts";
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

type PublicCommentRow = {
  id: string;
  public_id: string;
  parent_comment_id: string | null;
  display_name_public: string | null;
  body_normalized: string;
  published_at: string;
};

type CommentReactionRow = {
  comment_id: string;
  visitor_hash: string;
};

Deno.serve(async (request: Request): Promise<Response> => {
  const rejected = rejectDisallowedRequest(request);
  if (rejected) return rejected;

  try {
    const input = await readJsonObject(request);
    if (!input) {
      return jsonResponse(request, { error: "invalid_json" }, 400);
    }

    const contentReference = readContentReference(input);
    if (!contentReference) {
      return jsonResponse(request, { error: "invalid_input" }, 400);
    }

    const visitorId = input.visitor_id == null
      ? null
      : readValidVisitorId(input.visitor_id);
    if (input.visitor_id != null && !visitorId) {
      return jsonResponse(request, { error: "invalid_input" }, 400);
    }

    const client = getAdminClient();
    const content = await findContent(
      client,
      contentReference.contentType,
      contentReference.contentSlug,
    );

    if (!content) {
      return jsonResponse(request, { error: "content_not_found" }, 404);
    }

    if (!content.is_comment_public) {
      return jsonResponse(request, { comments: [] });
    }

    const limit = readLimit(input.limit);
    const { data: commentRows, error: commentError } = await client
      .from("community_comments")
      .select(
        "id, public_id, parent_comment_id, display_name_public, body_normalized, published_at",
      )
      .eq("content_id", content.id)
      .eq("status", "published")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (commentError) throw commentError;

    const comments = (commentRows ?? []) as PublicCommentRow[];
    if (comments.length === 0) {
      return jsonResponse(request, { comments: [] });
    }

    const commentIds = comments.map((comment) => comment.id as string);
    const { data: reactionRows, error: reactionError } = await client
      .from("community_reactions")
      .select("comment_id, visitor_hash")
      .eq("target_type", "comment")
      .eq("reaction_type", "fav")
      .in("comment_id", commentIds);

    if (reactionError) throw reactionError;

    const visitorHash = visitorId
      ? await createVisitorHash(visitorId)
      : null;
    if (visitorHash) {
      await touchCommunityVisitor(client, visitorHash);
    }
    const favCounts = new Map<string, number>();
    const visitorFavs = new Set<string>();

    for (const reaction of (reactionRows ?? []) as CommentReactionRow[]) {
      const commentId = reaction.comment_id as string;
      favCounts.set(commentId, (favCounts.get(commentId) ?? 0) + 1);
      if (visitorHash && reaction.visitor_hash === visitorHash) {
        visitorFavs.add(commentId);
      }
    }

    const publicIdByInternalId = new Map<string, string>();
    for (const comment of comments) {
      publicIdByInternalId.set(
        comment.id as string,
        comment.public_id as string,
      );
    }

    return jsonResponse(request, {
      comments: comments.map((comment) => ({
        public_id: comment.public_id,
        parent_public_id: comment.parent_comment_id
          ? publicIdByInternalId.get(comment.parent_comment_id as string) ?? null
          : null,
        display_name: comment.display_name_public || "名無しさん",
        body: comment.body_normalized,
        published_at: comment.published_at,
        favored: visitorFavs.has(comment.id as string),
        fav_count: favCounts.get(comment.id as string) ?? 0,
      })),
    });
  } catch (error) {
    console.error("get-public-comments failed", error);
    return jsonResponse(request, { error: "internal_error" }, 500);
  }
});
