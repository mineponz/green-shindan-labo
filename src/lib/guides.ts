/**
 * 横断ガイド記事のメタデータ。
 *
 * 植物1種ずつの記事（/plants/<slug>/）に対して、こちらは「虫対策」「日当たり」「ペット」など
 * **テーマ横断の記事**（/guides/<slug>/）の一覧・見出し・リード文を持つ唯一の出所。
 * 一覧ページ（/guides/）と各記事ページが同じデータから描かれるので、タイトルや
 * 紹介文が二重管理でずれることがない。
 *
 * 本文（h2以下）は各 `src/pages/guides/<slug>.astro` に直接書く（植物記事と同じ流儀）。
 * ビルド時に静的HTMLへ出るので、クローラーにもJS無効でも中身が見える
 * （vault: 3-resources/knowledge/20260811-client-render-kills-seo.md）。
 *
 * `plants.ts` と同じく、このファイルは `node --test` から素のNodeで読まれる。
 * **画像importを持ち込まない**（見出し写真の対応表は src/lib/plant-photos.ts の GUIDE_PHOTOS）。
 */

export interface Guide {
  slug: string;
  /** 記事のh1・一覧カードに出す見出し（長め。検索意図をそのまま入れている） */
  title: string;
  /** <title>・パンくずに使う短いラベル。h1が長い記事でタイトルが冗長になるのを避ける */
  navLabel: string;
  /** meta description */
  description: string;
  /** 一覧カードに出す1〜2行の紹介 */
  summary: string;
  /**
   * 記事冒頭のリード文。
   * 「AIっぽくならないように一人称と感情表現を入れる」という本人の指示に沿って書いている
   * （vault: 3-resources/knowledge/feedback-affili-lab-article-tone）。
   * テストで「私」が含まれることを固定しているので、書き換えるときも人称は残すこと。
   */
  lead: string;
  /** この記事でとくにおすすめしている植物のslug（一覧カードのタグに出す） */
  relatedPlants: string[];
  /** ISO 8601 (YYYY-MM-DD) */
  publishedDate: string;
}

