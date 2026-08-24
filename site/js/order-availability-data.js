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
     * 月そのものは管理しません。
     * 選択中プランの納期目安から表示対象月を計算し、
     * positions の position=1 が「表示中の1番目の月」に対応します。
     *
     * 例（8/15以降に【極】5〜8か月を表示する場合）:
     * 1番目=2月 / 2番目=3月 / 3番目=4月 / 4番目=5月
     * → positions の1〜4が、それぞれ2〜5月へ適用されます。
     *
     * positions:
     *   通常運用の基本状態。原則ここだけ更新します。
     * overrides:
     *   一時的な手動上書き。positions より優先されます。
     *   plan を省略すると全プラン共通、plan を指定するとそのプランだけに適用します。
     *
     * plan ID:
     * custom / one / two / three / extreme / other
     *
     * fallbackStatus:
     * positions に指定のない位置へ適用する状態です。
     * fallbackDisplayCount:
     * 「要相談」など納期目安を数値化できないプランの表示件数です。
     *
     * 表示基準月は日本時間で、1〜14日は当月、15日以降は翌月です。
     */
    window.ORDER_AVAILABILITY_DATA = Object.freeze({
        currentMonthThroughDay: 14,
        fallbackDisplayCount: 5,
        fallbackStatus: "open",

        positions: Object.freeze([
            Object.freeze({ position: 1, status: "closed" }),
            Object.freeze({ position: 2, status: "ask" }),
            Object.freeze({ position: 3, status: "limited" }),
            Object.freeze({ position: 4, status: "open" }),
            Object.freeze({ position: 5, status: "open" })
        ]),

        overrides: Object.freeze([
            // 全プラン共通の例:
            // Object.freeze({ position: 2, status: "closed" }),

            // 特定プランだけ上書きする例:
            // Object.freeze({ plan: "extreme", position: 1, status: "ask" })
        ])
    });
})();
