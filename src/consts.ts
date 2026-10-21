/**
 * サイト全体の定数。
 *
 * SITE_URL は canonical と sitemap.xml の生成に使われる。本番URLと一致していないと
 * Googleに存在しないURLを申告することになるため、変更時は public/robots.txt も併せて直す。
 * 独自ドメインを設定したらここを差し替える。
 */
export const SITE_URL = 'https://green-lab.mineponz.com';
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
export const PRIVACY_POLICY_UPDATED = '2026-10-13';
// 2026-10-13、広告をGoogle AdSense（自動広告）へ切り替えた際に更新

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

/**
 * Google AdSense のパブリッシャーID（`ca-pub-…`）。自動広告スクリプト（BaseLayout の head）で使う。
 * !!! `public/ads.txt` の販売者行（`pub-` の後ろの数字）と必ず同じ値にすること。食い違うと広告が配信されない !!!
 * 自動広告の枠の位置はAdSense側の管理画面で決まる。記事本文の手動枠（記事内広告）は ADSENSE_IN_ARTICLE_* を参照。
 * 2026-10-13 導入（ルートドメイン mineponz.com の審査通過・本人の決定「まず自動広告だけ」）。
 */
export const ADSENSE_CLIENT_ID = 'ca-pub-7478797109606594';

/**
 * AdSense「記事内広告」ユニットを出すか。`false` にすると本文への差し込みだけが止まる
 * （head の adsbygoogle.js・自動広告は別）。対象はガイド記事（/guides/<slug>/）と
 * 植物の個別ページ（/plants/<slug>/）で、1記事2か所（本文2つ目のh2の前・最後のh2の前）。
 * 2026-10-21 導入。
 */
export const ADSENSE_IN_ARTICLE_ENABLED = true;
/** 記事内広告ユニットの slot ID（AdSense管理画面の値） */
export const ADSENSE_IN_ARTICLE_SLOT_ID = '8957188768';

/**
 * 忍者AdMax（第三者ディスプレイ広告）を出すか。`false` にすると広告枠（`div.ad-slot`）ごと
 * 出力されず、プライバシーポリシーの AdMax の記載も外れる。戻すときはこの1行を `true` にするだけ。
 * 2026-10-13 に停止（AdSense の自動広告へ置き換える。本人の決定）。
 */
export const ADMAX_ENABLED = false;

/**
 * 忍者AdMax（第三者ディスプレイ広告）の広告枠スクリプトURL。
 * 2026-08-19、本人の指示で導入→アダルト広告が多く一旦撤回→本人が広告枠を設定し直して再導入。
 * 全ページ自動挿入型（`/st/auto.js`）ではなく、**この場所に描画される**個別枠タイプなので、
 * `<head>`ではなく本文中の指定位置（`BaseLayout`のmain内、コンテンツの後・footerの前）に
 * script要素として直接置くこと。
 */
export const ADMAX_SCRIPT_SRC = 'https://adm.shinobi.jp/s/618664a7434322ad26b4c7fb88101832';
