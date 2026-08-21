const VISITOR_ID_PATTERN = /^[A-Za-z0-9_-]{16,128}$/;

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte: number) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function readValidVisitorId(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const visitorId = value.trim();
  if (!VISITOR_ID_PATTERN.test(visitorId)) return null;

  return visitorId;
}

export async function createVisitorHash(
  visitorId: string,
): Promise<string> {
  const secret = Deno.env.get("VISITOR_HASH_SECRET")?.trim();
  if (!secret || secret.length < 32) {
    throw new Error("VISITOR_HASH_SECRET is missing or too short");
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(visitorId),
  );

  return bytesToHex(new Uint8Array(signature));
}