/** 掲載順＝一覧ページでの並び順 */
export const GUIDES: Guide[] = [
  {
    slug: 'pest-control',
    title: '観葉植物の虫対策ガイド｜コバエ・ハダニ・カイガラムシの見分け方と対処法',
    navLabel: '観葉植物の虫対策ガイド',
    description:
      '観葉植物によくつくコバエ（キノコバエ）・ハダニ・カイガラムシの見分け方と、それぞれの原因・対処法・予防法をまとめました。紹介している8種の「虫のつきにくさ」の比較もあります。',
    summary:
      '土のまわりを飛ぶ小バエ、葉裏の白いかすれ、茎についた貝殻のようなもの。よくつく3種類の虫の正体と、慌てずにできる対処法をまとめました。',
    lead:
      '観葉植物を育てていて、いちばん「うわっ」となる瞬間って、虫を見つけたときじゃないでしょうか。' +
      '私も土のまわりを小さい虫がふわふわ飛んでいるのを見つけて、心底ぎょっとした経験があります。' +
      'でも慌てなくて大丈夫。虫の正体さえわかれば、対処はそこまで難しくありません。' +
      'ここでは観葉植物によくつく3種類の虫と、その対処法をまとめました。',
    relatedPlants: ['sansevieria', 'pachira'],
    publishedDate: '2026-08-14',
  },
  {
    slug: 'low-light-plants',
    title: '日当たりが悪い部屋でも育つ観葉植物まとめ',
    navLabel: '日当たりが悪い部屋でも育つ観葉植物',
    description:
      '北向きの部屋や窓から離れた場所でも育てやすい観葉植物を、耐陰性の高い順に紹介します。日当たりが悪い部屋ならではの水やりのコツ、植物育成ライトの使いどころもまとめました。',
    summary:
      '北向き、窓から遠い、レースカーテン越し。そんな部屋でも育つ植物を耐陰性の高い順に紹介します。避けたほうがいい種類も正直に書きました。',
    lead:
      '「うちは日当たりが悪いから、観葉植物は無理かも……」そう思って諦めていませんか？' +
      '私も最初はそう思っていたひとりです。でも実は、耐陰性の高い植物を選べば、日当たりに' +
      '自信がない部屋でも十分に緑のある暮らしを楽しめます。ここでは、日当たりが悪めの部屋でも' +
      '育てやすい植物を紹介します。',
    relatedPlants: ['pothos', 'pachira'],
    publishedDate: '2026-08-14',
  },
  {
    slug: 'pet-safe-plants',
    title: 'ペットに安全な観葉植物の選び方',
    navLabel: 'ペットに安全な観葉植物の選び方',
    description:
      '犬や猫と暮らしている人向けに、紹介している8種のうち非毒性とされている4種（パキラ・アレカヤシ・ペペロミア・チランジア）と、そのほかの植物を置く場合の注意点（含まれる成分・症状・置き方の工夫）をまとめました。',
    summary:
      '「うちの子が齧っても大丈夫かな」が気になる人へ。8種のうち非毒性とされている4種はどれか、ほかを置くならどう気をつけるかをまとめました。',
    lead:
      '犬や猫と暮らしていると、観葉植物を選ぶときにどうしても気になるのが「誤食」の心配ですよね。' +
      '私自身、植物を置くたびに「これ、うちの子が齧っても大丈夫かな」と気になってしまいます。' +
      'ここでは、今回紹介している8種の中で実際に安全性が確認されている4種と、他の植物を' +
      '置く場合の注意点をまとめました。',
    relatedPlants: ['pachira', 'areca-palm', 'peperomia', 'tillandsia'],
    publishedDate: '2026-08-14',
  },
  {
    slug: 'seasonal-care',
    title: '観葉植物の夏越し・冬越しガイド｜季節ごとの水やりと置き場所',
    navLabel: '観葉植物の夏越し・冬越しガイド',
    description:
      '夏の葉焼け・水切れ・蒸れと、冬の水やりの頻度・暖房の風・葉水。季節の変わり目に気をつけたいお手入れをまとめました。紹介している8種それぞれの季節との相性も、日ざしへの強さと耐陰性から見ています。',
    summary:
      '夏は葉焼けと蒸れ、冬は水のやりすぎ。季節の変わり目でつまずきやすいところと、置き場所・水やりの変え方をまとめました。',
    lead:
      '観葉植物を育てはじめて、私が一番戸惑ったのが季節の変わり目でした。' +
      'いつも通りに水やりをしていたら、冬に根腐れさせてしまった経験があります。' +
      '夏と冬、それぞれ何に気をつければいいのかをまとめました。' +
      '難しいことはしていません。置き場所と水やりを、少しずらしてあげるだけです。',
    relatedPlants: ['sansevieria', 'pothos'],
    publishedDate: '2026-08-15',
  },
  {
    slug: 'pot-guide',
    title: 'おしゃれな鉢・プランターの選び方｜鉢底の穴・素材・サイズの決め方',
    navLabel: 'おしゃれな鉢・プランターの選び方',
    description:
      '観葉植物の鉢の選び方をまとめました。まず確認したい鉢底の穴と鉢カバーを使う二重鉢のやり方、素焼き（テラコッタ）・陶器・プラスチックの素材別の特徴、失敗しやすいサイズの目安、紹介している8種との相性まで。',
    summary:
      '気に入った鉢に底穴が無い、根腐れさせた、なんだか安っぽく見える。鉢選びでつまずくところを、穴・素材・サイズの3点にしぼって整理しました。',
    lead:
      '植物そのものより、じつは鉢のほうが部屋の印象を決めていると私は思っています。' +
      '同じパキラでも、鉢が変わるだけで別の一鉢に見えるくらいです。' +
      'とはいえ私も、見た目だけで選んだ鉢に底穴が無くて根腐れさせたり、' +
      '奮発したはずが妙に安っぽく見えたりと、それなりに失敗してきました。' +
      'ここでは鉢底の穴・素材・サイズの3点にしぼって、鉢の選び方をまとめます。',
    relatedPlants: ['pachira', 'sansevieria'],
    publishedDate: '2026-08-16',
  },
];

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * GUIDES の形式が壊れていないかを検証する（テスト用の純粋関数）。
 * `plantSlugs` を渡すと、relatedPlants が実在する植物を指しているかも確認する
 * （リンク切れの内部リンクを記事に置かないため）。
 */
export function validateGuides(guides: Guide[], plantSlugs: string[] = []): string[] {
  const errors: string[] = [];
  const seenSlugs = new Set<string>();
  const knownPlants = new Set(plantSlugs);

  for (const guide of guides) {
    if (!SLUG_PATTERN.test(guide.slug)) {
      errors.push(`invalid slug: "${guide.slug}"`);
    }
    if (seenSlugs.has(guide.slug)) {
      errors.push(`duplicate slug: "${guide.slug}"`);
    }
    seenSlugs.add(guide.slug);

    for (const [key, value] of Object.entries({
      title: guide.title,
      navLabel: guide.navLabel,
      description: guide.description,
      summary: guide.summary,
      lead: guide.lead,
    })) {
      if (value.trim().length === 0) {
        errors.push(`empty ${key} for slug: "${guide.slug}"`);
      }
    }

    if (guide.relatedPlants.length === 0) {
      errors.push(`empty relatedPlants for slug: "${guide.slug}"`);
    }
    if (knownPlants.size > 0) {
      for (const plantSlug of guide.relatedPlants) {
        if (!knownPlants.has(plantSlug)) {
          errors.push(`unknown related plant "${plantSlug}" for slug: "${guide.slug}"`);
        }
      }
    }

    if (!DATE_PATTERN.test(guide.publishedDate) || Number.isNaN(Date.parse(guide.publishedDate))) {
      errors.push(`invalid publishedDate for slug: "${guide.slug}"`);
    }
  }

  return errors;
}

export function findGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/** 記事末尾の「関連記事」に出す、自分以外のガイド */
export function otherGuides(slug: string): Guide[] {
  return GUIDES.filter((g) => g.slug !== slug);
}
