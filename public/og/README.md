# OGP画像（ページ種別ごと）

トップページ以外のシェア時に代わり映えしない、という指摘（2026-08-19）を受けて追加。
`BaseLayout.astro`の`ogImagePath` propで出し分けている。

- `pachira.jpg` 〜 `tillandsia.jpg`: 植物8種それぞれの記事用。各種の見出し写真
  （`src/assets/photos/`）に、種名・学名を焼き込んだもの
- `guide-<slug>.jpg`: ガイド記事12本、それぞれ専用の1枚（`src/lib/guides.ts`のslugと対応）。
  2026-08-19時点では「数パターンでいい」という本人指示で`guide.jpg`1枚を共有していたが、
  2026-08-22に「文言を変えても画像が同じで記事の見分けがつかない」と本人指摘があり、
  8本それぞれに専用画像を作って`guide.jpg`は削除した。使う写真は`src/lib/plant-photos.ts`の
  `GUIDE_PHOTOS`（記事の見出し写真）と揃えている（シェア時と記事内で見た目が変わると
  違和感が出るため）
- それ以外のページ（トップ・植物図鑑一覧・ガイド一覧・プライバシー等）は`public/og-image.jpg`
  （トップページ用の元画像）のまま

## 生成方法
`public/og-image.jpg`と同じ要領（Playwrightで1200x630のHTMLをスクリーンショット）。
テンプレートはこのリポジトリには残していない（一度きりの生成作業だったため）。
再生成する場合は、`src/assets/photos/<slug>.jpg`を背景に、左上にロゴ+サイト名、右上に
バッジ（植物ページは「植物図鑑」、ガイドは「お悩み解決ガイド」）、下部に見出し・学名（または
サブコピー）を置くレイアウトを再現すればよい。配色は`--accent`系のグリーン、見出しは白文字+
グラデーション影で背景写真の上でも読めるようにしている。

Playwrightが入っていない環境でも、同じHTMLをheadless Chromeで撮れば同じ結果になる
（2026-08-30の`guide-watering.jpg`・`guide-leaf-problems.jpg`はこの方法で生成した）:
```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu \
  --hide-scrollbars --force-device-scale-factor=1 --window-size=1200,630 \
  --screenshot=out.png file://<テンプレート.html>
```
写真は`<img>`ではなくCSSの`background`に**data URI**で埋め込むと、file://でも確実に読める。
PNGで撮ってからJPEG（quality 88）へ変換する。

実測値（2026-08-25に`guide-pruning.jpg`を再現したときのもの。次に作る人はここから始めると早い）:
ロゴは`public/favicon.svg`のパスを白い円（44px・`border-radius: 50%`）に載せ、
サイト名は白30px/太字。バッジは白背景の`border-radius: 999px`に`--accent`(#146c43)の22px/太字。
見出しは白46〜52px/太字（**1行に収まるサイズまで下げる**。既存はどれも1行）、サブコピーは白26px。
どちらも`text-shadow`＋下部の暗いグラデーション（`.scrim`）で背景写真から浮かせる。

### 注意: 縦長・被写体が小さい写真は`background-size: cover`だけだと切れる
2026-08-22、`gajumaru.jpg`と`areca-palm.jpg`で、鉢植え全体の周りに白背景の余白が大きい縦長写真
（`gajumaru.jpg`元写真1600×2189、`areca-palm.jpg`元写真1600×2133）を単純に
`background-size: cover`で1200×630に敷くと、被写体（鉢植えの上部）が枠の外に出て
見切れる不具合が発生した（本人指摘「ogpが全部写っていない」で発覚）。
横幅1200pxに合わせてcoverすると、切り出せる縦の窓（630px相当）より被写体の縦の占有範囲の方が
大きいため、どの`background-position`を選んでも上下どちらかが切れる。
対策として、そういう写真は2層構成にした: ①同じ写真を`background-size: cover`+
`filter: blur(28px) brightness(0.9)`でカード全面に敷く下地レイヤー、②その上に
`background-size: auto 630px`（＝高さぴったりで幅は縦横比なりに自動計算、横は必ず余る）で
被写体を一切トリミングしないシャープな前面レイヤーを重ねる。写真自体の白背景と下地のぼかしが
自然になじむため、レターボックスの継ぎ目が目立たない。閉じたクロースアップ写真
（`pachira.jpg`等、被写体が枠いっぱいに近い）はこの対策不要、従来通り単層coverでよい。

2026-08-30の2枚も同じ判断で作り分けた:
- `guide-watering.jpg`: 元写真1600×1068の横長クローズアップ。単層cover＋
  `background-position: center 60%`（既定の中央だと鉢の底が切れるので少し下寄せ）
- `guide-leaf-problems.jpg`: 元写真1600×1200（4:3）で、葉が枠の縦いっぱいを占める。
  単層coverだと葉の上下どちらかが必ず切れるため上記の2層構成にした
