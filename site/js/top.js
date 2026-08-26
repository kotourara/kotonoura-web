(() => {
    const hero = document.querySelector(".hero");
    const navButton = document.querySelector(".hero__nav-button");
    const lowerVisual = document.querySelector(".lower-visual");
    const lowerHole = document.querySelector(".lower-visual__hole");
    const wiminaImage = document.querySelector(".hero__wimina");
    const navMenu = document.querySelector(".hero-nav-menu");
    const phiLines = Array.from(document.querySelectorAll(".hero__phi-line"));
    const redLayer = document.querySelector(".hero__red-layer");
    const redTextTargets = Array.from(document.querySelectorAll(".hero__eye-text, .hero__identity-text"));

    if (!hero) return;

    let sequenceStarted = false;
    let holeScrollLockTimer = 0;
    let holeScrollLocked = false;
    let lagSoftScroll = window.scrollY;
    let lagMiddleScroll = window.scrollY;
    let lagHeavyScroll = window.scrollY;
    let lagRafId = 0;
    let phiShuffleTimer = 0;
    let phiShuffleRafId = 0;
    let phiIsShuffling = false;
    let phiShowsRandom = false;
    let redIntroTimer = 0;
    let redFlickerTimer = 0;
    let nextRedFlickerAt = 0;

    const phiShuffle = {
        intervalMs: 2800,
        durationMs: 620
    };

    const redLayerIntro = {
        textDelayMs: 520
    };

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const randomDigit = () => String(Math.floor(Math.random() * 10));
    const randomBetween = (min, max) => min + Math.random() * (max - min);
    const phiOriginalLines = phiLines.map((line) => line.textContent || "");

    const makeRandomPhiLine = (text) => Array.from(text).map((char) => {
        if (!/\d/.test(char)) return char;
        return randomDigit();
    }).join("");

    const scramblePhiDigits = () => {
        if (!phiLines.length || phiIsShuffling) return;
        phiIsShuffling = true;

        const targetLines = phiShowsRandom
            ? phiOriginalLines
            : phiOriginalLines.map(makeRandomPhiLine);
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / phiShuffle.durationMs, 1);

            phiLines.forEach((line, lineIndex) => {
                const target = targetLines[lineIndex];
                const nextText = Array.from(target).map((char) => {
                    if (!/\d/.test(char)) return char;
                    if (progress >= 1) return char;
                    return randomDigit();
                }).join("");

                line.textContent = nextText;
            });

            if (progress < 1) {
                phiShuffleRafId = requestAnimationFrame(tick);
            } else {
                phiLines.forEach((line, lineIndex) => {
                    line.textContent = targetLines[lineIndex];
                });
                phiShowsRandom = !phiShowsRandom;
                phiIsShuffling = false;
            }
        };

        phiShuffleRafId = requestAnimationFrame(tick);
    };

    const startPhiDigitShuffle = () => {
        if (!phiLines.length) return;
        window.clearInterval(phiShuffleTimer);
        phiShuffleTimer = window.setInterval(scramblePhiDigits, phiShuffle.intervalMs);
    };

    const startRedLayerIntro = () => {
        if (!redLayer) return;

        hero.classList.add("is-red-layer-ready");

        requestAnimationFrame(() => {
            hero.classList.add("is-red-layer-visible");

            window.clearTimeout(redIntroTimer);
            redIntroTimer = window.setTimeout(() => {
                hero.classList.add("is-red-text-visible");
            }, redLayerIntro.textDelayMs);
        });
    };

    const playRedTextFlicker = () => {
        if (!redTextTargets.length || !hero.classList.contains("is-red-text-visible")) return;

        hero.classList.remove("is-red-text-scroll-flicker");
        void hero.offsetWidth;
        hero.classList.add("is-red-text-scroll-flicker");

        window.clearTimeout(redFlickerTimer);
        redFlickerTimer = window.setTimeout(() => {
            hero.classList.remove("is-red-text-scroll-flicker");
        }, 190);
    };

    const maybePlayRedTextScrollFlicker = () => {
        const now = performance.now();
        if (now < nextRedFlickerAt) return;

        nextRedFlickerAt = now + randomBetween(160, 620);
        if (Math.random() < 0.42) {
            playRedTextFlicker();
        }
    };

    const updateScrollLag = () => {
        const targetScroll = window.scrollY;

        /*
        数値が大きいほど早く追いつく。
        小さいほど遅れる。
        */
        lagSoftScroll += (targetScroll - lagSoftScroll) * 0.18;
        lagMiddleScroll += (targetScroll - lagMiddleScroll) * 0.11;
        lagHeavyScroll += (targetScroll - lagHeavyScroll) * 0.065;

        const softY = clamp((targetScroll - lagSoftScroll) * 0.12, -26, 26);
        const middleY = clamp((targetScroll - lagMiddleScroll) * 0.18, -44, 44);
        const heavyY = clamp((targetScroll - lagHeavyScroll) * 0.26, -70, 70);

        hero.style.setProperty("--lag-soft-y", `${softY.toFixed(2)}px`);
        hero.style.setProperty("--lag-middle-y", `${middleY.toFixed(2)}px`);
        hero.style.setProperty("--lag-heavy-y", `${heavyY.toFixed(2)}px`);

        lagRafId = requestAnimationFrame(updateScrollLag);
    };

    updateScrollLag();
    startPhiDigitShuffle();
    startRedLayerIntro();

    const blockedScrollKeys = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]);

    const preventLockedScroll = (event) => {
        if (!holeScrollLocked) return;
        event.preventDefault();
    };

    const preventLockedKeyScroll = (event) => {
        if (!holeScrollLocked || !blockedScrollKeys.has(event.key)) return;
        event.preventDefault();
    };

    const setHoleScrollLock = (locked) => {
        holeScrollLocked = locked;

        if (locked) {
            window.addEventListener("wheel", preventLockedScroll, { passive: false });
            window.addEventListener("touchmove", preventLockedScroll, { passive: false });
            window.addEventListener("keydown", preventLockedKeyScroll, { passive: false });
            return;
        }

        window.removeEventListener("wheel", preventLockedScroll);
        window.removeEventListener("touchmove", preventLockedScroll);
        window.removeEventListener("keydown", preventLockedKeyScroll);
    };

    const startHoleSequence = () => {
        if (sequenceStarted || !lowerVisual || !lowerHole) return;
        sequenceStarted = true;

        const holeRect = lowerHole.getBoundingClientRect();
        const holeCenterY = holeRect.top + holeRect.height / 2;
        const viewportAnchorY = (window.innerHeight || document.documentElement.clientHeight || 1) / 3;
        const correctedScrollY = window.scrollY + holeCenterY - viewportAnchorY;

        window.scrollTo({ top: correctedScrollY, left: 0, behavior: "auto" });
        setHoleScrollLock(true);

        lowerVisual.classList.remove("is-hole-sequence-played");
        void lowerVisual.offsetWidth;
        lowerVisual.classList.add("is-hole-sequence-played");

        window.clearTimeout(holeScrollLockTimer);
        holeScrollLockTimer = window.setTimeout(() => {
            setHoleScrollLock(false);
        }, 1000);
    };

    const updateHeroScrollEffects = () => {
        hero.style.setProperty("--scroll-y", `${window.scrollY}px`);

        const viewportH = window.innerHeight || document.documentElement.clientHeight || 1;

        if (lowerHole && !sequenceStarted) {
            const holeRect = lowerHole.getBoundingClientRect();
            const holeCenterY = holeRect.top + holeRect.height / 2;
            const viewportAnchorY = viewportH / 3;

            if (holeCenterY <= viewportAnchorY) {
                startHoleSequence();
            }
        }
    };

    updateHeroScrollEffects();

    let ticking = false;

    window.addEventListener("scroll", () => {
        if (ticking) return;

        ticking = true;

        requestAnimationFrame(() => {
            updateHeroScrollEffects();
            maybePlayRedTextScrollFlicker();
            ticking = false;
        });
    }, { passive: true });

    window.addEventListener("resize", updateHeroScrollEffects, { passive: true });

    /*
     * nav 展開時の人物差し替えは別画像なので、通常HEROの読込を優先した後で
     * 先にデコードしておく。展開操作時に通常版のグレースケール状態が残るのを防ぐ。
     */
    const navOpenWiminaSrc = "images/top/Gy_hero-Wimina-m.webp";
    let navOpenWiminaReady = false;
    let navOpenWiminaPreload = null;

    const preloadNavOpenWimina = () => {
        if (navOpenWiminaReady || navOpenWiminaPreload) return;

        const image = new Image();
        navOpenWiminaPreload = image;
        image.decoding = "async";
        image.fetchPriority = "low";

        const markReady = () => {
            navOpenWiminaReady = true;
            if (hero.classList.contains("is-nav-open") && wiminaImage) {
                wiminaImage.src = navOpenWiminaSrc;
            }
        };

        image.addEventListener("load", markReady, { once: true });
        image.src = navOpenWiminaSrc;

        if (typeof image.decode === "function") {
            image.decode().then(markReady).catch(() => {});
        }
    };

    if (wiminaImage?.complete && wiminaImage.naturalWidth > 0) {
        preloadNavOpenWimina();
    } else {
        wiminaImage?.addEventListener("load", preloadNavOpenWimina, { once: true });
    }

    if (navButton) {
        navButton.addEventListener("click", () => {
            const isOpen = navButton.getAttribute("aria-expanded") === "true";
            const nextOpen = !isOpen;
            navButton.setAttribute("aria-expanded", String(nextOpen));
            hero.classList.toggle("is-nav-open", nextOpen);
            document.body.classList.toggle("is-top-nav-open", nextOpen);
            navMenu?.setAttribute("aria-hidden", String(!nextOpen));

            if (wiminaImage) {
                if (nextOpen) preloadNavOpenWimina();
                wiminaImage.src = nextOpen
                    ? navOpenWiminaSrc
                    : "images/top/hero-Wimina-m.webp";
            }
        });
    }
})();

