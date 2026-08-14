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
| `peperomia.jpg` | ペペロミア記事の見出し | TU HAN-WEI | https://images.pexels.com/photos/25408843/pexels-photo-25408843.jpeg |
| `tillandsia.jpg` | チランジア記事の見出し | Chandra Lynch | https://images.pexels.com/photos/971214/pexels-photo-971214.jpeg を`sips -c 1200 1600 --cropOffset 1030 0`で切り出し（下記） |
| `areca-palm-thumb.jpg` | アレカヤシの一覧・診断結果カードのサムネイル専用 | Tuğba Dönmez（`areca-palm.jpg`と同じ原本） | 同上を`sips -c 1250 1250 --cropOffset 470 95`で葉と鉢の口が入る構図に切り出し |
| `tillandsia-thumb.jpg` | チランジアの一覧・診断結果カードのサムネイル専用 | Chandra Lynch（`tillandsia.jpg`と同じ原本） | ダウンロードした原本を`sips -c 1250 1250 --cropOffset 1000 50`で株が中央に来るよう切り出し |

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
- 取得日: 2026-08-13（`?auto=compress&cs=tinysrgb&w=1600` を付けて長辺1600pxで取得）
- 表示は `<Image>`（astro:assets）経由。リサイズとWebP変換はビルド時に走るので、
  ここに置く原本は加工せずそのまま残しておく。
- alt文言とどのslugに使うかは `src/lib/plant-photos.ts` が持っている。
  写真を差し替えたら **altも中身に合わせて必ず直す**（写っているものが変わるため）。
- 素材を追加するときは、この表に1行足してから使うこと。
