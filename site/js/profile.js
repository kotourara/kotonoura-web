(() => {
    "use strict";

    const resolveAsset = (path) =>
        window.KotonoUraAssets?.resolve?.(path) || path;

    const PROFILE_VIDEO_SOURCE = "movie/profilePV.mp4";
    const REDUCED_MOTION = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const MOBILE_PROFILE_MODE = window.matchMedia?.("(max-width: 1099px), (hover: none), (pointer: coarse)")?.matches ?? false;
    const LOGO_STATIC_SWITCH_LEAD = 180;

    const KOTO_HISTORY = [
        { id: "koto-origin", date: "～", main: "名も無き絵師時代" },
        { id: "koto-2021", date: "2021.06.20", main: "歌い手絵師『琴麗等』デビュー" },
        { id: "koto-live2d", date: "2024.06.01", main: "Live2Dとの邂逅" },
        { id: "koto-vtuber", date: "2024.08.08", main: "VTuber『琴麗等』セルフ受肉" },
        {
            id: "koto-studio",
            date: "2024.08.26",
            main: "琴ノ裏工房　開設",
            side: "『弓可可ヰミナ』\nデータ上の誕生"
        },
        {
            id: "koto-body",
            date: "2025.01.37",
            main: "『弓可可ヰミナ』ボディ完成",
            side: "名も無き霊魂の受肉"
        },
        {
            id: "koto-takeover",
            date: "2024.12.105",
            main: "『琴麗等』のｲ本を乗っ耳又ʓ",
            broken: true
        }
    ];

    const WIMINA_HISTORY = [
        {
            id: "wimina-rvc",
            date: "1999.16.151.0000",
            main: "とっってもかわいい声を手に入れた。\n良い声なのに表に出ないって言うから\n提供してもらったんだ。"
        },
        {
            id: "wimina-anime",
            date: "2034.9.calc(3-3301)",
            main: "Kさんと一緒にアニメをつくって、\nオリジナル曲も完成した。めでたい！！\nうらおじは人脈ないって言ってたけどもう必要十分、最高のひとたちに囲まれていると思う"
        },
        {
            id: "wimina-debut",
            date: "2025.08.26",
            main: "『弓可可ヰミナ』デビュー\nキミ達の頭の中にボクが生まれた日。"
        },
        { id: "wimina-treaty", date: "2025.09.02", main: "琴ヰ平和条約制定" },
        { id: "wimina-split", date: "2026.06.10", main: "分裂" }
    ];

    const TRANSITION_LINES = [
        0.12,
        0.16,
        0.21,
        0.27,
        0.34,
        0.42,
        0.51,
        0.61,
        0.72,
        0.84,
        1.00
    ];

    const refs = {};
    let legendTimeline = null;
    let legendDistancePrevious = 0;
    let layoutFrame = 0;
    let scrollFrame = 0;

    function clamp(value, min = 0, max = 1) {
        return Math.min(max, Math.max(min, value));
    }

    function phase(value, start, end) {
        if (end <= start) return value >= end ? 1 : 0;
        return clamp((value - start) / (end - start));
    }

    function easeOutCubic(value) {
        const inverse = 1 - clamp(value);
        return 1 - inverse * inverse * inverse;
    }

    function easeInOutCubic(value) {
        const progress = clamp(value);
        return progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    }

    function pageUnit() {
        return (refs.page?.getBoundingClientRect().width || 960) / 100;
    }

    function readNumber(element, property, fallback) {
        const value = Number.parseFloat(getComputedStyle(element).getPropertyValue(property));
        return Number.isFinite(value) ? value : fallback;
    }

    function createLegendTimeline() {
        const guide = readNumber(refs.legend, "--legend-guide-scroll", 44);
        const intro = readNumber(refs.legend, "--legend-intro-scroll", 34);
        const lineGap = readNumber(refs.legend, "--legend-line-gap-scroll", 90);
        const lineReveal = readNumber(refs.legend, "--legend-line-reveal-scroll", 24);
        const holdAfterSix = readNumber(refs.legend, "--legend-after-six-hold", 360);
        const align = readNumber(refs.legend, "--legend-align-scroll", 140);
        const holdAfterAlign = readNumber(refs.legend, "--legend-after-align-hold", 180);
        const movieReveal = readNumber(refs.legend, "--legend-movie-reveal-scroll", 55);

        const lineRanges = [[guide, guide + intro]];
        let cursor = guide + intro;

        for (let index = 1; index < 6; index += 1) {
            cursor += lineGap;
            lineRanges.push([cursor, cursor + lineReveal]);
            cursor += lineReveal;
        }

        const sixEnd = lineRanges[5][1];
        const alignStart = sixEnd + holdAfterSix;
        const alignEnd = alignStart + align;
        const movieStart = alignEnd + holdAfterAlign;
        const total = movieStart + movieReveal;

        return {
            guideEnd: guide,
            lineRanges,
            sixEnd,
            alignStart,
            alignEnd,
            movieStart,
            total
        };
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function fixedLineMarkup(text) {
        if (!text) return "";
        return String(text).split("\n")
            .map((line) => `<span class="profile-fixed-line">${escapeHtml(line)}</span>`)
            .join("");
    }

    function renderFixedText(element, text, { decorate = true } = {}) {
        const fragment = document.createDocumentFragment();
        String(text ?? "").split("\n").forEach((line) => {
            const row = document.createElement("span");
            row.className = "profile-fixed-line";
            if (decorate && line.includes("（自称）")) {
                const [before, after = ""] = line.split("（自称）");
                row.append(
                    document.createTextNode(before),
                    Object.assign(document.createElement("span"), {
                        className: "is-self-proclaimed",
                        textContent: "（自称）"
                    }),
                    document.createTextNode(after)
                );
            } else {
                row.textContent = line;
            }
            fragment.append(row);
        });
        element.replaceChildren(fragment);
    }

    function renderBrokenText(text) {
        const characters = Array.from(text)
            .map((char, index) => (
                `<span aria-hidden="true" data-broken-index="${index + 1}">${char}</span>`
            ))
            .join("");

        return `<span class="profile-history-item__broken" aria-label="${text}">${characters}</span>`;
    }

    function createHistoryItem(item, group, index) {
        const main = item.broken ? renderBrokenText(item.main) : fixedLineMarkup(item.main);
        const side = fixedLineMarkup(item.side || "");

        return `
            <article class="profile-history-item profile-history-item--${group}"
                data-profile-history-item
                data-history-id="${item.id}"
                style="--history-delay:${Math.min(index * 45, 180)}ms;">
                <time class="profile-history-item__date">${item.date}</time>
                <span class="profile-history-item__main">${main}</span>
                <span class="profile-history-item__side">${side}</span>
            </article>
        `;
    }

    function renderTimelines() {
        refs.kotoTimeline.innerHTML = KOTO_HISTORY
            .map((item, index) => createHistoryItem(item, "koto", index))
            .join("");

        refs.wiminaTimeline.innerHTML = WIMINA_HISTORY
            .map((item, index) => createHistoryItem(item, "wimina", index))
            .join("");
    }

    function buildCorruption() {
        const fragment = document.createDocumentFragment();
        const columns = 12;
        const rows = 16;
        const parts = [];

        for (let row = 0; row < rows; row += 1) {
            for (let column = 0; column < columns; column += 1) {
                parts.push({
                    className: "profile-legend__corruption-cell",
                    threshold: 0.2 + Math.random() * 0.8,
                    left: column * (100 / columns) - 0.08,
                    top: row * (100 / rows) - 0.08,
                    width: 100 / columns + 0.18,
                    height: 100 / rows + 0.18
                });
            }
        }

        for (let index = 0; index < 48; index += 1) {
            const isDot = index % 3 === 0;
            const width = isDot ? 0.8 + Math.random() * 4 : 6 + Math.random() * 35;
            const height = isDot ? 0.7 + Math.random() * 3 : 0.6 + Math.random() * 4.5;

            parts.push({
                className: "profile-legend__corruption-bar",
                threshold: 0.04 + Math.random() * 0.7,
                left: Math.random() * Math.max(1, 100 - width),
                top: Math.random() * Math.max(1, 100 - height),
                width,
                height
            });
        }

        parts.sort(() => Math.random() - 0.5).forEach((part) => {
            const element = document.createElement("span");
            element.className = part.className;
            element.dataset.corruptionThreshold = part.threshold.toFixed(4);
            element.style.left = `${part.left}%`;
            element.style.top = `${part.top}%`;
            element.style.width = `${part.width}%`;
            element.style.height = `${part.height}%`;
            fragment.append(element);
        });

        refs.corruption.replaceChildren(fragment);
        refs.corruptionParts = [...refs.corruption.children];
    }

    function measureLegendLayout() {
        if (!refs.legendStage || !refs.movie) return;

        legendTimeline = createLegendTimeline();
        refs.legendScroll.style.height = `${legendTimeline.total * pageUnit() + refs.legendStage.offsetHeight}px`;

        const movieTop = refs.movie.offsetTop;
        const finalBottom = movieTop - readNumber(refs.legend, "--legend-movie-gap-value", 4) * pageUnit();

        refs.legendLines.forEach((line) => {
            line.style.transform = "translate3d(0, 0, 0)";
            const startBottom = line.offsetTop + line.offsetHeight;
            line.dataset.finalShift = String(finalBottom - startBottom);
        });
    }

    function triggerGlitch(line) {
        if (!line || REDUCED_MOTION) return;
        line.classList.remove("is-glitching");
        void line.offsetWidth;
        line.classList.add("is-glitching");
        window.setTimeout(() => line.classList.remove("is-glitching"), 560);
    }

    function updateCorruption(progress) {
        refs.corruptionParts.forEach((part) => {
            const threshold = Number.parseFloat(part.dataset.corruptionThreshold || "1");
            part.classList.toggle("is-visible", progress >= threshold);
        });
    }

    function getLegendDistance() {
        if (!refs.legendScroll || !refs.legendStage || !legendTimeline) return 0;

        const scrollY = window.scrollY;
        const top = refs.legendScroll.getBoundingClientRect().top + scrollY;
        const stickyTop = Number.parseFloat(getComputedStyle(refs.legendStage).top) || 0;
        const distancePx = Math.max(0, scrollY + stickyTop - top);

        return clamp(distancePx / pageUnit(), 0, legendTimeline.total);
    }

    function updateLegend() {
        if (!legendTimeline) return;
        const distance = REDUCED_MOTION ? legendTimeline.total : getLegendDistance();

        if (refs.guide) {
            const guideProgress = phase(distance, 0, legendTimeline.guideEnd);
            refs.guide.style.opacity = String(1 - guideProgress);

            const guideFonts = [
                '"PixelMplus10Subset", "DotGothic16", sans-serif',
                '"Hina Mincho", serif',
                '"Yu Mincho Demibold", "YuMincho", "Yu Mincho", serif',
                '"DotGothic16", sans-serif',
                '"Zen Kurenaido", "Yu Gothic", sans-serif'
            ];
            const fontIndex = Math.min(
                guideFonts.length - 1,
                Math.floor(guideProgress * guideFonts.length)
            );
            refs.guide.style.fontFamily = guideFonts[fontIndex];
        }

        const portraitProgress = phase(distance, legendTimeline.lineRanges[0][0], legendTimeline.lineRanges[0][1]);
        refs.portrait.style.opacity = String(portraitProgress);

        const shift = easeInOutCubic(phase(distance, legendTimeline.alignStart, legendTimeline.alignEnd));

        refs.legendLines.forEach((line, index) => {
            const [start, end] = legendTimeline.lineRanges[index];
            const opacity = phase(distance, start, end);
            const finalShift = Number.parseFloat(line.dataset.finalShift || "0");
            line.style.opacity = String(opacity);
            line.style.transform = `translate3d(0, ${finalShift * shift}px, 0)`;
        });

        updateCorruption(phase(
            distance,
            legendTimeline.lineRanges[1][0],
            legendTimeline.sixEnd
        ));

        const movieVisible = distance >= legendTimeline.movieStart;
        refs.legendStage?.classList.toggle("is-movie-visible", movieVisible);

        if (!refs.movie.classList.contains("is-playing")) {
            refs.movie.classList.toggle("is-visible", movieVisible);
        }

        const firstThreshold = legendTimeline.lineRanges[0][0] + 1;
        const sixthThreshold = legendTimeline.lineRanges[5][0] + 1;

        if (legendDistancePrevious < firstThreshold && distance >= firstThreshold) {
            triggerGlitch(refs.legendLines[0]);
        }
        if (legendDistancePrevious < sixthThreshold && distance >= sixthThreshold) {
            triggerGlitch(refs.legendLines[5]);
        }

        legendDistancePrevious = distance;
    }

    function openMovie() {
        if (!refs.movie || refs.movie.classList.contains("is-playing")) return;

        const player = document.createElement("div");
        player.className = "profile-legend__movie is-playing";
        player.setAttribute("aria-label", "弓可可ヰミナ 自己紹介動画");

        const video = document.createElement("video");
        video.className = "profile-legend__movie-video";
        video.src = resolveAsset(PROFILE_VIDEO_SOURCE);
        video.poster = resolveAsset("images/profile/PV-thumbnail.webp");
        video.controls = true;
        video.playsInline = true;
        video.preload = "metadata";
        video.setAttribute("playsinline", "");

        player.append(video);
        refs.movie.replaceWith(player);
        refs.movie = player;
        measureLegendLayout();
        video.play().catch(() => {});
    }

    function updateTransition(transition) {
        const rect = transition.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const progress = REDUCED_MOTION
            ? 1
            : clamp((viewportHeight * 0.92 - rect.top) / (viewportHeight * 0.82 + rect.height * 0.38));
        const eased = easeInOutCubic(progress);
        const baseThickness = 1;
        const slotHeight = rect.height / TRANSITION_LINES.length;
        const variationProgress = phase(eased, 0, 0.72);
        const closeProgress = easeInOutCubic(phase(eased, 0.72, 1));

        transition.querySelectorAll("[data-transition-line]").forEach((line, index) => {
            const ratio = TRANSITION_LINES[index] || 0.5;
            const variedThickness = baseThickness
                + (slotHeight * ratio - baseThickness) * variationProgress;
            const thickness = variedThickness
                + (slotHeight - variedThickness) * closeProgress;

            line.style.setProperty("--transition-scale", String(thickness / baseThickness));
        });
    }

    function updateCharacters() {
        const rect = refs.history.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const progress = REDUCED_MOTION
            ? 1
            : easeOutCubic(clamp((viewportHeight * 0.92 - rect.top) / Math.max(1, rect.height * 0.56)));
        const unit = pageUnit();

        refs.kotoCharacter.style.setProperty("--character-y", `${(1 - progress) * 30 * unit}px`);
        refs.wiminaCharacter.style.setProperty("--character-y", `${(1 - progress) * 48 * unit}px`);
    }

    function decorateSelfProclaimed(element, text) {
        renderFixedText(element, text, { decorate: true });
    }

    function writeText(element, text, delay) {
        return new Promise((resolve) => {
            const characters = Array.from(text);
            let index = 0;
            renderFixedText(element, "", { decorate: false });

            function step() {
                index += 1;
                renderFixedText(element, characters.slice(0, index).join(""), { decorate: false });
                if (index < characters.length) {
                    window.setTimeout(step, delay);
                    return;
                }

                decorateSelfProclaimed(element, text);
                resolve();
            }

            step();
        });
    }

    async function runTypeBlock(block) {
        if (!block || block.dataset.typed === "true") return;
        block.dataset.typed = "true";
        block.classList.add("is-visible");

        const targets = [...block.querySelectorAll("[data-profile-type-text]")];
        if (REDUCED_MOTION) {
            targets.forEach((target) => {
                decorateSelfProclaimed(target, (target.dataset.profileTypeText || "").replace(/\\n/g, "\n"));
            });
            return;
        }

        await new Promise((resolve) => window.setTimeout(resolve, 250));
        for (let index = 0; index < targets.length; index += 1) {
            const target = targets[index];
            const text = (target.dataset.profileTypeText || "").replace(/\\n/g, "\n");
            await writeText(target, text, index === 0 ? 48 : 28);
            await new Promise((resolve) => window.setTimeout(resolve, 130));
        }
    }

    function prepareTypeBlocks() {
        refs.typeBlocks.forEach((block) => {
            block.querySelectorAll("[data-profile-type-text]").forEach((target) => {
                target.textContent = "";
            });
        });

        if (REDUCED_MOTION) {
            refs.typeBlocks.forEach(runTypeBlock);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                runTypeBlock(entry.target);
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.24,
            rootMargin: "0px 0px -8% 0px"
        });

        refs.typeBlocks.forEach((block) => observer.observe(block));
    }

    function observeHistoryItems() {
        const items = [...document.querySelectorAll("[data-profile-history-item]")];
        if (REDUCED_MOTION) {
            items.forEach((item) => item.classList.add("is-visible"));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.3,
            rootMargin: "0px 0px -7% 0px"
        });

        items.forEach((item) => observer.observe(item));
    }   

    function setMask(element, path) {
        if (!element || !path) return;
        const value = `url("${path}")`;
        element.style.maskImage = value;
        element.style.webkitMaskImage = value;
    }

    async function playLogo(logo) {
        if (!logo || logo.dataset.played === "true") return;
        logo.dataset.played = "true";

        const anime = logo.querySelector(".profile-logo__anime");
        const staticLogo = logo.querySelector(".profile-logo__static");
        const duration = Number.parseInt(logo.dataset.logoDuration || "0", 10);
        const animePath = logo.dataset.logoAnime || "";
        const staticPath = resolveAsset(logo.dataset.logoStatic || "");

        setMask(staticLogo, staticPath);

        if (REDUCED_MOTION || MOBILE_PROFILE_MODE || !animePath || duration <= 0) {
            logo.classList.add("is-finished");
            return;
        }

        setMask(anime, `${animePath}?play=${Date.now()}`);
        logo.classList.add("is-playing");

        window.setTimeout(() => {
            logo.classList.add("is-finished");
        }, Math.max(0, duration - LOGO_STATIC_SWITCH_LEAD));

        window.setTimeout(() => {
            logo.classList.remove("is-playing");
            anime.style.removeProperty("mask-image");
            anime.style.removeProperty("-webkit-mask-image");
        }, duration);
    }

    function observeLogos() {
        if (REDUCED_MOTION || MOBILE_PROFILE_MODE) {
            refs.logos.classList.add("is-visible");
            refs.logoItems.forEach(playLogo);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                refs.logos.classList.add("is-visible");
                window.setTimeout(() => {
                    const durations = refs.logoItems.map((logo) =>
                        Number.parseInt(logo.dataset.logoDuration || "0", 10)
                    );
                    const maxDuration = Math.max(0, ...durations);

                    refs.logoItems.forEach((logo, index) => {
                        const delay = Math.max(0, maxDuration - durations[index]);
                        window.setTimeout(() => playLogo(logo), delay);
                    });
                }, 260);
                observer.disconnect();
            });
        }, {
            threshold: 0.32,
            rootMargin: "0px 0px -8% 0px"
        });

        observer.observe(refs.logos);
    }

    function observeConcept() {
        if (!refs.concept) return;

        refs.conceptItems.forEach((item, index) => {
            item.style.setProperty("--concept-delay", `${index * 260}ms`);
        });

        if (REDUCED_MOTION) {
            refs.concept.classList.add("is-visible");
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.disconnect();
            });
        }, {
            threshold: 0.18,
            rootMargin: "0px 0px -10% 0px"
        });

        observer.observe(refs.concept);
    }

    function syncProfileHeaderTheme() {
        if (!refs.header || !refs.legend) return;
        const headerRect = refs.header.getBoundingClientRect();
        const legendRect = refs.legend.getBoundingClientRect();
        const probeY = headerRect.top + headerRect.height * 0.5;
        const dark = legendRect.top <= probeY && legendRect.bottom > probeY;
        document.body.classList.toggle("profile-header-dark", dark);
    }

    function updateScrollDrivenElements() {
        scrollFrame = 0;
        syncProfileHeaderTheme();
        updateLegend();
        refs.transitions.forEach(updateTransition);
        updateCharacters();
    }

    function scheduleScrollUpdate() {
        if (scrollFrame) return;
        scrollFrame = window.requestAnimationFrame(updateScrollDrivenElements);
    }

    function scheduleLayoutUpdate() {
        if (layoutFrame) return;
        layoutFrame = window.requestAnimationFrame(() => {
            layoutFrame = 0;
            measureLegendLayout();
            updateScrollDrivenElements();
        });
    }

    function syncRestoredScrollState() {
        /*
        * ブラウザのスクロール位置復元は、
        * load直後より遅れて完了する場合がある。
        * 複数タイミングで現在位置を再取得する。
        */
        scheduleLayoutUpdate();

        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(scheduleLayoutUpdate);
        });

        window.setTimeout(scheduleLayoutUpdate, 100);
        window.setTimeout(scheduleLayoutUpdate, 320);
    }

    function cacheRefs() {
        refs.header = document.getElementById("site-header");
        refs.page = document.getElementById("profile-page");
        refs.legend = document.querySelector("[data-profile-legend]");
        refs.legendScroll = document.querySelector("[data-profile-legend-scroll]");
        refs.legendStage = document.querySelector("[data-profile-legend-stage]");
        refs.portrait = document.querySelector("[data-profile-legend-portrait]");
        refs.guide = document.querySelector("[data-profile-legend-guide]");
        refs.corruption = document.querySelector("[data-profile-corruption]");
        refs.legendLines = [...document.querySelectorAll("[data-profile-legend-line]")];
        refs.movie = document.querySelector("[data-profile-movie-open]");
        refs.transitions = [...document.querySelectorAll("[data-profile-transition]")];
        refs.history = document.querySelector("[data-profile-history]");
        refs.kotoCharacter = document.querySelector('[data-profile-character="koto"]');
        refs.wiminaCharacter = document.querySelector('[data-profile-character="wimina"]');
        refs.kotoTimeline = document.querySelector('[data-profile-timeline="koto"]');
        refs.wiminaTimeline = document.querySelector('[data-profile-timeline="wimina"]');
        refs.typeBlocks = [...document.querySelectorAll("[data-profile-type-block]")];
        refs.logos = document.querySelector("[data-profile-logos]");
        refs.logoItems = [...document.querySelectorAll("[data-profile-logo]")];
        refs.concept = document.querySelector(".profile-concept");
        refs.conceptItems = [...document.querySelectorAll("[data-profile-concept-item]")];
    }

    function validateRefs() {
        return Boolean(
            refs.page
            && refs.legend
            && refs.legendScroll
            && refs.legendStage
            && refs.portrait
            && refs.corruption
            && refs.movie
            && refs.history
            && refs.kotoCharacter
            && refs.wiminaCharacter
            && refs.kotoTimeline
            && refs.wiminaTimeline
            && refs.logos
        );
    }

    function init() {
        cacheRefs();
        if (!validateRefs()) {
            console.error("Profileページの初期化に必要な要素が見つかりません。", refs);
            return;
        }

        renderTimelines();
        buildCorruption();
        refs.movie.addEventListener("click", openMovie, { once: true });

        prepareTypeBlocks();
        observeHistoryItems();
        observeLogos();
        observeConcept();

        window.addEventListener("scroll", scheduleScrollUpdate, { passive: true });
        window.addEventListener("resize", scheduleLayoutUpdate, { passive: true });
        window.addEventListener("orientationchange", scheduleLayoutUpdate, { passive: true });

        if (document.fonts?.ready) {
            document.fonts.ready
                .then(syncRestoredScrollState)
                .catch(syncRestoredScrollState);
        } else {
            syncRestoredScrollState();
        }

        window.addEventListener("load", syncRestoredScrollState, {
            once: true
        });

        /*
        * 戻る・進むによるbfcache復帰では、
        * scrollイベントが発生しない場合がある。
        */
        window.addEventListener("pageshow", syncRestoredScrollState);

        /*
        * ページ内リンクなどで途中位置へ移動した場合も再計算する。
        */
        window.addEventListener("hashchange", syncRestoredScrollState);

        syncRestoredScrollState();
    }

    init();
})();
