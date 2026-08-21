import { randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import vm from "node:vm";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || "atmsoeyldykwhnobxiin";
const PROJECT_ROOT = process.cwd();
const DIARY_DATA_PATH = path.join(PROJECT_ROOT, "js", "diary-data.js");
const VALIDATE_ONLY = process.argv.includes("--validate-only");
const CHECK_ONLY = process.argv.includes("--check");
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function fail(message, cause) {
    const error = new Error(message, cause ? { cause } : undefined);
    error.isDiarySyncError = true;
    throw error;
}

function isPlainObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function validateDate(value, label) {
    if (!DATE_PATTERN.test(value)) {
        fail(`${label}: dateは YYYY-MM-DD 形式で指定してください。`);
    }

    const date = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
        fail(`${label}: 存在しない日付です（${value}）。`);
    }
}

async function loadDiaryEntries() {
    let source;
    try {
        source = await fs.readFile(DIARY_DATA_PATH, "utf8");
    } catch (error) {
        fail(`日記データを読み込めません: ${DIARY_DATA_PATH}`, error);
    }

    const sandbox = {
        window: {},
        Object,
        Array,
        console: Object.freeze({
            log() {},
            warn() {},
            error() {}
        })
    };

    try {
        vm.createContext(sandbox);
        new vm.Script(source, { filename: DIARY_DATA_PATH }).runInContext(sandbox, {
            timeout: 3000
        });
    } catch (error) {
        fail("diary-data.jsの実行に失敗しました。構文と末尾の区切りを確認してください。", error);
    }

    const entries = sandbox.window.DIARY_ENTRIES;
    if (!Array.isArray(entries)) {
        fail("window.DIARY_ENTRIES が配列として定義されていません。");
    }

    const seenIds = new Set();
    const seenSlugs = new Set();
    const seenPublicIds = new Set();

    return entries.map((rawEntry, index) => {
        const label = `DIARY_ENTRIES[${index}]`;
        if (!isPlainObject(rawEntry)) fail(`${label}: 記事データがオブジェクトではありません。`);

        const entry = { ...rawEntry };
        const requiredTexts = ["id", "slug", "title", "date", "author"];
        for (const field of requiredTexts) {
            if (typeof entry[field] !== "string" || !entry[field].trim()) {
                fail(`${label}: ${field}を空にできません。`);
            }
            entry[field] = entry[field].trim();
        }

        if (seenIds.has(entry.id)) fail(`${label}: id「${entry.id}」が重複しています。`);
        if (seenSlugs.has(entry.slug)) fail(`${label}: slug「${entry.slug}」が重複しています。`);
        seenIds.add(entry.id);
        seenSlugs.add(entry.slug);

        if (!SLUG_PATTERN.test(entry.slug)) {
            fail(`${label}: slug「${entry.slug}」は半角小文字・数字・ハイフンだけで指定してください。`);
        }

        validateDate(entry.date, label);

        if (entry.contentType != null && entry.contentType !== "diary") {
            fail(`${label}: contentTypeは「diary」にしてください。`);
        }

        if (entry.publicId != null && entry.publicId !== "") {
            if (typeof entry.publicId !== "string" || !UUID_PATTERN.test(entry.publicId)) {
                fail(`${label}: publicIdがUUID形式ではありません。省略またはnullでも構いません。`);
            }
            if (seenPublicIds.has(entry.publicId)) {
                fail(`${label}: publicId「${entry.publicId}」が重複しています。`);
            }
            seenPublicIds.add(entry.publicId);
        }

        if (entry.published != null && typeof entry.published !== "boolean") {
            fail(`${label}: publishedはtrueまたはfalseで指定してください。`);
        }
        if (entry.secret != null && typeof entry.secret !== "boolean") {
            fail(`${label}: secretはtrueまたはfalseで指定してください。`);
        }

        const popularity = Number(entry.initialPopularity ?? 0);
        if (!Number.isFinite(popularity) || popularity < 0) {
            fail(`${label}: initialPopularityは0以上の数値にしてください。`);
        }

        if (!Array.isArray(entry.related ?? [])) {
            fail(`${label}: relatedは配列にしてください。`);
        }
        if (typeof entry.body !== "string") {
            fail(`${label}: bodyは文字列で指定してください。`);
        }

        return Object.freeze({
            ...entry,
            contentType: "diary",
            publicId: entry.publicId || null,
            published: entry.published !== false,
            secret: entry.secret === true,
            initialPopularity: popularity,
            related: entry.related ?? []
        });
    });
}

