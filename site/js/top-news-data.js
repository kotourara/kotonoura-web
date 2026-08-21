/* =========================================================
   TOP NEWS data

   pageUpdates:
   - サイト内コンテンツの正式公開時に登録する。
   - announce を true にした項目だけNEWSへ掲載する。

   manualEntries:
   - X、YouTube、外部活動、個別のお知らせを手動登録する。

   status:
   draft / scheduled / published / archived
   ========================================================= */

window.TOP_NEWS_SOURCE = {
    settings: {
        displayLimit: 4
    },

    pageUpdates: [
        /*
        {
            id: "news-page-20260826-music-motsure",
            contentId: "対象コンテンツの固定UUID",
            announce: true,
            category: "music",
            title: "『縺れ』を公開しました",
            summary: "",
            url: "music.html",
            status: "scheduled",
            publishAt: "2026-08-26T20:00:00+09:00",
            unpublishAt: null,
            priority: 0
        }
        */
    ],

    manualEntries: [
        /*
        {
            id: "news-manual-20260826-youtube",
            category: "youtube",
            title: "動画タイトル",
            summary: "",
            url: "https://example.com/",
            isExternal: true,
            status: "published",
            publishAt: "2026-08-26T20:00:00+09:00",
            unpublishAt: null,
            priority: 0
        }
        */
    ]
};