(() => {
    const root = document.querySelector(".top-contents");
    if (!root) return;

    const buttons = Array.from(root.querySelectorAll(".top-contents__icon-button"));
    const box = root.querySelector("[data-content-slide-area]") || root.querySelector(".top-contents__box");
    const copy = root.querySelector("[data-contents-copy]");
    const pager = root.querySelector("[data-contents-pager]");
    const enterLink = root.querySelector("[data-contents-enter]");
    const thumbs = Array.from(root.querySelectorAll("[data-thumb]"));
    const frontLeft = root.querySelector("[data-front-left]");
    const frontRight = root.querySelector("[data-front-right]");
    const lead = root.querySelector(".top-contents__lead");
    const mirror = root.querySelector(".top-contents__lead-mirror");
    const holeMessage = document.querySelector(".top-hole-message p");

    const scrambleChars = "縺荳譁蟆蜊逕繧邱琴裏工房0123456789!?<>/◇◆";
    const autoSlideMs = 4600;
    const frontSlideMs = 360;
    const slideAnimMs = 360;
    const swipeThreshold = 42;

    const defaultHoleMessage = "琴ノ裏工房へようこそ。";
    const defaultLeadMessage = "＞ご用件をお選びください。";
    const glitchedLead = "＞彁彁彁彁彁彁彁彁彁彁彁彁";
    const excuseLead = "＞失礼しました。";

    const categoryOrder = ["gallery", "order", "music", "diary", "profile"];

    /*
     * 画像帯はページ単位の円環として扱う。
     * GalleryだけはLive2D / Illustration / Worksを独立した行先に分ける。
     */
    const contents = [
        {
            id: "gallery-live2d",
            categoryId: "gallery",
            href: "gallery.html",
            label: "Gallery Live2D",
            front: ["作", "品"],
            copy: "制作したLive2D・一枚絵がご覧になれます。<br>どれも非常においしくて素敵です！",
            images: ["images/top/banner/contents-galleryA.webp"]
        },
        {
            id: "gallery-illustration",
            categoryId: "gallery",
            href: "gallery.html?category=illustration",
            label: "Gallery Illustration",
            front: ["作", "品"],
            copy: "制作したLive2D・一枚絵がご覧になれます。<br>どれも非常においしくて素敵です！",
            images: ["images/top/banner/contents-galleryB.webp"]
        },
        {
            id: "gallery-works",
            categoryId: "gallery",
            href: "gallery.html?category=works",
            label: "Gallery Works",
            front: ["作", "品"],
            copy: "制作したLive2D・一枚絵がご覧になれます。<br>どれも非常においしくて素敵です！",
            images: ["images/top/banner/contents-galleryC.webp"]
        },
        {
            id: "order",
            categoryId: "order",
            href: "order.html",
            label: "Order",
            front: ["依", "頼"],
            copy: "主にLive2D制作を承っております。<br>あなたも画面の中に引きこもりませんか？",
            images: ["images/top/banner/contents-order.webp"]
        },
        {
            id: "music",
            categoryId: "music",
            href: "music.html",
            label: "Music",
            front: ["音", "楽"],
            copy: "プロデュース楽曲が視聴できます。<br>耳と共に刺激的な旅へ出かけましょう！",
            images: ["images/top/banner/contents-music.webp"]
        },
        {
            id: "diary",
            categoryId: "diary",
            href: "diary.html",
            label: "Diary",
            front: ["日", "記"],
            copy: "筆者が綴った日常です。<br>なんのとりえもございません。",
            images: ["images/top/banner/contents-diary.webp"]
        },
        {
            id: "profile",
            categoryId: "profile",
            href: "profile.html",
            label: "Profile",
            front: ["人", "物"],
            copy: "私達の中身をご紹介します。<br>おかしく愉快な仲間たちです！",
            images: ["images/top/banner/contents-profile.webp"]
        }
    ];

    let activeIndex = 0;
    let activeSlide = 0;
    let autoTimer = 0;
    let frontTimerA = 0;
    let frontTimerB = 0;
    let slideTimer = 0;
    let leadTimerA = 0;
    let leadTimerB = 0;
    let leadSequenceToken = 0;
    let wheelLocked = false;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerId = null;
    let holeMessageIsFirst = true;
    let leadMessageIsFirst = true;
    const bannerPreloads = [];
    let bannersPreloaded = false;
    let desktopPrevButton = null;
    let desktopNextButton = null;

    const syncDesktopArrowTop = () => {
        if (!box || !desktopPrevButton || !desktopNextButton) return;
        const rect = box.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
        const visible = rect.bottom > viewportHeight * 0.15 && rect.top < viewportHeight * 0.85;
        desktopPrevButton.hidden = !visible;
        desktopNextButton.hidden = !visible;
    };

    const ensureDesktopArrows = () => {
        if (desktopPrevButton || desktopNextButton) return;

        const createArrow = (direction, label, glyph) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = `desktop-section-arrow desktop-section-arrow--${direction}`;
            button.setAttribute("aria-label", label);
            button.textContent = glyph;
            button.hidden = true;
            document.body.append(button);
            return button;
        };

        desktopPrevButton = createArrow("prev", "前のコンテンツ", "◀");
        desktopNextButton = createArrow("next", "次のコンテンツ", "▶");
        desktopPrevButton.addEventListener("click", () => setContent(activeIndex - 1, -1, true));
        desktopNextButton.addEventListener("click", () => setContent(activeIndex + 1, 1, true));
        syncDesktopArrowTop();
    };

    const preloadBannerImages = () => {
        if (bannersPreloaded) return;
        bannersPreloaded = true;

        const urls = [...new Set(contents.flatMap((item) => item.images || []).filter(Boolean))];
        urls.forEach((url) => {
            const image = new Image();
            image.decoding = "async";
            image.fetchPriority = "low";
            image.src = url;
            bannerPreloads.push(image);
        });
    };

    if ("IntersectionObserver" in window) {
        const preloadObserver = new IntersectionObserver((entries, observer) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;
            preloadBannerImages();
            observer.disconnect();
        }, { rootMargin: "120% 0px" });
        preloadObserver.observe(root);
    } else {
        window.addEventListener("load", preloadBannerImages, { once: true });
    }

    const getActiveItem = () => contents[activeIndex];

    const getCircularPos = (index, active, length) => {
        const half = Math.floor(length / 2);
        return ((index - active + length + half) % length) - half;
    };

    const weightedPick = (items) => {
        const total = items.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * total;

        for (const item of items) {
            random -= item.weight;
            if (random <= 0) return item.value;
        }

        return items[items.length - 1]?.value;
    };

    const getTimeHoleMessages = () => {
        const hour = new Date().getHours();
        const messages = [];

        if (hour >= 5 && hour < 11) messages.push("おはようございます");
        if (hour >= 10 && hour < 17) messages.push("こんにちは。");
        if (hour >= 17 && hour < 23) messages.push("こんばんは。");
        if (hour >= 23 || hour < 4) messages.push("夜更かしですね。");
        if (hour >= 20 || hour < 5) messages.push("遅くまでお疲れさまです。");

        return messages;
    };

    const chooseHoleMessage = () => {
        if (holeMessageIsFirst) {
            holeMessageIsFirst = false;
            return defaultHoleMessage;
        }

        const candidates = [
            { value: defaultHoleMessage, weight: 92 },
            { value: "ようこそいらっしゃいました。", weight: 2 },
            { value: "はじめまして。", weight: 2 },
            { value: "お待ちしていました。", weight: 2 },
            { value: "目が合いましたね。", weight: 0.35 },
            { value: "どこかでお会いしましたか？", weight: 0.08 }
        ];

        getTimeHoleMessages().forEach((message) => {
            candidates.push({ value: message, weight: 2 });
        });

        return weightedPick(candidates);
    };

    const chooseLeadMessage = ({ allowGlitch = true } = {}) => {
        if (leadMessageIsFirst) {
            leadMessageIsFirst = false;
            return defaultLeadMessage;
        }

        const candidates = [
            { value: defaultLeadMessage, weight: 48 },
            { value: "＞今日はどうしましたか？", weight: 10 },
            { value: "＞なにかお探しですか？", weight: 10 },
            { value: "＞どうぞごゆっくり。", weight: 10 },
            { value: "＞気になるものはありますか？", weight: 10 },
            { value: "＞お好きな場所へどうぞ。", weight: 10 },
            { value: "＞見たい項目を選んでください。", weight: 10 },
            { value: "＞目が回りそうですよ。", weight: 2.5 },
            { value: "＞指が疲れませんか？", weight: 2.5 },
            { value: "＞ゆっくりしていってね！！！", weight: 0.8 }
        ];

        if (allowGlitch) {
            candidates.push({ value: "__GLITCH__", weight: 0.55 });
        }

        return weightedPick(candidates);
    };

    const flashHoleMessage = () => {
        const messageRoot = holeMessage?.closest(".top-hole-message");
        if (!messageRoot) return;

        messageRoot.classList.remove("is-message-flash");
        void messageRoot.offsetWidth;
        messageRoot.classList.add("is-message-flash");

        window.setTimeout(() => {
            messageRoot.classList.remove("is-message-flash");
        }, 620);
    };

    const scrambleTo = (element, nextText, duration = 360) => {
        if (!element) return;

        const plainText = nextText.replace(/<br\s*\/?>/g, "\n");
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const fixedCount = Math.floor(plainText.length * progress);

            const scrambled = Array.from(plainText).map((char, index) => {
                if (char === "\n") return "<br>";
                if (char === " ") return " ";
                if (index < fixedCount) return char;

                return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            }).join("");

            element.innerHTML = scrambled;

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                element.innerHTML = nextText;
            }
        };

        requestAnimationFrame(tick);
    };

    const setHoleMessage = (message, animate = true) => {
        if (!holeMessage) return;

        const currentText = holeMessage.textContent.trim();
        const nextText = String(message).trim();
        const hasChanged = currentText !== nextText;

        /* 初回描画など、アニメなし指定の時は即時反映 */
        if (!animate) {
            holeMessage.textContent = nextText;
            return;
        }

        /* 同じ文言を引いた時は何もしない */
        if (!hasChanged) {
            return;
        }

        /* 違う文言を引いた時だけシャッフル＋フラッシュ */
        scrambleTo(holeMessage, nextText, 320);
        flashHoleMessage();
    };

    const setLeadMessage = (message, animate = true) => {
        if (lead) {
            if (animate) {
                scrambleTo(lead, message, 260);
            } else {
                lead.textContent = message;
            }
        }

        if (mirror) {
            mirror.textContent = message;
        }
    };

    const playLeadGlitchSequence = () => {
        const token = leadSequenceToken + 1;
        leadSequenceToken = token;

        window.clearTimeout(leadTimerA);
        window.clearTimeout(leadTimerB);

        setLeadMessage(glitchedLead, true);

        leadTimerA = window.setTimeout(() => {
            if (token !== leadSequenceToken) return;
            setLeadMessage(excuseLead, true);
        }, 520);

        leadTimerB = window.setTimeout(() => {
            if (token !== leadSequenceToken) return;
            setLeadMessage(chooseLeadMessage({ allowGlitch: false }), true);
        }, 1040);
    };

    const shuffleSurfaceText = ({ animate = true } = {}) => {
        setHoleMessage(chooseHoleMessage(), animate);

        const nextLead = chooseLeadMessage();
        if (nextLead === "__GLITCH__") {
            playLeadGlitchSequence();
        } else {
            leadSequenceToken += 1;
            window.clearTimeout(leadTimerA);
            window.clearTimeout(leadTimerB);
            setLeadMessage(nextLead, animate);
        }
    };

    const updateIcons = () => {
        const activeCategoryId = getActiveItem().categoryId;
        const activeCategoryIndex = categoryOrder.indexOf(activeCategoryId);

        buttons.forEach((button) => {
            const categoryIndex = categoryOrder.indexOf(button.dataset.contentId);
            const pos = getCircularPos(categoryIndex, activeCategoryIndex, categoryOrder.length);

            button.dataset.pos = String(pos);
            button.setAttribute("aria-selected", String(pos === 0));
        });
    };

    const playIconBurst = () => {
        const activeButton = buttons.find((button) => button.dataset.pos === "0");
        if (!activeButton) return;

        activeButton.classList.remove("is-icon-burst");
        void activeButton.offsetWidth;
        activeButton.classList.add("is-icon-burst");

        window.setTimeout(() => {
            activeButton.classList.remove("is-icon-burst");
        }, 280);
    };

    const updatePager = () => {
        if (!pager) return;

        pager.innerHTML = "";

        for (let i = 0; i < contents.length; i += 1) {
            const dot = document.createElement("span");
            dot.textContent = i === activeIndex ? "u" : "w";
            dot.dataset.pagerIndex = String(i);
            if (i === activeIndex) dot.classList.add("is-active");
            pager.appendChild(dot);
        }
    };

    const updateEnterLink = () => {
        if (!enterLink) return;

        const item = getActiveItem();
        enterLink.href = item.href;
        enterLink.setAttribute("aria-label", `${item.label}へ移動`);
    };

    const setFrontText = (front) => {
        if (frontLeft) frontLeft.textContent = front[0];
        if (frontRight) frontRight.textContent = front[1];
    };

    const slideFrontTo = (front, direction = 1, onSwap = null) => {
        const current = `${frontLeft?.textContent || ""}${frontRight?.textContent || ""}`;
        const next = `${front[0]}${front[1]}`;

        if (current === next) {
            if (typeof onSwap === "function") onSwap();
            return;
        }

        window.clearTimeout(frontTimerA);
        window.clearTimeout(frontTimerB);
        root.classList.remove(
            "is-front-exit",
            "is-front-enter",
            "is-front-enter-active",
            "is-front-to-left",
            "is-front-to-right",
            "is-changing"
        );

        root.classList.add(direction >= 0 ? "is-front-to-left" : "is-front-to-right");
        root.classList.add("is-front-exit");

        frontTimerA = window.setTimeout(() => {
            setFrontText(front);
            if (typeof onSwap === "function") onSwap();
            root.classList.remove("is-front-exit");
            root.classList.add("is-front-enter");

            requestAnimationFrame(() => {
                root.classList.add("is-front-enter-active");
            });
        }, frontSlideMs);

        frontTimerB = window.setTimeout(() => {
            root.classList.remove(
                "is-front-enter",
                "is-front-enter-active",
                "is-front-to-left",
                "is-front-to-right"
            );
        }, frontSlideMs * 2 + 40);
    };

    const playSlideAnimation = (direction) => {
        window.clearTimeout(slideTimer);
        root.classList.remove("is-slide-next", "is-slide-prev");
        void root.offsetWidth;
        root.classList.add(direction < 0 ? "is-slide-prev" : "is-slide-next");

        slideTimer = window.setTimeout(() => {
            root.classList.remove("is-slide-next", "is-slide-prev");
        }, slideAnimMs + 30);
    };

    const renderSlide = ({ animate = true, direction = 1 } = {}) => {
        const item = getActiveItem();

        thumbs.forEach((img, index) => {
            img.src = item.images[index] || item.images[0] || "";
        });

        updatePager();

        if (animate) {
            playSlideAnimation(direction);
        }
    };

    const renderCopy = ({ animate = true } = {}) => {
        if (!copy) return;

        const item = getActiveItem();
        if (animate) {
            scrambleTo(copy, item.copy, 320);
        } else {
            copy.innerHTML = item.copy;
        }
    };

    const startAutoSlide = () => {
        window.clearTimeout(autoTimer);
        if (document.hidden) return;

        autoTimer = window.setTimeout(() => {
            setContent(activeIndex + 1, 1, false);
            startAutoSlide();
        }, autoSlideMs);
    };

    const restartAutoSlide = () => {
        window.clearTimeout(autoTimer);
        startAutoSlide();
    };

    function setContent(nextIndex, direction = 1, manual = false) {
        const normalized = (nextIndex + contents.length) % contents.length;
        if (normalized === activeIndex) return;

        activeIndex = normalized;
        activeSlide = 0;
        renderContent({
            animateFront: true,
            animateText: true,
            frontDirection: direction,
            shuffleText: true
        });

        if (manual) restartAutoSlide();
    }

    const renderContent = ({ animateFront = true, animateText = true, frontDirection = 1, shuffleText = true } = {}) => {
        const item = getActiveItem();
        const currentFront = `${frontLeft?.textContent || ""}${frontRight?.textContent || ""}`;
        const nextFront = `${item.front[0]}${item.front[1]}`;
        const frontChanges = currentFront !== nextFront;

        updateIcons();
        updateEnterLink();

        /*
         * バナー画像は前面文字の内容に依存させず、全ページ間で常にスライドする。
         * Gallery内だけ同じ文字になる場合も、Galleryから他ページへ移る場合も
         * 同じ画像遷移を使用する。
         */
        renderSlide({ animate: animateFront, direction: frontDirection });

        if (animateFront && frontChanges) {
            slideFrontTo(item.front, frontDirection);
        } else if (!animateFront) {
            setFrontText(item.front);
        }

        if (shuffleText) {
            shuffleSurfaceText({ animate: animateText });
        } else {
            setHoleMessage(defaultHoleMessage, false);
            setLeadMessage(defaultLeadMessage, false);
            holeMessageIsFirst = false;
            leadMessageIsFirst = false;
        }

        renderCopy({ animate: animateText });
        playIconBurst();
        restartAutoSlide();
    };

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const categoryId = button.dataset.contentId;
            const clickedIndex = contents.findIndex((item) => item.categoryId === categoryId);
            if (clickedIndex < 0) return;

            const clickedPos = Number(button.dataset.pos || 0);
            if (clickedPos === 0 && getActiveItem().categoryId === categoryId) return;

            setContent(clickedIndex, clickedPos >= 0 ? 1 : -1, true);
        });
    });

    if (pager) {
        pager.addEventListener("click", (event) => {
            const target = event.target.closest("[data-pager-index]");
            if (!target || !pager.contains(target)) return;

            const nextIndex = Number(target.dataset.pagerIndex);
            if (!Number.isFinite(nextIndex) || nextIndex === activeIndex) return;

            const directDistance = nextIndex - activeIndex;
            const wrappedDistance = directDistance > 0
                ? directDistance - contents.length
                : directDistance + contents.length;
            const direction = Math.abs(directDistance) <= Math.abs(wrappedDistance)
                ? (directDistance > 0 ? 1 : -1)
                : (wrappedDistance > 0 ? 1 : -1);
            setContent(nextIndex, direction, true);
        });
    }

    if (box) {
        box.addEventListener("pointerdown", (event) => {
            if (event.target.closest("button, a")) return;
            if (event.pointerType === "mouse" && event.button !== 0) return;

            if (event.pointerType === "mouse") event.preventDefault();

            pointerId = event.pointerId;
            pointerStartX = event.clientX;
            pointerStartY = event.clientY;
            box.setPointerCapture?.(event.pointerId);
        });

        box.addEventListener("pointerup", (event) => {
            if (pointerId !== event.pointerId) return;

            const dx = event.clientX - pointerStartX;
            const dy = event.clientY - pointerStartY;
            pointerId = null;

            if (Math.abs(dx) < swipeThreshold || Math.abs(dx) <= Math.abs(dy)) return;

            setContent(activeIndex + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1, true);
        });

        box.addEventListener("pointercancel", () => {
            pointerId = null;
        });

        box.addEventListener("dragstart", (event) => {
            event.preventDefault();
        });

        box.addEventListener("wheel", (event) => {
            const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
            if (!horizontal || wheelLocked) return;

            event.preventDefault();
            wheelLocked = true;
            setContent(activeIndex + (event.deltaX > 0 ? 1 : -1), event.deltaX > 0 ? 1 : -1, true);

            window.setTimeout(() => {
                wheelLocked = false;
            }, 520);
        }, { passive: false });
    }

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            window.clearTimeout(autoTimer);
        } else {
            startAutoSlide();
        }
    });

    renderContent({ animateFront: false, animateText: false, shuffleText: false });
    ensureDesktopArrows();
    window.addEventListener("scroll", syncDesktopArrowTop, { passive: true });
    window.addEventListener("resize", syncDesktopArrowTop, { passive: true });
    window.addEventListener("load", syncDesktopArrowTop, { once: true });
})();

