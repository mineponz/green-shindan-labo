/**
 * サイト全体の定数。
 *
 * SITE_URL は canonical と sitemap.xml の生成に使われる。本番URLと一致していないと
 * Googleに存在しないURLを申告することになるため、変更時は public/robots.txt も併せて直す。
 * 独自ドメインを設定したらここを差し替える。
 */
export const SITE_URL = 'https://green-shindan-labo.mineponz.workers.dev';
export const SITE_TITLE = 'グリーン診断ラボ';
/** ヘッダーに出す短い説明。トップページのh1と丸かぶりしない文言にしている */
export const SITE_TAGLINE = '観葉植物の選び方・育て方・虫対策';
export const SITE_DESCRIPTION =
  '日当たり・お世話にかけられる手間・重視したいこと・ペットの有無、4つの質問に答えるだけで、' +
  'あなたの部屋に合う観葉植物をおすすめします。パキラ・モンステラ・サンスベリア・ポトス・' +
  'ガジュマル・アレカヤシ・ペペロミア・チランジアの育て方と虫対策、' +
  'インテリアとしての飾り方もまとめています。';

/**
 * お問い合わせ先メールアドレス。
 *
 * !!! 現在はプレースホルダ。本番公開前に必ず実在のアドレスへ差し替えること !!!
 * この値が CONTACT_EMAIL_PLACEHOLDER と一致する間だけ /contact/ が mailto リンクを出さず
 * 「準備中」と表示する（src/pages/contact.astro）。
 */
export const CONTACT_EMAIL_PLACEHOLDER = 'CONTACT_EMAIL_TODO';
export const CONTACT_EMAIL: string = CONTACT_EMAIL_PLACEHOLDER;

/** プライバシーポリシーの最終更新日（ページ末尾の表示に使う）。内容を変えたら必ず更新する。 */
export const PRIVACY_POLICY_UPDATED = '2026-08-19';
// 2026-08-19、忍者AdMax導入の開示を追加した際に更新

/**
 * Amazonアソシエイトのトラッキングタグ。
 *
 * !!! 現在はプレースホルダ。本人がAmazonアソシエイトに登録し、発行された実タグへ
 * 差し替えること !!!
 * この値が AMAZON_ASSOCIATE_TAG_PLACEHOLDER と一致する間は、
 * - プライバシーポリシーの文言が「参加を予定しています」になる
 * - フッターの「適格販売により収入を得ています」の開示文が出ない
 * （まだ収入を得ていないのに開示すると事実と異なるため。差し替えると自動で切り替わる）
 */
export const AMAZON_ASSOCIATE_TAG_PLACEHOLDER = 'YOUR_ASSOCIATE_TAG';
export const AMAZON_ASSOCIATE_TAG: string = 'greenlabo-22';

/** Google Analytics(GA4)の測定ID。2026-08-13、本人が発行したプロパティのIDを設定。 */
export const GA_MEASUREMENT_ID = 'G-BK3NZZ8ZEE';

/** 忍者AdMax（第三者ディスプレイ広告）の広告枠ID。2026-08-19、本人の指示で全ページに導入。 */
export const ADMAX_ID = '51c868bbffa298b897659e4c030ce6d1';
