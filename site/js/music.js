(() => {
    "use strict";

    const resolveAsset = (path) =>
        window.KotonoUraAssets?.resolve?.(path) || path;

    const MUSIC_IMAGE_BASE = "images/music";
    const JACKET_BASE = `${MUSIC_IMAGE_BASE}/jacket`;
    const THUMBNAIL_BASE = `${MUSIC_IMAGE_BASE}/thumbnail`;
    const COVER_THUMBNAIL_BASE = `${MUSIC_IMAGE_BASE}/thumbnail(cover)`;
    const DOT_UI_BASE = `${MUSIC_IMAGE_BASE}/dot-ui`;
    const AUDIO_BASE = "audio";

    const PLAYER_TRANSITION_MS = 620;
    const SUMMARY_TRANSITION_MS = 180;
    const DISC_SWITCH_MS = 430;
    const COMMENT_DRAG_THRESHOLD = 3;
    const SEEK_DRAG_THRESHOLD = 8;
    const LOCAL_COMMENT_COOLDOWN_MS = 10 * 60 * 1000;
    const MOBILE_MUSIC_MODE = window.matchMedia?.("(max-width: 1099px), (hover: none), (pointer: coarse)")?.matches ?? false;
    const PUBLICATION_VISIBLE_STATES = new Set(["teaser", "partial", "public"]);
    const PUBLICATION_DETAIL_STATES = new Set(["partial", "public"]);

    const ICONS = Object.freeze({
        album: `${DOT_UI_BASE}/dt_album.svg`,
        diary: `${DOT_UI_BASE}/dt_diary.svg`,
        favAfter: `${DOT_UI_BASE}/dt_fav-after.svg`,
        favBefore: `${DOT_UI_BASE}/dt_fav-before.svg`,
        forward5: `${DOT_UI_BASE}/dt_forward5s.svg`,
        lyrics: `${DOT_UI_BASE}/dt_lyrics.svg`,
        pause: `${DOT_UI_BASE}/dt_pause.svg`,
        play: `${DOT_UI_BASE}/dt_playArrow.svg`,
        reaction: `${DOT_UI_BASE}/dt_reaction.svg`,
        repeat: `${DOT_UI_BASE}/dt_repeat.svg`,
        repeatOne: `${DOT_UI_BASE}/dt_repeatOne.svg`,
        replay5: `${DOT_UI_BASE}/dt_replay5s.svg`,
        shuffle: `${DOT_UI_BASE}/dt_shuffle.svg`,
        skipNext: `${DOT_UI_BASE}/dt_skip_next.svg`,
        skipPrev: `${DOT_UI_BASE}/dt_skip_prev.svg`,
        x: `${DOT_UI_BASE}/dt_x.svg`,
        youtube: `${DOT_UI_BASE}/dt_youtube.svg`
    });

    const ORIGINAL_TRACK_DATA = [
        {
            id: "Illumina-tor",
            slug: "illumina-tor",
            contentType: "music-original",
            publicId: "50a6f1b8-d3e4-419b-8d13-e84156c1e19b",
            order: 100,
            published: true,
            preTitle: "弓可可ヰミナ　1st Single",
            preDisplayTitle: "『イルミネーター』",
            title: "イルミネーター / Illumina-tor",
            jacket: `${JACKET_BASE}/Illumina-tor.webp`,
            thumbnail: `${THUMBNAIL_BASE}/thumbnail_Illumina-tor.webp`,
            audio: `${AUDIO_BASE}/Illumina-tor.mp3`,
            instrumental: `${AUDIO_BASE}/inst_Illumina-tor.mp3`,
            diaryEntry: "illumina-tor",
            credits: [
                ["Vocal", "弓可可ヰミナ"],
                ["Lyrics", "琴麗等"],
                ["Music", "Addpico"],
                ["Movie", "なつゆうべ"],
                ["Special Thanks", "親友K"],
                ["Illustration / Animation / Chorus", "琴麗等"],
                ["RVC Voice Model「弓可可ヰミナ」制作", "sumireyoko"],
                ["Translation", "M.S. / 琴麗等"]
            ],
            flavor: {
                title: "相関性 【そう-かん-せい】",
                subtitle: "〘名詞〙 interconnectedness〔英〕",
                body: `二つ以上の事象や変数のあいだに、
互いに関連・対応・依存などの関係があること。
一方の変化が他方の変化と関連して現れる度合い。
原因と結果の単純な秩序には
還元されない相互作用。`
            },
            lyrics: `もし、もし、どちら様
折り返しお待ちしております
3301

誰かに見てほしかっただけ
波長がずれている躯
みんな狂ったみたいに唱うアイとやらが
どうにもこうにも解らない

だから、瞳と眼があった
あなたへと手を伸ばすのだ
いつかその心を綻ばすまで
舞台袖で長い夢を観よう

虚しい話は先延ばし
譜割りのない祭囃子に千鳥足
似たり寄ったりを迷い箸
こんなんじゃあ、何処にも映らないな

違うなら、目を見て言っておくれ
不完全にふくらむ僕の夢
正しい明日を照らす光に
群がり暗がり繰り返し

散りぬるまでを、見て聞いておくれ
夏に降りしきる空蝉の声
悲しい音で鳴きたかったのだ
誰もが求めている本当の声だから

あなたへのもの語りだから
あなただけが神様だから
掬っておくれイルミネーター

舞台の上はまだ夢の中

嫌なら辞めちまえ 諦めてしまえ
なんて吐き捨ててくれたら安らかに
迷いなく降りられた物語は
また幕間からきりがないな

違うなら、手で示しておくれ
あなたの心が凪ぐ僕の夢
魂だとか曖昧じゃなくて
確かな形と質量で

契りきな、形見にしておくれ
画面の向う波打つ蝉の声
愛しい音になりたかったのだ
誰もが求めているその周波数で

叫んでもすり抜ける言葉
僕はまるで亡霊で
名前のないガラクタ

嫌うなら、どうかこの眼を視て
違うなら、目を見て言っておくれ
夏に降る雪はかげろうの夢
正しいなんて誰も判りはしない
矛盾だらけのまやかしだろう？

散りぬる果てを、見て聴いておくれ
あなただけに捧げる蝉の声
あまり者になりたかったのだ
誰とも重ならない素の周期へ

だから、
あなたへの言葉たちだったのだから
あなただけが神様だったのだから
巣食っておくれイルミネーター

3、3、0、1`,
            links: {
                streaming: "https://linkco.re/hNcy8ygt",
                youtube: "https://youtu.be/orI8_8tGvrw?si=BXUpcpk-mZxAU0KG",
                x: "https://x.com/Yumikaka_WM/status/1980937175912120780?s=20"
            }
        },
        {
            id: "Motsure",
            slug: "motsure",
            contentType: "music-original",
            publicId: "3b6ac789-cab3-4748-866c-e8a5fc3d3084",
            order: 200,
            published: true,
            publishAt: "2026-08-28T19:30:00+09:00",
            sections: { list: true, detail: true },
            preTitle: "弓可可ヰミナ　2nd Single",
            preDisplayTitle: "『縺れ』",
            title: "縺れ / Motsure",
            jacket: `${JACKET_BASE}/Motsure.webp`,
            thumbnail: `${THUMBNAIL_BASE}/thumbnail_Motsure.webp`,
            audio: `${AUDIO_BASE}/Motsure.mp3`,
            instrumental: `${AUDIO_BASE}/inst_Motsure.mp3`,
            diaryEntry: null,
            credits: [
                ["Vocal", "弓可可ヰミナ"],
                ["Lyrics", "琴麗等"],
                ["Music", "Addpico"],
                ["Movie", "なつゆうべ"],
                ["Illustration / Animation", "琴麗等"],
                ["RVC Voice Model「弓可可ヰミナ」制作", "sumireyoko"],
                ["Translation", "琴麗等"]
            ],
            flavor: {
                title: "曇 【くもり】",
                subtitle: "〘名詞〙 overcast〔英〕",
                body: `空が雲に覆われ、日が射さない状態。
光や色がぼんやりと明るさを失って沈むこと。
心のわだかまりが晴れないこと。
また、そのために言葉や表情にかげりのある様。`
            },
            lyrics: `空が眩しい　かすかに雨の薫り
まだ渇かない
雲が移り　覗きこむ水溜まり

またも、かしましい！
耳が寂しい　沈黙を口遊み
まだ消えない
静まる街　目を逸らして微睡

また乱れだすなら
頭から拗らせ　息の根を吐いて

意味も知らず　わからないままで
口を閉じて　沈んでしまうまで
濡れた喉に暗黙を絡ませて

意味などなく　わかりたくもない
平熱模倣　浮かんでしまうなら
白も黒も無いまま縺れさせて

朝が眩しい　重力なぞる手足
瞼をほどき
欠伸のふり　黒くよどむ雲行き

耳が傷み　沈黙を寄せては返し
ずれて重なる
空の話　雨のち晴れのち雨のち
回りだす景色！

今一度吐いて

意味も知らず　わからないままで
文脈など　壊してしまうだけ
泥の中に輪郭を滲ませて

意味などなく　わかりたくもない
言葉溜まり　よどんで満ちるまで
白も黒も曖昧に溶け出して

まだ　腫れあがる蝉時雨
また　頭から拗らせ　息の根を
尽きるまで吐いて

意味も知らず　わからないままで
呑み込むまで　騙してしまうだけ
零れ落ちた体温を書き換えて

意味などなく　わかりたくもない
名もなき模倣　溶かして消えるまで
白も黒も無くして縺れさせて

喉に絡む　鉛の味
膨らむ肺に　こびり着くたび
過る記憶
ずれて崩れて
崩れてずれて
口から零れ出す
僕をもう連れ出して

意味も知らず　わからないままで
空白模倣　忘れて消えるだけ
誰も彼も亡くして縺れさせて`,
            links: {
                streaming: "https://linkco.re/VfUgpGVs",
                youtube: "https://youtu.be/ASfcEdSpN14",
                x: ""
            }
        },
        {
            id: "BigotsWithTheIvoryTower",
            slug: "bigots-with-the-ivory-tower",
            contentType: "music-original",
            publicId: "3e464bdf-621c-449c-8c32-b0221edd9db2",
            order: 900,
            published: true,
            preTitle: "テーマBGM",
            preDisplayTitle: "『偏屈者と象牙の塔』",
            title: "偏屈者と象牙の塔",
            playerTitle: "偏屈者と象牙の塔\n(Bigots with the Ivory tower)",
            jacket: `${JACKET_BASE}/BigotsWithTheIvoryTower.webp`,
            thumbnail: `${THUMBNAIL_BASE}/thumbnail_BigotsWithTheIvoryTower.webp`,
            audio: `${AUDIO_BASE}/BigotsWithTheIvoryTower.mp3`,
            instrumental: "",
            diaryEntry: null,
            credits: [
                ["Music", "Addpico"],
                ["Produce", "琴麗等"]
            ],
            flavor: {
                title: "",
                subtitle: "",
                body: `今日も私は日常を抜け出して、 
いつも薄暗いそのアトリエへ向かう。
足の踏み場など微塵も期待できない彼の部屋では
きっとこんな曲が流れている。`
            },
            lyrics: "",
            links: {
                streaming: "https://t.co/ZzsTowyZXG",
                youtube: "https://t.co/hqUTZD1Muj",
                x: "https://x.com/Addpico/status/1919951400110366822?s=20"
            }
        }
    ];

    const SINGERS = Object.freeze({
        YumikakaWimina: {
            label: "弓可可ヰミナ",
            color: "#5ABEB4"
        },
        KotoUrara: {
            label: "琴麗等",
            color: "#8E50BE"
        }
    });

    const COVER_TRACK_DATA = [
        {
            slug: "requiem",
            contentType: "music-cover",
            publicId: "3e935cc9-6d63-41fa-8e3a-0fb151c37935",
            published: true,
            title: "レクイエム",
            artist: "Kanaria",
            singers: ["YumikakaWimina", "KotoUrara"],
            youtube: "https://youtu.be/vlcxSK5KHvw",
            thumbnail: `${COVER_THUMBNAIL_BASE}/requiem.webp`,
            date: "2026-07-29",
            initialPopularity: 9
        },
        {
            slug: "call-boy",
            contentType: "music-cover",
            publicId: "db5297db-9d14-40b3-9ca0-b0218588f021",
            published: true,
            title: "コールボーイ",
            artist: "syudou",
            singers: ["KotoUrara"],
            youtube: "https://youtu.be/1bJjJm1Da_U",
            thumbnail: `${COVER_THUMBNAIL_BASE}/callBoy.webp`,
            date: "2025-08-25",
            initialPopularity: 7
        },
        {
            slug: "noro",
            contentType: "music-cover",
            publicId: "45d82082-8d71-4938-a4da-caca5c3450cf",
            published: true,
            title: "ノロ",
            artist: "¿?",
            singers: ["KotoUrara"],
            youtube: "https://youtu.be/B0G4ojTNxlg",
            thumbnail: `${COVER_THUMBNAIL_BASE}/noro.webp`,
            date: "2024-01-29",
            initialPopularity: 6
        },
        {
            slug: "bakusyou",
            contentType: "music-cover",
            publicId: "5828b897-28e8-4851-9406-21797b02612f",
            published: true,
            title: "爆笑",
            artist: "syudou",
            singers: ["KotoUrara"],
            youtube: "https://youtu.be/dfLrA0k9g2A",
            thumbnail: `${COVER_THUMBNAIL_BASE}/bakusyou.webp`,
            date: "2023-11-20",
            initialPopularity: 8
        },
        {
            slug: "eba",
            contentType: "music-cover",
            publicId: "55d004cf-588a-4f1c-8191-29a3dd0260be",
            published: true,
            title: "エバ",
            artist: "柊キライ",
            singers: ["KotoUrara"],
            youtube: "https://youtu.be/EyUdzLR_YRs",
            thumbnail: `${COVER_THUMBNAIL_BASE}/eba.webp`,
            date: "2023-08-28",
            initialPopularity: 5
        },
        {
            slug: "kodoku-no-syuukyou",
            contentType: "music-cover",
            publicId: "7a3a9bb6-7f7a-4818-8fe2-6db6e4247115",
            published: true,
            title: "孤独の宗教",
            artist: "syudou",
            singers: ["KotoUrara"],
            youtube: "https://youtu.be/1hLRmv2ulMA",
            thumbnail: `${COVER_THUMBNAIL_BASE}/kodokuNoSyuukyou.webp`,
            date: "2023-07-31",
            initialPopularity: 4
        },
        {
            slug: "vampire",
            contentType: "music-cover",
            publicId: "42ecdc1e-f7f2-4394-9cb4-89d96ae461aa",
            published: true,
            title: "ヴァンパイア",
            artist: "DECO*27",
            singers: ["KotoUrara"],
            youtube: "https://youtu.be/M8X23kW-hA4",
            thumbnail: `${COVER_THUMBNAIL_BASE}/vampire.webp`,
            date: "2023-06-20",
            initialPopularity: 1
        },
        {
            slug: "darling-dance",
            contentType: "music-cover",
            publicId: "ce1ac7f6-9985-42e6-b7f8-41ee7f9b4f78",
            published: true,
            title: "ダーリンダンス",
            artist: "かいりきベア",
            singers: ["KotoUrara"],
            youtube: "https://youtu.be/TAzBWBkohlc",
            thumbnail: `${COVER_THUMBNAIL_BASE}/darlingDance.webp`,
            date: "2023-04-03",
            initialPopularity: 3.5
        },
        {
            slug: "echo",
            contentType: "music-cover",
            publicId: "8929bdfc-4340-4201-b35b-467570dfc74d",
            published: true,
            title: "ECHO",
            artist: "CrusherP",
            singers: ["KotoUrara"],
            youtube: "https://youtu.be/S3xED2dqQ6U",
            thumbnail: `${COVER_THUMBNAIL_BASE}/echo.webp`,
            date: "2023-03-21",
            initialPopularity: 3
        },
        {
            slug: "magical-girl-and-chocolate",
            contentType: "music-cover",
            publicId: "88c0d498-9de4-4210-a921-9ee146eab159",
            published: true,
            title: "魔法少女とチョコレゐト",
            artist: "PinocchioP",
            singers: ["KotoUrara"],
            youtube: "https://youtu.be/C7_84Vvzwpg",
            thumbnail: `${COVER_THUMBNAIL_BASE}/magicalGirlAndChocolate.webp`,
            date: "2022-12-05",
            initialPopularity: 2
        },
        {
            slug: "bug",
            contentType: "music-cover",
            publicId: "eddfc16a-4cc3-498e-8536-d7e7db4edc3b",
            published: true,
            title: "バグ",
            artist: "かいりきベア",
            singers: ["KotoUrara"],
            youtube: "https://youtu.be/hrpoyQNDPl0",
            thumbnail: `${COVER_THUMBNAIL_BASE}/bug.webp`,
            date: "2022-08-21",
            initialPopularity: 0
        }
    ];

    let ORIGINAL_TRACKS = [];
    let COVER_TRACKS = [];
    let ALL_MUSIC_ITEMS = [];

    const state = {
        view: "original",
        originalMode: "list",
        activeTrackIndex: 0,
        transitioning: false,
        listScrollY: 0,
        lastScrollY: window.scrollY,
        scrollFrame: 0,
        trackMeasureFrame: 0,
        summaryToken: 0,
        repeatMode: "off",
        shuffle: false,
        shuffleQueue: [],
        history: [],
        variantBySlug: new Map(),
        audioTrackSlug: null,
        audioVariant: "vocal",
        discRotation: 0,
        playerFrame: 0,
        lastPlayerFrameTime: 0,
        visualizerMetrics: null,
        visualizerLastDraw: 0,
        seeking: false,
        pendingSeekRatio: null,
        playIntent: null,
        playRequestToken: 0,
        audioActuallyPlaying: false,
        audioBuffering: false,
        favBySlug: new Map(),
        favRevisionBySlug: new Map(),
        coverSort: "newest",
        coverFilter: "all",
        activeCoverVideoSlug: null,
        pendingCoverSortRefresh: false,
        pendingFavSlugs: new Set(),
        interpretationTrackSlug: null,
        interpretationDraftBySlug: new Map(),
        interpretationPositioned: false,
        suppressInterpretationClick: false,
        diaryTrackSlug: null,
        restoringUrl: false
    };

    const refs = {};
    const audio = new Audio();
    audio.preload = "auto";
    audio.playsInline = true;

    let audioContext = null;
    let audioSource = null;
    let analyser = null;
    let analyserData = null;

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

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function normalizeText(value) {
        return String(value || "")
            .normalize("NFKC")
            .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
            .replace(/[\u200B-\u200D\uFEFF]/g, "")
            .replace(/<[^>]*>/g, "")
            .replace(/\n{3,}/g, "\n\n")
            .trim();
    }

    function containsUrl(value) {
        return /(?:https?:\/\/|www\.|[a-z0-9-]+\.(?:com|net|jp|org)\b)/i.test(value);
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

    function originalTrackBySlug(slug) {
        return ORIGINAL_TRACKS.find((track) => track.slug === slug) || null;
    }

    function coverTrackBySlug(slug) {
        return COVER_TRACKS.find((track) => track.slug === slug) || null;
    }

    function itemBySlug(slug) {
        return ALL_MUSIC_ITEMS.find((item) => item.slug === slug) || null;
    }

    function activeTrack() {
        return ORIGINAL_TRACKS[state.activeTrackIndex];
    }

    function trackRawPublicationState(track) {
        if (track?.publication?.rawState) return track.publication.rawState;
        return track?.published === true ? "public" : "hidden";
    }

    function trackEffectivePublicationState(track) {
        const state = track?.publication?.state
            || (track?.published === true ? "public" : "hidden");
        if (!PUBLICATION_VISIBLE_STATES.has(state)) return "hidden";
        if (!isTrackWithinLocalPublicationWindow(track)) return "hidden";
        return state;
    }

    function trackIsPastUnpublishWindow(track, now = Date.now()) {
        const value = track?.publication?.unpublishAt ?? track?.unpublishAt;
        const unpublishAt = value ? Date.parse(value) : Number.POSITIVE_INFINITY;
        return Number.isFinite(unpublishAt) && now >= unpublishAt;
    }

    function isTrackListVisible(track, now = Date.now()) {
        if (track?.sections?.list === false) return false;

        const rawVisible = PUBLICATION_VISIBLE_STATES.has(trackRawPublicationState(track));
        const effectiveVisible = PUBLICATION_VISIBLE_STATES.has(trackEffectivePublicationState(track));

        // list:true は公開予約中の一覧先行表示を許可する。
        // 詳細／視聴可否は effective state 側で別判定する。
        if (track?.sections?.list === true) {
            return rawVisible && !trackIsPastUnpublishWindow(track, now);
        }
        return effectiveVisible;
    }

    function isTrackPlayerAvailable(track) {
        return PUBLICATION_DETAIL_STATES.has(trackEffectivePublicationState(track))
            && track?.sections?.detail !== false;
    }

    function playerTrackIndices() {
        return ORIGINAL_TRACKS
            .map((track, index) => ({ track, index }))
            .filter(({ track }) => isTrackPlayerAvailable(track))
            .map(({ index }) => index);
    }

    function adjacentPlayerIndex(index, direction) {
        const indices = playerTrackIndices();
        if (!indices.length) return null;
        const position = indices.indexOf(index);
        if (position < 0) return indices[0];
        return indices[(position + direction + indices.length) % indices.length];
    }

    function formatDate(value) {
        return value.replaceAll("-", ".");
    }

    function youtubeId(url) {
        if (!url) return "";
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]{6,})/);
        return match ? match[1] : "";
    }

    function setMaskImage(element, path) {
        if (!element) return;
        const value = `url("${path}")`;
        element.style.maskImage = value;
        element.style.webkitMaskImage = value;
    }

    function iconSpanMarkup(path, className = "music-action__icon") {
        return `<span class="${className}" aria-hidden="true"
            style="mask-image:url('${path}');-webkit-mask-image:url('${path}');"></span>`;
    }

    function dualIconSpanMarkup(primaryPath, alternatePath) {
        return `
            <span class="music-action__icon-stack" aria-hidden="true">
                ${iconSpanMarkup(primaryPath, "music-action__icon music-action__icon--primary")}
                ${iconSpanMarkup(alternatePath, "music-action__icon music-action__icon--alternate")}
            </span>`;
    }

    function preloadMusicIcons() {
        const paths = [...new Set(Object.values(ICONS).map(resolveAsset))];
        return Promise.allSettled(paths.map((path) => new Promise((resolve) => {
            const image = new Image();
            image.onload = image.onerror = resolve;
            image.src = path;
        })));
    }

    /* =========================================================
       Backend adapter boundary

       Local Storage仮運用とSupabase接続を同じ契約へ揃える。
       後のバックエンド調整では、この区画だけを変更し、
       描画・fav UI・フォーム・ソート処理には触れない。
       ========================================================= */

    const MUSIC_BACKEND_CONFIG = Object.freeze({
        mode: "supabase", // "local" | "supabase"
        apiBase: "https://atmsoeyldykwhnobxiin.supabase.co/functions/v1",
        endpoints: Object.freeze({
            getFavState: "get-content-state",
            toggleFav: "toggle-reaction",
            submitInterpretation: "submit-comment"
        })
    });

    const LOCAL_FAV_STORAGE_KEY = "kotonoura_music_favs_v1";
    const LOCAL_INTERPRETATION_STORAGE_KEY = "kotonoura_music_interpretations_v1";

    function readJsonStorage(key, fallback) {
        try {
            const value = JSON.parse(localStorage.getItem(key) || "null");
            return value ?? fallback;
        } catch (_) {
            return fallback;
        }
    }

    function writeJsonStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (_) {
            /* localStorageが使えない場合は現在のタブ内状態だけを維持する。 */
        }
    }

    const localBackend = {
        async getFavState(item) {
            const values = readJsonStorage(LOCAL_FAV_STORAGE_KEY, {});
            return {
                favored: values[item.slug] === true,
                favCount: values[item.slug] === true ? 1 : 0,
                source: "local"
            };
        },

        async toggleFav(item, desiredFavored = null) {
            const values = readJsonStorage(LOCAL_FAV_STORAGE_KEY, {});
            const favored = typeof desiredFavored === "boolean"
                ? desiredFavored
                : values[item.slug] !== true;
            values[item.slug] = favored;
            writeJsonStorage(LOCAL_FAV_STORAGE_KEY, values);
            return {
                favored,
                favCount: favored ? 1 : 0,
                source: "local"
            };
        },

        async submitInterpretation(item, payload) {
            const records = readJsonStorage(LOCAL_INTERPRETATION_STORAGE_KEY, []);
            const now = Date.now();
            const visitor = visitorId();
            const sameTrack = records
                .filter((record) => record.slug === item.slug && record.visitorId === visitor)
                .sort((left, right) => right.createdAt - left.createdAt);
            const latest = sameTrack[0];

            if (latest && now - latest.createdAt < LOCAL_COMMENT_COOLDOWN_MS) {
                const error = new Error("同じ曲への連続投稿は、少し時間を空けてください。");
                error.code = "LOCAL_COOLDOWN";
                error.retryAfterMs = LOCAL_COMMENT_COOLDOWN_MS - (now - latest.createdAt);
                throw error;
            }

            const normalizedBody = normalizeText(payload.body).toLocaleLowerCase("ja-JP");
            const duplicate = sameTrack.some((record) =>
                normalizeText(record.body).toLocaleLowerCase("ja-JP") === normalizedBody
            );
            if (duplicate) {
                const error = new Error("同じ内容は続けて保存できません。");
                error.code = "LOCAL_DUPLICATE";
                throw error;
            }

            records.push({
                slug: item.slug,
                publicId: item.publicId,
                visitorId: visitor,
                displayName: payload.displayName,
                body: payload.body,
                createdAt: now,
                status: "local-draft"
            });
            writeJsonStorage(LOCAL_INTERPRETATION_STORAGE_KEY, records);
            return { accepted: true, status: "local-draft", source: "local" };
        },

        async getCooldown(item) {
            const records = readJsonStorage(LOCAL_INTERPRETATION_STORAGE_KEY, []);
            const visitor = visitorId();
            const latest = records
                .filter((record) => record.slug === item.slug && record.visitorId === visitor)
                .sort((left, right) => right.createdAt - left.createdAt)[0];
            const remainingMs = latest
                ? Math.max(0, LOCAL_COMMENT_COOLDOWN_MS - (Date.now() - latest.createdAt))
                : 0;
            return { remainingMs, source: "local" };
        }
    };

    async function musicApiRequest(endpoint, payload) {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 10000);

        try {
            const response = await fetch(`${MUSIC_BACKEND_CONFIG.apiBase}/${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                signal: controller.signal
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                const error = new Error(data?.error || data?.message || "通信に失敗しました。");
                error.code = data?.code || data?.error || `HTTP_${response.status}`;
                error.status = response.status;
                error.retryAfterMs = Number(response.headers.get("Retry-After")) * 1000 || 0;
                throw error;
            }
            return data;
        } catch (error) {
            if (error?.name === "AbortError") {
                const timeoutError = new Error("通信がタイムアウトしました。");
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

    function musicFavRevision(slug) {
        return state.favRevisionBySlug.get(slug) || 0;
    }

    function musicBumpFavRevision(slug) {
        const next = musicFavRevision(slug) + 1;
        state.favRevisionBySlug.set(slug, next);
        return next;
    }

    function writeMusicFavCache(slug, favored) {
        const values = readJsonStorage(LOCAL_FAV_STORAGE_KEY, {});
        values[slug] = favored;
        writeJsonStorage(LOCAL_FAV_STORAGE_KEY, values);
    }

    function isRecoverableMusicFavError(error) {
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

    async function requestMusicFavWithRetry(item, desiredFavored, revision) {
        const delays = [0, 650, 2200];
        let lastError = null;

        for (let attempt = 0; attempt < delays.length; attempt += 1) {
            if (musicFavRevision(item.slug) !== revision) return null;
            const delay = Math.max(delays[attempt], Number(lastError?.retryAfterMs) || 0);
            if (delay > 0) await wait(delay);
            if (musicFavRevision(item.slug) !== revision) return null;

            try {
                return await backend.toggleFav(item, desiredFavored);
            } catch (error) {
                lastError = error;
                if (!isRecoverableMusicFavError(error)) throw error;
            }
        }
        throw lastError || new Error("通信に失敗しました。");
    }

    const supabaseBackend = {
        async getFavState(item) {
            const response = await musicApiRequest(MUSIC_BACKEND_CONFIG.endpoints.getFavState, {
                content_type: item.contentType,
                content_slug: item.slug,
                visitor_id: visitorId()
            });
            return {
                favored: Boolean(response?.favored),
                favCount: Number.isFinite(response?.fav_count) ? response.fav_count : 0,
                source: "supabase"
            };
        },

        async toggleFav(item, desiredFavored) {
            const response = await musicApiRequest(MUSIC_BACKEND_CONFIG.endpoints.toggleFav, {
                target_type: "content",
                content_type: item.contentType,
                content_slug: item.slug,
                reaction_type: "fav",
                visitor_id: visitorId(),
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
        },

        async submitInterpretation(item, payload) {
            return musicApiRequest(MUSIC_BACKEND_CONFIG.endpoints.submitInterpretation, {
                content_type: item.contentType,
                content_slug: item.slug,
                visitor_id: visitorId(),
                display_name: payload.displayName,
                body: payload.body
            });
        },

        async getCooldown() {
            return { remainingMs: 0, source: "supabase" };
        }
    };

    const backend = MUSIC_BACKEND_CONFIG.mode === "supabase"
        ? supabaseBackend
        : localBackend;

    /* =========================================================
       Markup helpers
       ========================================================= */

    function iconButtonMarkup({
        action,
        icon,
        alternateIcon = "",
        alternateActive = false,
        label,
        selected = false,
        favored = false,
        disabled = false,
        extraClass = ""
    }) {
        const classes = [
            "music-action",
            extraClass,
            selected ? "is-selected" : "",
            favored ? "is-favored" : "",
            alternateActive ? "is-alt-icon" : "",
            disabled ? "is-disabled" : ""
        ].filter(Boolean).join(" ");
        const iconMarkup = alternateIcon
            ? dualIconSpanMarkup(icon, alternateIcon)
            : iconSpanMarkup(icon);
        return `
            <button class="${classes}" type="button" data-music-action="${action}"
                aria-label="${label}" aria-pressed="${selected || favored}"
                ${disabled ? 'disabled aria-disabled="true"' : ""}>
                ${iconMarkup}
            </button>`;
    }

    function iconLinkMarkup({ href, icon, label, extraClass = "" }) {
        const disabled = !href;
        if (disabled) {
            return `
                <span class="music-action is-disabled ${extraClass}" aria-disabled="true" aria-label="${label}">
                    ${iconSpanMarkup(icon)}
                </span>`;
        }
        return `
            <a class="music-action ${extraClass}" href="${href}" target="_blank"
                rel="noopener noreferrer" aria-label="${label}">
                ${iconSpanMarkup(icon)}
            </a>`;
    }

    function jacketShellMarkup(track) {
        const playIcon = isTrackPlayerAvailable(track)
            ? iconSpanMarkup(ICONS.play, "music-jacket-shell__play")
            : "";
        return `
            <div class="music-jacket-shell" data-jacket-shell="${track.slug}"
                style="--disc-rotation:0deg">
                <span class="music-jacket-shell__disc">
                    <img class="music-jacket-shell__image" src="${resolveAsset(track.jacket)}"
                        alt="${track.title} ジャケット" loading="lazy" decoding="async" draggable="false">
                </span>
                <span class="music-jacket-shell__frame" aria-hidden="true"></span>
                ${playIcon}
            </div>`;
    }

    function createTrackCard(track, index) {
        const active = index === state.activeTrackIndex;
        const playerAvailable = isTrackPlayerAvailable(track);
        return `
            <article class="music-track-card${active ? " is-active" : ""}"
                data-track-card="${track.slug}" data-track-index="${index}">
                <button class="music-track-card__button" type="button" data-track-select="${index}"
                    aria-label="${track.title}${active && playerAvailable ? "を開く" : "を選択"}">
                    ${jacketShellMarkup(track)}
                </button>
            </article>`;
    }

    function favRecord(item) {
        return state.favBySlug.get(item.slug) || { favored: false, favCount: 0 };
    }

    function renderTrackList() {
        refs.trackList.innerHTML = ORIGINAL_TRACKS.map(createTrackCard).join("");
    }

    function syncTrackSectionHeights() {
        state.trackMeasureFrame = 0;
        if (!refs.summary || !refs.trackList || state.originalMode !== "list") return;

        refs.summary.querySelectorAll(".music-summary__measure").forEach((element) => element.remove());
        const summaryStyles = getComputedStyle(refs.summary);
        const summaryPadding =
            (Number.parseFloat(summaryStyles.paddingTop) || 0)
            + (Number.parseFloat(summaryStyles.paddingBottom) || 0);
        const viewportBuffer = Math.max(28, window.innerHeight * 0.08);

        ORIGINAL_TRACKS.forEach((track, index) => {
            const card = trackCard(index);
            const shell = trackShell(index);
            if (!card || !shell) return;

            const measure = document.createElement("div");
            measure.className = "music-summary__inner music-summary__measure";
            measure.innerHTML = summaryMarkup(track);
            refs.summary.append(measure);

            const summaryHeight = measure.scrollHeight + summaryPadding;
            const jacketHeight = shell.getBoundingClientRect().height;
            const minimumHeight = jacketHeight + Math.max(96, window.innerHeight * 0.16);
            const sectionHeight = Math.max(minimumHeight, summaryHeight + viewportBuffer);
            card.style.setProperty("--track-section-height", `${Math.ceil(sectionHeight)}px`);
            measure.remove();
        });
    }

    function scheduleTrackSectionMeasure() {
        if (state.trackMeasureFrame) return;
        state.trackMeasureFrame = requestAnimationFrame(syncTrackSectionHeights);
    }

    function summaryLinkRow(track) {
        const favored = favRecord(track).favored;
        return `
            <div class="music-summary__actions">
                <div class="music-summary__links">
                    ${iconLinkMarkup({ href: track.links.streaming, icon: ICONS.album, label: "配信ページを開く" })}
                    ${iconLinkMarkup({ href: track.links.youtube, icon: ICONS.youtube, label: "YouTubeで聴く" })}
                    ${iconLinkMarkup({ href: track.links.x, icon: ICONS.x, label: "Xの投稿を開く" })}
                </div>
                <div class="music-summary__fav-area${favored ? " is-reaction-visible" : ""}">
                    ${iconButtonMarkup({
                        action: `interpretation:${track.slug}`,
                        icon: ICONS.reaction,
                        label: "曲の解釈を書く",
                        extraClass: "music-action--reaction"
                    })}
                    ${iconButtonMarkup({
                        action: `fav:${track.slug}`,
                        icon: ICONS.favBefore,
                        alternateIcon: ICONS.favAfter,
                        alternateActive: favored,
                        label: favored ? "favを解除する" : "favする",
                        favored,
                        extraClass: "music-action--fav"
                    })}
                </div>
            </div>`;
    }

    function summaryMarkup(track) {
        const thumbnailTag = track.links.youtube
            ? `<a class="music-summary__thumbnail" href="${track.links.youtube}" target="_blank"
                    rel="noopener noreferrer" aria-label="YouTubeで${track.title}を聴く">
                    <img src="${resolveAsset(track.thumbnail)}" alt="${track.title} 動画サムネイル" loading="lazy">
               </a>`
            : `<span class="music-summary__thumbnail is-disabled" aria-disabled="true">
                    <img src="${resolveAsset(track.thumbnail)}" alt="${track.title} 動画サムネイル" loading="lazy">
               </span>`;

        return `
            <header class="music-summary__heading">
                <p class="music-summary__eyebrow">${track.preTitle}</p>
                <h2 class="music-summary__title">${track.preDisplayTitle.replace(/\n/g, "<br>")}</h2>
            </header>
            ${thumbnailTag}
            ${summaryLinkRow(track)}
            <section class="music-summary__flavor">
                ${track.flavor.title ? `<h3 class="music-summary__flavor-title">${track.flavor.title}</h3>` : ""}
                ${track.flavor.subtitle ? `<p class="music-summary__flavor-subtitle">${track.flavor.subtitle}</p>` : ""}
                <p class="music-summary__flavor-body">${track.flavor.body}</p>
            </section>`;
    }

    async function renderSummary(track, { immediate = false } = {}) {
        const token = ++state.summaryToken;
        if (!immediate && !prefersReducedMotion() && refs.summaryInner.innerHTML) {
            refs.summaryInner.classList.add("is-changing");
            await wait(SUMMARY_TRANSITION_MS);
            if (token !== state.summaryToken) return;
        }
        refs.summaryInner.innerHTML = summaryMarkup(track);
        await nextPaint();
        if (token !== state.summaryToken) return;
        refs.summaryInner.classList.remove("is-changing");
    }

    function syncListActiveUi() {
        refs.trackList.querySelectorAll("[data-track-card]").forEach((card) => {
            const active = Number(card.dataset.trackIndex) === state.activeTrackIndex;
            card.classList.toggle("is-active", active);
            const button = card.querySelector("[data-track-select]");
            if (button) {
                const track = ORIGINAL_TRACKS[Number(card.dataset.trackIndex)];
                button.setAttribute(
                    "aria-label",
                    `${track.title}${active && isTrackPlayerAvailable(track) ? "を開く" : "を選択"}`
                );
            }
        });
    }

    function setActiveTrack(index, {
        immediateSummary = false,
        closeWindows = true,
        preserveInterpretation = false
    } = {}) {
        if (!ORIGINAL_TRACKS.length) return;
        const next = clamp(index, 0, ORIGINAL_TRACKS.length - 1);
        if (next === state.activeTrackIndex) return;
        state.activeTrackIndex = next;
        syncListActiveUi();
        void renderSummary(activeTrack(), { immediate: immediateSummary });
        if (closeWindows) {
            if (!preserveInterpretation) closeInterpretation();
            closeDiaryWindow();
        }
    }

    /* =========================================================
       Collapsed scroll activation
       ========================================================= */

    function scrollActivationLine() {
        const headerHeight = refs.header?.getBoundingClientRect().height || 0;
        return headerHeight + (window.innerHeight - headerHeight) * 0.58;
    }

    function updateCollapsedTrackFromScroll() {
        state.scrollFrame = 0;
        if (state.view !== "original" || state.originalMode !== "list" || state.transitioning) return;

        state.lastScrollY = window.scrollY;
        const line = scrollActivationLine();
        const cards = [...refs.trackList.querySelectorAll("[data-track-index]")];
        if (!cards.length) return;

        let nextIndex = state.activeTrackIndex;
        for (const card of cards) {
            const rect = card.getBoundingClientRect();
            if (line >= rect.top && line < rect.bottom) {
                nextIndex = Number(card.dataset.trackIndex);
                break;
            }
        }

        const firstRect = cards[0].getBoundingClientRect();
        const lastRect = cards[cards.length - 1].getBoundingClientRect();
        if (line < firstRect.top) nextIndex = 0;
        if (line >= lastRect.bottom) nextIndex = cards.length - 1;

        if (nextIndex !== state.activeTrackIndex) {
            setActiveTrack(nextIndex, { preserveInterpretation: true });
        }
    }

    function scheduleCollapsedScrollUpdate() {
        if (state.scrollFrame) return;
        state.scrollFrame = requestAnimationFrame(updateCollapsedTrackFromScroll);
    }

    function scrollCardToActivationLine(card) {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const line = scrollActivationLine();
        const target = Math.max(0, window.scrollY + rect.top + rect.height / 2 - line);
        window.scrollTo({ top: target, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }

    /* =========================================================
       Audio and visualizer
       ========================================================= */

    async function ensureAudioGraph() {
        if (analyser) {
            if (audioContext?.state === "suspended") await audioContext.resume().catch(() => undefined);
            return;
        }

        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;

        try {
            audioContext = new AudioContextClass();
            audioSource = audioContext.createMediaElementSource(audio);
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.8;
            analyserData = new Uint8Array(analyser.frequencyBinCount);
            audioSource.connect(analyser);
            analyser.connect(audioContext.destination);
            if (audioContext.state === "suspended") await audioContext.resume();
        } catch (error) {
            console.warn("Audio Visualizerを初期化できませんでした。", error);
            analyser = null;
            analyserData = null;
        }
    }

    function currentVariantFor(track) {
        if (!track.instrumental) return "vocal";
        return state.variantBySlug.get(track.slug) || "vocal";
    }

    function audioPathFor(track, variant = currentVariantFor(track)) {
        return variant === "instrumental" && track.instrumental
            ? track.instrumental
            : track.audio;
    }

    function waitForMetadata() {
        if (Number.isFinite(audio.duration) && audio.duration > 0) return Promise.resolve();
        return new Promise((resolve) => {
            const finish = () => resolve();
            audio.addEventListener("loadedmetadata", finish, { once: true });
            audio.addEventListener("error", finish, { once: true });
            window.setTimeout(finish, 2500);
        });
    }

    function syncPlayerLoading() {
        if (!refs.playerLoading || !refs.player) return;
        const visible = state.originalMode === "player" && (state.transitioning || state.audioBuffering);
        refs.playerLoading.hidden = !visible;
        refs.playerLoading.setAttribute("aria-hidden", String(!visible));
        refs.player.classList.toggle("is-audio-loading", visible);
    }

    function setAudioBuffering(buffering) {
        state.audioBuffering = Boolean(buffering);
        syncPlayerLoading();
    }

    function playbackShouldContinue() {
        return state.playIntent === true
            || state.audioActuallyPlaying
            || (!audio.paused && !audio.ended);
    }

    function beginAudioLoadForTrack(track, {
        reset = true,
        preserveRatio = null
    } = {}) {
        const variant = currentVariantFor(track);
        const path = audioPathFor(track, variant);
        const sameSource = state.audioTrackSlug === track.slug
            && state.audioVariant === variant
            && audio.currentSrc.endsWith(path);

        if (sameSource) {
            if (Number.isFinite(preserveRatio)) {
                state.pendingSeekRatio = clamp(preserveRatio, 0, 1);
                if (Number.isFinite(audio.duration) && audio.duration > 0) {
                    applySeekRatio(state.pendingSeekRatio);
                }
            } else if (reset && Number.isFinite(audio.duration)) {
                audio.currentTime = 0;
            }
            return false;
        }

        audio.pause();
        state.audioActuallyPlaying = false;
        state.pendingSeekRatio = Number.isFinite(preserveRatio)
            ? clamp(preserveRatio, 0, 1)
            : null;
        audio.src = path;
        audio.load();
        state.audioTrackSlug = track.slug;
        state.audioVariant = variant;
        setAudioBuffering(true);
        syncPlayerProgress();
        return true;
    }

    async function loadAudioForTrack(track, options = {}) {
        const changed = beginAudioLoadForTrack(track, options);
        if (changed || !Number.isFinite(audio.duration) || audio.duration <= 0) {
            await waitForMetadata();
        }
        if (Number.isFinite(state.pendingSeekRatio)) applySeekRatio(state.pendingSeekRatio);
        if (audio.paused && state.playIntent !== true) setAudioBuffering(false);
        syncPlayerProgress();
    }

    async function playAudio() {
        if (state.view !== "original" || state.originalMode !== "player") return;
        const token = ++state.playRequestToken;
        state.playIntent = true;
        syncPlayerControls();
        const track = activeTrack();

        try {
            if (state.audioTrackSlug !== track.slug || state.audioVariant !== currentVariantFor(track)) {
                beginAudioLoadForTrack(track, { reset: false });
            } else if (audio.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
                setAudioBuffering(true);
            }

            if (token !== state.playRequestToken || state.playIntent !== true) return;

            // iOS Safariのユーザー操作権を失わないよう、metadataや演出を待たずplay()を先に呼ぶ。
            const playPromise = audio.play();
            await playPromise;
            if (token !== state.playRequestToken || state.playIntent !== true) return;

            // Visualizer初期化は実再生開始を妨げないよう後段で行う。
            void ensureAudioGraph().then(() => {
                if (state.audioActuallyPlaying) startPlayerFrame();
            });
        } catch (error) {
            setAudioBuffering(false);
            console.info("ブラウザにより再生が保留されました。", error);
        } finally {
            if (token === state.playRequestToken) {
                state.playIntent = null;
                syncPlayerControls();
            }
        }
    }

    function pauseAudio() {
        state.playRequestToken += 1;
        state.playIntent = false;
        state.audioActuallyPlaying = false;
        setAudioBuffering(false);
        syncPlayerControls();
        audio.pause();
        state.playIntent = null;
        syncPlayerControls();
    }

    async function toggleAudio() {
        const intendedPlaying = playbackShouldContinue();
        if (!intendedPlaying) await playAudio();
        else pauseAudio();
    }

    function progressRatio() {
        if (!Number.isFinite(audio.duration) || audio.duration <= 0) return 0;
        return clamp(audio.currentTime / audio.duration, 0, 1);
    }

    function syncPlayerProgress() {
        if (!refs.discStage) return;
        refs.discStage.style.setProperty("--progress-angle", `${progressRatio() * 360}deg`);
        const shell = refs.discHost?.querySelector(".music-jacket-shell");
        if (shell) shell.style.setProperty("--disc-rotation", `${state.discRotation}deg`);
    }

    function resizeVisualizerCanvas(force = false) {
        const canvas = refs.visualizer;
        if (!canvas) return null;
        if (!force && state.visualizerMetrics) return state.visualizerMetrics;

        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(MOBILE_MUSIC_MODE ? 1.5 : 2, window.devicePixelRatio || 1);
        const width = Math.max(1, Math.round(rect.width * dpr));
        const height = Math.max(1, Math.round(rect.height * dpr));
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
        }
        const context = canvas.getContext("2d");
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        state.visualizerMetrics = { context, width: rect.width, height: rect.height };
        return state.visualizerMetrics;
    }

    function drawVisualizer(now = performance.now(), force = false) {
        if (MOBILE_MUSIC_MODE && !force && now - state.visualizerLastDraw < 33) return;
        state.visualizerLastDraw = now;

        const metrics = resizeVisualizerCanvas();
        if (!metrics) return;
        const { context, width, height } = metrics;
        context.clearRect(0, 0, width, height);
        if (!analyser || !analyserData || !state.audioActuallyPlaying) return;

        analyser.getByteFrequencyData(analyserData);
        const centerX = width / 2;
        const centerY = height / 2;
        const baseRadius = Math.min(width, height) * 0.405;
        const bars = MOBILE_MUSIC_MODE ? 48 : 72;
        context.lineWidth = Math.max(1, width * 0.0035);
        context.strokeStyle = "rgba(255,255,255,.72)";
        context.lineCap = "round";

        for (let index = 0; index < bars; index += 1) {
            const sourceIndex = Math.floor(index / bars * analyserData.length * 0.72);
            const level = analyserData[sourceIndex] / 255;
            const length = 1 + level * Math.min(width, height) * 0.075;
            const angle = index / bars * Math.PI * 2 - Math.PI / 2;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            context.beginPath();
            context.moveTo(centerX + cos * baseRadius, centerY + sin * baseRadius);
            context.lineTo(centerX + cos * (baseRadius + length), centerY + sin * (baseRadius + length));
            context.stroke();
        }
    }

    function playerFrame(now) {
        state.playerFrame = 0;
        if (state.originalMode !== "player" || state.view !== "original") return;

        if (!state.lastPlayerFrameTime) state.lastPlayerFrameTime = now;
        const delta = Math.min(64, now - state.lastPlayerFrameTime);
        state.lastPlayerFrameTime = now;

        if (state.audioActuallyPlaying && !state.seeking) {
            state.discRotation = (state.discRotation + delta * 0.0038) % 360;
        }
        syncPlayerProgress();
        drawVisualizer(now);

        if (state.audioActuallyPlaying || state.audioBuffering || state.playIntent === true || state.seeking) {
            state.playerFrame = requestAnimationFrame(playerFrame);
        } else {
            state.lastPlayerFrameTime = 0;
        }
    }

    function startPlayerFrame() {
        if (state.playerFrame || state.originalMode !== "player") return;
        state.lastPlayerFrameTime = 0;
        state.playerFrame = requestAnimationFrame(playerFrame);
    }

    function stopPlayerFrame() {
        if (state.playerFrame) cancelAnimationFrame(state.playerFrame);
        state.playerFrame = 0;
        state.lastPlayerFrameTime = 0;
    }

    /* =========================================================
       Player rendering and shared jacket movement
       ========================================================= */

    function trackCard(index) {
        return refs.trackList.querySelector(`[data-track-index="${index}"]`);
    }

    function trackShell(index) {
        return trackCard(index)?.querySelector(".music-jacket-shell") || null;
    }

    function trackPlaceholder(index) {
        return trackCard(index)?.querySelector(".music-track-card__placeholder") || null;
    }

    function ensureTrackPlaceholder(index) {
        const card = trackCard(index);
        const button = card?.querySelector(".music-track-card__button");
        if (!button) return null;
        let placeholder = button.querySelector(".music-track-card__placeholder");
        if (!placeholder) {
            placeholder = document.createElement("span");
            placeholder.className = "music-track-card__placeholder";
            placeholder.setAttribute("aria-hidden", "true");
            button.append(placeholder);
        }
        return placeholder;
    }

    function setShellFlightRect(shell, rect) {
        shell.classList.add("is-flight");
        shell.style.left = `${rect.left}px`;
        shell.style.top = `${rect.top}px`;
        shell.style.width = `${rect.width}px`;
        shell.style.height = `${rect.height}px`;
    }

    function clearShellFlightStyles(shell) {
        shell.classList.remove("is-flight");
        shell.style.removeProperty("left");
        shell.style.removeProperty("top");
        shell.style.removeProperty("width");
        shell.style.removeProperty("height");
    }

    async function animateShellFlight(shell, fromRect, toRect, {
        toPlayer,
        duration = PLAYER_TRANSITION_MS
    } = {}) {
        setShellFlightRect(shell, fromRect);
        const disc = shell.querySelector(".music-jacket-shell__disc");

        if (prefersReducedMotion() || typeof shell.animate !== "function") {
            setShellFlightRect(shell, toRect);
            return;
        }

        const shellAnimation = shell.animate([
            {
                left: `${fromRect.left}px`,
                top: `${fromRect.top}px`,
                width: `${fromRect.width}px`,
                height: `${fromRect.height}px`,
                opacity: 1
            },
            {
                left: `${toRect.left}px`,
                top: `${toRect.top}px`,
                width: `${toRect.width}px`,
                height: `${toRect.height}px`,
                opacity: 1
            }
        ], {
            duration,
            easing: "cubic-bezier(.2,.72,.2,1)",
            fill: "forwards"
        });

        const discAnimation = disc?.animate([
            { borderRadius: toPlayer ? "0%" : "50%" },
            { borderRadius: toPlayer ? "50%" : "0%" }
        ], {
            duration,
            easing: "cubic-bezier(.2,.72,.2,1)",
            fill: "forwards"
        });

        await Promise.allSettled([
            shellAnimation.finished,
            discAnimation?.finished || Promise.resolve()
        ]);
        shellAnimation.cancel();
        discAnimation?.cancel();
        setShellFlightRect(shell, toRect);
    }

    function creditsMarkup(track) {
        return track.credits.map(([role, value]) => `
            <p class="music-player__credit-row">
                <span class="music-player__credit-role">${role}：</span>
                <span class="music-player__credit-value">${value}</span>
            </p>`).join("");
    }

    function leftRailMarkup() {
        const repeatSelected = state.repeatMode !== "off";
        return [
            iconButtonMarkup({
                action: "repeat",
                icon: ICONS.repeat,
                alternateIcon: ICONS.repeatOne,
                alternateActive: state.repeatMode === "one",
                label: state.repeatMode === "all" ? "一曲リピートへ切り替える"
                    : state.repeatMode === "one" ? "リピートを解除する"
                        : "全曲リピートへ切り替える",
                selected: repeatSelected
            }),
            iconButtonMarkup({
                action: "shuffle",
                icon: ICONS.shuffle,
                label: state.shuffle ? "シャッフルを解除する" : "シャッフルする",
                selected: state.shuffle
            }),
            iconButtonMarkup({ action: "replay5", icon: ICONS.replay5, label: "5秒戻す" }),
            iconButtonMarkup({ action: "forward5", icon: ICONS.forward5, label: "5秒進める" }),
            iconButtonMarkup({ action: "skipPrev", icon: ICONS.skipPrev, label: "前の曲へ" }),
            iconButtonMarkup({ action: "skipNext", icon: ICONS.skipNext, label: "次の曲へ" })
        ].join("");
    }

    function rightRailMarkup(track) {
        const favored = favRecord(track).favored;
        const diaryEntry = getDiaryEntry(track);
        return [
            iconButtonMarkup({ action: "lyrics", icon: ICONS.lyrics, label: "歌詞へ移動" }),
            iconLinkMarkup({ href: track.links.streaming, icon: ICONS.album, label: "配信ページを開く" }),
            iconLinkMarkup({ href: track.links.youtube, icon: ICONS.youtube, label: "YouTubeで聴く" }),
            iconLinkMarkup({ href: track.links.x, icon: ICONS.x, label: "Xの投稿を開く" }),
            `<div class="music-player__fav-diary-stack${favored ? " is-reaction-visible" : ""}"
                data-player-fav-stack data-track-slug="${track.slug}">
                ${iconButtonMarkup({
                    action: `fav:${track.slug}`,
                    icon: ICONS.favBefore,
                    alternateIcon: ICONS.favAfter,
                    alternateActive: favored,
                    label: favored ? "favを解除する" : "favする",
                    favored,
                    extraClass: "music-action--fav"
                })}
                ${iconButtonMarkup({
                    action: `interpretation:${track.slug}`,
                    icon: ICONS.reaction,
                    label: "曲の解釈を書く",
                    extraClass: "music-action--reaction"
                })}
                ${iconButtonMarkup({
                    action: `diary:${track.slug}`,
                    icon: ICONS.diary,
                    label: diaryEntry ? "関連する日記を開く" : "関連する日記はありません",
                    disabled: !diaryEntry,
                    extraClass: "music-action--diary"
                })}
            </div>`
        ].join("");
    }

    function adjacentMarkup(index, direction) {
        const track = ORIGINAL_TRACKS[index];
        const icon = direction < 0 ? ICONS.skipPrev : ICONS.skipNext;
        return `
            <button type="button" data-player-adjacent-index="${index}"
                aria-label="${track.title}へ移動">
                <img class="music-player__adjacent-jacket" src="${resolveAsset(track.jacket)}" alt="">
                ${iconSpanMarkup(icon, "music-player__adjacent-icon")}
            </button>`;
    }

    function renderPlayerContent() {
        const track = activeTrack();
        const playableIndices = playerTrackIndices();
        const count = playableIndices.length;
        let previousIndex = adjacentPlayerIndex(state.activeTrackIndex, -1);
        let nextIndex = adjacentPlayerIndex(state.activeTrackIndex, 1);
        if (state.shuffle && count > 1) {
            const queuedNext = state.shuffleQueue[0];
            const historyPrevious = state.history[state.history.length - 1];
            if (Number.isInteger(queuedNext) && isTrackPlayerAvailable(ORIGINAL_TRACKS[queuedNext])) nextIndex = queuedNext;
            if (Number.isInteger(historyPrevious) && isTrackPlayerAvailable(ORIGINAL_TRACKS[historyPrevious])) previousIndex = historyPrevious;
        }
        const variant = currentVariantFor(track);

        refs.playerTitle.textContent = track.playerTitle || track.title;
        refs.playerInstrumental.hidden = variant !== "instrumental";
        refs.playerVariant.hidden = !track.instrumental;
        refs.playerVariant.textContent = variant === "instrumental" ? "⇔ vocal" : "⇔ instrumental";
        refs.playerVariant.setAttribute(
            "aria-label",
            variant === "instrumental" ? "ボーカル音源へ切り替える" : "インスト音源へ切り替える"
        );
        refs.playerCredits.innerHTML = creditsMarkup(track);
        refs.playerLyrics.textContent = track.lyrics || track.flavor.body;
        refs.playerLyrics.classList.remove("is-flavor");
        refs.railLeft.innerHTML = leftRailMarkup();
        refs.railRight.innerHTML = rightRailMarkup(track);
        refs.adjacentPrev.innerHTML = Number.isInteger(previousIndex) ? adjacentMarkup(previousIndex, -1) : "";
        refs.adjacentNext.innerHTML = Number.isInteger(nextIndex) ? adjacentMarkup(nextIndex, 1) : "";
        syncPlayerControls();
    }

    function setMusicActionDisabled(action, disabled) {
        const button = refs.player?.querySelector(`[data-music-action="${action}"]`);
        if (!button) return;
        button.disabled = Boolean(disabled);
        button.classList.toggle("is-disabled", Boolean(disabled));
        button.setAttribute("aria-disabled", String(Boolean(disabled)));
    }

    function syncPlayerControls() {
        if (!refs.progressIcon) return;
        const intendedPlaying = playbackShouldContinue();
        refs.progressIcon.classList.toggle("is-alt-icon", intendedPlaying);
        refs.progressButton.classList.toggle("is-selected", intendedPlaying);
        refs.progressButton.setAttribute("aria-pressed", String(intendedPlaying));
        refs.progressButton.setAttribute("aria-label", intendedPlaying ? "一時停止" : "再生");

        const repeat = refs.railLeft?.querySelector('[data-music-action="repeat"]');
        if (repeat) {
            repeat.classList.toggle("is-alt-icon", state.repeatMode === "one");
            repeat.classList.toggle("is-selected", state.repeatMode !== "off");
            repeat.setAttribute("aria-pressed", String(state.repeatMode !== "off"));
            repeat.setAttribute("aria-label",
                state.repeatMode === "off" ? "全曲リピートへ切り替える"
                    : state.repeatMode === "all" ? "一曲リピートへ切り替える"
                        : "リピートを解除する"
            );
        }

        const shuffle = refs.railLeft?.querySelector('[data-music-action="shuffle"]');
        if (shuffle) {
            shuffle.classList.toggle("is-selected", state.shuffle);
            shuffle.setAttribute("aria-pressed", String(state.shuffle));
            shuffle.setAttribute("aria-label", state.shuffle ? "シャッフルを解除する" : "シャッフルする");
        }

        const audioReady = Boolean(audio.currentSrc)
            && audio.readyState >= HTMLMediaElement.HAVE_METADATA
            && Number.isFinite(audio.duration)
            && audio.duration > 0;
        setMusicActionDisabled("replay5", !audioReady);
        setMusicActionDisabled("forward5", !audioReady);
        const playableTrackCount = playerTrackIndices().length;
        setMusicActionDisabled("skipPrev", state.transitioning || playableTrackCount < 2);
        setMusicActionDisabled("skipNext", state.transitioning || playableTrackCount < 2);
        setMusicActionDisabled("lyrics", !activeTrack()?.lyrics);
        const audioControlAvailable = Boolean(activeTrack()) && state.originalMode === "player";
        refs.progressButton.disabled = !audioControlAvailable;
        refs.progressButton.setAttribute("aria-disabled", String(!audioControlAvailable));

        [refs.adjacentPrev, refs.adjacentNext].forEach((container) => {
            const button = container?.querySelector("button");
            if (!button) return;
            button.disabled = state.transitioning;
            button.setAttribute("aria-disabled", String(state.transitioning));
        });

        syncPlayerLoading();
        syncPlayerProgress();
    }

    function flashMomentaryAction(button) {
        if (!button || button.disabled || button.getAttribute("aria-disabled") === "true") return;
        button.classList.remove("is-pressed");
        void button.offsetWidth;
        button.classList.add("is-pressed");
        window.setTimeout(() => button.classList.remove("is-pressed"), 140);
    }

    function lockStateAction(button) {
        if (!button || button.dataset.actionLocked === "true") return false;
        button.dataset.actionLocked = "true";
        window.setTimeout(() => { delete button.dataset.actionLocked; }, 180);
        return true;
    }

    async function scrollTabsBelowHeader() {
        const headerHeight = refs.header?.getBoundingClientRect().height || 0;
        const tabsRect = refs.tabs.getBoundingClientRect();
        const target = Math.max(0, window.scrollY + tabsRect.top - headerHeight - 1);
        window.scrollTo({ top: target, behavior: prefersReducedMotion() ? "auto" : "smooth" });
        if (!prefersReducedMotion()) await wait(340);
        else await nextPaint();
    }

    async function expandPlayer({ autoplay = true, animate = true, updateUrl = true } = {}) {
        if (state.transitioning || state.originalMode === "player" || !isTrackPlayerAvailable(activeTrack())) return;
        state.transitioning = true;
        state.listScrollY = window.scrollY;
        closeInterpretation();
        closeDiaryWindow();

        const index = state.activeTrackIndex;
        const shell = trackShell(index);
        if (!shell) {
            state.transitioning = false;
            return;
        }

        /* 選択時に見えていた位置を先に固定し、スクロール後の座標へ飛ばさない。 */
        const fromRect = shell.getBoundingClientRect();
        ensureTrackPlaceholder(index);
        setShellFlightRect(shell, fromRect);
        document.body.append(shell);

        if (animate) await scrollTabsBelowHeader();

        shell.classList.add("is-player-disc");
        shell.style.setProperty("--disc-rotation", "0deg");

        refs.player.hidden = false;
        refs.player.classList.add("is-preparing");
        renderPlayerContent();
        state.originalMode = "player";
        refs.page.dataset.originalMode = "player";
        refs.listView.hidden = true;
        await nextPaint();

        /*
         * 音源metadataを待つ前にcanvasを実表示サイズで初期化して透明クリアする。
         * モバイル回線でAudioContext/metadata準備が遅い時も未初期化canvasを見せない。
         */
        state.visualizerMetrics = null;
        drawVisualizer(performance.now(), true);

        const toRect = refs.discHost.getBoundingClientRect();
        refs.player.classList.remove("is-preparing");
        syncPlayerLoading();

        // ユーザー操作直後に音源準備／再生要求を開始し、視覚演出の完了を待たせない。
        const audioPromise = autoplay
            ? playAudio()
            : loadAudioForTrack(activeTrack(), {
                reset: state.audioTrackSlug !== activeTrack().slug
            });

        if (animate) await animateShellFlight(shell, fromRect, toRect, { toPlayer: true });
        refs.discHost.append(shell);
        clearShellFlightStyles(shell);
        shell.style.setProperty("--disc-rotation", `${state.discRotation}deg`);
        await audioPromise.catch(() => undefined);

        syncPlayerControls();
        if (updateUrl) writeUrl({ mode: "replace" });
        state.transitioning = false;
        syncPlayerLoading();
    }

    async function collapsePlayer({ animate = true, updateUrl = true } = {}) {
        if (state.transitioning || state.originalMode !== "player") return;
        state.transitioning = true;
        pauseAudio();
        stopPlayerFrame();
        closeInterpretation();
        closeDiaryWindow();

        const index = state.activeTrackIndex;
        const shell = refs.discHost.querySelector(".music-jacket-shell");
        const card = trackCard(index);
        const button = card?.querySelector(".music-track-card__button");
        const placeholder = trackPlaceholder(index);
        if (!shell || !button || !placeholder) {
            state.transitioning = false;
            return;
        }

        const fromRect = shell.getBoundingClientRect();
        setShellFlightRect(shell, fromRect);
        document.body.append(shell);

        refs.listView.hidden = false;
        refs.player.hidden = true;
        state.originalMode = "list";
        refs.page.dataset.originalMode = "list";
        window.scrollTo({ top: state.listScrollY, behavior: "auto" });
        await nextPaint();

        const toRect = placeholder.getBoundingClientRect();
        if (animate) await animateShellFlight(shell, fromRect, toRect, { toPlayer: false });

        shell.classList.remove("is-player-disc");
        shell.style.setProperty("--disc-rotation", "0deg");
        button.insertBefore(shell, placeholder);
        clearShellFlightStyles(shell);
        placeholder.remove();

        syncListActiveUi();
        void renderSummary(activeTrack(), { immediate: true });
        if (updateUrl) writeUrl({ mode: "replace" });
        state.transitioning = false;
    }

    async function restoreShellToCard(index) {
        const shell = refs.discHost.querySelector(".music-jacket-shell");
        const button = trackCard(index)?.querySelector(".music-track-card__button");
        if (!shell || !button) return;
        shell.classList.remove("is-player-disc");
        shell.style.setProperty("--disc-rotation", "0deg");
        const placeholder = trackPlaceholder(index);
        button.insertBefore(shell, placeholder || null);
        placeholder?.remove();
    }

    async function moveNextShellIntoPlayer(index, direction) {
        const shell = trackShell(index);
        if (!shell) return;
        ensureTrackPlaceholder(index);
        shell.classList.add("is-player-disc");
        shell.style.setProperty("--disc-rotation", `${state.discRotation}deg`);
        refs.discHost.append(shell);
        if (prefersReducedMotion() || typeof shell.animate !== "function") return;
        const distance = direction >= 0 ? "20cqw" : "-20cqw";
        const animation = shell.animate([
            { opacity: 0, transform: `translateX(${distance}) scale(.92)` },
            { opacity: 1, transform: "translateX(0) scale(1)" }
        ], {
            duration: DISC_SWITCH_MS,
            easing: "cubic-bezier(.2,.72,.2,1)"
        });
        await animation.finished.catch(() => undefined);
    }

    async function switchPlayerTrack(index, {
        direction = 1,
        useHistory = true,
        resumePlayback = null
    } = {}) {
        if (state.transitioning || index === state.activeTrackIndex || !isTrackPlayerAvailable(ORIGINAL_TRACKS[index])) return;
        const shouldResume = typeof resumePlayback === "boolean"
            ? resumePlayback
            : playbackShouldContinue();

        state.transitioning = true;
        syncPlayerLoading();
        closeInterpretation();
        closeDiaryWindow();
        const previousIndex = state.activeTrackIndex;
        const oldShell = refs.discHost.querySelector(".music-jacket-shell");
        pauseAudio();

        if (useHistory) state.history.push(previousIndex);

        /*
         * 次曲の音源準備を視覚演出より先に開始する。
         * shouldResume時はplay()も先に呼び、iOS Safariで操作権が切れた後に
         * 再生要求を出す構造を避ける。ローダーは切替完了まで表示する。
         */
        state.activeTrackIndex = index;
        state.discRotation = 0;
        syncListActiveUi();
        renderPlayerContent();
        beginAudioLoadForTrack(activeTrack(), { reset: true });
        const playbackPromise = shouldResume ? playAudio() : loadAudioForTrack(activeTrack(), { reset: true });

        if (oldShell && !prefersReducedMotion() && typeof oldShell.animate === "function") {
            const distance = direction >= 0 ? "-20cqw" : "20cqw";
            await oldShell.animate([
                { opacity: 1, transform: "translateX(0) scale(1)" },
                { opacity: 0, transform: `translateX(${distance}) scale(.92)` }
            ], {
                duration: DISC_SWITCH_MS,
                easing: "cubic-bezier(.2,.72,.2,1)"
            }).finished.catch(() => undefined);
        }

        await restoreShellToCard(previousIndex);
        await moveNextShellIntoPlayer(index, direction);
        await playbackPromise.catch(() => undefined);
        state.transitioning = false;
        syncPlayerLoading();
        syncPlayerControls();
    }

    async function toggleInstrumental() {
        const track = activeTrack();
        if (!track.instrumental || state.transitioning) return;
        state.transitioning = true;
        syncPlayerLoading();
        const wasPlaying = playbackShouldContinue();
        const ratio = progressRatio();
        pauseAudio();
        const nextVariant = currentVariantFor(track) === "instrumental" ? "vocal" : "instrumental";
        state.variantBySlug.set(track.slug, nextVariant);
        renderPlayerContent();
        beginAudioLoadForTrack(track, { reset: false, preserveRatio: ratio });
        const playbackPromise = wasPlaying
            ? playAudio()
            : loadAudioForTrack(track, { reset: false, preserveRatio: ratio });
        await playbackPromise.catch(() => undefined);
        state.transitioning = false;
        syncPlayerLoading();
        syncPlayerControls();
    }

    /* =========================================================
       Repeat / shuffle / skip
       ========================================================= */

    function resetShuffleQueue() {
        const indices = playerTrackIndices()
            .filter((index) => index !== state.activeTrackIndex);
        for (let index = indices.length - 1; index > 0; index -= 1) {
            const target = Math.floor(Math.random() * (index + 1));
            [indices[index], indices[target]] = [indices[target], indices[index]];
        }
        state.shuffleQueue = indices;
    }

    function nextShuffleIndex() {
        if (!state.shuffleQueue.length) resetShuffleQueue();
        const next = state.shuffleQueue.shift();
        return Number.isInteger(next)
            ? next
            : adjacentPlayerIndex(state.activeTrackIndex, 1);
    }

    async function skipNext({
        applyShuffle = true,
        useHistory = true,
        resumePlayback = null
    } = {}) {
        const next = state.shuffle && applyShuffle
            ? nextShuffleIndex()
            : adjacentPlayerIndex(state.activeTrackIndex, 1);
        if (!Number.isInteger(next)) return;
        await switchPlayerTrack(next, { direction: 1, useHistory, resumePlayback });
    }

    async function skipPrevious({
        applyShuffle = true,
        resumePlayback = null
    } = {}) {
        if (state.shuffle && applyShuffle) {
            const previous = state.history.pop();
            const target = Number.isInteger(previous) && isTrackPlayerAvailable(ORIGINAL_TRACKS[previous])
                ? previous
                : nextShuffleIndex();
            if (!Number.isInteger(target)) return;
            await switchPlayerTrack(target, {
                direction: -1,
                useHistory: false,
                resumePlayback
            });
            return;
        }
        const previous = adjacentPlayerIndex(state.activeTrackIndex, -1);
        if (!Number.isInteger(previous)) return;
        await switchPlayerTrack(previous, { direction: -1, useHistory: true, resumePlayback });
    }

    function cycleRepeatMode() {
        state.repeatMode = state.repeatMode === "off"
            ? "all"
            : state.repeatMode === "all"
                ? "one"
                : "off";
        syncPlayerControls();
    }

    function toggleShuffle() {
        state.shuffle = !state.shuffle;
        if (state.shuffle) resetShuffleQueue();
        else state.shuffleQueue = [];
        if (state.originalMode === "player") renderPlayerContent();
        else syncPlayerControls();
    }

    function moveAudioBy(seconds) {
        if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
        const maximum = seconds > 0 ? Math.max(0, audio.duration - 5) : audio.duration;
        audio.currentTime = clamp(audio.currentTime + seconds, 0, maximum);
        syncPlayerProgress();
    }

    async function handleAudioEnded() {
        state.audioActuallyPlaying = false;

        if (state.repeatMode === "one") {
            audio.currentTime = 0;
            await playAudio();
            return;
        }

        if (state.shuffle) {
            // Repeat OFFでは、現在のシャッフル巡回を使い切ったところで停止する。
            if (state.repeatMode === "off" && !state.shuffleQueue.length) {
                audio.currentTime = 0;
                pauseAudio();
                return;
            }
            await skipNext({ applyShuffle: true, useHistory: true, resumePlayback: true });
            return;
        }

        const playableIndices = playerTrackIndices();
        const currentPosition = playableIndices.indexOf(state.activeTrackIndex);
        const isLastTrack = currentPosition < 0 || currentPosition === playableIndices.length - 1;
        if (state.repeatMode === "off" && isLastTrack) {
            audio.currentTime = 0;
            pauseAudio();
            return;
        }

        const nextIndex = isLastTrack ? playableIndices[0] : playableIndices[currentPosition + 1];
        if (!Number.isInteger(nextIndex)) {
            pauseAudio();
            return;
        }
        await switchPlayerTrack(nextIndex, {
            direction: 1,
            useHistory: true,
            resumePlayback: true
        });
    }

    /* =========================================================
       Circular seek gesture
       ========================================================= */

    function pointerAngle(event) {
        const rect = refs.discStage.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        let angle = Math.atan2(event.clientY - centerY, event.clientX - centerX) + Math.PI / 2;
        if (angle < 0) angle += Math.PI * 2;
        return angle;
    }

    function applySeekRatio(ratio) {
        const normalized = clamp(ratio, 0, 1);
        state.pendingSeekRatio = normalized;
        if (!Number.isFinite(audio.duration) || audio.duration <= 0) return false;

        const maximum = Math.max(0, audio.duration - 5);
        audio.currentTime = normalized >= 0.995
            ? maximum
            : clamp(normalized * audio.duration, 0, audio.duration);
        state.pendingSeekRatio = null;
        syncPlayerProgress();
        return true;
    }

    async function prepareAudioForSeek() {
        const track = activeTrack();
        if (state.audioTrackSlug !== track.slug || state.audioVariant !== currentVariantFor(track)) {
            await loadAudioForTrack(track, { reset: false });
        } else if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
            await waitForMetadata();
        }
        if (Number.isFinite(state.pendingSeekRatio)) applySeekRatio(state.pendingSeekRatio);
    }

    function bindDiscGesture() {
        let gesture = null;

        refs.discStage.addEventListener("pointerdown", (event) => {
            if (state.transitioning || event.button > 0) return;
            const shell = refs.discHost.querySelector(".music-jacket-shell");
            if (!shell) return;
            gesture = {
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                lastAngle: pointerAngle(event),
                accumulatedAngle: 0,
                startRotation: state.discRotation,
                mode: null,
                wasPlaying: !audio.paused
            };
        });

        refs.discStage.addEventListener("pointermove", (event) => {
            if (!gesture || event.pointerId !== gesture.pointerId) return;
            const dx = event.clientX - gesture.startX;
            const dy = event.clientY - gesture.startY;
            const distance = Math.hypot(dx, dy);

            if (!gesture.mode && distance >= SEEK_DRAG_THRESHOLD) {
                if (gesture.wasPlaying && Math.abs(dy) > Math.abs(dx) * 1.6) {
                    gesture.mode = "scroll";
                    return;
                }
                gesture.mode = "seek";
                state.seeking = true;
                pauseAudio();
                void prepareAudioForSeek();
                try {
                    refs.discStage.setPointerCapture(event.pointerId);
                } catch (_) {
                    /* pointer capture非対応時も要素内のmoveで継続する。 */
                }
            }

            if (gesture.mode !== "seek") return;
            event.preventDefault();
            const angle = pointerAngle(event);
            let delta = angle - gesture.lastAngle;
            if (delta > Math.PI) delta -= Math.PI * 2;
            if (delta < -Math.PI) delta += Math.PI * 2;
            gesture.accumulatedAngle += delta;
            gesture.lastAngle = angle;
            state.discRotation = gesture.startRotation + gesture.accumulatedAngle * 180 / Math.PI;

            const ratio = angle / (Math.PI * 2);
            applySeekRatio(ratio);
            syncPlayerProgress();
        }, { passive: false });

        const finish = async (event) => {
            if (!gesture || event.pointerId !== gesture.pointerId) return;
            const completed = gesture;
            gesture = null;

            if (refs.discStage.hasPointerCapture?.(event.pointerId)) {
                try {
                    refs.discStage.releasePointerCapture(event.pointerId);
                } catch (_) {
                    /* 既に解除済みなら何もしない。 */
                }
            }

            if (completed.mode === "seek") {
                state.seeking = false;
                if (completed.wasPlaying) await playAudio();
                return;
            }

            if (!completed.mode) await toggleAudio();
        };

        refs.discStage.addEventListener("pointerup", (event) => void finish(event));
        refs.discStage.addEventListener("pointercancel", (event) => void finish(event));
        refs.progressButton.addEventListener("click", (event) => event.preventDefault());
    }

    /* =========================================================
       Fav state
       ========================================================= */

    async function hydrateFavStates() {
        const results = await Promise.allSettled(ALL_MUSIC_ITEMS.map(async (item) => {
            const revision = musicFavRevision(item.slug);
            if (revision > 0) return;
            const result = await backend.getFavState(item);
            if (musicFavRevision(item.slug) !== revision || revision > 0) return;
            state.favBySlug.set(item.slug, {
                favored: Boolean(result.favored),
                favCount: Number.isFinite(result.favCount) ? result.favCount : 0
            });
        }));
        if (results.some((result) => result.status === "rejected")) {
            console.warn("一部のMusic fav状態を取得できませんでした。");
        }
        syncFavUi();
    }

    function scheduleFavHydration() {
        const run = () => void hydrateFavStates();
        if ("requestIdleCallback" in window) {
            window.requestIdleCallback(run, { timeout: 1600 });
        } else {
            window.setTimeout(run, 600);
        }
    }

    function syncPlayerFavUi(track) {
        const stack = refs.railRight?.querySelector("[data-player-fav-stack]");
        if (!stack || stack.dataset.trackSlug !== track.slug) {
            refs.railRight.innerHTML = rightRailMarkup(track);
            return;
        }

        const favored = favRecord(track).favored;
        const favButton = stack.querySelector(`[data-music-action="fav:${track.slug}"]`);
        if (favButton) {
            const pending = state.pendingFavSlugs.has(track.slug);
            favButton.classList.toggle("is-favored", favored);
            favButton.classList.toggle("is-alt-icon", favored);
            favButton.classList.toggle("is-pending", pending);
            favButton.disabled = pending;
            favButton.setAttribute("aria-busy", String(pending));
            favButton.setAttribute("aria-pressed", String(favored));
            favButton.setAttribute("aria-label", favored ? "favを解除する" : "favする");
        }

        requestAnimationFrame(() => {
            stack.classList.toggle("is-reaction-visible", favored);
        });
    }

    function syncSummaryFavUi(track) {
        if (!track || !refs.summaryInner) return;
        const favButton = refs.summaryInner.querySelector(`[data-music-action="fav:${track.slug}"]`);
        if (!favButton) return;

        const favored = favRecord(track).favored;
        const pending = state.pendingFavSlugs.has(track.slug);
        favButton.classList.toggle("is-favored", favored);
        favButton.classList.toggle("is-alt-icon", favored);
        favButton.classList.toggle("is-pending", pending);
        favButton.disabled = pending;
        favButton.setAttribute("aria-busy", String(pending));
        favButton.setAttribute("aria-pressed", String(favored));
        favButton.setAttribute("aria-label", favored ? "favを解除する" : "favする");

        const area = favButton.closest(".music-summary__fav-area");
        requestAnimationFrame(() => {
            area?.classList.toggle("is-reaction-visible", favored);
        });
    }

    function syncFavUi() {
        if (state.view === "original" && state.originalMode === "list") {
            syncSummaryFavUi(activeTrack());
        }
        if (state.originalMode === "player") {
            syncPlayerFavUi(activeTrack());
        }
        refs.coverList.querySelectorAll("[data-cover-fav]").forEach((button) => {
            const item = coverTrackBySlug(button.dataset.coverFav);
            if (!item) return;
            const favored = favRecord(item).favored;
            const pending = state.pendingFavSlugs.has(item.slug);
            button.classList.toggle("is-favored", favored);
            button.classList.toggle("is-alt-icon", favored);
            button.classList.toggle("is-pending", pending);
            button.disabled = pending;
            button.setAttribute("aria-busy", String(pending));
            button.setAttribute("aria-pressed", String(favored));
            button.setAttribute("aria-label", favored ? "favを解除する" : "favする");
        });
    }

    function refreshFavPresentation(item) {
        if (coverTrackBySlug(item.slug) && state.coverSort === "popular") {
            if (state.activeCoverVideoSlug) {
                state.pendingCoverSortRefresh = true;
                syncFavUi();
            } else {
                renderCoverList();
            }
            return;
        }
        syncFavUi();
    }

    function retryMusicFavInBackground(item, desiredFavored, previous, revision, cycle = 0) {
        const delay = cycle === 0 ? 4000 : 12000;
        window.setTimeout(async () => {
            if (musicFavRevision(item.slug) !== revision) return;
            if (favRecord(item).favored !== desiredFavored) return;

            try {
                const result = await backend.toggleFav(item, desiredFavored);
                if (musicFavRevision(item.slug) !== revision) return;
                const confirmedFavored = typeof result?.favored === "boolean"
                    ? result.favored
                    : desiredFavored;
                const current = favRecord(item);
                state.favBySlug.set(item.slug, {
                    favored: confirmedFavored,
                    favCount: Number.isFinite(result?.favCount) ? result.favCount : current.favCount
                });
                writeMusicFavCache(item.slug, confirmedFavored);
                refreshFavPresentation(item);
            } catch (error) {
                if (musicFavRevision(item.slug) !== revision) return;
                if (isRecoverableMusicFavError(error) && cycle < 1) {
                    retryMusicFavInBackground(item, desiredFavored, previous, revision, cycle + 1);
                    return;
                }
                if (!isRecoverableMusicFavError(error)) {
                    state.favBySlug.set(item.slug, previous);
                    writeMusicFavCache(item.slug, previous.favored);
                    refreshFavPresentation(item);
                }
            }
        }, delay);
    }

    async function toggleFav(slug, button = null) {
        const item = itemBySlug(slug);
        if (!item || state.pendingFavSlugs.has(slug)) return;

        const revision = musicBumpFavRevision(slug);
        state.pendingFavSlugs.add(slug);

        const previous = { ...favRecord(item) };
        const optimisticFavored = !previous.favored;
        const optimisticCount = Math.max(
            0,
            previous.favCount + (optimisticFavored ? 1 : -1)
        );

        state.favBySlug.set(item.slug, {
            favored: optimisticFavored,
            favCount: optimisticCount
        });
        writeMusicFavCache(item.slug, optimisticFavored);
        refreshFavPresentation(item);

        const currentButton = document.querySelector(
            `[data-music-action="fav:${item.slug}"]`
        ) || document.querySelector(`[data-cover-fav="${item.slug}"]`) || button;
        if (currentButton) {
            currentButton.disabled = true;
            currentButton.classList.add("is-pending");
            currentButton.setAttribute("aria-busy", "true");
        }

        try {
            const result = await requestMusicFavWithRetry(item, optimisticFavored, revision);
            if (!result || musicFavRevision(item.slug) !== revision) return;

            const confirmedFavored = typeof result.favored === "boolean"
                ? result.favored
                : optimisticFavored;
            state.favBySlug.set(item.slug, {
                favored: confirmedFavored,
                favCount: Number.isFinite(result.favCount)
                    ? result.favCount
                    : optimisticCount
            });
            writeMusicFavCache(item.slug, confirmedFavored);

            if (!confirmedFavored && state.interpretationTrackSlug === item.slug) {
                closeInterpretation();
            }
            refreshFavPresentation(item);
        } catch (error) {
            if (musicFavRevision(item.slug) !== revision) return;
            console.error("Music favの切替に失敗しました。", error);

            if (isRecoverableMusicFavError(error)) {
                retryMusicFavInBackground(item, optimisticFavored, previous, revision);
            } else {
                state.favBySlug.set(item.slug, previous);
                writeMusicFavCache(item.slug, previous.favored);
                refreshFavPresentation(item);
            }
        } finally {
            if (musicFavRevision(item.slug) === revision) {
                state.pendingFavSlugs.delete(slug);
                refreshFavPresentation(item);
            }
        }
    }

    /* =========================================================
       Draggable interpretation window
       ========================================================= */

    function openInterpretation(slug) {
        const track = originalTrackBySlug(slug);
        if (!track || !favRecord(track).favored) return;
        closeDiaryWindow();
        state.interpretationTrackSlug = slug;
        refs.interpretation.hidden = false;
        refs.interpretation.setAttribute("aria-hidden", "false");
        const draft = state.interpretationDraftBySlug.get(slug) || "";
        refs.interpretationBody.value = draft;
        refs.interpretationCount.textContent = String(draft.length);
        refs.interpretationMessage.textContent = "";
        requestAnimationFrame(() => {
            refs.interpretation.classList.add("is-visible");
            if (!state.interpretationPositioned) centerInterpretationPanel();
        });
    }

    function closeInterpretation() {
        if (refs.interpretation?.hidden) return;
        const slug = state.interpretationTrackSlug;
        if (slug) state.interpretationDraftBySlug.set(slug, refs.interpretationBody.value);
        refs.interpretation.classList.remove("is-visible");
        refs.interpretation.setAttribute("aria-hidden", "true");
        state.interpretationTrackSlug = null;
        window.setTimeout(() => {
            if (!refs.interpretation.classList.contains("is-visible")) refs.interpretation.hidden = true;
        }, prefersReducedMotion() ? 0 : 220);
    }

    function centerInterpretationPanel() {
        const viewport = window.visualViewport;
        const width = viewport?.width || window.innerWidth;
        const height = viewport?.height || window.innerHeight;
        const offsetLeft = viewport?.offsetLeft || 0;
        const offsetTop = viewport?.offsetTop || 0;
        const rect = refs.interpretationPanel.getBoundingClientRect();
        const left = offsetLeft + Math.max(8, (width - rect.width) / 2);
        const top = offsetTop + Math.max(8, (height - rect.height) / 2);
        refs.interpretationPanel.style.left = `${left}px`;
        refs.interpretationPanel.style.top = `${top}px`;
        refs.interpretationPanel.classList.add("is-positioned");
        state.interpretationPositioned = true;
    }

    function clampInterpretationPanel() {
        if (!state.interpretationPositioned || refs.interpretation?.hidden) return;
        const viewport = window.visualViewport;
        const width = viewport?.width || window.innerWidth;
        const height = viewport?.height || window.innerHeight;
        const offsetLeft = viewport?.offsetLeft || 0;
        const offsetTop = viewport?.offsetTop || 0;
        const focusedControl = refs.interpretationPanel.contains(document.activeElement)
            && document.activeElement?.matches?.("input, textarea, select, [contenteditable='true']");

        refs.interpretationPanel.classList.toggle("is-input-active", Boolean(focusedControl));

        if (focusedControl) {
            const gutter = 8;
            refs.interpretationPanel.style.maxHeight = `${Math.max(180, height - gutter * 2)}px`;
            const rect = refs.interpretationPanel.getBoundingClientRect();
            const minLeft = offsetLeft + gutter;
            const maxLeft = Math.max(minLeft, offsetLeft + width - rect.width - gutter);
            const minTop = offsetTop + gutter;
            const maxTop = Math.max(minTop, offsetTop + height - rect.height - gutter);
            refs.interpretationPanel.style.left = `${clamp(rect.left, minLeft, maxLeft)}px`;
            refs.interpretationPanel.style.top = `${clamp(rect.top, minTop, maxTop)}px`;
            return;
        }

        refs.interpretationPanel.style.removeProperty("max-height");
        const rect = refs.interpretationPanel.getBoundingClientRect();
        const minVisible = Math.min(44, rect.width);
        const minLeft = offsetLeft - rect.width + minVisible;
        const maxLeft = offsetLeft + width - minVisible;
        const minTop = offsetTop;
        const maxTop = offsetTop + height - minVisible;
        refs.interpretationPanel.style.left = `${clamp(rect.left, minLeft, maxLeft)}px`;
        refs.interpretationPanel.style.top = `${clamp(rect.top, minTop, maxTop)}px`;
    }

    function bindInterpretationDrag() {
        let drag = null;

        refs.interpretationPanel.addEventListener("pointerdown", (event) => {
            if (event.button > 0) return;
            const excluded = event.target.closest("input, textarea, select, [contenteditable='true']");
            if (excluded) return;
            const rect = refs.interpretationPanel.getBoundingClientRect();
            drag = {
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                startLeft: rect.left,
                startTop: rect.top,
                active: false
            };
        });

        refs.interpretationPanel.addEventListener("pointermove", (event) => {
            if (!drag || event.pointerId !== drag.pointerId) return;
            const dx = event.clientX - drag.startX;
            const dy = event.clientY - drag.startY;
            if (!drag.active && Math.hypot(dx, dy) >= COMMENT_DRAG_THRESHOLD) {
                drag.active = true;
                refs.interpretationPanel.classList.add("is-positioned", "is-dragging");
                state.interpretationPositioned = true;
                try {
                    refs.interpretationPanel.setPointerCapture(event.pointerId);
                } catch (_) {
                    /* pointer capture非対応時もpanel内で継続する。 */
                }
            }
            if (!drag.active) return;
            event.preventDefault();
            refs.interpretationPanel.style.left = `${drag.startLeft + dx}px`;
            refs.interpretationPanel.style.top = `${drag.startTop + dy}px`;
            clampInterpretationPanel();
        }, { passive: false });

        const finish = (event) => {
            if (!drag || event.pointerId !== drag.pointerId) return;
            const wasActive = drag.active;
            drag = null;
            refs.interpretationPanel.classList.remove("is-dragging");
            if (refs.interpretationPanel.hasPointerCapture?.(event.pointerId)) {
                try {
                    refs.interpretationPanel.releasePointerCapture(event.pointerId);
                } catch (_) {
                    /* 既に解除済みなら何もしない。 */
                }
            }
            if (wasActive) {
                state.suppressInterpretationClick = true;
                requestAnimationFrame(() => {
                    state.suppressInterpretationClick = false;
                });
            }
        };

        refs.interpretationPanel.addEventListener("pointerup", finish);
        refs.interpretationPanel.addEventListener("pointercancel", finish);
        refs.interpretationPanel.addEventListener("click", (event) => {
            if (!state.suppressInterpretationClick) return;
            event.preventDefault();
            event.stopImmediatePropagation();
        }, true);
    }

    async function submitInterpretation(event) {
        event.preventDefault();
        const track = originalTrackBySlug(state.interpretationTrackSlug);
        if (!track) return;
        const formData = new FormData(refs.interpretationForm);
        const displayName = normalizeText(formData.get("displayName")) || "名無しさん";
        const body = normalizeText(formData.get("body"));

        if (displayName.length > 20) {
            refs.interpretationMessage.textContent = "表示名は20文字以内で入力してください。";
            return;
        }
        if (!body || body.length > 80) {
            refs.interpretationMessage.textContent = "本文は1～80文字で入力してください。";
            return;
        }
        if (containsUrl(body)) {
            refs.interpretationMessage.textContent = "URLを含む内容は送信できません。";
            return;
        }

        const submit = refs.interpretationForm.querySelector('[type="submit"]');
        const originalBody = refs.interpretationBody.value;
        submit.disabled = true;
        refs.interpretationBody.value = "";
        refs.interpretationCount.textContent = "0";
        state.interpretationDraftBySlug.set(track.slug, "");
        refs.interpretationMessage.textContent = "送信しています…";

        try {
            await backend.submitInterpretation(track, { displayName, body });
            refs.interpretationMessage.textContent = MUSIC_BACKEND_CONFIG.mode === "local"
                ? "この端末に仮保存しました。"
                : "解釈を受け取りました。";
        } catch (error) {
            const messageByCode = {
                content_comment_rate_limited:
                    "同じ曲への連続投稿は、10分ほど時間を空けてください。",
                daily_comment_limit_reached:
                    "本日の投稿上限に達しました。",
                duplicate_comment:
                    "同じ内容は続けて送信できません。",
                comment_closed:
                    "現在、この曲への解釈投稿を停止しています。"
            };
            refs.interpretationBody.value = originalBody;
            refs.interpretationCount.textContent = String(originalBody.length);
            state.interpretationDraftBySlug.set(track.slug, originalBody);
            refs.interpretationMessage.textContent =
                messageByCode[error.code] || error.message || "保存に失敗しました。";
        } finally {
            submit.disabled = false;
        }
    }

    /* =========================================================
       Diary entry integration
       ========================================================= */

    function getDiaryEntry(track) {
        if (!track?.diaryEntry) return null;
        if (typeof window.DIARY_DATA?.getAvailableById === "function") {
            return window.DIARY_DATA.getAvailableById(track.diaryEntry);
        }
        return window.DIARY_DATA?.getById?.(track.diaryEntry) || null;
    }

    function openDiaryWindow(slug) {
        const track = originalTrackBySlug(slug);
        const entry = getDiaryEntry(track);
        if (!entry) return;
        closeInterpretation();
        state.diaryTrackSlug = slug;
        refs.diaryTitle.textContent = entry.title;
        refs.diaryDate.dateTime = entry.date;
        refs.diaryDate.textContent = formatDate(entry.date);
        refs.diaryBody.textContent = entry.body;
        refs.diaryMore.href = `diary.html?entry=${encodeURIComponent(entry.id)}`;
        const authorPath = entry.author === "urara"
            ? "images/diary/author-urara.svg"
            : entry.author === "wimina"
                ? "images/diary/author-wimina.svg"
                : "images/diary/author-unknown.svg";
        setMaskImage(refs.diaryAuthor, authorPath);
        refs.diaryAuthor.setAttribute(
            "aria-label",
            entry.author === "urara" ? "筆者：琴麗等"
                : entry.author === "wimina" ? "筆者：弓可可ヰミナ"
                    : "筆者不明"
        );
        refs.diaryWindow.hidden = false;
        refs.diaryWindow.setAttribute("aria-hidden", "false");
        requestAnimationFrame(() => refs.diaryWindow.classList.add("is-visible"));
    }

    function closeDiaryWindow() {
        if (!refs.diaryWindow || refs.diaryWindow.hidden) return;
        refs.diaryWindow.classList.remove("is-visible");
        refs.diaryWindow.setAttribute("aria-hidden", "true");
        state.diaryTrackSlug = null;
        window.setTimeout(() => {
            if (!refs.diaryWindow.classList.contains("is-visible")) refs.diaryWindow.hidden = true;
        }, prefersReducedMotion() ? 0 : 240);
    }

    /* =========================================================
       Cover cards
       ========================================================= */

    function coverPopularity(track) {
        return track.initialPopularity + favRecord(track).favCount;
    }

    function visibleCoverTracks() {
        const tracks = COVER_TRACKS.filter((track) =>
            state.coverFilter === "all" || track.singers.includes(state.coverFilter)
        );
        tracks.sort((left, right) => {
            if (state.coverSort === "popular") {
                const popularity = coverPopularity(right) - coverPopularity(left);
                if (popularity !== 0) return popularity;
            }
            return right.date.localeCompare(left.date) || left.slug.localeCompare(right.slug);
        });
        return tracks;
    }

    function coverTagsMarkup(track) {
        return track.singers.map((singerId) => {
            const singer = SINGERS[singerId];
            return `<span class="music-cover-card__tag music-cover-card__tag--${singerId}">${singer.label}</span>`;
        }).join("");
    }

    function coverMediaMarkup(track) {
        const id = youtubeId(track.youtube);
        if (state.activeCoverVideoSlug === track.slug && id) {
            return `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0"
                title="${track.title} / ${track.artist}" allow="autoplay; encrypted-media; picture-in-picture"
                allowfullscreen></iframe>`;
        }
        return `
            <button class="music-cover-card__thumbnail-button" type="button"
                data-cover-play="${track.slug}" aria-label="${track.title}を再生">
                <img class="music-cover-card__thumbnail" src="${resolveAsset(track.thumbnail)}"
                    alt="${track.title} サムネイル" loading="lazy" decoding="async">
                ${iconSpanMarkup(ICONS.play, "music-cover-card__play")}
            </button>`;
    }

    function coverCardMarkup(track) {
        const favored = favRecord(track).favored;
        return `
            <article class="music-cover-card" data-cover-card="${track.slug}">
                <div class="music-cover-card__media" data-cover-media="${track.slug}">
                    ${coverMediaMarkup(track)}
                </div>
                <div class="music-cover-card__info-row">
                    <div class="music-cover-card__tags">${coverTagsMarkup(track)}</div>
                    <time class="music-cover-card__date" datetime="${track.date}">${formatDate(track.date)}</time>
                </div>
                <div class="music-cover-card__lower">
                    <h2 class="music-cover-card__title">${track.title} / ${track.artist}</h2>
                    <button class="music-action music-cover-card__fav${favored ? " is-favored is-alt-icon" : ""}"
                        type="button" data-cover-fav="${track.slug}" aria-pressed="${favored}"
                        aria-label="${favored ? "favを解除する" : "favする"}">
                        ${dualIconSpanMarkup(ICONS.favBefore, ICONS.favAfter)}
                    </button>
                </div>
            </article>`;
    }

    function syncCoverToolbar() {
        refs.coverSort.dataset.sort = state.coverSort;
        refs.coverSortLabel.textContent = state.coverSort === "newest" ? "新しい順" : "人気順";
        refs.coverSort.setAttribute(
            "aria-label",
            state.coverSort === "newest" ? "人気順へ切り替える" : "新しい順へ切り替える"
        );
        refs.cover.querySelectorAll("[data-cover-filter]").forEach((button) => {
            const active = button.dataset.coverFilter === state.coverFilter;
            button.classList.toggle("is-active", active);
            button.setAttribute("aria-pressed", String(active));
        });
    }

    function renderCoverList() {
        const tracks = visibleCoverTracks();
        refs.coverList.innerHTML = tracks.map(coverCardMarkup).join("");
        refs.coverEmpty.hidden = tracks.length > 0;
        syncCoverToolbar();
    }

    function stopCoverVideo({ rerender = true } = {}) {
        if (!state.activeCoverVideoSlug) return;
        state.activeCoverVideoSlug = null;
        if (rerender) renderCoverList();
        if (state.pendingCoverSortRefresh) {
            state.pendingCoverSortRefresh = false;
            renderCoverList();
        }
    }

    function playCoverVideo(slug) {
        const track = coverTrackBySlug(slug);
        if (!track || !youtubeId(track.youtube)) return;
        pauseAudio();
        state.activeCoverVideoSlug = slug;
        renderCoverList();
        requestAnimationFrame(() => {
            refs.coverList.querySelector(`[data-cover-card="${slug}"]`)
                ?.scrollIntoView({ block: "nearest", behavior: "auto" });
        });
    }

    /* =========================================================
       URL and primary tab state
       ========================================================= */

    function parseUrl() {
        const url = new URL(window.location.href);
        const view = url.searchParams.get("view") === "cover" ? "cover" : "original";
        const track = originalTrackBySlug(url.searchParams.get("track"));
        return { view, track };
    }

    function writeUrl({ mode = "replace" } = {}) {
        if (state.restoringUrl) return;
        const url = new URL(window.location.href);
        if (state.view === "cover") {
            url.searchParams.set("view", "cover");
            url.searchParams.delete("track");
        } else {
            url.searchParams.delete("view");
            if (state.originalMode === "player") url.searchParams.set("track", activeTrack().slug);
            else url.searchParams.delete("track");
        }
        const historyState = {
            ...(history.state || {}),
            musicView: state.view,
            musicTrack: state.originalMode === "player" ? activeTrack().slug : null
        };
        if (mode === "push") history.pushState(historyState, "", url);
        else history.replaceState(historyState, "", url);
    }

    function syncTabUi() {
        refs.tabs.querySelectorAll("[data-music-tab]").forEach((button) => {
            const active = button.dataset.musicTab === state.view;
            button.classList.toggle("is-active", active);
            button.setAttribute("aria-selected", String(active));
        });
        refs.original.hidden = state.view !== "original";
        refs.cover.hidden = state.view !== "cover";
        refs.page.dataset.musicView = state.view;
    }

    async function setView(view, { historyMode = "push" } = {}) {
        if (view === state.view) {
            if (view === "original" && state.originalMode === "player") {
                await collapsePlayer({ updateUrl: true });
            }
            return;
        }

        if (view === "cover") {
            pauseAudio();
            closeInterpretation();
            closeDiaryWindow();
        } else {
            stopCoverVideo({ rerender: false });
            renderCoverList();
        }

        state.view = view;
        syncTabUi();
        if (view === "original" && state.originalMode === "player") {
            refs.listView.hidden = true;
            refs.player.hidden = false;
            startPlayerFrame();
            syncPlayerControls();
        } else if (view === "original") {
            refs.listView.hidden = false;
            refs.player.hidden = true;
            stopPlayerFrame();
        }
        writeUrl({ mode: historyMode });
    }

    async function restoreFromUrl() {
        const urlState = parseUrl();
        state.restoringUrl = true;
        if (urlState.track) {
            const index = ORIGINAL_TRACKS.findIndex((track) => track.slug === urlState.track.slug);
            if (index >= 0) {
                state.activeTrackIndex = index;
                syncListActiveUi();
                await renderSummary(activeTrack(), { immediate: true });
            }
        }

        if (state.view !== urlState.view) {
            if (urlState.view === "cover") pauseAudio();
            else stopCoverVideo({ rerender: false });
            state.view = urlState.view;
            syncTabUi();
        }

        const urlTrackIsAvailable = Boolean(
            urlState.track
            && originalTrackBySlug(urlState.track.slug)
            && isTrackPlayerAvailable(urlState.track)
        );
        if (urlState.view === "original" && urlTrackIsAvailable && state.originalMode !== "player") {
            state.restoringUrl = false;
            await expandPlayer({ autoplay: false, animate: false, updateUrl: false });
            state.restoringUrl = true;
        } else if ((!urlState.track || urlState.view === "cover") && state.originalMode === "player") {
            state.restoringUrl = false;
            await collapsePlayer({ animate: false, updateUrl: false });
            state.restoringUrl = true;
        }

        syncTabUi();
        state.restoringUrl = false;
    }

    /* =========================================================
       Event delegation
       ========================================================= */

    async function handleMusicAction(action, button) {
        if (!button || button.disabled || button.getAttribute("aria-disabled") === "true") return;
        const [name, value] = action.split(":");

        if (name === "fav") {
            await toggleFav(value, button);
            return;
        }
        if (name === "interpretation") {
            flashMomentaryAction(button);
            openInterpretation(value);
            return;
        }
        if (name === "diary") {
            flashMomentaryAction(button);
            openDiaryWindow(value);
            return;
        }

        if (name === "repeat") {
            if (!lockStateAction(button)) return;
            cycleRepeatMode();
            return;
        }
        if (name === "shuffle") {
            if (!lockStateAction(button)) return;
            toggleShuffle();
            return;
        }

        flashMomentaryAction(button);
        if (name === "replay5") moveAudioBy(-5);
        if (name === "forward5") moveAudioBy(5);
        if (name === "skipPrev") await skipPrevious({ applyShuffle: true });
        if (name === "skipNext") await skipNext({ applyShuffle: true });
        if (name === "lyrics") {
            refs.playerLyricsSection.scrollIntoView({
                behavior: prefersReducedMotion() ? "auto" : "smooth",
                block: "start"
            });
        }
    }

    function bindEvents() {
        refs.tabs.addEventListener("click", (event) => {
            const button = event.target.closest("[data-music-tab]");
            if (!button) return;
            void setView(button.dataset.musicTab);
        });

        refs.trackList.addEventListener("click", (event) => {
            const button = event.target.closest("[data-track-select]");
            if (!button || state.transitioning) return;
            const index = Number(button.dataset.trackSelect);
            if (!Number.isInteger(index)) return;
            if (index !== state.activeTrackIndex) {
                setActiveTrack(index);
                scrollCardToActivationLine(trackCard(index));
                return;
            }
            void expandPlayer();
        });

        refs.summary.addEventListener("click", (event) => {
            const action = event.target.closest("[data-music-action]");
            if (!action) return;
            void handleMusicAction(action.dataset.musicAction, action);
        });

        refs.player.addEventListener("click", (event) => {
            const action = event.target.closest("[data-music-action]");
            if (action) {
                void handleMusicAction(action.dataset.musicAction, action);
                return;
            }
            const adjacent = event.target.closest("[data-player-adjacent-index]");
            if (adjacent && !state.transitioning) {
                const container = adjacent.closest(".music-player__adjacent");
                if (container?.classList.contains("music-player__adjacent--prev")) {
                    void skipPrevious({ applyShuffle: true });
                } else {
                    void skipNext({ applyShuffle: true });
                }
            }
        });

        refs.playerBack.addEventListener("click", () => void collapsePlayer());
        refs.playerVariant.addEventListener("click", () => void toggleInstrumental());

        refs.cover.addEventListener("click", (event) => {
            const sort = event.target.closest("[data-cover-sort]");
            if (sort) {
                stopCoverVideo({ rerender: false });
                state.coverSort = state.coverSort === "newest" ? "popular" : "newest";
                state.pendingCoverSortRefresh = false;
                renderCoverList();
                return;
            }

            const filter = event.target.closest("[data-cover-filter]");
            if (filter) {
                stopCoverVideo({ rerender: false });
                state.coverFilter = filter.dataset.coverFilter;
                state.pendingCoverSortRefresh = false;
                renderCoverList();
                return;
            }

            const play = event.target.closest("[data-cover-play]");
            if (play) {
                playCoverVideo(play.dataset.coverPlay);
                return;
            }

            const fav = event.target.closest("[data-cover-fav]");
            if (fav) void toggleFav(fav.dataset.coverFav, fav);
        });

        refs.interpretationClose.addEventListener("click", closeInterpretation);
        refs.interpretationForm.addEventListener("submit", (event) => void submitInterpretation(event));
        refs.interpretationBody.addEventListener("input", () => {
            refs.interpretationCount.textContent = String(refs.interpretationBody.value.length);
            if (state.interpretationTrackSlug) {
                state.interpretationDraftBySlug.set(
                    state.interpretationTrackSlug,
                    refs.interpretationBody.value
                );
            }
        });
        refs.interpretationPanel.addEventListener("focusin", (event) => {
            if (!event.target.closest("input, textarea, select, [contenteditable='true']")) return;
            requestAnimationFrame(clampInterpretationPanel);
        });
        refs.interpretationPanel.addEventListener("focusout", () => {
            window.setTimeout(() => {
                if (!refs.interpretationPanel.contains(document.activeElement)) {
                    refs.interpretationPanel.classList.remove("is-input-active");
                    refs.interpretationPanel.style.removeProperty("max-height");
                }
                clampInterpretationPanel();
            }, 0);
        });

        refs.diaryClose.addEventListener("click", closeDiaryWindow);
        refs.diaryWindow.addEventListener("click", (event) => {
            if (event.target === refs.diaryWindow) closeDiaryWindow();
        });
        refs.diaryPanel.addEventListener("click", (event) => event.stopPropagation());

        window.addEventListener("scroll", scheduleCollapsedScrollUpdate, { passive: true });
        window.addEventListener("resize", () => {
            state.visualizerMetrics = null;
            resizeVisualizerCanvas(true);
            scheduleTrackSectionMeasure();
            scheduleCollapsedScrollUpdate();
            clampInterpretationPanel();
        });
        window.visualViewport?.addEventListener("resize", clampInterpretationPanel);
        window.visualViewport?.addEventListener("scroll", clampInterpretationPanel);

        document.addEventListener("keydown", (event) => {
            if (event.key !== "Escape") return;
            if (!refs.interpretation.hidden) {
                event.preventDefault();
                closeInterpretation();
                return;
            }
            if (!refs.diaryWindow.hidden) {
                event.preventDefault();
                closeDiaryWindow();
            }
        });

        window.addEventListener("popstate", () => void restoreFromUrl());
        window.addEventListener("pagehide", () => {
            pauseAudio();
            stopCoverVideo({ rerender: false });
        });

        audio.addEventListener("play", () => {
            if (!state.audioActuallyPlaying) setAudioBuffering(true);
            syncPlayerControls();
        });
        audio.addEventListener("playing", () => {
            state.audioActuallyPlaying = true;
            setAudioBuffering(false);
            syncPlayerControls();
            startPlayerFrame();
        });
        audio.addEventListener("waiting", () => {
            if (audio.paused) return;
            state.audioActuallyPlaying = false;
            setAudioBuffering(true);
            syncPlayerControls();
            startPlayerFrame();
        });
        audio.addEventListener("stalled", () => {
            if (audio.paused) return;
            state.audioActuallyPlaying = false;
            setAudioBuffering(true);
            syncPlayerControls();
        });
        audio.addEventListener("canplay", () => {
            if (audio.paused && state.playIntent !== true) setAudioBuffering(false);
            syncPlayerControls();
        });
        audio.addEventListener("pause", () => {
            state.audioActuallyPlaying = false;
            if (!state.transitioning) setAudioBuffering(false);
            syncPlayerControls();
            stopPlayerFrame();
            syncPlayerProgress();
            drawVisualizer(performance.now(), true);
        });
        audio.addEventListener("loadedmetadata", () => {
            if (Number.isFinite(state.pendingSeekRatio)) applySeekRatio(state.pendingSeekRatio);
            if (audio.paused && state.playIntent !== true) setAudioBuffering(false);
            syncPlayerControls();
        });
        audio.addEventListener("loadstart", () => {
            setAudioBuffering(true);
            syncPlayerControls();
        });
        audio.addEventListener("emptied", () => {
            state.audioActuallyPlaying = false;
            if (state.audioTrackSlug) setAudioBuffering(true);
            syncPlayerControls();
        });
        audio.addEventListener("durationchange", syncPlayerControls);
        audio.addEventListener("timeupdate", syncPlayerProgress);
        audio.addEventListener("ended", () => {
            state.audioActuallyPlaying = false;
            setAudioBuffering(false);
            void handleAudioEnded();
        });
        audio.addEventListener("error", () => {
            state.audioActuallyPlaying = false;
            setAudioBuffering(false);
            syncPlayerControls();
            console.warn("音源を読み込めませんでした。", audio.currentSrc);
        });

        bindDiscGesture();
        bindInterpretationDrag();
    }

    function cacheRefs() {
        refs.header = document.getElementById("site-header");
        refs.page = document.getElementById("music-page");
        refs.tabs = document.querySelector(".music-tabs");
        refs.original = document.getElementById("music-original");
        refs.cover = document.getElementById("music-cover");
        refs.listView = document.querySelector("[data-original-list-view]");
        refs.trackList = document.querySelector("[data-track-list]");
        refs.summary = document.querySelector("[data-music-summary]");
        refs.summaryInner = document.querySelector("[data-music-summary-inner]");
        refs.player = document.querySelector("[data-music-player]");
        refs.playerTitle = document.querySelector("[data-player-title]");
        refs.playerInstrumental = document.querySelector("[data-player-instrumental]");
        refs.playerVariant = document.querySelector("[data-player-variant]");
        refs.discStage = document.querySelector("[data-player-disc-stage]");
        refs.discHost = document.querySelector("[data-player-disc-host]");
        refs.playerLoading = document.querySelector("[data-player-loading]");
        refs.visualizer = document.querySelector("[data-player-visualizer]");
        refs.progressButton = document.querySelector("[data-player-progress-button]");
        refs.progressIcon = document.querySelector("[data-player-progress-icon]");
        refs.playerBack = document.querySelector("[data-player-back]");
        refs.playerCredits = document.querySelector("[data-player-credits]");
        refs.playerLyricsSection = document.querySelector("[data-player-lyrics-section]");
        refs.playerLyrics = document.querySelector("[data-player-lyrics]");
        refs.railLeft = document.querySelector("[data-player-rail-left]");
        refs.railRight = document.querySelector("[data-player-rail-right]");
        refs.adjacentPrev = document.querySelector("[data-player-adjacent-prev]");
        refs.adjacentNext = document.querySelector("[data-player-adjacent-next]");
        refs.coverSort = document.querySelector("[data-cover-sort]");
        refs.coverSortLabel = document.querySelector("[data-cover-sort-label]");
        refs.coverList = document.querySelector("[data-cover-list]");
        refs.coverEmpty = document.querySelector("[data-cover-empty]");
        refs.interpretation = document.querySelector("[data-music-interpretation]");
        refs.interpretationPanel = document.querySelector("[data-music-interpretation-panel]");
        refs.interpretationClose = document.querySelector("[data-music-interpretation-close]");
        refs.interpretationForm = document.querySelector("[data-music-interpretation-form]");
        refs.interpretationBody = document.querySelector("[data-music-interpretation-body]");
        refs.interpretationCount = document.querySelector("[data-music-interpretation-count]");
        refs.interpretationMessage = document.querySelector("[data-music-interpretation-message]");
        refs.diaryWindow = document.querySelector("[data-music-diary-window]");
        refs.diaryPanel = document.querySelector("[data-music-diary-panel]");
        refs.diaryClose = document.querySelector("[data-music-diary-close]");
        refs.diaryTitle = document.querySelector("[data-music-diary-title]");
        refs.diaryDate = document.querySelector("[data-music-diary-date]");
        refs.diaryBody = document.querySelector("[data-music-diary-body]");
        refs.diaryAuthor = document.querySelector("[data-music-diary-author]");
        refs.diaryMore = document.querySelector("[data-music-diary-more]");
    }

    function isTrackWithinLocalPublicationWindow(track, now = Date.now()) {
        const publishValue = track?.publication?.publishAt ?? track?.publishAt;
        const unpublishValue = track?.publication?.unpublishAt ?? track?.unpublishAt;
        const publishAt = publishValue ? Date.parse(publishValue) : Number.NEGATIVE_INFINITY;
        const unpublishAt = unpublishValue ? Date.parse(unpublishValue) : Number.POSITIVE_INFINITY;

        if (Number.isFinite(publishAt) && now < publishAt) return false;
        if (Number.isFinite(unpublishAt) && now >= unpublishAt) return false;
        return true;
    }

    function rebuildMusicPublicationLists() {
        const now = Date.now();
        ORIGINAL_TRACKS = ORIGINAL_TRACK_DATA
            .filter((track) => isTrackListVisible(track, now))
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        COVER_TRACKS = COVER_TRACK_DATA
            .filter((track) => track.published === true && isTrackWithinLocalPublicationWindow(track, now));
        ALL_MUSIC_ITEMS = [...ORIGINAL_TRACKS, ...COVER_TRACKS];
        state.activeTrackIndex = clamp(state.activeTrackIndex, 0, Math.max(0, ORIGINAL_TRACKS.length - 1));
    }

    async function hydrateMusicPublicationConfiguration() {
        const publication = window.KotonoUraPublication;
        let result = null;

        if (publication) {
            result = await publication.load(["music-original", "music-cover"]);
        }

        [...ORIGINAL_TRACK_DATA, ...COVER_TRACK_DATA].forEach((track) => {
            const record = publication?.get(result, track.contentType, track.slug);
            if (!record) return;

            track.publication = {
                state: record.state,
                rawState: record.rawState,
                publishAt: record.publishAt,
                unpublishAt: record.unpublishAt
            };
            if (Object.keys(record.sections || {}).length) {
                track.sections = { ...(track.sections || {}), ...record.sections };
            }

            if (track.contentType === "music-cover") {
                track.published = record.state === "public";
            }
            if (Number.isFinite(record.sortOrder) && record.sortOrder !== 0) {
                track.order = record.sortOrder;
            }
        });

        rebuildMusicPublicationLists();
    }

    async function init() {
        await Promise.all([
            hydrateMusicPublicationConfiguration(),
            window.DIARY_DATA?.loadPublication?.() || Promise.resolve(),
            preloadMusicIcons()
        ]);
        cacheRefs();
        ORIGINAL_TRACKS.forEach((track) => state.variantBySlug.set(track.slug, "vocal"));
        renderTrackList();

        if (activeTrack()) {
            await renderSummary(activeTrack(), { immediate: true });
        } else {
            refs.summaryInner.innerHTML = '<p class="music-summary__empty">公開中の楽曲はありません。</p>';
        }

        syncTrackSectionHeights();
        document.fonts?.ready.then(() => {
            scheduleTrackSectionMeasure();
            scheduleCollapsedScrollUpdate();
        });
        renderCoverList();
        bindEvents();
        await nextPaint();
        await restoreFromUrl();
        scheduleFavHydration();
        scheduleCollapsedScrollUpdate();
    }

    void init();
})();
