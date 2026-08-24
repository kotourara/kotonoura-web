const ALLOWED_METHODS = "POST, OPTIONS";
const ALLOWED_HEADERS = "authorization, x-client-info, apikey, content-type";

// 正式公開ドメインはコード側でも常時許可する。
// ALLOWED_ORIGINS は localhost / preview URL など追加環境の管理に使う。
const BUILT_IN_ALLOWED_ORIGINS = [
  "https://kotonoura-kobo.com",
  "https://www.kotonoura-kobo.com",
];

function getAllowedOriginRules(): string[] {
  const configured = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
    .split(",")
    .map((value: string) => value.trim())
    .filter((value: string) => value.length > 0);

  return [...new Set([...BUILT_IN_ALLOWED_ORIGINS, ...configured])];
}

function originMatchesRule(origin: string, rule: string): boolean {
  if (origin === rule) return true;

  // Optional controlled wildcard:
  // https://*.example.pages.dev
  if (!rule.includes("*")) return false;

  const escaped = rule
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, "[a-zA-Z0-9-]+");

  return new RegExp(`^${escaped}$`).test(origin);
}

export function getRequestOrigin(request: Request): string | null {
  const value = request.headers.get("origin");
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function isAllowedOrigin(request: Request): boolean {
  const origin = getRequestOrigin(request);
  if (!origin) return false;

  return getAllowedOriginRules().some((rule: string) =>
    originMatchesRule(origin, rule)
  );
}

export function getCorsHeaders(request: Request): HeadersInit {
  const origin = getRequestOrigin(request);
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": ALLOWED_METHODS,
    "Access-Control-Allow-Headers": ALLOWED_HEADERS,
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };

  if (
    origin &&
    getAllowedOriginRules().some((rule: string) =>
      originMatchesRule(origin, rule)
    )
  ) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

export function jsonResponse(
  request: Request,
  body: unknown,
  status = 200,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...getCorsHeaders(request),
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export function optionsResponse(request: Request): Response {
  if (!isAllowedOrigin(request)) {
    return jsonResponse(request, { error: "origin_not_allowed" }, 403);
  }

  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}

export function rejectDisallowedRequest(
  request: Request,
): Response | null {
  if (request.method === "OPTIONS") {
    return optionsResponse(request);
  }

  if (request.method !== "POST") {
    return jsonResponse(request, { error: "method_not_allowed" }, 405);
  }

  if (!isAllowedOrigin(request)) {
    return jsonResponse(request, { error: "origin_not_allowed" }, 403);
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return jsonResponse(request, { error: "invalid_content_type" }, 415);
  }

  return null;
}

export async function readJsonObject(
  request: Request,
): Promise<Record<string, unknown> | null> {
  try {
    const value: unknown = await request.json();
    if (
      typeof value !== "object" ||
      value === null ||
      Array.isArray(value)
    ) {
      return null;
    }
    return value as Record<string, unknown>;
  } catch {
    return null;
  }
}