(() => {
    const root = document.querySelector("[data-top-news-root]");
    const list = root?.querySelector("[data-top-news-list]");
    const empty = root?.querySelector("[data-top-news-empty]");
    const pagination = root?.querySelector("[data-top-news-pagination]");
    const prevButton = root?.querySelector("[data-top-news-prev]");
    const nextButton = root?.querySelector("[data-top-news-next]");
    const pageStatus = root?.querySelector("[data-top-news-page-status]");

    if (!root || !list || !empty) return;

    const source = window.TOP_NEWS_SOURCE || {};
    const pageUpdates = Array.isArray(source.pageUpdates) ? source.pageUpdates : [];
    const manualEntries = Array.isArray(source.manualEntries) ? source.manualEntries : [];
    const pageSize = Math.max(1, Number(source.settings?.pageSize) || 5);
    const previewAll = source.settings?.previewAll === true;
    const showPagerWhenSinglePage = source.settings?.showPagerWhenSinglePage === true;
    let activePage = 0;

    const categoryLabels = {
        site: "SITE",
        gallery: "GALLERY",
        "gallery-illustration": "GALLERY - ILLUSTRATION",
        "gallery-live2d": "GALLERY - LIVE2D",
        "gallery-works-commission": "GALLERY - WORKS(COMMISSION)",
        "gallery-works-personal": "GALLERY - WORKS(PERSONAL)",
        order: "ORDER",
        music: "MUSIC",
        "music-original": "MUSIC - ORIGINAL",
        "music-cover": "MUSIC - COVER",
        diary: "DIARY",
        profile: "PROFILE",
        youtube: "YOUTUBE",
        x: "X",
        streaming: "STREAMING",
        notice: "NOTICE"
    };

    const parseDate = (value) => {
        if (!value) return null;
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    };

    const isExternalUrl = (url) => {
        if (!url) return false;

        try {
            const parsed = new URL(url, window.location.href);
            return parsed.origin !== window.location.origin;
        } catch {
            return false;
        }
    };

    const isValidEntry = (item) => {
        const requiredFields = ["id", "category", "title", "publishAt"];
        const missingFields = requiredFields.filter((field) => !item?.[field]);

        if (missingFields.length > 0) {
            console.warn("TOP NEWS: 必須情報が不足しているため表示しません。", {
                id: item?.id || "(IDなし)",
                missingFields
            });
            return false;
        }

        if (!parseDate(item.publishAt)) {
            console.warn("TOP NEWS: publishAt の日時形式を確認してください。", item.id);
            return false;
        }

        if (item.unpublishAt && !parseDate(item.unpublishAt)) {
            console.warn("TOP NEWS: unpublishAt の日時形式を確認してください。", item.id);
            return false;
        }

        return true;
    };

    const isVisible = (item, now) => {
        if (!isValidEntry(item)) return false;
        if (item.approved === false) return false;
        if (item.status === "draft" || item.status === "archived") return false;

        if (previewAll) {
            return item.status === "published" || item.status === "scheduled";
        }

        const publishAt = parseDate(item.publishAt);
        const unpublishAt = parseDate(item.unpublishAt);

        if (publishAt > now) return false;
        if (unpublishAt && unpublishAt <= now) return false;

        return item.status === "published" || item.status === "scheduled";
    };

    const getSortTime = (item) => parseDate(item.publishAt)?.getTime() || 0;

    const formatDate = (value) => {
        const date = parseDate(value);
        if (!date) return "----.--.--";

        return new Intl.DateTimeFormat("ja-JP", {
            timeZone: "Asia/Tokyo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).format(date).replaceAll("/", ".");
    };

    const normalizedPageUpdates = pageUpdates
        .filter((item) => item?.announce === true && item?.approved !== false)
        .map((item) => ({ ...item, sourceType: "page_update", isExternal: false }));

    const normalizedManualEntries = manualEntries
        .filter((item) => item?.approved !== false)
        .map((item) => ({ ...item, sourceType: "manual" }));

    const allEntries = [...normalizedPageUpdates, ...normalizedManualEntries];
    const duplicateIds = allEntries
        .map((item) => item?.id)
        .filter((id, index, ids) => id && ids.indexOf(id) !== index);

    if (duplicateIds.length > 0) {
        console.warn("TOP NEWS: IDが重複しています。", [...new Set(duplicateIds)]);
    }

    const visibleEntries = allEntries
        .filter((item) => isVisible(item, new Date()))
        .sort((a, b) => {
            const timeDifference = getSortTime(b) - getSortTime(a);
            if (timeDifference !== 0) return timeDifference;

            const orderDifference = (Number(a.order) || 0) - (Number(b.order) || 0);
            if (orderDifference !== 0) return orderDifference;

            return String(a.id || "").localeCompare(String(b.id || ""), "ja");
        });

    const renderEntry = (item) => {
        const listItem = document.createElement("li");
        listItem.className = "hero__news-item";
        listItem.dataset.newsId = item.id || "";
        listItem.dataset.newsSource = item.sourceType;

        const link = document.createElement(item.url ? "a" : "div");
        link.className = "hero__news-link";

        if (item.url) {
            link.href = item.url;

            const external = item.isExternal === true || isExternalUrl(item.url);
            if (external) {
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.classList.add("is-external");
            }
        }

        const meta = document.createElement("span");
        meta.className = "hero__news-meta";

        const date = document.createElement("time");
        date.className = "hero__news-date";
        date.dateTime = item.publishAt || "";
        date.textContent = formatDate(item.publishAt);

        const category = document.createElement("span");
        category.className = "hero__news-category";
        category.textContent = categoryLabels[item.category] || "NOTICE";

        const title = document.createElement("span");
        title.className = "hero__news-entry-title";
        title.textContent = item.title || "";

        meta.append(date, category);
        link.append(meta, title);

        if (item.summary) {
            const summary = document.createElement("span");
            summary.className = "hero__news-summary";
            summary.textContent = item.summary;
            link.append(summary);
        }

        listItem.append(link);
        return listItem;
    };

    const renderPage = () => {
        const pageCount = Math.max(1, Math.ceil(visibleEntries.length / pageSize));
        activePage = Math.min(Math.max(activePage, 0), pageCount - 1);
        const startIndex = activePage * pageSize;
        const pageEntries = visibleEntries.slice(startIndex, startIndex + pageSize);

        list.replaceChildren(...pageEntries.map(renderEntry));

        const hasEntries = visibleEntries.length > 0;
        list.hidden = !hasEntries;
        empty.hidden = hasEntries;

        if (pagination && prevButton && nextButton && pageStatus) {
            pagination.hidden = !hasEntries || (!showPagerWhenSinglePage && pageCount <= 1);
            pageStatus.textContent = `${activePage + 1} / ${pageCount}`;
            prevButton.disabled = activePage <= 0;
            nextButton.disabled = activePage >= pageCount - 1;
        }
    };

    prevButton?.addEventListener("click", () => {
        if (activePage <= 0) return;
        activePage -= 1;
        renderPage();
    });

    nextButton?.addEventListener("click", () => {
        const pageCount = Math.max(1, Math.ceil(visibleEntries.length / pageSize));
        if (activePage >= pageCount - 1) return;
        activePage += 1;
        renderPage();
    });

    renderPage();
})();
