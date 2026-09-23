# 木戸弦楽器工房 — 制作デモ

piulo（坂田真子）のポートフォリオ用に制作した、架空の弦楽器修理工房のWebサイトです。
店名・人物・所在地・料金・修理記録はすべて架空のものです。実在の工房とは関係ありません。

静的HTMLのみで動きます。ビルド不要。`index.html` をブラウザで開けばそのまま見られます。

---

## ページ構成

| ファイル | 内容 |
| --- | --- |
| `index.html` | トップ。ヴァイオリン解剖図のインタラクティブ・ヒーロー |
| `repair.html` | 修理と料金（ヴァイオリン属／ギター／弓の3表） |
| `diagnosis.html` | 症状から見立てを出す診断シミュレーター |
| `records.html` | 修理記録。開くと採寸値（before→after）と職人の判断が出る |
| `workshop.html` | 工房の考え方・職人ふたり・設備・沿革 |
| `contact.html` | 持ち込みの流れ・相談フォーム（デモ動作）・アクセス・FAQ |

```
kido-strings/
├── index.html / repair.html / diagnosis.html / records.html / workshop.html / contact.html
├── assets/
│   ├── site.css        共通（トークン・版面・表・折りたたみ・フォーム）
│   ├── hero.css        トップの解剖図
│   ├── diagnosis.css   診断画面
│   ├── anatomy.js      解剖図の部位ハイライト
│   ├── diagnosis.js    見立てロジック（症例データ込み）
│   └── form.js         相談フォームの検証とデモ応答
├── images/
│   ├── violin-front.svg   ヴァイオリン正面図（自作）
│   ├── guitar-front.svg   アコースティックギター正面図（自作）
│   └── favicon.svg
└── README.md
```

---

## デザインの考え方

**中心にある考え：修理工房の言語は「採寸」である。**

飾りとしての線や番号を使わず、構造そのものを工房のカルテに寄せています。

- **左の細い欄（`.chart > .note`）** は注記と採寸のためだけの余白。ここに入るのは必ず実際の情報（湿度、料金の前提、記録の読み方）で、飾りの見出しは入れていない。
- **琥珀色（`#b4762a`）はニスの色**。使うのは「実際に測った数値」と「いま選んでいる状態」だけ。それ以外の場所には出さない。
- **影とカードを使わない**。階層は面の色（`--stone` / `--stone-deep` / `--paper` / `--bench`）そのものを変えてつくる。
- **動きは1回だけ**。トップを開いたときに線画が描かれる一度きり。セクションごとのフェードインやカードのホバー演出は入れていない。

### 配色

| 変数 | 値 | 役割 |
| --- | --- | --- |
| `--stone` | `#d7d9d1` | 基本の地。削ったスプルースの木口 |
| `--stone-deep` | `#c6c9be` | 一段沈めた面 |
| `--paper` | `#eceee7` | 書き込む面（フォーム・見立てカード） |
| `--bench` | `#23251f` | 作業台。深いオリーブ黒 |
| `--ink` | `#1a1d19` | 文字と線 |
| `--amber` | `#b4762a` | ニス。数値と現在地にだけ |
| `--verdigris` | `#4c6660` | 道具の柄、古い金具 |

### 書体

システムフォントのみ（外部読み込みなし）。
- 見出し・本文：明朝（Hiragino Mincho ProN → Yu Mincho → Noto Serif JP）＋ 欧文セリフ
- UI・数値：ゴシック（Hiragino Kaku Gothic ProN → Yu Gothic → Noto Sans JP）
- 数値は等幅フォントではなく `font-variant-numeric: tabular-nums` で桁を揃えている

### 意図的に避けたもの

frontend-designスキルが「AI生成の定番」として挙げているパターンを、指示にしたがって全部外しています。

- 見出しの上に置く英字全大文字のeyebrowラベル（WHY US / ABOUT 等）→ 一切なし
- 「01 — LIGHT」のようなスペース付きem-dashの番号ラベル → なし。番号を振ったのは**本当に順序があるもの**だけ（診断の3ステップ、持ち込みから返却までの5段階）
- 小さいラベルへの等幅フォント → 使わず、tabular-nums で代替
- クリーム地＋テラコッタ（#D97757付近）→ 冷たい石灰グレー＋ニスの琥珀に置換
- SaaSカード風の均一な角丸＋同じ影 → 角丸は操作要素の2pxのみ、影はゼロ
- ボタン文字末尾の「→」、中黒でつないだメタ情報 → なし

---

## 画像について

**Unsplash等からの写真はダウンロードできませんでした。**
クラウド側・ローカル側の両方から確認しましたが、このセッションのegress設定ではパッケージレジストリとGitHubにしか到達できず、Unsplash / Pexels / Pixabay / Wikimedia のいずれもブロックされていました。

そのため、**楽器の線画をSVGで自作**し、それをビジュアルの主役に据える方向に切り替えています。
ライセンスの心配がゼロで、かつ「ストック写真を並べたAIっぽいサイト」からいちばん遠い方向でもあります。

- `images/violin-front.svg` — 実寸比（全長356mmの胴、上下バウツ・C字ウエスト・f字孔・駒・魂柱位置）を踏まえて作図
- `images/guitar-front.svg` — スケール長645mm・14フレットジョイントから割り出したフレット位置で作図

### あとから写真を入れたい場合

線画は削らず、写真を「面」として追加するのがいちばん収まります。おすすめの差し込み先は3か所です。

1. **トップのヒーロー背景** — `.hero` に作業台の俯瞰写真を暗く敷く
   ```css
   .hero {
     background-image: linear-gradient(rgba(35,37,31,.88), rgba(35,37,31,.94)), url("../images/bench.jpg");
     background-size: cover;
     background-position: center;
   }
   ```
2. **`workshop.html` の「工房の中」** — `.figure-wide` のギター線画を工房の写真に差し替えるか、線画の隣に並べる
3. **`records.html` の各記録** — `<details>` の中、`<table class="measures">` の直前に施工写真を入れると「カルテ＋写真」になって強い

写真を探すときの想定キーワード（Unsplash）：
`luthier workshop` / `violin repair` / `guitar luthier bench` / `woodworking hand plane` / `violin scroll close up` / `guitar fretboard macro`

ダウンロードするなら、egressを「全ドメイン許可」にしたうえで `images/` 直下に保存し、上のCSS/HTMLからローカルパスで参照してください。

---

## 技術メモ

- 依存ライブラリなし。JSは3ファイル、いずれもプレーンなES5相当。
- 診断ロジックは `assets/diagnosis.js` の `CASES` に、楽器系統×症状の14ケース分のデータとして持たせています。金額は楽器ごとの係数（チェロ1.6倍、エレキ0.9倍など）で自動計算。
- フォームは送信先を持たないデモです。送信すると「デモのため送信されません」と表示されます。
- 到達性：スキップリンク、`:focus-visible` の可視化、`aria-current` / `aria-live`、`prefers-reduced-motion` 対応、画像のalt、375px幅までのレスポンシブを確認済み。
- 解剖図のホバー内容はキーボード操作（Tab）でも同じように読めます。
