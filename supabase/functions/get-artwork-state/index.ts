import { findArtwork } from "../_shared/artwork.ts";
import { getAdminClient } from "../_shared/db.ts";
import {
  jsonResponse,
  readJsonObject,
  rejectDisallowedRequest,
} from "../_shared/http.ts";
import { readArtworkSlug } from "../_shared/validation.ts";
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

    const artworkSlug = readArtworkSlug(input.artwork_slug);
    const visitorId = readValidVisitorId(input.visitor_id);

    if (!artworkSlug || !visitorId) {
      return jsonResponse(request, { error: "invalid_input" }, 400);
    }

    const client = getAdminClient();
    const artwork = await findArtwork(client, artworkSlug);

    if (!artwork) {
      return jsonResponse(request, { error: "artwork_not_found" }, 404);
    }

    const visitorHash = await createVisitorHash(visitorId);
    const { data, error } = await client
      .from("artwork_favs")
      .select("id")
      .eq("artwork_id", artwork.id)
      .eq("visitor_hash", visitorHash)
      .maybeSingle();

    if (error) throw error;

    return jsonResponse(request, { favored: data !== null });
  } catch (error) {
    console.error("get-artwork-state failed", error);
    return jsonResponse(request, { error: "internal_error" }, 500);
  }
});
