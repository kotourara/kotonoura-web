(() => {
    "use strict";

    const API_URL = "https://atmsoeyldykwhnobxiin.supabase.co/functions/v1/get-publication-config";
    const CACHE_KEY = "kotonoura_publication_config_v1";
    const FETCH_TIMEOUT_MS = 4500;
    const CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
    const VALID_STATES = new Set(["hidden", "teaser", "partial", "public", "archived"]);

    function isPlainObject(value) {
        return Boolean(value && typeof value === "object" && !Array.isArray(value));
    }

    function normalizeState(value) {
        const state = value === "published" ? "public" : String(value || "hidden");
        return VALID_STATES.has(state) ? state : "hidden";
    }

    function normalizeSections(value) {
        if (!isPlainObject(value)) return {};
        return Object.fromEntries(
            Object.entries(value)
                .filter(([, enabled]) => typeof enabled === "boolean")
        );
    }

    function normalizeRecord(value) {
        if (!isPlainObject(value)) return null;

        const contentType = String(value.content_type || "").trim();
        const slug = String(value.slug || "").trim();
        if (!contentType || !slug) return null;

        const sortOrder = Number(value.sort_order);
        return {
            contentType,
            slug,
            state: normalizeState(value.effective_state ?? value.publication_state),
            rawState: normalizeState(value.publication_state),
            publishAt: typeof value.publish_at === "string" ? value.publish_at : null,
            unpublishAt: typeof value.unpublish_at === "string" ? value.unpublish_at : null,
            sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
            sections: normalizeSections(value.sections ?? value.publication_sections)
        };
    }

    function recordKey(contentType, slug) {
        return `${contentType}:${slug}`;
    }

    function readCache(contentTypes) {
        try {
            const stored = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
            if (!isPlainObject(stored) || !Array.isArray(stored.items)) return null;
            if (!Number.isFinite(stored.savedAt)) return null;
            if (Date.now() - stored.savedAt > CACHE_MAX_AGE_MS) return null;

            const requested = new Set(contentTypes);
            const items = stored.items
                .map(normalizeRecord)
                .filter((record) => record && requested.has(record.contentType));
            if (!items.length) return null;
            return items;
        } catch (_) {
            return null;
        }
    }

    function writeCache(items) {
        try {
            const current = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
            const byKey = new Map();

            if (isPlainObject(current) && Array.isArray(current.items)) {
                current.items.map(normalizeRecord).filter(Boolean).forEach((record) => {
                    byKey.set(recordKey(record.contentType, record.slug), record);
                });
            }

            items.forEach((record) => {
                byKey.set(recordKey(record.contentType, record.slug), record);
            });

            localStorage.setItem(CACHE_KEY, JSON.stringify({
                savedAt: Date.now(),
                items: [...byKey.values()].map((record) => ({
                    content_type: record.contentType,
                    slug: record.slug,
                    publication_state: record.rawState,
                    effective_state: record.state,
                    publish_at: record.publishAt,
                    unpublish_at: record.unpublishAt,
                    sort_order: record.sortOrder,
                    sections: record.sections
                }))
            }));
        } catch (_) {
            /* 保存できない環境では、そのページ内だけで利用する。 */
        }
    }

    async function fetchRecords(contentTypes) {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content_types: contentTypes }),
                signal: controller.signal
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(data?.error || `HTTP_${response.status}`);
            }
            if (!Array.isArray(data?.items)) {
                throw new Error("invalid_publication_response");
            }

            return data.items.map(normalizeRecord).filter(Boolean);
        } finally {
            window.clearTimeout(timeout);
        }
    }

    async function load(contentTypes) {
        const types = [...new Set(
            (Array.isArray(contentTypes) ? contentTypes : [])
                .map((value) => String(value || "").trim())
                .filter(Boolean)
        )].sort();

        if (!types.length) {
            return { source: "none", records: new Map() };
        }

        try {
            const items = await fetchRecords(types);
            writeCache(items);
            return {
                source: "remote",
                records: new Map(items.map((record) => [
                    recordKey(record.contentType, record.slug),
                    record
                ]))
            };
        } catch (error) {
            const cached = readCache(types);
            if (cached) {
                console.warn("公開設定の取得に失敗したため、直近の設定を使用します。", error);
                return {
                    source: "cache",
                    records: new Map(cached.map((record) => [
                        recordKey(record.contentType, record.slug),
                        record
                    ]))
                };
            }

            console.warn("公開設定を取得できないため、ファイル内の初期設定を使用します。", error);
            return { source: "local", records: new Map() };
        }
    }

    function get(result, contentType, slug) {
        return result?.records?.get(recordKey(contentType, slug)) || null;
    }

    window.KotonoUraPublication = Object.freeze({
        load,
        get,
        normalizeState
    });
})();
