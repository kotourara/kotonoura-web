(() => {
    "use strict";

    const resolveAsset = (path) =>
        window.KotonoUraAssets?.resolve?.(path) || path;

    const STATUS_DATA = {
        closed: { label: "停止中", src: "images/order/condition/closed.webp" },
        ask: { label: "要相談", src: "images/order/condition/ask.webp" },
        limited: { label: "残り僅か", src: "images/order/condition/limited.webp" },
        open: { label: "受付中", src: "images/order/condition/open.webp" }
    };

    const CARD_DATA = {
        art: {
            key: "art",
            family: "art",
            name: "原画",
            icon: "images/order/card/mask/01_art.png",
            phase: 1,
            summary: "Live2D可動を前提に、\n全身の立ち絵を制作します。",
            flavor: '<span class="flavor flavor--max"><ruby>個性<rt>ありのまま</rt></ruby></span><span class="flavor flavor--small"> を </span><span class="flavor flavor--large">唯一無二</span><span class="flavor flavor--small">の</span><span class="flavor flavor--medium">お姿</span><span class="flavor flavor--small">で。</span>'
        },
        parts: {
            key: "parts",
            family: "parts",
            name: "パーツ分け",
            icon: "images/order/card/mask/02_parts.png",
            phase: 2,
            summary: "原画をもとに、髪・目・衣装などを\n動かせる単位まで分割します。",
            flavor: '<span class="flavor flavor--max"><ruby>細部<rt>こだわり</rt></ruby></span><span class="flavor flavor--small">まで</span><span class="flavor flavor--medium">ひとつひとつ</span><span class="flavor flavor--large">丁寧</span><span class="flavor flavor--small">に。</span>'
        },
        rig: {
            key: "rig",
            family: "rig",
            name: "モデリング",
            icon: "images/order/card/mask/03_rig.png",
            phase: 3,
            summary: "パーツに動きをつけ、広い可動域と\n細かな表情まで作り込みます。",
            flavor: '<span class="flavor flavor--max"><ruby>空想<rt>ゆめ</rt></ruby></span><span class="flavor flavor--small">を</span><span class="flavor flavor--large">動</span><span class="flavor flavor--medium">かして</span><span class="flavor flavor--max"><ruby>仮想<rt>げんじつ</rt></ruby></span><span class="flavor flavor--small">へ。</span>'
        },
        logo: {
            key: "logo",
            family: "logo",
            name: "ロゴ",
            icon: "images/order/card/mask/04_logo.png",
            phase: 4,
            summary: "活動名やモチーフに合わせて\nロゴを制作します。",
            flavor: '<span class="flavor flavor--small">いつまでも</span><span class="flavor flavor--large">記憶</span><span class="flavor flavor--small">に</span><span class="flavor flavor--medium">残</span><span class="flavor flavor--small">る</span><span class="flavor flavor--max"><ruby>象徴<rt>かたち</rt></ruby></span><span class="flavor flavor--small">を。</span>'
        },
        animeLogo: {
            key: "animeLogo",
            family: "logo",
            plus: true,
            name: "アニメロゴ",
            icon: "images/order/card/mask/04+_anime-logo.png",
            phase: 4,
            summary: "活動名やモチーフに合わせて\n動きと音のあるロゴに仕上げます。",
            flavor: '<span class="flavor flavor--small">いつまでも</span><span class="flavor flavor--large">記憶</span><span class="flavor flavor--small">に</span><span class="flavor flavor--medium">残</span><span class="flavor flavor--small">る</span><span class="flavor flavor--max"><ruby>象徴<rt>かたち</rt></ruby></span><span class="flavor flavor--small">を。</span>'
        },
        view2: {
            key: "view2",
            family: "views",
            name: "二面図設定画",
            icon: "images/order/card/mask/05_2view.png",
            phase: 5,
            summary: "衣装構造・小物・表情差分などを\n資料として整理します。",
            flavor: '<span class="flavor flavor--max"><ruby>思考<rt>なりたち</rt></ruby></span><span class="flavor flavor--small">の</span><span class="flavor flavor--medium">流れ</span><span class="flavor flavor--small">を</span><span class="flavor flavor--large">一枚</span><span class="flavor flavor--small">の</span><span class="flavor flavor--large">中</span><span class="flavor flavor--small">で。</span>'
        },
        view3: {
            key: "view3",
            family: "views",
            plus: true,
            name: "三面図設定画",
            icon: "images/order/card/mask/05+_3view.png",
            phase: 5,
            summary: "衣装構造・小物・表情差分などを\n資料として整理します。",
            flavor: '<span class="flavor flavor--max"><ruby>思考<rt>なりたち</rt></ruby></span><span class="flavor flavor--small">の</span><span class="flavor flavor--medium">流れ</span><span class="flavor flavor--small">を</span><span class="flavor flavor--large">一枚</span><span class="flavor flavor--small">の</span><span class="flavor flavor--large">中</span><span class="flavor flavor--small">で。</span>'
        },
        kv: {
            key: "kv",
            family: "visual",
            name: "キービジュアル",
            icon: "images/order/card/mask/06_kv.png",
            phase: 6,
            summary: "キャラクターの世界観を引き出す\nキービジュアルを制作します。",
            flavor: '<span class="flavor flavor--max"><ruby>心<rt>ひとみ</rt></ruby></span><span class="flavor flavor--small">を</span><span class="flavor flavor--medium">惹</span><span class="flavor flavor--small">きつけて</span><span class="flavor flavor--medium">あなた</span><span class="flavor flavor--small">の</span><span class="flavor flavor--large">世界</span><span class="flavor flavor--small">へ。</span>'
        },
        dirKv: {
            key: "dirKv",
            family: "visual",
            plus: true,
            name: "演出ビジュアル",
            icon: "images/order/card/mask/06+_dir-kv.png",
            phase: 6,
            summary: "キャラクターの世界観を引き出す\n背景付きキービジュアルを制作します。",
            flavor: '<span class="flavor flavor--max"><ruby>心<rt>ひとみ</rt></ruby></span><span class="flavor flavor--small">を</span><span class="flavor flavor--medium">惹</span><span class="flavor flavor--small">きつけて</span><span class="flavor flavor--medium">あなた</span><span class="flavor flavor--small">の</span><span class="flavor flavor--large">世界</span><span class="flavor flavor--small">へ。</span>'
        },
        setup: {
            key: "setup",
            family: "setup",
            name: "実装サポート",
            icon: "images/order/card/mask/07_setup.png",
            phase: 7,
            summary: "nizimaLIVEでモデルを最大限に\n活用するためのサポートをします。",
            flavor: '<span class="flavor flavor--large">新</span><span class="flavor flavor--medium">しい</span><span class="flavor flavor--max"><ruby>身体<rt>うつわ</rt></ruby></span><span class="flavor flavor--small">を</span><span class="flavor flavor--medium">思うがまま</span><span class="flavor flavor--small">に。</span>'
        },
        sns: {
            key: "sns",
            family: "sns",
            name: "SNS運用相談",
            icon: "images/order/card/mask/08_sns.png",
            phase: 8,
            summary: "Xの初動運用や投稿内容の見せ方\nなどを提案します。",
            flavor: '<span class="flavor flavor--max"><ruby>趣味<rt>いきがい</rt></ruby></span><span class="flavor flavor--small">こそ</span><span class="flavor flavor--medium">本気</span><span class="flavor flavor--small">の</span><span class="flavor flavor--large">戦略</span><span class="flavor flavor--small">を。</span>'
        }
    };

    const ORDER_PLAN_SOURCE = window.ORDER_PLAN_DATA;

    if (!ORDER_PLAN_SOURCE) {
        throw new Error("order-plan-data.jsをorder.jsより先に読み込んでください。");
    }

    const PLAN_DATA = ORDER_PLAN_SOURCE.plans;
    const PLAN_ORDER = ORDER_PLAN_SOURCE.planOrder;

    const cardIconPreloadCache = new Map();

    function getCardIconMaskPath(card) {
        return card?.icon || "";
    }

    function preloadPlanCardIcons(planId) {
        const plan = PLAN_DATA[planId];
        if (!plan || plan.kind !== "cards") return Promise.resolve();
        if (cardIconPreloadCache.has(planId)) return cardIconPreloadCache.get(planId);

        const task = Promise.all(plan.cards.map((cardKey) => new Promise((resolve) => {
            const image = new Image();
            image.onload = resolve;
            image.onerror = resolve;
            image.src = getCardIconMaskPath(CARD_DATA[cardKey]);
        })));
        cardIconPreloadCache.set(planId, task);
        return task;
    }


    const CARD_UPGRADE_MAP = {
        logo: "animeLogo",
        animeLogo: "logo",
        view2: "view3",
        view3: "view2",
        kv: "dirKv",
        dirKv: "kv"
    };

    const CUSTOM_DATA = ORDER_PLAN_SOURCE.customCategories;
    const CUSTOM_KEYS = ORDER_PLAN_SOURCE.customOrder;


    const CUSTOM_VIDEO_SOURCE = "movie/custom-web.mp4";

    const CUSTOM_VIDEO_SECTIONS = {
        eye: { start: 0, end: 35 },
        mouth: { start: 35, end: 110 },
        hair: { start: 110, end: 207 }
    };

    const MOBILE_ORDER_MODE = window.matchMedia?.("(max-width: 1099px), (hover: none), (pointer: coarse)")?.matches ?? false;

    const OPTION_DATA = [
        { label: "原画調整", price: "要見積" },
        { label: "表情差分追加", price: "5,000円〜/点" },
        { label: "特殊ギミック追加", price: "10,000円〜" },
        { label: "実装サポート（通話）", price: "15,000円〜", hideFor: ["one", "two", "three", "extreme"] },
        { label: "SNS運用相談", price: "15,000円〜", hideFor: ["three", "extreme"] }
    ];

    const DETAIL_DATA = {
        art: `
            <section><h3>■ 内容</h3><p>Live2D可動を前提に、全身の立ち絵を制作します。</p></section>
            <section><h3>■ 納品について</h3><ul><li>原画単体での納品には対応していません。</li><li>モデリング完了後に限り、立ち絵の透過PNG出力に対応可能です。</li></ul></section>
            <section><h3>■ 注意事項</h3><ul><li>Live2D可動を前提とした制作のため、通常の一枚絵とは設計が異なります。</li></ul></section>
        `,
        parts: `
            <section><h3>■ 内容</h3><p>原画をもとに、髪・目・衣装などをLive2Dで動かせる単位まで分割します。</p></section>
            <section><h3>■ 納品について</h3><ul><li>パーツ分けPSD単体での納品には対応していません。</li><li>納品はモデリング後のモデルデータとなります。</li></ul></section>
            <section><h3>■ 注意事項</h3><ul><li>可動や表情表現に必要な構造を考慮して分割します。</li></ul></section>
        `,
        rig: `
            <section><h3>■ 内容</h3><p>パーツに動きをつけ、広い可動域と細かな表情まで作り込みます。</p></section>
            <section><h3>■ 標準対応</h3><ul><li>目元、口元、髪質などの表現は、モデル構造上無理なく実装できる範囲で標準組み込みします。</li><li>カスタムモデリング項目のうち、モデルに適した表現を制作内に反映します。</li></ul></section>
            <section><h3>■ 別途お見積り</h3><ul><li>特殊モーション</li><li>工数の多い差分</li><li>構造上、追加作業が必要な表現</li><li>パーツ不足、構造調整、原画修正が必要な場合</li></ul></section>
            <section><h3>■ 修正対応</h3><ul><li>納品後の修正は、制作上の不備がある場合のみ無料で対応します。</li></ul></section>
        `,
        logo: `
            <section><h3>■ 内容</h3><p>活動名やモチーフに合わせて【参】ロゴを制作します。【極】では動きと音のあるロゴに仕上げます。</p></section>
            <section><h3>■ 対応範囲</h3><ul><li>命名段階からのご相談も可能です。</li><li>活動内容や世界観に合わせて、形・色・印象を設計します。</li></ul></section>
            <section><h3>■ 納品形式</h3><ul><li>【参】静止画ロゴ：透過PNG</li><li>【極】静止画ロゴ：透過PNG</li><li>【極】アニメーションロゴ：透過MOV または MP4</li></ul></section>
            <section><h3>■ 【極】アニメーションロゴについて</h3><ul><li>静止画ロゴを完成形とした、5秒前後のアニメーションを制作します。</li><li>サウンド付きでの制作となります。</li><li>Live2Dアニメーションで実現可能な範囲に限ります。</li></ul></section>
        `,
        views: `
            <section><h3>■ 内容</h3><p>衣装構造・小物・表情差分などを資料として整理します。</p></section>
            <section><h3>■ 納品形式</h3><ul><li>PNG形式で納品します。</li></ul></section>
            <section><h3>■ プラン別内容</h3><ul><li>【参】正面・背面の二面図</li><li>【極】正面・側面・背面の三面図</li></ul></section>
            <section><h3>■ 注意事項</h3><ul><li>3Dモデルへそのまま転用できる設計図ではありません。</li><li>キャラクター設定や衣装構造を整理するための資料です。</li></ul></section>
        `,
        visual: `
            <section><h3>■ 内容</h3><p>キャラクターの世界観を引き出すキービジュアルを制作します。</p></section>
            <section><h3>■ 納品形式</h3><ul><li>PNG形式で納品します。</li></ul></section>
            <section><h3>■ プラン別内容</h3><ul><li>【参】簡易キービジュアル<br>人物中心の、汎用性の高い全身一枚絵を制作します。</li><li>【極】背景付きキービジュアル<br>ヴィネットイラスト風の構成で、人物と背景を含めて制作します。</li></ul></section>
            <section><h3>■ 【極】納品内容</h3><ul><li>人物のみ</li><li>人物＋背景</li></ul></section>
            <section><h3>■ 注意事項</h3><ul><li>ロゴ、サムネイル、MVイラストなどの単体制作とは別枠です。</li></ul></section>
        `,
        setup: `
            <section><h3>■ 内容</h3><p>nizimaLIVEでモデルを最大限に活用するためのサポートをします。</p></section>
            <section><h3>■ 対応方法</h3><ul><li>制作者がDiscord通話で対応します。</li><li>画面共有をしながら、設定方法を案内します。</li></ul></section>
            <section><h3>■ 対応範囲</h3><ul><li>納品後の初期設定</li><li>入出力設定</li><li>トラッキング調整方法</li><li>キーバインド設定方法</li><li>モデルを扱うための基本的な確認</li></ul></section>
            <section><h3>■ 対象外</h3><ul><li>nizimaLIVE以外のトラッキングソフト</li><li>OBS設定</li><li>配信環境全体の構築</li><li>継続的なトラッキング調整</li><li>長時間の個別レクチャー</li></ul></section>
            <section><h3>■ 別途相談</h3><p>上記の対象外項目についてサポートが必要な場合は、別途ご相談ください。</p></section>
        `,
        sns: `
            <section><h3>■ 内容</h3><p>Xの初動運用や投稿内容の見せ方などを提案します。</p></section>
            <section><h3>■ 対応範囲</h3><ul><li>プロフィール設計</li><li>ポスト内容の相談</li><li>デビュー前後の見せ方</li><li>タグ方針</li><li>アナリティクスの見方</li><li>初動導線の整理</li></ul></section>
            <section><h3>■ 画像まわりの相談</h3><ul><li>既存画像のトリミングや簡単な加工で作成できる範囲であれば、ヘッダーやアイコンの相談も可能です。</li></ul></section>
            <section><h3>■ 注意事項</h3><ul><li>対応はX（旧Twitter）のみです。</li><li>継続的な運用代行ではありません。</li><li>初動設計と方針整理を中心とした相談です。</li></ul></section>
        `
    };


    const PLAN_DETAIL_DATA = {
        one: {
            rig: `
                <section><h3>■ 【壱】について</h3><ul><li>【壱】フルモデリングは、パーツ分け済みLive2D用原画の持ち込みを前提としたプランです。</li><li>通常の一枚絵や、Live2D向けに整っていない原画の場合は、別途調整費が発生する場合があります。</li></ul></section>
            `
        }
    };
    // Google Apps Scriptをウェブアプリとして公開した後、発行されたURLへ置き換えます。
    const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbwheT9zHYlfklmWDMusvQKFpLWVJg8pRBBLJNrsbevUfRQLKTwLfr_biI1qnwqsE_qW/exec";
    const FORM_DEFAULT_COLOR = "#6D6D6D";

    const CONSULTATION_OPTION_DATA = [
        { key: "art-adjustment", label: "原画調整", showFor: ["one"] },
        { key: "expression", label: "表情差分追加" },
        { key: "special-gimmick", label: "特殊ギミック追加", hideFor: ["custom"] },
        { key: "setup", label: "実装サポート", showFor: ["custom"] },
        { key: "sns", label: "SNS運用相談", hideFor: ["three", "extreme"] }
    ];

    const MODEL_STATE_DATA = {
        working: "動作するLive2Dモデルがある",
        parts: "パーツ分け済み原画がある",
        unseparated: "未分けの立ち絵・原画がある",
        design: "キャラクターデザインのみがある",
        preparing: "これから用意する",
        other: "その他"
    };

    const MODEL_STATE_ORDER = {
        custom: ["working", "parts", "unseparated", "design", "preparing", "other"],
        one: ["parts", "unseparated", "working", "design", "preparing", "other"],
        two: ["unseparated", "design", "preparing", "parts", "working", "other"],
        three: ["design", "preparing", "unseparated", "parts", "working", "other"],
        extreme: ["design", "preparing", "unseparated", "parts", "working", "other"],
        other: ["working", "parts", "unseparated", "design", "preparing", "other"]
    };

    const FORM_FIELD_STEPS = {
        plan: 1,
        deadline: 1,
        budget: 1,
        "request-type": 1,
        "portfolio-publication": 1,
        "custom-selection": 2,
        "additional-use": 2,
        environment: 2,
        "model-state": 2,
        "art-permission": 2,
        "model-permission": 2,
        name: 3,
        email: 3,
        "activity-url": 3,
        "age-group": 3,
        "rights-confirmation": 3,
        "reply-confirmation": 3,
        "policy-confirmation": 3
    };

    const state = {
        activePlan: null,
        activeCustom: null,
        cardScrollEnabled: false,
        customVideoReady: false,
        pendingCustomVideoKey: "",
        pendingCustomVideoShouldPlay: false,
        customVideoSeekToken: 0,
        customScrollEnabled: false,
        switchToken: 0,
        scrollFrame: 0,
        formStep: 1,
        formVisited: new Set([1]),
        formSubmitting: false,
        formRequestId: "",
        formSubmitTimer: 0,
        expandedCardKey: "",
        planTransitioning: false,
        pendingPlanId: "",
        detailPointerOpened: false,
        detailReturnCard: null,
        artAdjustmentAutoSelected: false
    };

    const refs = {};

    function toRoman(number) {
        const table = [
            [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
            [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
            [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
        ];

        let rest = number;
        return table.reduce((result, [value, symbol]) => {
            while (rest >= value) {
                result += symbol;
                rest -= value;
            }
            return result;
        }, "");
    }

    function getCardNumber(card, index) {
        const plus = card.plus ? "⁺" : "";
        return `${toRoman(index + 1)}${plus}.`;
    }

    function formatRailValue(value) {
        return value.replace(
            /(\d+(?:\.\d+)?)/g,
            '<span class="plan-rail__digits">$1</span>'
        );
    }

    function wait(duration) {
        return new Promise((resolve) => window.setTimeout(resolve, duration));
    }

    function runViewTransition(mutator) {
        if (typeof document.startViewTransition !== "function" ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            mutator();
            return Promise.resolve();
        }

        const transition = document.startViewTransition(mutator);
        return transition.finished.catch(() => {});
    }

    function getPlanButton(planId) {
        return refs.planTabs.querySelector(`[data-plan="${planId}"]`);
    }

    function getPlanCopy(planId) {
        const button = getPlanButton(planId);
        return {
            button,
            home: button?.querySelector(".plan-tab__content") || null,
            title: button?.querySelector(".plan-tab__name") || null,
            summary: button?.querySelector(".plan-tab__description") || null
        };
    }

    let availabilityConfigCache = null;

    function getTokyoDateParts() {
        try {
            const parts = new Intl.DateTimeFormat("en-US", {
                timeZone: "Asia/Tokyo",
                year: "numeric",
                month: "numeric",
                day: "numeric"
            }).formatToParts(new Date());
            const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));

            return {
                year: Number(values.year),
                month: Number(values.month),
                day: Number(values.day)
            };
        } catch (error) {
            const today = new Date();
            return {
                year: today.getFullYear(),
                month: today.getMonth() + 1,
                day: today.getDate()
            };
        }
    }

    function shiftYearMonth(year, month, offset) {
        const serial = year * 12 + (month - 1) + offset;
        return {
            year: Math.floor(serial / 12),
            month: (serial % 12 + 12) % 12 + 1
        };
    }

    function toMonthKey(year, month) {
        return `${year}-${String(month).padStart(2, "0")}`;
    }

    function getAvailabilityConfig() {
        if (availabilityConfigCache) return availabilityConfigCache;

        const source = window.ORDER_AVAILABILITY_DATA || {};
        const availableStatuses = new Set(Object.keys(STATUS_DATA));
        const displayCount = Number.isInteger(source.displayCount) && source.displayCount > 0
            ? source.displayCount
            : (Number.isInteger(source.fallbackDisplayCount) && source.fallbackDisplayCount > 0
                ? source.fallbackDisplayCount
                : 5);
        const currentMonthThroughDay = Number.isInteger(source.currentMonthThroughDay) &&
            source.currentMonthThroughDay >= 1 && source.currentMonthThroughDay <= 28
            ? source.currentMonthThroughDay
            : 14;
        const fallbackStatus = availableStatuses.has(source.fallbackStatus)
            ? source.fallbackStatus
            : "open";
        const positionStatuses = new Map();
        const globalOverrides = new Map();
        const planOverrides = new Map();

        const readPosition = (entry, sourceLabel) => {
            const position = Number(entry?.position);
            const statusKey = String(entry?.status || "").trim();

            if (!Number.isInteger(position) || position < 1) {
                console.warn(`[Order availability] ${sourceLabel}: position は1以上の整数で指定してください。`, entry);
                return null;
            }
            if (!availableStatuses.has(statusKey)) {
                console.warn(`[Order availability] ${sourceLabel}: 未定義の受付状態です。`, entry);
                return null;
            }
            return { position, statusKey };
        };

        (Array.isArray(source.positions) ? source.positions : []).forEach((entry) => {
            const parsed = readPosition(entry, "positions");
            if (!parsed) return;
            if (positionStatuses.has(parsed.position)) {
                console.warn("[Order availability] positions内で同じpositionが重複しています。後の設定を採用します。", parsed.position);
            }
            positionStatuses.set(parsed.position, parsed.statusKey);
        });

        (Array.isArray(source.overrides) ? source.overrides : []).forEach((entry) => {
            const parsed = readPosition(entry, "overrides");
            if (!parsed) return;

            const planId = String(entry?.plan || "").trim();
            if (!planId) {
                globalOverrides.set(parsed.position, parsed.statusKey);
                return;
            }
            if (!PLAN_DATA[planId]) {
                console.warn("[Order availability] overrides: 未定義のplanです。", entry);
                return;
            }
            if (!planOverrides.has(planId)) planOverrides.set(planId, new Map());
            planOverrides.get(planId).set(parsed.position, parsed.statusKey);
        });

        availabilityConfigCache = {
            displayCount,
            currentMonthThroughDay,
            fallbackStatus,
            positionStatuses,
            globalOverrides,
            planOverrides
        };
        return availabilityConfigCache;
    }

    function durationToMonths(value, unit) {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue)) return null;
        return /週/.test(unit) ? numericValue / 4 : numericValue;
    }

    function getPlanLeadTimeRange(planId) {
        const term = String(PLAN_DATA[planId]?.term || "").trim();
        const rangeMatch = term.match(/(\d+(?:\.\d+)?)\s*(週間|週|か月|ヶ月)?\s*(?:〜|～|-|~)\s*(\d+(?:\.\d+)?)\s*(週間|週|か月|ヶ月)/);

        if (rangeMatch) {
            const minUnit = rangeMatch[2] || rangeMatch[4];
            const minMonths = durationToMonths(rangeMatch[1], minUnit);
            const maxMonths = durationToMonths(rangeMatch[3], rangeMatch[4]);
            if (minMonths !== null && maxMonths !== null) {
                return {
                    minMonths: Math.min(minMonths, maxMonths),
                    maxMonths: Math.max(minMonths, maxMonths)
                };
            }
        }

        const values = [...term.matchAll(/(\d+(?:\.\d+)?)\s*(週間|週|か月|ヶ月)/g)]
            .map((match) => durationToMonths(match[1], match[2]))
            .filter((value) => value !== null);

        if (!values.length) return null;
        return {
            minMonths: Math.min(...values),
            maxMonths: Math.max(...values)
        };
    }

    function getPlanAvailabilityWindow(planId, displayCount) {
        const range = getPlanLeadTimeRange(planId);
        return {
            startOffset: range
                ? Math.max(0, Math.floor(range.minMonths + Number.EPSILON))
                : 0,
            displayCount
        };
    }

    function getAvailabilityStatusForPosition(config, planId, position) {
        return config.planOverrides.get(planId)?.get(position)
            || config.globalOverrides.get(position)
            || config.positionStatuses.get(position)
            || config.fallbackStatus;
    }

    function getDisplayedAvailability(planId = "") {
        const config = getAvailabilityConfig();
        const windowConfig = getPlanAvailabilityWindow(planId, config.displayCount);
        const today = getTokyoDateParts();
        const calendarStartOffset = today.day <= config.currentMonthThroughDay ? 0 : 1;
        const calendarStart = shiftYearMonth(today.year, today.month, calendarStartOffset);

        return Array.from({ length: windowConfig.displayCount }, (_, index) => {
            const target = shiftYearMonth(calendarStart.year, calendarStart.month, windowConfig.startOffset + index);
            const position = index + 1;
            return {
                ...target,
                monthKey: toMonthKey(target.year, target.month),
                position,
                statusKey: getAvailabilityStatusForPosition(config, planId, position)
            };
        });
    }

    function renderConditions(planId = "") {
        refs.conditionList.innerHTML = getDisplayedAvailability(planId).map(({ month, statusKey }) => {
            const status = STATUS_DATA[statusKey];

            return `
                <article class="condition-item">
                    <p class="condition-item__month">${month}月中</p>
                    <img class="condition-item__image" src="${status.src}" alt="${status.label}">
                </article>
            `;
        }).join("");
    }

    function renderPlanTabs() {
        refs.planTabs.innerHTML = PLAN_ORDER.map((planId, index) => {
            const plan = PLAN_DATA[planId];
            return `
                <button class="plan-tab" type="button" data-plan="${planId}"
                    style="--plan-color:${plan.color}; --tab-delay:${index * 95}ms;"
                    aria-expanded="false" aria-controls="plan-panel">
                    <span class="plan-tab__mark">【${plan.mark}】</span>
                    <span class="plan-tab__content">
                        <strong class="plan-tab__name">${plan.shortTitle}</strong>
                        <span class="plan-tab__description">${plan.summary}</span>
                    </span>
                </button>
            `;
        }).join("");

        refs.planTabs.addEventListener("pointerdown", (event) => {
            const button = event.target.closest("[data-plan]");
            if (!button) return;
            void preloadPlanCardIcons(button.dataset.plan);
        }, { passive: true });

        refs.planTabs.addEventListener("click", (event) => {
            const button = event.target.closest("[data-plan]");
            if (!button) return;
            selectPlan(button.dataset.plan);
        });

        attachSwipeSelection();
    }

    function attachSwipeSelection() {
        let startY = 0;
        let startX = 0;
        let planId = null;

        refs.planTabs.addEventListener("touchstart", (event) => {
            const button = event.target.closest("[data-plan]");
            if (!button || event.touches.length !== 1) return;
            startY = event.touches[0].clientY;
            startX = event.touches[0].clientX;
            planId = button.dataset.plan;
        }, { passive: true });

        refs.planTabs.addEventListener("touchend", (event) => {
            if (!planId || event.changedTouches.length !== 1) return;
            const endY = event.changedTouches[0].clientY;
            const endX = event.changedTouches[0].clientX;
            const deltaY = endY - startY;
            const deltaX = Math.abs(endX - startX);

            if (deltaY > 42 && deltaX < 54) selectPlan(planId);
            planId = null;
        }, { passive: true });
    }

    function ensurePlanPanelShell() {
        if (refs.planPanel.querySelector("[data-plan-main]")) return;

        refs.planPanel.innerHTML = `
            <div class="plan-panel__surface">
                <span class="plan-panel__line plan-panel__line--top" aria-hidden="true"></span>
                <span class="plan-panel__line plan-panel__line--side" aria-hidden="true"></span>

                <div class="plan-panel__main" data-plan-main></div>

                <aside class="plan-rail" data-plan-rail>
                    <div class="plan-rail__head">
                        <div class="plan-rail__title-stack">
                            <h3 class="plan-rail__title">
                                <strong class="plan-tab__name" data-rail-title></strong>
                            </h3>

                            <div class="plan-rail__meta-list" data-rail-meta-list>
                                <div class="plan-rail__meta">
                                    <span class="plan-rail__meta-label">納期目安</span>
                                    <strong class="plan-rail__meta-value" data-rail-term></strong>
                                </div>

                                <div class="plan-rail__meta">
                                    <span class="plan-rail__meta-label">料金目安</span>
                                    <strong class="plan-rail__meta-value" data-rail-price></strong>
                                </div>
                            </div>

                            <a class="plan-rail__consult" href="#consultation-form" data-consult-plan>
                                制作相談<span>▼</span>
                            </a>
                        </div>

                        <p class="plan-rail__summary">
                            <span class="plan-tab__description" data-rail-summary></span>
                        </p>
                    </div>
                </aside>
            </div>
        `;

        refs.planMain = refs.planPanel.querySelector("[data-plan-main]");
        refs.planRail = refs.planPanel.querySelector("[data-plan-rail]");
        refs.railTitleSlot = refs.planPanel.querySelector("[data-rail-title]");
        refs.railSummarySlot = refs.planPanel.querySelector("[data-rail-summary]");
        refs.railMetaList = refs.planPanel.querySelector("[data-rail-meta-list]");
        refs.railTerm = refs.planPanel.querySelector("[data-rail-term]");
        refs.railPrice = refs.planPanel.querySelector("[data-rail-price]");
        refs.railConsult = refs.planPanel.querySelector("[data-consult-plan]");

        if (typeof ResizeObserver === "function") {
            refs.railResizeObserver?.disconnect();
            refs.railResizeObserver = new ResizeObserver(() => {
                syncPlanPanelRailMinimum(state.activePlan);
            });
            refs.railResizeObserver.observe(refs.railTitleSlot);
            refs.railResizeObserver.observe(refs.railMetaList);
            refs.railResizeObserver.observe(refs.railConsult);
        }
    }

    function animateRailLayout(firstRects, elements) {
        elements.forEach((element) => {
            if (!element || element.hidden) return;

            const first = firstRects.get(element);
            if (!first || first.width === 0 || first.height === 0) return;

            const last = element.getBoundingClientRect();
            if (last.width === 0 || last.height === 0) return;

            const deltaX = first.left - last.left;
            const deltaY = first.top - last.top;

            if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) return;

            element.getAnimations().forEach((animation) => animation.cancel());
            element.animate([
                { transform: `translate(${deltaX}px, ${deltaY}px)` },
                { transform: "translate(0, 0)" }
            ], {
                duration: 440,
                easing: "cubic-bezier(.2, .72, .2, 1)"
            });
        });
    }

    function updatePlanTabsState(planId) {
        refs.planTabs.querySelectorAll("[data-plan]").forEach((button) => {
            const isActive = button.dataset.plan === planId;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-expanded", String(isActive));
        });
        syncDesktopPlanArrows();
    }

    function updatePlanRail(planId, plan) {
        const consultWasVisible = !refs.railConsult.hidden;
        const consultWillBeVisible = planId !== "other";

        /*
         * 制作相談は【他】でdisplay:noneになる。
         * 非表示時の矩形は画面左上の0×0になるため、
         * 非表示をまたぐ切替ではFLIP対象に含めない。
         */
        const movingElements = [
            refs.railTitleSlot,
            refs.railSummarySlot,
            refs.railMetaList,
            consultWasVisible && consultWillBeVisible
                ? refs.railConsult
                : null
        ].filter(Boolean);

        const firstRects = new Map(
            movingElements.map((element) => [
                element,
                element.getBoundingClientRect()
            ])
        );

        refs.railConsult.getAnimations().forEach((animation) => animation.cancel());

        /*
         * レール内のDOMは作り直さず、同じ要素の内容だけを書き換える。
         * プラン名の長さに応じて、metaと制作相談の実配置だけを
         * 旧位置から新位置へ連続的に移動させる。
         */
        refs.planPanel.dataset.plan = planId;
        refs.planPanel.style.setProperty("--plan-color", plan.color);
        refs.planRail.setAttribute("aria-label", `${plan.title}の概要`);
        refs.railTitleSlot.textContent = plan.shortTitle;
        refs.railSummarySlot.textContent = plan.summary;
        refs.railTerm.innerHTML = formatRailValue(plan.term);
        refs.railPrice.innerHTML = formatRailValue(plan.price);
        refs.railConsult.dataset.consultPlan = planId;
        refs.railConsult.hidden = !consultWillBeVisible;

        void refs.planRail.offsetHeight;
        animateRailLayout(firstRects, movingElements);
        syncPlanPanelRailMinimum(planId);
    }

    async function selectPlan(planId) {
        const plan = PLAN_DATA[planId];
        if (!plan) return;

        if (state.planTransitioning) {
            state.pendingPlanId = planId === state.activePlan ? "" : planId;
            return;
        }

        if (state.activePlan === planId) return;

        const previousPlanId = state.activePlan;
        const previousPlan = PLAN_DATA[previousPlanId] || null;
        const token = ++state.switchToken;

        state.pendingPlanId = "";
        state.planTransitioning = true;

        ensurePlanPanelShell();

        state.activePlan = planId;
        state.activeCustom = null;
        state.cardScrollEnabled = false;
        state.customScrollEnabled = false;

        refs.planPanel.hidden = false;

        try {
            refs.planSelector.classList.add("has-selection");
            refs.planSelector.style.setProperty("--active-plan-color", plan.color);
            updatePlanTabsState(planId);
            updatePlanRail(planId, plan);

            updateOptions(planId);
            applyConsultationPlan(planId);

            if (!previousPlan) {
                renderPlanMainImmediate(planId, plan);
                requestAnimationFrame(() => refs.planPanel.classList.add("is-visible"));
            } else if (previousPlan.kind === "cards" && plan.kind === "cards" && refs.planMain.querySelector("[data-cards-plan]")) {
                await transitionCardsPlan(previousPlanId, planId, token);
            } else {
                await transitionPlanMain(planId, plan, token);
            }

            if (token === state.switchToken) {
                activatePlanMain(planId, plan);
            }
        } finally {
            if (token !== state.switchToken) return;

            if (MOBILE_ORDER_MODE) {
                refs.planMain.classList.remove(
                    "is-mobile-card-switching",
                    "is-main-leaving",
                    "is-main-entering"
                );
                refs.planMain.style.removeProperty("opacity");
                refs.planMain.style.removeProperty("transform");
            }
            state.planTransitioning = false;
            requestAnimationFrame(syncDesktopPlanArrows);

            const pendingPlanId = state.pendingPlanId;
            state.pendingPlanId = "";

            if (pendingPlanId && pendingPlanId !== state.activePlan) {
                requestAnimationFrame(() => selectPlan(pendingPlanId));
            }
        }
    }

    function renderPlanMainImmediate(planId, plan) {
        refs.planMain.classList.remove("is-main-leaving", "is-main-entering");
        refs.planMain.innerHTML = createPlanBody(planId, plan);
        hydrateAllCardIcons(plan.color);

        if (plan.kind === "cards") {
            animateFreshCardSet();
        }
    }

    function animateFreshCardSet() {
        const slots = [...refs.planMain.querySelectorAll("[data-card-slot]")];

        slots.forEach((slot, index) => {
            const article = slot.querySelector(".process-card");
            if (!article) return;

            const animation = article.animate([
                { opacity: 0, transform: "translateX(-82%) rotate(-5deg)" },
                { opacity: 1, transform: "translateX(2%) rotate(1deg)", offset: 0.72 },
                { opacity: 1, transform: "translateX(0) rotate(0deg)" }
            ], {
                duration: 620,
                delay: index * 78,
                easing: "cubic-bezier(.18, .78, .28, 1)",
                fill: "both"
            });

            animation.finished
                .catch(() => {})
                .finally(() => animation.cancel());
        });
    }

    async function transitionPlanMain(planId, plan, token) {
        if (MOBILE_ORDER_MODE) {
            refs.planMain.classList.remove(
                "is-mobile-card-switching",
                "is-main-leaving",
                "is-main-entering"
            );
            if (token !== state.switchToken) return;
            refs.planMain.style.removeProperty("min-height");
            refs.planMain.style.removeProperty("opacity");
            refs.planMain.style.removeProperty("transform");
            refs.planPanel.querySelector(".plan-panel__surface")?.style.removeProperty("min-height");
            refs.planMain.innerHTML = createPlanBody(planId, plan);
            hydrateAllCardIcons(plan.color);
            return;
        }

        /*
         * 他プランから【改】へ入る時は、プランカラーの連続変化だけを使う。
         * plan-mainの左右スライドは重ねない。
         */
        if (planId === "custom") {
            refs.planMain.classList.remove("is-main-leaving", "is-main-entering");
            refs.planMain.style.minHeight = "";
            refs.planPanel.querySelector(".plan-panel__surface")?.style.removeProperty("min-height");
            refs.planMain.innerHTML = createPlanBody(planId, plan);
            hydrateAllCardIcons(plan.color);
            return;
        }

        const oldHeight = refs.planMain.getBoundingClientRect().height;
        refs.planMain.style.minHeight = `${oldHeight}px`;
        refs.planMain.classList.add("is-main-leaving");

        await wait(260);
        if (token !== state.switchToken) return;

        refs.planMain.innerHTML = createPlanBody(planId, plan);
        refs.planMain.classList.remove("is-main-leaving");
        refs.planMain.classList.add("is-main-entering");
        refs.planMain.style.minHeight = "";
        hydrateAllCardIcons(plan.color);

        await wait(540);
        refs.planMain.classList.remove("is-main-entering");
    }

    function createPlanBody(planId, plan) {
        if (plan.kind === "cards") return createCardsBody(planId, plan);
        if (plan.kind === "custom") return createCustomBody();
        return createOtherBody();
    }

    function createPlanIncludes(plan) {
        const includedItems = plan.cards.map((cardKey, index) => ({
            number: getCardNumber(CARD_DATA[cardKey], index),
            name: CARD_DATA[cardKey].name
        }));

        const flowItems = includedItems.slice(0, 3);
        const extraItems = includedItems.slice(3);
        const flow = flowItems.map((item, index) => `
            <span class="plan-includes__item">${item.number} ${item.name}</span>
            ${index < flowItems.length - 1 ? '<span class="plan-includes__arrow" aria-hidden="true">▶</span>' : ''}
        `).join("");

        return `
            <p class="plan-includes__flow">${flow}</p>
            ${extraItems.length ? `
                <ul class="plan-includes__extra">
                    ${extraItems.map((item) => `<li>${item.number} ${item.name}</li>`).join("")}
                </ul>
            ` : ""}
        `;
    }

    function createCardsBody(planId, plan) {
        return `
            <div class="cards-plan" data-cards-plan>
                <div class="plan-includes">
                    <div class="plan-includes__inner" data-plan-includes>
                        ${createPlanIncludes(plan)}
                    </div>
                </div>

                <div class="process-stack" data-process-stack>
                    ${plan.cards.map((cardKey, index) => createCardSlot(CARD_DATA[cardKey], index, planId, false)).join("")}
                </div>
            </div>
        `;
    }

    function getConnectorType(card, hasNext) {
        if (!hasNext) return "";
        return card.key === "rig" || card.phase >= 3 ? "plus" : "arrow";
    }

    function createConnector(card, hasNext) {
        const type = getConnectorType(card, hasNext);
        if (!type) return '<div class="card-connector" aria-hidden="true"></div>';
        return `<div class="card-connector card-connector--${type}" aria-hidden="true">${type === "plus" ? "+" : "▼"}</div>`;
    }

    function createCardSlot(card, index, planId, isInitial = false) {
        const fixedExpanded = planId === "one" || planId === "two";
        const cardClass = fixedExpanded ? "process-card is-expanded is-fixed-expanded" : "process-card";
        const delay = `${index * 78}ms`;

        return `
            <div class="process-card-slot${isInitial ? " is-added-entering" : ""}"
                data-card-slot="${card.key}" style="--card-delay:${delay};">
                <article class="${cardClass}"
                    data-card-key="${card.key}"
                    data-card-family="${card.family}"
                    tabindex="0">
                    ${createProcessCardInner(card, index, planId)}
                </article>
                ${createConnector(card, true)}
            </div>
        `;
    }

    function createProcessCardInner(card, index, planId) {
        const number = getCardNumber(card, index);

        const iconPath = getCardIconMaskPath(card);

        return `
            <span class="process-card__edge" aria-hidden="true"></span>

            <div class="process-card__body">
                <div class="process-card__icon-box" aria-hidden="true">
                    <span class="process-card__icon-image" style="-webkit-mask-image:url('${iconPath}');mask-image:url('${iconPath}');"></span>
                </div>

                <div class="process-card__content">
                    <p class="process-card__flavor">${card.flavor}</p>

                    <header class="process-card__heading">
                        <span class="process-card__number">${number}</span>
                        <h3 class="process-card__name">${card.name}</h3>
                        <button class="process-card__detail" type="button" data-open-detail="${card.key}">詳細》</button>
                    </header>

                    <p class="process-card__summary">${card.summary.replace(/\n/g, "<br>")}</p>
                </div>
            </div>
        `;
    }

    function updateCardSlot(slot, card, index, planId) {
        const article = slot.querySelector(".process-card");
        const wasExpanded = article.classList.contains("is-expanded");

        slot.dataset.cardSlot = card.key;
        slot.style.setProperty("--card-delay", `${index * 78}ms`);
        article.dataset.cardKey = card.key;
        article.dataset.cardFamily = card.family;
        article.innerHTML = createProcessCardInner(card, index, planId);
        article.className = "process-card";

        if (wasExpanded) article.classList.add("is-expanded");
        if (planId === "one" || planId === "two") {
            article.classList.add("is-expanded", "is-fixed-expanded");
        }
    }

    function updateCardNumbersAndConnectors(planId, plan) {
        const slots = [...refs.planMain.querySelectorAll("[data-card-slot]")];

        slots.forEach((slot, index) => {
            const card = CARD_DATA[plan.cards[index]];
            const article = slot.querySelector(".process-card");
            const number = article.querySelector(".process-card__number");
            const detail = article.querySelector("[data-open-detail]");
            const connector = slot.querySelector(".card-connector");
            const type = getConnectorType(card, index < slots.length - 1);

            if (number) number.textContent = getCardNumber(card, index);
            if (detail) detail.dataset.openDetail = card.key;
            if (connector) {
                connector.className = `card-connector${type ? ` card-connector--${type}` : ""}`;
                connector.textContent = type === "plus" ? "+" : type === "arrow" ? "▼" : "";
            }
        });

        applyExpansionPolicy(planId);
    }

    function applyExpansionPolicy(planId) {
        const cards = [...refs.planMain.querySelectorAll(".process-card")];

        if (planId === "one" || planId === "two") {
            cards.forEach((card) => card.classList.add("is-expanded", "is-fixed-expanded"));
            return;
        }

        cards.forEach((card) => card.classList.remove("is-fixed-expanded"));
        const expanded = cards.filter((card) => card.classList.contains("is-expanded"));
        const preferred = cards.find((card) => card.dataset.cardKey === state.expandedCardKey);
        const keep = preferred || expanded[0] || null;
        cards.forEach((card) => card.classList.toggle("is-expanded", card === keep));
    }

    async function transitionCardsPlan(fromPlanId, toPlanId, token) {
        const fromPlan = PLAN_DATA[fromPlanId];
        const toPlan = PLAN_DATA[toPlanId];
        const cardsPlan = refs.planMain.querySelector("[data-cards-plan]");
        const stack = refs.planMain.querySelector("[data-process-stack]");
        const includes = refs.planMain.querySelector("[data-plan-includes]");

        const moveDuration = fromPlanId === "two" && toPlanId === "one"
            ? 900
            : 520;
        const panelHeightDuration = 160;

        /*
        * 【参】→【弐】では、不要カードの退場を先に見せず、
        * 残存カードの位置移動だけを一続きに見せる
        */
        const skipRemovalStage =
            fromPlanId === "three" &&
            toPlanId === "two";

        if (!cardsPlan || !stack || !includes) {
            renderPlanMainImmediate(toPlanId, toPlan);
            return;
        }

        cardsPlan.classList.add("is-reflowing");

        const oldHeight = stack.getBoundingClientRect().height;
        stack.style.height = `${oldHeight}px`;
        stack.style.transitionDuration = `${panelHeightDuration}ms`;

        const oldSlots = new Map(
            [...stack.querySelectorAll("[data-card-slot]")].map((slot) => [
                slot.dataset.cardSlot,
                slot
            ])
        );

        const usedOldKeys = new Set();

        const targetEntries = toPlan.cards.map((targetKey, index) => {
            if (oldSlots.has(targetKey)) {
                usedOldKeys.add(targetKey);

                return {
                    targetKey,
                    index,
                    sourceKey: targetKey,
                    slot: oldSlots.get(targetKey),
                    upgrade: false,
                    added: false
                };
            }

            const sourceKey = [...oldSlots.keys()].find((key) => {
                return !usedOldKeys.has(key) &&
                    CARD_UPGRADE_MAP[key] === targetKey;
            });

            if (sourceKey) {
                usedOldKeys.add(sourceKey);

                return {
                    targetKey,
                    index,
                    sourceKey,
                    slot: oldSlots.get(sourceKey),
                    upgrade: true,
                    added: false
                };
            }

            return {
                targetKey,
                index,
                sourceKey: "",
                slot: null,
                upgrade: false,
                added: true
            };
        });

        const retainedSlots = targetEntries
            .filter((entry) => !entry.added)
            .map((entry) => entry.slot);

        const firstRects = new Map(
            retainedSlots.map((slot) => [
                slot,
                slot.getBoundingClientRect()
            ])
        );

        const removed = [...oldSlots.entries()]
            .filter(([key]) => !usedOldKeys.has(key))
            .map(([, slot]) => slot);

        const removalAnimations = removed.map((slot, index) => {
            slot.classList.add("is-removing");

            /*
            * 【参】→【弐】のみ、不要カードを即座に非表示にする。
            * この後の既存処理でDOMから削除されるため残留しない。
            */
            if (skipRemovalStage) {
                slot.style.opacity = "0";
                return Promise.resolve();
            }

            return slot.animate([
                {
                    opacity: 1,
                    transform: "translateX(0) rotate(0deg)"
                },
                {
                    opacity: 0,
                    transform: "translateX(118%) rotate(8deg)"
                }
            ], {
                duration: 300,
                delay: index * 28,
                easing: "cubic-bezier(.45, 0, .75, .35)",
                fill: "forwards"
            }).finished.catch(() => {});
        });

        const upgradeAnimations = targetEntries
            .filter((entry) => entry.upgrade)
            .map(async (entry) => {
                const article = entry.slot.querySelector(".process-card");

                article.classList.add("is-flip-out");

                await wait(230);

                if (token !== state.switchToken) return;

                updateCardSlot(
                    entry.slot,
                    CARD_DATA[entry.targetKey],
                    entry.index,
                    toPlanId
                );

                const nextArticle = entry.slot.querySelector(".process-card");

                nextArticle.classList.add("is-flip-in");

                await wait(370);

                nextArticle.classList.remove("is-flip-in");
            });

        await Promise.all([
            ...removalAnimations,
            ...upgradeAnimations
        ]);

        if (token !== state.switchToken) return;

        removed.forEach((slot) => slot.remove());

        const fragment = document.createDocumentFragment();
        const addedSlots = [];

        targetEntries.forEach((entry) => {
            let slot = entry.slot;

            if (!slot) {
                const holder = document.createElement("div");

                holder.innerHTML = createCardSlot(
                    CARD_DATA[entry.targetKey],
                    entry.index,
                    toPlanId,
                    false
                ).trim();

                slot = holder.firstElementChild;
                slot.classList.add("is-added-placeholder");
                addedSlots.push(slot);
            } else if (!entry.upgrade) {
                slot.style.setProperty(
                    "--card-delay",
                    `${entry.index * 78}ms`
                );
            }

            fragment.append(slot);
        });

        stack.replaceChildren(fragment);

        includes.innerHTML = createPlanIncludes(toPlan);

        updateCardNumbersAndConnectors(toPlanId, toPlan);
        hydrateAllCardIcons(toPlan.color);

        stack.style.height = "auto";

        const newHeight = stack.getBoundingClientRect().height;

        stack.style.height = `${oldHeight}px`;

        void stack.offsetHeight;

        stack.style.height = `${newHeight}px`;

        const moveAnimations = retainedSlots.map((slot) => {
            const first = firstRects.get(slot);
            const last = slot.getBoundingClientRect();

            if (!first) return Promise.resolve();

            const dx = first.left - last.left;
            const dy = first.top - last.top;

            if (!dx && !dy) return Promise.resolve();

            const animation = slot.animate([
                {
                    transform: `translate(${dx}px, ${dy}px)`
                },
                {
                    transform: "translate(0, 0)"
                }
            ], {
                duration: moveDuration,
                easing: "cubic-bezier(.2, .72, .2, 1)",
                fill: "both"
            });

            return animation.finished
                .catch(() => {})
                .finally(() => animation.cancel());
        });

        await Promise.all([
            ...moveAnimations,
            wait(moveDuration)
        ]);

        if (token !== state.switchToken) return;

        stack.style.height = "";
        stack.style.transitionDuration = "";

        addedSlots.forEach((slot) => {
            slot.classList.remove("is-added-placeholder");
            slot.classList.add("is-added-entering");
        });

        await wait(680);

        addedSlots.forEach((slot) => {
            slot.classList.remove("is-added-entering");
        });

        cardsPlan.classList.remove("is-reflowing");
    }

    function hydrateAllCardIcons() {
        /* 色付き画像は事前生成済み。表示時のCanvas変換は行わない。 */
    }

    function getLayoutBottomWithin(element, ancestor) {
        let current = element;
        let bottom = element.offsetHeight;

        while (current && current !== ancestor) {
            bottom += current.offsetTop;
            current = current.offsetParent;
        }

        if (current === ancestor) return bottom;

        const ancestorRect = ancestor.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        return elementRect.bottom - ancestorRect.top;
    }

    function syncPlanPanelRailMinimum(planId = state.activePlan) {
        const surface = refs.planPanel?.querySelector(".plan-panel__surface");
        if (!surface || !refs.planMain || !planId) return;

        /*
         * 本文側は通常フローの実高でsurfaceを押し広げる。
         * JSが管理するのは、絶対配置された右レールの最低必要高だけ。
         */
        if (planId === "custom") {
            surface.style.removeProperty("min-height");
            return;
        }

        const railEndElement = planId === "other"
            ? refs.railPrice
            : refs.railConsult;

        if (!railEndElement || railEndElement.hidden || railEndElement.offsetHeight === 0) {
            surface.style.removeProperty("min-height");
            return;
        }

        const gapValue = getComputedStyle(refs.planPanel)
            .getPropertyValue("--panel-content-bottom-gap");
        const gapCqw = Number.parseFloat(gapValue) || 4;
        const containerWidth =
            refs.planPanel.closest(".order-page")
                ?.getBoundingClientRect().width ||
            refs.planPanel.getBoundingClientRect().width;
        const gapPx = containerWidth * gapCqw / 100;

        /*
         * getBoundingClientRect()はレールのFLIP transformを含むため、
         * アニメーション終了後に値が変わり、下端だけ最後に動いていた。
         * offset系で最終レイアウト位置を読み、切替開始時に高さを確定する。
         */
        const railRequiredHeight = Math.ceil(
            getLayoutBottomWithin(railEndElement, surface) + gapPx
        );

        surface.style.minHeight = `${Math.max(0, railRequiredHeight)}px`;
    }

    function adjacentPlanId(direction) {
        const currentIndex = PLAN_ORDER.indexOf(state.activePlan);
        if (currentIndex < 0) return "";
        const nextIndex = currentIndex + direction;
        if (nextIndex < 0 || nextIndex >= PLAN_ORDER.length) return "";
        return PLAN_ORDER[nextIndex];
    }

    function syncDesktopPlanArrows() {
        if (!refs.desktopPlanPrev || !refs.desktopPlanNext) return;

        const hasPlan = Boolean(state.activePlan && !refs.planPanel.hidden);
        const rect = refs.planPanel.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
        const inView = hasPlan
            && rect.bottom > viewportHeight * 0.15
            && rect.top < viewportHeight * 0.85;

        refs.desktopPlanPrev.hidden = !inView;
        refs.desktopPlanNext.hidden = !inView;
        refs.desktopPlanPrev.disabled = !adjacentPlanId(-1);
        refs.desktopPlanNext.disabled = !adjacentPlanId(1);
    }

    function ensureDesktopPlanArrows() {
        if (refs.desktopPlanPrev || refs.desktopPlanNext) return;

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

        refs.desktopPlanPrev = createArrow("prev", "前のプラン", "◀");
        refs.desktopPlanNext = createArrow("next", "次のプラン", "▶");
        refs.desktopPlanPrev.addEventListener("click", () => {
            const next = adjacentPlanId(-1);
            if (next) selectPlan(next);
        });
        refs.desktopPlanNext.addEventListener("click", () => {
            const next = adjacentPlanId(1);
            if (next) selectPlan(next);
        });

        if (typeof ResizeObserver === "function") {
            refs.desktopPlanResizeObserver = new ResizeObserver(syncDesktopPlanArrows);
            refs.desktopPlanResizeObserver.observe(refs.planPanel);
        }
        syncDesktopPlanArrows();
    }

    function attachPlanPanelSwipe() {
        let startX = 0;
        let startY = 0;
        let pointerId = null;

        refs.planPanel.addEventListener("pointerdown", (event) => {
            if (!state.activePlan || !event.isPrimary) return;
            if (event.pointerType === "mouse" && event.button !== 0) return;

            const target = event.target;
            if (target.closest("button, a, input, select, textarea, video, dialog")) {
                pointerId = null;
                return;
            }

            if (event.pointerType === "mouse") event.preventDefault();
            pointerId = event.pointerId;
            startX = event.clientX;
            startY = event.clientY;
            refs.planPanel.setPointerCapture?.(event.pointerId);
        });

        refs.planPanel.addEventListener("pointerup", (event) => {
            if (pointerId !== event.pointerId) return;

            const deltaX = event.clientX - startX;
            const deltaY = event.clientY - startY;
            const absX = Math.abs(deltaX);
            const absY = Math.abs(deltaY);
            pointerId = null;

            if (refs.planPanel.hasPointerCapture?.(event.pointerId)) {
                try { refs.planPanel.releasePointerCapture(event.pointerId); } catch (_) { /* no-op */ }
            }

            if (absX < 56 || absX <= absY * 1.25) return;

            const next = adjacentPlanId(deltaX < 0 ? 1 : -1);
            if (next) selectPlan(next);
        });

        refs.planPanel.addEventListener("pointercancel", (event) => {
            if (pointerId === event.pointerId) pointerId = null;
        });

        refs.planPanel.addEventListener("dragstart", (event) => {
            event.preventDefault();
        });
    }

    function activatePlanMain(planId, plan) {
        if (plan.kind === "custom") {
            bindCustomEvents();
        }
        hydrateAllCardIcons(plan.color);
        syncPlanPanelRailMinimum(planId);
    }

    function createCustomBody() {
        return `
            <div class="custom-stage" data-custom-stage>
                <div class="custom-stage__shape custom-stage__shape--white" aria-hidden="true"></div>
                <div class="custom-stage__shape custom-stage__shape--cyan" aria-hidden="true"></div>

                <div class="custom-flavor" aria-label="今の自分がいちばん好き。だからこそ、もっと自分らしく。">
                    <span class="custom-flavor__now">今</span>
                    <span class="custom-flavor__line">の自分がいちばん</span>
                    <span class="custom-flavor__favorite">好き。</span>
                    <span class="custom-flavor__because">だからこそ</span>
                    <span class="custom-flavor__more">もっと</span>
                    <span class="custom-flavor__self"><span class="custom-flavor__self-accent">自</span><span class="custom-flavor__self-base">分</span><span class="custom-flavor__self-small">らしく</span><span class="custom-flavor__self-base">。</span></span>
                </div>

                <div class="custom-orbit" aria-label="カスタム部位">
                    ${CUSTOM_KEYS.map((key) => `
                        <button class="custom-orbit__item" type="button" data-custom-key="${key}" aria-pressed="false">
                            <img src="${CUSTOM_DATA[key].icon}" alt="${CUSTOM_DATA[key].label}">
                        </button>
                    `).join("")}
                </div>

                <p class="custom-current-name" data-custom-name></p>

                <div class="custom-media-clip" aria-hidden="true">
                    <img class="custom-model custom-model--shadow" src="${resolveAsset("images/order/custom/model-shadow.webp")}" alt="">
                    <img class="custom-model custom-model--front" src="${resolveAsset("images/order/custom/model.webp")}" alt="">
                </div>

                <div class="custom-content">
                    <div class="custom-video" data-custom-video-wrap>
                        <video class="custom-video__player" data-custom-video controls muted playsinline webkit-playsinline preload="auto"></video>
                        <div class="custom-video__loading" data-custom-video-loading aria-hidden="true">LOADING</div>
                    </div>

                    <div class="custom-menu" data-custom-menu>
                        <div class="custom-menu__empty">スクロールすると目元カスタムを表示します。</div>
                    </div>

                    <a class="custom-consult-button" href="#consultation-form">
                        <span>制作相談へ</span>
                    </a>
                </div>
            </div>
        `;
    }

    function createOtherBody() {
        return `
            <div class="other-plan">
                <p class="other-plan__lead">掲載外の制作内容や、<br>組み合わせのご依頼は<br>こちらからご相談ください。</p>
                <p>ロゴ、キービジュアル、一枚絵、<br>サムネイル、MVイラストなどの<br>単体制作は、現在一般募集<br>しておりません。</p>
                <p>既存のご縁がある方、または<br>内容に強く惹かれた場合のみ、<br>個別にご相談を承ります。</p>
                <a class="other-plan__button" href="#consultation-form">▼制作相談へ</a>
            </div>
        `;
    }

    function handlePlanPanelClick(event) {
        const consultLink = event.target.closest('a[href="#consultation-form"]');
        if (consultLink) {
            const planId = consultLink.dataset.consultPlan || state.activePlan;
            refs.consultationSection.dataset.plan = planId;
            applyConsultationPlan(planId);
            showFormStep(1, { skipScroll: true });
            return;
        }

        const detailButton = event.target.closest("[data-open-detail]");
        if (detailButton) {
            event.stopPropagation();
            state.detailPointerOpened = event.detail !== 0;
            state.detailReturnCard = detailButton.closest(".process-card");
            openDetail(detailButton.dataset.openDetail);
            return;
        }

        const customButton = event.target.closest("[data-custom-key]");
        if (customButton) {
            selectCustom(customButton.dataset.customKey, true);
            return;
        }

        const card = event.target.closest(".process-card");
        if (!card || PLAN_DATA[state.activePlan]?.kind !== "cards") return;
        if (state.activePlan === "one" || state.activePlan === "two") return;
        state.cardScrollEnabled = true;
        expandCard(card, true);
    }

    function handlePlanPanelKeydown(event) {
        if (event.key !== "Enter" && event.key !== " ") return;
        if (event.target.closest("button, a")) return;

        const card = event.target.closest(".process-card");
        if (!card || PLAN_DATA[state.activePlan]?.kind !== "cards") return;
        if (state.activePlan === "one" || state.activePlan === "two") return;
        event.preventDefault();
        state.cardScrollEnabled = true;
        expandCard(card, true);
    }

    function expandCard(targetCard, shouldCenter) {
        if (state.activePlan === "one" || state.activePlan === "two") return;

        const cards = refs.planPanel.querySelectorAll(".process-card");
        cards.forEach((card) => card.classList.toggle("is-expanded", card === targetCard));
        state.expandedCardKey = targetCard.dataset.cardKey || "";

        if (shouldCenter) {
            /*
             * タップ/キー操作で中央寄せする間は、scrollイベント側の
             * 最近傍カード判定を止める。実際の手動スクロールが始まれば
             * wheel/touchmoveで再び有効になる。
             */
            state.cardScrollEnabled = false;
            requestAnimationFrame(() => {
                targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
            });
        }

    }

    function updateNearestCard() {
        if (state.activePlan === "one" || state.activePlan === "two") return;
        if (!state.cardScrollEnabled || !refs.planPanel || refs.planPanel.hidden || state.planTransitioning) return;

        const cards = [...refs.planPanel.querySelectorAll(".process-card")];
        if (!cards.length) return;

        const viewportCenter = window.innerHeight / 2;
        let nearest = null;
        let nearestDistance = Infinity;

        cards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;
            const cardCenter = rect.top + rect.height / 2;
            const distance = Math.abs(viewportCenter - cardCenter);
            if (distance < nearestDistance) {
                nearest = card;
                nearestDistance = distance;
            }
        });

        if (nearest) expandCard(nearest, false);
    }

    function bindCustomEvents() {
        const stage = refs.planPanel.querySelector("[data-custom-stage]");
        if (!stage) return;

        setupCustomVideo(stage);
        updateCustomParallax();
    }

    function selectCustom(key, shouldPlayVideo) {
        if (!CUSTOM_DATA[key] || state.activePlan !== "custom") return;

        state.activeCustom = key;
        const stage = refs.planPanel.querySelector("[data-custom-stage]");
        if (!stage) return;

        stage.classList.add("is-active");
        stage.dataset.custom = key;

        const activeIndex = CUSTOM_KEYS.indexOf(key);
        stage.querySelectorAll("[data-custom-key]").forEach((button, index) => {
            const relative = (index - activeIndex + CUSTOM_KEYS.length) % CUSTOM_KEYS.length;
            // 選択中は円軌道の中央上部（12時方向）へ配置する。
            const angle = relative * 120;
            const isActive = button.dataset.customKey === key;
            button.style.setProperty("--orbit-angle", `${angle}deg`);
            button.style.setProperty("--orbit-counter-angle", `${-angle}deg`);
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        stage.querySelector("[data-custom-name]").textContent = CUSTOM_DATA[key].label;
        renderCustomMenu(key);

        const video = stage.querySelector("[data-custom-video]");
        if (shouldPlayVideo && video) {
            seekCustomVideo(video, key, true);
        }
    }

    function renderCustomMenu(key) {
        const data = CUSTOM_DATA[key];
        const menu = refs.planPanel.querySelector("[data-custom-menu]");
        if (!menu) return;

        menu.classList.remove("is-changing");
        void menu.offsetWidth;
        menu.classList.add("is-changing");
        menu.innerHTML = `
            <h3>${data.label}</h3>
            <div class="custom-menu__rows">
                ${data.rows.map(([name, price, description]) => `
                    <article class="custom-menu__row">
                        <div class="custom-menu__row-head">
                            <strong>${name}</strong>
                            <span>${price}</span>
                        </div>
                        <p>${description.split("\n").join("<br>")}</p>
                    </article>
                `).join("")}
            </div>
        `;
    }

    function setCustomVideoLoading(stage, loading) {
        if (!stage) return;
        stage.classList.toggle("is-video-seeking", Boolean(loading));
        const indicator = stage.querySelector("[data-custom-video-loading]");
        if (indicator) indicator.hidden = !loading;
    }

    function seekCustomVideo(video, key, shouldPlay = false) {
        const section = CUSTOM_VIDEO_SECTIONS[key];
        const stage = video?.closest("[data-custom-stage]");
        if (!video || !section || !stage) return;

        state.pendingCustomVideoKey = key;
        state.pendingCustomVideoShouldPlay = Boolean(shouldPlay);
        const token = ++state.customVideoSeekToken;
        setCustomVideoLoading(stage, true);

        const apply = () => {
            if (token !== state.customVideoSeekToken) return;
            state.pendingCustomVideoKey = "";
            state.pendingCustomVideoShouldPlay = false;
            const wasPlaying = !video.paused && !video.ended;
            try {
                video.currentTime = section.start;
            } catch (_) {
                state.pendingCustomVideoKey = key;
                state.pendingCustomVideoShouldPlay = Boolean(shouldPlay);
                return;
            }
            if (shouldPlay || wasPlaying) video.play().catch(() => {});
        };

        if (video.readyState >= HTMLMediaElement.HAVE_METADATA) apply();
        else video.addEventListener("loadedmetadata", apply, { once: true });
    }

    function setupCustomVideo(stage) {
        const video = stage.querySelector("[data-custom-video]");
        if (!video || !CUSTOM_VIDEO_SOURCE) return;

        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");
        video.preload = "auto";

        const syncSectionFromTime = () => {
            if (video.seeking) return;
            const time = video.currentTime;
            const sectionKey = CUSTOM_KEYS.find((key) => {
                const section = CUSTOM_VIDEO_SECTIONS[key];
                return time >= section.start && time < section.end;
            }) || CUSTOM_KEYS[CUSTOM_KEYS.length - 1];

            if (sectionKey && sectionKey !== state.activeCustom) selectCustom(sectionKey, false);
        };

        const syncAspectRatio = () => {
            if (!video.videoWidth || !video.videoHeight) return;
            stage.style.setProperty("--custom-video-aspect", `${video.videoWidth} / ${video.videoHeight}`);
        };

        const preparePlayback = () => {
            state.customVideoReady = true;
            syncAspectRatio();
            const pendingKey = state.pendingCustomVideoKey;
            if (pendingKey) {
                seekCustomVideo(video, pendingKey, state.pendingCustomVideoShouldPlay);
            } else if (state.activeCustom === "eye" && video.currentTime >= CUSTOM_VIDEO_SECTIONS.mouth.start) {
                video.currentTime = 0;
            }
        };

        video.src = CUSTOM_VIDEO_SOURCE;
        video.load();

        video.addEventListener("loadedmetadata", preparePlayback, { once: true });
        video.addEventListener("loadeddata", syncAspectRatio);
        video.addEventListener("seeking", () => setCustomVideoLoading(stage, true));
        video.addEventListener("seeked", () => {
            setCustomVideoLoading(stage, false);
            syncSectionFromTime();
        });
        video.addEventListener("canplay", () => {
            setCustomVideoLoading(stage, false);
        });
        video.addEventListener("timeupdate", syncSectionFromTime);
        video.addEventListener("error", () => setCustomVideoLoading(stage, false));
    }

    function updateCustomParallax() {
        if (state.activePlan !== "custom") return;

        const stage = refs.planPanel.querySelector("[data-custom-stage]");
        if (!stage) return;

        const rect = stage.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const stageCenter = rect.top + rect.height / 2;
        const range = Math.max(window.innerHeight, rect.height * 0.7);
        const progress = Math.max(-1, Math.min(1, (viewportCenter - stageCenter) / range));

        stage.style.setProperty("--custom-scroll", progress.toFixed(4));

        /* 人物本体と影だけをわずかにずらす。背景面の形はカンプ位置で固定する */
        stage.style.setProperty("--custom-shadow-x", `${(6 + progress * 12).toFixed(2)}px`);
        stage.style.setProperty("--custom-front-x", `${(progress * 8).toFixed(2)}px`);

        /*
         * 自動選択は、実際のwheel/touchmove後に円軌道の表示位置で判定する。
         * プランを開いただけでは動画を開始せず、スクロールで発火位置へ
         * 到達した時だけ目元を選択して再生する。
         */
        if (!state.activeCustom && state.customScrollEnabled) {
            const orbit = stage.querySelector(".custom-orbit");
            const triggerRect = orbit?.getBoundingClientRect() || rect;
            const activationLine = window.innerHeight * 0.48;

            if (
                triggerRect.top <= activationLine &&
                triggerRect.bottom >= 0
            ) {
                selectCustom("eye", true);
            }
        }
    }

    function openDetail(cardKey) {
        const card = CARD_DATA[cardKey];
        if (!card) return;

        const visibleCards = [...refs.planPanel.querySelectorAll(".process-card")];
        const index = visibleCards.findIndex((element) => element.dataset.cardKey === cardKey);
        const number = index >= 0 ? getCardNumber(card, index) : "";

        refs.dialogTitle.textContent = `${number} ${card.name}`;
        const commonDetail = DETAIL_DATA[card.family] || "";
        const planDetail = PLAN_DETAIL_DATA[state.activePlan]?.[card.family] || "";
        refs.dialogBody.innerHTML = commonDetail + planDetail;
        refs.dialog.style.setProperty("--plan-color", PLAN_DATA[state.activePlan]?.color || "#000");
        refs.dialog.showModal();
        document.body.classList.add("is-dialog-open");
    }

    function closeDetail() {
        if (refs.dialog.open) refs.dialog.close();
        document.body.classList.remove("is-dialog-open");
    }

    function renderOptions() {
        refs.optionsList.innerHTML = OPTION_DATA.map((option, index) => `
            <div class="option-row" data-option-index="${index}">
                <span class="option-row__label">${option.label}</span>
                <span class="option-row__price">${option.price}</span>
            </div>
        `).join("");
    }

    function updateOptions(planId) {
        refs.optionsList.querySelectorAll("[data-option-index]").forEach((row) => {
            const option = OPTION_DATA[Number(row.dataset.optionIndex)];
            const hidden = Boolean(planId && option.hideFor?.includes(planId));
            row.hidden = hidden;
        });
    }

    function renderDeadlineChoices(planId = "") {
        const previousValue = refs.deadlineList.querySelector('input[name="希望納期"]:checked')?.value || "";
        const months = getDisplayedAvailability(planId);
        const lastMonth = months[months.length - 1];
        const afterMonth = shiftYearMonth(lastMonth.year, lastMonth.month, 1);
        const afterLabel = `${afterMonth.month}月以降`;
        const afterValue = `${toMonthKey(afterMonth.year, afterMonth.month)}以降`;

        refs.deadlineList.innerHTML = months.map(({ statusKey, year, month }) => {
            const status = STATUS_DATA[statusKey];
            const value = toMonthKey(year, month);
            return `
                <label class="deadline-choice">
                    <input type="radio" name="希望納期" value="${value}" data-availability-status="${statusKey}" required>
                    <span class="deadline-choice__body">
                        <span class="condition-item__month">${month}月中</span>
                        <img class="condition-item__image" src="${status.src}" alt="${status.label}">
                    </span>
                </label>
            `;
        }).join("") + `
            <label class="deadline-choice deadline-choice--after">
                <input type="radio" name="希望納期" value="${afterValue}">
                <span>${afterLabel}</span>
            </label>
        `;

        if (previousValue) {
            const previousChoice = [...refs.deadlineList.querySelectorAll('input[name="希望納期"]')]
                .find((input) => input.value === previousValue);
            if (previousChoice) previousChoice.checked = true;
        }
    }

    function isOptionVisible(option, planId) {
        if (option.showFor && !option.showFor.includes(planId)) return false;
        if (option.hideFor?.includes(planId)) return false;
        return true;
    }

    function renderCustomSelections() {
        refs.customSelectionList.innerHTML = CUSTOM_KEYS.map((key) => {
            const data = CUSTOM_DATA[key];
            return `
                <section class="custom-selection-group" aria-labelledby="custom-selection-${key}">
                    <h4 id="custom-selection-${key}" class="custom-selection-group__title">${data.label}</h4>
                    <div class="choice-list custom-selection-group__choices">
                        ${data.rows.map(([name, price]) => `
                            <label class="choice-label custom-selection-choice">
                                <input type="checkbox" name="希望カスタム" value="${data.label}｜${name}｜${price}">
                                <span class="custom-selection-choice__body">
                                    <span class="custom-selection-choice__name">${name}</span>
                                    <span class="custom-selection-choice__price">${price}</span>
                                </span>
                            </label>
                        `).join("")}
                    </div>
                </section>
            `;
        }).join("");
    }

    function renderConsultationOptions(planId) {
        const checked = new Set(
            [...refs.consultationOptions.querySelectorAll('input:checked')].map((input) => input.value)
        );

        refs.consultationOptions.innerHTML = CONSULTATION_OPTION_DATA
            .filter((option) => isOptionVisible(option, planId))
            .map((option) => `
                <label class="choice-label" data-consultation-option="${option.key}">
                    <input type="checkbox" name="追加オプション" value="${option.label}" data-option-key="${option.key}"${checked.has(option.label) ? " checked" : ""}>
                    <span>${option.label}</span>
                </label>
            `).join("");
    }

    function syncForcedConsultationOptions() {
        const artAdjustment = refs.consultationOptions.querySelector('input[data-option-key="art-adjustment"]');
        if (!artAdjustment) {
            state.artAdjustmentAutoSelected = false;
            return;
        }

        const forced = refs.consultationPlan.value === "one" && getCheckedValue("現在のモデル状態") === "unseparated";
        const labelText = artAdjustment.closest("label")?.querySelector("span");

        if (forced) {
            if (!artAdjustment.checked) {
                artAdjustment.checked = true;
                state.artAdjustmentAutoSelected = true;
            }
        } else if (state.artAdjustmentAutoSelected) {
            artAdjustment.checked = false;
            state.artAdjustmentAutoSelected = false;
        }

        artAdjustment.dataset.forced = forced ? "true" : "false";
        if (labelText) labelText.textContent = forced ? "原画調整（未分け原画のため必須）" : "原画調整";
    }

    function getAllowedModelStates(planId) {
        if (planId === "custom") return new Set(["working"]);
        if (planId === "one") return new Set(["parts", "unseparated"]);
        return new Set(Object.keys(MODEL_STATE_DATA));
    }

    function renderModelStates(planId) {
        const selected = refs.consultationFormElement.querySelector('input[name="現在のモデル状態"]:checked')?.value || "";
        const order = MODEL_STATE_ORDER[planId] || MODEL_STATE_ORDER.other;
        const allowed = getAllowedModelStates(planId);

        refs.modelStateList.innerHTML = order.map((key) => {
            const label = MODEL_STATE_DATA[key];
            const disabled = !allowed.has(key);
            const checked = !disabled && selected === key;
            return `
                <label class="choice-label">
                    <input type="radio" name="現在のモデル状態" value="${key}"${disabled ? " disabled" : ""}${checked ? " checked" : ""}>
                    <span>${label}</span>
                </label>
            `;
        }).join("");

        updateModelStateConditional();
    }

    function updatePlanSummary(planId) {
        const plan = PLAN_DATA[planId];
        if (!plan) {
            refs.formPlanSummary.innerHTML = "";
            return;
        }

        if (plan.kind === "cards") {
            refs.formPlanSummary.innerHTML = `
                <p>${plan.cards.slice(0, 3).map((key, index) => `${getCardNumber(CARD_DATA[key], index)} ${CARD_DATA[key].name}`).join(" ▶ ")}</p>
                ${plan.cards.length > 3 ? `
                    <ul>
                        ${plan.cards.slice(3).map((key, index) => {
                            const card = CARD_DATA[key];
                            return `<li>${getCardNumber(card, index + 3)} ${card.name}</li>`;
                        }).join("")}
                    </ul>
                ` : ""}
            `;
            return;
        }

        refs.formPlanSummary.innerHTML = `<p>${plan.summary}</p>`;
    }

    function setConditionalFieldVisibility(element, visible, clearWhenHidden = true) {
        if (!element) return;
        element.hidden = !visible;
        if (!visible && clearWhenHidden) {
            element.querySelectorAll("input, select, textarea").forEach((control) => {
                if (control.type === "checkbox" || control.type === "radio") control.checked = false;
                else control.value = "";
            });
        }
    }

    function setFormFieldVisibility(fieldKey, visible) {
        const field = refs.consultationFormElement.querySelector(`[data-field="${fieldKey}"]`);
        if (!field) return;
        field.hidden = !visible;
        field.querySelectorAll("input, select, textarea").forEach((control) => {
            control.disabled = !visible;
            if (!visible) {
                if (control.type === "checkbox" || control.type === "radio") control.checked = false;
                else control.value = "";
            }
        });
        if (!visible) clearFieldError(fieldKey);
    }

    function applyConsultationPlan(planId) {
        const plan = PLAN_DATA[planId];
        const color = plan?.color || FORM_DEFAULT_COLOR;

        refs.consultationPlan.value = planId || "";
        refs.consultationSection.dataset.plan = planId || "";
        refs.consultationSection.style.setProperty("--form-accent", color);
        refs.policyDialog.style.setProperty("--form-accent", color);

        updatePlanSummary(planId);
        renderConditions(planId);
        renderDeadlineChoices(planId);
        renderConsultationOptions(planId);
        renderModelStates(planId || "other");
        syncForcedConsultationOptions();

        const isOther = planId === "other";
        refs.environmentRequiredMarks.forEach((mark) => { mark.hidden = isOther; });
        refs.modelStateRequiredMarks.forEach((mark) => { mark.hidden = isOther; });

        setFormFieldVisibility("custom-selection", planId === "custom");
        setFormFieldVisibility("art-permission", planId === "one");
        setFormFieldVisibility("model-permission", planId === "custom");

        updateBudgetConditional();
        updateAdditionalUseConditional();
        updateEnvironmentConditional();
        updateModelStateConditional();
        updateArtPermissionConditional();
        updateAgeConditional();
    }

    function getCheckedValue(name) {
        return refs.consultationFormElement.querySelector(`input[name="${name}"]:checked`)?.value || "";
    }

    function updateBudgetConditional() {
        const visible = getCheckedValue("予算") === "明確な上限がある";
        setConditionalFieldVisibility(refs.budgetCap, visible);
    }

    function updateAdditionalUseConditional() {
        const hasOther = Boolean(refs.consultationFormElement.querySelector('input[name="追加利用範囲"][value="その他"]:checked'));
        setConditionalFieldVisibility(refs.additionalUseOther, hasOther);
    }

    function updateEnvironmentConditional() {
        const value = getCheckedValue("使用予定環境");
        setConditionalFieldVisibility(refs.environmentOther, value === "その他");
        setConditionalFieldVisibility(refs.environmentWarning, Boolean(value && value !== "nizima LIVE"));
    }

    function updateModelStateConditional() {
        const value = getCheckedValue("現在のモデル状態");
        setConditionalFieldVisibility(refs.modelStateOther, value === "other");
        syncForcedConsultationOptions();
    }

    function updateArtPermissionConditional() {
        const value = getCheckedValue("加筆許諾");
        refs.artPermissionNote.hidden = value !== "元イラストレーターへ追加発注できる";
    }

    function updateAgeConditional() {
        const value = getCheckedValue("年齢区分");
        setConditionalFieldVisibility(refs.guardianConfirmation, value === "未成年");
    }

    function stepHasValue(step) {
        if (step === 4) return Boolean(refs.consultationMessage.value.trim());
        const panel = refs.consultationFormElement.querySelector(`[data-form-panel="${step}"]`);
        if (!panel) return false;

        return [...panel.querySelectorAll("input, select, textarea")].some((control) => {
            if (control.disabled || control.type === "hidden") return false;
            if (control.type === "radio" || control.type === "checkbox") return control.checked;
            return Boolean(control.value.trim());
        });
    }

    function scrollWithHeaderOffset(target, extraOffset = 12) {
        if (!target) return;

        const header = document.getElementById("site-header");
        const headerHeight = header?.getBoundingClientRect().height || 0;
        const targetTop = target.getBoundingClientRect().top + window.scrollY;
        const scrollTop = targetTop - headerHeight - extraOffset;

        window.scrollTo({
            top: Math.max(0, scrollTop),
            behavior: "smooth"
        });
    }

    function scrollToFormTop() {
        scrollWithHeaderOffset(refs.topPager);
    }

    function showFormStep(step, options = {}) {
        const targetStep = Math.max(1, Math.min(4, Number(step) || 1));
        const panelStep = targetStep === 4 ? 3 : targetStep;
        const firstVisit = !state.formVisited.has(targetStep);
        const hasValue = stepHasValue(targetStep);

        state.formStep = targetStep;
        state.formVisited.add(targetStep);

        refs.formPanels.forEach((panel) => {
            const isVisible = Number(panel.dataset.formPanel) === panelStep;
            panel.hidden = !isVisible;
            panel.classList.toggle("is-active", isVisible);
            if (isVisible) {
                panel.classList.remove("is-entering");
                void panel.offsetWidth;
                panel.classList.add("is-entering");
            }
        });

        refs.formStepButtons.forEach((button) => {
            const isCurrent = Number(button.dataset.formStep) === targetStep;
            button.classList.toggle("is-current", isCurrent);
            if (isCurrent) button.setAttribute("aria-current", "step");
            else button.removeAttribute("aria-current");
        });

        refs.bottomPager.classList.toggle("is-first", targetStep === 1);
        refs.bottomPager.classList.toggle("is-last", targetStep === 4);
        refs.formPrev.hidden = targetStep === 1;
        refs.formNext.hidden = targetStep === 4;

        if (options.skipScroll) return;

        if (options.errorTarget) {
            requestAnimationFrame(() => {
                options.errorTarget.scrollIntoView({ behavior: "smooth", block: "center" });
                const focusTarget = options.errorTarget.querySelector("input:not(:disabled), select:not(:disabled), textarea:not(:disabled), button:not(:disabled)");
                focusTarget?.focus({ preventScroll: true });
            });
            return;
        }

        if (targetStep === 4) {
            scrollWithHeaderOffset(refs.consultationNotes);
            return;
        }

        if (firstVisit || !hasValue) scrollToFormTop();
    }

    function setFieldError(fieldKey, message) {
        const field = refs.consultationFormElement.querySelector(`[data-field="${fieldKey}"]`);
        const error = refs.consultationFormElement.querySelector(`[data-error-for="${fieldKey}"]`);
        if (!field) return;
        field.classList.add("is-invalid");
        field.setAttribute("aria-invalid", "true");
        if (error) {
            error.textContent = message;
            error.hidden = false;
        }
    }

    function clearFieldError(fieldKey) {
        const field = refs.consultationFormElement.querySelector(`[data-field="${fieldKey}"]`);
        const error = refs.consultationFormElement.querySelector(`[data-error-for="${fieldKey}"]`);
        if (!field) return;
        field.classList.remove("is-invalid");
        field.removeAttribute("aria-invalid");
        if (error) {
            error.textContent = "";
            error.hidden = true;
        }
        updateFormPagerErrors();
    }

    function clearAllFormErrors() {
        refs.consultationFormElement.querySelectorAll(".form-field.is-invalid").forEach((field) => {
            field.classList.remove("is-invalid");
            field.removeAttribute("aria-invalid");
        });
        refs.consultationFormElement.querySelectorAll("[data-error-for]").forEach((error) => {
            error.textContent = "";
            error.hidden = true;
        });
        updateFormPagerErrors();
    }

    function updateFormPagerErrors() {
        refs.formStepButtons.forEach((button) => {
            const step = Number(button.dataset.formStep);
            const panelStep = step === 4 ? 0 : step;
            const hasError = panelStep > 0 && Boolean(
                refs.consultationFormElement.querySelector(`[data-form-panel="${panelStep}"] .form-field.is-invalid`)
            );
            button.classList.toggle("has-error", hasError);
        });
    }

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(value);
    }

    function getFieldValidationError(fieldKey) {
        const planId = refs.consultationPlan.value;

        switch (fieldKey) {
            case "plan":
                return planId ? "" : "希望プランを選択してください。";
            case "deadline":
                return getCheckedValue("希望納期") ? "" : "希望納期を選択してください。";
            case "budget": {
                const budget = getCheckedValue("予算");
                if (!budget) return "予算の考え方を選択してください。";
                if (budget === "明確な上限がある" && !refs.budgetCapInput.value.trim()) return "上限額を入力してください。";
                return "";
            }
            case "request-type":
                return getCheckedValue("ご依頼形態") ? "" : "ご依頼形態を選択してください。";
            case "portfolio-publication":
                return getCheckedValue("制作実績公開") ? "" : "制作実績の公開条件を選択してください。";
            case "custom-selection":
                return planId === "custom" && !refs.consultationFormElement.querySelector('input[name="希望カスタム"]:checked') ? "希望するカスタムを1つ以上選択してください。" : "";
            case "additional-use": {
                const hasOther = Boolean(refs.consultationFormElement.querySelector('input[name="追加利用範囲"][value="その他"]:checked'));
                if (hasOther && !refs.additionalUseOtherInput.value.trim()) return "その他の利用内容を入力してください。";
                return "";
            }
            case "environment": {
                const environment = getCheckedValue("使用予定環境");
                if (planId !== "other" && !environment) return "使用予定環境を選択してください。";
                if (environment === "その他" && !refs.environmentOtherInput.value.trim()) return "使用予定ソフトを入力してください。";
                if (environment && environment !== "nizima LIVE" && !refs.environmentConfirmation.checked) return "対応環境とサポート範囲を確認してください。";
                return "";
            }
            case "model-state": {
                const modelState = getCheckedValue("現在のモデル状態");
                if (planId !== "other" && !modelState) return "現在のモデル状態を選択してください。";
                if (modelState === "other" && !refs.modelStateOtherInput.value.trim()) return "現在の状態を入力してください。";
                return "";
            }
            case "art-permission":
                return planId === "one" && !getCheckedValue("加筆許諾") ? "加筆許諾の状況を選択してください。" : "";
            case "model-permission":
                return planId === "custom" && !getCheckedValue("モデリング許諾") ? "モデリング許諾の状況を選択してください。" : "";
            case "name":
                return refs.consultationName.value.trim() ? "" : "お名前または活動名を入力してください。";
            case "email": {
                const email = refs.consultationEmail.value.trim();
                if (!email) return "返信用メールアドレスを入力してください。";
                return isValidEmail(email) ? "" : "有効なメールアドレスを入力してください。";
            }
            case "activity-url":
                return refs.consultationUrl.value.trim() ? "" : "活動先URLまたはXアカウントを入力してください。";
            case "age-group": {
                const age = getCheckedValue("年齢区分");
                if (!age) return "成年・未成年を選択してください。";
                if (age === "未成年" && !refs.guardianCheckbox.checked) return "親権者または法定代理人の同意を確認してください。";
                return "";
            }
            case "rights-confirmation":
                return refs.rightsCheckbox.checked ? "" : "素材の権利について確認してください。";
            case "reply-confirmation":
                return refs.replyCheckbox.checked ? "" : "返信期限と依頼枠の扱いを確認してください。";
            case "policy-confirmation":
                return refs.termsCheckbox.checked && refs.privacyCheckbox.checked ? "" : "制作規約とプライバシーポリシーの両方を確認してください。";
            default:
                return "";
        }
    }

    function validateField(fieldKey) {
        const message = getFieldValidationError(fieldKey);
        if (message) setFieldError(fieldKey, message);
        else clearFieldError(fieldKey);
        updateFormPagerErrors();
        return !message;
    }

    function validateConsultationForm() {
        clearAllFormErrors();
        const errors = [];

        Object.keys(FORM_FIELD_STEPS).forEach((fieldKey) => {
            const field = refs.consultationFormElement.querySelector(`[data-field="${fieldKey}"]`);
            if (!field || field.hidden) return;
            const message = getFieldValidationError(fieldKey);
            if (!message) return;
            setFieldError(fieldKey, message);
            errors.push({ fieldKey, step: FORM_FIELD_STEPS[fieldKey], field });
        });

        updateFormPagerErrors();
        return errors;
    }

    function setSubmitStatus(message, type = "") {
        refs.consultationSubmitStatus.textContent = message;
        refs.consultationSubmitStatus.classList.toggle("is-error", type === "error");
        refs.consultationSubmitStatus.classList.toggle("is-success", type === "success");
    }

    function createRequestId() {
        if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
        return `consult-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    }

    function submitConsultationForm(event) {
        event.preventDefault();
        if (state.formSubmitting) return;

        const errors = validateConsultationForm();
        if (errors.length) {
            const firstError = errors[0];
            setSubmitStatus("未入力または確認が必要な項目があります。", "error");
            showFormStep(firstError.step, { errorTarget: firstError.field });
            return;
        }

        if (!FORM_ENDPOINT || FORM_ENDPOINT.includes("PASTE_GOOGLE_APPS_SCRIPT")) {
            setSubmitStatus("送信先が未設定です。order.jsのFORM_ENDPOINTへGoogle Apps ScriptのウェブアプリURLを設定してください。", "error");
            return;
        }

        const selectedDeadline = refs.deadlineList.querySelector('input[name="希望納期"]:checked');
        refs.deadlineStatusInput.value = selectedDeadline?.dataset.availabilityStatus || "after";
        if (selectedDeadline?.dataset.availabilityStatus === "closed") {
            const shouldSubmit = window.confirm(
                "選択した納期は現在「停止中」です。\n制作時期について個別相談となりますが、この内容で送信しますか？"
            );
            if (!shouldSubmit) {
                setSubmitStatus("送信を中止しました。希望納期を変更できます。", "");
                return;
            }
        }

        state.formSubmitting = true;
        state.formRequestId = createRequestId();
        refs.requestIdInput.value = state.formRequestId;
        refs.submittedAtInput.value = new Date().toISOString();

        refs.consultationFormElement.action = FORM_ENDPOINT;
        refs.consultationFormElement.method = "post";
        refs.consultationFormElement.target = "consultation-submit-frame";
        refs.consultationSubmitButton.disabled = true;
        refs.consultationSubmitButton.textContent = "送信中";
        refs.consultationSubmitButton.classList.add("is-sending");
        setSubmitStatus("制作相談を送信しています。", "");

        window.clearTimeout(state.formSubmitTimer);
        state.formSubmitTimer = window.setTimeout(() => {
            if (!state.formSubmitting) return;
            state.formSubmitting = false;
            refs.consultationSubmitButton.classList.remove("is-sending");
            refs.consultationSubmitButton.disabled = false;
            refs.consultationSubmitButton.textContent = "制作相談を送る";
            setSubmitStatus("送信結果を確認できませんでした。通信状態と送信先設定を確認してください。", "error");
        }, 25000);

        HTMLFormElement.prototype.submit.call(refs.consultationFormElement);
    }

    function handleConsultationResponse(event) {
        const data = event.data;
        if (!data || data.type !== "kotono-ura-consultation-response") return;
        if (!state.formRequestId || data.requestId !== state.formRequestId) return;

        window.clearTimeout(state.formSubmitTimer);
        state.formSubmitting = false;
        refs.consultationSubmitButton.classList.remove("is-sending");

        if (data.ok) {
            refs.consultationSubmitButton.disabled = true;
            refs.consultationSubmitButton.textContent = "送信済み";
            setSubmitStatus("ご入力ありがとうございます。お疲れ様でした！\n3〜5日以内にメールでご連絡します。", "success");
            return;
        }

        refs.consultationSubmitButton.disabled = false;
        refs.consultationSubmitButton.textContent = "制作相談を送る";
        setSubmitStatus(data.message || "送信に失敗しました。時間を置いて再度お試しください。", "error");
    }

    function openPolicyDialog() {
        refs.policyDialog.showModal();
        document.body.classList.add("is-dialog-open");
    }

    function closePolicyDialog() {
        if (refs.policyDialog.open) refs.policyDialog.close();
        document.body.classList.remove("is-dialog-open");
    }

    function switchPolicyPane(key) {
        refs.policyTabs.forEach((button) => {
            const active = button.dataset.policyTab === key;
            button.classList.toggle("is-active", active);
            button.setAttribute("aria-selected", String(active));
        });
        refs.policyPanes.forEach((pane) => {
            const active = pane.dataset.policyPane === key;
            pane.classList.toggle("is-active", active);
            pane.hidden = !active;
        });
        refs.policyDialogBody.scrollTop = 0;
    }

    function bindConsultationEvents() {
        refs.formStepButtons.forEach((button) => {
            button.addEventListener("click", () => showFormStep(Number(button.dataset.formStep)));
        });

        refs.formPrev.addEventListener("click", () => showFormStep(state.formStep - 1));
        refs.formNext.addEventListener("click", () => showFormStep(state.formStep + 1));

        refs.consultationPlan.addEventListener("change", () => {
            applyConsultationPlan(refs.consultationPlan.value);
            validateField("plan");
        });

        refs.consultationFormElement.addEventListener("change", (event) => {
            const target = event.target;
            if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)) return;

            if (target.name === "予算") updateBudgetConditional();
            if (target.name === "追加利用範囲") updateAdditionalUseConditional();
            if (target.name === "使用予定環境") updateEnvironmentConditional();
            if (target.name === "現在のモデル状態") updateModelStateConditional();
            if (target.name === "追加オプション" && target.dataset.optionKey === "art-adjustment") {
                if (target.dataset.forced === "true" && !target.checked) {
                    target.checked = true;
                } else if (target.dataset.forced !== "true") {
                    state.artAdjustmentAutoSelected = false;
                }
            }
            if (target.name === "加筆許諾") updateArtPermissionConditional();
            if (target.name === "年齢区分") updateAgeConditional();

            const field = target.closest("[data-field]");
            if (field?.classList.contains("is-invalid")) validateField(field.dataset.field);
        });

        refs.consultationFormElement.addEventListener("input", (event) => {
            const field = event.target.closest?.("[data-field]");
            if (field?.classList.contains("is-invalid")) validateField(field.dataset.field);
        });

        refs.consultationFormElement.addEventListener("submit", submitConsultationForm);
        window.addEventListener("message", handleConsultationResponse);

        refs.openPolicyButton.addEventListener("click", openPolicyDialog);
        refs.policyCloseButton.addEventListener("click", closePolicyDialog);
        refs.policyDialog.addEventListener("click", (event) => {
            if (event.target === refs.policyDialog) closePolicyDialog();
        });
        refs.policyDialog.addEventListener("close", () => {
            document.body.classList.remove("is-dialog-open");
        });
        refs.policyTabs.forEach((button) => {
            button.addEventListener("click", () => switchPolicyPane(button.dataset.policyTab));
        });
    }

    function initConsultationForm() {
        renderDeadlineChoices();
        renderCustomSelections();
        renderConsultationOptions("");
        renderModelStates("other");
        applyConsultationPlan("");
        showFormStep(1, { skipScroll: true });
        bindConsultationEvents();
    }

    function bindGlobalEvents() {
        refs.planPanel.addEventListener("click", handlePlanPanelClick);
        refs.planPanel.addEventListener("keydown", handlePlanPanelKeydown);
        attachPlanPanelSwipe();

        window.addEventListener("wheel", () => {
            const kind = state.activePlan ? PLAN_DATA[state.activePlan]?.kind : null;
            if (kind === "cards") state.cardScrollEnabled = true;
            if (kind === "custom") state.customScrollEnabled = true;
        }, { passive: true });

        window.addEventListener("touchmove", () => {
            const kind = state.activePlan ? PLAN_DATA[state.activePlan]?.kind : null;
            if (kind === "cards") state.cardScrollEnabled = true;
            if (kind === "custom") state.customScrollEnabled = true;
        }, { passive: true });

        window.addEventListener("scroll", () => {
            if (state.scrollFrame) return;
            state.scrollFrame = requestAnimationFrame(() => {
                state.scrollFrame = 0;
                updateNearestCard();
                updateCustomParallax();
            });
        }, { passive: true });

        window.addEventListener("resize", () => {
            syncPlanPanelRailMinimum(state.activePlan);
        }, { passive: true });

        refs.dialog.querySelector(".detail-dialog__close").addEventListener("click", closeDetail);

        refs.dialog.addEventListener("click", (event) => {
            if (event.target === refs.dialog) closeDetail();
        });

        refs.dialog.addEventListener("close", () => {
            document.body.classList.remove("is-dialog-open");

            if (state.detailPointerOpened) {
                requestAnimationFrame(() => {
                    const activeElement = document.activeElement;
                    if (activeElement?.closest?.(".process-card")) {
                        activeElement.blur();
                    }
                    state.detailReturnCard?.blur();
                    state.detailPointerOpened = false;
                    state.detailReturnCard = null;
                });
            } else {
                state.detailReturnCard = null;
            }
        });
    }

    function cacheRefs() {
        refs.conditionList = document.getElementById("condition-list");
        refs.planSelector = document.getElementById("plan-selector");
        refs.planTabs = document.getElementById("plan-tabs");
        refs.planPanel = document.getElementById("plan-panel");
        refs.planMain = null;
        refs.planRail = null;
        refs.railTitleSlot = null;
        refs.railSummarySlot = null;
        refs.railMetaList = null;
        refs.railTerm = null;
        refs.railPrice = null;
        refs.railConsult = null;
        refs.railResizeObserver = null;
        refs.desktopPlanPrev = null;
        refs.desktopPlanNext = null;
        refs.desktopPlanResizeObserver = null;
        refs.optionsList = document.getElementById("options-list");
        refs.consultationSection = document.getElementById("consultation-form");
        refs.consultationFormElement = document.getElementById("production-consultation-form");
        refs.topPager = refs.consultationFormElement.querySelector(".form-pager--top");
        refs.bottomPager = refs.consultationFormElement.querySelector(".form-pager--bottom");
        refs.formStepButtons = [...refs.consultationFormElement.querySelectorAll("[data-form-step]")];
        refs.formPanels = [...refs.consultationFormElement.querySelectorAll("[data-form-panel]")];
        refs.formPrev = refs.consultationFormElement.querySelector("[data-form-prev]");
        refs.formNext = refs.consultationFormElement.querySelector("[data-form-next]");
        refs.consultationPlan = document.getElementById("consultation-plan");
        refs.formPlanSummary = document.getElementById("form-plan-summary");
        refs.deadlineList = document.getElementById("deadline-list");
        refs.consultationOptions = document.getElementById("consultation-options");
        refs.customSelectionList = document.getElementById("custom-selection-list");
        refs.additionalUseOther = document.getElementById("additional-use-other");
        refs.additionalUseOtherInput = document.getElementById("additional-use-other-input");
        refs.modelStateList = document.getElementById("model-state-list");
        refs.budgetCap = document.getElementById("budget-cap");
        refs.budgetCapInput = document.getElementById("budget-cap-input");
        refs.environmentOther = document.getElementById("environment-other");
        refs.environmentOtherInput = document.getElementById("environment-other-input");
        refs.environmentWarning = document.getElementById("environment-warning");
        refs.environmentConfirmation = refs.environmentWarning.querySelector('input[name="対応環境確認"]');
        refs.modelStateOther = document.getElementById("model-state-other");
        refs.modelStateOtherInput = document.getElementById("model-state-other-input");
        refs.artPermissionNote = document.getElementById("art-permission-note");
        refs.guardianConfirmation = document.getElementById("guardian-confirmation");
        refs.guardianCheckbox = refs.guardianConfirmation.querySelector('input[name="親権者同意"]');
        refs.environmentRequiredMarks = [...refs.consultationFormElement.querySelectorAll("[data-environment-required]")];
        refs.modelStateRequiredMarks = [...refs.consultationFormElement.querySelectorAll("[data-model-state-required]")];
        refs.consultationName = document.getElementById("consultation-name");
        refs.consultationEmail = document.getElementById("consultation-email");
        refs.consultationUrl = document.getElementById("consultation-url");
        refs.rightsCheckbox = refs.consultationFormElement.querySelector('input[name="素材権利確認"]');
        refs.replyCheckbox = refs.consultationFormElement.querySelector('input[name="返信期限確認"]');
        refs.termsCheckbox = refs.consultationFormElement.querySelector('input[name="制作規約確認"]');
        refs.privacyCheckbox = refs.consultationFormElement.querySelector('input[name="プライバシーポリシー確認"]');
        refs.consultationNotes = document.getElementById("consultation-notes");
        refs.consultationMessage = document.getElementById("consultation-message");
        refs.consultationSubmitButton = document.getElementById("consultation-submit-button");
        refs.consultationSubmitStatus = document.getElementById("consultation-submit-status");
        refs.deadlineStatusInput = document.getElementById("consultation-deadline-status");
        refs.requestIdInput = document.getElementById("consultation-request-id");
        refs.submittedAtInput = document.getElementById("consultation-submitted-at");
        refs.openPolicyButton = document.getElementById("open-policy-dialog");
        refs.policyDialog = document.getElementById("policy-dialog");
        refs.policyCloseButton = refs.policyDialog.querySelector(".policy-dialog__close");
        refs.policyTabs = [...refs.policyDialog.querySelectorAll("[data-policy-tab]")];
        refs.policyPanes = [...refs.policyDialog.querySelectorAll("[data-policy-pane]")];
        refs.policyDialogBody = refs.policyDialog.querySelector(".policy-dialog__body");
        refs.dialog = document.getElementById("card-dialog");
        refs.dialogTitle = document.getElementById("dialog-title");
        refs.dialogBody = document.getElementById("dialog-body");
    }

    function init() {
        cacheRefs();
        renderConditions();
        renderPlanTabs();
        renderOptions();
        initConsultationForm();
        ensureDesktopPlanArrows();
        bindGlobalEvents();
        window.addEventListener("scroll", syncDesktopPlanArrows, { passive: true });
        window.addEventListener("resize", syncDesktopPlanArrows, { passive: true });
    }

    init();
})();
