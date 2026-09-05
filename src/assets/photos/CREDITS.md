# 写真素材の出典

このフォルダの写真はすべて [Pexels](https://www.pexels.com/) のフリー素材。
**Pexels License**（商用利用可・改変可・クレジット表記の義務なし）にもとづいて使っている。
サイト上にクレジットは表示していないが、差し替え・再確認のためにここへ記録しておく。

| ファイル | 用途 | 撮影者 | 出典（ダウンロード元） |
|---|---|---|---|
| `hero-plants.jpg` | トップページのヒーロー | Alex Tyson | https://images.pexels.com/photos/19980205/pexels-photo-19980205.jpeg |
| `pachira.jpg` | パキラ記事の見出し | Kenneth Surillo | https://images.pexels.com/photos/22610789/pexels-photo-22610789.jpeg |
| `monstera.jpg` | モンステラ記事の見出し | Danna Putra | https://images.pexels.com/photos/32293880/pexels-photo-32293880.jpeg |
| `sansevieria.jpg` | サンスベリア記事の見出し | Damian Apanasowicz | https://images.pexels.com/photos/4185555/pexels-photo-4185555.jpeg |
| `pothos.jpg` | ポトス記事の見出し | Aleksander Dumała | https://images.pexels.com/photos/20075996/pexels-photo-20075996.jpeg |
| `gajumaru.jpg` | ガジュマル記事の見出し | Elīna Arāja | https://images.pexels.com/photos/4050790/pexels-photo-4050790.jpeg |
| `sansevieria-thumb.jpg` | サンスベリアの一覧・診断結果カードのサムネイル専用 | Damian Apanasowicz（`sansevieria.jpg`と同じ原本） | 同上を`sips -c 1000 1000 --cropOffset 0 600`で株が中央に来るよう切り出し |
| `gajumaru-thumb.jpg` | ガジュマルの一覧・診断結果カードのサムネイル専用 | Elīna Arāja（`gajumaru.jpg`と同じ原本） | 同上を`sips -c 900 900 --cropOffset 380 280`で葉のアップ・鉢が写らない構図に切り出し |
| `areca-palm.jpg` | アレカヤシ記事の見出し | Tuğba Dönmez | https://images.pexels.com/photos/12982687/pexels-photo-12982687.jpeg |
| `peperomia.jpg` | ペペロミア記事の見出し | Kenneth Surillo | https://images.pexels.com/photos/22610809/pexels-photo-22610809.jpeg |
| `tillandsia.jpg` | チランジア記事の見出し | Chandra Lynch | https://images.pexels.com/photos/971214/pexels-photo-971214.jpeg を`sips -c 1200 1600 --cropOffset 1030 0`で切り出し（下記） |
| `areca-palm-thumb.jpg` | アレカヤシの一覧・診断結果カードのサムネイル専用 | Tuğba Dönmez（`areca-palm.jpg`と同じ原本） | 同上を`sips -c 1250 1250 --cropOffset 470 95`で葉と鉢の口が入る構図に切り出し |
| `tillandsia-thumb.jpg` | チランジアの一覧・診断結果カードのサムネイル専用 | Chandra Lynch（`tillandsia.jpg`と同じ原本） | ダウンロードした原本を`sips -c 1250 1250 --cropOffset 1000 50`で株が中央に来るよう切り出し |
| `pruning.jpg` | 剪定・切り戻しガイド記事の見出し（`GUIDE_PHOTOS.pruning`） | Kaboompics.com（Pexels: @karola-g） | https://images.pexels.com/photos/6640505/pexels-photo-6640505.jpeg |
| `watering.jpg` | 水やりガイド記事の見出し（`GUIDE_PHOTOS.watering`） | ROCKETMANN TEAM（Pexels: @rocketmann-prod） | https://images.pexels.com/photos/9507264/pexels-photo-9507264.jpeg |
| `leaf-problems.jpg` | 葉のトラブルガイド記事の見出し（`GUIDE_PHOTOS['leaf-problems']`） | Inga Seliverstova（Pexels: @inga-sv） | https://images.pexels.com/photos/3371463/pexels-photo-3371463.jpeg を`sips -c 1200 1600 --cropOffset 250 0`で切り出し（下記） |
| `travel-watering.jpg` | 留守中・旅行中の水やりガイド記事の見出し（`GUIDE_PHOTOS['travel-watering']`） | Vlada Karpovich（Pexels: @vlada-karpovich） | https://images.pexels.com/photos/7368306/pexels-photo-7368306.jpeg を`sips -c 1200 1600 --cropOffset 1050 0`で切り出し（下記） |
| `soil.jpg` | 土・用土選びガイド記事の見出し（`GUIDE_PHOTOS.soil`） | Prathyusha Mettupalle（Pexels: @prathsnap） | https://images.pexels.com/photos/18864982/pexels-photo-18864982.jpeg |

- 2026-08-13: 管理者の指示（「もっときれいめに」、参考: livingorchid.comの商品写真のような
  明るい・背景がすっきりした雰囲気）で全6枚を差し替え。旧版（暗め・生活感のある写真）から、
  白系の背景で鉢ごと写った明るい写真に統一。
- 2026-08-13: 56角の小さいサムネイルだとサンスベリアが中央からズレて見える／ガジュマルが
  幹・鉢ばかりでまっすぐ育っている印象にならない、という管理者フィードバックを受け、
  この2種だけ`-thumb.jpg`という別カットを追加（`plant-photos.ts`の`thumbSrc`で指定）。
  記事見出しの大きい写真（`sansevieria.jpg`/`gajumaru.jpg`）は変更していない。
- 2026-08-14: ペットに安全な種を増やす対応（アレカヤシ・ペペロミア・チランジア）で3枚を追加。
  取得日は2026-08-14、同じく`?auto=compress&cs=tinysrgb&w=1600`付きで取得。
  - `tillandsia.jpg` は**構図そのものを切り出している**（原本は上半分がほぼ何も写っていない余白で、
    見出し写真の4:3切り抜き（`PlantArticleHeader.astro`）に掛けると株が画面外へ出てしまうため）。
    切り出しコマンドは表に記載。原本はPexelsのURLから再取得できる。
  - アレカヤシ・チランジアは56角のサムネイルだと株が小さすぎて何の植物か分からないので、
    `-thumb.jpg`の別カットを用意した（`plant-photos.ts`の`thumbSrc`）。
    ペペロミアは葉が画面いっぱいに写っているので専用カットは不要。
- 2026-08-14: 管理者から「ペペロミアはもう少し明るい色のものを」と指摘。スイカペペロミア
  （濃い緑×白の縞、25408843）から、斑入り種（クリーム色×緑、22610809、撮影者Kenneth Surillo）へ
  差し替え。altも中身に合わせて更新済み。
- 2026-08-25: ガイド記事10本目「剪定・切り戻し」用に`pruning.jpg`を1枚追加。
  **このフォルダで唯一「植物の種の紹介写真ではない」素材**（作業風景）。
  `GUIDE_PHOTOS`はヒーロー写真＋植物8種の計9枚を9記事で1枚ずつ使い切っていて、
  10本目で使い回すと「記事の見分けがつかない」（2026-08-22の指摘）が再発するため新規調達した。
  取得日は2026-08-25、同じく`?auto=compress&cs=tinysrgb&w=1600`付きで取得（1600×1067）。
  既存写真と同じ「明るい・背景がすっきり」の基準で選定している。
- 2026-08-30: ガイド記事11・12本目（水やり／葉のトラブル）用に`watering.jpg`・
  `leaf-problems.jpg`を2枚追加。`pruning.jpg`と同じ理由（記事ごとに写真を重複させない）で
  新規調達している。取得日は2026-08-30、同じく`?auto=compress&cs=tinysrgb&w=1600`付きで取得。
  - `watering.jpg` は原本のまま（1600×1068）。木のテーブルの上の白い鉢へ、細口のじょうろから
    水を注いでいる手元のクローズアップ。
  - `leaf-problems.jpg` は**構図を切り出している**（原本は1600×2133の縦長で、下部に暖房の配管が
    写り込んでいるうえ、見出し写真の4:3切り抜き（`GuideArticleHeader.astro`）に掛けると
    葉の上半分が画面外へ出てしまうため）。切り出しコマンドは表に記載。原本はPexelsのURLから
    再取得できる。**モンステラの葉だが、`PLANT_PHOTOS.monstera`（健康な株の紹介写真）とは
    別物**なので差し替えるときに取り違えないこと。
- 2026-09-01: ガイド記事13本目（留守中・旅行中の水やり対策）用に`travel-watering.jpg`を1枚追加。
  `pruning.jpg`・`watering.jpg`・`leaf-problems.jpg`と同じ理由（記事ごとに写真を重複させない）で
  新規調達している。取得日は2026-09-01、同じく`?auto=compress&cs=tinysrgb&w=1600`付きで取得。
  - **構図を切り出している**（原本は1600×2400の縦長。見出し写真の4:3切り抜き
    （`GuideArticleHeader.astro`）に素で掛けると、スーツケースの下半分か鉢植えのどちらかが
    画面外へ出てしまうため、両方が収まる範囲を選んだ）。切り出しコマンドは表に記載。
    原本はPexelsのURLから再取得できる。
  - 写っているのは「出発前のスーツケース＋家に残る鉢植え」で、これも**植物の種の紹介写真ではない**
    （`pruning.jpg`と同じ性格の素材）。PLANT_PHOTOSには入れず`GUIDE_PHOTOS`だけで持っている。
- 2026-09-05: ガイド記事14本目（土・用土選び）用に`soil.jpg`を1枚追加。上と同じ理由（記事ごとに
  写真を重複させない）で新規調達している。取得日は2026-09-05、同じく
  `?auto=compress&cs=tinysrgb&w=1600`付きで取得（1600×1067、原本のまま加工なし）。
  白い机の上で、根がむき出しの株を鉢へ植えようとしている手元のクローズアップ。写真検索は
  `pexels.com/search/`への直curlがCloudflareに弾かれたため、`r.jina.ai`経由の読み取りプロキシで
  検索結果ページを取得して選定した（vault:
  3-resources/knowledge/20260830-pexels-search-cloudflare-workaround.md のBing画像検索と並ぶ
  もう一方の回避策。今回はこちらが通った）。写っているのは「植え替え中の手元」で
  `pruning.jpg`等と同じく植物の種の紹介写真ではないため、PLANT_PHOTOSには入れず
  `GUIDE_PHOTOS`だけで持っている。
- 取得日: 2026-08-13（`?auto=compress&cs=tinysrgb&w=1600` を付けて長辺1600pxで取得）
- 表示は `<Image>`（astro:assets）経由。リサイズとWebP変換はビルド時に走るので、
  ここに置く原本は加工せずそのまま残しておく。
- alt文言とどのslugに使うかは `src/lib/plant-photos.ts` が持っている。
  写真を差し替えたら **altも中身に合わせて必ず直す**（写っているものが変わるため）。
- 素材を追加するときは、この表に1行足してから使うこと。
