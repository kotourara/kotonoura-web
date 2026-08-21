import { findContent } from "../_shared/content.ts";
import { readContentReference } from "../_shared/community.ts";
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

    if (!contentReference || !visitorId) {
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

    const visitorHash = await createVisitorHash(visitorId);
    await touchCommunityVisitor(client, visitorHash);

    const [activeResult, countResult, commentCountResult] = await Promise.all([
      client
        .from("community_reactions")
        .select("id")
        .eq("target_type", "content")
        .eq("content_id", content.id)
        .eq("visitor_hash", visitorHash)
        .eq("reaction_type", "fav")
        .maybeSingle(),
      client
        .from("community_reactions")
        .select("id", { count: "exact", head: true })
        .eq("target_type", "content")
        .eq("content_id", content.id)
        .eq("reaction_type", "fav"),
      client
        .from("community_comments")
        .select("id", { count: "exact", head: true })
        .eq("content_id", content.id)
        .eq("status", "published"),
    ]);

    if (activeResult.error) throw activeResult.error;
    if (countResult.error) throw countResult.error;
    if (commentCountResult.error) throw commentCountResult.error;

    const favored = activeResult.data !== null;
    const favCount = countResult.count ?? 0;
    const commentCount = commentCountResult.count ?? 0;

    return jsonResponse(request, {
      content_type: content.content_type,
      content_slug: content.slug,
      favored,
      fav_count: favCount,
      comment_count: commentCount,
      reaction_open: content.is_reaction_open,
      comment_open: content.is_comment_open,
      comment_public: content.is_comment_public,
      comment_reaction_open: content.is_comment_reaction_open,
    });
  } catch (error) {
    console.error("get-content-state failed", error);
    return jsonResponse(request, { error: "internal_error" }, 500);
  }
});
