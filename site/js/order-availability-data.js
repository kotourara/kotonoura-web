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
     * 最短の5か月先を起点に5件表示します。
     * 1番目=2月 / 2番目=3月 / 3番目=4月 / 4番目=5月 / 5番目=6月
     * → positions の1〜5が、それぞれ2〜6月へ適用されます。
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
     * displayCount:
     * 全プラン共通の表示件数です。納期目安の最短位置から、この件数だけ表示します。
     * leadTimeDelay:
     * 一時的に全プランの表示開始月を先送りする設定です。
     * startDate と months を一度指定すれば、表示基準月が1か月進むたびに
     * 遅延も1か月ずつ自動で減衰し、0になった時点で通常運用へ戻ります。
     *
     * 例: startDate="2026-09-17", months=2
     * 9/17〜10/14: +2 / 10/15〜11/14: +1 / 11/15以降: +0
     *
     * 今後同様の先送りを行う場合は、この startDate と months だけ更新します。
     * months: 0 で遅延なし。
     *
     * 表示基準月は日本時間で、1〜14日は当月、15日以降は翌月です。
     */
    window.ORDER_AVAILABILITY_DATA = Object.freeze({
        currentMonthThroughDay: 14,
        displayCount: 5,
        leadTimeDelay: Object.freeze({
            startDate: "2026-09-17",
            months: 2
        }),
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
