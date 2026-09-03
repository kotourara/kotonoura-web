(() => {
    "use strict";

    const IMAGE_BASE = "images/gallery/live2d";
    const MODEL_BASE = `${IMAGE_BASE}/models`;
    const CONTROL_BASE = `${IMAGE_BASE}/control-icons`;
    const SNS_BASE = `${IMAGE_BASE}/sns-icons`;

    const resolveAsset = (path) =>
        window.KotonoUraAssets?.resolve?.(path) || path;

    const assetMetadata = (path) =>
        window.KotonoUraAssets?.metadata?.(path) || null;

    const isRichGalleryMode = () =>
        window.KotonoUraAssets?.isRichDesktop?.() ?? (
            window.matchMedia("(min-width: 1100px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches
        );

    const IMAGE_DECODE_TIMEOUT_MS = 1800;
    const GALLERY_DESIGN_WIDTH = 960;
    const MINI_SLIDE_MS = 780;
    const GALLERY_LOADER_MIN_MS = 420;
    const CATEGORY_LOADER_MIN_MS = 260;
    const GALLERY_PRELOAD_TIMEOUT_MS = 6000;
    const ANIMATED_PRELOAD_TIMEOUT_MS = 15000;
    const TRANSITION_ANIMATION_GRACE_MS = 1400;
    const ILLUSTRATION_FONT_TIMEOUT_MS = 3500;
    const ILLUSTRATION_FONT_STYLESHEET = "https://fonts.googleapis.com/css2?family=Hina+Mincho&family=Mochiy+Pop+One&display=swap";

    const PUBLICATION_VISIBLE_STATES = new Set(["teaser", "partial", "public"]);
    const PUBLICATION_DETAIL_STATES = new Set(["partial", "public"]);

    function publicationIsWithinWindow(publication, now = Date.now()) {
        if (!publication) return false;

        const publishAt = publication.publishAt ? Date.parse(publication.publishAt) : null;
        const unpublishAt = publication.unpublishAt ? Date.parse(publication.unpublishAt) : null;

        if (Number.isFinite(publishAt) && now < publishAt) return false;
        if (Number.isFinite(unpublishAt) && now >= unpublishAt) return false;
        return true;
    }

    function publicationHasState(item, allowedStates) {
        return Boolean(
            item?.publication
            && allowedStates.has(item.publication.state)
            && publicationIsWithinWindow(item.publication)
        );
    }

    /*
     * CSS側に全モデル共通の基準値を置き、ここではモデルごとの差分だけを渡す。
     * card／KV等はwidth、modelは自然サイズへのscaleで差分指定する。
     * modelのX座標は画像中央（正中線）、Y座標は画像上端基準。
     */
    const MEDIA_ADJUSTMENT_VARIABLES = {
        card: {
            width: ["--card-media-adjust-width", "0%"],
            x: ["--card-media-adjust-left", "0%"],
            y: ["--card-media-adjust-top", "0%"]
        },
        mini: {
            width: ["--mini-media-adjust-width", "0%"],
            x: ["--mini-media-adjust-x", "0cqw"],
            y: ["--mini-media-adjust-y", "0cqw"]
        },
        modelClose: {
            scale: ["--model-close-adjust-scale", "0"],
            x: ["--model-close-adjust-x", "0cqw"],
            y: ["--model-close-adjust-y", "0cqw"]
        },
        modelFull: {
            scale: ["--model-full-adjust-scale", "0"],
            x: ["--model-full-adjust-x", "0cqw"],
            y: ["--model-full-adjust-y", "0cqw"]
        },
        logoBg: {
            width: ["--logo-bg-adjust-width", "0cqw"],
            x: ["--logo-bg-adjust-x", "0cqw"],
            y: ["--logo-bg-adjust-y", "0cqw"]
        },
        logoFocus: {
            width: ["--logo-focus-adjust-width", "0cqw"],
            x: ["--logo-focus-adjust-x", "0cqw"],
            y: ["--logo-focus-adjust-y", "0cqw"]
        },
        kvClose: {
            width: ["--kv-close-adjust-width", "0cqw"],
            x: ["--kv-close-adjust-x", "0cqw"],
            y: ["--kv-close-adjust-y", "0cqw"]
        },
        kvFull: {
            width: ["--kv-full-adjust-width", "0cqw"],
            x: ["--kv-full-adjust-x", "0cqw"],
            y: ["--kv-full-adjust-y", "0cqw"]
        },
        viewClose: {
            width: ["--view-close-adjust-width", "0cqw"],
            x: ["--view-close-adjust-x", "0cqw"],
            y: ["--view-close-adjust-y", "0cqw"]
        },
        viewFull: {
            width: ["--view-full-adjust-width", "0cqw"],
            x: ["--view-full-adjust-x", "0cqw"],
            y: ["--view-full-adjust-y", "0cqw"]
        }
    };

    const MODEL_DATA = [
        {
            id: "fd995108-8a7e-4e8f-bf2c-489c415bc8ae",
            type: "live2d",
            slug: "koto-urara",
            folder: "KotoUrara",
            publication: { state: "public", publishAt: null, unpublishAt: null },
            sections: {
                list: true, detail: true, profile: true, model: true,
                kv: true, view: true, logo: true, video: true
            },
            sortOrder: 10,
            color: "#7018B6",
            name: {
                display: "琴 麗等",
                reading: "こと うらら",
                roman: "Koto Urara",
                surname: "Koto",
                given: "Urara",
                initials: "K.U."
            },
            card: {
                face: "KotoUrara-bu-face.webp",
                body: "KotoUrara-bu-body.webp",
                filter: "grayscale(1) contrast(1.12)"
            },
            assets: {
                models: ["KotoUrara-model.webp"],
                logo: "KotoUrara-logo.webp",
                animeLogo: "KotoUrara-anime-logo.webp",
                kv: "KotoUrara-kv.webp",
                kvFg: "KotoUrara-kv-fg.webp",
                kvBg: "KotoUrara-kv-bg.webp",
                view2: "",
                view3: ""
            },
            animeLogo: { fps: 30, frames: 86, hold: 400 },
            profile: {
                birthday: "8/26",
                birthDate: "2002-08-26",
                height: "163cm",
                ageType: "normal",
                details: [
                    ["ファンマーク", "💜🏹"],
                    ["ファンアート", "#うらら図画"],
                    ["ファンネーム", "ご自由にどうぞ"],
                    ["配信タグ", "#うららか配信"],
                    ["呼ばれ方", "ご自由にどうぞ"]
                ],
                flavor: "どうぞよしなに。",
                intro: [
                    { text: "絵を描き、動かし、たまに歌うなんでも屋。" },
                    { text: "人に頼る才能がないため、\nそのぶん努力でなんとかする\n孤独で悲しきサイボーグ。" },
                    { text: "最近はプログラミングにも手を出しており、\nこのサイトが練習であり本番でもある。", kind: "meta" },
                    { text: "つまり今、あなたが見ているこの文章も\n動作確認の一部です。\n不具合を見つけたら教えてください。", kind: "meta", dotText: "動作確認" },
                    { text: "ゆっくりしていってね！！！", kind: "closing" }
                ],
                video: "https://youtu.be/73dIrpYlpR4?si=pd9f-8y5ZvSlJ6VU",
                socials: {
                    x: "https://x.com/KoTo_0_uRaRa",
                    youtube: "https://youtube.com/@KoTo_0_uRaRa"
                }
            },
            /* CSSの共通基準値から外れる分だけを記入する */
            mediaAdjust: {
                card: { width: "-2%", x: "-1%", y: "1%" },
                modelClose: {},
                modelFull: {},
                kvClose: { width: "-1cqw" },
                viewClose: { width: "-2cqw" }
            }
        },
        {
            id: "a6f3b0bb-d675-47ad-90e9-fc17b19bf025",
            type: "live2d",
            slug: "yumikaka-wimina",
            folder: "YumikakaWimina",
            publication: { state: "public", publishAt: null, unpublishAt: null },
            sections: {
                list: true, detail: true, profile: true, model: true,
                kv: true, view: true, logo: true, video: true
            },
            sortOrder: 20,
            color: "#05B9A7",
            name: {
                display: "弓可可 ヰミナ",
                reading: "ゆみかか ゐみな",
                roman: "Yumikaka Wimina",
                surname: "Yumikaka",
                given: "Wimina",
                initials: "Y.W."
            },
            card: {
                face: "YumikakaWimina-bu-face.webp",
                body: "YumikakaWimina-bu-body.webp",
                filter: "grayscale(1) contrast(1.07)"
            },
            assets: {
                models: [
                    "YumikakaWimina-model.webp",
                    "YumikakaWimina-model_2.webp",
                    "YumikakaWimina-model_3.webp",
                    "YumikakaWimina-model_4.webp"
                ],
                logo: "YumikakaWimina-logo.webp",
                animeLogo: "YumikakaWimina-anime-logo.webp",
                kv: "YumikakaWimina-kv.webp",
                kvFg: "YumikakaWimina-kv-fg.webp",
                kvBg: "YumikakaWimina-kv-bg.webp",
                view2: "",
                view3: "YumikakaWimina-3view.webp"
            },
            animeLogo: { fps: 60, frames: 240, hold: 400 },
            profile: {
                birthday: "1/37（2/6）",
                height: "1490mm＋天使の輪",
                ageType: "posthumous",
                ageBaseDate: "2024-02-06",
                details: [
                    ["ファンマーク", "👻🏹"],
                    ["ファンアート", "#ゐみなあーと"],
                    ["ファンネーム", "ミナの者"],
                    ["配信タグ", "#ゆうれいはゐしん"],
                    ["呼ばれ方", "ミナティ、ヰミナちゃん"],
                    ["本名", "sakurayashiki", "secret"]
                ],
                flavor: "こんミナティ！！！！！",
                intro: [
                    { text: "自称、現役地縛霊の少女。" },
                    { text: "正体不明といわれる\n幽霊文字「彁」に\n魂が宿ったすがた。" },
                    { text: "親友Kのアイデアをもとに、\n琴麗等の手によって生まれた。" },
                    { text: "のちに制作者の身体を乗っ取り\nなんやかんやあったが、\n今はアトリエ「琴ノ裏工房」の\n看板娘として現世を漂っている。" }
                ],
                video: "https://youtu.be/lJrJPeAtutg?si=y7UkwBuuSDNNmEHo",
                socials: {
                    x: "https://x.com/Yumikaka_WM",
                    youtube: "https://youtube.com/@KoTo_0_uRaRa"
                }
            },
            profileVariants: {
                3: {
                    name: {
                        display: "傘おじ",
                        reading: "かさおじ",
                        roman: "Umbrelluncle"
                    },
                    birthday: "???",
                    height: "約120cm",
                    showAge: false,
                    details: [],
                    flavor: "",
                    intro: [
                        { text: "弓可可ヰミナに仕える\n執事 兼、舞台装置。" },
                        { text: "用途に応じて変幻自在に\nすがたかたちを変える。" },
                        { text: "私が幽霊であることを\n思い出させてくれる形見の品。" }
                    ],
                    video: "",
                    socials: {}
                }
            },
            /* CSSの共通基準値から外れる分だけを記入する */
            mediaAdjust: {
                card: { width: "2%", x: "1%", y: "-2%" },
                modelClose: {},
                modelFull: {},
                logoBg: { width: "2cqw", x: "-1cqw" },
                logoFocus: { width: "1cqw", y: "-1cqw" },
                kvClose: { width: "1cqw", y: "-1cqw" },
                kvFull: { width: "1cqw", y: "-1cqw" },
                viewClose: { width: "3cqw", y: "-1cqw" },
                viewFull: { width: "1cqw" }
            }
        },
        {
            id: "cf245cdc-4b92-4cb8-a280-4e15306c90bc",
            type: "live2d",
            slug: "tsuchino-nono",
            folder: "TsuchinoNono",
            publication: { state: "public", publishAt: null, unpublishAt: null },
            sections: {
                list: true, detail: true, profile: true, model: true,
                kv: true, view: true, logo: true, video: true
            },
            sortOrder: 30,
            color: "#C2375A",
            name: {
                display: "土野 のの",
                reading: "つちの のの",
                roman: "Tsuchino Nono",
                surname: "Tsuchino",
                given: "Nono",
                initials: "T.N."
            },
            card: {
                face: "TsuchinoNono-bu-face.webp",
                body: "TsuchinoNono-bu-body.webp",
                filter: "grayscale(1) contrast(1.08)"
            },
            assets: {
                models: ["TsuchinoNono-model.webp", "TsuchinoNono-model_2.webp"],
                logo: "",
                animeLogo: "",
                kv: "",
                kvFg: "",
                kvBg: "",
                view2: "",
                view3: ""
            },
            animeLogo: null,
            profile: {
                birthday: "5/3",
                height: "157cm",
                ageType: "text",
                age: "齢200",
                details: [
                    ["ファンマーク", "なし"],
                    ["ファンアート", "#つちのーと"],
                    ["ファンネーム", "チーム歯磨き粉"],
                    ["配信タグ", "#つちのこ出現中"],
                    ["呼ばれ方", "呼びよきように"],
                    ["好きなホラゲ", "Shadow Corridor"],
                    ["好きな食べ物", "おにぎり、いちじく"],
                    ["武装", "バール"],
                    ["好奇心", "怪異に近づく程度"],
                    ["特殊能力", "ジャンプスケア無効"],
                    ["常時デバフ", "深刻な迷子"]
                ],
                flavor: "見つけたあなたは、運がいい。",
                intro: [
                    { text: "あなた史上\nいちばん珍しい生きものになりたい\nつちのこのVTuber＆Vsinger。" },
                    { text: "ホラーゲームと歌をメインに活動中。" },
                    { text: "バールを片手に、今日も怪異を追いかける。\n「ジャンプスケア無効の心臓」×「深刻な迷子」\nをあわせ持つ、無類のホラゲ好き。" },
                    { text: "マイクを握れば、\n歌の世界をまるごと届けるVsinger。\n「全曲オリジナル歌詞演出」×「感情を描く表現力」で、\n一曲ごとに違う景色を描きます。" },
                    { text: "希少種につき、記憶への定着率高め。\n見つけたら、どうぞ覚えて帰ってください。" }
                ],
                video: "https://youtu.be/xvjiBqXhtDs?si=vU-qi2eCnOAlk5hh",
                socials: {
                    x: "https://x.com/Tsuchino_Nono",
                    youtube: "https://youtube.com/@Tsuchinonono"
                }
            },
            /* CSSの共通基準値から外れる分だけを記入する */
            mediaAdjust: {
                card: { width: "2%", x: "2%", y: "-1%" },
                modelClose: {},
                modelFull: {}
            }
        },
        {
            id: "54a019d0-5f02-4967-a667-54ab745d1aeb",
            type: "live2d",
            slug: "tokimiya",
            folder: "TokimiyaRyuzu",
            publication: { state: "teaser", publishAt: null, unpublishAt: null },
            sections: {
                list: true, detail: false, profile: false, model: false,
                kv: false, view: false, logo: false, video: false
            },
            sortOrder: 40,
            color: "#7AB316",
            name: {
                display: "時宮 リュズ",
                reading: "ときみや りゅず",
                roman: "Tokimiya Ryuzu",
                surname: "Tokimiya",
                given: "Ryuzu",
                initials: "T.R."
            },
            card: {
                face: "TokimiyaRyuzu-bu-face.webp",
                body: "TokimiyaRyuzu-bu-body.webp"
            },
            assets: {
                models: ["TokimiyaRyuzu-model.webp", "TokimiyaRyuzu-model_2.webp"],
                logo: "TokimiyaRyuzu-logo.webp",
                animeLogo: "TokimiyaRyuzu-anime-logo.webp",
                kv: "TokimiyaRyuzu-kv.webp",
                kvFg: "",
                kvBg: "TokimiyaRyuzu-kv-bg.webp",
                view2: "TokimiyaRyuzu-2view.webp",
                view3: ""
            },
            animeLogo: { fps: 30, frames: 101, hold: 400 },
            profile: {
                birthday: "6/10",
                height: "155cm＋歯車",
                ageType: "text",
                age: "付喪神歴不詳",
                details: [
                    ["ファンマーク", "🕰⚙"],
                    ["ファンアート", "#時宮絵図"],
                    ["ファンネーム", "持ち主"],
                    ["呼ばれ方", "お好きなように"]
                ],
                flavor: "今日も変わらずここに。",
                intro: [
                    { text: "壊れた懐中時計に宿る付喪神。" },
                    { text: "歯車は動いているが針はなく\n正確な時刻を示すことはできない。" },
                    { text: "人間の感情に興味があり\nかつての持ち主たちの面影をなぞるように\nさまざまな声で語りかける。" },
                    { text: "手に取ったあなたのお守りとして\n正しい時刻の代わりに\nただ傍で音を刻み続けている。" }
                ],
                video: "",
                socials: {
                    x: "https://x.com/Tokimiya_Ryuzu"
                }
            },
            mediaAdjust: {
                card: {},
                modelClose: {},
                modelFull: {},
                kvClose: { x: "-4cqw" }
            }
        }
    ];

    const CONTENT_ORDER = ["model", "kv", "view", "logo"];

    const state = {
        category: "live2d",
        view: "list",
        activeModelIndex: 0,
        activeContent: "model",
        modelVariantIndex: 0,
        zoomedOut: false,
        kvBackgroundVisible: true,
        profileExpanded: false,
        controlsCollapsed: false,
        viewPan: 0,
        viewMagnified: false,
        viewDragX: 0,
        viewDragY: 0,
        transitioning: false,
        pendingModelIndex: null,
        changeRotation: 0,
        mediaTransitionToken: 0,
        controlsRenderToken: 0,
        miniParkedSide: "right",
        miniAnimationToken: 0,
        modelSwitchToken: 0,
        modelActionBusy: false,
        pendingControl: null
    };

    const refs = {};
    let modelParallaxFrame = 0;
    const imageAssetCache = new Map();
    const prefetchedAssetCache = new Map();
    const animatedAssetCache = new Map();
    const categoryAssetLoads = new Map();
    const loadedCategories = new Set();
    const modelWarmTasks = new Map();
    const publicationCategoryLoads = new Map();
    const hydratedPublicationCategories = new Set();
    let illustrationFontTask = null;
    let illustrationRuntimeReady = false;
    let worksRuntimeReady = false;
    let categorySwitchToken = 0;
    let pointerRequestedCategory = "";
    let pointerRequestResetTimer = 0;


    function modelDesktopPath(model, filename) {
        return filename ? `${MODEL_BASE}/${model.folder}/${filename}` : "";
    }

    function modelPath(model, filename) {
        const desktopPath = modelDesktopPath(model, filename);
        return desktopPath ? resolveAsset(desktopPath) : "";
    }

    function isMobileGalleryMode() {
        return window.KotonoUraAssets?.isMobile?.() ?? !isRichGalleryMode();
    }

    function modelDisplayPath(model, filename, full = state.zoomedOut) {
        const desktopPath = modelDesktopPath(model, filename);
        if (!desktopPath) return "";
        if (!isMobileGalleryMode() || !/-model(?:_\d+)?\.webp$/i.test(filename || "")) {
            return resolveAsset(desktopPath);
        }
        if (full) return resolveAsset(desktopPath);
        return `images/mobile/gallery/live2d/models/${model.folder}/close/${filename}`;
    }

    function modelOriginalWidth(model, filename) {
        const desktopPath = modelDesktopPath(model, filename);
        const metadata = assetMetadata(desktopPath);
        return metadata?.originalWidth || null;
    }

    function wait(duration) {
        return new Promise((resolve) => window.setTimeout(resolve, duration));
    }

    function absoluteAssetUrl(url) {
        if (!url) return "";
        try {
            return new URL(url, document.baseURI).href;
        } catch (_) {
            return url;
        }
    }

    async function decodeImage(image) {
        image.loading = "eager";
        image.decoding = "async";
        image.fetchPriority = "high";

        const source = absoluteAssetUrl(image.currentSrc || image.getAttribute("src") || image.src);
        const cached = imageAssetCache.get(source);
        if (cached) await cached;

        const decodePromise = typeof image.decode === "function"
            ? image.decode().catch(() => undefined)
            : new Promise((resolve) => {
                if (image.complete) {
                    resolve();
                    return;
                }
                image.addEventListener("load", resolve, { once: true });
                image.addEventListener("error", resolve, { once: true });
            });

        await Promise.race([
            decodePromise,
            wait(IMAGE_DECODE_TIMEOUT_MS)
        ]);
    }

    async function prepareSceneImages(scene) {
        const images = [...scene.querySelectorAll("img")];
        await Promise.allSettled(images.map(decodeImage));
    }

    const galleryLoaderState = {
        startedAt: performance.now(),
        progress: 0
    };

    function cacheGalleryLoaderRefs() {
        // 共通ローダーはsite-loader.js側で生成する。
    }

    function updateGalleryLoader(progress, status) {
        const next = Math.max(galleryLoaderState.progress, Math.min(100, Math.round(progress)));
        galleryLoaderState.progress = next;
        window.KotonoUraLoader?.update(next, status);
    }

    function connectionAllowsExpandedPreload() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (!connection) return true;
        if (connection.saveData) return false;
        return !new Set(["slow-2g", "2g"]).has(connection.effectiveType);
    }

    function uniqueAssetUrls(urls) {
        return [...new Set(urls.filter((url) => typeof url === "string" && url.trim()))];
    }

    function preloadImageUrl(url) {
        const key = absoluteAssetUrl(url);
        if (!key) return Promise.resolve();
        const existing = imageAssetCache.get(key);
        if (existing) return existing;

        const promise = (async () => {
            const image = new Image();
            image.loading = "eager";
            image.decoding = "async";
            image.fetchPriority = "high";
            image.src = url;

            const ready = typeof image.decode === "function"
                ? image.decode().catch(() => undefined)
                : new Promise((resolve) => {
                    if (image.complete) {
                        resolve();
                        return;
                    }
                    image.addEventListener("load", resolve, { once: true });
                    image.addEventListener("error", resolve, { once: true });
                });
            await Promise.race([ready, wait(GALLERY_PRELOAD_TIMEOUT_MS)]);
        })();

        imageAssetCache.set(key, promise);
        return promise;
    }

    async function prefetchAssetUrl(url) {
        const key = absoluteAssetUrl(url);
        if (!key) return;

        const existing = prefetchedAssetCache.get(key);
        if (existing) {
            await existing;
            return;
        }

        const promise = (async () => {
            const controller = new AbortController();
            const timeout = window.setTimeout(() => controller.abort(), GALLERY_PRELOAD_TIMEOUT_MS);
            try {
                const response = await fetch(url, {
                    cache: "force-cache",
                    credentials: "same-origin",
                    signal: controller.signal
                });
                if (!response.ok) return;
                await response.arrayBuffer();
            } catch (_) {
                // 回線状況による先読み失敗は、実表示時の通常読込へ委ねる。
            } finally {
                window.clearTimeout(timeout);
            }
        })();

        prefetchedAssetCache.set(key, promise);
        await promise;
    }

    async function runAssetQueue(urls, worker, onProgress, concurrency = 4) {
        const assets = uniqueAssetUrls(urls);
        if (!assets.length) return;
        let cursor = 0;
        let completed = 0;

        const runners = Array.from({ length: Math.min(concurrency, assets.length) }, async () => {
            while (cursor < assets.length) {
                const index = cursor;
                cursor += 1;
                await worker(assets[index]);
                completed += 1;
                onProgress?.(completed / assets.length);
            }
        });
        await Promise.allSettled(runners);
    }

    function preloadAnimatedImageUrl(url) {
        const key = absoluteAssetUrl(url);
        if (!key) return Promise.resolve("");
        const existing = animatedAssetCache.get(key);
        if (existing) return existing;

        /*
         * Blob URL化は避け、DOM外のImageで全データをHTTPキャッシュへ入れる。
         * 再生時は別のimg要素へ通常URLを一度だけ設定するため、先頭から始まる。
         */
        const promise = new Promise((resolve) => {
            const image = new Image();
            let settled = false;
            const finish = () => {
                if (settled) return;
                settled = true;
                resolve(url);
            };
            image.addEventListener("load", finish, { once: true });
            image.addEventListener("error", finish, { once: true });
            image.decoding = "async";
            image.src = url;
            window.setTimeout(finish, ANIMATED_PRELOAD_TIMEOUT_MS);
        });
        animatedAssetCache.set(key, promise);
        return promise;
    }

    async function preloadGalleryAssets(urls, startProgress = 18, endProgress = 86) {
        const assets = uniqueAssetUrls(urls);
        if (!assets.length) {
            updateGalleryLoader(endProgress, "表示を整えています");
            return;
        }

        await runAssetQueue(assets, prefetchAssetUrl, (ratio) => {
            updateGalleryLoader(
                startProgress + (endProgress - startProgress) * ratio,
                "表示中の素材を読み込んでいます"
            );
        }, 3);
    }

    function modelDetailAssetUrls(model) {
        return uniqueAssetUrls([
            ...(model.assets.models || []).map((filename) => modelPath(model, filename)),
            modelPath(model, model.assets.logo),
            modelPath(model, model.assets.kv),
            modelPath(model, model.assets.kvFg),
            modelPath(model, model.assets.kvBg),
            modelPath(model, model.assets.view2),
            modelPath(model, model.assets.view3)
        ]);
    }

    function modelEntryAssetUrls(model) {
        const urls = [
            modelDisplayPath(model, model.assets.models?.[0], false)
        ];

        /*
         * モバイルでは人物切替を静止ロゴの読込完了に依存させない。
         * ロゴは常設要素側で非同期に読み込み、モデル操作の待ち時間から外す。
         */
        if (isRichGalleryMode() && model.assets.logo) {
            urls.push(modelPath(model, model.assets.logo));
        }

        return uniqueAssetUrls(urls);
    }

    async function prepareModelEntryAssets(model, { includeAnimation = true } = {}) {
        if (!model) return;
        const staticWorker = isRichGalleryMode() ? preloadImageUrl : prefetchAssetUrl;
        const tasks = modelEntryAssetUrls(model).map(staticWorker);

        if (model.slug === "koto-urara" && document.fonts?.load) {
            tasks.push(document.fonts.load('1em "DotGothic16"', "動作確認"));
        }

        if (includeAnimation && isRichGalleryMode() && model.assets.animeLogo) {
            tasks.push(preloadAnimatedImageUrl(modelDesktopPath(model, model.assets.animeLogo)));
        }
        await Promise.allSettled(tasks);
    }

    function scheduleModelDetailWarm(model) {
        if (!isRichGalleryMode()) return;
        if (!model || modelWarmTasks.has(model.id)) return;

        const run = async () => {
            /*
             * UI操作と競合させないため、残り素材はアイドル時間に1本ずつ
             * HTTPキャッシュへ入れる。ここではdecodeしない。
             */
            await runAssetQueue(modelDetailAssetUrls(model), prefetchAssetUrl, null, 1);
        };

        const promise = new Promise((resolve) => {
            const start = () => void run().finally(resolve);
            if ("requestIdleCallback" in window) {
                window.requestIdleCallback(start, { timeout: 1600 });
            } else {
                window.setTimeout(start, 520);
            }
        });
        modelWarmTasks.set(model.id, promise);
    }

    function ensureIllustrationFonts() {
        if (illustrationFontTask) return illustrationFontTask;

        illustrationFontTask = new Promise((resolve) => {
            let link = document.querySelector('link[data-gallery-illustration-fonts]');
            let settled = false;
            let timer = 0;

            const finish = () => {
                if (settled) return;
                settled = true;
                window.clearTimeout(timer);
                resolve();
            };

            const loadFontFaces = async () => {
                if (!document.fonts?.load) {
                    finish();
                    return;
                }
                await Promise.allSettled([
                    document.fonts.load('1em "Hina Mincho"'),
                    document.fonts.load('1em "Mochiy Pop One"')
                ]);
                finish();
            };

            if (link?.sheet) {
                void loadFontFaces();
                timer = window.setTimeout(finish, ILLUSTRATION_FONT_TIMEOUT_MS);
                return;
            }

            if (!link) {
                link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = ILLUSTRATION_FONT_STYLESHEET;
                link.dataset.galleryIllustrationFonts = "true";
                document.head.append(link);
            }

            link.addEventListener("load", () => void loadFontFaces(), { once: true });
            link.addEventListener("error", finish, { once: true });
            timer = window.setTimeout(finish, ILLUSTRATION_FONT_TIMEOUT_MS);
        });

        return illustrationFontTask;
    }

    function requestedInitialCategory() {
        const category = new URL(window.location.href).searchParams.get("category");
        if (category === "illustration" || category === "works") return category;
        return "live2d";
    }

    function categoryAssetUrls(category) {
        if (category === "live2d") {
            /*
             * 一覧のface/bodyはrenderModelGrid()が生成する実DOM画像で一度だけdecodeする。
             * DOM外Image／fetchによる先読みを挟まず、2枚揃ってからカードを表示する。
             */
            return [];
        }

        if (category === "works") {
            /* Works画像はカード側のnative lazy loadingに任せる。 */
            return [];
        }

        if (category === "illustration") {
            return [
                "images/gallery/illustration/common/fav-before.svg",
                "images/gallery/illustration/common/fav-after.svg"
            ];
        }

        return [];
    }

    async function ensureCategoryAssets(category, { showLoader = false, initial = false } = {}) {
        if (loadedCategories.has(category)) return;
        const existing = categoryAssetLoads.get(category);
        if (existing) {
            await existing;
            return;
        }

        const labels = {
            live2d: "LIVE2Dを読み込んでいます",
            illustration: "ILLUSTRATIONを読み込んでいます",
            works: "WORKSを読み込んでいます"
        };

        if (showLoader) {
            window.KotonoUraLoader?.showTransition(labels[category] || "表示を準備しています");
        }

        const assets = categoryAssetUrls(category);
        const task = (async () => {
            const fontTask = category === "illustration"
                ? ensureIllustrationFonts()
                : Promise.resolve();

            if (initial) {
                await Promise.allSettled([
                    preloadGalleryAssets(assets, 18, 88),
                    fontTask
                ]);
            } else {
                await Promise.allSettled([
                    runAssetQueue(assets, prefetchAssetUrl, null, 3),
                    fontTask
                ]);
            }
            loadedCategories.add(category);
        })();

        categoryAssetLoads.set(category, task);
        try {
            await task;
        } finally {
            categoryAssetLoads.delete(category);
        }

    }

    async function revealLayeredMedia(container, itemSelector) {
        if (!container) return;
        const items = [...container.querySelectorAll(itemSelector)];

        await Promise.allSettled(items.map(async (item) => {
            const images = [...item.querySelectorAll("img")];
            await Promise.allSettled(images.map(decodeImage));
            await nextPaint();
            if (item.isConnected) item.classList.add("is-media-ready");
        }));
    }

    async function finishGalleryLoader() {
        updateGalleryLoader(100, "準備が整いました");
        if (window.KotonoUraLoader) {
            await window.KotonoUraLoader.complete({ minimumMs: GALLERY_LOADER_MIN_MS });
            return;
        }

        const elapsed = performance.now() - galleryLoaderState.startedAt;
        if (elapsed < GALLERY_LOADER_MIN_MS) await wait(GALLERY_LOADER_MIN_MS - elapsed);
        document.body.classList.remove("is-site-loading");
        document.body.removeAttribute("aria-busy");
    }


    function nextPaint() {
        return new Promise((resolve) => {
            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(resolve);
            });
        });
    }

    function getGalleryResponsiveScale() {
        const width = refs.page?.getBoundingClientRect().width || GALLERY_DESIGN_WIDTH;
        return width > 0 ? width / GALLERY_DESIGN_WIDTH : 1;
    }

    function syncSceneResponsiveModelScale(scene) {
        if (!scene) return;

        const responsiveScale = getGalleryResponsiveScale();
        const stageStyles = getComputedStyle(refs.mediaStage);

        const closeBase = Number.parseFloat(stageStyles.getPropertyValue("--model-close-base-scale")) || 0;
        const fullBase = Number.parseFloat(stageStyles.getPropertyValue("--model-full-base-scale")) || 0;
        const closeAdjust = Number.parseFloat(scene.style.getPropertyValue("--model-close-adjust-scale")) || 0;
        const fullAdjust = Number.parseFloat(scene.style.getPropertyValue("--model-full-adjust-scale")) || 0;

        scene.style.setProperty(
            "--model-close-responsive-scale",
            String((closeBase + closeAdjust) * responsiveScale)
        );
        scene.style.setProperty(
            "--model-full-responsive-scale",
            String((fullBase + fullAdjust) * responsiveScale)
        );
    }

    function syncAllResponsiveMedia() {
        refs.mediaSceneHost
            ?.querySelectorAll(".model-media__scene")
            .forEach(syncSceneResponsiveModelScale);

        syncTransitionLogoTarget();
    }

    function measureBackgroundLogoRect() {
        const stage = refs.mediaStage;
        const anchor = refs.persistentLogoAnchor;
        if (!stage || !anchor || refs.persistentLogo?.hidden) return null;

        /*
         * genericな正方形probeではなく、実ロゴanchorをそのままcloneする。
         * 背景用CSS座標と素材の縦横比を共有するため、遷移中の実要素を動かさず
         * 同じbounding boxを取得できる。
         */
        const clone = anchor.cloneNode(true);
        clone.removeAttribute("data-persistent-logo-anchor");
        clone.querySelectorAll("[data-logo-replay]").forEach((button) => {
            button.removeAttribute("data-logo-replay");
            button.disabled = true;
            button.tabIndex = -1;
        });
        clone.classList.add("is-transition-measure");
        clone.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
        stage.append(clone);

        const rect = clone.getBoundingClientRect();
        clone.remove();
        return rect.width > 0 && rect.height > 0 ? rect : null;
    }

    function syncTransitionLogoTarget() {
        const overlay = refs.transition;
        if (!overlay || overlay.hidden) return;

        const rect = measureBackgroundLogoRect();
        if (!rect) return;

        overlay.style.setProperty("--logo-target-left", `${rect.left}px`);
        overlay.style.setProperty("--logo-target-top", `${rect.top}px`);
        overlay.style.setProperty("--logo-target-width", `${rect.width}px`);
        overlay.style.setProperty("--logo-target-height", `${rect.height}px`);
    }

    function hexToRgbString(hex) {
        const value = hex.replace("#", "");
        const normalized = value.length === 3
            ? value.split("").map((char) => char + char).join("")
            : value;
        const number = Number.parseInt(normalized, 16);
        return `${(number >> 16) & 255} ${(number >> 8) & 255} ${number & 255}`;
    }

    function isModelListVisible(model) {
        return publicationHasState(model, PUBLICATION_VISIBLE_STATES)
            && model.sections?.list !== false;
    }

    function canOpenModelDetail(model) {
        return publicationHasState(model, PUBLICATION_DETAIL_STATES)
            && model.sections?.detail === true;
    }

    function modelListEntries() {
        return MODEL_DATA
            .map((model, index) => ({ model, index }))
            .filter(({ model }) => isModelListVisible(model))
            .sort((a, b) => (a.model.sortOrder ?? 0) - (b.model.sortOrder ?? 0));
    }

    function modelDetailEntries() {
        return MODEL_DATA
            .map((model, index) => ({ model, index }))
            .filter(({ model }) => canOpenModelDetail(model))
            .sort((a, b) => (a.model.sortOrder ?? 0) - (b.model.sortOrder ?? 0));
    }

    function getActiveModel() {
        return MODEL_DATA[state.activeModelIndex];
    }

    function getModelProfile(model = getActiveModel()) {
        const variant = model.profileVariants?.[state.modelVariantIndex];
        if (!variant) return { ...model.profile, name: model.name };
        return {
            ...model.profile,
            ...variant,
            name: { ...model.name, ...variant.name }
        };
    }

    function getAge(profile) {
        if (profile.ageType === "normal" && profile.birthDate) {
            const today = new Date();
            const birth = new Date(`${profile.birthDate}T00:00:00`);
            let age = today.getFullYear() - birth.getFullYear();
            const beforeBirthday =
                today.getMonth() < birth.getMonth() ||
                (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
            if (beforeBirthday) age -= 1;
            return String(age);
        }

        if (profile.ageType === "posthumous" && profile.ageBaseDate) {
            const today = new Date();
            const base = new Date(`${profile.ageBaseDate}T00:00:00`);
            let years = today.getFullYear() - base.getFullYear();
            const beforeAnniversary =
                today.getMonth() < base.getMonth() ||
                (today.getMonth() === base.getMonth() && today.getDate() < base.getDate());
            if (beforeAnniversary) years -= 1;
            return `享年18+${Math.max(0, years)}`;
        }

        return profile.age || "";
    }

    function getYouTubeEmbed(url) {
        if (!url) return "";
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/);
        return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : "";
    }

    function setTheme(model) {
        const rgb = hexToRgbString(model.color);
        refs.detailBody?.style.setProperty("--model-color", model.color);
        refs.detailBody?.style.setProperty("--model-rgb", rgb);
        document.body.style.setProperty("--active-model-color", model.color);
        refs.controls?.style.setProperty("--model-color", model.color);
        refs.controls?.style.setProperty("--model-rgb", rgb);
    }

    function getMediaAdjustment(model, mediaKey) {
        return model.mediaAdjust?.[mediaKey] || {};
    }

    function createMediaAdjustmentStyle(model, mediaKey) {
        const definition = MEDIA_ADJUSTMENT_VARIABLES[mediaKey];
        if (!definition) return [];

        const adjustment = getMediaAdjustment(model, mediaKey);
        return Object.entries(definition).map(([axis, [property, fallback]]) =>
            `${property}:${adjustment[axis] ?? fallback}`
        );
    }

    function applyMediaAdjustments(target, model, mediaKeys) {
        mediaKeys.forEach((mediaKey) => {
            const definition = MEDIA_ADJUSTMENT_VARIABLES[mediaKey];
            if (!definition) return;

            const adjustment = getMediaAdjustment(model, mediaKey);
            Object.entries(definition).forEach(([axis, [property, fallback]]) => {
                target.style.setProperty(property, adjustment[axis] ?? fallback);
            });
        });
    }

    function createCardStyle(model) {
        return [
            `--model-color:${model.color}`,
            `--card-filter:${model.card.filter || "grayscale(1)"}`,
            ...createMediaAdjustmentStyle(model, "card")
        ].join(";");
    }

    function createModelCard(model, index) {
        const detailEnabled = canOpenModelDetail(model);
        const comingSoon = model.publication.state === "teaser";
        const className = [
            "model-card",
            comingSoon ? "is-coming-soon" : ""
        ].filter(Boolean).join(" ");
        const disabled = detailEnabled ? "" : " disabled aria-disabled=\"true\"";

        return `
            <button class="${className}" type="button" data-model-index="${index}"
                style="${createCardStyle(model)}"${disabled}>
                <span class="model-card__surname-line" aria-hidden="true"></span>
                <span class="model-card__surname">${model.name.surname}</span>
                <span class="model-card__color-block" aria-hidden="true"></span>

                <span class="model-card__media-viewport" aria-hidden="true">
                    <span class="model-card__media-set">
                        <span class="model-card__media-layer model-card__media-layer--body">
                            <img src="${modelPath(model, model.card.body)}" alt="" loading="eager" decoding="async" fetchpriority="high">
                        </span>
                        <span class="model-card__media-layer model-card__media-layer--face">
                            <img src="${modelPath(model, model.card.face)}" alt="" loading="eager" decoding="async" fetchpriority="high">
                        </span>
                    </span>
                </span>

                <span class="model-card__given-name">${model.name.given}</span>
                <span class="model-card__name-box">${model.name.display}</span>
            </button>
        `;
    }

    function createUnknownCard() {
        return `
            <div class="model-card is-unknown" style="--model-color:#A1A1A1" aria-hidden="true">
                <span class="model-card__surname-line"></span>
                <span class="model-card__surname">Unknown</span>
                <span class="model-card__color-block"></span>
            </div>
        `;
    }

    function getModelGridColumnCount() {
        const raw = getComputedStyle(refs.modelGrid)
            .getPropertyValue("--model-column-count")
            .trim();
        const count = Number.parseInt(raw, 10);
        return Number.isFinite(count) && count > 0 ? count : 3;
    }

    function renderModelGrid() {
        const cards = modelListEntries()
            .map(({ model, index }) => createModelCard(model, index));
        const columnCount = getModelGridColumnCount();
        const fillerCount = (columnCount - cards.length % columnCount) % columnCount;
        for (let index = 0; index < fillerCount; index += 1) cards.push(createUnknownCard());
        refs.modelGrid.innerHTML = cards.join("");
        refs.modelGrid.dataset.columnCount = String(columnCount);
        refs.modelGrid.removeAttribute("aria-busy");
        return revealLayeredMedia(refs.modelGrid, ".model-card:not(.is-unknown)");
    }

    function ensureModelGridCurrent() {
        const currentColumns = Number.parseInt(refs.modelGrid.dataset.columnCount || "0", 10);
        const requiredColumns = getModelGridColumnCount();
        if (refs.modelGrid.childElementCount && currentColumns === requiredColumns) {
            return Promise.resolve();
        }
        return renderModelGrid();
    }

    function createMiniCard(model, index) {
        const active = index === state.activeModelIndex;
        const surnameInitial = `${model.name.surname.charAt(0).toUpperCase()}.`;
        const givenInitial = `${model.name.given.charAt(0).toUpperCase()}.`;

        const parkedClass = active ? ` is-parked-${state.miniParkedSide}` : "";

        return `
            <button class="model-mini-card${active ? " is-active" : ""}${parkedClass}" type="button"
                data-mini-model-index="${index}"
                style="${[`--model-color:${model.color}`, ...createMediaAdjustmentStyle(model, "mini")].join(";")}"
                aria-pressed="${active}">
                <span class="model-mini-card__initials" aria-hidden="true">
                    <span class="model-mini-card__initial-surname">${surnameInitial}</span>
                    <span class="model-mini-card__initial-given">${givenInitial}</span>
                </span>
                <span class="model-mini-card__media-motion" aria-hidden="true">
                    <span class="model-mini-card__media-set">
                        <span class="model-mini-card__media-layer model-mini-card__media-layer--body">
                            <img src="${modelPath(model, model.card.body)}" alt="" loading="eager" decoding="async">
                        </span>
                        <span class="model-mini-card__media-layer model-mini-card__media-layer--face">
                            <img src="${modelPath(model, model.card.face)}" alt="" loading="eager" decoding="async">
                        </span>
                    </span>
                </span>
                <span class="visually-hidden">${model.name.display}</span>
            </button>
        `;
    }

    function renderMiniGrid() {
        refs.miniGrid.innerHTML = modelDetailEntries()
            .map(({ model, index }) => createMiniCard(model, index))
            .join("");
        void revealLayeredMedia(refs.miniGrid, ".model-mini-card");
    }

    function animateMiniSelection(previousIndex, nextIndex, direction) {
        const previous = refs.miniGrid.querySelector(`[data-mini-model-index="${previousIndex}"]`);
        const next = refs.miniGrid.querySelector(`[data-mini-model-index="${nextIndex}"]`);
        if (!previous || !next) {
            renderMiniGrid();
            return;
        }

        const token = ++state.miniAnimationToken;
        const exitClass = direction > 0 ? "is-exiting-left" : "is-exiting-right";
        const returnClass = direction > 0 ? "is-returning-from-right" : "is-returning-from-left";
        const parkedClass = direction > 0 ? "is-parked-left" : "is-parked-right";

        [previous, next].forEach((card) => {
            card.classList.remove(
                "is-exiting-left",
                "is-exiting-right",
                "is-returning-from-left",
                "is-returning-from-right",
                "is-parked-left",
                "is-parked-right"
            );
        });

        previous.classList.remove("is-active");
        previous.classList.add(returnClass);
        previous.setAttribute("aria-pressed", "false");

        next.classList.add("is-active", exitClass);
        next.setAttribute("aria-pressed", "true");

        state.miniParkedSide = direction > 0 ? "left" : "right";

        const finish = () => {
            if (token !== state.miniAnimationToken) return;
            previous.classList.remove(returnClass);
            next.classList.remove(exitClass);
            next.classList.add(parkedClass);
        };

        if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
            finish();
            return;
        }

        window.setTimeout(finish, MINI_SLIDE_MS + 40);
    }

    function applySceneMediaAdjustments(scene, model) {
        applyMediaAdjustments(scene, model, [
            "modelClose",
            "modelFull",
            "kvClose",
            "kvFull",
            "viewClose",
            "viewFull"
        ]);
    }

    function syncDetailMediaState() {
        const contents = ["model", "kv", "view", "logo"];
        contents.forEach((content) => {
            refs.mediaStage.classList.toggle(`is-content-${content}`, state.activeContent === content);
        });

        refs.mediaStage.classList.toggle("is-logo-focused", state.activeContent === "logo");
        refs.mediaStage.classList.toggle("is-media-full", state.zoomedOut);
        refs.detailBody.classList.toggle(
            "is-model-full",
            state.activeContent === "model" && state.zoomedOut
        );
    }

    function updatePersistentLogo(model) {
        const wrapper = refs.persistentLogo;
        const anchor = refs.persistentLogoAnchor;
        const tint = refs.persistentLogoTint;
        const image = refs.persistentLogoImage;
        const replay = refs.persistentLogoReplay;
        if (!wrapper || !anchor || !tint || !image || !replay) return;

        applyMediaAdjustments(refs.mediaStage, model, ["logoBg", "logoFocus"]);

        const logoPath = modelPath(model, model.assets.logo);
        if (!logoPath) {
            wrapper.hidden = true;
            wrapper.setAttribute("aria-hidden", "true");
            replay.disabled = true;
            replay.tabIndex = -1;
            syncDetailMediaState();
            return;
        }

        /*
         * 背景表示とロゴ単体表示で同じDOMを使い続ける。
         * hiddenの切替は「ロゴ素材が存在しないモデル」だけに限定する。
         */
        wrapper.hidden = false;

        /*
         * mask shorthand＋CSS変数経由はブラウザによって無効化されることがあるため、
         * mask-imageを直接設定し、位置・サイズ・repeatはCSS側で固定する。
         */
        const maskValue = `url("${logoPath}")`;
        tint.style.maskImage = maskValue;
        tint.style.webkitMaskImage = maskValue;

        const focused = state.activeContent === "logo";
        if (focused) {
            if (image.getAttribute("src") !== logoPath) {
                image.src = logoPath;
                decodeImage(image).catch(() => undefined);
            }
            image.alt = `${model.name.display} ロゴ`;
        } else {
            image.removeAttribute("src");
            image.alt = "";
        }

        const replayAvailable = focused && isRichGalleryMode()
            && Boolean(model.assets.animeLogo && model.animeLogo);

        replay.disabled = !replayAvailable;
        replay.tabIndex = replayAvailable ? 0 : -1;
        replay.setAttribute("aria-label", "ロゴアニメーションを再生");
        anchor.setAttribute("aria-label", `${model.name.display} ロゴ`);
        wrapper.setAttribute("aria-hidden", focused ? "false" : "true");

        syncDetailMediaState();
    }

    async function preparePersistentLogoOriginal(model) {
        const image = refs.persistentLogoImage;
        const logoPath = modelPath(model, model.assets.logo);
        if (!image || !logoPath) return;

        if (image.getAttribute("src") !== logoPath) image.src = logoPath;
        image.alt = `${model.name.display} ロゴ`;
        await decodeImage(image);
    }

    function createModelScene(model) {
        const filename = model.assets.models[state.modelVariantIndex] || model.assets.models[0];
        const imagePath = modelDisplayPath(model, filename, state.zoomedOut);
        const originalWidth = modelOriginalWidth(model, filename);
        const widthStyle = originalWidth ? ` style="width:${originalWidth}px"` : "";

        return `
            <div class="model-media__moving model-media__moving--model">
                <span class="model-media__model-anchor model-media__model-anchor--main" data-model-anchor>
                    <img class="model-media__model model-media__model-layer is-active" data-model-layer="a" src="${imagePath}" alt="${model.name.display}"${widthStyle} loading="eager" decoding="async" fetchpriority="high">
                    <img class="model-media__model model-media__model-layer" data-model-layer="b" alt=""${widthStyle} loading="eager" decoding="async">
                </span>
            </div>
        `;
    }

    function createKvScene(model) {
        const hiddenClass = state.kvBackgroundVisible ? "" : " is-background-hidden";
        const bg = model.assets.kvBg
            ? `<img class="model-media__kv-layer model-media__kv-layer--bg" src="${modelPath(model, model.assets.kvBg)}" alt="" loading="eager" decoding="async" fetchpriority="high">`
            : "";
        const fg = model.assets.kvFg
            ? `<img class="model-media__kv-layer model-media__kv-layer--fg" src="${modelPath(model, model.assets.kvFg)}" alt="" loading="eager" decoding="async" fetchpriority="high">`
            : "";
        return `
            <div class="model-media__moving model-media__moving--kv">
                <div class="model-media__kv-group${hiddenClass}">
                    ${bg}
                    <img class="model-media__kv-layer model-media__kv-layer--main" src="${modelPath(model, model.assets.kv)}" alt="${model.name.display} キービジュアル" loading="eager" decoding="async" fetchpriority="high">
                    ${fg}
                </div>
            </div>
        `;
    }

    function createViewScene(model) {
        const view = model.assets.view3 || model.assets.view2;
        return `
            <div class="model-media__moving model-media__view-viewport" data-view-viewport>
                <img class="model-media__view-image" data-view-image src="${modelPath(model, view)}" alt="${model.name.display} 設定画" loading="eager" decoding="async" fetchpriority="high" draggable="false">
            </div>
            <div class="model-media__view-tools">
                <input class="model-media__view-range" type="range" min="0" max="100" value="${state.viewPan}" data-view-range aria-label="設定画の横位置">
                <button class="model-media__magnify${state.viewMagnified ? " is-active" : ""}" type="button" data-view-magnify aria-label="設定画を拡大"></button>
            </div>
        `;
    }

    function createLogoScene() {
        return '<div class="model-media__moving model-media__moving--logo" aria-hidden="true"></div>';
    }

    function configureScene(scene, model) {
        scene.className = `model-media__scene${state.zoomedOut ? " is-full" : ""}`;
        scene.dataset.content = state.activeContent;
        scene.style.setProperty("--model-color", model.color);
        scene.style.setProperty("--model-rgb", hexToRgbString(model.color));
        applySceneMediaAdjustments(scene, model);
        syncSceneResponsiveModelScale(scene);
    }

    function createScene(model) {
        const scene = document.createElement("div");
        configureScene(scene, model);

        if (state.activeContent === "model") scene.innerHTML = createModelScene(model);
        if (state.activeContent === "kv") scene.innerHTML = createKvScene(model);
        if (state.activeContent === "view") scene.innerHTML = createViewScene(model);
        if (state.activeContent === "logo") scene.innerHTML = createLogoScene();

        return scene;
    }

    async function updateFixedModelScene(scene, model) {
        const filename = model.assets.models[state.modelVariantIndex] || model.assets.models[0];
        const imagePath = modelDisplayPath(model, filename, state.zoomedOut);
        const layers = [...scene.querySelectorAll("[data-model-layer]")];
        if (layers.length < 2) return false;

        const active = layers.find((layer) => layer.classList.contains("is-active")) || layers[0];
        const waiting = layers.find((layer) => layer !== active) || layers[1];
        const originalWidth = modelOriginalWidth(model, filename);
        const token = state.mediaTransitionToken;

        if (active.getAttribute("src") === imagePath) {
            await new Promise((resolve) => window.requestAnimationFrame(() => {
                configureScene(scene, model);
                active.alt = model.name.display;
                if (originalWidth) active.style.width = `${originalWidth}px`;
                else active.style.removeProperty("width");
                resolve();
            }));
            return true;
        }

        waiting.classList.remove("is-active");
        waiting.alt = model.name.display;
        if (originalWidth) waiting.style.width = `${originalWidth}px`;
        else waiting.style.removeProperty("width");

        /*
         * 先読み用Imageと表示用imgで二重にdecodeする構造を避ける。
         * 初期ローダー／pointerdownでHTTPキャッシュは温めておき、
         * ここでは実際に表示するレイヤーだけを一度デコードする。
         */
        waiting.src = imagePath;
        await decodeImage(waiting);
        if (token !== state.mediaTransitionToken) return false;

        await new Promise((resolve) => window.requestAnimationFrame(() => {
            configureScene(scene, model);
            active.classList.remove("is-active");
            waiting.classList.add("is-active");
            scene.dataset.activeModelLayer = waiting.dataset.modelLayer || "";
            resolve();
        }));
        return true;
    }

    async function renderMedia(direction = 0, { sequential = false } = {}) {
        const model = getActiveModel();
        updatePersistentLogo(model);
        const token = ++state.mediaTransitionToken;
        const currentScene = refs.mediaSceneHost.firstElementChild;
        const richSlide = Boolean(
            isRichGalleryMode()
            && direction !== 0
            && currentScene
        );

        /*
         * モバイルでは同じDOMのsrcだけを更新し、再生成・大距離スライドを行わない。
         * デスクトップのrichモードだけは、制作環境で確認しているスライド演出を残す。
         */
        if (
            state.activeContent === "model"
            && currentScene?.dataset.content === "model"
            && !richSlide
        ) {
            await updateFixedModelScene(currentScene, model);
            syncDetailMediaState();
            return;
        }

        const newScene = createScene(model);

        if (state.activeContent === "kv" || state.activeContent === "view") {
            await prepareSceneImages(newScene);
            if (token !== state.mediaTransitionToken) return;
        }

        if (richSlide) {
            const enteringClass = direction > 0
                ? "is-entering-from-right"
                : "is-entering-from-left";
            const exitingClass = direction > 0
                ? "is-exiting-left"
                : "is-exiting-right";

            newScene.classList.add(enteringClass);
            refs.mediaSceneHost.append(newScene);
            currentScene.classList.add(exitingClass);
            syncDetailMediaState();

            if (state.activeContent === "view") {
                bindViewInteractions(newScene);
                applyViewTransform(newScene);
            }

            await wait(sequential ? 560 : 520);
            if (token !== state.mediaTransitionToken) {
                newScene.remove();
                return;
            }

            currentScene.remove();
            newScene.classList.remove(enteringClass);
            return;
        }

        refs.mediaSceneHost.replaceChildren(newScene);
        syncDetailMediaState();

        if (state.activeContent === "view") {
            requestAnimationFrame(() => {
                if (token !== state.mediaTransitionToken || !newScene.isConnected) return;
                bindViewInteractions(newScene);
                applyViewTransform(newScene);
            });
        }
    }

    function getContentAvailability(model) {
        return {
            model: model.sections?.model !== false && model.assets.models.length > 0,
            kv: model.sections?.kv !== false && Boolean(model.assets.kv),
            view: model.sections?.view !== false && Boolean(model.assets.view3 || model.assets.view2),
            logo: model.sections?.logo !== false && Boolean(model.assets.logo)
        };
    }

    function iconMarkup(name, bgName = "") {
        const bg = bgName
            ? `<img class="model-control-button__bg" src="${CONTROL_BASE}/${bgName}" alt="">`
            : "";
        const iconUrl = `${CONTROL_BASE}/${name}`;
        return `${bg}<span class="model-control-button__icon" aria-hidden="true" style="mask-image:url('${iconUrl}');-webkit-mask-image:url('${iconUrl}')"></span>`;
    }

    function createControlButton({ control, label, icon, bg = "", selected = false, extraClass = "" }) {
        return `
            <button class="model-control-button${selected ? " is-selected" : ""}${extraClass ? ` ${extraClass}` : ""}"
                type="button" data-control="${control}" aria-label="${label}" aria-pressed="${selected}">
                ${iconMarkup(icon, bg)}
            </button>
        `;
    }

    function ensureControlsShell() {
        if (refs.controls.dataset.ready === "true") return;
        const button = (control, group) => `
            <button class="model-control-button" type="button" data-control="${control}" data-control-slot="${group}" hidden aria-pressed="false">
                <img class="model-control-button__bg" alt="" hidden>
                <span class="model-control-button__icon" aria-hidden="true"></span>
            </button>`;

        refs.controls.innerHTML = `
            <button class="model-controls__handle" type="button" data-control="collapse"></button>
            <div class="model-controls__groups">
                <div class="model-controls__group model-controls__group--operation" data-control-group="operation">
                    ${button("change", "operation")}
                    ${button("zoom", "operation")}
                </div>
                <div class="model-controls__group model-controls__group--selection" data-control-group="selection">
                    ${button("content-model", "selection")}
                    ${button("content-kv", "selection")}
                    ${button("content-view", "selection")}
                    ${button("content-logo", "selection")}
                </div>
            </div>
        `;
        refs.controls.dataset.ready = "true";
    }

    function updateControlButton(control, config = {}) {
        const element = refs.controls.querySelector(`[data-control="${control}"]`);
        if (!element) return;
        const visible = config.visible !== false;
        element.hidden = !visible;
        element.disabled = !visible || Boolean(config.disabled);
        element.setAttribute("aria-label", config.label || "");
        element.setAttribute("aria-pressed", config.selected ? "true" : "false");
        element.classList.toggle("is-selected", Boolean(config.selected));

        if (control === "change") {
            const rotation = Number.isFinite(config.rotation) ? config.rotation : 0;
            element.style.setProperty("--change-rotation", `${rotation}deg`);
        }

        const background = element.querySelector(".model-control-button__bg");
        if (background) {
            if (config.bg) {
                const src = `${CONTROL_BASE}/${config.bg}`;
                if (background.getAttribute("src") !== src) background.src = src;
                background.hidden = false;
            } else {
                background.hidden = true;
                background.removeAttribute("src");
            }
        }

        const icon = element.querySelector(".model-control-button__icon");
        if (icon && config.icon) {
            const value = `url('${CONTROL_BASE}/${config.icon}')`;
            icon.style.maskImage = value;
            icon.style.webkitMaskImage = value;
        }
    }

    function renderControls() {
        const model = getActiveModel();
        const available = getContentAvailability(model);
        const modelHasVariants = model.assets.models.length > 1;
        const changeVisible =
            (state.activeContent === "model" && modelHasVariants) ||
            (state.activeContent === "kv" && Boolean(model.assets.kvBg));
        const zoomVisible = state.activeContent !== "logo";

        ensureControlsShell();
        refs.controls.classList.toggle("is-collapsed", state.controlsCollapsed);

        const handle = refs.controls.querySelector(".model-controls__handle");
        handle.textContent = state.controlsCollapsed ? "<<" : ">>";
        handle.setAttribute("aria-label", `操作アイコンを${state.controlsCollapsed ? "開く" : "閉じる"}`);

        updateControlButton("change", {
            visible: changeVisible,
            label: "表示差分を変更",
            icon: "change.svg",
            bg: "change-bg.svg",
            rotation: state.changeRotation
        });
        updateControlButton("zoom", {
            visible: zoomVisible,
            label: state.zoomedOut ? "拡大表示" : "全体表示",
            icon: state.zoomedOut ? "zoomIn.svg" : "zoomOut.svg",
            bg: state.zoomedOut ? "zoomIn-bg.svg" : "zoomOut-bg.svg"
        });
        updateControlButton("content-model", {
            visible: available.model,
            label: "モデルを表示",
            icon: "model.svg",
            bg: "model-bg.svg",
            selected: state.activeContent === "model"
        });

        const directed = Boolean(model.assets.kvBg);
        updateControlButton("content-kv", {
            visible: available.kv,
            label: "キービジュアルを表示",
            icon: directed ? "dir-kv.svg" : "kv.svg",
            bg: directed ? "dir-kv-bg.svg" : "kv-bg.svg",
            selected: state.activeContent === "kv"
        });

        const three = Boolean(model.assets.view3);
        updateControlButton("content-view", {
            visible: available.view,
            label: "設定画を表示",
            icon: three ? "3view.svg" : "2view.svg",
            bg: three ? "3view-bg.svg" : "2view-bg.svg",
            selected: state.activeContent === "view"
        });

        const animated = isRichGalleryMode() && Boolean(model.assets.animeLogo);
        updateControlButton("content-logo", {
            visible: available.logo,
            label: "ロゴを表示",
            icon: animated ? "anime-logo.svg" : "logo.svg",
            bg: animated ? "anime-logo-bg.svg" : "logo-bg.svg",
            selected: state.activeContent === "logo"
        });

        const operationGroup = refs.controls.querySelector('[data-control-group="operation"]');
        operationGroup.hidden = !changeVisible && !zoomVisible;
    }

    function clearModelActionIndicators() {
        refs.miniGrid?.querySelectorAll(".is-pending").forEach((element) => {
            element.classList.remove("is-pending");
        });
        refs.controls?.querySelectorAll(".is-pending").forEach((element) => {
            element.classList.remove("is-pending");
        });
    }

    function setModelActionBusy(busy, { miniIndex = null, control = null } = {}) {
        state.modelActionBusy = Boolean(busy);
        refs.detailBody?.classList.toggle("is-model-action-busy", state.modelActionBusy);
        refs.miniGrid?.classList.toggle("is-action-busy", state.modelActionBusy);
        refs.controls?.classList.toggle("is-action-busy", state.modelActionBusy);

        refs.miniGrid?.setAttribute("aria-busy", String(state.modelActionBusy));
        refs.controls?.setAttribute("aria-busy", String(state.modelActionBusy));

        clearModelActionIndicators();
        if (!state.modelActionBusy) return;

        if (Number.isInteger(miniIndex)) {
            refs.miniGrid
                ?.querySelector(`[data-mini-model-index="${miniIndex}"]`)
                ?.classList.add("is-pending");
        }

        if (control) {
            refs.controls
                ?.querySelector(`[data-control="${control}"]`)
                ?.classList.add("is-pending");
        }
    }

    function prewarmModelIndex(index) {
        const target = MODEL_DATA[index];
        if (!target || !canOpenModelDetail(target)) return;
        void prepareModelEntryAssets(target, { includeAnimation: false });
    }

    function prewarmControl(control) {
        const model = getActiveModel();
        if (!model) return;

        if (control === "change" && state.activeContent === "model" && model.assets.models.length > 1) {
            const nextVariant = (state.modelVariantIndex + 1) % model.assets.models.length;
            const filename = model.assets.models[nextVariant];
            void prefetchAssetUrl(modelDisplayPath(model, filename, state.zoomedOut));
            return;
        }

        if (control === "zoom" && state.activeContent === "model") {
            const filename = model.assets.models[state.modelVariantIndex] || model.assets.models[0];
            void preloadImageUrl(modelDisplayPath(model, filename, !state.zoomedOut));
            return;
        }

        if (control === "content-kv") {
            void Promise.allSettled([
                prefetchAssetUrl(modelPath(model, model.assets.kv)),
                prefetchAssetUrl(modelPath(model, model.assets.kvBg)),
                prefetchAssetUrl(modelPath(model, model.assets.kvFg))
            ]);
            return;
        }

        if (control === "content-view") {
            void prefetchAssetUrl(modelPath(model, model.assets.view3 || model.assets.view2));
        }
    }

    function createSocialLinks(profile) {
        const links = [];
        if (profile.socials?.x) {
            links.push(`
                <a href="${profile.socials.x}" target="_blank" rel="noopener noreferrer" aria-label="Xを開く">
                    <img src="${SNS_BASE}/x.svg" alt="">
                </a>
            `);
        }
        if (profile.socials?.youtube) {
            links.push(`
                <a href="${profile.socials.youtube}" target="_blank" rel="noopener noreferrer" aria-label="YouTubeを開く">
                    <img src="${SNS_BASE}/youtube.svg" alt="">
                </a>
            `);
        }
        return links.join("");
    }

    function createDetailRows(profile) {
        if (!profile.details?.length) return "";
        return profile.details.map(([label, value, effect]) => `
            <div class="model-profile__detail-row">
                <span>${label}</span>
                <span class="model-profile__detail-value${effect === "secret" ? " secret-name-value" : ""}"
                    ${effect === "secret" ? "data-secret-name" : ""}>${effect === "secret" ? "不明" : value}</span>
            </div>
        `).join("");
    }

    function mountProfileVideo(container) {
        if (!container || container.dataset.videoMounted === "true") return;
        const embed = container.dataset.embedSrc || "";
        if (!embed) return;

        const iframe = document.createElement("iframe");
        iframe.src = embed;
        iframe.title = container.dataset.embedTitle || "紹介動画";
        iframe.loading = "lazy";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        container.dataset.videoMounted = "true";
        container.append(iframe);
    }

    function bindLazyProfileVideo() {
        refs.profileVideoObserver?.disconnect();
        refs.profileVideoObserver = null;

        const container = refs.profile.querySelector("[data-profile-video]");
        if (!container) return;

        if (typeof IntersectionObserver !== "function") {
            mountProfileVideo(container);
            return;
        }

        refs.profileVideoObserver = new IntersectionObserver((entries, observer) => {
            const entry = entries[0];
            if (!entry?.isIntersecting) return;
            mountProfileVideo(container);
            observer.disconnect();
            refs.profileVideoObserver = null;
        }, { rootMargin: "500px 0px" });
        refs.profileVideoObserver.observe(container);
    }

    function renderProfile() {
        const model = getActiveModel();
        const profile = getModelProfile(model);
        const name = profile.name || model.name;
        const age = getAge(profile);
        const embed = getYouTubeEmbed(profile.video);
        const detailsAvailable = Boolean(profile.details?.length);
        const socials = createSocialLinks(profile);
        const intro = profile.intro?.length
            ? profile.intro.map((paragraph) => {
                const plainText = paragraph.text.replace(/\n/g, "<br>");
                const displayText = paragraph.dotText
                    ? plainText.replace(
                        paragraph.dotText,
                        `<span class="is-dot">${paragraph.dotText}</span>`
                    )
                    : plainText;

                return `
                    <p class="${paragraph.kind === "meta" ? "is-meta" : paragraph.kind === "closing" ? "is-closing" : ""}">
                        ${displayText}
                    </p>
                `;
            }).join("")
            : '<div class="model-profile__empty" aria-label="紹介文準備中"></div>';

        refs.profile.innerHTML = `
            <div class="model-profile__name-block">
                <h2 class="model-profile__name">${name.display}</h2>
                <p class="model-profile__reading">${name.reading} / ${name.roman}</p>
            </div>

            <div class="model-profile__facts">
                <div class="model-profile__fact"><span>誕生日</span><span class="model-profile__fact-line"></span><span>${profile.birthday || ""}</span></div>
                <div class="model-profile__fact"><span>身長</span><span class="model-profile__fact-line"></span><span>${profile.height || ""}</span></div>
                ${profile.showAge === false ? "" : `<div class="model-profile__fact"><span>年齢</span><span class="model-profile__fact-line"></span><span>${age}</span></div>`}
                ${detailsAvailable ? `
                    <button class="model-profile__details-toggle" type="button" data-profile-toggle aria-expanded="${state.profileExpanded}">
                        ${state.profileExpanded ? "－ 閉じる" : "＋ 詳細"}
                    </button>
                    <div class="model-profile__details-shell${state.profileExpanded ? " is-open" : ""}" data-profile-details aria-hidden="${!state.profileExpanded}">
                        <div class="model-profile__details">
                            ${createDetailRows(profile)}
                        </div>
                    </div>
                ` : ""}
            </div>

            ${socials ? `<div class="model-profile__social">${socials}</div>` : ""}
            ${profile.flavor ? `<p class="model-profile__flavor">：${profile.flavor}</p>` : ""}

            ${embed ? `
                <div class="model-profile__video" data-profile-video data-embed-src="${embed}" data-embed-title="${name.display} 紹介動画"></div>
            ` : ""}

            <div class="model-profile__intro">${intro}</div>
        `;

        bindLazyProfileVideo();
        if (state.profileExpanded) window.setTimeout(runSecretNameEffect, 220);
    }

    function runSecretNameEffect() {
        const element = refs.profile.querySelector("[data-secret-name]");
        if (!element) return;

        const symbols = "✣✦✧◆◇○●□■△▽※〆々〒彁";
        const source = "sakurayashiki";
        element.textContent = source;
        element.style.fontFamily = '"WingdingsSubset", "Yu Gothic", sans-serif';

        window.setTimeout(() => {
            const started = performance.now();
            const duration = 800;

            function frame(now) {
                const progress = Math.min(1, (now - started) / duration);
                const length = Math.max(2, Math.round(source.length * (1 - progress * 0.45)));
                element.textContent = Array.from({ length }, () => symbols[Math.floor(Math.random() * symbols.length)]).join("");
                if (progress < 1) {
                    requestAnimationFrame(frame);
                } else {
                    element.style.fontFamily = "inherit";
                    element.textContent = "不明";
                }
            }

            requestAnimationFrame(frame);
        }, 180);
    }

    function toggleProfileDetails() {
        state.profileExpanded = !state.profileExpanded;
        const toggle = refs.profile.querySelector("[data-profile-toggle]");
        const shell = refs.profile.querySelector("[data-profile-details]");
        if (!toggle || !shell) return;

        toggle.textContent = state.profileExpanded ? "－ 閉じる" : "＋ 詳細";
        toggle.setAttribute("aria-expanded", String(state.profileExpanded));
        shell.classList.toggle("is-open", state.profileExpanded);
        shell.setAttribute("aria-hidden", String(!state.profileExpanded));

        if (state.profileExpanded) window.setTimeout(runSecretNameEffect, 220);
    }

    function animateDetailUiContinuity(direction) {
        /* 軽量化優先：offsetWidthを伴うUI全体の再アニメーションは行わない。 */
    }

    async function renderDetail() {
        const model = getActiveModel();
        setTheme(model);
        renderMiniGrid();
        renderControls({ animate: false });
        renderProfile();
        await renderMedia(0);
    }

    function getShortestDirection(fromIndex, toIndex) {
        const indices = modelDetailEntries().map(({ index }) => index);
        const fromPosition = indices.indexOf(fromIndex);
        const toPosition = indices.indexOf(toIndex);
        const count = indices.length;
        if (fromPosition < 0 || toPosition < 0 || count < 2) return 1;
        const forward = (toPosition - fromPosition + count) % count;
        const backward = (fromPosition - toPosition + count) % count;
        return forward <= backward ? 1 : -1;
    }

    async function runFullTransition(model, mutator, { preparation = null } = {}) {
        if (state.transitioning) return;
        state.transitioning = true;

        const overlay = refs.transition;
        const richTransition = isRichGalleryMode();

        if (!richTransition) {
            overlay.hidden = false;
            overlay.className = "gallery-transition gallery-transition--lite is-wiping-in";
            overlay.style.setProperty("--transition-color", "#000");
            overlay.style.setProperty("--transition-model-color", model.color);

            await wait(170);
            overlay.classList.add("is-loading");
            if (preparation) await preparation;
            await Promise.resolve(mutator());
            await nextPaint();
            overlay.classList.remove("is-loading", "is-wiping-in");
            overlay.classList.add("is-wiping-out");
            await wait(220);

            overlay.hidden = true;
            overlay.className = "gallery-transition";
            state.transitioning = false;

            if (state.pendingModelIndex !== null) {
                const pending = state.pendingModelIndex;
                state.pendingModelIndex = null;
                switchModel(pending);
            }
            return;
        }

        let animeLogo = overlay.querySelector(".gallery-transition__anime-logo");
        const staticLogoOriginal = overlay.querySelector(".gallery-transition__static-logo-original");
        const staticLogoTint = overlay.querySelector(".gallery-transition__static-logo-tint");
        const hasAnime = isRichGalleryMode()
            && Boolean(model.assets.animeLogo && model.animeLogo);
        const hasStatic = Boolean(model.assets.logo);
        const animePath = hasAnime ? modelDesktopPath(model, model.assets.animeLogo) : "";
        const animeReadyTask = hasAnime ? preloadAnimatedImageUrl(animePath) : Promise.resolve("");

        overlay.hidden = false;
        overlay.className = "gallery-transition is-wiping-in";
        overlay.style.setProperty("--transition-color", "#000");
        overlay.style.setProperty("--transition-model-color", model.color);
        staticLogoOriginal.removeAttribute("src");
        staticLogoTint.style.removeProperty("mask-image");
        staticLogoTint.style.removeProperty("-webkit-mask-image");
        overlay.style.removeProperty("--logo-target-left");
        overlay.style.removeProperty("--logo-target-top");
        overlay.style.removeProperty("--logo-target-width");
        overlay.style.removeProperty("--logo-target-height");

        const freshAnimeLogo = document.createElement("img");
        freshAnimeLogo.className = "gallery-transition__anime-logo";
        freshAnimeLogo.alt = "";
        freshAnimeLogo.hidden = true;
        animeLogo.replaceWith(freshAnimeLogo);
        animeLogo = freshAnimeLogo;

        await wait(320);
        overlay.classList.add("is-loading");
        await wait(40);
        if (preparation) await preparation;
        await Promise.resolve(mutator());
        await nextPaint();
        syncTransitionLogoTarget();

        if (hasStatic) {
            const staticLogoPath = modelPath(model, model.assets.logo);
            staticLogoOriginal.src = staticLogoPath;
            await decodeImage(staticLogoOriginal);
            const staticLogoUrl = `url("${staticLogoPath}")`;
            staticLogoTint.style.maskImage = staticLogoUrl;
            staticLogoTint.style.webkitMaskImage = staticLogoUrl;
        }

        let animationReady = "";
        if (hasAnime) {
            animationReady = await Promise.race([
                animeReadyTask,
                wait(TRANSITION_ANIMATION_GRACE_MS).then(() => "")
            ]);
        }

        overlay.classList.remove("is-loading");

        if (animationReady) {
            animeLogo.hidden = false;
            animeLogo.src = animePath;
            overlay.classList.add("is-logo-playing");
            await nextPaint();

            const duration = model.animeLogo.frames / model.animeLogo.fps * 1000;
            const frameDuration = 1000 / model.animeLogo.fps;
            const loopGuard = Math.max(120, frameDuration * 4);
            await wait(Math.max(0, duration - loopGuard));

            if (hasStatic) {
                overlay.classList.add("is-logo-final");
                await nextPaint();
            }
            overlay.classList.remove("is-logo-playing");
            animeLogo.hidden = true;
            animeLogo.removeAttribute("src");
            await wait(model.animeLogo.hold);
        } else if (hasStatic) {
            // アニメーションが間に合わない端末では、静止ロゴで即座に遷移を続ける。
            overlay.classList.add("is-logo-final");
            await nextPaint();
            await wait(180);
        }

        if (hasStatic) {
            overlay.classList.add("is-logo-settling");
            await wait(380);
        }

        const revealScene = refs.mediaSceneHost
            ?.querySelector('.model-media__scene[data-content="model"]');
        revealScene?.classList.add("is-transition-reveal-pending");
        await nextPaint();

        if (hasStatic) {
            overlay.classList.add("is-logo-disappearing");
            await wait(180);
        }

        overlay.classList.remove("is-wiping-in", "is-logo-playing");
        overlay.classList.add("is-wiping-out");
        revealScene?.classList.remove("is-transition-reveal-pending");
        revealScene?.classList.add("is-transition-revealing");
        await wait(420);

        overlay.hidden = true;
        overlay.className = "gallery-transition";
        revealScene?.classList.remove("is-transition-revealing");
        state.transitioning = false;
        scheduleModelDetailWarm(model);

        if (state.pendingModelIndex !== null) {
            const pending = state.pendingModelIndex;
            state.pendingModelIndex = null;
            switchModel(pending);
        }
    }

    async function replayActiveLogoAnimation() {
        if (state.transitioning || state.activeContent !== "logo") return;
        const model = getActiveModel();
        if (!isRichGalleryMode() || !model.assets.animeLogo || !model.animeLogo) return;

        const preparation = prepareModelEntryAssets(model, { includeAnimation: false });
        await runFullTransition(model, async () => {
            state.activeContent = "model";
            state.modelVariantIndex = 0;
            state.zoomedOut = false;
            state.kvBackgroundVisible = true;
            state.profileExpanded = false;
            state.viewPan = 0;
            state.viewMagnified = false;
            state.viewDragX = 0;
            state.viewDragY = 0;
            state.miniParkedSide = "right";
            await renderDetail();
            scheduleModelParallaxUpdate();
        }, { preparation });
    }

    async function openModel(index, card) {
        const model = MODEL_DATA[index];
        if (!model || !canOpenModelDetail(model) || state.transitioning) return;

        state.activeModelIndex = index;
        state.activeContent = "model";
        state.modelVariantIndex = 0;
        state.zoomedOut = false;
        state.kvBackgroundVisible = true;
        state.profileExpanded = false;
        state.viewPan = 0;
        state.viewMagnified = false;
        state.viewDragX = 0;
        state.viewDragY = 0;
        state.miniParkedSide = "right";

        const preparation = prepareModelEntryAssets(model, { includeAnimation: false });
        await runFullTransition(model, async () => {
            refs.modelGrid.hidden = true;
            refs.detail.hidden = false;
            state.view = "detail";
            refs.page.dataset.galleryView = "detail";
            document.body.classList.add("gallery-detail-open");
            await renderDetail();
            window.scrollTo({ top: refs.tabs.getBoundingClientRect().top + window.scrollY, behavior: "auto" });
            scheduleModelParallaxUpdate();
        }, { preparation });
    }

    function closeDetail() {
        if (state.view !== "detail" || state.transitioning) return;
        state.view = "list";
        refs.page.dataset.galleryView = "list";
        refs.detail.hidden = true;
        refs.modelGrid.hidden = false;
        refs.modelGrid.querySelectorAll(".is-character-exiting").forEach((card) => card.classList.remove("is-character-exiting"));
        document.body.classList.remove("gallery-detail-open");
        void ensureModelGridCurrent();
        scheduleModelParallaxUpdate();
    }

    async function switchModel(index) {
        if (index === state.activeModelIndex) return;

        if (state.transitioning || state.modelActionBusy) {
            /*
             * 連打をキューとして積み上げず、最後に選ばれた1件だけを保持する。
             * 現在の切替が終わった後、その1件だけを実行する。
             */
            state.pendingModelIndex = index;
            if (state.modelActionBusy) {
                setModelActionBusy(true, { miniIndex: index });
                prewarmModelIndex(index);
            }
            return;
        }

        const target = MODEL_DATA[index];
        if (!canOpenModelDetail(target)) return;

        const switchToken = ++state.modelSwitchToken;
        const previousIndex = state.activeModelIndex;
        const direction = getShortestDirection(previousIndex, index);

        setModelActionBusy(true, { miniIndex: index });

        try {
            await prepareModelEntryAssets(target, { includeAnimation: false });
            if (switchToken !== state.modelSwitchToken) return;

            state.activeModelIndex = index;
            state.activeContent = "model";
            state.modelVariantIndex = 0;
            state.zoomedOut = false;
            state.kvBackgroundVisible = true;
            state.profileExpanded = false;
            state.viewPan = 0;
            state.viewMagnified = false;
            state.viewDragX = 0;
            state.viewDragY = 0;

            setTheme(target);
            animateMiniSelection(previousIndex, index, direction);
            renderControls({ animate: false });
            renderProfile();
            await renderMedia(direction);
            scheduleModelDetailWarm(target);
        } finally {
            setModelActionBusy(false);

            const pending = state.pendingModelIndex;
            state.pendingModelIndex = null;
            if (
                Number.isInteger(pending)
                && pending !== state.activeModelIndex
                && state.view === "detail"
            ) {
                window.requestAnimationFrame(() => {
                    void switchModel(pending);
                });
            }
        }
    }

    async function switchContent(content) {
        const model = getActiveModel();
        const available = getContentAvailability(model);
        if (!available[content] || content === state.activeContent || state.modelActionBusy) return;

        const oldIndex = CONTENT_ORDER.indexOf(state.activeContent);
        const nextIndex = CONTENT_ORDER.indexOf(content);
        const direction = nextIndex >= oldIndex ? 1 : -1;
        const control = `content-${content}`;

        setModelActionBusy(true, { control });

        try {
            if (content === "logo") {
                await preparePersistentLogoOriginal(model);
            }

            state.activeContent = content;
            state.zoomedOut = false;
            state.viewPan = 0;
            state.viewMagnified = false;
            state.viewDragX = 0;
            state.viewDragY = 0;
            state.kvBackgroundVisible = true;
            renderControls({ animate: false });
            await renderMedia(direction);
        } finally {
            setModelActionBusy(false);
        }
    }

    async function updateModelVariantInPlace(model) {
        const scene = refs.mediaSceneHost.querySelector('.model-media__scene[data-content="model"]');
        if (!scene) return false;
        return updateFixedModelScene(scene, model);
    }

    async function handleChange() {
        const model = getActiveModel();
        if (state.modelActionBusy) return;

        if (state.activeContent === "kv" && model.assets.kvBg) {
            state.changeRotation += 180;
            state.kvBackgroundVisible = !state.kvBackgroundVisible;
            renderControls({ animate: false });

            const scene = refs.mediaSceneHost.querySelector('.model-media__scene[data-content="kv"]');
            const group = scene?.querySelector(".model-media__kv-group");
            if (!group) {
                await renderMedia(0);
                return;
            }
            group.classList.toggle("is-background-hidden", !state.kvBackgroundVisible);
            return;
        }

        if (state.activeContent !== "model" || model.assets.models.length < 2) return;

        setModelActionBusy(true, { control: "change" });

        try {
            const previousVariant = state.modelVariantIndex;
            const nextVariant = (previousVariant + 1) % model.assets.models.length;
            const nextFilename = model.assets.models[nextVariant];
            const nextPath = modelDisplayPath(model, nextFilename, state.zoomedOut);

            await prefetchAssetUrl(nextPath);

            state.modelVariantIndex = nextVariant;
            state.profileExpanded = false;
            state.changeRotation += 180;

            const previousProfileKey = model.profileVariants?.[previousVariant] ? previousVariant : "base";
            const nextProfileKey = model.profileVariants?.[nextVariant] ? nextVariant : "base";
            if (previousProfileKey !== nextProfileKey) renderProfile();

            renderControls({ animate: false });
            if (!await updateModelVariantInPlace(model)) await renderMedia(0);
        } finally {
            setModelActionBusy(false);
        }
    }

    async function handleZoom() {
        if (state.modelActionBusy) return;

        const nextZoom = !state.zoomedOut;
        state.viewMagnified = false;
        state.viewDragX = 0;
        state.viewDragY = 0;

        const scene = refs.mediaSceneHost.querySelector(".model-media__scene");
        if (!scene) {
            state.zoomedOut = nextZoom;
            renderControls();
            await renderMedia(0);
            return;
        }

        if (state.activeContent === "model") {
            const model = getActiveModel();
            const filename = model.assets.models[state.modelVariantIndex] || model.assets.models[0];

            setModelActionBusy(true, { control: "zoom" });
            try {
                await preloadImageUrl(modelDisplayPath(model, filename, nextZoom));
                state.zoomedOut = nextZoom;
                renderControls();
                await updateFixedModelScene(scene, model);
                syncDetailMediaState();
            } finally {
                setModelActionBusy(false);
            }
            return;
        }

        state.zoomedOut = nextZoom;
        renderControls();
        scene.classList.toggle("is-full", state.zoomedOut);
        syncDetailMediaState();
        if (state.activeContent === "view") applyViewTransform(scene);
        scheduleModelParallaxUpdate();
    }

    function applyViewTransform(scene = refs.mediaStage.querySelector(".model-media__scene")) {
        if (!scene || scene.dataset.content !== "view") return;
        const viewport = scene.querySelector("[data-view-viewport]");
        const image = scene.querySelector("[data-view-image]");
        if (!viewport || !image) return;

        const full = scene.classList.contains("is-full");
        scene.classList.toggle("is-view-magnified", state.viewMagnified && !full);
        viewport.classList.toggle("is-draggable", state.viewMagnified && !full);

        if (full) {
            image.style.transform = "translate3d(0, 0, 0) scale(1)";
            return;
        }

        const overflow = Math.max(0, image.offsetWidth - viewport.clientWidth);
        const panX = -(overflow * state.viewPan / 100);
        const scale = state.viewMagnified ? 2 : 1;
        const x = panX + state.viewDragX;
        const y = state.viewDragY;
        image.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    }

    function bindViewInteractions(scene) {
        const range = scene.querySelector("[data-view-range]");
        const magnify = scene.querySelector("[data-view-magnify]");
        const viewport = scene.querySelector("[data-view-viewport]");
        const image = scene.querySelector("[data-view-image]");
        if (!range || !magnify || !viewport || !image) return;

        image.draggable = false;
        image.addEventListener("dragstart", (event) => event.preventDefault());

        range.addEventListener("input", () => {
            state.viewPan = Number(range.value);
            applyViewTransform(scene);
        });

        magnify.addEventListener("click", () => {
            state.viewMagnified = !state.viewMagnified;
            if (!state.viewMagnified) {
                state.viewDragX = 0;
                state.viewDragY = 0;
            }
            magnify.classList.toggle("is-active", state.viewMagnified);
            applyViewTransform(scene);
        });

        let dragging = false;
        let startX = 0;
        let startY = 0;
        let originX = 0;
        let originY = 0;
        let pointerId = null;

        viewport.addEventListener("pointerdown", (event) => {
            if (!state.viewMagnified || scene.classList.contains("is-full")) return;
            event.preventDefault();
            dragging = true;
            pointerId = event.pointerId;
            startX = event.clientX;
            startY = event.clientY;
            originX = state.viewDragX;
            originY = state.viewDragY;
            viewport.classList.add("is-dragging");
            try {
                viewport.setPointerCapture(event.pointerId);
            } catch (_) {
                /* pointer capture非対応時はviewport内のmoveだけで継続する */
            }
        });

        const move = (event) => {
            if (!dragging || event.pointerId !== pointerId) return;
            event.preventDefault();
            state.viewDragX = originX + event.clientX - startX;
            state.viewDragY = originY + event.clientY - startY;
            applyViewTransform(scene);
        };

        const stop = (event) => {
            if (!dragging || event.pointerId !== pointerId) return;
            dragging = false;
            viewport.classList.remove("is-dragging");
            if (viewport.hasPointerCapture?.(event.pointerId)) {
                try {
                    viewport.releasePointerCapture(event.pointerId);
                } catch (_) {
                    /* 既にcapture解除済みなら何もしない */
                }
            }
            pointerId = null;
        };

        viewport.addEventListener("pointermove", move);
        viewport.addEventListener("pointerup", stop);
        viewport.addEventListener("pointercancel", stop);
        viewport.addEventListener("lostpointercapture", stop);
    }



    /* =========================================================
       Works
       ========================================================= */

    const WORKS_IMAGE_BASE = "images/gallery/works";
    const WORKS_FAV_BACKEND_ENABLED = true;
    const WORKS_FAV_WEIGHT = 10;
    const WORKS_ICON_PATHS = {
        change: "images/gallery/live2d/control-icons/change.svg",
        favBefore: "images/gallery/illustration/common/fav-before.svg",
        favAfter: "images/gallery/illustration/common/fav-after.svg",
        x: "images/gallery/live2d/sns-icons/x.svg",
        youtube: "images/gallery/live2d/sns-icons/youtube.svg"
    };

    /*
     * sourcePopularityは公開前の参考値として保持するだけで、並べ替えには使わない。
     * 実際の初期順位はinitialPopularity（1～10点）へ圧縮し、
     * サイト内fav 1件につき10点を加える。
     *
     * fav状態と実fav数は共通Edge Functionsから取得する。
     * publicIdはcontent_itemsの固定UUIDと揃える。
     * カード描画・フィルタ・ソートは既存構造を維持する。
     */
    const WORKS_DATA = [
        {
            id: "MeitoubaraAmagi_c",
            slug: "meitoubara-amagi",
            publicId: "402b8466-cab5-40d9-93c8-a6052bf0b792",
            order: 100,
            published: true,
            category: "commission",
            title: "冥灯薔薇甘棺",
            titleType: "subject",
            subject: "冥灯薔薇甘棺",
            sourceTitle: null,
            workType: "アイコン＆ビジュアル",
            caption: "冥灯薔薇甘棺　アイコン＆ビジュアル",
            captionParts: ["冥灯薔薇甘棺", "アイコン＆ビジュアル"],
            date: "2025-03-01",
            dateLabel: "2025年3月",
            software: "CLIP STUDIO PAINT",
            images: ["MeitoubaraAmagi_c.webp"],
            external: {
                type: "x",
                url: "https://x.com/Amagi_Meitobarq/status/1899410677116355060?s=20"
            },
            sourcePopularity: 750,
            initialPopularity: 7
        },
        {
            id: "HonokaKanon_c",
            slug: "honoka-kanon",
            publicId: "430d572e-5393-41bc-b331-0b326546cc17",
            order: 200,
            published: true,
            category: "commission",
            title: "ほのかかのん",
            titleType: "subject",
            subject: "ほのかかのん",
            sourceTitle: null,
            workType: "アイコン",
            caption: "ほのかかのん　アイコン",
            captionParts: ["ほのかかのん", "アイコン"],
            date: "2025-04-01",
            dateLabel: "2025年4月",
            software: "CLIP STUDIO PAINT",
            images: ["HonokaKanon_c.webp"],
            external: {
                type: "x",
                url: "https://x.com/honokano_V/status/1912716572218863629?s=20"
            },
            sourcePopularity: 150,
            initialPopularity: 2
        },
        {
            id: "Senacha_c",
            slug: "senacha",
            publicId: "24fd869e-bcef-40df-bdeb-4dde9d98f756",
            order: 300,
            published: true,
            category: "commission",
            title: "せなちゃ",
            titleType: "subject",
            subject: "せなちゃ",
            sourceTitle: null,
            workType: "アイコン",
            caption: "せなちゃ　アイコン",
            captionParts: ["せなちゃ", "アイコン"],
            date: "2025-01-01",
            dateLabel: "2025年1月",
            software: "CLIP STUDIO PAINT",
            images: ["Senacha_c.webp"],
            external: {
                type: "x",
                url: "https://x.com/snch_396/status/1876453436813955522?s=20"
            },
            sourcePopularity: 300,
            initialPopularity: 5
        },
        {
            id: "Neige_c",
            slug: "neige",
            publicId: "762df2df-650a-462f-a60b-4c8dd890ec70",
            order: 400,
            published: false,
            category: "commission",
            title: "Neige",
            titleType: "subject",
            subject: "Neige",
            sourceTitle: null,
            workType: "アイコン",
            caption: "Neige　アイコン",
            captionParts: ["Neige", "アイコン"],
            date: "2025-05-01",
            dateLabel: "2025年5月",
            software: "CLIP STUDIO PAINT",
            images: ["Neige_c.webp"],
            external: null,
            sourcePopularity: 250,
            initialPopularity: 3
        },
        {
            id: "SleepingBeauty_p",
            slug: "sleeping-beauty",
            publicId: "bb630f91-1208-47d6-be1b-ae6fcee0d90b",
            order: 500,
            published: true,
            category: "personal",
            title: "眠り姫",
            titleType: "artwork",
            subject: "茨むあん",
            sourceTitle: "無情なマリオネット",
            workType: "MVビジュアル",
            caption: "『眠り姫』　茨むあん『無情なマリオネット』MVビジュアル",
            captionParts: ["『眠り姫』", "茨むあん『無情なマリオネット』", "MVビジュアル"],
            date: "2025-04-01",
            dateLabel: "2025年4月",
            software: "CLIP STUDIO PAINT",
            images: ["SleepingBeauty_p.webp", "SleepingBeauty_p2.webp"],
            external: {
                type: "youtube",
                url: "https://youtu.be/tHR-EsJMvVI?si=NKUCSVTTrPo-mfKT"
            },
            sourcePopularity: 450,
            initialPopularity: 6
        },
        {
            id: "LowTail_p",
            slug: "low-tail",
            publicId: "7d1f9fab-ff53-448a-9af8-02ef4c1fa69c",
            order: 600,
            published: true,
            category: "personal",
            title: "ローテイル",
            titleType: "artwork",
            subject: "病白めめ",
            sourceTitle: "ローテイル",
            workType: "MVビジュアル",
            caption: "病白めめ『ローテイル』　MVビジュアル",
            captionParts: ["病白めめ『ローテイル』", "MVビジュアル"],
            date: "2024-06-01",
            dateLabel: "2024年6月",
            software: "CLIP STUDIO PAINT",
            images: ["LowTail_p.webp", "LowTail_p2.webp"],
            external: {
                type: "youtube",
                url: "https://youtu.be/xuEJznH-tE4?si=1n6Uqy4554xMVbNS"
            },
            sourcePopularity: 2700,
            initialPopularity: 8
        },
        {
            id: "negotiator_p",
            slug: "negotiator",
            publicId: "8df67ff8-66f7-4c99-b7fa-4c488a6e9881",
            order: 700,
            published: true,
            category: "personal",
            title: "negotiator /",
            titleType: "artwork",
            subject: "兎迷夢々",
            sourceTitle: "Killer",
            workType: "MVビジュアル",
            caption: "『negotiator /』　兎迷夢々『Killer』MVビジュアル",
            captionParts: ["『negotiator /』", "兎迷夢々『Killer』", "MVビジュアル"],
            date: "2024-06-01",
            dateLabel: "2024年6月",
            software: "CLIP STUDIO PAINT",
            images: ["negotiator_p.webp"],
            external: {
                type: "youtube",
                url: "https://youtu.be/H4CBrBQiolk?si=r_33vMwUKIUiizQD"
            },
            sourcePopularity: 280,
            initialPopularity: 4
        },
        {
            id: "yumepukari_c",
            slug: "yumepukari",
            publicId: "89f4ceb4-f77d-454d-a6a9-4a1b99b93c88",
            order: 800,
            published: true,
            category: "commission",
            title: "ゆめぷかり",
            titleType: "subject",
            subject: "ゆめぷかり",
            sourceTitle: "げのげ",
            workType: "MVビジュアル",
            caption: "ゆめぷかり『げのげ』MVビジュアル",
            captionParts: ["ゆめぷかり『げのげ』", "MVビジュアル"],
            date: "2025-12-01",
            dateLabel: "2025年12月",
            software: "CLIP STUDIO PAINT",
            images: ["yumepukari_c.webp"],
            external: {
                type: "youtube",
                url: "https://youtu.be/kC9antR3_U0?si=xoS7tX-ViSwqrub_"
            },
            sourcePopularity: 100,
            initialPopularity: 1
        },
        {
            id: "TachibanaHinano_p",
            slug: "tachibana-hinano",
            publicId: "f6d8ca62-a6a1-46a0-9fc0-41958b8ba140",
            order: 900,
            published: true,
            category: "personal",
            title: "橘ひなの",
            titleType: "subject",
            subject: "橘ひなの",
            sourceTitle: null,
            workType: "ファンアート",
            caption: "橘ひなの　ファンアート",
            captionParts: ["橘ひなの", "ファンアート"],
            date: "2024-09-01",
            dateLabel: "2024年9月",
            software: "CLIP STUDIO PAINT",
            images: ["TachibanaHinano_p.webp"],
            external: {
                type: "x",
                url: "https://x.com/Yumikaka_WM/status/1838526290036457898?s=20"
            },
            sourcePopularity: 14000,
            initialPopularity: 10
        },
        {
            id: "MayuzumiX_p",
            slug: "mayuzumi-x",
            publicId: "d9b207fd-f24b-45c0-a1a2-8e6a84d7bd5d",
            order: 1000,
            published: true,
            category: "personal",
            title: "黛灰",
            titleType: "subject",
            subject: "黛灰",
            sourceTitle: null,
            workType: "ファンアート",
            caption: "黛灰　ファンアート",
            captionParts: ["黛灰", "ファンアート"],
            date: "2024-09-01",
            dateLabel: "2024年9月",
            software: "CLIP STUDIO PAINT",
            images: ["MayuzumiX_p.webp"],
            external: {
                type: "x",
                url: "https://x.com/Yumikaka_WM/status/1839681404935852047?s=20"
            },
            sourcePopularity: 7000,
            initialPopularity: 9
        }
    ];

    const worksState = {
        sort: "newest",
        filter: "all",
        favBySlug: new Map(),
        favRevisionBySlug: new Map(),
        imageIndexBySlug: new Map(),
        changeTurnsBySlug: new Map(),
        imageTransitionBySlug: new Map(),
        favRefreshStarted: false
    };

    function worksImagePath(filename) {
        return filename ? resolveAsset(`${WORKS_IMAGE_BASE}/${filename}`) : "";
    }

    function worksSetMask(element, path) {
        if (!element) return;
        const value = `url('${path}')`;
        element.style.maskImage = value;
        element.style.webkitMaskImage = value;
    }

    function worksFavStorageKey(work) {
        return `works_mock_fav_${work.slug}`;
    }

    function worksFavRevision(slug) {
        return worksState.favRevisionBySlug.get(slug) || 0;
    }

    function worksBumpFavRevision(slug) {
        const next = worksFavRevision(slug) + 1;
        worksState.favRevisionBySlug.set(slug, next);
        return next;
    }

    function worksReadMockFav(work) {
        return localStorage.getItem(worksFavStorageKey(work)) === "1";
    }

    function worksWriteMockFav(work, favored) {
        localStorage.setItem(worksFavStorageKey(work), favored ? "1" : "0");
    }

    async function getWorksFavState(work) {
        if (!WORKS_FAV_BACKEND_ENABLED) {
            const favored = worksReadMockFav(work);
            return { favored, favCount: favored ? 1 : 0, source: "mock" };
        }

        const response = await communityApiRequest("get-content-state", {
            content_type: "works",
            content_slug: work.slug,
            visitor_id: communityVisitorId()
        });

        return {
            favored: Boolean(response?.favored),
            favCount: Number.isFinite(response?.fav_count) ? response.fav_count : 0,
            source: "supabase"
        };
    }

    async function toggleWorksFav(work, desiredFavored) {
        if (!WORKS_FAV_BACKEND_ENABLED) {
            worksWriteMockFav(work, desiredFavored);
            return {
                favored: desiredFavored,
                favCount: desiredFavored ? 1 : 0,
                source: "mock"
            };
        }

        const response = await communityApiRequest("toggle-reaction", {
            target_type: "content",
            content_type: "works",
            content_slug: work.slug,
            reaction_type: "fav",
            visitor_id: communityVisitorId(),
            desired_active: desiredFavored,
            include_count: false
        });

        return {
            favored: typeof response?.favored === "boolean"
                ? response.favored
                : typeof response?.active === "boolean"
                ? response.active
                : desiredFavored,
            favCount: Number.isFinite(response?.fav_count)
                ? response.fav_count
                : Number.isFinite(response?.reaction_count)
                ? response.reaction_count
                : null,
            source: "supabase"
        };
    }

    function worksHydrateFavState() {
        WORKS_DATA.forEach((work) => {
            if (!work.published) return;
            const favored = worksReadMockFav(work);
            worksState.favBySlug.set(work.slug, {
                favored,
                favCount: favored ? 1 : 0
            });
        });
    }

    function worksFavRecord(work) {
        return worksState.favBySlug.get(work.slug) || { favored: false, favCount: 0 };
    }

    function worksPopularityScore(work) {
        return work.initialPopularity + worksFavRecord(work).favCount * WORKS_FAV_WEIGHT;
    }

    function worksVisibleData() {
        const filtered = WORKS_DATA.filter((work) =>
            work.published
            && (worksState.filter === "all" || work.category === worksState.filter)
        );

        return filtered.sort((a, b) => {
            if (worksState.sort === "popular") {
                const scoreDifference = worksPopularityScore(b) - worksPopularityScore(a);
                if (scoreDifference !== 0) return scoreDifference;

                const favDifference = worksFavRecord(b).favCount - worksFavRecord(a).favCount;
                if (favDifference !== 0) return favDifference;
            }

            const dateDifference = b.date.localeCompare(a.date);
            if (dateDifference !== 0) return dateDifference;
            return a.order - b.order;
        });
    }

    function worksCategoryLabel(work) {
        return work.category === "commission" ? "Commission" : "Personal";
    }

    function worksExternalLabel(work) {
        return work.external?.type === "youtube" ? "YouTubeで作品を見る" : "Xで作品を見る";
    }

    function worksCreateActionIcon(path) {
        return `<span class="works-action__icon" aria-hidden="true" style="mask-image:url('${path}');-webkit-mask-image:url('${path}');"></span>`;
    }

    function worksCreateCaption(work) {
        const parts = Array.isArray(work.captionParts) && work.captionParts.length
            ? work.captionParts
            : [work.caption];

        return parts
            .map((part) => `<span class="works-card__title-part">${part}</span>`)
            .join("");
    }

    function worksCreateCard(work) {
        const imageIndex = worksState.imageIndexBySlug.get(work.slug) || 0;
        const image = work.images[imageIndex] || work.images[0];
        const fav = worksFavRecord(work);
        const changeTurns = worksState.changeTurnsBySlug.get(work.slug) || 0;
        const changeButton = work.images.length > 1
            ? `
                <button class="works-action works-action--change" type="button"
                    data-works-change="${work.slug}"
                    style="--works-change-rotation:${changeTurns * 180}deg"
                    aria-label="作品画像を切り替える">
                    ${worksCreateActionIcon(WORKS_ICON_PATHS.change)}
                </button>`
            : "";
        const favIcon = fav.favored ? WORKS_ICON_PATHS.favAfter : WORKS_ICON_PATHS.favBefore;
        const external = work.external?.url
            ? `
                <a class="works-card__external" href="${work.external.url}" target="_blank"
                    rel="noopener noreferrer" aria-label="${worksExternalLabel(work)}">
                    ${worksCreateActionIcon(WORKS_ICON_PATHS[work.external.type])}
                </a>`
            : "";

        return `
            <article class="works-card" data-works-card="${work.slug}">
                <figure class="works-card__figure">
                    <img class="works-card__image" data-works-image
                        src="${worksImagePath(image)}"
                        alt="${work.caption}"
                        loading="lazy" decoding="async" draggable="false">
                </figure>

                <div class="works-card__caption">
                    <div class="works-card__copy">
                        <p class="works-card__title-line">
                            <span class="works-card__category works-card__category--${work.category}">${worksCategoryLabel(work)}</span>
                            <span class="works-card__title">${worksCreateCaption(work)}</span>
                        </p>
                        <p class="works-card__meta">${work.dateLabel} ${work.software}</p>
                    </div>

                    <div class="works-card__actions" aria-label="作品操作">
                        ${changeButton}
                        <button class="works-action works-action--fav${fav.favored ? " is-favored" : ""}" type="button"
                            data-works-fav="${work.slug}" aria-pressed="${fav.favored}"
                            aria-label="${fav.favored ? "作品のfavを解除する" : "作品をfavする"}">
                            ${worksCreateActionIcon(favIcon)}
                        </button>
                        ${external}
                    </div>
                </div>
            </article>`;
    }

    function worksSyncToolbar() {
        refs.worksSort.dataset.sort = worksState.sort;
        refs.worksSortLabel.textContent = worksState.sort === "newest" ? "新しい順" : "人気順";
        refs.worksSort.setAttribute(
            "aria-label",
            worksState.sort === "newest" ? "人気順へ切り替える" : "新しい順へ切り替える"
        );

        refs.works.querySelectorAll("[data-works-filter]").forEach((button) => {
            const active = button.dataset.worksFilter === worksState.filter;
            button.classList.toggle("is-active", active);
            button.setAttribute("aria-pressed", String(active));
        });
    }

    function worksRender() {
        const works = worksVisibleData();
        refs.worksList.innerHTML = works.map(worksCreateCard).join("");
        refs.worksEmpty.hidden = works.length > 0;
        worksSyncToolbar();
    }

    function worksFind(slug) {
        return WORKS_DATA.find((work) => work.slug === slug && work.published) || null;
    }

    function worksSyncFavButton(button, work, record) {
        if (!button) return;
        button.classList.toggle("is-favored", record.favored);
        button.setAttribute("aria-pressed", String(record.favored));
        button.setAttribute("aria-label", record.favored ? "作品のfavを解除する" : "作品をfavする");
        worksSetMask(
            button.querySelector(".works-action__icon"),
            record.favored ? WORKS_ICON_PATHS.favAfter : WORKS_ICON_PATHS.favBefore
        );
    }

    function worksRetryFavInBackground(work, desiredFavored, previous, revision, cycle = 0) {
        const delay = cycle === 0 ? 4000 : 12000;
        window.setTimeout(async () => {
            if (worksFavRevision(work.slug) !== revision) return;
            if (worksFavRecord(work).favored !== desiredFavored) return;

            try {
                const next = await toggleWorksFav(work, desiredFavored);
                if (worksFavRevision(work.slug) !== revision) return;

                const confirmedFavored = typeof next.favored === "boolean"
                    ? next.favored
                    : desiredFavored;
                const current = worksFavRecord(work);
                worksState.favBySlug.set(work.slug, {
                    favored: confirmedFavored,
                    favCount: Number.isFinite(next.favCount) ? next.favCount : current.favCount
                });
                worksWriteMockFav(work, confirmedFavored);

                const currentButton = refs.works.querySelector(`[data-works-fav="${work.slug}"]`);
                currentButton?.classList.remove("is-unsynced");
                if (worksState.sort === "popular") worksRender();
                else worksSyncFavButton(currentButton, work, worksFavRecord(work));
            } catch (error) {
                if (worksFavRevision(work.slug) !== revision) return;
                if (isRecoverableReactionError(error) && cycle < 1) {
                    worksRetryFavInBackground(work, desiredFavored, previous, revision, cycle + 1);
                    return;
                }
                if (!isRecoverableReactionError(error)) {
                    worksState.favBySlug.set(work.slug, previous);
                    worksWriteMockFav(work, previous.favored);
                    const currentButton = refs.works.querySelector(`[data-works-fav="${work.slug}"]`);
                    currentButton?.classList.remove("is-unsynced");
                    worksSyncFavButton(currentButton, work, previous);
                }
            }
        }, delay);
    }

    async function worksHandleFav(button, work) {
        if (button.disabled) return;
        const revision = worksBumpFavRevision(work.slug);
        const previous = { ...worksFavRecord(work) };
        const optimistic = {
            favored: !previous.favored,
            favCount: Math.max(0, previous.favCount + (previous.favored ? -1 : 1))
        };

        /*
         * API応答を待たず、クリック直後にfav表示だけを切り替える。
         * desired_activeも送るため、端末内キャッシュとDB状態が一時的に
         * 食い違っていても、意図した状態へ確定できる。
         */
        worksState.favBySlug.set(work.slug, optimistic);
        worksWriteMockFav(work, optimistic.favored);
        worksSyncFavButton(button, work, optimistic);
        button.disabled = true;
        button.classList.add("is-pending");
        button.setAttribute("aria-busy", "true");

        try {
            const next = await toggleWorksFav(work, optimistic.favored);
            if (worksFavRevision(work.slug) !== revision) return;

            const confirmedFavored = typeof next.favored === "boolean"
                ? next.favored
                : optimistic.favored;
            const confirmedFavCount = Number.isFinite(next.favCount)
                ? next.favCount
                : Math.max(
                    0,
                    previous.favCount
                        + (confirmedFavored ? 1 : 0)
                        - (previous.favored ? 1 : 0)
                );

            worksState.favBySlug.set(work.slug, {
                favored: confirmedFavored,
                favCount: confirmedFavCount
            });
            worksWriteMockFav(work, confirmedFavored);

            if (worksState.sort === "popular") {
                worksRender();
            } else {
                worksSyncFavButton(button, work, worksFavRecord(work));
            }
        } catch (error) {
            if (worksFavRevision(work.slug) !== revision) return;
            console.error("Worksのfav切替に失敗しました。", error);

            if (isRecoverableReactionError(error)) {
                button.classList.add("is-unsynced");
                worksRetryFavInBackground(work, optimistic.favored, previous, revision);
            } else {
                worksState.favBySlug.set(work.slug, previous);
                worksWriteMockFav(work, previous.favored);
                worksSyncFavButton(button, work, previous);
            }
        } finally {
            if (worksFavRevision(work.slug) === revision) {
                const currentButton = refs.works.querySelector(`[data-works-fav="${work.slug}"]`);
                if (currentButton) {
                    currentButton.disabled = false;
                    currentButton.classList.remove("is-pending");
                    currentButton.removeAttribute("aria-busy");
                }
            }
        }
    }

    async function worksRunImageChange(button, work) {
        let transition = worksState.imageTransitionBySlug.get(work.slug);
        if (!transition) {
            transition = { running: false, pending: false };
            worksState.imageTransitionBySlug.set(work.slug, transition);
        }

        if (transition.running) {
            transition.pending = true;
            return;
        }

        transition.running = true;
        try {
            do {
                transition.pending = false;
                const card = refs.works.querySelector(`[data-works-card="${work.slug}"]`);
                const image = card?.querySelector("[data-works-image]");
                const currentButton = card?.querySelector(`[data-works-change="${work.slug}"]`);
                if (!image || !currentButton) return;

                const nextIndex = ((worksState.imageIndexBySlug.get(work.slug) || 0) + 1) % work.images.length;
                const nextPath = worksImagePath(work.images[nextIndex]);
                const nextTurns = (worksState.changeTurnsBySlug.get(work.slug) || 0) + 1;
                worksState.changeTurnsBySlug.set(work.slug, nextTurns);
                currentButton.style.setProperty("--works-change-rotation", `${nextTurns * 180}deg`);

                const preload = new Image();
                preload.src = nextPath;
                await decodeImage(preload);

                const incoming = document.createElement("img");
                incoming.className = "works-card__image works-card__image--incoming";
                incoming.src = nextPath;
                incoming.alt = "";
                incoming.setAttribute("aria-hidden", "true");
                incoming.draggable = false;
                image.parentElement.append(incoming);

                await nextPaint();

                image.classList.add("is-fading-out");
                incoming.classList.add("is-visible");

                await wait(240);

                worksState.imageIndexBySlug.set(work.slug, nextIndex);

                image.classList.add("is-no-transition");
                image.src = nextPath;
                image.alt = work.caption;
                image.classList.remove("is-fading-out");

                await nextPaint();

                incoming.remove();

                await nextPaint();

                image.classList.remove("is-no-transition");

                await wait(20);
            } while (transition.pending);
        } finally {
            transition.running = false;
            transition.pending = false;
        }
    }

    function worksBindEvents() {
        refs.works.addEventListener("click", (event) => {
            const sort = event.target.closest("[data-works-sort]");
            if (sort) {
                worksState.sort = worksState.sort === "newest" ? "popular" : "newest";
                worksRender();
                return;
            }

            const filter = event.target.closest("[data-works-filter]");
            if (filter) {
                worksState.filter = filter.dataset.worksFilter;
                worksRender();
                return;
            }

            const fav = event.target.closest("[data-works-fav]");
            if (fav) {
                const work = worksFind(fav.dataset.worksFav);
                if (work) void worksHandleFav(fav, work);
                return;
            }

            const change = event.target.closest("[data-works-change]");
            if (change) {
                const work = worksFind(change.dataset.worksChange);
                if (work) void worksRunImageChange(change, work);
            }
        });
    }

    async function worksRefreshFavState() {
        const published = WORKS_DATA.filter((work) => work.published);
        const results = await Promise.allSettled(published.map(async (work) => {
            const revision = worksFavRevision(work.slug);
            const response = await getWorksFavState(work);

            /*
             * 取得開始後にユーザー操作があった場合、古い取得結果で
             * 楽観的更新を上書きしない。
             */
            if (worksFavRevision(work.slug) !== revision) return;

            worksState.favBySlug.set(work.slug, {
                favored: Boolean(response.favored),
                favCount: Number.isFinite(response.favCount) ? response.favCount : 0
            });
        }));

        if (results.some((result) => result.status === "rejected")) {
            console.warn("一部のWorks fav状態を取得できませんでした。");
        }
        if (state.category === "works") worksRender();
    }

    /* =========================================================
       Illustration / 色かさね
       ========================================================= */

    const COMMUNITY_API_BASE = "https://atmsoeyldykwhnobxiin.supabase.co/functions/v1";
    const IRO_LONG_PRESS_MS = 80;
    const IRO_SWIPE_THRESHOLD = 54;
    const IRO_KASANE_SERIES_ID = "4ef4a4c5-2fb5-45ed-9448-286cb411408f";

    const ILLUSTRATION_SERIES = [
        {
            id: IRO_KASANE_SERIES_ID,
            type: "illustration-series",
            slug: "iro-kasane",
            title: "色かさね",
            presentation: "ink-ball",
            publication: { state: "public", publishAt: null, unpublishAt: null },
            sortOrder: 10
        }
    ];

    const ILLUSTRATION_WORKS = [
        {
            id: "6264e5b8-0b18-4fa1-a66d-2560ec14beb0",
            type: "illustration",
            seriesId: IRO_KASANE_SERIES_ID,
            slug: "yamabuki",
            publication: { state: "public", publishAt: null, unpublishAt: null },
            sections: { preview: true, detail: true, diary: true, comments: true },
            sortOrder: 100,
            diaryEntry: "yamabuki",
            title: "山吹",
            roman: "yamabuki",
            uiColor: "#F7AD00",
            barMain: "#C58C0C",
            barSub: ["#E1CF1D", "#BF720A", "#A99558", "#D2C99F", "#466559", "#6F4469", "#D6A787"],
            imageBase: "images/gallery/illustration/IroKasane",
            background: "yamabuki-bg.webp",
            character: "yamabuki.webp",
            date: "2026/05",
            xUrl: "https://x.com/Yumikaka_WM/status/2051617907017433459?s=20",
            example: "例：メイクに命かけてそう、など",
        },
        {
            id: "be333c2c-c76d-4ddc-9a54-516144e97fb4",
            type: "illustration",
            seriesId: IRO_KASANE_SERIES_ID,
            slug: "wakakusa",
            publication: { state: "public", publishAt: null, unpublishAt: null },
            sections: { preview: true, detail: true, diary: true, comments: true },
            sortOrder: 200,
            diaryEntry: "wakakusa",
            title: "若草",
            roman: "wakakusa",
            uiColor: "#A7B716",
            barMain: "#B4BC2A",
            barSub: ["#ACAD59", "#8D9672", "#7B7F6A", "#7D6C7C", "#A28EA0", "#D2A887", "#F5F5D5"],
            imageBase: "images/gallery/illustration/IroKasane",
            background: "wakakusa-bg.webp",
            character: "wakakusa.webp",
            date: "2026/06",
            xUrl: "https://x.com/Yumikaka_WM/status/2067200582922731941?s=20",
            example: "例：さらっとエグい要求をしてきそう、など",
        },
        {
            id: "9feb721a-ea3f-4383-a67e-2b42c7c7b664",
            type: "illustration",
            seriesId: IRO_KASANE_SERIES_ID,
            slug: "kamenozoki",
            publication: { state: "public", publishAt: null, unpublishAt: null },
            sections: { preview: true, detail: true, diary: true, comments: true },
            sortOrder: 300,
            diaryEntry: "kamenozoki",
            title: "瓶覗",
            roman: "kamenozoki",
            uiColor: "#83B6C1",
            barMain: "#B8E2E6",
            barSub: ["#76DCDF", "#4C6F87", "#324554", "#866696", "#D4B8A7", "#E7E581", "#E6E7E6"],
            imageBase: "images/gallery/illustration/IroKasane",
            background: "kamenozoki-bg.webp",
            character: "kamenozoki.webp",
            date: "2026/07",
            xUrl: "https://x.com/Yumikaka_WM/status/2074803177585508545?s=20",
            example: "例：どんなに暑くても涼しい顔してそう、など",
        },
        {
            id: "4ea84699-769a-4025-8731-c668348103b2",
            type: "illustration",
            seriesId: IRO_KASANE_SERIES_ID,
            slug: "nadeshiko",
            publication: { state: "public", publishAt: null, unpublishAt: null },
            sections: { preview: true, detail: true, diary: true, comments: true },
            sortOrder: 400,
            diaryEntry: "nadeshiko",
            title: "撫子",
            roman: "nadeshiko",
            uiColor: "#F4B4CC",
            barMain: "#EDAAB6",
            barSub: ["#E48898", "#AF445D", "#FADEE3", "#A5777D", "#302626", "#806A68", "#E1ACA4", "#9BA79E"],
            imageBase: "images/gallery/illustration/IroKasane",
            background: "nadeshiko-bg.webp",
            character: "nadeshiko.webp",
            date: "2026/08",
            xUrl: "https://x.com/Yumikaka_WM/status/2090023470050824508?s=20",
            example: "例：口は悪いけど許されてそう、など",
        },
        {
            id: "ea8bf750-3ad8-45ce-87cd-6c4a7c49cbc8",
            type: "illustration",
            seriesId: IRO_KASANE_SERIES_ID,
            slug: "ominaeshi",
            publication: { state: "partial", publishAt: null, unpublishAt: null },
            sections: { preview: true, detail: false, diary: false, comments: false },
            sortOrder: 500,
            diaryEntry: null,
            title: "女郎花",
            roman: "ominaeshi",
            uiColor: "#F2F2B0"
        },
        {
            id: "220d68bf-9693-41c6-b84b-5b248a078e70",
            type: "illustration",
            seriesId: IRO_KASANE_SERIES_ID,
            slug: "kikujin",
            publication: { state: "partial", publishAt: null, unpublishAt: null },
            sections: { preview: true, detail: false, diary: false, comments: false },
            sortOrder: 600,
            diaryEntry: null,
            title: "麹塵",
            roman: "kikujin",
            uiColor: "#6E7955"
        }
    ];

    function illustrationSeriesById(seriesId) {
        return ILLUSTRATION_SERIES.find((series) => series.id === seriesId) || null;
    }

    function isIllustrationPreviewVisible(work) {
        const series = illustrationSeriesById(work.seriesId);
        return Boolean(
            series
            && series.presentation === "ink-ball"
            && publicationHasState(series, PUBLICATION_VISIBLE_STATES)
            && publicationHasState(work, PUBLICATION_VISIBLE_STATES)
            && work.sections?.preview === true
        );
    }

    function canOpenIllustrationDetail(work) {
        return publicationHasState(work, PUBLICATION_DETAIL_STATES)
            && work.sections?.detail === true;
    }

    let IRO_PREVIEW_WORKS = [];
    let IRO_DETAIL_WORKS = [];

    function refreshIllustrationPublicationLists() {
        IRO_PREVIEW_WORKS = ILLUSTRATION_WORKS
            .filter(isIllustrationPreviewVisible)
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        IRO_DETAIL_WORKS = IRO_PREVIEW_WORKS.filter(canOpenIllustrationDetail);
    }

    refreshIllustrationPublicationLists();

    const iroState = {
        mode: "intro",
        activeIndex: 0,
        zoomedOut: false,
        transitioning: false,
        pendingSwitchDirection: 0,
        diaryCloseTimer: 0,
        paletteOrder: new Map(),
        paletteSelectedColor: new Map(),
        paletteDrag: null,
        introAnimationFrame: 0,
        introBalls: [],
        canvasMetrics: null,
        canvasLastTime: 0,
        canvasLayoutWidth: 0,
        canvasPointerId: null,
        canvasDragBall: null,
        canvasPendingDrag: null,
        canvasStartToken: 0,
        commentScrollFrame: 0,
        swipePointerId: null,
        swipeStartX: 0,
        swipeStartY: 0,
        swipeBlocked: false,
        favRevisionBySlug: new Map()
    };

    function iroWorkPath(work, filename) {
        return filename ? resolveAsset(`${work.imageBase}/${filename}`) : "";
    }

    function iroCurrentWork() {
        return IRO_DETAIL_WORKS[iroState.activeIndex];
    }

    function communityVisitorId() {
        const key = "kotonoura_visitor_id";
        let value = localStorage.getItem(key);
        if (value) return value;
        value = globalThis.crypto?.randomUUID?.()
            || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
        localStorage.setItem(key, value);
        return value;
    }

    function iroFavKey(slug) {
        return `iro_fav_${slug}`;
    }

    function iroLocalFav(slug) {
        return localStorage.getItem(iroFavKey(slug)) === "1";
    }

    function iroSetLocalFav(slug, favored) {
        localStorage.setItem(iroFavKey(slug), favored ? "1" : "0");
    }

    function iroFavRevision(slug) {
        return iroState.favRevisionBySlug.get(slug) || 0;
    }

    function iroBumpFavRevision(slug) {
        const next = iroFavRevision(slug) + 1;
        iroState.favRevisionBySlug.set(slug, next);
        return next;
    }

    function iroCommentSubmittedKey(slug) {
        return `iro_comment_submitted_${slug}`;
    }

    function iroHasSubmittedComment(slug) {
        return localStorage.getItem(iroCommentSubmittedKey(slug)) === "1";
    }

    function iroMarkCommentSubmitted(slug) {
        localStorage.setItem(iroCommentSubmittedKey(slug), "1");
    }

    const IRO_API_ERROR_MESSAGES = {
        origin_not_allowed: "このページからは通信できません。",
        method_not_allowed: "通信方法が正しくありません。",
        invalid_content_type: "送信形式が正しくありません。",
        invalid_json: "送信内容を読み取れませんでした。",
        invalid_input: "送信内容が正しくありません。",
        artwork_not_found: "作品情報が見つかりませんでした。",
        content_not_found: "作品情報が見つかりませんでした。",
        fav_closed: "現在、この作品のfav受付は停止しています。",
        reaction_closed: "現在、この作品のfav受付は停止しています。",
        comment_reaction_closed: "現在、このコメントのfav受付は停止しています。",
        visitor_blocked: "現在、このブラウザからの投稿・fav操作は停止されています。",
        comment_closed: "現在、この作品への解釈受付は停止しています。",
        rate_limited: "操作が続いています。少し待ってからお試しください。",
        artwork_comment_rate_limited: "同じ作品への送信は、10分ほど空けてください。",
        content_comment_rate_limited: "同じ作品への送信は、10分ほど空けてください。",
        daily_comment_limit_reached: "本日の送信上限に達しました。",
        duplicate_comment: "同じ内容はすでに受け取っています。",
        invalid_display_name: "表示名が正しくありません。",
        display_name_too_long: "表示名は20文字以内で入力してください。",
        invalid_body: "本文が正しくありません。",
        body_required: "本文を入力してください。",
        body_too_long: "本文は80文字以内で入力してください。",
        html_not_allowed: "HTMLを含む内容は送信できません。",
        url_not_allowed: "URLを含む内容は送信できません。",
        internal_error: "通信処理で問題が発生しました。時間を空けてお試しください。"
    };

    async function communityApiRequest(endpoint, payload) {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 10000);

        try {
            const response = await fetch(`${COMMUNITY_API_BASE.replace(/\/$/, "")}/${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                signal: controller.signal
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                const code = typeof data.error === "string" ? data.error : "";
                const error = new Error(IRO_API_ERROR_MESSAGES[code] || "通信に失敗しました。");
                error.code = code || "request_failed";
                error.status = response.status;
                error.retryAfterMs = Number(response.headers.get("Retry-After")) * 1000 || 0;
                throw error;
            }
            return data;
        } catch (error) {
            if (error?.name === "AbortError") {
                const timeoutError = new Error("通信がタイムアウトしました。時間を空けてお試しください。");
                timeoutError.code = "request_timeout";
                timeoutError.status = 0;
                throw timeoutError;
            }
            if (error instanceof TypeError && !Number.isFinite(error.status)) {
                const networkError = new Error("通信できませんでした。少し時間を空けて再度お試しください。");
                networkError.code = "network_error";
                networkError.status = 0;
                throw networkError;
            }
            throw error;
        } finally {
            window.clearTimeout(timeoutId);
        }
    }

    function communityWait(milliseconds) {
        return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
    }

    function isRecoverableReactionError(error) {
        const status = Number(error?.status) || 0;
        return status === 0
            || status === 408
            || status === 425
            || status === 429
            || status >= 500
            || error?.code === "network_error"
            || error?.code === "request_timeout"
            || error?.code === "internal_error"
            || error?.code === "rate_limited";
    }

    async function requestReactionWithRetry(payload, revisionIsCurrent) {
        const delays = [0, 650, 2200];
        let lastError = null;

        for (let attempt = 0; attempt < delays.length; attempt += 1) {
            if (!revisionIsCurrent()) return null;
            const delay = Math.max(delays[attempt], Number(lastError?.retryAfterMs) || 0);
            if (delay > 0) await communityWait(delay);
            if (!revisionIsCurrent()) return null;

            try {
                return await communityApiRequest("toggle-reaction", payload);
            } catch (error) {
                lastError = error;
                if (!isRecoverableReactionError(error)) throw error;
            }
        }

        if (lastError) lastError.recoverableExhausted = true;
        throw lastError || new Error("通信に失敗しました。");
    }

    function iroSetTransitionColor(color) {
        refs.illustration.style.setProperty("--transition-color", color);
    }

    function iroApplyTheme(color) {
        refs.illustration.style.setProperty("--theme-color", color);
        document.body.style.setProperty("--iro-ui-color", color);
        document.body.style.setProperty("--site-theme-color", color);
        document.body.style.setProperty("--site-theme-contrast", "#000");
        document.body.classList.add("gallery-illustration-themed");
    }

    function iroSetTheme(work) {
        iroApplyTheme(work.uiColor);
    }

    function iroClearTheme() {
        refs.illustration?.style.removeProperty("--theme-color");
        refs.illustration?.style.setProperty("--transition-color", "#fff");
        document.body.style.removeProperty("--iro-ui-color");
        document.body.style.removeProperty("--site-theme-color");
        document.body.style.removeProperty("--site-theme-contrast");
        document.body.classList.remove("gallery-illustration-themed");
    }

    function iroPaletteColors(work) {
        return iroState.paletteOrder.get(work.slug) || [work.barMain, ...work.barSub];
    }

    function iroSelectedPaletteColor(work) {
        return iroState.paletteSelectedColor.get(work.slug) || work.barMain;
    }

    function iroCreatePaletteBar(color, index, selected, extraClass = "") {
        const bar = document.createElement("button");
        bar.className = `iro-palette__bar${selected ? " is-expanded" : ""}${extraClass ? ` ${extraClass}` : ""}`;
        bar.type = "button";
        bar.dataset.iroBarIndex = String(index);
        bar.dataset.iroBarColor = color;
        bar.style.setProperty("--bar-color", color);
        bar.setAttribute("aria-label", `配色 ${index + 1}`);
        bar.setAttribute("aria-pressed", String(selected));
        return bar;
    }

    function iroPaletteReindex() {
        refs.iroPalette.querySelectorAll("[data-iro-bar-index]").forEach((bar, index) => {
            bar.dataset.iroBarIndex = String(index);
            bar.setAttribute("aria-label", `配色 ${index + 1}`);
        });
    }

    function iroRenderPalette(work, { stack = false } = {}) {
        const colors = iroPaletteColors(work);
        const selectedColor = iroSelectedPaletteColor(work);
        refs.iroPalette.replaceChildren(...colors.map((color, index) => {
            const bar = iroCreatePaletteBar(color, index, color === selectedColor, stack ? "is-stacking" : "");
            if (stack) bar.style.setProperty("--bar-delay", `${index * 78}ms`);
            return bar;
        }));
        if (stack) {
            window.setTimeout(() => {
                refs.iroPalette.querySelectorAll(".is-stacking").forEach((bar) => bar.classList.remove("is-stacking"));
            }, 900);
        }
    }

    function iroTransitionPalette(work) {
        const colors = iroPaletteColors(work);
        const selectedColor = iroSelectedPaletteColor(work);
        const current = [...refs.iroPalette.querySelectorAll("[data-iro-bar-index]")];
        const common = Math.min(current.length, colors.length);

        for (let index = 0; index < common; index += 1) {
            const bar = current[index];
            const color = colors[index];
            bar.dataset.iroBarColor = color;
            bar.style.setProperty("--bar-color", color);
            const selected = color === selectedColor;
            bar.classList.toggle("is-expanded", selected);
            bar.setAttribute("aria-pressed", String(selected));
        }

        if (colors.length > current.length) {
            for (let index = current.length; index < colors.length; index += 1) {
                const color = colors[index];
                const bar = iroCreatePaletteBar(color, index, color === selectedColor, "is-joining");
                bar.style.setProperty("--bar-delay", `${(index - current.length) * 90}ms`);
                refs.iroPalette.append(bar);
                window.setTimeout(() => bar.classList.remove("is-joining"), 760 + (index - current.length) * 90);
            }
        } else if (colors.length < current.length) {
            current.slice(colors.length).forEach((bar, index) => {
                bar.style.setProperty("--bar-delay", `${index * 60}ms`);
                bar.classList.add("is-leaving");
                window.setTimeout(() => bar.remove(), 300 + index * 60);
            });
        }

        window.setTimeout(iroPaletteReindex, 500);
    }

    function iroSelectPaletteBar(bar) {
        const work = iroCurrentWork();
        const color = bar.dataset.iroBarColor;
        iroState.paletteSelectedColor.set(work.slug, color);
        refs.iroPalette.querySelectorAll("[data-iro-bar-index]").forEach((item) => {
            const selected = item === bar;
            item.classList.toggle("is-expanded", selected);
            item.setAttribute("aria-pressed", String(selected));
        });
    }

    function iroMaskUrl(element, path) {
        const value = `url('${path}')`;
        element.style.maskImage = value;
        element.style.webkitMaskImage = value;
    }

    function iroUpdateFavButton(work) {
        const favored = iroLocalFav(work.slug);
        refs.iroFav.classList.toggle("is-favored", favored);
        refs.iroFav.setAttribute("aria-pressed", String(favored));
        refs.iroFav.setAttribute("aria-label", favored ? "作品のfavを解除する" : "作品をfavする");
    }

    async function iroSyncFavState(work) {
        const requestedSlug = work.slug;
        const revision = iroFavRevision(requestedSlug);
        refs.iroFav.disabled = true;
        refs.iroFav.classList.add("is-syncing");
        refs.iroFav.setAttribute("aria-busy", "true");

        try {
            const response = await communityApiRequest("get-content-state", {
                content_type: "illustration",
                content_slug: requestedSlug,
                visitor_id: communityVisitorId()
            });

            if (iroFavRevision(requestedSlug) !== revision) return;
            if (typeof response?.favored !== "boolean") return;
            iroSetLocalFav(requestedSlug, response.favored);

            if (iroCurrentWork().slug === requestedSlug) {
                iroUpdateFavButton(work);
            }
        } catch (error) {
            console.error("fav状態の取得に失敗しました。", error);
        } finally {
            if (
                iroCurrentWork().slug === requestedSlug
                && iroFavRevision(requestedSlug) === revision
            ) {
                refs.iroFav.disabled = false;
                refs.iroFav.classList.remove("is-syncing");
                refs.iroFav.removeAttribute("aria-busy");
            }
        }
    }

    function iroSetKanjiText(text) {
        refs.iroRevealKanji.replaceChildren(...Array.from(text, (character) => {
            const span = document.createElement("span");
            span.textContent = character;
            return span;
        }));
    }

    function iroCqw(value) {
        const width = refs.illustration?.getBoundingClientRect().width || GALLERY_DESIGN_WIDTH;
        return width * value / 100;
    }

    async function iroSyncSharedCopyLayout(mode = "work", requestedCount = null) {
        const characterCount = Math.max(
            1,
            Number.isFinite(requestedCount) ? requestedCount : refs.iroRevealKanji.children.length
        );

        if (mode === "reveal") {
            const titleTop = iroCqw(58);
            const kanjiHeight = characterCount * iroCqw(20 * 0.92);
            const waterlineY = titleTop + kanjiHeight;
            const romanTop = waterlineY + iroCqw(2.8);
            const paletteTop = romanTop + iroCqw(3 + 4);

            refs.illustration.style.setProperty("--iro-reveal-kanji-height", `${kanjiHeight}px`);
            refs.illustration.style.setProperty("--iro-reveal-roman-top", `${romanTop}px`);
            refs.illustration.style.setProperty("--iro-reveal-palette-top", `${paletteTop}px`);
            refs.iroIntro.style.setProperty("--iro-waterline-y", `${waterlineY}px`);
            await nextPaint();
            return;
        }

        const kanjiHeight = characterCount * iroCqw(12.5 * 0.94);
        const titleTop = iroCqw(4.8);
        const romanTop = titleTop + kanjiHeight + iroCqw(3);
        const visualTop = romanTop + iroCqw(7.4);
        const arrowTop = titleTop + Math.max(0, (kanjiHeight - iroCqw(3.8)) / 2);
        const toolsTop = romanTop - iroCqw(1.6);
        const visualHeight = iroCqw(198);

        refs.illustration.style.setProperty("--iro-kanji-block-height", `${kanjiHeight}px`);
        refs.illustration.style.setProperty("--iro-work-roman-top", `${romanTop}px`);
        refs.illustration.style.setProperty("--iro-work-arrow-top", `${arrowTop}px`);
        refs.illustration.style.setProperty("--iro-work-tools-top", `${toolsTop}px`);
        refs.illustration.style.setProperty("--iro-work-visual-top", `${visualTop}px`);
        refs.iroIntro.style.setProperty("--iro-transition-height", `${Math.ceil(visualTop + visualHeight)}px`);
        await nextPaint();
    }

    function iroSyncZoomMetrics() {
        const character = refs.iroFluidCharacter;
        const background = refs.iroFluidBackground;
        if (
            !refs.iroVisual
            || !character?.naturalWidth
            || !character?.naturalHeight
            || !background?.naturalWidth
            || !background?.naturalHeight
        ) return;

        const visualWidth = refs.iroVisual.getBoundingClientRect().width;
        const normalHeight = iroCssLength(refs.illustration, "--iro-work-visual-height", visualWidth);
        if (!visualWidth || !normalHeight) return;

        /*
         * 通常表示ではstage自体を画面より広く保ち、外側だけvisualで切る。
         * zoomOut時は、その未切断stage全体を画面幅まで縮小する。
         */
        const characterWidth = normalHeight * character.naturalWidth / character.naturalHeight;
        const backgroundWidth = normalHeight * background.naturalWidth / background.naturalHeight;
        const stageWidth = Math.max(visualWidth, characterWidth, backgroundWidth);
        const zoomScale = Math.min(1, visualWidth / stageWidth);

        refs.illustration.style.setProperty("--iro-work-stage-width", `${stageWidth}px`);
        refs.illustration.style.setProperty("--iro-work-zoom-scale", String(zoomScale));
        refs.illustration.style.setProperty("--iro-work-zoomed-height", `${normalHeight * zoomScale}px`);
    }

    function iroApplyZoomState() {
        refs.iroWork.classList.toggle("is-zoomed-out", iroState.zoomedOut);
        refs.illustration.classList.toggle("is-zoomed-out", iroState.zoomedOut);
        const zoomIcon = refs.iroZoom.querySelector(".iro-mask-button__icon");
        iroMaskUrl(
            zoomIcon,
            iroState.zoomedOut
                ? "images/gallery/live2d/control-icons/zoomIn.svg"
                : "images/gallery/live2d/control-icons/zoomOut.svg"
        );
        refs.iroZoom.setAttribute("aria-label", iroState.zoomedOut ? "拡大表示へ戻す" : "全体表示へ切り替える");
        requestAnimationFrame(iroSyncDesktopArrows);
    }

    function iroSetImageSources(work) {
        refs.iroFluidBackground.src = iroWorkPath(work, work.background);
        refs.iroFluidBackground.alt = `${work.title} 背景`;
        refs.iroFluidCharacter.src = iroWorkPath(work, work.character);
        refs.iroFluidCharacter.alt = `色かさね - ${work.title}`;
        Promise.allSettled([
            decodeImage(refs.iroFluidBackground),
            decodeImage(refs.iroFluidCharacter)
        ]).then(() => {
            iroSyncZoomMetrics();
        });
    }

    function iroMoveImagesTo(container) {
        container.append(refs.iroFluidBackground, refs.iroFluidCharacter);
    }

    function iroApplyWorkData(work, { resetComment = true } = {}) {
        refs.iroAccessibleTitle.textContent = `色かさね - ${work.title}`;
        refs.iroMetaTitle.textContent = `『色かさね - ${work.title} / ${work.roman}』`;
        refs.iroMetaDate.textContent = work.date;
        refs.iroCommentBody.placeholder = work.example;

        if (work.xUrl) refs.iroX.href = work.xUrl;
        else refs.iroX.removeAttribute("href");
        refs.iroX.classList.toggle("is-disabled", !work.xUrl);
        refs.iroX.setAttribute("aria-disabled", String(!work.xUrl));

        refs.iroFav.classList.remove("is-unsynced");
        refs.iroFav.removeAttribute("data-sync-message");
        iroUpdateFavButton(work);
        void iroSyncFavState(work);
        iroApplyZoomState();
        iroSyncDiaryButton(work);

        if (resetComment) {
            iroCloseComment();
            refs.iroCommentMessage.textContent = "";
            refs.iroCommentBody.value = "";
            refs.iroCommentCount.textContent = "0";
        }
    }

    function iroRenderWork({ updateUrl = true, resetComment = true, preservePalette = false } = {}) {
        const work = iroCurrentWork();
        iroSetTransitionColor(work.uiColor);
        iroSetTheme(work);
        iroSetKanjiText(work.title);
        refs.iroIntroRoman.textContent = work.roman;
        refs.illustration.classList.add("is-revealing", "is-work-open", "is-palette-visible");
        iroSetImageSources(work);
        iroMoveImagesTo(refs.iroImageHost);
        refs.iroImageHost.classList.add("is-background-visible", "is-character-visible");
        refs.iroFluid.hidden = true;
        if (!preservePalette) iroRenderPalette(work);
        iroApplyWorkData(work, { resetComment });
        void iroSyncSharedCopyLayout("work").then(() => {
            iroSyncZoomMetrics();
        });
        if (updateUrl) iroUpdateUrl(work.slug, true);
    }

    function iroUpdateUrl(slug, push) {
        const url = new URL(window.location.href);
        url.searchParams.set("category", "illustration");
        if (slug) url.searchParams.set("work", slug);
        else url.searchParams.delete("work");
        history[push ? "pushState" : "replaceState"]({ category: "illustration", work: slug || "" }, "", url);
    }

    function iroResetIntroVisuals() {
        refs.illustration.classList.remove("is-selecting", "is-revealing", "is-work-open", "is-palette-visible", "is-zoomed-out");
        refs.iroIntro.style.removeProperty("opacity");
        refs.iroFluid.hidden = true;
        refs.iroFluid.classList.remove("is-background-visible", "is-character-visible");
        refs.iroFluid.removeAttribute("style");
        iroMoveImagesTo(refs.iroFluid);
        refs.iroFluidBackground.removeAttribute("src");
        refs.iroFluidCharacter.removeAttribute("src");
        refs.iroTitleJa.classList.remove("is-hidden");
        refs.iroIntroRoman.textContent = "Iro Kasane";
        refs.iroIntroRoman.classList.remove("is-morphing");
        iroSetKanjiText("");
        refs.iroPalette.replaceChildren();
        refs.iroCodeChars.forEach((char, index) => {
            char.textContent = index === 0 ? "#" : "0";
            char.classList.remove("is-visible", "is-vanished");
        });
        iroSetTransitionColor("#fff");
        [
            "--iro-kanji-block-height",
            "--iro-reveal-kanji-height",
            "--iro-reveal-roman-top",
            "--iro-reveal-palette-top",
            "--iro-work-roman-top",
            "--iro-work-arrow-top",
            "--iro-work-tools-top",
            "--iro-work-visual-top",
            "--iro-work-stage-width",
            "--iro-work-zoom-scale",
            "--iro-work-zoomed-height"
        ].forEach((property) => refs.illustration.style.removeProperty(property));
        refs.iroIntro.style.removeProperty("--iro-waterline-y");
        refs.iroIntro.style.removeProperty("--iro-transition-height");
    }

    function iroShowIntro({ updateUrl = true } = {}) {
        iroState.mode = "intro";
        iroState.zoomedOut = false;
        iroState.transitioning = false;
        refs.illustration.classList.remove("is-zoomed-out");
        refs.iroIntro.hidden = false;
        refs.iroWork.hidden = true;
        requestAnimationFrame(iroSyncDesktopArrows);
        iroCloseDiary();
        iroCloseComment();
        iroClearTheme();
        iroResetIntroVisuals();
        iroSyncIntroHeight();
        iroStartCanvas();
        if (updateUrl) iroUpdateUrl("", true);
    }

    function iroOpenWork(index, { updateUrl = true } = {}) {
        iroState.activeIndex = (index + IRO_DETAIL_WORKS.length) % IRO_DETAIL_WORKS.length;
        iroState.mode = "work";
        iroState.zoomedOut = false;
        iroStopCanvas();
        refs.iroIntro.hidden = true;
        refs.iroWork.hidden = false;
        iroRenderWork({ updateUrl });
        requestAnimationFrame(iroSyncDesktopArrows);
    }

    function iroCssLength(element, property, containerWidth) {
        const raw = getComputedStyle(element).getPropertyValue(property).trim();
        const value = Number.parseFloat(raw);
        if (!Number.isFinite(value)) return 0;
        if (raw.endsWith("cqw")) return value * containerWidth / 100;
        if (raw.endsWith("%")) return value * containerWidth / 100;
        return value;
    }

    function iroSetFluidRect({ left, top, width, height, radius = "50%" }) {
        Object.assign(refs.iroFluid.style, {
            left: `${left}px`,
            top: `${top}px`,
            width: `${width}px`,
            height: `${height}px`,
            borderRadius: radius
        });
    }

    async function iroAnimateFluid(from, to, options) {
        iroSetFluidRect(from);
        const animation = refs.iroFluid.animate([
            {
                left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px`, borderRadius: from.radius || "50%"
            },
            {
                left: `${to.left}px`, top: `${to.top}px`, width: `${to.width}px`, height: `${to.height}px`, borderRadius: to.radius || "50%"
            }
        ], options);
        await animation.finished.catch(() => undefined);
        iroSetFluidRect(to);
        animation.cancel();
    }

    function iroMoveCanvasBall(ball, targetX, targetY, duration) {
        return new Promise((resolve) => {
            ball.dragging = false;
            ball.motion = {
                fromX: ball.x,
                fromY: ball.y,
                targetX,
                targetY,
                startedAt: performance.now(),
                duration,
                resolve
            };
        });
    }

    function iroStartCodeShuffle(work) {
        const glyphs = "0123456789ABCDEF";
        const digits = refs.iroCodeChars.slice(1);
        digits.forEach((char) => char.classList.add("is-visible"));
        let frame = 0;
        let active = true;
        const tick = () => {
            if (!active) return;
            frame += 1;
            if (frame % 3 === 0) {
                digits.forEach((char) => {
                    char.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
                });
            }
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        return () => {
            active = false;
            work.uiColor.slice(1).toUpperCase().split("").forEach((value, index) => {
                digits[index].textContent = value;
            });
        };
    }

    async function iroVanishCodeAlongDrop(duration) {
        const step = duration / refs.iroCodeChars.length;
        for (const char of refs.iroCodeChars) {
            char.classList.add("is-vanished");
            await wait(step);
        }
    }

    async function iroMorphRoman(target) {
        const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const sourceLength = Math.max(refs.iroIntroRoman.textContent.length, target.length);
        refs.iroIntroRoman.classList.add("is-morphing");
        for (let step = 0; step <= sourceLength; step += 1) {
            const fixed = target.slice(0, step);
            const random = Array.from({ length: Math.max(0, target.length - step) }, () => glyphs[Math.floor(Math.random() * glyphs.length)]).join("");
            refs.iroIntroRoman.textContent = fixed + random;
            await wait(42);
        }
        refs.iroIntroRoman.textContent = target;
        refs.iroIntroRoman.classList.remove("is-morphing");
    }

    async function iroMorphKanji(target) {
        const glyphs = "色山吹若草瓶覗撫子空花影光夢水月";
        for (let frame = 0; frame < 9; frame += 1) {
            const random = Array.from({ length: [...target].length }, () => glyphs[Math.floor(Math.random() * glyphs.length)]).join("");
            iroSetKanjiText(random);
            await wait(44);
        }
        iroSetKanjiText(target);
    }

    async function iroShufflePlainText(element, target) {
        const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789色山吹若草瓶覗撫子";
        const length = [...target].length;
        for (let frame = 0; frame < 8; frame += 1) {
            element.textContent = Array.from({ length }, () => glyphs[Math.floor(Math.random() * glyphs.length)]).join("");
            await wait(38);
        }
        element.textContent = target;
    }

    async function iroSelectBall(index, ball) {
        if (iroState.transitioning || !ball) return;
        const work = IRO_PREVIEW_WORKS[index];
        if (!work || !canOpenIllustrationDetail(work)) return;
        const detailIndex = IRO_DETAIL_WORKS.findIndex((item) => item.id === work.id);
        if (detailIndex < 0) return;

        iroState.transitioning = true;
        iroState.activeIndex = detailIndex;
        const titleCount = Array.from(work.title).length;
        iroSetTransitionColor(work.uiColor);
        iroSetKanjiText(work.title);
        await iroSyncSharedCopyLayout("reveal", titleCount);
        await iroSyncSharedCopyLayout("work", titleCount);
        refs.illustration.classList.add("is-selecting");
        refs.iroTitleJa.classList.add("is-hidden");
        await nextPaint();

        const introRect = refs.iroIntro.getBoundingClientRect();
        const hashRect = refs.iroCodeChars[0].getBoundingClientRect();
        const targetX = hashRect.left + hashRect.width / 2 - introRect.left;
        const targetY = hashRect.top + hashRect.height / 2 - introRect.top;
        const stopShuffle = iroStartCodeShuffle(work);

        await iroMoveCanvasBall(ball, targetX, targetY, 760);
        stopShuffle();

        const diameter = ball.radius * 2;
        iroMoveImagesTo(refs.iroFluid);
        iroSetImageSources(work);
        refs.iroFluid.hidden = false;
        refs.iroFluid.classList.remove("is-background-visible", "is-character-visible");
        refs.iroFluid.style.backgroundColor = work.uiColor;

        const circle = {
            left: targetX - ball.radius,
            top: targetY - ball.radius,
            width: diameter,
            height: diameter,
            radius: "50%"
        };
        iroSetFluidRect(circle);
        await nextPaint();

        ball.hidden = true;
        ball.droplets.length = 0;
        await iroFadeUnselectedBalls(ball, 300);
        iroStopCanvas();
        iroClearCanvas();
        refs.iroCanvas.hidden = true;

        const introWidth = introRect.width;
        const introHeight = introRect.height;
        const waterY = iroCssLength(refs.iroIntro, "--iro-waterline-y", introWidth);
        const dropTarget = {
            left: introWidth / 2 - ball.radius,
            top: waterY - ball.radius,
            width: diameter,
            height: diameter,
            radius: "50%"
        };
        const dropDuration = 760;

        /*
        * ボールの落下開始と同時に、
        * 同じローマ字要素を水面予定位置の下へ移動する。
        */
        refs.illustration.classList.add("is-roman-dropping");
        await nextPaint();

        await Promise.all([
            iroAnimateFluid(circle, dropTarget, {
                duration: dropDuration,
                easing: "cubic-bezier(.28,.02,.42,1)",
                fill: "forwards"
            }),
            iroVanishCodeAlongDrop(dropDuration)
        ]);

        const lineWidth = iroCssLength(refs.iroIntro, "--iro-waterline-width", introWidth);
        const lineHeight = Math.max(2, iroCssLength(refs.iroIntro, "--iro-waterline-height", introWidth));
        const line = {
            left: (introWidth - lineWidth) / 2,
            top: waterY - lineHeight / 2,
            width: lineWidth,
            height: lineHeight,
            radius: `${lineHeight / 2}px`
        };
        await iroAnimateFluid(dropTarget, line, {
            duration: 520,
            easing: "cubic-bezier(.2,.78,.18,1)",
            fill: "forwards"
        });

        iroRenderPalette(work, { stack: true });
        refs.illustration.classList.add("is-revealing", "is-palette-visible");
        await Promise.all([iroMorphRoman(work.roman), wait(900)]);

        refs.illustration.classList.add("is-work-open");
        await iroSyncSharedCopyLayout("work", Array.from(work.title).length);
        const visualTop = iroCssLength(refs.illustration, "--iro-work-visual-top", introWidth);
        const visualHeight = iroCssLength(refs.illustration, "--iro-work-visual-height", introWidth);
        const finalVisual = {
            left: 0,
            top: visualTop,
            width: introWidth,
            height: visualHeight,
            radius: "0px"
        };

        const expand = iroAnimateFluid(line, finalVisual, {
            duration: 1250,
            easing: "cubic-bezier(.18,.7,.18,1)",
            fill: "forwards"
        });

        await wait(180);
        refs.iroFluid.classList.add("is-background-visible");
        iroSetTheme(work);
        await wait(820);
        refs.iroFluid.classList.add("is-character-visible");
        await expand;
        await wait(620);

        iroApplyWorkData(work, { resetComment: true });
        refs.iroIntro.hidden = true;
        refs.iroWork.hidden = false;
        iroMoveImagesTo(refs.iroImageHost);
        refs.iroImageHost.classList.add("is-background-visible", "is-character-visible");
        iroSyncZoomMetrics();
        requestAnimationFrame(iroSyncDesktopArrows);
        refs.iroFluid.hidden = true;
        refs.iroFluid.classList.remove("is-background-visible", "is-character-visible");
        iroState.mode = "work";
        iroStopCanvas();
        iroUpdateUrl(work.slug, true);
        iroState.transitioning = false;
    }

    function iroSyncIntroHeight() {
        if (!refs.iroIntro || refs.iroIntro.hidden) return;
        const rect = refs.iroIntro.getBoundingClientRect();
        const viewportHeight = window.visualViewport?.height || window.innerHeight;
        const minHeight = iroCqw(116);
        const portraitLimit = iroCqw(177.78);
        const remainingHeight = viewportHeight - Math.max(0, rect.top);
        const height = Math.min(portraitLimit, Math.max(minHeight, remainingHeight));
        refs.iroIntro.style.setProperty("--iro-canvas-height", `${Math.round(height)}px`);
    }

    function iroCanvasSize() {
        const rect = refs.iroCanvas.getBoundingClientRect();
        if (rect.width < 8 || rect.height < 8) return null;
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        refs.iroCanvas.width = Math.max(1, Math.round(rect.width * ratio));
        refs.iroCanvas.height = Math.max(1, Math.round(rect.height * ratio));
        iroState.canvasMetrics = { width: rect.width, height: rect.height, ratio };
        return iroState.canvasMetrics;
    }

    function iroAutonomousBallBounds(width, height, radius) {
        const minX = radius;
        const maxX = Math.max(minX, width - radius);
        const minY = Math.max(radius * 2, height * 0.08);
        const maxY = Math.max(minY, Math.min(height - radius * 2, height * 0.68));
        return { minX, maxX, minY, maxY };
    }

    function iroRandomBallPosition(existing, width, height, radius) {
        const { minX, maxX, minY, maxY } = iroAutonomousBallBounds(width, height, radius);
        for (let attempt = 0; attempt < 80; attempt += 1) {
            const x = minX + Math.random() * (maxX - minX);
            const y = minY + Math.random() * (maxY - minY);
            const clear = existing.every((ball) => Math.hypot(x - ball.x, y - ball.y) > radius * 7);
            if (clear) return { x, y };
        }
        return {
            x: minX + Math.random() * (maxX - minX),
            y: minY + Math.random() * (maxY - minY)
        };
    }

    function iroCreateBalls(width, height) {
        const baseRadius = Math.max(8, width * 0.021);
        const balls = [];
        IRO_PREVIEW_WORKS.forEach((work, index) => {
            const position = iroRandomBallPosition(balls, width, height, baseRadius);
            const angle = Math.random() * Math.PI * 2;
            const speed = 8 + Math.random() * 6;
            balls.push({
                workIndex: index,
                x: position.x,
                y: position.y,
                radius: baseRadius,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: work.uiColor,
                droplets: [],
                emitIn: 0,
                dragging: false,
                hidden: false,
                opacity: 1,
                fade: null,
                motion: null
            });
        });
        iroState.introBalls = balls;
    }

    function iroEmitDroplet(ball) {
        /*
         * 元の「円＋goo」表現はそのままに、飛沫だけを控えめに強める。
         * 基本は1粒、まれに2粒。前回のような常時1～2粒・高速射出にはしない。
         */
        const count = Math.random() < 0.14 ? 2 : 1;
        for (let index = 0; index < count; index += 1) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 34 + Math.random() * 32;
            const offset = ball.radius * (0.14 + Math.random() * 0.18);
            ball.droplets.push({
                x: ball.x + Math.cos(angle) * offset,
                y: ball.y + Math.sin(angle) * offset,
                vx: Math.cos(angle) * speed + ball.vx * 0.25,
                vy: Math.sin(angle) * speed + ball.vy * 0.25,
                radius: ball.radius * (0.20 + Math.random() * 0.17),
                shrink: ball.radius * (0.17 + Math.random() * 0.1)
            });
        }
        ball.emitIn = 0.05 + Math.random() * 0.075;
    }

    function iroUpdateBall(ball, dt, now, width, height, reducedMotion) {
        if (ball.motion) {
            const progress = Math.min(1, (now - ball.motion.startedAt) / ball.motion.duration);
            const eased = 1 - (1 - progress) ** 3;
            ball.x = ball.motion.fromX + (ball.motion.targetX - ball.motion.fromX) * eased;
            ball.y = ball.motion.fromY + (ball.motion.targetY - ball.motion.fromY) * eased;
            if (progress >= 1) {
                const resolve = ball.motion.resolve;
                ball.motion = null;
                resolve();
            }
        } else if (!ball.dragging && !reducedMotion) {
            ball.x += ball.vx * dt;
            ball.y += ball.vy * dt;
            const bounds = iroAutonomousBallBounds(width, height, ball.radius);
            if (ball.x < bounds.minX || ball.x > bounds.maxX) ball.vx *= -1;
            if (ball.y < bounds.minY || ball.y > bounds.maxY) ball.vy *= -1;
            ball.x = Math.max(bounds.minX, Math.min(bounds.maxX, ball.x));
            ball.y = Math.max(bounds.minY, Math.min(bounds.maxY, ball.y));
        }

        if (ball.fade) {
            const progress = Math.min(1, (now - ball.fade.startedAt) / ball.fade.duration);
            const eased = 1 - (1 - progress) ** 3;
            ball.opacity = ball.fade.fromOpacity + (ball.fade.targetOpacity - ball.fade.fromOpacity) * eased;
            if (progress >= 1) {
                const resolve = ball.fade.resolve;
                ball.opacity = ball.fade.targetOpacity;
                ball.fade = null;
                resolve();
            }
        }

        ball.emitIn -= dt;
        if (!reducedMotion && ball.emitIn <= 0 && !ball.hidden && ball.opacity > 0.02) iroEmitDroplet(ball);
        ball.droplets.forEach((drop) => {
            drop.x += drop.vx * dt;
            drop.y += drop.vy * dt;
            drop.radius -= drop.shrink * dt;
        });
        ball.droplets = ball.droplets.filter((drop) => drop.radius > 0.35);
    }

    function iroDrawBall(context, ball) {
        if (ball.opacity <= 0.001) return;
        context.save();
        context.globalAlpha = ball.opacity;
        context.fillStyle = ball.color;
        ball.droplets.forEach((drop) => {
            context.beginPath();
            context.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
            context.fill();
        });
        if (!ball.hidden) {
            context.beginPath();
            context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            context.fill();
        }
        context.restore();
    }

    function iroFadeUnselectedBalls(selectedBall, duration = 300) {
        const fades = iroState.introBalls
            .filter((ball) => ball !== selectedBall && !ball.hidden && ball.opacity > 0.001)
            .map((ball) => new Promise((resolve) => {
                ball.fade = {
                    fromOpacity: ball.opacity,
                    targetOpacity: 0,
                    startedAt: performance.now(),
                    duration,
                    resolve
                };
            }));
        return Promise.all(fades);
    }

    function iroClearCanvas() {
        const context = refs.iroCanvas?.getContext("2d");
        if (!context || !refs.iroCanvas) return;
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, refs.iroCanvas.width, refs.iroCanvas.height);
        context.restore();
    }

    function iroResizeCanvas({ preservePositions = true } = {}) {
        if (!refs.iroCanvas) return null;

        const previous = iroState.canvasMetrics;
        const next = iroCanvasSize();
        if (!next) return null;

        if (preservePositions && previous && iroState.introBalls.length) {
            const scaleX = previous.width > 0 ? next.width / previous.width : 1;
            const scaleY = previous.height > 0 ? next.height / previous.height : 1;
            iroState.introBalls.forEach((ball) => {
                ball.x *= scaleX;
                ball.y *= scaleY;
                ball.radius = Math.max(8, next.width * 0.021);
                ball.droplets.forEach((drop) => {
                    drop.x *= scaleX;
                    drop.y *= scaleY;
                });
                const bounds = iroAutonomousBallBounds(next.width, next.height, ball.radius);
                ball.x = Math.max(bounds.minX, Math.min(bounds.maxX, ball.x));
                ball.y = Math.max(bounds.minY, Math.min(bounds.maxY, ball.y));
            });
        }

        return next;
    }

    function iroStartCanvas({ preservePositions = false } = {}) {
        iroStopCanvas();
        refs.iroCanvas.hidden = false;
        const token = ++iroState.canvasStartToken;

        const start = (attempt = 0) => {
            if (token !== iroState.canvasStartToken || refs.iroIntro.hidden) return;
            requestAnimationFrame(() => {
                if (token !== iroState.canvasStartToken || refs.iroIntro.hidden) return;
                iroSyncIntroHeight();
                const metrics = iroResizeCanvas({ preservePositions });
                if (!metrics) {
                    if (attempt < 12) window.setTimeout(() => start(attempt + 1), 34);
                    return;
                }
                iroState.canvasLayoutWidth = metrics.width;
                if (!preservePositions || !iroState.introBalls.length) {
                    iroCreateBalls(metrics.width, metrics.height);
                }
                iroSyncCanvasHitTargets();

                const context = refs.iroCanvas.getContext("2d");
                if (!context) return;
                const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
                iroState.canvasLastTime = performance.now();

                function draw(now) {
                    if (token !== iroState.canvasStartToken) return;
                    const current = iroState.canvasMetrics;
                    if (!current) return;
                    const dt = Math.min(0.034, Math.max(0.001, (now - iroState.canvasLastTime) / 1000));
                    iroState.canvasLastTime = now;
                    context.setTransform(current.ratio, 0, 0, current.ratio, 0, 0);
                    context.clearRect(0, 0, current.width, current.height);
                    iroState.introBalls.forEach((ball) => {
                        iroUpdateBall(ball, dt, now, current.width, current.height, reducedMotion);
                        iroDrawBall(context, ball);
                    });
                    iroSyncCanvasHitTargets();
                    iroState.introAnimationFrame = requestAnimationFrame(draw);
                }
                iroState.introAnimationFrame = requestAnimationFrame(draw);
            });
        };

        start();
    }

    function iroStopCanvas() {
        iroState.canvasStartToken += 1;
        if (iroState.introAnimationFrame) cancelAnimationFrame(iroState.introAnimationFrame);
        iroState.introAnimationFrame = 0;
        iroState.canvasPointerId = null;
        iroState.canvasDragBall = null;
        iroState.canvasPendingDrag = null;
        if (refs.iroHitLayer) refs.iroHitLayer.hidden = true;
    }

    function iroCanvasPoint(event) {
        const rect = refs.iroCanvas.getBoundingClientRect();
        return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }

    function iroFindCanvasBall(point) {
        return iroState.introBalls.find((ball) => (
            !ball.hidden && Math.hypot(point.x - ball.x, point.y - ball.y) <= ball.radius * 2.15
        ));
    }

    function iroEnsureCanvasHitLayer() {
        let layer = refs.iroIntro?.querySelector("[data-iro-hit-layer]");
        if (!layer && refs.iroCanvas) {
            layer = document.createElement("div");
            layer.className = "iro-intro__hit-layer";
            layer.dataset.iroHitLayer = "";
            layer.setAttribute("aria-hidden", "true");
            refs.iroCanvas.insertAdjacentElement("afterend", layer);
        }
        refs.iroHitLayer = layer || null;
        return refs.iroHitLayer;
    }

    function iroSyncCanvasHitTargets() {
        const layer = refs.iroHitLayer || iroEnsureCanvasHitLayer();
        if (!layer) return;

        const interactive = iroState.mode === "intro"
            && !iroState.transitioning
            && !refs.iroIntro.hidden
            && !refs.iroCanvas.hidden;
        layer.hidden = !interactive;
        if (!interactive) return;

        while (layer.children.length < iroState.introBalls.length) {
            const target = document.createElement("span");
            target.className = "iro-intro__hit-target";
            target.setAttribute("aria-hidden", "true");
            layer.append(target);
        }
        while (layer.children.length > iroState.introBalls.length) {
            layer.lastElementChild?.remove();
        }

        iroState.introBalls.forEach((ball, index) => {
            const target = layer.children[index];
            const hitRadius = ball.radius * 2.15;
            target.dataset.iroBallIndex = String(ball.workIndex);
            target.hidden = ball.hidden || ball.opacity <= 0.02;
            target.style.left = `${ball.x}px`;
            target.style.top = `${ball.y}px`;
            target.style.width = `${hitRadius * 2}px`;
            target.style.height = `${hitRadius * 2}px`;
        });
    }

    function iroBindCanvasDrag() {
        const layer = iroEnsureCanvasHitLayer();
        if (!layer) return;

        const clearPending = () => {
            iroState.canvasPendingDrag = null;
            iroState.canvasPointerId = null;
            iroState.canvasDragBall = null;
        };

        const findTargetBall = (target) => {
            const hitTarget = target.closest?.("[data-iro-ball-index]");
            if (!hitTarget || !layer.contains(hitTarget)) return null;
            const workIndex = Number.parseInt(hitTarget.dataset.iroBallIndex, 10);
            if (!Number.isFinite(workIndex)) return null;
            const ball = iroState.introBalls.find((item) => item.workIndex === workIndex);
            return ball && !ball.hidden ? { ball, hitTarget } : null;
        };

        layer.addEventListener("pointerdown", (event) => {
            if (iroState.transitioning || event.button > 0) return;
            const found = findTargetBall(event.target);
            if (!found) return;

            /*
             * ボール上から始まった操作は方向に関係なくインク操作へ固定する。
             * touch-action:none はこの透明ヒット領域だけに指定し、黒背景は通常スクロールへ渡す。
             */
            if (event.cancelable) event.preventDefault();
            const { ball, hitTarget } = found;
            ball.dragging = true;
            ball.vx = 0;
            ball.vy = 0;
            iroState.canvasPointerId = event.pointerId;
            iroState.canvasDragBall = ball;
            iroState.canvasPendingDrag = {
                pointerId: event.pointerId,
                ball,
                hitTarget,
                dragging: true
            };
            try { hitTarget.setPointerCapture?.(event.pointerId); } catch (_) { /* no-op */ }
        }, { passive: false });

        layer.addEventListener("pointermove", (event) => {
            const pending = iroState.canvasPendingDrag;
            if (!pending || event.pointerId !== pending.pointerId || !iroState.canvasDragBall) return;
            if (event.cancelable) event.preventDefault();

            const metrics = iroState.canvasMetrics;
            if (!metrics) return;
            const point = iroCanvasPoint(event);
            const ball = iroState.canvasDragBall;
            ball.x = Math.max(ball.radius, Math.min(metrics.width - ball.radius, point.x));
            ball.y = Math.max(ball.radius, Math.min(metrics.height - ball.radius, point.y));
            iroSyncCanvasHitTargets();
        }, { passive: false });

        const release = (event, select) => {
            const pending = iroState.canvasPendingDrag;
            if (!pending || event.pointerId !== pending.pointerId) return;
            const ball = pending.ball;
            ball.dragging = false;
            const captureTarget = pending.hitTarget;
            if (captureTarget?.hasPointerCapture?.(event.pointerId)) {
                try { captureTarget.releasePointerCapture(event.pointerId); } catch (_) { /* no-op */ }
            }
            clearPending();
            if (select) void iroSelectBall(ball.workIndex, ball);
        };

        layer.addEventListener("pointerup", (event) => release(event, true));
        layer.addEventListener("pointercancel", (event) => release(event, false));
        layer.addEventListener("lostpointercapture", (event) => {
            const pending = iroState.canvasPendingDrag;
            if (!pending || event.pointerId !== pending.pointerId) return;
            pending.ball.dragging = false;
            clearPending();
        });
    }

    function iroCancelAnimations(element) {
        element?.getAnimations?.().forEach((animation) => animation.cancel());
    }

    async function iroTransitionImages(work, direction, onBackgroundStart, { slideCharacter = true } = {}) {
        const host = refs.iroImageHost;
        const oldBackground = refs.iroFluidBackground;
        const oldCharacter = refs.iroFluidCharacter;
        const nextBackground = oldBackground.cloneNode(false);
        const nextCharacter = oldCharacter.cloneNode(false);
        const travel = Math.max(48, host.getBoundingClientRect().width * 0.18);
        const signedTravel = direction > 0 ? -travel : travel;
        const entryTravel = direction > 0 ? travel : -travel;

        nextBackground.removeAttribute("data-iro-transition-background");
        nextCharacter.removeAttribute("data-iro-transition-character");
        nextBackground.src = iroWorkPath(work, work.background);
        nextCharacter.src = iroWorkPath(work, work.character);
        nextBackground.alt = `${work.title} 背景`;
        nextCharacter.alt = `色かさね - ${work.title}`;

        [oldBackground, oldCharacter, nextBackground, nextCharacter].forEach(iroCancelAnimations);
        host.classList.add("is-switching");

        Object.assign(oldBackground.style, { opacity: "1" });
        Object.assign(oldCharacter.style, { opacity: "1", transform: "translateX(-50%)" });
        Object.assign(nextBackground.style, { opacity: "0" });
        Object.assign(nextCharacter.style, {
            opacity: "0",
            transform: slideCharacter
                ? `translateX(calc(-50% + ${entryTravel}px))`
                : "translateX(-50%)"
        });

        host.append(nextBackground, nextCharacter);

        try {
            await Promise.allSettled([decodeImage(nextBackground), decodeImage(nextCharacter)]);
            await nextPaint();

            if (slideCharacter) {
                const characterExit = oldCharacter.animate([
                    { opacity: 1, transform: "translateX(-50%)" },
                    { opacity: 0, transform: `translateX(calc(-50% + ${signedTravel}px))` }
                ], {
                    duration: 300,
                    easing: "cubic-bezier(.3,.02,.36,1)",
                    fill: "forwards"
                });
                await characterExit.finished.catch(() => undefined);
                oldCharacter.style.opacity = "0";
                oldCharacter.style.transform = `translateX(calc(-50% + ${signedTravel}px))`;
                characterExit.cancel();

                await wait(50);
                onBackgroundStart?.();

                const oldBackgroundFade = oldBackground.animate(
                    [{ opacity: 1 }, { opacity: 0 }],
                    { duration: 380, easing: "ease", fill: "forwards" }
                );
                const nextBackgroundFade = nextBackground.animate(
                    [{ opacity: 0 }, { opacity: 1 }],
                    { duration: 380, easing: "ease", fill: "forwards" }
                );
                await Promise.all([
                    oldBackgroundFade.finished.catch(() => undefined),
                    nextBackgroundFade.finished.catch(() => undefined)
                ]);
                oldBackground.style.opacity = "0";
                nextBackground.style.opacity = "1";
                oldBackgroundFade.cancel();
                nextBackgroundFade.cancel();

                await wait(80);
                const characterEnter = nextCharacter.animate([
                    { opacity: 0, transform: `translateX(calc(-50% + ${entryTravel}px))` },
                    { opacity: 1, transform: "translateX(-50%)" }
                ], {
                    duration: 480,
                    easing: "cubic-bezier(.18,.72,.2,1)",
                    fill: "forwards"
                });
                await characterEnter.finished.catch(() => undefined);
                nextCharacter.style.opacity = "1";
                nextCharacter.style.transform = "translateX(-50%)";
                characterEnter.cancel();
            } else {
                /*
                 * 全体表示（zoomOut）中はstageの左右端まで見えているため、
                 * 通常の横スライドを使うと絵そのものが見切れる。
                 * この状態だけ背景・人物を同位置のままクロスフェードする。
                 */
                onBackgroundStart?.();
                const animations = [
                    oldBackground.animate(
                        [{ opacity: 1 }, { opacity: 0 }],
                        { duration: 320, easing: "ease", fill: "forwards" }
                    ),
                    nextBackground.animate(
                        [{ opacity: 0 }, { opacity: 1 }],
                        { duration: 320, easing: "ease", fill: "forwards" }
                    ),
                    oldCharacter.animate(
                        [
                            { opacity: 1, transform: "translateX(-50%)" },
                            { opacity: 0, transform: "translateX(-50%)" }
                        ],
                        { duration: 320, easing: "ease", fill: "forwards" }
                    ),
                    nextCharacter.animate(
                        [
                            { opacity: 0, transform: "translateX(-50%)" },
                            { opacity: 1, transform: "translateX(-50%)" }
                        ],
                        { duration: 320, easing: "ease", fill: "forwards" }
                    )
                ];
                await Promise.all(animations.map((animation) => animation.finished.catch(() => undefined)));
                oldBackground.style.opacity = "0";
                nextBackground.style.opacity = "1";
                oldCharacter.style.opacity = "0";
                oldCharacter.style.transform = "translateX(-50%)";
                nextCharacter.style.opacity = "1";
                nextCharacter.style.transform = "translateX(-50%)";
                animations.forEach((animation) => animation.cancel());
            }

            /*
             * persistent要素へ次作品のsrcを移す間も、同じ画像のcloneを表示し続ける。
             * 先に最終値をinlineへ固定するため、animation.cancel()後に旧状態へ戻らない。
             */
            oldBackground.src = nextBackground.src;
            oldBackground.alt = nextBackground.alt;
            oldCharacter.src = nextCharacter.src;
            oldCharacter.alt = nextCharacter.alt;
            oldBackground.style.opacity = "1";
            oldCharacter.style.opacity = "1";
            oldCharacter.style.transform = "translateX(-50%)";

            await nextPaint();
            nextBackground.remove();
            nextCharacter.remove();
            oldBackground.style.removeProperty("opacity");
            oldCharacter.style.removeProperty("opacity");
            oldCharacter.style.removeProperty("transform");
            host.classList.add("is-background-visible", "is-character-visible");
            iroSyncZoomMetrics();
        } finally {
            [oldBackground, oldCharacter, nextBackground, nextCharacter].forEach(iroCancelAnimations);
            nextBackground.remove();
            nextCharacter.remove();
            host.classList.remove("is-switching");
        }
    }

    async function iroSwitch(direction) {
        if (iroState.transitioning) {
            iroState.pendingSwitchDirection = direction;
            return;
        }

        const preserveZoomedOut = iroState.zoomedOut;
        iroState.transitioning = true;
        iroFinishPaletteDrag({ pointerId: null });
        iroState.activeIndex = (iroState.activeIndex + direction + IRO_DETAIL_WORKS.length) % IRO_DETAIL_WORKS.length;
        iroApplyZoomState();
        const work = iroCurrentWork();
        const metaTarget = `『色かさね - ${work.title} / ${work.roman}』`;
        let uiAnimations = [];

        try {
            await iroTransitionImages(work, direction, () => {
                iroSetTransitionColor(work.uiColor);
                iroSetTheme(work);
                iroTransitionPalette(work);
                iroCloseComment();
                uiAnimations = [
                    iroSyncSharedCopyLayout("work", Array.from(work.title).length),
                    iroMorphKanji(work.title),
                    iroMorphRoman(work.roman),
                    iroShufflePlainText(refs.iroMetaTitle, metaTarget),
                    iroShufflePlainText(refs.iroMetaDate, work.date)
                ];
            }, { slideCharacter: !preserveZoomedOut });

            await Promise.all(uiAnimations);
            await iroSyncSharedCopyLayout("work");
            iroApplyWorkData(work, { resetComment: true });
            requestAnimationFrame(iroSyncDesktopArrows);
            iroUpdateUrl(work.slug, true);
        } finally {
            iroState.transitioning = false;
            const pendingDirection = iroState.pendingSwitchDirection;
            iroState.pendingSwitchDirection = 0;
            if (pendingDirection) {
                queueMicrotask(() => iroSwitch(pendingDirection));
            }
        }
    }

    const IRO_DIARY_AUTHOR_MARKS = Object.freeze({
        urara: "💜🏹",
        wimina: "👻🏹"
    });

    function iroDiaryEntry(work) {
        return window.DIARY_DATA?.getById?.(work?.diaryEntry) || null;
    }

    function iroDiaryBody(entry) {
        const mark = IRO_DIARY_AUTHOR_MARKS[entry?.author] || "";
        return mark ? `${entry.body}
${mark}` : entry.body;
    }

    function iroFormatDiaryDate(value) {
        if (!value) return "";
        const [, month, day] = value.split("-");
        return `${Number(month)}/${Number(day)}`;
    }

    function iroSyncDiaryButton(work) {
        /*
         * Irokasane の Diary は作品公開と同時公開。
         * Supabase の旧 sections.diary 値では止めず、diaryEntry の実在だけを見る。
         */
        const entry = iroDiaryEntry(work);
        const available = Boolean(entry);
        refs.iroDiaryButton.disabled = !available;
        refs.iroDiaryButton.setAttribute(
            "aria-label",
            available ? "日記を開く" : "関連する日記はありません"
        );
    }

    function iroOpenDiary() {
        const work = iroCurrentWork();
        const entry = iroDiaryEntry(work);
        if (!entry) return;

        refs.iroDiaryTitle.textContent = entry.title;
        refs.iroDiaryDate.textContent = iroFormatDiaryDate(entry.date);
        refs.iroDiaryBody.textContent = iroDiaryBody(entry);
        refs.iroDiary.style.setProperty("--theme-color", work.uiColor);

        const diaryHref = `diary.html?entry=${encodeURIComponent(entry.id)}`;
        [refs.iroDiaryLink, refs.iroDiaryLinkBottom].forEach((link) => {
            if (!link) return;
            link.href = diaryHref;
            link.hidden = false;
            link.setAttribute("aria-disabled", "false");
        });

        if (iroState.diaryCloseTimer) {
            clearTimeout(iroState.diaryCloseTimer);
            iroState.diaryCloseTimer = 0;
        }
        if (!refs.iroDiary.open) {
            if (typeof refs.iroDiary.show === "function") refs.iroDiary.show();
            else refs.iroDiary.setAttribute("open", "");
        }
        requestAnimationFrame(() => {
            requestAnimationFrame(() => refs.iroDiary.classList.add("is-visible"));
        });
    }

    function iroCloseDiary() {
        if (!refs.iroDiary.open) return;
        refs.iroDiary.classList.remove("is-visible");
        if (iroState.diaryCloseTimer) clearTimeout(iroState.diaryCloseTimer);
        iroState.diaryCloseTimer = window.setTimeout(() => {
            if (typeof refs.iroDiary.close === "function" && refs.iroDiary.open) refs.iroDiary.close();
            else refs.iroDiary.removeAttribute("open");
            iroState.diaryCloseTimer = 0;
        }, 240);
    }

    function iroAnimateCommentScroll(targetY, duration = 520) {
        if (iroState.commentScrollFrame) cancelAnimationFrame(iroState.commentScrollFrame);
        const startY = window.scrollY;
        const distance = Math.max(0, targetY - startY);
        const startedAt = performance.now();

        const frame = (now) => {
            const progress = Math.min(1, (now - startedAt) / duration);
            const eased = 1 - (1 - progress) ** 3;
            window.scrollTo(0, startY + distance * eased);
            if (progress < 1 && refs.iroCommentPanel.classList.contains("is-open")) {
                iroState.commentScrollFrame = requestAnimationFrame(frame);
                return;
            }
            iroState.commentScrollFrame = 0;
        };

        iroState.commentScrollFrame = requestAnimationFrame(frame);
    }

    function iroOpenComment() {
        const clip = refs.iroCommentPanel.querySelector(".iro-comment-panel__clip");
        const finalPanelHeight = clip?.scrollHeight || 0;
        const viewportHeight = window.visualViewport?.height || window.innerHeight;
        const targetY = Math.max(0, document.documentElement.scrollHeight + finalPanelHeight - viewportHeight);

        refs.iroCommentPanel.classList.add("is-open");
        refs.iroCommentPanel.setAttribute("aria-hidden", "false");
        refs.iroCommentPanel.removeAttribute("inert");
        iroAnimateCommentScroll(targetY, 520);
        window.setTimeout(() => refs.iroCommentBody.focus({ preventScroll: true }), 560);
    }

    function iroCloseComment() {
        if (!refs.iroCommentPanel) return;
        if (iroState.commentScrollFrame) {
            cancelAnimationFrame(iroState.commentScrollFrame);
            iroState.commentScrollFrame = 0;
        }
        refs.iroCommentPanel.classList.remove("is-open");
        refs.iroCommentPanel.setAttribute("aria-hidden", "true");
        refs.iroCommentPanel.setAttribute("inert", "");
    }

    function iroFavRequestPayload(work, desiredFavored) {
        return {
            target_type: "content",
            content_type: "illustration",
            content_slug: work.slug,
            reaction_type: "fav",
            visitor_id: communityVisitorId(),
            desired_active: desiredFavored,
            include_count: false
        };
    }

    function iroFinishFavPending(work, revision) {
        if (iroFavRevision(work.slug) !== revision) return;
        if (iroCurrentWork().slug !== work.slug) return;
        refs.iroFav.disabled = false;
        refs.iroFav.classList.remove("is-pending", "is-syncing");
        refs.iroFav.removeAttribute("aria-busy");
    }

    function iroRetryFavInBackground(work, desiredFavored, previousFavored, revision, cycle = 0) {
        const delay = cycle === 0 ? 4000 : 12000;
        window.setTimeout(async () => {
            if (iroFavRevision(work.slug) !== revision) return;
            if (iroLocalFav(work.slug) !== desiredFavored) return;

            try {
                const response = await requestReactionWithRetry(
                    iroFavRequestPayload(work, desiredFavored),
                    () => iroFavRevision(work.slug) === revision
                );
                if (!response || iroFavRevision(work.slug) !== revision) return;

                const serverFavored = typeof response.favored === "boolean"
                    ? response.favored
                    : desiredFavored;
                iroSetLocalFav(work.slug, serverFavored);
                if (iroCurrentWork().slug === work.slug) {
                    refs.iroFav.classList.remove("is-unsynced");
                    refs.iroFav.removeAttribute("data-sync-message");
                    iroUpdateFavButton(work);
                }
            } catch (error) {
                if (iroFavRevision(work.slug) !== revision) return;
                if (isRecoverableReactionError(error) && cycle < 1) {
                    iroRetryFavInBackground(work, desiredFavored, previousFavored, revision, cycle + 1);
                    return;
                }

                if (!isRecoverableReactionError(error)) {
                    iroSetLocalFav(work.slug, previousFavored);
                    if (iroCurrentWork().slug === work.slug) {
                        iroUpdateFavButton(work);
                        refs.iroFav.classList.remove("is-unsynced");
                        refs.iroCommentMessage.textContent =
                            `${error.message}
favの変更を反映できませんでした。`;
                        iroOpenComment();
                    }
                }
            }
        }, delay);
    }

    async function iroToggleFav() {
        if (refs.iroFav.disabled) return;

        const work = iroCurrentWork();
        const revision = iroBumpFavRevision(work.slug);
        const previousFavored = iroLocalFav(work.slug);
        const optimisticFavored = !previousFavored;

        /*
         * 表示は通信前に確定する。通信の遅延・一時失敗・SVG読込待ちで
         * favが押下直後に戻って見えないよう、明確な拒否時だけ元へ戻す。
         */
        iroSetLocalFav(work.slug, optimisticFavored);
        iroUpdateFavButton(work);
        refs.iroFav.disabled = true;
        refs.iroFav.classList.add("is-pending");
        refs.iroFav.classList.remove("is-syncing", "is-unsynced");
        refs.iroFav.setAttribute("aria-busy", "true");

        if (
            !previousFavored
            && optimisticFavored
            && !iroHasSubmittedComment(work.slug)
        ) {
            iroOpenComment();
        }

        try {
            const response = await requestReactionWithRetry(
                iroFavRequestPayload(work, optimisticFavored),
                () => iroFavRevision(work.slug) === revision
            );
            if (!response || iroFavRevision(work.slug) !== revision) return;

            const serverFavored = typeof response.favored === "boolean"
                ? response.favored
                : optimisticFavored;
            iroSetLocalFav(work.slug, serverFavored);
            iroUpdateFavButton(work);
        } catch (error) {
            if (iroFavRevision(work.slug) !== revision) return;

            if (isRecoverableReactionError(error)) {
                /*
                 * 回線・タイムアウト・一時的な429/5xxでは見た目を戻さない。
                 * desired_activeは冪等なので、同じ状態を背景で再送できる。
                 */
                refs.iroFav.classList.add("is-unsynced");
                refs.iroFav.dataset.syncMessage = "favを反映中です";
                iroRetryFavInBackground(
                    work,
                    optimisticFavored,
                    previousFavored,
                    revision
                );
            } else {
                iroSetLocalFav(work.slug, previousFavored);
                iroUpdateFavButton(work);
                refs.iroCommentMessage.textContent =
                    `${error.message}
favの変更を反映できませんでした。`;
                iroOpenComment();
            }
        } finally {
            iroFinishFavPending(work, revision);
        }
    }

    function iroNormalizeText(value) {
        return value.normalize("NFKC")
            .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
            .replace(/[\u200B-\u200D\uFEFF]/g, "")
            .replace(/<[^>]*>/g, "")
            .replace(/\n{3,}/g, "\n\n")
            .trim();
    }

    async function iroSubmitComment(event) {
        event.preventDefault();
        const work = iroCurrentWork();
        const formData = new FormData(refs.iroCommentForm);
        const displayName = iroNormalizeText(String(formData.get("displayName") || "")) || "名無しさん";
        const body = iroNormalizeText(String(formData.get("body") || ""));
        if (displayName.length > 20) {
            refs.iroCommentMessage.textContent = "表示名は20文字以内で入力してください。";
            return;
        }
        if (!body || body.length > 80) {
            refs.iroCommentMessage.textContent = "本文は1～80文字で入力してください。";
            return;
        }
        if (/(?:https?:\/\/|www\.|[a-z0-9-]+\.(?:com|net|jp|org)\b)/i.test(body)) {
            refs.iroCommentMessage.textContent = "URLを含むコメントは送信できません。";
            return;
        }
        const submit = refs.iroCommentForm.querySelector('[type="submit"]');
        const previousBody = refs.iroCommentBody.value;
        submit.disabled = true;

        /*
         * 送信操作への反応は即時に返し、通信失敗時だけ本文を戻す。
         * 成功確定前に「受け取りました」とは表示しない。
         */
        refs.iroCommentMessage.textContent = "送信しています…";
        refs.iroCommentBody.value = "";
        refs.iroCommentCount.textContent = "0";

        try {
            const payload = {
                content_type: "illustration",
                content_slug: work.slug,
                visitor_id: communityVisitorId(),
                display_name: displayName,
                body
            };
            await communityApiRequest("submit-comment", payload);
            iroMarkCommentSubmitted(work.slug);
            refs.iroCommentMessage.textContent = "解釈を受け取りました。\n創作やグッズ制作の参考にさせていただきます🙇‍♂️\n\n※確認後、展示に加わることがあります";
            window.setTimeout(iroCloseComment, 1200);
        } catch (error) {
            refs.iroCommentBody.value = previousBody;
            refs.iroCommentCount.textContent = String(previousBody.length);
            refs.iroCommentMessage.textContent = error.message;
        } finally {
            submit.disabled = false;
        }
    }

    function iroBindSwipe() {
        refs.iroSwipeZone.addEventListener("pointerdown", (event) => {
            if (
                event.target.closest("button, a, input, textarea, form, .iro-comment-panel, .iro-shared-palette")
            ) return;
            if (event.pointerType === "mouse" && event.button !== 0) return;
            if (event.pointerType === "mouse") event.preventDefault();
            iroState.swipePointerId = event.pointerId;
            iroState.swipeStartX = event.clientX;
            iroState.swipeStartY = event.clientY;
            iroState.swipeBlocked = false;
            refs.iroSwipeZone.setPointerCapture?.(event.pointerId);
        });
        refs.iroSwipeZone.addEventListener("pointerup", (event) => {
            if (event.pointerId !== iroState.swipePointerId) return;
            const dx = event.clientX - iroState.swipeStartX;
            const dy = event.clientY - iroState.swipeStartY;
            iroState.swipePointerId = null;
            if (refs.iroSwipeZone.hasPointerCapture?.(event.pointerId)) {
                try { refs.iroSwipeZone.releasePointerCapture(event.pointerId); } catch (_) { /* no-op */ }
            }
            if (iroState.swipeBlocked) return;
            if (Math.abs(dx) < IRO_SWIPE_THRESHOLD || Math.abs(dx) <= Math.abs(dy) * 1.25) return;
            iroSwitch(dx < 0 ? 1 : -1);
        });
        refs.iroSwipeZone.addEventListener("pointercancel", (event) => {
            if (event.pointerId === iroState.swipePointerId) iroState.swipePointerId = null;
        });
        refs.iroSwipeZone.addEventListener("dragstart", (event) => {
            event.preventDefault();
        });
    }

    function iroSyncDesktopArrows() {
        if (!refs.iroDesktopPrev || !refs.iroDesktopNext) return;

        const workVisible = Boolean(
            refs.iroVisual
            && !refs.illustration.hidden
            && refs.illustration.classList.contains("is-work-open")
            && !refs.iroWork.hidden
        );
        const rect = refs.iroVisual?.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
        const inView = Boolean(
            workVisible
            && rect
            && rect.bottom > viewportHeight * 0.15
            && rect.top < viewportHeight * 0.85
        );

        refs.iroDesktopPrev.hidden = !inView;
        refs.iroDesktopNext.hidden = !inView;
    }

    function iroEnsureDesktopArrows() {
        if (refs.iroDesktopPrev || refs.iroDesktopNext) return;

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

        refs.iroDesktopPrev = createArrow("prev", "前の色かさね", "◀");
        refs.iroDesktopNext = createArrow("next", "次の色かさね", "▶");
        refs.iroDesktopPrev.addEventListener("click", () => iroSwitch(-1));
        refs.iroDesktopNext.addEventListener("click", () => iroSwitch(1));

        if (typeof ResizeObserver === "function" && refs.iroVisual) {
            refs.iroDesktopResizeObserver = new ResizeObserver(iroSyncDesktopArrows);
            refs.iroDesktopResizeObserver.observe(refs.iroVisual);
        }
        if (typeof MutationObserver === "function") {
            refs.iroDesktopMutationObserver = new MutationObserver(iroSyncDesktopArrows);
            refs.iroDesktopMutationObserver.observe(refs.illustration, {
                attributes: true,
                attributeFilter: ["class", "hidden"]
            });
        }
        iroSyncDesktopArrows();
    }

    function iroFinishPaletteSiblingAnimations(drag) {
        if (!drag?.siblingAnimations) return;
        drag.siblingAnimations.forEach((animation, bar) => {
            try { animation.finish(); } catch (_) { /* no-op */ }
            animation.cancel();
            bar.style.removeProperty("transform");
        });
        drag.siblingAnimations.clear();
    }

    function iroCapturePaletteSiblingRects(drag) {
        const bars = [...refs.iroPalette.querySelectorAll("[data-iro-bar-index]")]
            .filter((bar) => bar !== drag.bar);
        const beforeRects = new Map();

        bars.forEach((bar) => {
            const activeAnimation = drag.siblingAnimations.get(bar);
            if (activeAnimation) {
                try { activeAnimation.commitStyles(); } catch (_) { /* Safari等 */ }
                activeAnimation.cancel();
                drag.siblingAnimations.delete(bar);
            }
            beforeRects.set(bar, bar.getBoundingClientRect());
            bar.style.removeProperty("transform");
        });

        return beforeRects;
    }

    function iroAnimatePaletteSiblings(drag, beforeRects) {
        refs.iroPalette.querySelectorAll("[data-iro-bar-index]").forEach((bar) => {
            if (bar === drag.bar) return;
            const before = beforeRects.get(bar);
            if (!before) return;
            const after = bar.getBoundingClientRect();
            const dx = before.left - after.left;
            if (Math.abs(dx) < 0.5) return;

            const oldAnimation = drag.siblingAnimations.get(bar);
            if (oldAnimation) oldAnimation.cancel();

            const animation = bar.animate(
                [
                    { transform: `translateX(${dx}px)` },
                    { transform: "translateX(0)" }
                ],
                {
                    duration: 240,
                    easing: "cubic-bezier(.2,.72,.2,1)"
                }
            );
            drag.siblingAnimations.set(bar, animation);
            animation.finished.then(() => {
                if (drag.siblingAnimations.get(bar) !== animation) return;
                animation.cancel();
                drag.siblingAnimations.delete(bar);
            }).catch(() => undefined);
        });
    }

    function iroStartPaletteDrag(drag) {
        if (iroState.paletteDrag !== drag || drag.active || drag.cancelled) return;
        const rect = drag.bar.getBoundingClientRect();
        const placeholder = document.createElement("span");
        placeholder.className = "iro-palette__placeholder";
        placeholder.style.setProperty("--placeholder-width", `${rect.width}px`);

        drag.timer = 0;
        drag.placeholder = placeholder;
        drag.active = true;
        drag.siblingAnimations = new Map();

        /*
         * 掴んだbutton自体をDOMから複製・交換しない。
         * 同じ親に残したままfixed化し、元位置だけplaceholderで保持する。
         * これによりPointer Captureが途中で失われない。
         */
        drag.bar.before(placeholder);
        Object.assign(drag.bar.style, {
            left: `${rect.left}px`,
            top: `${rect.top}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`
        });
        drag.bar.classList.add("is-dragging");
        drag.bar.setAttribute("aria-grabbed", "true");
        refs.iroPalette.classList.add("is-drag-active");
        document.body.classList.add("is-iro-palette-dragging");
        iroState.swipeBlocked = true;
        iroMovePaletteBar(drag, drag.lastX, drag.lastY);
    }

    function iroPaletteNextLogicalBar(drag) {
        const children = [...refs.iroPalette.children].filter((child) => child !== drag.bar);
        const index = children.indexOf(drag.placeholder);
        if (index < 0) return null;
        return children.slice(index + 1).find((child) => child.matches?.("[data-iro-bar-index]")) || null;
    }

    function iroMovePalettePlaceholder(drag, clientX) {
        const bars = [...refs.iroPalette.querySelectorAll("[data-iro-bar-index]")]
            .filter((bar) => bar !== drag.bar);
        let before = null;

        for (const bar of bars) {
            const rect = bar.getBoundingClientRect();
            if (clientX < rect.left + rect.width / 2) {
                before = bar;
                break;
            }
        }

        if (iroPaletteNextLogicalBar(drag) === before) return;

        const beforeRects = iroCapturePaletteSiblingRects(drag);
        if (before) refs.iroPalette.insertBefore(drag.placeholder, before);
        else refs.iroPalette.append(drag.placeholder);
        iroAnimatePaletteSiblings(drag, beforeRects);
    }

    function iroMovePaletteBar(drag, clientX, clientY) {
        drag.lastX = clientX;
        drag.lastY = clientY;
        drag.bar.style.left = `${clientX - drag.grabOffsetX}px`;
        drag.bar.style.top = `${clientY - drag.grabOffsetY}px`;
        iroMovePalettePlaceholder(drag, clientX);
    }

    function iroReleasePalettePointer(drag) {
        if (!drag?.bar || drag.pointerId == null) return;
        if (drag.bar.hasPointerCapture?.(drag.pointerId)) {
            try { drag.bar.releasePointerCapture(drag.pointerId); } catch (_) { /* no-op */ }
        }
    }

    function iroSettlePaletteBar(drag) {
        const floatingRect = drag.bar.getBoundingClientRect();
        iroFinishPaletteSiblingAnimations(drag);

        /* placeholder位置へ、掴んでいた同じbuttonを戻す。 */
        drag.placeholder.replaceWith(drag.bar);
        drag.bar.style.transition = "none";
        drag.bar.classList.remove("is-dragging");
        drag.bar.removeAttribute("aria-grabbed");
        ["left", "top", "width", "height"].forEach((property) => drag.bar.style.removeProperty(property));
        drag.bar.style.transform = "none";

        const settledRect = drag.bar.getBoundingClientRect();
        const dx = floatingRect.left - settledRect.left;
        const dy = floatingRect.top - settledRect.top;
        drag.bar.style.transform = `translate(${dx}px, ${dy}px)`;
        void drag.bar.offsetWidth;
        drag.bar.style.transition = "transform 260ms cubic-bezier(.2,.72,.2,1)";
        drag.bar.style.transform = "translate(0, 0)";

        window.setTimeout(() => {
            drag.bar.style.removeProperty("transition");
            drag.bar.style.removeProperty("transform");
        }, 290);
    }

    function iroFinishPaletteDrag(event = {}) {
        const drag = iroState.paletteDrag;
        if (!drag || (event.pointerId != null && drag.pointerId !== event.pointerId)) return;

        const forcedCancel = event.pointerId === null;
        const pointerCancelled = event.type === "pointercancel" || event.type === "lostpointercapture";
        if (event.cancelable) event.preventDefault();
        if (drag.timer) {
            clearTimeout(drag.timer);
            drag.timer = 0;
        }

        if (drag.active && drag.placeholder?.isConnected) {
            iroSettlePaletteBar(drag);

            const work = iroCurrentWork();
            const colors = [...refs.iroPalette.querySelectorAll("[data-iro-bar-color]")]
                .map((bar) => bar.dataset.iroBarColor);
            iroState.paletteOrder.set(work.slug, colors);
            iroPaletteReindex();
        } else if (!forcedCancel && !pointerCancelled && !drag.cancelled && !drag.moved) {
            iroSelectPaletteBar(drag.bar);
        }

        iroReleasePalettePointer(drag);
        refs.iroPalette.classList.remove("is-drag-active");
        document.body.classList.remove("is-iro-palette-dragging");
        iroState.paletteDrag = null;
        window.setTimeout(() => {
            if (!iroState.paletteDrag) iroState.swipeBlocked = false;
        }, 0);
    }

    function iroBindPalette() {
        refs.iroPalette.addEventListener("pointerdown", (event) => {
            const bar = event.target.closest("[data-iro-bar-index]");
            if (!bar || iroState.transitioning || iroState.paletteDrag) return;
            if (event.pointerType === "mouse" && event.button !== 0) return;

            event.preventDefault();
            const rect = bar.getBoundingClientRect();
            const drag = {
                pointerId: event.pointerId,
                bar,
                startX: event.clientX,
                startY: event.clientY,
                lastX: event.clientX,
                lastY: event.clientY,
                grabOffsetX: event.clientX - rect.left,
                grabOffsetY: event.clientY - rect.top,
                active: false,
                moved: false,
                cancelled: false,
                timer: 0,
                placeholder: null,
                siblingAnimations: new Map()
            };

            iroState.paletteDrag = drag;
            iroState.swipeBlocked = true;
            try { bar.setPointerCapture?.(event.pointerId); } catch (_) { /* no-op */ }
            drag.timer = window.setTimeout(() => iroStartPaletteDrag(drag), IRO_LONG_PRESS_MS);
        }, { passive: false });

        window.addEventListener("pointermove", (event) => {
            const drag = iroState.paletteDrag;
            if (!drag || drag.pointerId !== event.pointerId) return;

            drag.lastX = event.clientX;
            drag.lastY = event.clientY;
            const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
            if (distance > 5) drag.moved = true;

            if (!drag.active) {
                /* 小さな揺れでは解除せず、明確な移動時だけ長押し判定を中止する。 */
                if (distance > 18 && drag.timer) {
                    clearTimeout(drag.timer);
                    drag.timer = 0;
                    drag.cancelled = true;
                }
                if (event.cancelable) event.preventDefault();
                return;
            }

            if (event.cancelable) event.preventDefault();
            iroMovePaletteBar(drag, event.clientX, event.clientY);
        }, { passive: false });

        window.addEventListener("pointerup", iroFinishPaletteDrag, { passive: false });
        window.addEventListener("pointercancel", iroFinishPaletteDrag, { passive: false });
        refs.iroPalette.addEventListener("contextmenu", (event) => {
            if (event.target.closest("[data-iro-bar-index]")) event.preventDefault();
        });
    }

    function iroRestoreFromUrl() {
        const url = new URL(window.location.href);
        if (url.searchParams.get("category") !== "illustration") return false;
        const slug = url.searchParams.get("work");
        const index = IRO_DETAIL_WORKS.findIndex((work) => work.slug === slug);
        setCategory("illustration", { fromHistory: true });
        if (index >= 0) iroOpenWork(index, { updateUrl: false });
        else iroShowIntro({ updateUrl: false });
        return true;
    }

    async function restoreGalleryFromUrl() {
        const url = new URL(window.location.href);
        const category = url.searchParams.get("category");
        if (category === "illustration") return iroRestoreFromUrl();
        if (category === "works") {
            await setCategory("works", { fromHistory: true });
            return true;
        }
        return false;
    }

    function iroBindEvents() {
        iroBindCanvasDrag();
        iroBindSwipe();
        iroBindPalette();
        iroEnsureDesktopArrows();
        window.addEventListener("scroll", iroSyncDesktopArrows, { passive: true });
        window.addEventListener("resize", iroSyncDesktopArrows, { passive: true });
        refs.iroPrev.addEventListener("click", () => iroSwitch(-1));
        refs.iroNext.addEventListener("click", () => iroSwitch(1));
        refs.iroZoom.addEventListener("click", () => {
            if (iroState.transitioning) return;
            iroSyncZoomMetrics();
            iroState.zoomedOut = !iroState.zoomedOut;
            iroApplyZoomState();
        });
        refs.iroDiaryButton.addEventListener("click", iroOpenDiary);
        refs.iroDiaryClose.addEventListener("click", iroCloseDiary);
        refs.iroDiary.addEventListener("click", (event) => {
            if (event.target !== refs.iroDiary) return;
            const rect = refs.iroDiary.getBoundingClientRect();
            const outside = event.clientX < rect.left || event.clientX > rect.right
                || event.clientY < rect.top || event.clientY > rect.bottom;
            if (outside) iroCloseDiary();
        });
        refs.iroFav.addEventListener("click", iroToggleFav);
        refs.iroCommentClose.addEventListener("click", iroCloseComment);
        refs.iroCommentBody.addEventListener("input", () => {
            refs.iroCommentCount.textContent = String(refs.iroCommentBody.value.length);
        });
        refs.iroCommentForm.addEventListener("submit", iroSubmitComment);
        document.addEventListener("keydown", (event) => {
            if (event.key !== "Escape") return;
            if (refs.iroDiary.open) iroCloseDiary();
            if (refs.iroCommentPanel.classList.contains("is-open")) iroCloseComment();
        });
        let illustrationResizeFrame = 0;
        window.addEventListener("resize", () => {
            if (illustrationResizeFrame) return;
            illustrationResizeFrame = requestAnimationFrame(() => {
                illustrationResizeFrame = 0;
                if (state.category === "illustration" && iroState.mode === "intro" && !iroState.transitioning) {
                    const nextWidth = refs.iroCanvas?.getBoundingClientRect().width || 0;
                    const widthChanged = !iroState.canvasLayoutWidth
                        || Math.abs(nextWidth - iroState.canvasLayoutWidth) > 1;

                    /*
                     * iOSのアドレスバー開閉は高さだけのresizeを連続発生させる。
                     * スクロール中はCanvas高を変えず、横幅が変わった時だけ再計算する。
                     */
                    if (widthChanged) {
                        iroSyncIntroHeight();
                        const metrics = iroResizeCanvas({ preservePositions: true });
                        if (metrics) iroState.canvasLayoutWidth = metrics.width;
                    }
                }
                if (iroState.mode === "work") {
                    void iroSyncSharedCopyLayout("work").then(iroSyncZoomMetrics);
                }
            });
        }, { passive: true });
    }

    function bindGalleryHistory() {
        window.addEventListener("popstate", async () => {
            const url = new URL(window.location.href);
            const category = url.searchParams.get("category");
            if (category === "illustration") {
                const slug = url.searchParams.get("work");
                await setCategory("illustration", { fromHistory: true });
                const index = IRO_DETAIL_WORKS.findIndex((work) => work.slug === slug);
                if (index >= 0) iroOpenWork(index, { updateUrl: false });
                else iroShowIntro({ updateUrl: false });
            } else if (category === "works") {
                await setCategory("works", { fromHistory: true });
            } else if (state.category !== "live2d") {
                await setCategory("live2d", { fromHistory: true });
            }
        });
    }

    function handleControlClick(control) {
        if (control === "collapse") {
            state.controlsCollapsed = !state.controlsCollapsed;
            renderControls({ animate: false });
            return;
        }

        if (state.modelActionBusy) return;

        if (control === "change") {
            void handleChange();
            return;
        }
        if (control === "zoom") {
            void handleZoom();
            return;
        }
        if (control.startsWith("content-")) {
            void switchContent(control.replace("content-", ""));
        }
    }

    const CATEGORY_LOADING_LABELS = {
        live2d: "LIVE2Dを読み込んでいます",
        illustration: "ILLUSTRATIONを読み込んでいます",
        works: "WORKSを読み込んでいます"
    };

    function syncCategoryTabs(category, { pending = false } = {}) {
        refs.tabs?.querySelectorAll("[data-gallery-tab]").forEach((button) => {
            const active = button.dataset.galleryTab === category;
            button.classList.toggle("is-active", active);
            button.classList.toggle("is-pending", active && pending);
            button.setAttribute("aria-selected", String(active));
        });
    }

    function showCategoryLoader(category) {
        if (!refs.page || !refs.categoryLoader) return;
        if (refs.categoryLoaderText) {
            refs.categoryLoaderText.textContent = CATEGORY_LOADING_LABELS[category] || "LOADING";
        }
        refs.categoryLoader.setAttribute("aria-hidden", "false");
        refs.page.classList.add("is-category-loading");
    }

    function hideCategoryLoader() {
        refs.page?.classList.remove("is-category-loading");
        refs.categoryLoader?.setAttribute("aria-hidden", "true");
    }

    function clearInitialCategoryMarker() {
        delete document.documentElement.dataset.galleryInitialCategory;
    }

    function ensureCategoryRuntime(category) {
        if (category === "illustration" && !illustrationRuntimeReady) {
            communityVisitorId();
            iroBindEvents();
            illustrationRuntimeReady = true;
        }

        if (category === "works" && !worksRuntimeReady) {
            worksHydrateFavState();
            worksBindEvents();
            worksRuntimeReady = true;
        }
    }

    async function setCategory(category, { fromHistory = false, assetsReady = false } = {}) {
        if (!new Set(["live2d", "illustration", "works"]).has(category)) return;

        /* 前の作品色を初期表示へ持ち越さず、インクボール画面は即時に黒へ戻す。 */
        if (category === "illustration") iroClearTheme();

        if (category === state.category && !refs.page.classList.contains("is-category-loading")) {
            if (category === "live2d" && state.view === "detail") closeDetail();
            if (category === "illustration" && iroState.mode === "work") iroShowIntro({ updateUrl: !fromHistory });
            return;
        }

        const requestToken = ++categorySwitchToken;
        const categoryNeedsLoader = !assetsReady && (
            !loadedCategories.has(category) ||
            !hydratedPublicationCategories.has(category)
        );
        const loaderWasAlreadyVisible = refs.page.classList.contains("is-category-loading");
        const loaderStartedAt = performance.now();

        syncCategoryTabs(category, { pending: categoryNeedsLoader || loaderWasAlreadyVisible });
        refs.tabs.setAttribute("aria-busy", "true");

        if (categoryNeedsLoader || loaderWasAlreadyVisible) {
            showCategoryLoader(category);
            /* ローダーを先に描画し、押下後の無反応時間を作らない。 */
            await nextPaint();
        }

        try {
            if (!assetsReady) {
                await hydratePublicationCategory(category);
                await ensureCategoryAssets(category, { showLoader: false });
            }
            if (requestToken !== categorySwitchToken) return;

            ensureCategoryRuntime(category);

            if (categoryNeedsLoader || loaderWasAlreadyVisible) {
                const elapsed = performance.now() - loaderStartedAt;
                if (elapsed < CATEGORY_LOADER_MIN_MS) {
                    await wait(CATEGORY_LOADER_MIN_MS - elapsed);
                }
                if (requestToken !== categorySwitchToken) return;
            }

            state.category = category;

            refs.detail.hidden = true;
            refs.modelGrid.hidden = false;
            state.view = "list";
            refs.page.dataset.galleryView = "list";
            document.body.classList.remove(
                "gallery-detail-open",
                "gallery-illustration-open",
                "gallery-illustration-themed",
                "gallery-works-open"
            );
            iroClearTheme();
            iroCloseDiary();
            iroCloseComment();
            refs.live2d.hidden = true;
            refs.illustration.hidden = true;
            refs.works.hidden = true;
            refs.empty.hidden = true;
            iroStopCanvas();

            if (category === "live2d") {
                refs.live2d.hidden = false;
                await ensureModelGridCurrent();
                if (requestToken !== categorySwitchToken) return;
                if (!fromHistory) {
                    const url = new URL(window.location.href);
                    url.searchParams.delete("category");
                    url.searchParams.delete("work");
                    history.pushState({ category: "live2d" }, "", url);
                }
            } else if (category === "illustration") {
                refs.illustration.hidden = false;
                document.body.classList.add("gallery-illustration-open");
                iroShowIntro({ updateUrl: !fromHistory });
            } else if (category === "works") {
                refs.works.hidden = false;
                document.body.classList.add("gallery-works-open");
                worksRender();
                if (!worksState.favRefreshStarted) {
                    worksState.favRefreshStarted = true;
                    void worksRefreshFavState();
                }
                if (!fromHistory) {
                    const url = new URL(window.location.href);
                    url.searchParams.set("category", "works");
                    url.searchParams.delete("work");
                    history.pushState({ category: "works" }, "", url);
                }
            } else {
                refs.empty.hidden = false;
            }

            scheduleModelParallaxUpdate();
        } finally {
            if (requestToken === categorySwitchToken) {
                syncCategoryTabs(category, { pending: false });
                refs.tabs.removeAttribute("aria-busy");
                hideCategoryLoader();
                clearInitialCategoryMarker();
            }
        }
    }

    function handlePointerDown(event) {
        const tab = event.target.closest("[data-gallery-tab]");
        if (tab && tab.dataset.galleryTab !== state.category) {
            if (event.pointerType === "mouse" && event.button !== 0) return;
            const category = tab.dataset.galleryTab;
            pointerRequestedCategory = category;
            window.clearTimeout(pointerRequestResetTimer);
            pointerRequestResetTimer = window.setTimeout(() => {
                if (pointerRequestedCategory === category) pointerRequestedCategory = "";
            }, 900);
            void setCategory(category);
            return;
        }

        if (state.view !== "detail") return;

        const mini = event.target.closest("[data-mini-model-index]");
        if (mini) {
            prewarmModelIndex(Number(mini.dataset.miniModelIndex));
            return;
        }

        const control = event.target.closest("[data-control]");
        if (control) {
            prewarmControl(control.dataset.control);
        }
    }

    function handleClick(event) {
        const logoReplay = event.target.closest("[data-logo-replay]");
        if (logoReplay && !logoReplay.disabled) {
            replayActiveLogoAnimation();
            return;
        }

        const tab = event.target.closest("[data-gallery-tab]");
        if (tab) {
            const category = tab.dataset.galleryTab;
            if (pointerRequestedCategory === category) {
                pointerRequestedCategory = "";
                window.clearTimeout(pointerRequestResetTimer);
                return;
            }
            void setCategory(category);
            return;
        }

        const card = event.target.closest("[data-model-index]");
        if (card) {
            openModel(Number(card.dataset.modelIndex), card);
            return;
        }

        const mini = event.target.closest("[data-mini-model-index]");
        if (mini) {
            switchModel(Number(mini.dataset.miniModelIndex));
            return;
        }

        const control = event.target.closest("[data-control]");
        if (control) {
            handleControlClick(control.dataset.control);
            return;
        }

        const toggle = event.target.closest("[data-profile-toggle]");
        if (toggle) {
            toggleProfileDetails();
            return;
        }

        const back = event.target.closest("[data-back-to-list]");
        if (back && state.view === "detail") closeDetail();
    }

    function updateDetailSideBands() {
        if (!refs.detailBody || state.view !== "detail" || refs.detail.hidden) return;
        const top = Math.max(0, refs.detailBody.getBoundingClientRect().top);
        refs.detailBody.style.setProperty("--detail-side-band-top", `${top}px`);
    }

    function updateModelParallax() {
        modelParallaxFrame = 0;
        // 軽量化優先：人物画像へのスクロール連動transformは廃止する。
        updateDetailSideBands();
    }

    function shouldUpdateLive2dScrollVisuals() {
        return state.category === "live2d"
            && state.view === "detail"
            && !refs.detail?.hidden;
    }

    function scheduleModelParallaxUpdate() {
        if (!shouldUpdateLive2dScrollVisuals() && !state.transitioning) return;
        if (modelParallaxFrame) return;
        modelParallaxFrame = window.requestAnimationFrame(updateModelParallax);
    }

    function bindModelParallax() {
        window.addEventListener("scroll", () => {
            if (state.transitioning) syncTransitionLogoTarget();
            if (shouldUpdateLive2dScrollVisuals()) scheduleModelParallaxUpdate();
        }, { passive: true });
    }

    function cacheRefs() {
        refs.page = document.getElementById("gallery-page");
        refs.tabs = document.querySelector(".gallery-tabs");
        refs.categoryLoader = document.getElementById("gallery-category-loader");
        refs.categoryLoaderText = refs.categoryLoader?.querySelector("[data-gallery-category-loader-text]");
        refs.live2d = document.getElementById("live2d-gallery");
        refs.modelGrid = document.getElementById("model-grid");
        refs.detail = document.getElementById("model-detail");
        refs.detailBody = document.getElementById("model-detail-body");
        refs.miniGrid = document.getElementById("model-mini-grid");
        refs.mediaStage = document.getElementById("model-media-stage");
        refs.mediaSceneHost = document.getElementById("model-media-scene-host");
        refs.persistentLogo = refs.mediaStage.querySelector("[data-persistent-logo]");
        refs.persistentLogoAnchor = refs.mediaStage.querySelector("[data-persistent-logo-anchor]");
        refs.persistentLogoTint = refs.mediaStage.querySelector("[data-persistent-logo-tint]");
        refs.persistentLogoImage = refs.mediaStage.querySelector("[data-persistent-logo-image]");
        refs.persistentLogoReplay = refs.mediaStage.querySelector("[data-logo-replay]");
        refs.controls = document.getElementById("model-controls");
        refs.profile = document.getElementById("model-profile");
        refs.illustration = document.getElementById("illustration-gallery");
        refs.works = document.getElementById("works-gallery");
        refs.worksList = refs.works.querySelector("[data-works-list]");
        refs.worksEmpty = refs.works.querySelector("[data-works-empty]");
        refs.worksSort = refs.works.querySelector("[data-works-sort]");
        refs.worksSortLabel = refs.works.querySelector("[data-works-sort-label]");
        refs.iroIntro = refs.illustration.querySelector("[data-iro-intro]");
        refs.iroCanvas = document.getElementById("iro-ink-canvas");
        refs.iroCenter = refs.illustration.querySelector("[data-iro-center]");
        refs.iroCode = refs.illustration.querySelector("[data-iro-code]");
        refs.iroCodeChars = [...refs.illustration.querySelectorAll("[data-iro-code-char]")];
        refs.iroTitleJa = refs.illustration.querySelector("[data-iro-title-ja]");
        refs.iroIntroRoman = refs.illustration.querySelector("[data-iro-intro-roman]");
        refs.iroFluid = refs.illustration.querySelector("[data-iro-fluid]");
        refs.iroFluidBackground = refs.illustration.querySelector("[data-iro-transition-background]");
        refs.iroFluidCharacter = refs.illustration.querySelector("[data-iro-transition-character]");
        refs.iroKanjiClip = refs.illustration.querySelector("[data-iro-kanji-clip]");
        refs.iroRevealKanji = refs.illustration.querySelector("[data-iro-reveal-kanji]");
        refs.iroWork = refs.illustration.querySelector("[data-iro-work]");
        refs.iroPrev = refs.illustration.querySelector("[data-iro-prev]");
        refs.iroNext = refs.illustration.querySelector("[data-iro-next]");
        refs.iroAccessibleTitle = refs.illustration.querySelector("[data-iro-accessible-title]");
        refs.iroZoom = refs.illustration.querySelector("[data-iro-zoom]");
        refs.iroDiaryButton = refs.illustration.querySelector("[data-iro-diary]");
        refs.iroSwipeZone = refs.illustration.querySelector("[data-iro-swipe-zone]");
        refs.iroVisual = refs.illustration.querySelector("[data-iro-visual]");
        refs.iroDesktopPrev = null;
        refs.iroDesktopNext = null;
        refs.iroDesktopResizeObserver = null;
        refs.iroDesktopMutationObserver = null;
        refs.iroImageHost = refs.illustration.querySelector("[data-iro-image-host]");
        refs.iroPalette = refs.illustration.querySelector("[data-iro-palette]");
        refs.iroMetaTitle = refs.illustration.querySelector("[data-iro-meta-title]");
        refs.iroMetaDate = refs.illustration.querySelector("[data-iro-meta-date]");
        refs.iroFav = refs.illustration.querySelector("[data-iro-fav]");
        refs.iroX = refs.illustration.querySelector("[data-iro-x]");
        refs.iroCommentPanel = refs.illustration.querySelector("[data-iro-comment-panel]");
        refs.iroCommentForm = refs.illustration.querySelector("[data-iro-comment-form]");
        refs.iroCommentClose = refs.illustration.querySelector("[data-iro-comment-close]");
        refs.iroCommentBody = refs.illustration.querySelector("[data-iro-comment-body]");
        refs.iroCommentCount = refs.illustration.querySelector("[data-iro-comment-count]");
        refs.iroCommentMessage = refs.illustration.querySelector("[data-iro-comment-message]");
        refs.iroDiary = refs.illustration.querySelector("[data-iro-diary-dialog]");
        refs.iroDiaryClose = refs.illustration.querySelector("[data-iro-diary-close]");
        refs.iroDiaryTitle = refs.illustration.querySelector("[data-iro-diary-title]");
        refs.iroDiaryDate = refs.illustration.querySelector("[data-iro-diary-date]");
        refs.iroDiaryBody = refs.illustration.querySelector("[data-iro-diary-body]");
        refs.iroDiaryLink = refs.illustration.querySelector("[data-iro-diary-link]");
        refs.iroDiaryLinkBottom = refs.illustration.querySelector("[data-iro-diary-link-bottom]");
        document.body.append(refs.iroDiary);
        refs.empty = document.getElementById("gallery-empty");
        refs.transition = document.getElementById("gallery-transition");
    }

    function bindResponsiveObservers() {
        if (typeof ResizeObserver === "function") {
            refs.galleryResizeObserver = new ResizeObserver(() => {
                syncAllResponsiveMedia();
                if (state.category === "live2d" && state.view === "list") void ensureModelGridCurrent();
                scheduleModelParallaxUpdate();
            });
            refs.galleryResizeObserver.observe(refs.page);
        } else {
            window.addEventListener("resize", () => {
                syncAllResponsiveMedia();
                if (state.category === "live2d" && state.view === "list") void ensureModelGridCurrent();
                scheduleModelParallaxUpdate();
            }, { passive: true });
        }
    }

    function applyPublicationRecord(item, record) {
        if (!record) return;

        item.publication = {
            state: record.state,
            publishAt: record.publishAt,
            unpublishAt: record.unpublishAt
        };

        if (Object.keys(record.sections).length) {
            item.sections = { ...(item.sections || {}), ...record.sections };
        }
        if (Number.isFinite(record.sortOrder)) {
            item.sortOrder = record.sortOrder;
        }
    }

    async function hydratePublicationCategory(category) {
        if (hydratedPublicationCategories.has(category)) return;

        const existing = publicationCategoryLoads.get(category);
        if (existing) {
            await existing;
            return;
        }

        const publication = window.KotonoUraPublication;
        const contentTypes = category === "live2d"
            ? ["live2d"]
            : category === "illustration"
            ? ["illustration-series", "illustration"]
            : category === "works"
            ? ["works"]
            : [];

        const task = (async () => {
            if (!publication || !contentTypes.length) {
                if (category === "illustration") refreshIllustrationPublicationLists();
                hydratedPublicationCategories.add(category);
                return;
            }

            const result = await publication.load(contentTypes);

            if (category === "live2d") {
                MODEL_DATA.forEach((model) => {
                    applyPublicationRecord(
                        model,
                        publication.get(result, model.type, model.slug)
                    );
                });
                MODEL_DATA.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
            }

            if (category === "illustration") {
                ILLUSTRATION_SERIES.forEach((series) => {
                    applyPublicationRecord(
                        series,
                        publication.get(result, series.type, series.slug)
                    );
                });
                ILLUSTRATION_SERIES.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

                ILLUSTRATION_WORKS.forEach((work) => {
                    applyPublicationRecord(
                        work,
                        publication.get(result, work.type, work.slug)
                    );
                });
                ILLUSTRATION_WORKS.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
                refreshIllustrationPublicationLists();
            }

            if (category === "works") {
                WORKS_DATA.forEach((work) => {
                    const record = publication.get(result, "works", work.slug);
                    if (!record) return;
                    work.published = record.state === "public";
                    if (Number.isFinite(record.sortOrder)) work.order = record.sortOrder;
                });
                WORKS_DATA.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            }

            hydratedPublicationCategories.add(category);
        })();

        publicationCategoryLoads.set(category, task);
        try {
            await task;
        } finally {
            publicationCategoryLoads.delete(category);
        }
    }

    async function init() {
        cacheGalleryLoaderRefs();
        updateGalleryLoader(4, "公開情報を確認しています");

        const initialCategory = requestedInitialCategory();

        try {
            await Promise.all([
                hydratePublicationCategory(initialCategory),
                window.KotonoUraLoader?.waitForChrome?.() || Promise.resolve()
            ]);
            updateGalleryLoader(14, "初期表示を組み立てています");
            cacheRefs();
            if (initialCategory !== "live2d") {
                syncCategoryTabs(initialCategory, { pending: true });
                showCategoryLoader(initialCategory);
                await nextPaint();
            }
            await ensureCategoryAssets(initialCategory, { initial: true });

            bindResponsiveObservers();
            bindModelParallax();

            if (initialCategory === "live2d") {
                syncCategoryTabs("live2d");
                await ensureModelGridCurrent();
                clearInitialCategoryMarker();
            }
            updateGalleryLoader(92, "操作を準備しています");

            ensureCategoryRuntime(initialCategory);
            bindGalleryHistory();
            document.addEventListener("pointerdown", handlePointerDown, { passive: true });
            document.addEventListener("click", handleClick);

            if (initialCategory !== "live2d") {
                await setCategory(initialCategory, { fromHistory: true, assetsReady: true });
                if (initialCategory === "illustration") iroRestoreFromUrl();
            }
            updateGalleryLoader(98, "表示を整えています");
        } catch (error) {
            console.error("Galleryの初期化中に問題が発生しました。", error);
        } finally {
            hideCategoryLoader();
            clearInitialCategoryMarker();
            await finishGalleryLoader();
        }
    }

    void init();
})();
