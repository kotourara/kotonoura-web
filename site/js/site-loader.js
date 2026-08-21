(() => {
    "use strict";

    const PAGE_LABELS = Object.freeze({
        top: "TOP",
        gallery: "GALLERY",
        order: "ORDER",
        music: "MUSIC",
        diary: "DIARY",
        profile: "PROFILE"
    });

    const DEFAULT_CRITICAL_ASSETS = Object.freeze([
        "images/top/top-logo.svg",
        "images/common/header-bg.webp"
    ]);


    const MIN_VISIBLE_MS = 680;
    const MAX_AUTO_WAIT_MS = 7000;
    const IMAGE_WAIT_MS = 4200;
    const TRANSITION_DELAY_MS = 70;

    const state = {
        element: null,
        bar: null,
        percent: null,
        status: null,
        title: null,
        progress: 0,
        startedAt: performance.now(),
        completed: false,
        navigationStarted: false,
        commonReady: null,
    };

    function wait(milliseconds) {
        return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
    }

    function nextPaint() {
        return new Promise((resolve) => {
            window.requestAnimationFrame(() => window.requestAnimationFrame(resolve));
        });
    }

    function pageLabel() {
        return PAGE_LABELS[document.body?.dataset.page || "top"] || "LOADING";
    }

    function loaderColor() {
        const body = document.body;
        const explicit = body?.dataset.loaderColor?.trim();
        if (explicit) return explicit;

        const bodyStyle = body ? getComputedStyle(body) : null;
        const rootStyle = getComputedStyle(document.documentElement);
        return bodyStyle?.getPropertyValue("--site-theme-color").trim()
            || rootStyle.getPropertyValue("--site-theme-color").trim()
            || rootStyle.getPropertyValue("--gallery-accent").trim()
            || "#000";
    }

    function ensureLoader() {
        if (state.element?.isConnected) return state.element;
        if (!document.body) return null;

        const element = document.createElement("div");
        element.className = "site-loader";
        element.setAttribute("role", "status");
        element.setAttribute("aria-live", "polite");
        element.setAttribute("aria-label", "ページを読み込んでいます");
        element.innerHTML = `
            <div class="site-loader__frame">
                <span class="site-loader__guide site-loader__guide--top" aria-hidden="true"></span>
                <span class="site-loader__logo" aria-hidden="true"
                    style="mask-image:url('images/top/top-logo.svg');-webkit-mask-image:url('images/top/top-logo.svg');"></span>
                <div class="site-loader__heading">
                    <span class="site-loader__title" data-site-loader-title></span>
                    <span class="site-loader__percent" data-site-loader-percent>000</span>
                </div>
                <div class="site-loader__track" aria-hidden="true">
                    <span class="site-loader__bar" data-site-loader-bar></span>
                </div>
                <p class="site-loader__status" data-site-loader-status>表示を準備しています</p>
                <span class="site-loader__guide site-loader__guide--bottom" aria-hidden="true"></span>
            </div>
        `;

        document.body.append(element);
        state.element = element;
        state.bar = element.querySelector("[data-site-loader-bar]");
        state.percent = element.querySelector("[data-site-loader-percent]");
        state.status = element.querySelector("[data-site-loader-status]");
        state.title = element.querySelector("[data-site-loader-title]");
        element.style.setProperty("--site-loader-color", loaderColor());
        if (state.title) state.title.textContent = pageLabel();
        return element;
    }

    function update(progress, status) {
        const element = ensureLoader();
        if (!element || state.completed) return;

        const next = Math.max(state.progress, Math.min(100, Math.round(Number(progress) || 0)));
        state.progress = next;
        element.style.setProperty("--site-loader-progress", `${next}%`);
        if (state.percent) state.percent.textContent = String(next).padStart(3, "0");
        if (status && state.status) state.status.textContent = status;
    }

    function showTransition(status = "ページを移動しています") {
        const element = ensureLoader();
        if (!element) return;

        state.completed = false;
        state.progress = 0;
        state.startedAt = performance.now();
        element.hidden = false;
        element.classList.remove("is-complete");
        element.classList.add("is-transition-only");
        element.style.setProperty("--site-loader-color", loaderColor());
        if (state.title) state.title.textContent = "LOADING";
        if (state.percent) state.percent.textContent = "---";
        if (state.status) state.status.textContent = status;
        document.body.classList.add("is-site-loading");
        document.body.setAttribute("aria-busy", "true");
        document.documentElement.classList.add("is-site-transitioning");
    }

    async function complete({ minimumMs = MIN_VISIBLE_MS } = {}) {
        const element = ensureLoader();
        if (!element || state.completed) return;

        element.classList.remove("is-transition-only");
        update(100, "準備が整いました");
        state.completed = true;
        const elapsed = performance.now() - state.startedAt;
        if (elapsed < minimumMs) await wait(minimumMs - elapsed);

        document.body.classList.remove("is-site-loading");
        document.body.removeAttribute("aria-busy");
        document.documentElement.classList.remove("is-site-transitioning");
        element.classList.add("is-complete");
        await wait(380);
        element.hidden = true;
    }

    async function decodeImageElement(image) {
        if (!(image instanceof HTMLImageElement)) return;
        if (image.loading === "lazy") image.loading = "eager";
        image.decoding = "async";

        const ready = typeof image.decode === "function"
            ? image.decode().catch(() => undefined)
            : new Promise((resolve) => {
                if (image.complete) return resolve();
                image.addEventListener("load", resolve, { once: true });
                image.addEventListener("error", resolve, { once: true });
            });

        await Promise.race([ready, wait(IMAGE_WAIT_MS)]);
    }

    function collectCriticalImages() {
        const viewportLimit = Math.max(window.innerHeight * 1.45, 900);
        const images = [...document.images].filter((image) => {
            if (image.closest(".site-loader")) return false;
            if (image.hasAttribute("data-site-deferred")) return false;
            if (image.hasAttribute("data-site-critical")) return true;
            if (image.fetchPriority === "high" || image.getAttribute("fetchpriority") === "high") return true;
            const rect = image.getBoundingClientRect();
            return rect.top < viewportLimit && rect.bottom > -120;
        });
        return [...new Set(images)].slice(0, 18);
    }

    async function preloadUrl(url) {
        const image = new Image();
        image.loading = "eager";
        image.decoding = "async";
        image.src = url;
        const ready = typeof image.decode === "function"
            ? image.decode().catch(() => undefined)
            : new Promise((resolve) => {
                if (image.complete) return resolve();
                image.addEventListener("load", resolve, { once: true });
                image.addEventListener("error", resolve, { once: true });
            });
        await Promise.race([ready, wait(IMAGE_WAIT_MS)]);
    }

    function preloadCommonChrome() {
        if (state.commonReady) return state.commonReady;
        state.commonReady = Promise.allSettled(DEFAULT_CRITICAL_ASSETS.map(preloadUrl));
        return state.commonReady;
    }

    async function waitForFonts() {
        if (!document.fonts?.ready) return;
        await Promise.race([document.fonts.ready, wait(3500)]);
    }

    async function autoLoad() {
        ensureLoader();
        update(8, "ページを組み立てています");
        await nextPaint();

        const images = collectCriticalImages();
        let completedImages = 0;
        const imageTasks = images.map(async (image) => {
            await decodeImageElement(image);
            completedImages += 1;
            const ratio = images.length ? completedImages / images.length : 1;
            update(24 + ratio * 58, "表示領域の素材を読み込んでいます");
        });

        await Promise.race([
            Promise.allSettled([preloadCommonChrome(), waitForFonts(), ...imageTasks]),
            wait(MAX_AUTO_WAIT_MS)
        ]);
        update(92, "表示を整えています");
        await nextPaint();
        await complete();
    }

    function canNavigate(event, anchor) {
        if (!anchor || event.defaultPrevented || state.navigationStarted) return false;
        if (event.button !== 0) return false;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
        if (anchor.hasAttribute("download")) return false;
        if (anchor.target && anchor.target.toLowerCase() !== "_self") return false;

        const rawHref = anchor.getAttribute("href");
        if (!rawHref || rawHref.startsWith("#")) return false;

        const url = new URL(anchor.href, window.location.href);
        if (!/^https?:$/.test(url.protocol) || url.origin !== window.location.origin) return false;

        const current = new URL(window.location.href);
        const sameDocument = url.pathname === current.pathname
            && url.search === current.search
            && Boolean(url.hash);
        return !sameDocument;
    }

    function bindNavigation() {
        document.addEventListener("click", async (event) => {
            const anchor = event.target.closest("a[href]");
            if (!canNavigate(event, anchor)) return;

            event.preventDefault();
            state.navigationStarted = true;
            anchor.classList.remove("is-pressing");
            anchor.classList.add("is-navigating");
            anchor.setAttribute("aria-busy", "true");
            showTransition();
            try {
                sessionStorage.setItem("kotono-ura-transition", "1");
            } catch (_) {
                // Storage拒否時も遷移は続行する。
            }
            await nextPaint();
            await wait(TRANSITION_DELAY_MS);
            window.location.assign(anchor.href);
        });

        window.addEventListener("pageshow", (event) => {
            const returningFromNavigation = event.persisted || state.navigationStarted;
            state.navigationStarted = false;
            document.documentElement.classList.remove("is-site-transitioning");
            document.querySelectorAll(".is-navigating").forEach((element) => {
                element.classList.remove("is-navigating");
                element.removeAttribute("aria-busy");
            });
            if (returningFromNavigation && state.element) {
                state.element.hidden = true;
                state.element.classList.remove("is-transition-only", "is-complete");
                document.body.classList.remove("is-site-loading");
                document.body.removeAttribute("aria-busy");
            }
        });
    }

    function init() {
        if (!document.body) return;
        ensureLoader();
        bindNavigation();
        void preloadCommonChrome();
        update(2, "表示を準備しています");

        const manual = document.body.dataset.loaderMode === "manual";
        if (!manual) void autoLoad();
    }

    window.KotonoUraLoader = Object.freeze({
        update,
        complete,
        showTransition,
        decodeImageElement,
        nextPaint,
        waitForChrome: preloadCommonChrome
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
