(() => {
    "use strict";

    const DIARY_FAV_STORAGE_KEY = "kotono-ura-diary-favs-v1";
    const DIARY_TRANSITION_MS = 420;

    const DIARY_BACKEND_CONFIG = Object.freeze({
        mode: "supabase", // "local" | "supabase"
        apiBase: "https://atmsoeyldykwhnobxiin.supabase.co/functions/v1",
        endpoints: Object.freeze({
            getFavState: "get-content-state",
            toggleFav: "toggle-reaction"
        })
    });

    const SORT_MODES = ["newest", "oldest", "popular"];
    const SORT_LABELS = {
        newest: "新しい順",
        oldest: "古い順",
        popular: "人気順"
    };

    const RELATED_ICON_PATHS = {
        diary: "images/top/contents/icon-diary-pic.svg",
        gallery: "images/top/contents/icon-gallery-pic.svg",
        music: "images/top/contents/icon-music-pic.svg",
        order: "images/top/contents/icon-order-pic.svg",
        profile: "images/top/contents/icon-profile-pic.svg"
    };

    const AUTHOR_ICON_PATHS = {
        urara: "images/diary/author-urara.svg",
        wimina: "images/diary/author-wimina.svg",
        unknown: "images/diary/author-unknown.svg"
    };

    const FAV_ICON_PATHS = {
        before: "images/gallery/illustration/common/fav-before.svg",
        after: "images/gallery/illustration/common/fav-after.svg"
    };

    const diaryEntries = window.DIARY_DATA?.entries || window.DIARY_ENTRIES;
    let entries = [];
    let entryById = new Map();
    let normalEntries = [];
    let secretEntries = [];

    function rebuildPublishedEntries() {
        entries = window.DIARY_DATA?.getAvailableEntries?.()
            || (Array.isArray(diaryEntries)
                ? diaryEntries.filter((entry) => entry.published !== false)
                : []);
        entryById = new Map(entries.map((entry) => [entry.id, entry]));
        normalEntries = entries.filter((entry) => !entry.secret);
        secretEntries = entries
            .filter((entry) => entry.secret)
            .sort((left, right) =>
                right.date.localeCompare(left.date)
                || left.id.localeCompare(right.id)
            );
    }

    const state = {
        sort: "newest",
        activeId: null,
        placeholder: null,
        openedViaPush: false,
        switching: false,
        needsSortRefresh: false,
        sortRotation: 0,
        favIds: new Set(),
        favCounts: new Map(),
        pendingFavIds: new Set(),
        rowById: new Map()
    };

    const refs = {};

    function wait(duration) {
        return new Promise((resolve) => window.setTimeout(resolve, duration));
    }

    function nextPaint() {
        return new Promise((resolve) => {
            requestAnimationFrame(() => requestAnimationFrame(resolve));
        });
    }

    function prefersReducedMotion() {
        return Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
    }

    function formatDate(value) {
        const [year, month, day] = value.split("-");
        return `${year}.${month}.${day}`;
    }

    function getPopularity(entry) {
        return entry.initialPopularity + (state.favCounts.get(entry.id) || 0);
    }

    function getSortedNormalEntries() {
        const result = [...normalEntries];

        result.sort((left, right) => {
            if (state.sort === "oldest") {
                return left.date.localeCompare(right.date) || left.id.localeCompare(right.id);
            }

            if (state.sort === "popular") {
                return getPopularity(right) - getPopularity(left)
                    || right.date.localeCompare(left.date)
                    || left.id.localeCompare(right.id);
            }

            return right.date.localeCompare(left.date) || left.id.localeCompare(right.id);
        });

        return result;
    }

    function loadLocalFavs() {
        try {
            const stored = JSON.parse(localStorage.getItem(DIARY_FAV_STORAGE_KEY) || "[]");
            if (!Array.isArray(stored)) return new Set();
            return new Set(stored.filter((id) => entryById.has(id)));
        } catch (_) {
            return new Set();
        }
    }

    function saveLocalFavs() {
        try {
            localStorage.setItem(DIARY_FAV_STORAGE_KEY, JSON.stringify([...state.favIds]));
        } catch (_) {
            /* localStorageを使用できない環境では、現在のタブ内だけで状態を維持する。 */
        }
    }

    function visitorId() {
        const key = "kotonoura_visitor_id";
        let value = localStorage.getItem(key);
        if (value) return value;

        value = globalThis.crypto?.randomUUID?.()
            || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;

        localStorage.setItem(key, value);
        return value;
    }

    async function diaryApiRequest(endpoint, payload) {
        const response = await fetch(`${DIARY_BACKEND_CONFIG.apiBase}/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const error = new Error(data?.error || data?.message || "通信に失敗しました。");
            error.code = data?.code || data?.error || `HTTP_${response.status}`;
            error.payload = data;
            throw error;
        }

        return data;
    }

    const localBackend = {
        async getFavState(entry) {
            return {
                favored: state.favIds.has(entry.id),
                favCount: state.favIds.has(entry.id) ? 1 : 0,
                source: "local"
            };
        },

        async toggleFav(entry) {
            if (state.favIds.has(entry.id)) state.favIds.delete(entry.id);
            else state.favIds.add(entry.id);
            saveLocalFavs();

            return {
                favored: state.favIds.has(entry.id),
                favCount: state.favIds.has(entry.id) ? 1 : 0,
                source: "local"
            };
        }
    };

    const supabaseBackend = {
        async getFavState(entry) {
            const response = await diaryApiRequest(
                DIARY_BACKEND_CONFIG.endpoints.getFavState,
                {
                    content_type: entry.contentType || "diary",
                    content_slug: entry.slug || entry.id,
                    visitor_id: visitorId()
                }
            );

            return {
                favored: Boolean(response?.favored),
                favCount: Number.isFinite(response?.fav_count)
                    ? response.fav_count
                    : 0,
                source: "supabase"
            };
        },

        async toggleFav(entry) {
            const response = await diaryApiRequest(
                DIARY_BACKEND_CONFIG.endpoints.toggleFav,
                {
                    target_type: "content",
                    content_type: entry.contentType || "diary",
                    content_slug: entry.slug || entry.id,
                    reaction_type: "fav",
                    visitor_id: visitorId()
                }
            );

            return {
                favored: Boolean(response?.favored ?? response?.active),
                favCount: Number.isFinite(response?.fav_count)
                    ? response.fav_count
                    : Number.isFinite(response?.reaction_count)
                    ? response.reaction_count
                    : 0,
                source: "supabase"
            };
        }
    };

    const backend = DIARY_BACKEND_CONFIG.mode === "supabase"
        ? supabaseBackend
        : localBackend;

    function createRelatedLink(related) {
        const iconPath = RELATED_ICON_PATHS[related.type] || RELATED_ICON_PATHS.diary;
        const link = document.createElement("a");
        link.className = "diary-item__action diary-item__action--related";
        link.href = related.href;
        link.setAttribute("aria-label", related.label || "関連コンテンツを開く");

        if (/^https?:\/\//i.test(related.href)) {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
        }

        const icon = document.createElement("span");
        icon.className = "diary-item__action-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.style.maskImage = `url("${iconPath}")`;
        icon.style.webkitMaskImage = `url("${iconPath}")`;
        link.append(icon);

        return link;
    }

    function updateFavButton(button, entry) {
        const favored = state.favIds.has(entry.id);
        const icon = button.querySelector(".diary-item__action-icon");
        const iconPath = favored ? FAV_ICON_PATHS.after : FAV_ICON_PATHS.before;

        button.setAttribute("aria-pressed", String(favored));
        button.setAttribute("aria-label", favored ? `${entry.title}のfavを解除` : `${entry.title}をfavする`);

        if (icon) {
            icon.style.maskImage = `url("${iconPath}")`;
            icon.style.webkitMaskImage = `url("${iconPath}")`;
        }
    }

    function createEntryRow(entry) {
        const row = document.createElement("article");
        row.className = `diary-item${entry.secret ? " diary-item--secret" : ""}`;
        row.dataset.diaryEntry = entry.id;

        const open = document.createElement("button");
        open.className = "diary-item__open";
        open.type = "button";
        open.dataset.diaryOpen = entry.id;
        open.setAttribute("aria-label", `${entry.title}を読む`);

        const date = document.createElement("time");
        date.className = "diary-item__date";
        date.dateTime = entry.date;
        date.textContent = formatDate(entry.date);

        const title = document.createElement("h2");
        title.className = "diary-item__title";
        title.textContent = entry.title;

        const actions = document.createElement("div");
        actions.className = "diary-item__actions";

        entry.related.forEach((related) => actions.append(createRelatedLink(related)));

        if (!entry.secret) {
            const fav = document.createElement("button");
            fav.className = "diary-item__action diary-item__action--fav";
            fav.type = "button";
            fav.dataset.diaryFav = entry.id;

            const favIcon = document.createElement("span");
            favIcon.className = "diary-item__action-icon";
            favIcon.setAttribute("aria-hidden", "true");
            fav.append(favIcon);
            updateFavButton(fav, entry);
            actions.append(fav);
        }

        const rule = document.createElement("span");
        rule.className = "diary-item__rule";
        rule.setAttribute("aria-hidden", "true");

        row.append(open, date, title, actions, rule);
        state.rowById.set(entry.id, row);
        return row;
    }

    function renderRows() {
        entries.forEach(createEntryRow);
        applySort({ updateUrl: false, animate: false });
        secretEntries.forEach((entry) => refs.secretList.append(state.rowById.get(entry.id)));
    }

    function updateSortUi() {
        const label = SORT_LABELS[state.sort];
        refs.sort.dataset.sort = state.sort;
        refs.sort.style.setProperty(
            "--diary-sort-rotation",
            `${state.sortRotation}deg`
        );
        refs.sort.setAttribute("aria-label", `並び順：${label}`);
        refs.sortLabel.textContent = label;
    }

    function applySort({ updateUrl = true, animate = true } = {}) {
        getSortedNormalEntries().forEach((entry) => {
            const row = state.rowById.get(entry.id);
            if (row && row !== refs.headingHost.firstElementChild) refs.list.append(row);
        });

        updateSortUi();
        state.needsSortRefresh = false;
        if (updateUrl) writeUrl({ entryId: null, mode: "replace" });
    }

    function cycleSort() {
        if (state.activeId || state.switching) return;

        const currentSort = state.sort;
        const index = SORT_MODES.indexOf(currentSort);

        state.sort = SORT_MODES[(index + 1) % SORT_MODES.length];

        /*
        * 新しい順 → 古い順：90度
        * 古い順 → 人気順：90度
        * 人気順 → 新しい順：180度
        *
        * 0 → 90 → 180 → 360度で一周する。
        */
        state.sortRotation += currentSort === "popular" ? 180 : 90;

        applySort();
    }

    function getSequence(entry) {
        return entry.secret ? [...secretEntries] : getSortedNormalEntries();
    }

    function getAdjacentEntry(entry, direction) {
        const sequence = getSequence(entry);
        const index = sequence.findIndex((candidate) => candidate.id === entry.id);
        if (index < 0 || sequence.length === 0) return entry;
        return sequence[(index + direction + sequence.length) % sequence.length];
    }

    function createPlaceholder(row) {
        const placeholder = document.createElement("div");
        placeholder.className = "diary-item-placeholder";
        placeholder.style.height = `${row.getBoundingClientRect().height}px`;
        placeholder.dataset.diaryPlaceholder = row.dataset.diaryEntry;
        row.before(placeholder);
        return placeholder;
    }

    async function scrollElementToCenter(element, behavior = "smooth") {
        if (!element?.isConnected) return;
        const rect = element.getBoundingClientRect();
        const target = Math.max(0, window.scrollY + rect.top - (window.innerHeight - rect.height) / 2);
        const resolvedBehavior = prefersReducedMotion() ? "auto" : behavior;
        window.scrollTo({ top: target, behavior: resolvedBehavior });
        if (resolvedBehavior === "smooth") await wait(360);
        else await nextPaint();
    }

    function setBackgroundInactive(inactive) {
        [refs.header, refs.page, refs.footer].forEach((element) => {
            if (!element) return;
            element.inert = inactive;
            if (inactive) element.setAttribute("data-diary-background-disabled", "");
            else element.removeAttribute("data-diary-background-disabled");
        });
    }

    function setAuthorIcon(entry) {
        const iconPath = AUTHOR_ICON_PATHS[entry.author] || AUTHOR_ICON_PATHS.unknown;
        refs.author.style.maskImage = `url("${iconPath}")`;
        refs.author.style.webkitMaskImage = `url("${iconPath}")`;
        refs.author.setAttribute(
            "aria-label",
            entry.author === "urara" ? "筆者：琴麗等"
                : entry.author === "wimina" ? "筆者：弓可可ヰミナ"
                    : "筆者不明"
        );
    }

    function populateWindow(entry, row) {
        const title = row.querySelector(".diary-item__title");
        title.id = "diary-window-title";
        refs.body.textContent = entry.body;
        setAuthorIcon(entry);

        const previous = getAdjacentEntry(entry, -1);
        const next = getAdjacentEntry(entry, 1);
        refs.prev.setAttribute("aria-label", `前の日記：${previous.title}`);
        refs.next.setAttribute("aria-label", `次の日記：${next.title}`);
    }

    async function animateFromRect(element, fromRect, toRect) {
        if (prefersReducedMotion() || typeof element.animate !== "function") return;

        const scaleX = fromRect.width > 0 && toRect.width > 0 ? fromRect.width / toRect.width : 1;
        const scaleY = fromRect.height > 0 && toRect.height > 0 ? fromRect.height / toRect.height : 1;
        const translateX = fromRect.left - toRect.left;
        const translateY = fromRect.top - toRect.top;

        const animation = element.animate([
            {
                transform: `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`,
                opacity: 0.72,
                transformOrigin: "top left"
            },
            {
                transform: "translate(0, 0) scale(1)",
                opacity: 1,
                transformOrigin: "top left"
            }
        ], {
            duration: DIARY_TRANSITION_MS,
            easing: "cubic-bezier(.2, .72, .2, 1)"
        });

        await animation.finished.catch(() => undefined);
    }

    function writeUrl({ entryId = state.activeId, mode = "replace" } = {}) {
        const url = new URL(window.location.href);

        if (state.sort === "newest") url.searchParams.delete("sort");
        else url.searchParams.set("sort", state.sort);

        if (entryId) url.searchParams.set("entry", entryId);
        else url.searchParams.delete("entry");

        const historyState = {
            ...(history.state || {}),
            diaryOverlay: Boolean(entryId),
            diaryEntry: entryId || null
        };

        if (mode === "push") history.pushState(historyState, "", url);
        else history.replaceState(historyState, "", url);
    }

    async function openEntry(entryId, {
        historyMode = "push",
        scroll = true,
        openedViaPush = historyMode === "push"
    } = {}) {
        const entry = entryById.get(entryId);
        const row = state.rowById.get(entryId);
        if (!entry || !row || state.switching) return;

        if (state.activeId) {
            if (state.activeId !== entryId) await switchEntryTo(entryId, { historyMode });
            return;
        }

        state.switching = true;
        if (scroll) await scrollElementToCenter(row, historyMode === "none" ? "auto" : "smooth");

        const fromRect = row.getBoundingClientRect();
        state.placeholder = createPlaceholder(row);

        refs.window.hidden = false;
        refs.window.setAttribute("aria-hidden", "false");
        refs.article.scrollTop = 0;
        refs.headingHost.append(row);
        row.classList.add("is-expanded");
        populateWindow(entry, row);

        state.activeId = entry.id;
        state.openedViaPush = openedViaPush;
        document.body.classList.add("diary-window-open");
        setBackgroundInactive(true);

        await nextPaint();
        refs.window.classList.add("is-visible");
        const toRect = row.getBoundingClientRect();
        await animateFromRect(row, fromRect, toRect);

        if (historyMode === "push" || historyMode === "replace") {
            writeUrl({ entryId: entry.id, mode: historyMode });
        }

        state.switching = false;
        refs.close.focus({ preventScroll: true });
    }

    function returnActiveRowToList() {
        const row = state.rowById.get(state.activeId);
        if (!row || !state.placeholder) return null;

        const title = row.querySelector(".diary-item__title");
        title.removeAttribute("id");
        row.classList.remove("is-expanded");
        state.placeholder.replaceWith(row);
        state.placeholder = null;
        return row;
    }

    async function closeVisual() {
        if (!state.activeId || state.switching) return;
        state.switching = true;

        const activeId = state.activeId;
        const row = state.rowById.get(activeId);
        const placeholder = state.placeholder;

        if (placeholder?.isConnected) await scrollElementToCenter(placeholder, "smooth");
        const fromRect = row.getBoundingClientRect();

        returnActiveRowToList();
        setBackgroundInactive(false);
        refs.window.classList.remove("is-visible");
        document.body.classList.remove("diary-window-open");

        await nextPaint();
        const toRect = row.getBoundingClientRect();
        await animateFromRect(row, fromRect, toRect);
        await wait(prefersReducedMotion() ? 0 : 260);

        refs.window.hidden = true;
        refs.window.setAttribute("aria-hidden", "true");
        refs.body.textContent = "";
        state.activeId = null;
        state.switching = false;

        if (state.needsSortRefresh) applySort({ updateUrl: false, animate: false });
        row.querySelector("[data-diary-open]")?.focus({ preventScroll: true });
    }

    async function requestClose() {
        if (!state.activeId || state.switching) return;
        const shouldReturnHistory = state.openedViaPush;
        state.openedViaPush = false;
        await closeVisual();

        if (shouldReturnHistory) history.back();
        else writeUrl({ entryId: null, mode: "replace" });
    }

    async function switchEntryTo(entryId, { historyMode = "replace" } = {}) {
        const targetEntry = entryById.get(entryId);
        const targetRow = state.rowById.get(entryId);
        if (!targetEntry || !targetRow || !state.activeId || state.switching) return;

        state.switching = true;
        refs.article.classList.add("is-switching");

        returnActiveRowToList();
        if (state.sort === "popular") applySort({ updateUrl: false, animate: false });

        await scrollElementToCenter(targetRow, "smooth");
        const fromRect = targetRow.getBoundingClientRect();
        state.placeholder = createPlaceholder(targetRow);

        refs.article.scrollTop = 0;
        refs.headingHost.append(targetRow);
        targetRow.classList.add("is-expanded");
        populateWindow(targetEntry, targetRow);
        state.activeId = targetEntry.id;

        await nextPaint();
        refs.article.classList.remove("is-switching");
        const toRect = targetRow.getBoundingClientRect();
        await animateFromRect(targetRow, fromRect, toRect);

        if (historyMode === "replace" || historyMode === "push") {
            writeUrl({ entryId: targetEntry.id, mode: historyMode });
        }

        state.switching = false;
    }

    async function movePager(direction) {
        if (!state.activeId || state.switching) return;
        const current = entryById.get(state.activeId);
        const target = getAdjacentEntry(current, direction);
        await switchEntryTo(target.id, { historyMode: "replace" });
    }

    function refreshPopularityOrder() {
        if (state.sort !== "popular") return;
        if (state.activeId) state.needsSortRefresh = true;
        else applySort({ updateUrl: false, animate: false });
    }

    async function hydrateFavStates() {
        const results = await Promise.allSettled(normalEntries.map(async (entry) => {
            const result = await backend.getFavState(entry);

            if (result.favored) state.favIds.add(entry.id);
            else state.favIds.delete(entry.id);

            state.favCounts.set(
                entry.id,
                Number.isFinite(result.favCount) ? result.favCount : 0
            );

            const button = state.rowById.get(entry.id)?.querySelector("[data-diary-fav]");
            if (button) updateFavButton(button, entry);
        }));

        if (results.some((result) => result.status === "rejected")) {
            console.warn("一部のDiary fav状態を取得できませんでした。");
        }

        refreshPopularityOrder();
    }

    async function handleFav(button) {
        const entry = entryById.get(button.dataset.diaryFav);
        if (!entry || entry.secret || state.pendingFavIds.has(entry.id)) return;

        const previousFavored = state.favIds.has(entry.id);
        const previousCount = state.favCounts.get(entry.id) || 0;
        const optimisticFavored = !previousFavored;
        const optimisticCount = Math.max(
            0,
            previousCount + (optimisticFavored ? 1 : -1)
        );

        state.pendingFavIds.add(entry.id);
        button.disabled = true;

        if (optimisticFavored) state.favIds.add(entry.id);
        else state.favIds.delete(entry.id);
        state.favCounts.set(entry.id, optimisticCount);
        updateFavButton(button, entry);
        refreshPopularityOrder();

        try {
            const result = await backend.toggleFav(entry);

            if (result.favored) state.favIds.add(entry.id);
            else state.favIds.delete(entry.id);

            state.favCounts.set(
                entry.id,
                Number.isFinite(result.favCount)
                    ? result.favCount
                    : optimisticCount
            );

            updateFavButton(button, entry);
            refreshPopularityOrder();
        } catch (error) {
            console.error("Diary favの切替に失敗しました。", error);

            if (previousFavored) state.favIds.add(entry.id);
            else state.favIds.delete(entry.id);

            state.favCounts.set(entry.id, previousCount);
            updateFavButton(button, entry);
            refreshPopularityOrder();
        } finally {
            state.pendingFavIds.delete(entry.id);
            button.disabled = false;
        }
    }

    function applyDiaryFooterAssets() {
        const back = document.querySelector(".site-footer__back");
        const front = document.querySelector(".site-footer__front");
        if (back) back.src = "images/diary/diary-footer-bg.webp";
        if (front) front.src = "images/diary/diary-footer-front.webp";
    }

    function parseUrlState() {
        const url = new URL(window.location.href);
        const sort = url.searchParams.get("sort");
        return {
            sort: SORT_MODES.includes(sort) ? sort : "newest",
            entryId: url.searchParams.get("entry")
        };
    }

    async function restoreFromUrl({ fromPopState = false, historyState = null } = {}) {
        const urlState = parseUrlState();
        if (state.sort !== urlState.sort) {
            state.sort = urlState.sort;
            applySort({ updateUrl: false, animate: false });
        }

        if (urlState.entryId && entryById.has(urlState.entryId)) {
            if (!state.activeId) {
                await openEntry(urlState.entryId, {
                    historyMode: "none",
                    scroll: true,
                    openedViaPush: Boolean(fromPopState && historyState?.diaryOverlay)
                });
            } else if (state.activeId !== urlState.entryId) {
                await switchEntryTo(urlState.entryId, { historyMode: "none" });
            }
            return;
        }

        if (state.activeId) {
            state.openedViaPush = false;
            await closeVisual();
        }
    }

    function bindEvents() {
        refs.sort.addEventListener("click", cycleSort);
        refs.close.addEventListener("click", requestClose);
        refs.pagerClose.addEventListener("click", requestClose);
        refs.prev.addEventListener("click", () => movePager(-1));
        refs.next.addEventListener("click", () => movePager(1));

        refs.window.addEventListener("click", (event) => {
            if (event.target === refs.window) requestClose();
        });

        refs.panel.addEventListener("click", (event) => event.stopPropagation());

        document.addEventListener("click", (event) => {
            const fav = event.target.closest("[data-diary-fav]");
            if (fav) {
                event.preventDefault();
                event.stopPropagation();
                void handleFav(fav);
                return;
            }

            const open = event.target.closest("[data-diary-open]");
            if (open) {
                event.preventDefault();
                void openEntry(open.dataset.diaryOpen);
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && state.activeId) {
                event.preventDefault();
                void requestClose();
            }
        });

        window.addEventListener("popstate", (event) => {
            void restoreFromUrl({ fromPopState: true, historyState: event.state });
        });

        document.addEventListener("common:ready", applyDiaryFooterAssets);
    }

    function cacheRefs() {
        refs.header = document.getElementById("site-header");
        refs.page = document.getElementById("diary-page");
        refs.footer = document.getElementById("site-footer");
        refs.list = document.querySelector("[data-diary-list]");
        refs.secretList = document.querySelector("[data-diary-secret-list]");
        refs.sort = document.querySelector("[data-diary-sort]");
        refs.sortLabel = document.querySelector("[data-diary-sort-label]");
        refs.window = document.querySelector("[data-diary-window]");
        refs.panel = document.querySelector("[data-diary-window-panel]");
        refs.article = refs.window.querySelector(".diary-window__article");
        refs.close = document.querySelector("[data-diary-window-close]");
        refs.headingHost = document.querySelector("[data-diary-heading-host]");
        refs.body = document.querySelector("[data-diary-window-body]");
        refs.author = document.querySelector("[data-diary-window-author]");
        refs.prev = document.querySelector("[data-diary-prev]");
        refs.next = document.querySelector("[data-diary-next]");
        refs.pagerClose = document.querySelector("[data-diary-pager-close]");
    }

    async function init() {
        await (window.DIARY_DATA?.loadPublication?.() || Promise.resolve());
        rebuildPublishedEntries();
        cacheRefs();
        state.favIds = DIARY_BACKEND_CONFIG.mode === "local"
            ? loadLocalFavs()
            : new Set();
        state.sort = parseUrlState().sort;
        renderRows();
        bindEvents();
        applyDiaryFooterAssets();
        void hydrateFavStates();
        await nextPaint();
        await restoreFromUrl();
    }

    init();
})();
