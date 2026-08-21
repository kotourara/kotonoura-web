(() => {
    "use strict";

    /*
     * 毎週の更新は、この配列へ同じ形式の項目を追加する。
     * publicIdは既存記事との互換用。新規記事では省略またはnullでよい。
     * 同期時はslugで既存IDを維持し、未登録記事にはUUIDを自動発行する。
     * secret:true の記事は通常ソートから外れ、秘密記事同士だけで循環する。
     */
    const entries = Object.freeze([
        {
            id: "unknown-20180930",
            slug: "unknown-20180930",
            contentType: "diary",
            publicId: "36320a0f-78b9-5da5-8490-8151785ad5fb",
            published: true,
            secret: true,
            title: "テキスト.txt",
            date: "2018-09-30",
            author: "unknown",
            initialPopularity: 0,
            related: [],
            body: `あの日から、過ぎた時間を
忘れる癖がついていた
ただ、思い出すのが怖かったのだ

覚えている
場違いな熱に歪んだ視界も
跡形もなくなった象牙の塔も
蝉の声も湿った空気も焼けた絵具の匂いも
すべて覚えている

忘れてはいけない
私が見た、私を視た、たった一人の偏屈者
その始終を描き残すために

だから、あなたはこの日記を書き始めた
これは私だけの物語ではないのだ
忘れてはいけない`
        },
        {
            id: "unknown-20210606",
            slug: "unknown-20210606",
            contentType: "diary",
            publicId: "a3b2a261-37de-527c-9bf8-9d34ca71c033",
            published: true,
            secret: true,
            title: "テキスト(32).txt",
            date: "2021-06-06",
            author: "unknown",
            initialPopularity: 0,
            related: [],
            body: `はじめて作品と呼べる何かを
残すことができた

署名という行為がよく理解できない
沢山の作品を盗んできたというのに
どうして突然自分を名乗りだすのだろう

いったい今の私は誰なのだろうか
いくら考えても思いつかないから
まだ存在していないということにした

彼の名前から一文字拝借して
「琴麗等」というのはどうだろう
美しい音色だ、麗しい響きだ
私には到底似つかわしくない

だからこそ名乗るのだ
筆を置くことなど赦されない、と
自分を呪うための忌み名として`
        },
        {
            id: "greeting",
            slug: "greeting",
            contentType: "diary",
            publicId: "cc022146-eea7-5208-9c9a-f0c5f7020a6e",
            published: true,
            secret: false,
            title: "ごあいさつ",
            date: "2026-03-25",
            author: "urara",
            initialPopularity: 16,
            related: [],
            body: `お久しぶりです
琴麗等(ことうらら)と申します。
最早、はじめましてでしょうか…

今日から水曜この時間に、
脳内から漏れ出る言葉を写した
日記を置いていこうと思います

裏では忙しない毎日なのに
あまりにも、あんまりにも‼︎
表に出せるものが有りませんで。
せめて活動の痕跡くらい残せよ、と
某幽霊からも叱られましたので

私の変な？日本語が好きな
偏食家も1万分の7人くらいは
いらっしゃるそうです。変なの。
(7って素数美しいよね)

読むことは義務ではないです
SNSも義務ではないです
よって、この日記も義務ではないです

好き勝手生きて逝きましょう`
        },
        {
            id: "teraitagari",
            slug: "teraitagari",
            contentType: "diary",
            publicId: "b7a45651-a80c-5164-803d-0f569614e829",
            published: true,
            secret: false,
            title: "てらいたがり",
            date: "2026-04-01",
            author: "urara",
            initialPopularity: 12,
            related: [],
            body: `人と同じ方を向くのを嫌う
いわゆる、奇をてらう人。

流行に揉まれて自分の輪郭を
見失うのが怖いのでしょうね。
巨大な波に立ち向かえるほど、
私はアイデンティティに自信がない。

お菓子の交換会が転じてなぜか
仮装徘徊大会になっている日など
聖夜の解釈が無限に溶け広がり
愛憎栽培大会になっている日など

にぎやかいイベント折々、
気持ちとの温度差で風邪を引く。
鼻がやられて舌がバカになって
匂いも味も風情もわからなくなる

だから虚構はびこる今日こそ、
奇をてらい「真」のエイプリルを
味わうのです！

これが私のアイデンティティ。`
        },
        {
            id: "player",
            slug: "player",
            contentType: "diary",
            publicId: "f9f1ac16-83e4-5bfd-be79-5611222c37ed",
            published: true,
            secret: false,
            title: "プレイヤ",
            date: "2026-04-08",
            author: "urara",
            initialPopularity: 13,
            related: [],
            body: `なんでも受け身でお祈り～だなんて
もったいないと思いません？

目前に広がる無限の選択肢に
見向きもせず早送りするゲーム？
つまらなくて耐えられそうにない。
しかも、ストーリーのルートは
無限にカスタム可能なのに！

ステータス「貧乏」は私にとって
ありがたい初期装備でした

欲しいものは手に入らなくて当然。
シナリオは都合悪い方が自然。
じゃあ、

自分でつくって書き換えてしまえば
自分で壊して動かしてしまえば
全部思い通りになるッ！！！

なんて、
適度に馬鹿な思考が知らぬ間に
チュートリアルで手に入ったので。
多分、強欲過ぎるくらいが丁度いい

神ゲーにするかはぜ〜んぶ、
一人称でコントローラーを握ってる
主人公次第。`
        },
        {
            id: "irregular",
            slug: "irregular",
            contentType: "diary",
            publicId: "c9b20457-0ecd-51cd-b182-0b0e7e45a233",
            published: true,
            secret: false,
            title: "イレギュラー",
            date: "2026-04-15",
            author: "urara",
            initialPopularity: 4,
            related: [],
            body: `雨に濡れたコンクリートに夥しく
張り付いた桜の花びらたちを見て、
風情……ではなく「きもちわるっ」
という感情が先立ってしまいました

可笑しな話。
無数に並んだハニカムや和柄を見ても
美しいとしか思わないのに。
集合に規則を定義できなくなった瞬間
アレルギーみたいによだつ身の毛。

蟻の社会構造も松かさの配列も
プログラムされたように数学的です
自然の本来の姿とは、すべてが数字に
従属した状態を言うのでしょうか

不規則で孤独なのは人間だけ。
規則を観測し評価している側が
最もぐちゃぐちゃなんて皮肉ですね

銀河単位で見れば、私たちの素数も
無理数も手をつなげるのでしょうか。
ああ、頭が痛くなってきた……`
        },
        {
            id: "catharsis",
            slug: "catharsis",
            contentType: "diary",
            publicId: "18b41e00-d8fb-54d8-a4b2-bdeaf6f8bd3e",
            published: true,
            secret: false,
            title: "カタルシス",
            date: "2026-04-22",
            author: "urara",
            initialPopularity: 1,
            related: [],
            body: `とある小説の、息絶える描写が
冷静で物理的でとても綺麗でした
読後の熱というのは、どこから
湧いてくるのでしょうね…ほくほく。

「一人称の死」は、著者の主観が
色濃くにじむ貴重なテーマです
実際に体験しては記せない、
意識の最終地点。

今まで見てきた生を敷き詰めて
鏡に反射させることでしか
その輪郭を映すことはできません
ドーナッツの穴みたいですね。

作品の中のドラマチックな旅立ちや
最期の演出に憑りつかれるのは、
窒息しそうな社会の中でも私たちに
確かに流れる血液や呼吸の実像を
認識したいという反応でしょうか。

白と黒ばっかり比べて安心しては
よくないなぁと焦るばかりです。
見える限りのグレーと手をつなぐ、
そんな絵筆でありたい日々`
        },
        {
            id: "virtual",
            slug: "virtual",
            contentType: "diary",
            publicId: "1150809d-2a54-5503-97f6-db99ff2d8057",
            published: true,
            secret: false,
            title: "バーチャル",
            date: "2026-04-29",
            author: "urara",
            initialPopularity: 6,
            related: [],
            body: `自分が造りだしたものに対して
恥ずかしい！醜い！という感情は

心が見えない無機物な物体や
他人の手を通して濾過されると
簡単に薄れてしまったりします

私にとっては、ペンやパソコンが
そのフィルタみたいなものでしょうか

境界条件がファジィなファンタジーに
好きになれる自分自身を再構成する。
まるで自我を閉じ込めた神様に
反旗を翻しているようで、素敵ですね

誰もが、趣味だと卑下している
娯楽の中に存在理由の種を
隠し持っているのかもしれません

いつか咲かせられたら、素敵ですね`
        },
        {
            id: "yamabuki",
            slug: "yamabuki",
            contentType: "diary",
            publicId: "cfd342e1-7c09-5fcc-96f4-68ccafeb2bd2",
            published: true,
            secret: false,
            title: "八重山吹",
            date: "2026-05-06",
            author: "urara",
            initialPopularity: 15,
            related: [
            {
                        type: "gallery",
                        label: "色かさね「山吹」を見る",
                        href: "gallery.html?category=illustration&work=yamabuki"
            }
],
            body: `一輪では淋しいが実を結ぶ花
豪奢に咲き乱れるが実らない花
どちらになりたいと思うでしょうか

いくら外を着飾って華を磨いても
心が、胎の底が満たされない
折れそうで小さなあの子の器は
中にいっぱい詰まっているのに…

いつも日陰にばっかりいるから、
陽に照らされた表じゃなくて
浮き彫りになった心ばかりを
描きたくなるのです。この陰キャめ！

黄のようにまぶしく元気な色ほど、
影を落とすと他の色よりも一層
くすんで見えたりしますよね

闇を知らなければ光を解せない。
だから私は今日も元気に、湿った
日陰を咲いていこうと思います`
        },
        {
            id: "rta-runner",
            slug: "rta-runner",
            contentType: "diary",
            publicId: "35d8ca90-685b-55b6-9ba7-e406c8beb2c7",
            published: true,
            secret: false,
            title: "移動RTA走者",
            date: "2026-05-13",
            author: "urara",
            initialPopularity: 8,
            related: [],
            body: `私はせっかちです。絶望的に。

歩きスマホなんかを見かけると、
移動を済ませてから静止状態で
触った方が効率的では？え"？？
なんて思ってしまいます

ちょっとした停滞でも体が粟立つ、
マグロのような生き急ぎ野郎なのです

きっと青春や恋愛なんていう色あいは
非合理で非生産的で非効率的な余白に
心を滲ませてこそ楽しめるのでしょう
あぁ、もったいない…灰色の日々。

でも、私は私の無駄を愛しています
絵を描くのも詩を歌うのも、
この日記も、この人生も
宙から見下ろせば、ぜ～んぶ無駄。

仕方ないでしょう？好きなのですから
辞められないし止まらない

その無駄を限界まで楽しむために。
今日もエスカレータを尻目に
階段を一音飛ばしで密かに演奏し
自動ドアは20センチ開けばお役御免、
半身で滑り込み明日へ駆けるのでぁ！`
        },
        {
            id: "relative-capital",
            slug: "relative-capital",
            contentType: "diary",
            publicId: "69561e71-bff4-5a85-9f93-d5f40064700d",
            published: true,
            secret: false,
            title: "相対性資本",
            date: "2026-05-20",
            author: "urara",
            initialPopularity: 11,
            related: [],
            body: `大好きな本を数年ぶりに再読しました

文語と私の回路を繋いだ名作です
当時、脳の検閲をすり抜けていたのか
文字や文脈に真新しくつまづきながら
刺激的な余韻に足は浮き視界は滑り…

不思議ですね。
以前視界に映った瞬間から、或いは
著者の頭から取り出された瞬間から
形はそのままだったはずなのに

感受性の経年変化を自覚して
わくわくしているなんて、まだまだ
有望で未熟だなあと思うばかりです

「景色が色づく」って比喩なんかも
妙ですよね。色で約分できそうだし。

物体も光源も視覚もそこに在るだけ
揺れたのは、視神経からの情報を
咀嚼した感性に他なりません

時間とは非常に不安定な定規ですが
模糊っとした心の変形を観測するには
うってつけの相棒かもしれませんね。

時間に追われるのも悩むのも人間だけ
私たちだけの特別な資本です`
        },
        {
            id: "kodoku",
            slug: "kodoku",
            contentType: "diary",
            publicId: "fdb98152-bf92-581d-ba04-96e2e77b7c46",
            published: true,
            secret: false,
            title: "蠱毒",
            date: "2026-06-10",
            author: "urara",
            initialPopularity: 3,
            related: [],
            body: `好きな曲！！　だけど

歌詞の意味は覚えていない
或いは、誰の曲かも知らない
消費するように浅く広く楽しむ勢！

これを「にわか」だと、
批判したくなる気持ち

私もクリエイターの端くれ。
首がとれるほど頷けますが

誰しも何かの「オタク」であり
何かの「にわか」である
と気づくと溜飲が下がりました

確かに、全てのオタクだなんて
AIか全知全能の神様くらいですもんね

好きなものだけオタクであればいい。
消費されてなんぼの界隈、
にわかだらけで当たり前なのです

この長ったらしく無意味な文章を
ここまで読みに来たあなたは、
いったいどちら様なんでしょうか

…どっちでもない？
いいですね。グレーは好きな色です

ナンセンスを楽しむような偏食家。
せっかちな時代だからこそ、
大事にしたいものです`
        },
        {
            id: "wakakusa",
            slug: "wakakusa",
            contentType: "diary",
            publicId: "fdc91341-d3d2-5cc9-8b62-e3dbe9630e84",
            published: true,
            secret: false,
            title: "若草",
            date: "2026-06-17",
            author: "urara",
            initialPopularity: 2,
            related: [
            {
                        type: "gallery",
                        label: "色かさね「若草」を見る",
                        href: "gallery.html?category=illustration&work=wakakusa"
            }
],
            body: `やわらかく未完成なものには
見た者を無防備にさせる
不思議な魔力があります

瞬く間、張り詰めた空気が流され
尖った感情たちが摩擦で丸くなり
視野が狭くなっていくような感覚

意図や糸が見えないそのあどけなさは
散らかっていた愛情のベクトルを
否応なしに引き寄せる力を持っている

もし、それが
作為的に生み出されたものだったら。
…なんて怖くて考えたくありませんね

湿っぽく見上げる目が、仕草が、声が
無邪気に青い若さでありますように…`
        },
        {
            id: "diversity-dystopia",
            slug: "diversity-dystopia",
            contentType: "diary",
            publicId: "009080bf-bed1-553c-bad2-651ded7b5732",
            published: true,
            secret: false,
            title: "多様性ディストピア",
            date: "2026-06-24",
            author: "urara",
            initialPopularity: 9,
            related: [],
            body: `品がない、わかりづらい、と
言葉の角が次々切り落とされていく
いい子ちゃんな時代になりました

私達は生の語彙に自信を失い
誰かの調理がないと安心できなくなる

いつしか、未加工の文脈が持っていた
心に触る力やユーモアを忘れ、それは
伝達道具にほかならない記号と化す

検閲は人間よりも正確で厳格なAIへ…

この日記を書き始めたのは
彼らの侵略へのささやかなる抵抗です
私の見ている世界を表す翻訳者は
私の中から出た言葉であってほしい

脳みそ無様に何度もこねくり回して
ぐちゃぐちゃな言葉の海に溺れて
がらくたを拾いつなげて
叩いて、壊して、またつなげて。

こんなに楽しい趣味を
奪わせてたまるもんですか！

この無駄で非合理な娯楽を愛する限り
私の言葉は私のもの。`
        },
        {
            id: "hidden-flavor",
            slug: "hidden-flavor",
            contentType: "diary",
            publicId: "ff879d30-6642-5565-a4d6-23095e197c12",
            published: true,
            secret: false,
            title: "隠し味",
            date: "2026-07-01",
            author: "urara",
            initialPopularity: 14,
            related: [],
            body: `「忙しい」という断り文句に
仄かな苦みを感じることがある

忙しいから遊べない、とは
私の都合よりあなたを優先する
価値がない、と翻訳できますね。
なんてひどい！！！

かく言う私も、ほとんどの誘いを
切り捨てて制作を優先するような
冷酷な創作人間なんですが…
私なりの口答えは「忙しない」です

漢字は同じですが、送り仮名によって
受動的か能動的かのニュアンスが
切り替わる感じがします

要するに、断ること自体より
最終的に自分で選んだ都合なのに
あたかも自然災害が降りかかった
かのように味付けて誤魔化すような
姿勢が気に食わないのでしょう

断るなら正々堂々と断る！という
非常にど～でもいい美学ですが
舵を取っている自覚を思い出すために
忘れてはいけない味蕾だと感じます`
        },
        {
            id: "kamenozoki",
            slug: "kamenozoki",
            contentType: "diary",
            publicId: "ac0d9aed-2422-58e6-92de-7a0df2ad35e3",
            published: true,
            secret: false,
            title: "瓶覗き",
            date: "2026-07-08",
            author: "urara",
            initialPopularity: 10,
            related: [
            {
                        type: "gallery",
                        label: "色かさね「瓶覗」を見る",
                        href: "gallery.html?category=illustration&work=kamenozoki"
            }
],
            body: `ミステリアスで掴みどころのない
飄々とした人物

情報が省略されても成立できる
フィクション文化でこそよく見る
人格描写だと感じます

上澄みをのらりくらりと漂い
浅はかに覗く表の色は、暗く重く
沈んでいる何かを隠している？

底に触れた青黒い姿を知っているから
軽薄で適当なペルソナに身を包み
なにもかもを淡い関係で終わらせる

そんな隠蔽された闇も愛したい…！
なんて思ったらもう、壺の中。`
        },
        {
            id: "collector",
            slug: "collector",
            contentType: "diary",
            publicId: "611e0da8-d162-5c2c-ae1f-a073883f74ab",
            published: true,
            secret: false,
            title: "コレクターへ",
            date: "2026-07-15",
            author: "urara",
            initialPopularity: 5,
            related: [],
            body: `色違いの商品や漢字の部首、
元素記号などの一覧表を調べては
ただ眺めることが昔は趣味だった

同じ集合の中で陳列されているのに
一つ一つが区別されて別の名前を着る
群れの中でも独自の波長で光る
繊細で強欲な個性のようなそれに
童心か何かが反応したのでしょう

自分でモノをつくり始めてからか
そんな興味は色褪せていきました

関心は世界の秩序が並べた生産物から
私という無秩序を彩った創作物へ

そんな色たちを集めて並べてみたら。
あの頃の、得も言えぬ興奮を
もう一度味わえるかもしれない…
そう思うと筆を取らずにはいられません

自分の作品が誰かの、もとい。
誰よりも自分の琴線に触れますように`
        },
        {
            id: "saraba",
            slug: "saraba",
            contentType: "diary",
            publicId: "006cc685-55ba-5763-b7e7-9af4e9240755",
            published: true,
            secret: false,
            title: "さらば",
            date: "2026-07-23",
            author: "urara",
            initialPopularity: 7,
            related: [],
            body: `視界の端に浮かぶ"異常"

虚空に突如現れたそれは、
純白のドレスに赤黒く
染み固まった血液のよう

光を飲み込む外套に身を包み
沈黙の中、ただ佇んでいる

ほとばしる思考。逃げ場はない。
一番早く辿りつくのはいつも
最悪の想像。
ふと目を離したその瞬間、

消えた

ラッパの音が終末を告げる
口から飛び出そうなはらわたに
理性の鎖を巻きつけ、息を飲む

私が、この戦いを終わらせるのだ。

赤く光る筒を握りしめ戦場へ赴く
魂の束縛を今、解き放て。

さらば

要約：部屋にGが出ました`
        },
        {
            id: "sign-bias",
            slug: "sign-bias",
            contentType: "diary",
            published: true,
            secret: false,
            title: "サインバイアス",
            date: "2026-07-29",
            author: "urara",
            initialPopularity: 6,
            related: [],
            body: `靴を履いたら違和感。

小石？と思い中を覗くと
穴が空いているだけでした

足の裏が感じた気持ち悪さは
「靴の中は平坦である」という
予想からずれていた意外性。
それが凸か凹かは些末な問題です

このような勘違いをすると
「ああ、偏っていないな」と
安心する自分がいます

算数の授業ではなぜかいつも
正の数が主役でした
+7も-7も、0から見れば7なのに

普通がプラスで異常がマイナスという
繰り返された「デフォルト」が、
主観の幻想に凝り固まる原因
だと思っています

社会で生きていく上で
羅針盤になって助けてくれるのも
その「デフォルト」なんですけどね。

まぁ少なくとも制作中の私には
無用の長物かな…`
        },
        {
            id: "information-immunity",
            slug: "information-immunity",
            contentType: "diary",
            published: true,
            secret: false,
            title: "情報免疫",
            date: "2026-08-05",
            author: "urara",
            initialPopularity: 6.5,
            related: [],
            body: `蜘蛛を好いている

誰もが家で見かける子達
何代目かはわかりませんが

皐月の五月蝿い蝿を捕えてくれる
チャスジハエトリには「サツキラー」
手のひらサイズでGをも屠ってくれる
アシダカグモには「アシ・ダハーカ」
と名づけて微笑ましく眺めています

最初は、みんなが怖がるものを
平気で触る逆張りボーイ精神に
起因する演出だった気もするが
観察から得た知識がやがて解け固まり
私を名乗る本物の外皮となっていた

なんでも、我々は情報不足に
不安や恐怖を感じる生き物です
歩み寄って相手と目線を合わせれば
八つの瞳に宿るつぶらな光と
奥に映った自分が見えてきます

かく言う私も他の虫々は
あまり得意ではありませんが…

幼少の習慣に勝る免疫なし、ですね`
        },
        {
            id: "high-context",
            slug: "high-context",
            contentType: "diary",
            published: true,
            secret: false,
            title: "ハイコンテクスト",
            date: "2026-08-12",
            author: "urara",
            initialPopularity: 0,
            related: [],
            body: `万人に伝わる
わかりやすい文章を書く

私はこの能力が欠落しています

「どんな味？」という問いに対し
脳内にある文章組み立て工場では
「黄色い」や「重たい」といった
直接つながらない言葉たちが
何食わぬ顔で並んでいるのです

黄色い果実のフレッシュな甘みとか
舌に重たく引きずるような苦みとか
そういうことを言いたいらしいのですが

中間の文脈を何段かすっ飛ばして
思いついたままに答えてしまうのです
子供かよ。

聞かん坊な脳には苦労しますが
突飛なアイデアを生み出す力の代償
ということでまあ許してやりましょう…

翻訳は任せるぞ、手元の優秀な頭脳君
本当この時代に救われてばかりです`
        },
        {
            id: "nadeshiko",
            slug: "nadeshiko",
            contentType: "diary",
            published: true,
            secret: false,
            title: "大和撫子",
            date: "2026-08-19",
            author: "urara",
            initialPopularity: 0,
            related: [
                {
                    type: "gallery",
                    label: "色かさね「撫子」を見る",
                    href: "gallery.html?category=illustration&work=nadeshiko"
                }
            ],
            body: `撫でたいほど可憐で清楚な花

張りついた固定観念で雁字搦め
少し崩れれば度を超えた向い風

いつもいつでもいつまでも
美しく生きることはできない
誰もが不安定で不合理なんだから
勝手な理想像を押し付けてくんな！

…なんて言いつつも、気づけば
誰かが詠った常夏の偶像を
自分の色だと思い込んで
身にまとってみたり。

まとわりつく恋の季節を忘れて
内から溢れた愛を手向ける在処へ
願わくは、
朽ちてゆく実像をも笑いあえる幸せを`
        },
        {
            id: "illumina-tor",
            slug: "illumina-tor",
            contentType: "diary",
            publicId: "c7e9df6b-6139-556c-bc5f-09a3bc445f3f",
            published: true,
            secret: false,
            title: "イルミネーター",
            date: "2026-08-26",
            author: "wimina",
            initialPopularity: 0,
            related: [
                {
                    type: "music",
                    label: "「イルミネーター」を聴く",
                    href: "music.html?track=illumina-tor"
                }
            ],
            body: `今更ですが、この楽曲について
語ってみようと思います

幽霊のような少女をかきたい。

写真？白装束？枯れ尾花？
人間の私がパッと思い浮かべた
ありきたりなステレオタイプは
どれもしっくりきませんでした

だから、幽霊になってみたのです。

蝉はiが何かを知っているから、
声として語り継がれたのでしょうか

私の声が届くことはなかった
身体が透けてしまったみたいで
初めて幽霊になった自分を視た

カゲロウが散った夏に降る
季節外れの雪はきっと、
声になれなかった少女の抜け殻

四季は何度も繰り返し、
記憶の中の彼女に色を塗る

消え果てた後にでもボクらの手が
誰かの眼に映っていたらいいね

誕生日おめでとう`
        }
    ]);

    const entryById = new Map(entries.map((entry) => [entry.id, entry]));
    const PUBLIC_STATES = new Set(["public"]);
    const GALLERY_DETAIL_STATES = new Set(["partial", "public"]);
    let publicationResult = null;
    let publicationLoadPromise = null;

    function localEntryEnabled(entry) {
        return Boolean(entry && entry.published !== false);
    }

    function parseRelatedGalleryTarget(entry) {
        const relation = Array.isArray(entry?.related)
            ? entry.related.find((item) => item?.type === "gallery" && item?.href)
            : null;
        if (!relation) return null;

        try {
            const url = new URL(relation.href, window.location?.href || "https://local.invalid/");
            const category = url.searchParams.get("category");
            const slug = url.searchParams.get("work");
            if (!slug) return null;

            const contentType = category === "illustration"
                ? "illustration"
                : category === "live2d"
                    ? "live2d"
                    : category === "works"
                        ? "works"
                        : null;
            return contentType ? { mode: "gallery", contentType, slug } : null;
        } catch (_) {
            return null;
        }
    }

    function publicationTarget(entry) {
        return parseRelatedGalleryTarget(entry) || {
            mode: "diary",
            contentType: "diary",
            slug: entry.slug
        };
    }

    function parseDiaryDateAsJst(entry) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(entry?.date || "")) return null;
        const value = Date.parse(`${entry.date}T00:00:00+09:00`);
        return Number.isFinite(value) ? value : null;
    }

    function publicationWithinWindow(record, now) {
        if (!record) return true;
        const publishAt = record.publishAt ? Date.parse(record.publishAt) : null;
        const unpublishAt = record.unpublishAt ? Date.parse(record.unpublishAt) : null;
        if (Number.isFinite(publishAt) && now < publishAt) return false;
        if (Number.isFinite(unpublishAt) && now >= unpublishAt) return false;
        return true;
    }

    function recordState(record) {
        return record?.rawState || record?.state || "hidden";
    }

    function isEntryAvailable(entryOrId, now = Date.now()) {
        const entry = typeof entryOrId === "string"
            ? entryById.get(entryOrId) || null
            : entryOrId;
        if (!localEntryEnabled(entry)) return false;

        const target = publicationTarget(entry);
        const publication = window.KotonoUraPublication;
        const record = publication?.get(publicationResult, target.contentType, target.slug) || null;

        if (target.mode === "gallery") {
            if (!record) return true;
            return GALLERY_DETAIL_STATES.has(recordState(record))
                && publicationWithinWindow(record, now)
                && record.sections?.detail !== false;
        }

        if (record) {
            if (!PUBLIC_STATES.has(recordState(record)) || !publicationWithinWindow(record, now)) {
                return false;
            }
            if (record.publishAt) return true;
        }

        const defaultPublishAt = parseDiaryDateAsJst(entry);
        return !Number.isFinite(defaultPublishAt) || now >= defaultPublishAt;
    }

    async function loadPublication() {
        if (publicationLoadPromise) return publicationLoadPromise;

        publicationLoadPromise = (async () => {
            const publication = window.KotonoUraPublication;
            if (!publication) {
                publicationResult = null;
                return null;
            }

            const contentTypes = [...new Set(entries.map((entry) => publicationTarget(entry).contentType))];
            publicationResult = await publication.load(contentTypes);
            return publicationResult;
        })();

        try {
            return await publicationLoadPromise;
        } finally {
            publicationLoadPromise = null;
        }
    }

    window.DIARY_ENTRIES = entries;
    window.DIARY_DATA = Object.freeze({
        entries,
        getById(id) {
            if (!id) return null;
            const entry = entryById.get(id) || null;
            return localEntryEnabled(entry) ? entry : null;
        },
        getAvailableById(id, now = Date.now()) {
            const entry = entryById.get(id) || null;
            return isEntryAvailable(entry, now) ? entry : null;
        },
        getAvailableEntries(now = Date.now()) {
            return entries.filter((entry) => isEntryAvailable(entry, now));
        },
        isAvailable: isEntryAvailable,
        publicationTarget,
        loadPublication
    });
})();
