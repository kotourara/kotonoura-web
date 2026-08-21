(() => {
    "use strict";

    /*
     * Orderの料金・納期・説明文を管理するデータです。
     * 通常の更新では、このファイルだけを編集します。
     *
     * plans:
     *   price = 料金目安
     *   term  = 納期目安
     *
     * customCategories:
     *   rows内は [項目名, 料金目安, 説明文] の順です。
     */

    const data = {
        planOrder: ["custom", "one", "two", "three", "extreme", "other"],

        plans: {
        custom: {
            mark: "改",
            title: "カスタムモデリング",
            shortTitle: "カスタムモデリング",
            color: "#00767F",
            term: "2週間〜1.5か月",
            price: "3万円〜",
            summary: "既存モデルの目元・口元・髪質などを、部位ごとに強化する追加カスタムです。",
            kind: "custom"
        },
        one: {
            mark: "壱",
            title: "モデリング（原画持ち込み）",
            shortTitle: "モデリング",
            color: "#397F1A",
            term: "2〜4か月",
            price: "45万円〜",
            summary: "お持ち込み原画をもとに、高可動域・細かな表情まで作り込むモデリングプランです。",
            kind: "cards",
            cards: ["rig", "setup"]
        },
        two: {
            mark: "弐",
            title: "原画＋フルモデリング",
            shortTitle: "原画＋フルモデリング",
            color: "#9F8C19",
            term: "3〜5か月",
            price: "60万円〜",
            summary: "Live2D化を前提とした原画制作から、パーツ分け・モデリングまで行う基本制作プランです。",
            kind: "cards",
            cards: ["art", "parts", "rig", "setup"]
        },
        three: {
            mark: "参",
            title: "フルプロデュース",
            shortTitle: "フルプロデュース",
            color: "#973C10",
            term: "4〜6か月",
            price: "80万円〜",
            summary: "原画・モデリングに加え、ロゴ・設定画・キービジュアルまで整える総合制作プランです。",
            kind: "cards",
            cards: ["art", "parts", "rig", "logo", "view2", "kv", "setup", "sns"]
        },
        extreme: {
            mark: "極",
            title: "高密度フルプロデュース",
            shortTitle: "高密度フルプロデュース",
            color: "#8F2126",
            term: "5〜8か月",
            price: "95万円〜",
            summary: "三面図・アニメロゴ・演出ビジュアルまで含む、高密度な総合制作プランです。",
            kind: "cards",
            cards: ["art", "parts", "rig", "animeLogo", "view3", "dirKv", "setup", "sns"]
        },
        other: {
            mark: "他",
            title: "その他ご相談",
            shortTitle: "その他ご相談",
            color: "#6D6D6D",
            term: "要相談",
            price: "要相談",
            summary: "掲載外の制作内容や、組み合わせのご依頼はこちらからご相談ください。",
            kind: "other"
        }
    },

        customOrder: ["eye", "mouth", "hair"],

        customCategories: {
        eye: {
            label: "目元カスタム",
            icon: "images/order/custom/01_eye.svg",
            rows: [
                ["①目元フルカスタム", "10万円〜", "ハイライト、瞳、まぶた、まつ毛をまとめて調整します。\n目元全体を自然で表情豊かな動きに整えるプランです。"],
                ["②ジト目差分", "3万円〜", "ボタン操作で普段の表情からなめらかにジト目へ変形します。\n印象のギャップが大きく、さまざまな場面で使いやすい表情差分です。"],
                ["③瞳モチーフ演出", "5万円〜", "瞳の中にある模様やモチーフを動かしたり、色や形を変えたりします。\nキャラクターに合わせて、演出内容を個別にデザインします。"]
            ]
        },
        mouth: {
            label: "口元カスタム",
            icon: "images/order/custom/02_mouth.svg",
            rows: [
                ["①母音表現強化", "4万円〜", "「あ」の口と「う」の口を、より細かく表現できます。\n自然な口と、アニメらしく強調した口を使い分けられるため、会話や歌の口元が豊かになります。"],
                ["②くちびる表情強化", "5万円〜", "左右の口角を別々に動かしたり、口全体を横へずらしたりできます。\n基本的な口の動きでは作りにくい、複雑で個性的な表情が可能になります。"],
                ["③骨格連動", "3万円〜", "口を閉じたままもぐもぐする動きや、顎全体を左右へ寄せる動きです。\n鼻や目元まで動くため、顔全体を使った大きな表情が作れます。"],
                ["①〜③口元フルカスタム", "10万円〜", "母音表現、唇、顎の動きをまとめて調整します。\n口の動きと表情を幅広く使えるアップグレードプランです。"],
                ["④よだれ口差分", "4万円〜", "ボタン操作で、口が溶けたような形に変化します。\n眠そうな顔や気の抜けた顔など、さまざまな表現に使えます。"],
                ["⑤頬ぷく差分", "5万円〜", "頬をふくらませ、口を小さく結んだ表情を追加します。\nボタン固定はもちろん、カメラでリアルタイムに読み取って動かすこともできます。"]
            ]
        },
        hair: {
            label: "髪質カスタム",
            icon: "images/order/custom/03_hair.svg",
            rows: [
                ["①しなやか髪揺れ", "6万円〜", "顔の動きと傾きに合わせて、髪の長さや形に沿った自然な揺れを追加します。\n呼吸に合わせて揺らすことで、顔全体に生命感が加わります。"],
                ["②傾き髪垂れ", "5万円〜", "頭の傾きに合わせて、髪が重力に沿って垂れる動きを追加します。\n姿勢に合わせて自然な髪の流れが生まれます。"],
                ["①〜②髪質フルカスタム", "10万円〜", "髪の揺れと、頭を傾けたときの垂れ方をまとめて調整します。\n髪のやわらかさと重さを自然に表現できるプランです。"]
            ]
        }
    }
    };

    const deepFreeze = (value) => {
        if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
        Object.freeze(value);
        Object.values(value).forEach(deepFreeze);
        return value;
    };

    window.ORDER_PLAN_DATA = deepFreeze(data);
})();
