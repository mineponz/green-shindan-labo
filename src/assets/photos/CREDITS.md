# 写真素材の出典

このフォルダの写真はすべて [Pexels](https://www.pexels.com/) のフリー素材。
**Pexels License**（商用利用可・改変可・クレジット表記の義務なし）にもとづいて使っている。
サイト上にクレジットは表示していないが、差し替え・再確認のためにここへ記録しておく。

| ファイル | 用途 | 撮影者 | 出典（ダウンロード元） |
|---|---|---|---|
| `hero-plants.jpg` | トップページのヒーロー | Sasha P | https://images.pexels.com/photos/11419079/pexels-photo-11419079.jpeg |
| `pachira.jpg` | パキラ記事の見出し | Kha Ruxury | https://images.pexels.com/photos/17151138/pexels-photo-17151138.jpeg |
| `monstera.jpg` | モンステラ記事の見出し | Anca | https://images.pexels.com/photos/7318283/pexels-photo-7318283.jpeg |
| `sansevieria.jpg` | サンスベリア記事の見出し | Mustafa Akın | https://images.pexels.com/photos/29218657/pexels-photo-29218657.jpeg |
| `pothos.jpg` | ポトス記事の見出し | Wendy Wei | https://images.pexels.com/photos/20337867/pexels-photo-20337867.jpeg |
| `gajumaru.jpg` | ガジュマル記事の見出し | Apurva Chandwadkar | https://images.pexels.com/photos/34551143/pexels-photo-34551143.jpeg |

- 取得日: 2026-08-12（`?auto=compress&cs=tinysrgb&w=1600` を付けて長辺1600pxで取得）
- 表示は `<Image>`（astro:assets）経由。リサイズとWebP変換はビルド時に走るので、
  ここに置く原本は加工せずそのまま残しておく。
- alt文言とどのslugに使うかは `src/lib/plant-photos.ts` が持っている。
  写真を差し替えたら **altも中身に合わせて必ず直す**（写っているものが変わるため）。
- 素材を追加するときは、この表に1行足してから使うこと。
