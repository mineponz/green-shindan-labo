# green-shindan-labo（グリーン診断ラボ）

観葉植物の診断＋紹介サイト（Amazonアソシエイト主軸）。すべて静的サイト
（Astro + Cloudflare Workers の静的アセット配信）。
運用記録・タスク管理は別リポジトリの Obsidian vault（`~/secondBrain`）側にある
（`1-projects/green-lab/`）。技術構成の手本は姉妹サイト `~/workspace/medaka-labo`。

## このリポジトリの方針

- **植物データと診断ロジックは `src/lib/plants.ts` に集約する（唯一の出所）。**
  設問（`QUESTIONS`）・植物5種（`PLANTS`）・スコアリング（`scorePlant` / `recommendPlants`）が
  1ファイルに入っている。フォームのvalueと採点ロジックがずれる事故を防ぐため、
  選択肢は必ずこの型を経由して描く。
- **診断結果のカードもビルド時にHTMLへ書き出す。** クライアントJSがやるのは
  「どのカードを見せるか」「CSSの`order`で並べ替える」だけ。
  一覧や本文を`innerHTML`で描くとクローラーには空ページに見える
  （vault: `3-resources/knowledge/20260811-client-render-kills-seo.md`）。
  **`innerHTML`は使わない**（`textContent`と`hidden`属性だけを使う）。
- **診断の回答はサーバーへ送らない。** 保存するとしても localStorage（利用者の端末）まで。
  localStorage の値も外部入力として扱い、`parseAnswers`で検査してから使う。
- **記事には必ずPR表記を入れる。** 「本記事はプロモーションを含みます」を各記事冒頭に置く
  （景表法ステマ規制対応）。`PlantArticleHeader.astro`が自動で出す。
- **Amazon商品リンクは検索結果ページへのリンクにする（`src/components/AmazonLink.astro`）。**
  実在を確認していない特定ASIN（商品コード）へ直リンクしない。実際に使う商品が決まったら、
  個別記事内でそのリンクだけを`dp/<ASIN>`形式に差し替える。
- **ペットへの安全性の記載は「一般に知られている情報のまとめ」であって獣医学的助言ではない。**
  断定を避け、誤食時は動物病院へという導線を残す（`/privacy/` 8節）。
- **写真は `src/assets/photos/` に置き、`<Image>`（astro:assets）で出す。**
  対応表と alt は `src/lib/plant-photos.ts`、出典は `src/assets/photos/CREDITS.md`。
  `src/lib/plants.ts` は `node --test` から素のNodeで読まれるので、**あちらに画像importを
  持ち込まない**（テストが動かなくなる）。データと素材はファイルを分ける。
- **デザインは vault の `2-areas/playbooks/design.md` のチェックリストに沿う。**
  色は役割ごとに固定（`--accent`=主要CTA / `--highlight`=補助強調 / `--warn`=警告 /
  `--danger`=エラー）、余白は8pxグリッド（`--space-*`）、見出しは比率1.25のスケール
  （`--text-*`）。中間値をその場で足さない。

## コマンド

```
npm run dev      # 開発サーバー
npm test         # src/lib/*.test.ts を実行（node:test）
npm run check    # 型チェック + テスト
npm run build    # dist/ に静的出力
npm run preview  # ビルド結果を配信して確認
```

Node は fnm 管理。シェルによっては先に
`export PATH="/opt/homebrew/bin:$PATH"; eval "$(fnm env --shell zsh)"` が必要。

## 植物を追加する手順

1. `src/lib/plants.ts` の `PLANTS` に1件足す（`slug`はケバブケース、属性は1〜5）
2. `src/pages/plants/<slug>.astro` を作る（既存記事をコピーして書き換えるのが早い）
3. 見出し写真を `src/assets/photos/` に置き、`src/lib/plant-photos.ts` の `PLANT_PHOTOS` へ
   slugをキーに追加する。出典は `src/assets/photos/CREDITS.md` に1行足す
4. `npm test` を通す（`validatePlants`と診断ロジックの網羅テストが走る）
5. 追加すると診断の結果分布が変わる。テスト
   「全36パターンを合わせると、5種すべてが少なくとも1回はおすすめされる」が
   落ちたら、属性値かスコアの重みを見直す

## 診断ロジックの考え方

- 各植物は5つの属性（`sun` 日ざしへの強さ / `shade` 耐陰性 / `ease` ズボラ耐性 /
  `pest` 虫のつきにくさ / `interior` 存在感）を1〜5で持つ
- 設問ごとに配点する（日当たり・手間・重視したいことは属性×2、ペットは±6）
- Q3「重視したいこと」は3択。「どちらも」は `pest + interior`＝配点を2つの属性に**按分**する。
  片方に全振りした場合と総量をそろえているので、「どちらも」を選んでも点が過大にならない
  （`pest*2` と `interior*2` のちょうど中間になることをテストで固定している）
- 全回答パターンは 3×2×3×2 = **36通り**（`allAnswerCombinations`）
- 合計点の1位を必ず出し、2位は1位との差が4点以内のときだけ添える（＝結果は1〜2種）
- ペット加点（±6、安全/危険で±なので逆転できる幅は12点）は属性由来の点差の最大
  （36パターンでの実測8点）を上回る設計なので、「ペットがいる」を選ぶと必ずペットに
  安全な植物が1位になる。この関係はテストで実測して固定している
  （「ペット加点（±6）は属性由来の点差の最大を上回る」）。配点を触ったらまずここが落ちる

## 未対応・要本人作業

- `src/consts.ts` の `AMAZON_ASSOCIATE_TAG` はプレースホルダ。Amazonアソシエイトに
  登録して発行された実タグに差し替える。差し替えると、プライバシーポリシーの文言が
  「参加を予定」→「参加している」に、フッターの開示文が自動で出るようになる。
  あわせて `PRIVACY_POLICY_UPDATED` も更新すること。
- `src/consts.ts` の `CONTACT_EMAIL` もプレースホルダ。差し替えるまで
  `/contact/` は mailto を出さず「準備中」と表示する。
- Cloudflareダッシュボードでのリポジトリ接続（新規プロジェクト作成）は本人のブラウザ操作が必要。
  Deploy command は `npx wrangler deploy`。ビルドは `wrangler.jsonc` の `build.command` が
  実行するので、ダッシュボードのBuild command欄への設定は不要。
- 独自ドメインを設定したら `src/consts.ts` の `SITE_URL` と `public/robots.txt` を両方直す。
