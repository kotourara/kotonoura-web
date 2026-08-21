import { getAdminClient } from "../_shared/db.ts";
import {
  jsonResponse,
  readJsonObject,
  rejectDisallowedRequest,
} from "../_shared/http.ts";

const ALLOWED_CONTENT_TYPES = new Set([
  "illustration-series",
  "illustration",
  "live2d",
  "works",
  "music-original",
  "music-cover",
  "diary",
]);

function readContentTypes(input: Record<string, unknown>): string[] | null {
  const value = input.content_types;
  if (!Array.isArray(value) || value.length < 1 || value.length > 12) {
    return null;
  }

  const result = [...new Set(value.map((item) => String(item).trim()))];
  if (
    result.length < 1 ||
    result.some((contentType) => !ALLOWED_CONTENT_TYPES.has(contentType))
  ) {
    return null;
  }
  return result;
}

function isWithinWindow(
  publishAt: string | null,
  unpublishAt: string | null,
  now: number,
): boolean {
  const start = publishAt ? Date.parse(publishAt) : Number.NEGATIVE_INFINITY;
  const end = unpublishAt ? Date.parse(unpublishAt) : Number.POSITIVE_INFINITY;
  return now >= start && now < end;
}

Deno.serve(async (request: Request): Promise<Response> => {
  const rejected = rejectDisallowedRequest(request);
  if (rejected) return rejected;

  try {
    const input = await readJsonObject(request);
    if (!input) {
      return jsonResponse(request, { error: "invalid_json" }, 400);
    }

    const contentTypes = readContentTypes(input);
    if (!contentTypes) {
      return jsonResponse(request, { error: "invalid_content_types" }, 400);
    }

    const client = getAdminClient();
    const { data, error } = await client
      .from("content_items")
      .select(
        "content_type, slug, publication_state, publish_at, unpublish_at, sort_order, publication_sections",
      )
      .in("content_type", contentTypes)
      .order("content_type", { ascending: true })
      .order("sort_order", { ascending: true })
      .order("slug", { ascending: true });

    if (error) throw error;

    const now = Date.now();
    const items = (data ?? []).map((item) => {
      const active = isWithinWindow(item.publish_at, item.unpublish_at, now);
      return {
        content_type: item.content_type,
        slug: item.slug,
        publication_state: item.publication_state,
        effective_state: active ? item.publication_state : "hidden",
        publish_at: item.publish_at,
        unpublish_at: item.unpublish_at,
        sort_order: item.sort_order,
        sections: item.publication_sections ?? {},
      };
    });

    return jsonResponse(request, {
      server_time: new Date(now).toISOString(),
      items,
    });
  } catch (error) {
    console.error("get-publication-config failed", error);
    return jsonResponse(request, { error: "internal_error" }, 500);
  }
});
