import { findArtwork } from "../_shared/artwork.ts";
import { getAdminClient } from "../_shared/db.ts";
import { recordInteractionEvent } from "../_shared/events.ts";
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

const MIN_TOGGLE_INTERVAL_MS = 2_000;
const MAX_TOGGLES_PER_MINUTE = 12;

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

    if (!artwork.is_fav_open) {
      return jsonResponse(request, { error: "fav_closed" }, 403);
    }

    const visitorHash = await createVisitorHash(visitorId);
    const now = Date.now();
    const oneMinuteAgo = new Date(now - 60_000).toISOString();

    const { data: recentEvents, error: rateError } = await client
      .from("interaction_events")
      .select("created_at")
      .eq("visitor_hash", visitorHash)
      .eq("artwork_id", artwork.id)
      .eq("event_type", "fav_toggle")
      .eq("event_result", "accepted")
      .gte("created_at", oneMinuteAgo)
      .order("created_at", { ascending: false })
      .limit(MAX_TOGGLES_PER_MINUTE);

    if (rateError) throw rateError;

    const latestCreatedAt = recentEvents?.[0]?.created_at as string | undefined;
    const tooSoon = latestCreatedAt
      ? now - new Date(latestCreatedAt).getTime() < MIN_TOGGLE_INTERVAL_MS
      : false;
    const tooMany = (recentEvents?.length ?? 0) >= MAX_TOGGLES_PER_MINUTE;

    if (tooSoon || tooMany) {
      await recordInteractionEvent(client, {
        artworkId: artwork.id,
        visitorHash,
        eventType: "fav_toggle",
        eventResult: "blocked",
      });
      return jsonResponse(request, { error: "rate_limited" }, 429);
    }

    const { data: existing, error: existingError } = await client
      .from("artwork_favs")
      .select("id")
      .eq("artwork_id", artwork.id)
      .eq("visitor_hash", visitorHash)
      .maybeSingle();

    if (existingError) throw existingError;

    let favored: boolean;

    if (existing) {
      const { error: deleteError } = await client
        .from("artwork_favs")
        .delete()
        .eq("id", existing.id);

      if (deleteError) throw deleteError;
      favored = false;
    } else {
      const { error: insertError } = await client
        .from("artwork_favs")
        .insert({
          artwork_id: artwork.id,
          visitor_hash: visitorHash,
        });

      if (insertError) {
        // UNIQUE制約との競合時は、現在状態を再取得する。
        if (insertError.code === "23505") {
          favored = true;
        } else {
          throw insertError;
        }
      } else {
        favored = true;
      }
    }

    await recordInteractionEvent(client, {
      artworkId: artwork.id,
      visitorHash,
      eventType: "fav_toggle",
      eventResult: "accepted",
    });

    return jsonResponse(request, { favored });
  } catch (error) {
    console.error("toggle-artwork-fav failed", error);
    return jsonResponse(request, { error: "internal_error" }, 500);
  }
});
