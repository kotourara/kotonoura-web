import { readArtworkSlug } from "./validation.ts";

const CONTENT_TYPE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const REACTION_TYPE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PUBLIC_ID_PATTERN = /^[A-Za-z0-9_-]{8,128}$/;

export type ContentReference = {
  contentType: string;
  contentSlug: string;
};

export function readContentReference(
  input: Record<string, unknown>,
): ContentReference | null {
  const legacyArtworkSlug = readArtworkSlug(input.artwork_slug);
  const contentSlug = readArtworkSlug(input.content_slug) ?? legacyArtworkSlug;

  const rawType = typeof input.content_type === "string"
    ? input.content_type.trim().toLowerCase()
    : legacyArtworkSlug
    ? "illustration"
    : "";

  if (
    !contentSlug ||
    !CONTENT_TYPE_PATTERN.test(rawType) ||
    rawType.length > 40
  ) {
    return null;
  }

  return { contentType: rawType, contentSlug };
}

export function readTargetType(value: unknown): "content" | "comment" | null {
  if (value === "content" || value === "comment") return value;
  return null;
}

export function readReactionType(value: unknown): string | null {
  const reactionType = typeof value === "string"
    ? value.trim().toLowerCase()
    : "fav";

  if (
    !REACTION_TYPE_PATTERN.test(reactionType) ||
    reactionType.length > 32
  ) {
    return null;
  }

  return reactionType;
}

export function readCommentPublicId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const publicId = value.trim();
  if (!PUBLIC_ID_PATTERN.test(publicId)) return null;
  return publicId;
}

export function readLimit(value: unknown, fallback = 30, maximum = 100): number {
  if (typeof value !== "number" || !Number.isInteger(value)) return fallback;
  return Math.max(1, Math.min(maximum, value));
}
