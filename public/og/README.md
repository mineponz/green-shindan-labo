# OGP画像（ページ種別ごと）

トップページ以外のシェア時に代わり映えしない、という指摘（2026-08-19）を受けて追加。
`BaseLayout.astro`の`ogImagePath` propで出し分けている。

- `pachira.jpg` 〜 `tillandsia.jpg`: 植物8種それぞれの記事用。各種の見出し写真
  （`src/assets/photos/`）に、種名・学名を焼き込んだもの
- `guide-<slug>.jpg`: ガイド記事14本、それぞれ専用の1枚（`src/lib/guides.ts`のslugと対応）。
  2026-08-19時点では「数パターンでいい」という本人指示で`guide.jpg`1枚を共有していたが、
  2026-08-22に「文言を変えても画像が同じで記事の見分けがつかない」と本人指摘があり、
  8本それぞれに専用画像を作って`guide.jpg`は削除した。使う写真は`src/lib/plant-photos.ts`の
  `GUIDE_PHOTOS`（記事の見出し写真）と揃えている（シェア時と記事内で見た目が変わると
  違和感が出るため）
- それ以外のページ（トップ・植物図鑑一覧・ガイド一覧・プライバシー等）は`public/og-image.jpg`
  （トップページ用の元画像）のまま

## 生成方法
2026-09-13、`scripts/og/`にテンプレート化した（それまでは記事を足すたびにこのREADMEの実測値から
手作業で作り直していた。vault: `1-projects/green-lab/tasks/20260913-commit-ogp-generator.md`）。
**テンプレートはこのリポジトリに残っている**（`scripts/og/template.mjs`がHTML/CSS、
`scripts/og/generate.mjs`がCLI本体）。コマンド1発で生成できる:

```
npm run og -- --slug=root-rot --type=guide \
  --photo=src/assets/photos/root-rot.jpg \
  --heading="観葉植物の根腐れ" \
  --subcopy="見分け方と、まだ間に合う復活のさせ方" \
  --position="center 42%"
```

- `--type`は`guide`（既定。バッジ「お悩み解決ガイド」）か`plant`（バッジ「植物図鑑」・サブコピーは
  学名なので既定でitalic）
- 縦長・被写体が枠いっぱいの写真で`cover`だけだと切れる場合（後述）は`--two-layer`を付ける
- 見出しのfont-sizeは46〜52pxの範囲で1行に収まるよう自動見積りする（`--heading-size`で上書き可）
- 引数の全一覧は`scripts/og/generate.mjs`の先頭コメントを参照
- **mac + ローカルのGoogle Chrome前提のツール**（headless Chrome直叩き→`sips`でJPEG化。
  Playwrightには依存しない）。CI実行は未検証

再現確認: 2026-09-13に`guide-root-rot.jpg`（単層+`center 42%`）・`guide-soil.jpg`（単層+既定
center）・`guide-leaf-problems.jpg`（2層構成）の3枚をこのCLIで再生成し、コミット済み画像と
目視で一致することを確認済み（レイアウト用の余白・フォントサイズは下記の実測値をコードに
落としたもの。ただしヘッダー行・バッジの上下左右の余白だけは、下記の実測値の記述だと
ずれが出たため、既存画像をピクセル単位で計測し直して`top: 24px` / ロゴ`left: 24px` /
バッジ`right: 24px`に補正している）。

以下は2026-09-13にスクリプト化する前の実測値・判断根拠の記録（スクリプトの初期値の元ネタであり、
今後レイアウトを見直す時の背景情報として残す）。

実測値（2026-08-25に`guide-pruning.jpg`を再現したときのもの）:
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

2026-09-01の`guide-travel-watering.jpg`は、記事見出し写真と同じ`travel-watering.jpg`
（元写真1600×2400の縦長を`sips -c 1200 1600 --cropOffset 1050 0`で4:3=1600×1200に
切り出し済みのもの）を使ったが、4:3でも**単層cover＋`background-position: center`（既定）で
問題なかった**。スーツケース2つは画面の上下いっぱいには迫っておらず（上に天井寄りの余白、
下に床・ラグの余白がある構図）、coverでできる横840px相当の窓に収めても被写体が切れないため。
`guide-leaf-problems.jpg`（葉が枠の縦いっぱいを占める構図）とは違い、同じ4:3でも
2層構成が必須とは限らない——**まず単層coverを試してから**必要に応じて2層に切り替える判断でよい。

2026-09-05の`guide-soil.jpg`は、記事見出し写真と同じ`soil.jpg`（元写真1600×1067の横長トップビュー、
加工なし）を使い、**単層cover＋`background-position: center`（既定）で問題なかった**。
主題（土をすくって鉢へ入れている手元・下に広がる根と土の山）が画面の上下中央あたりに収まる構図で、
`guide-watering.jpg`と同様に位置調整なしでも被写体が切れなかった。

2026-09-12の`guide-root-rot.jpg`・`guide-plant-diseases.jpg`は、テンプレートHTML自体が
残っていなかったため、この節の実測値（ロゴ44px円・サイト名30px・バッジ22px・見出し46〜52px・
サブコピー26px・`.scrim`グラデーション）から新規に作り直した。どちらも記事見出し写真と同じ画像を使用。
- `guide-root-rot.jpg`: 記事見出し写真と同じ`root-rot.jpg`（4:3=1600×1200に切り出し済み）。
  単層cover＋`background-position: center 42%`（既定の中央だと軍手の指先が中央に寄りすぎるため
  やや上寄せ）
- `guide-plant-diseases.jpg`: 記事見出し写真と同じ`plant-diseases.jpg`（元写真1600×1067、
  加工なし）。単層cover＋`background-position: center 55%`（既定の中央だと右上の濃い斑点が
  バッジと重なるため、主題の斑点群がやや下に来るよう調整）
