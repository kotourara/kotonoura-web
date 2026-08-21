(() => {
    "use strict";

    const MOBILE_QUERY = window.matchMedia(
        "(max-width: 1099px), (hover: none), (pointer: coarse)"
    );
    const RICH_DESKTOP_QUERY = window.matchMedia(
        "(min-width: 1100px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
    );

    const MOBILE_ASSETS = Object.freeze({
    "images/gallery/illustration/IroKasane/kamenozoki-bg.webp": {
        "src": "images/mobile/gallery/illustration/IroKasane/kamenozoki-bg.webp",
        "originalWidth": 1800,
        "originalHeight": 2594,
        "width": 1280,
        "height": 1845,
        "animated": false
    },
    "images/gallery/illustration/IroKasane/kamenozoki.webp": {
        "src": "images/mobile/gallery/illustration/IroKasane/kamenozoki.webp",
        "originalWidth": 1800,
        "originalHeight": 2594,
        "width": 1280,
        "height": 1845,
        "animated": false
    },
    "images/gallery/illustration/IroKasane/wakakusa-bg.webp": {
        "src": "images/mobile/gallery/illustration/IroKasane/wakakusa-bg.webp",
        "originalWidth": 1800,
        "originalHeight": 2594,
        "width": 1280,
        "height": 1845,
        "animated": false
    },
    "images/gallery/illustration/IroKasane/wakakusa.webp": {
        "src": "images/mobile/gallery/illustration/IroKasane/wakakusa.webp",
        "originalWidth": 1800,
        "originalHeight": 2594,
        "width": 1280,
        "height": 1845,
        "animated": false
    },
    "images/gallery/illustration/IroKasane/yamabuki-bg.webp": {
        "src": "images/mobile/gallery/illustration/IroKasane/yamabuki-bg.webp",
        "originalWidth": 1800,
        "originalHeight": 2594,
        "width": 1280,
        "height": 1845,
        "animated": false
    },
    "images/gallery/illustration/IroKasane/yamabuki.webp": {
        "src": "images/mobile/gallery/illustration/IroKasane/yamabuki.webp",
        "originalWidth": 1800,
        "originalHeight": 2594,
        "width": 1280,
        "height": 1845,
        "animated": false
    },
    "images/gallery/live2d/models/KotoUrara/KotoUrara-kv-bg.webp": {
        "src": "images/mobile/gallery/live2d/models/KotoUrara/KotoUrara-kv-bg.webp",
        "originalWidth": 3600,
        "originalHeight": 3600,
        "width": 2800,
        "height": 2800,
        "animated": false
    },
    "images/gallery/live2d/models/KotoUrara/KotoUrara-kv-fg.webp": {
        "src": "images/mobile/gallery/live2d/models/KotoUrara/KotoUrara-kv-fg.webp",
        "originalWidth": 3600,
        "originalHeight": 3600,
        "width": 2800,
        "height": 2800,
        "animated": false
    },
    "images/gallery/live2d/models/KotoUrara/KotoUrara-kv.webp": {
        "src": "images/mobile/gallery/live2d/models/KotoUrara/KotoUrara-kv.webp",
        "originalWidth": 3600,
        "originalHeight": 3600,
        "width": 2800,
        "height": 2800,
        "animated": false
    },
    "images/gallery/live2d/models/KotoUrara/KotoUrara-logo.webp": {
        "src": "images/mobile/gallery/live2d/models/KotoUrara/KotoUrara-logo.webp",
        "originalWidth": 1280,
        "originalHeight": 720,
        "width": 960,
        "height": 540,
        "animated": false
    },
    "images/gallery/live2d/models/KotoUrara/KotoUrara-model.webp": {
        "src": "images/mobile/gallery/live2d/models/KotoUrara/KotoUrara-model.webp",
        "originalWidth": 971,
        "originalHeight": 3176,
        "width": 673,
        "height": 2200,
        "animated": false
    },
    "images/gallery/live2d/models/TsuchinoNono/TsuchinoNono-model.webp": {
        "src": "images/mobile/gallery/live2d/models/TsuchinoNono/TsuchinoNono-model.webp",
        "originalWidth": 1532,
        "originalHeight": 3061,
        "width": 1101,
        "height": 2200,
        "animated": false
    },
    "images/gallery/live2d/models/TsuchinoNono/TsuchinoNono-model_2.webp": {
        "src": "images/mobile/gallery/live2d/models/TsuchinoNono/TsuchinoNono-model_2.webp",
        "originalWidth": 1261,
        "originalHeight": 3061,
        "width": 906,
        "height": 2200,
        "animated": false
    },
    "images/gallery/live2d/models/YumikakaWimina/YumikakaWimina-3view.webp": {
        "src": "images/mobile/gallery/live2d/models/YumikakaWimina/YumikakaWimina-3view.webp",
        "originalWidth": 3174,
        "originalHeight": 1777,
        "width": 2000,
        "height": 1120,
        "animated": false
    },
    "images/gallery/live2d/models/YumikakaWimina/YumikakaWimina-kv-bg.webp": {
        "src": "images/mobile/gallery/live2d/models/YumikakaWimina/YumikakaWimina-kv-bg.webp",
        "originalWidth": 3600,
        "originalHeight": 3600,
        "width": 2800,
        "height": 2800,
        "animated": false
    },
    "images/gallery/live2d/models/YumikakaWimina/YumikakaWimina-kv-fg.webp": {
        "src": "images/mobile/gallery/live2d/models/YumikakaWimina/YumikakaWimina-kv-fg.webp",
        "originalWidth": 3600,
        "originalHeight": 3600,
        "width": 2800,
        "height": 2800,
        "animated": false
    },
    "images/gallery/live2d/models/YumikakaWimina/YumikakaWimina-kv.webp": {
        "src": "images/mobile/gallery/live2d/models/YumikakaWimina/YumikakaWimina-kv.webp",
        "originalWidth": 3600,
        "originalHeight": 3600,
        "width": 2800,
        "height": 2800,
        "animated": false
    },
    "images/gallery/live2d/models/YumikakaWimina/YumikakaWimina-logo.webp": {
        "src": "images/mobile/gallery/live2d/models/YumikakaWimina/YumikakaWimina-logo.webp",
        "originalWidth": 1280,
        "originalHeight": 720,
        "width": 960,
        "height": 540,
        "animated": false
    },
    "images/gallery/live2d/models/YumikakaWimina/YumikakaWimina-model.webp": {
        "src": "images/mobile/gallery/live2d/models/YumikakaWimina/YumikakaWimina-model.webp",
        "originalWidth": 2202,
        "originalHeight": 2184,
        "width": 1600,
        "height": 1587,
        "animated": false
    },
    "images/gallery/live2d/models/YumikakaWimina/YumikakaWimina-model_2.webp": {
        "src": "images/mobile/gallery/live2d/models/YumikakaWimina/YumikakaWimina-model_2.webp",
        "originalWidth": 2075,
        "originalHeight": 2907,
        "width": 1570,
        "height": 2200,
        "animated": false
    },
    "images/gallery/live2d/models/YumikakaWimina/YumikakaWimina-model_3.webp": {
        "src": "images/mobile/gallery/live2d/models/YumikakaWimina/YumikakaWimina-model_3.webp",
        "originalWidth": 847,
        "originalHeight": 2907,
        "width": 641,
        "height": 2200,
        "animated": false
    },
    "images/gallery/live2d/models/YumikakaWimina/YumikakaWimina-model_4.webp": {
        "src": "images/mobile/gallery/live2d/models/YumikakaWimina/YumikakaWimina-model_4.webp",
        "originalWidth": 1691,
        "originalHeight": 1644,
        "width": 1600,
        "height": 1556,
        "animated": false
    },
    "images/gallery/works/HonokaKanon_c.webp": {
        "src": "images/mobile/gallery/works/HonokaKanon_c.webp",
        "originalWidth": 1400,
        "originalHeight": 1400,
        "width": 960,
        "height": 960,
        "animated": false
    },
    "images/gallery/works/LowTail_p.webp": {
        "src": "images/mobile/gallery/works/LowTail_p.webp",
        "originalWidth": 1400,
        "originalHeight": 959,
        "width": 960,
        "height": 658,
        "animated": false
    },
    "images/gallery/works/LowTail_p2.webp": {
        "src": "images/mobile/gallery/works/LowTail_p2.webp",
        "originalWidth": 1400,
        "originalHeight": 959,
        "width": 960,
        "height": 658,
        "animated": false
    },
    "images/gallery/works/MayuzumiX_p.webp": {
        "src": "images/mobile/gallery/works/MayuzumiX_p.webp",
        "originalWidth": 1400,
        "originalHeight": 2489,
        "width": 960,
        "height": 1707,
        "animated": false
    },
    "images/gallery/works/MeitoubaraAmagi_c.webp": {
        "src": "images/mobile/gallery/works/MeitoubaraAmagi_c.webp",
        "originalWidth": 1400,
        "originalHeight": 1867,
        "width": 960,
        "height": 1280,
        "animated": false
    },
    "images/gallery/works/Neige_c.webp": {
        "src": "images/mobile/gallery/works/Neige_c.webp",
        "originalWidth": 1400,
        "originalHeight": 1400,
        "width": 960,
        "height": 960,
        "animated": false
    },
    "images/gallery/works/Senacha_c.webp": {
        "src": "images/mobile/gallery/works/Senacha_c.webp",
        "originalWidth": 1400,
        "originalHeight": 1400,
        "width": 960,
        "height": 960,
        "animated": false
    },
    "images/gallery/works/SleepingBeauty_p.webp": {
        "src": "images/mobile/gallery/works/SleepingBeauty_p.webp",
        "originalWidth": 1400,
        "originalHeight": 914,
        "width": 960,
        "height": 627,
        "animated": false
    },
    "images/gallery/works/SleepingBeauty_p2.webp": {
        "src": "images/mobile/gallery/works/SleepingBeauty_p2.webp",
        "originalWidth": 1400,
        "originalHeight": 914,
        "width": 960,
        "height": 627,
        "animated": false
    },
    "images/gallery/works/TachibanaHinano_p.webp": {
        "src": "images/mobile/gallery/works/TachibanaHinano_p.webp",
        "originalWidth": 1400,
        "originalHeight": 1867,
        "width": 960,
        "height": 1280,
        "animated": false
    },
    "images/gallery/works/negotiator_p.webp": {
        "src": "images/mobile/gallery/works/negotiator_p.webp",
        "originalWidth": 1400,
        "originalHeight": 1325,
        "width": 960,
        "height": 909,
        "animated": false
    },
    "images/gallery/works/yumepukari_c.webp": {
        "src": "images/mobile/gallery/works/yumepukari_c.webp",
        "originalWidth": 1400,
        "originalHeight": 788,
        "width": 960,
        "height": 540,
        "animated": false
    },
    "images/music/jacket/BigotsWithTheIvoryTower.webp": {
        "src": "images/mobile/music/jacket/BigotsWithTheIvoryTower.webp",
        "originalWidth": 1500,
        "originalHeight": 1500,
        "width": 1080,
        "height": 1080,
        "animated": false
    },
    "images/music/jacket/Illumina-tor.webp": {
        "src": "images/mobile/music/jacket/Illumina-tor.webp",
        "originalWidth": 1500,
        "originalHeight": 1500,
        "width": 1080,
        "height": 1080,
        "animated": false
    },
    "images/music/jacket/Motsure.webp": {
        "src": "images/mobile/music/jacket/Motsure.webp",
        "originalWidth": 1500,
        "originalHeight": 1500,
        "width": 1080,
        "height": 1080,
        "animated": false
    },
    "images/music/thumbnail(cover)/bakusyou.webp": {
        "src": "images/mobile/music/thumbnail(cover)/bakusyou.webp",
        "originalWidth": 1280,
        "originalHeight": 720,
        "width": 960,
        "height": 540,
        "animated": false
    },
    "images/music/thumbnail(cover)/bug.webp": {
        "src": "images/mobile/music/thumbnail(cover)/bug.webp",
        "originalWidth": 1280,
        "originalHeight": 720,
        "width": 960,
        "height": 540,
        "animated": false
    },
    "images/music/thumbnail(cover)/callBoy.webp": {
        "src": "images/mobile/music/thumbnail(cover)/callBoy.webp",
        "originalWidth": 1280,
        "originalHeight": 720,
        "width": 960,
        "height": 540,
        "animated": false
    },
    "images/music/thumbnail(cover)/darlingDance.webp": {
        "src": "images/mobile/music/thumbnail(cover)/darlingDance.webp",
        "originalWidth": 1280,
        "originalHeight": 720,
        "width": 960,
        "height": 540,
        "animated": false
    },
    "images/music/thumbnail(cover)/eba.webp": {
        "src": "images/mobile/music/thumbnail(cover)/eba.webp",
        "originalWidth": 1280,
        "originalHeight": 720,
        "width": 960,
        "height": 540,
        "animated": false
    },
    "images/music/thumbnail(cover)/echo.webp": {
        "src": "images/mobile/music/thumbnail(cover)/echo.webp",
        "originalWidth": 1280,
        "originalHeight": 720,
        "width": 960,
        "height": 540,
        "animated": false
    },
    "images/music/thumbnail(cover)/kodokuNoSyuukyou.webp": {
        "src": "images/mobile/music/thumbnail(cover)/kodokuNoSyuukyou.webp",
        "originalWidth": 1280,
        "originalHeight": 720,
        "width": 960,
        "height": 540,
        "animated": false
    },
    "images/music/thumbnail(cover)/magicalGirlAndChocolate.webp": {
        "src": "images/mobile/music/thumbnail(cover)/magicalGirlAndChocolate.webp",
        "originalWidth": 1280,
        "originalHeight": 720,
        "width": 960,
        "height": 540,
        "animated": false
    },
    "images/music/thumbnail(cover)/noro.webp": {
        "src": "images/mobile/music/thumbnail(cover)/noro.webp",
        "originalWidth": 1280,
        "originalHeight": 720,
        "width": 960,
        "height": 540,
        "animated": false
    },
    "images/music/thumbnail(cover)/requiem.webp": {
        "src": "images/mobile/music/thumbnail(cover)/requiem.webp",
        "originalWidth": 1280,
        "originalHeight": 720,
        "width": 960,
        "height": 540,
        "animated": false
    },
    "images/music/thumbnail(cover)/vampire.webp": {
        "src": "images/mobile/music/thumbnail(cover)/vampire.webp",
        "originalWidth": 1280,
        "originalHeight": 720,
        "width": 960,
        "height": 540,
        "animated": false
    },
    "images/music/thumbnail/thumbnail_BigotsWithTheIvoryTower.webp": {
        "src": "images/mobile/music/thumbnail/thumbnail_BigotsWithTheIvoryTower.webp",
        "originalWidth": 1280,
        "originalHeight": 720,
        "width": 960,
        "height": 540,
        "animated": false
    },
    "images/music/thumbnail/thumbnail_Illumina-tor.webp": {
        "src": "images/mobile/music/thumbnail/thumbnail_Illumina-tor.webp",
        "originalWidth": 1280,
        "originalHeight": 720,
        "width": 960,
        "height": 540,
        "animated": false
    },
    "images/music/thumbnail/thumbnail_Motsure.webp": {
        "src": "images/mobile/music/thumbnail/thumbnail_Motsure.webp",
        "originalWidth": 1280,
        "originalHeight": 720,
        "width": 960,
        "height": 540,
        "animated": false
    },
    "images/order/custom/model-shadow.webp": {
        "src": "images/mobile/order/custom/model-shadow.webp",
        "originalWidth": 3191,
        "originalHeight": 2746,
        "width": 1800,
        "height": 1549,
        "animated": false
    },
    "images/order/custom/model.webp": {
        "src": "images/mobile/order/custom/model.webp",
        "originalWidth": 3191,
        "originalHeight": 2746,
        "width": 1800,
        "height": 1549,
        "animated": false
    },
    "images/profile/KotoUrara-prof.webp": {
        "src": "images/mobile/profile/KotoUrara-prof.webp",
        "originalWidth": 1392,
        "originalHeight": 2525,
        "width": 992,
        "height": 1800,
        "animated": false
    },
    "images/profile/PV-digest.webp": {
        "src": "images/mobile/profile/PV-digest.webp",
        "originalWidth": 480,
        "originalHeight": 640,
        "width": 360,
        "height": 480,
        "animated": true
    },
    "images/profile/PV-thumbnail.webp": {
        "src": "images/mobile/profile/PV-thumbnail.webp",
        "originalWidth": 1280,
        "originalHeight": 720,
        "width": 960,
        "height": 540,
        "animated": false
    },
    "images/profile/YumikakaWimina-prof.webp": {
        "src": "images/mobile/profile/YumikakaWimina-prof.webp",
        "originalWidth": 1392,
        "originalHeight": 2525,
        "width": 992,
        "height": 1800,
        "animated": false
    },
    "images/top/hero-hand-anim-960.webp": {
        "src": "images/mobile/top/hero-hand-anim-960.webp",
        "originalWidth": 960,
        "originalHeight": 539,
        "width": 640,
        "height": 359,
        "animated": true
    }
});

    function splitAssetUrl(url) {
        const value = String(url || "");
        const match = value.match(/^([^?#]*)(.*)$/);
        return {
            path: match ? match[1] : value,
            suffix: match ? match[2] : ""
        };
    }

    function normalizePath(path) {
        return String(path || "")
            .replace(/^\.\//, "")
            .replace(/^\//, "");
    }

    function entry(url) {
        const { path } = splitAssetUrl(url);
        return MOBILE_ASSETS[normalizePath(path)] || null;
    }

    function resolve(url) {
        if (!MOBILE_QUERY.matches) return url;
        const parts = splitAssetUrl(url);
        const asset = MOBILE_ASSETS[normalizePath(parts.path)];
        return asset ? `${asset.src}${parts.suffix}` : url;
    }

    function metadata(url) {
        return entry(url);
    }

    function isMobile() {
        return MOBILE_QUERY.matches;
    }

    function isRichDesktop() {
        return RICH_DESKTOP_QUERY.matches;
    }

    window.KotonoUraAssets = Object.freeze({
        resolve,
        metadata,
        isMobile,
        isRichDesktop,
        mobileQuery: MOBILE_QUERY,
        richDesktopQuery: RICH_DESKTOP_QUERY
    });
})();
