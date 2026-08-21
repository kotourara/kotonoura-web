(() => {
    "use strict";

    /*
     * 依頼コンディション更新用データ。
     *
     * status は次の4種類です。
     * closed: 停止中
     * ask: 要相談
     * limited: 残り僅か
     * open: 受付中
     *
     * months      : 基本状態。通常はこちらを更新します。
     * overrides   : 一時的な手動上書き。months より優先されます。
     * fallbackStatus: 月指定がない場合の状態です。
     *
     * 表示月は日本時間を基準に、1〜14日は当月から、15日以降は翌月からです。
     * 表示先頭から「停止中」が2か月以上連続した場合は、最も新しい停止月だけを残し、
     * 省略した分だけ未来の月を追加して表示件数を保ちます。
     */
    window.ORDER_AVAILABILITY_DATA = Object.freeze({
        displayCount: 5,
        currentMonthThroughDay: 14,
        fallbackStatus: "ask",
        months: Object.freeze([
            Object.freeze({ month: "2026-09", status: "closed" }),
            Object.freeze({ month: "2026-10", status: "ask" }),
            Object.freeze({ month: "2026-11", status: "limited" }),
            Object.freeze({ month: "2026-12", status: "open" }),
            Object.freeze({ month: "2027-01", status: "open" })
        ]),
        overrides: Object.freeze([
            // 例: Object.freeze({ month: "2026-10", status: "closed" })
        ])
    });
})();
