const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CONTROL_AND_INVISIBLE_PATTERN =
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u200B-\u200D\u2060\uFEFF]/g;
const HTML_TAG_PATTERN = /<\s*\/?\s*[a-zA-Z][^>]*>/;
const URL_PATTERN =
  /(?:https?:\/\/|www\.|(?:[a-z0-9-]+\.)+(?:com|net|org|jp|co\.jp|io|me|app|dev|info|xyz|site|online|cloud|ly)\b)/iu;

export type ValidatedComment = {
  displayNameRaw: string;
  bodyRaw: string;
  bodyNormalized: string;
};

export function readArtworkSlug(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const slug = value.trim().toLowerCase();
  if (!SLUG_PATTERN.test(slug) || slug.length > 80) return null;

  return slug;
}

function removeUnsafeInvisibleCharacters(value: string): string {
  return value.replace(CONTROL_AND_INVISIBLE_PATTERN, "");
}

function normalizeLineEndings(value: string): string {
  return value.replace(/\r\n?/g, "\n");
}

function trimEachLine(value: string): string {
  return value
    .split("\n")
    .map((line: string) => line.trim())
    .join("\n")
    .trim();
}

function codePointLength(value: string): number {
  return Array.from(value).length;
}

export function validateCommentInput(
  displayNameValue: unknown,
  bodyValue: unknown,
): { value: ValidatedComment | null; error: string | null } {
  if (
    displayNameValue !== undefined &&
    displayNameValue !== null &&
    typeof displayNameValue !== "string"
  ) {
    return { value: null, error: "invalid_display_name" };
  }

  if (typeof bodyValue !== "string") {
    return { value: null, error: "invalid_body" };
  }

  const displayNameSource =
    typeof displayNameValue === "string" ? displayNameValue : "";

  const displayName = removeUnsafeInvisibleCharacters(
    displayNameSource.normalize("NFKC"),
  ).trim() || "名無しさん";

  const bodyRaw = trimEachLine(
    removeUnsafeInvisibleCharacters(
      normalizeLineEndings(bodyValue).normalize("NFKC"),
    ),
  );

  if (codePointLength(displayName) > 20) {
    return { value: null, error: "display_name_too_long" };
  }

  const bodyLength = codePointLength(bodyRaw);
  if (bodyLength < 1) {
    return { value: null, error: "body_required" };
  }
  if (bodyLength > 80) {
    return { value: null, error: "body_too_long" };
  }

  if (HTML_TAG_PATTERN.test(displayName) || HTML_TAG_PATTERN.test(bodyRaw)) {
    return { value: null, error: "html_not_allowed" };
  }

  if (URL_PATTERN.test(displayName) || URL_PATTERN.test(bodyRaw)) {
    return { value: null, error: "url_not_allowed" };
  }

  // 重複判定用。公開本文とは別に、空白差を吸収した形を保存する。
  const bodyNormalized = bodyRaw
    .replace(/[ \t\u3000]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return {
    value: {
      displayNameRaw: displayName,
      bodyRaw,
      bodyNormalized,
    },
    error: null,
  };
}
