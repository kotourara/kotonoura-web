/* =========================================================
   TOP NEWS data / templates

   運用:
   - サイト内の新規コンテンツ追加時は PAGE_UPDATE_TEMPLATES で候補を作る。
   - 候補は approved:false を初期値とし、内容確認後に true へ変更する。
   - 小さな文言修正・CSS調整・不具合修正・URL差し替えはNEWS化しない。
   - 外部公開（YouTube / Streaming）は manualEntries へ登録する。
   - publishAt 到達前は表示しない。

   テンプレート:
   - Gallery - Illustration
     『<iro-work__headerのtitle>』をパレットへ追加しました
     → gallery.html?category=illustration&work=<slug>

   - Gallery - Live2D
     『<model-card__name-box>』が工房にログインしました
     → gallery.html（モデル一覧）

   - Gallery - Works(Commission)
     <works-card__title>を担当しました
     → gallery.html?category=works

   - Gallery - Works(Personal)
     <works-card__title>を保存しました
     → gallery.html?category=works

   - Music - Original
     新曲<music-summary__title>を保存しました
     → music.html（Original一覧）

   - Music - Cover
     楽曲『<music-cover-card__title>』を保存しました
     → music.html?view=cover

   - Diary
     日記『<diary-item__title>』を保存しました
     → diary.html

   - YouTube
     <指定のコンテンツタイトル>が公開されました

   - Streaming
     『<指定の楽曲タイトル>』の配信が開始されました
   ========================================================= */

(() => {
    "use strict";

    const pageUpdateBase = ({
        id,
        contentId,
        category,
        title,
        url,
        publishAt,
        order = 0,
        approved = false,
        status = "scheduled"
    }) => ({
        id,
        contentId,
        announce: true,
        approved,
        category,
        title,
        summary: "",
        url,
        status,
        publishAt,
        unpublishAt: null,
        order
    });

    const externalBase = ({
        id,
        category,
        title,
        url,
        publishAt,
        order = 0,
        approved = false,
        status = "scheduled"
    }) => ({
        id,
        approved,
        category,
        title,
        summary: "",
        url,
        isExternal: true,
        status,
        publishAt,
        unpublishAt: null,
        order
    });

    const PAGE_UPDATE_TEMPLATES = Object.freeze({
        illustration: ({ title, slug, ...rest }) => pageUpdateBase({
            ...rest,
            category: "gallery-illustration",
            title: `『${title}』をパレットへ追加しました`,
            url: `gallery.html?category=illustration&work=${encodeURIComponent(slug)}`
        }),

        live2d: ({ name, ...rest }) => pageUpdateBase({
            ...rest,
            category: "gallery-live2d",
            title: `『${name}』が工房にログインしました`,
            url: "gallery.html"
        }),

        worksCommission: ({ title, ...rest }) => pageUpdateBase({
            ...rest,
            category: "gallery-works-commission",
            title: `${title}を担当しました`,
            url: "gallery.html?category=works"
        }),

        worksPersonal: ({ title, ...rest }) => pageUpdateBase({
            ...rest,
            category: "gallery-works-personal",
            title: `${title}を保存しました`,
            url: "gallery.html?category=works"
        }),

        musicOriginal: ({ title, ...rest }) => pageUpdateBase({
            ...rest,
            category: "music-original",
            title: `新曲${title}を保存しました`,
            url: "music.html"
        }),

        musicCover: ({ title, ...rest }) => pageUpdateBase({
            ...rest,
            category: "music-cover",
            title: `楽曲『${title}』を保存しました`,
            url: "music.html?view=cover"
        }),

        diary: ({ title, ...rest }) => pageUpdateBase({
            ...rest,
            category: "diary",
            title: `日記『${title}』を保存しました`,
            url: "diary.html"
        })
    });

    const EXTERNAL_NEWS_TEMPLATES = Object.freeze({
        youtube: ({ contentTitle, ...rest }) => externalBase({
            ...rest,
            category: "youtube",
            title: `${contentTitle}が公開されました`
        }),

        streaming: ({ musicTitle, ...rest }) => externalBase({
            ...rest,
            category: "streaming",
            title: `『${musicTitle}』の配信が開始されました`
        })
    });

    /*
     * 今後、コンテンツ追加と同時にNEWS候補を作る際の共通テンプレート。
     * AI/実装側はここを使用し、approved:false のまま候補追加 → 確認後trueへ切替える。
     */
    window.TOP_NEWS_TEMPLATES = Object.freeze({
        page: PAGE_UPDATE_TEMPLATES,
        external: EXTERNAL_NEWS_TEMPLATES
    });

    window.TOP_NEWS_SOURCE = {
        settings: {
            pageSize: 5,
            previewAll: false,
            showPagerWhenSinglePage: true
        },

        pageUpdates: [
            pageUpdateBase({
                id: "news-20260903-gallery-live2d-tokimiya",
                contentId: "live2d-tokimiya",
                category: "gallery-live2d",
                title: "『時宮リュズ』が工房にログインしました",
                url: "gallery.html",
                publishAt: "2026-09-03T19:00:00+09:00",
                order: 10,
                approved: true,
                status: "published"
            }),
            /* 今回は指定文言を優先するため、Original標準テンプレートの「新曲」は付けない。 */
            pageUpdateBase({
                id: "news-20260828-music-original-motsure",
                contentId: "music-original-motsure",
                category: "music-original",
                title: "『縺れ』を保存しました",
                url: "music.html",
                publishAt: "2026-08-28T19:30:00+09:00",
                order: 10,
                approved: true,
                status: "published"
            }),
            pageUpdateBase({
                id: "news-20260826-site-open",
                contentId: "site-launch-20260826",
                category: "site",
                title: "琴ノ裏工房 Webサイトがオープンしました",
                url: null,
                publishAt: "2026-08-26T00:00:00+09:00",
                order: 30,
                approved: true,
                status: "published"
            })
        ],

        manualEntries: [
            externalBase({
                id: "news-20260828-youtube-motsure-mv",
                category: "youtube",
                title: "『縺れ』Music Videoが公開されました",
                url: "https://youtu.be/ASfcEdSpN14",
                publishAt: "2026-08-28T19:30:00+09:00",
                order: 20,
                approved: true,
                status: "published"
            }),
            externalBase({
                id: "news-20260826-streaming-motsure",
                category: "streaming",
                title: "新曲『縺れ』の配信が開始されました",
                url: "https://linkco.re/VfUgpGVs",
                publishAt: "2026-08-26T19:30:00+09:00",
                order: 10,
                approved: true,
                status: "published"
            }),
            externalBase({
                id: "news-20260826-youtube-wimina-v2-pv",
                category: "youtube",
                title: "弓可可ヰミナ ver.2.0 新衣装PVが公開されました",
                url: "https://youtu.be/kUL0XiVUOm0",
                publishAt: "2026-08-26T19:30:00+09:00",
                order: 20,
                approved: true,
                status: "published"
            })
        ]
    };
})();