function cliPath() {
    if (process.platform === "win32") {
        return path.join(
            PROJECT_ROOT,
            "node_modules",
            "@supabase",
            "cli-windows-x64",
            "bin",
            "supabase.exe"
        );
    }

    return path.join(PROJECT_ROOT, "node_modules", ".bin", "supabase");
}

function decodeJwtPayload(value) {
    if (typeof value !== "string" || !value.startsWith("eyJ")) return null;

    const parts = value.split(".");
    if (parts.length !== 3) return null;

    try {
        const normalized = parts[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/")
            .padEnd(Math.ceil(parts[1].length / 4) * 4, "=");
        return JSON.parse(Buffer.from(normalized, "base64").toString("utf8"));
    } catch (_) {
        return null;
    }
}

function isUsableSecretKey(value) {
    if (typeof value !== "string" || !value.startsWith("sb_secret_")) return false;
    if (value.includes("...") || value.includes("*") || value.includes("…")) return false;
    return /^sb_secret_[A-Za-z0-9_-]{20,}$/.test(value);
}

function collectKeyCandidates(value, trail = [], output = []) {
    if (Array.isArray(value)) {
        value.forEach((item, index) => collectKeyCandidates(item, [...trail, String(index)], output));
        return output;
    }

    if (!isPlainObject(value)) return output;

    const labels = ["name", "type", "role", "key_type", "description"]
        .map((field) => (typeof value[field] === "string" ? value[field] : ""))
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    for (const [key, item] of Object.entries(value)) {
        if (typeof item === "string" && (item.startsWith("eyJ") || item.startsWith("sb_secret_"))) {
            const jwtPayload = decodeJwtPayload(item);
            const fieldHint = [...trail, key, labels].filter(Boolean).join(" ").toLowerCase();

            output.push({
                value: item,
                hint: fieldHint,
                jwtRole: typeof jwtPayload?.role === "string" ? jwtPayload.role : null,
                usableSecret: isUsableSecretKey(item)
            });
        } else if (isPlainObject(item) || Array.isArray(item)) {
            collectKeyCandidates(item, [...trail, key], output);
        }
    }

    return output;
}

function extractJson(text) {
    const trimmed = text.trim();
    try {
        return JSON.parse(trimmed);
    } catch (_) {
        const starts = [trimmed.indexOf("["), trimmed.indexOf("{")].filter((index) => index >= 0);
        if (!starts.length) fail("Supabase CLIのAPIキー一覧をJSONとして読めませんでした。");
        const start = Math.min(...starts);
        for (let end = trimmed.length; end > start; end -= 1) {
            const candidate = trimmed.slice(start, end).trim();
            try {
                return JSON.parse(candidate);
            } catch (_) {
                // CLIの付加メッセージを末尾から除きながら再試行する。
            }
        }
        fail("Supabase CLIのAPIキー一覧をJSONとして読めませんでした。");
    }
}

async function resolveSupabaseCredentials() {
    const explicitUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
    const explicitKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
    if (explicitUrl && explicitKey) {
        return { url: explicitUrl, key: explicitKey, source: "environment" };
    }

    const executable = cliPath();
    try {
        await fs.access(executable);
    } catch (_) {
        fail(
            "Supabase CLIがプロジェクト内に見つかりません。先に npm.cmd install を実行してください。"
        );
    }

    let stdout;
    try {
        ({ stdout } = await execFileAsync(
            executable,
            [
                "projects",
                "api-keys",
                "--project-ref",
                PROJECT_REF,
                "--output",
                "json"
            ],
            {
                cwd: PROJECT_ROOT,
                windowsHide: true,
                timeout: 30000,
                maxBuffer: 1024 * 1024
            }
        ));
    } catch (error) {
        const stderr = String(error?.stderr || "").trim();
        fail(
            `Supabase CLIからAPIキーを取得できません。必要なら npx.cmd supabase@latest login を再実行してください。${stderr ? `\n${stderr}` : ""}`,
            error
        );
    }

    const candidates = collectKeyCandidates(extractJson(stdout));
    const ranked = candidates
        .map((candidate) => {
            let score = 0;

            // Legacy JWTはペイロードのroleを最優先する。
            if (candidate.jwtRole === "service_role") score += 1000;
            if (candidate.jwtRole === "anon" || candidate.jwtRole === "authenticated") score -= 1000;

            // 新Secret KeyはCLIで伏字になることがあるため、完全な値だけを候補にする。
            if (candidate.value.startsWith("sb_secret_")) {
                score += candidate.usableSecret ? 500 : -1000;
            }

            if (candidate.hint.includes("service_role") || candidate.hint.includes("service-role")) score += 100;
            if (candidate.hint.includes("secret")) score += 40;
            if (candidate.hint.includes("anon") || candidate.hint.includes("publishable")) score -= 200;

            return { ...candidate, score };
        })
        .sort((left, right) => right.score - left.score);

    const selected = ranked.find((candidate) => candidate.score > 0);
    if (!selected) {
        fail(
            "Supabase CLIの一覧から完全なservice_roleまたはSecret Keyを取得できませんでした。" +
            " CLIではSecret Keyが伏字になる場合があります。SUPABASE_SERVICE_ROLE_KEYまたはSUPABASE_SECRET_KEYを環境変数へ設定してください。"
        );
    }

    return {
        url: `https://${PROJECT_REF}.supabase.co`,
        key: selected.value,
        source: "supabase-cli"
    };
}

function buildSupabaseAuthHeaders(credentials) {
    const headers = {
        apikey: credentials.key,
        "User-Agent": "kotono-ura-diary-sync/1.0"
    };

    // 新形式のSecret KeyはJWTではないため、Authorization: Bearerには入れない。
    // Legacy service_role JWTの場合だけAuthorizationにも設定し、RLSを迂回する。
    if (!credentials.key.startsWith("sb_secret_")) {
        headers.Authorization = `Bearer ${credentials.key}`;
    }

    return headers;
}

async function supabaseRequest(credentials, resource, options = {}) {
    const response = await fetch(`${credentials.url}/rest/v1/${resource}`, {
        ...options,
        headers: {
            ...buildSupabaseAuthHeaders(credentials),
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        signal: AbortSignal.timeout(30000)
    });

    const text = await response.text();
    const payload = text ? (() => {
        try {
            return JSON.parse(text);
        } catch (_) {
            return text;
        }
    })() : null;

    if (!response.ok) {
        const detail = typeof payload === "string"
            ? payload
            : payload?.message || payload?.details || JSON.stringify(payload);
        fail(`Supabase APIでエラーが発生しました（${response.status}）: ${detail}`);
    }

    return payload;
}

async function loadExistingDiaryRows(credentials) {
    const query = new URLSearchParams({
        content_type: "eq.diary",
        select: [
            "id",
            "slug",
            "title",
            "publication_state",
            "publish_at",
            "unpublish_at",
            "is_reaction_open",
            "is_comment_open",
            "is_comment_public",
            "is_comment_reaction_open",
            "popularity_seed",
            "metadata"
        ].join(","),
        order: "slug.asc"
    });

    const rows = await supabaseRequest(credentials, `content_items?${query.toString()}`, {
        method: "GET"
    });
    if (!Array.isArray(rows)) fail("Supabaseから日記台帳を配列として取得できませんでした。");
    return rows;
}

function optionalBoolean(entry, field, previous, previousField, fallback) {
    if (typeof entry[field] === "boolean") return entry[field];
    if (previous && typeof previous[previousField] === "boolean") return previous[previousField];
    return fallback;
}

function inheritsGalleryPublication(entry) {
    return Array.isArray(entry.related)
        && entry.related.some((item) => item?.type === "gallery" && item?.href);
}

function defaultDiaryPublishAt(entry) {
    return new Date(`${entry.date}T00:00:00+09:00`).toISOString();
}

function makeSyncRows(entries, existingRows) {
    const existingBySlug = new Map(existingRows.map((row) => [row.slug, row]));
    const publicIdWarnings = [];

    const rows = entries.map((entry, index) => {
        const previous = existingBySlug.get(entry.slug);
        if (previous && entry.publicId && previous.id !== entry.publicId) {
            publicIdWarnings.push(
                `${entry.slug}: diary-data.jsのpublicIdとDBのIDが異なるため、DB側IDを維持しました。`
            );
        }

        const publicationState = entry.published ? "published" : "hidden";
        const publishAt = inheritsGalleryPublication(entry)
            ? previous?.publish_at ?? null
            : previous?.publish_at || defaultDiaryPublishAt(entry);
        const unpublishAt = previous?.unpublish_at ?? null;
        const metadata = {
            ...(isPlainObject(previous?.metadata) ? previous.metadata : {}),
            date: entry.date,
            author: entry.author,
            secret: entry.secret,
            sort_order: (index + 1) * 100
        };

        return {
            id: previous?.id || entry.publicId || randomUUID(),
            content_type: "diary",
            slug: entry.slug,
            title: entry.title,
            publication_state: publicationState,
            publish_at: publishAt,
            unpublish_at: unpublishAt,
            is_reaction_open: optionalBoolean(
                entry,
                "reactionOpen",
                previous,
                "is_reaction_open",
                entry.published && !entry.secret
            ),
            is_comment_open: optionalBoolean(
                entry,
                "commentOpen",
                previous,
                "is_comment_open",
                false
            ),
            is_comment_public: optionalBoolean(
                entry,
                "commentPublic",
                previous,
                "is_comment_public",
                false
            ),
            is_comment_reaction_open: optionalBoolean(
                entry,
                "commentReactionOpen",
                previous,
                "is_comment_reaction_open",
                false
            ),
            popularity_seed: entry.initialPopularity,
            metadata
        };
    });

    return { rows, existingBySlug, publicIdWarnings };
}

function stableJson(value) {
    if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
    if (isPlainObject(value)) {
        return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}`;
    }
    return JSON.stringify(value);
}

function classifyRows(rows, existingBySlug) {
    const inserted = [];
    const updated = [];
    const unchanged = [];

    for (const row of rows) {
        const previous = existingBySlug.get(row.slug);
        if (!previous) {
            inserted.push(row.slug);
            continue;
        }

        const comparablePrevious = {
            id: previous.id,
            content_type: "diary",
            slug: previous.slug,
            title: previous.title,
            publication_state: previous.publication_state,
            publish_at: previous.publish_at ?? null,
            unpublish_at: previous.unpublish_at ?? null,
            is_reaction_open: previous.is_reaction_open,
            is_comment_open: previous.is_comment_open,
            is_comment_public: previous.is_comment_public,
            is_comment_reaction_open: previous.is_comment_reaction_open,
            popularity_seed: Number(previous.popularity_seed),
            metadata: previous.metadata || {}
        };

        if (stableJson(comparablePrevious) === stableJson(row)) unchanged.push(row.slug);
        else updated.push(row.slug);
    }

    return { inserted, updated, unchanged };
}

function printSummary(summary, dbOnly, warnings, mode) {
    console.log(`日記データ: ${summary.inserted.length + summary.updated.length + summary.unchanged.length}件`);
    console.log(`新規登録: ${summary.inserted.length}件`);
    console.log(`更新: ${summary.updated.length}件`);
    console.log(`変更なし: ${summary.unchanged.length}件`);

    if (dbOnly.length) {
        console.log(`DBのみに存在（削除・非公開化はしません）: ${dbOnly.length}件`);
        console.log(`  ${dbOnly.join(", ")}`);
    }

    warnings.forEach((warning) => console.warn(`警告: ${warning}`));

    if (mode === "validate") console.log("検証のみ完了しました。Supabaseには接続していません。");
    else if (mode === "check") console.log("差分確認のみ完了しました。Supabaseは更新していません。");
    else console.log("Supabaseの日記台帳を同期しました。");
}

async function main() {
    const entries = await loadDiaryEntries();

    if (VALIDATE_ONLY) {
        printSummary(
            { inserted: entries.map((entry) => entry.slug), updated: [], unchanged: [] },
            [],
            [],
            "validate"
        );
        return;
    }

    const credentials = await resolveSupabaseCredentials();
    const existingRows = await loadExistingDiaryRows(credentials);
    const { rows, existingBySlug, publicIdWarnings } = makeSyncRows(entries, existingRows);
    const summary = classifyRows(rows, existingBySlug);
    const sourceSlugs = new Set(entries.map((entry) => entry.slug));
    const dbOnly = existingRows
        .map((row) => row.slug)
        .filter((slug) => !sourceSlugs.has(slug));

    if (!CHECK_ONLY && (summary.inserted.length || summary.updated.length)) {
        await supabaseRequest(
            credentials,
            "content_items?on_conflict=content_type,slug",
            {
                method: "POST",
                headers: {
                    Prefer: "resolution=merge-duplicates,return=minimal"
                },
                body: JSON.stringify(rows)
            }
        );
    }

    printSummary(summary, dbOnly, publicIdWarnings, CHECK_ONLY ? "check" : "sync");
}

main().catch((error) => {
    console.error(`同期失敗: ${error.message}`);
    if (!error.isDiarySyncError && error?.stack) console.error(error.stack);
    process.exitCode = 1;
});
