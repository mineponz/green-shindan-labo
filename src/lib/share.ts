/**
 * 診断結果のシェア（Xの投稿画面を開く）用のURL組み立て。
 *
 * 文面とURLの組み立てをここに集約する（唯一の出所）。コンポーネント側のクライアントJSは
 * `buildShareUrl(植物名)` を呼んで `<a href>` に入れるだけにしておくと、文面の検証を
 * 素のNodeのテスト（node --test）でできる。
 *
 * `plants.ts` / `guides.ts` と同じく **このファイルに画像importを持ち込まない**
 * （テストから素のNodeで読まれるため）。
 *
 * なお、シェアはユーザーがボタンを押したときに X のページへ遷移するだけで、
 * 診断の回答そのものをどこかへ送信するわけではない（回答はブラウザ内で完結のまま）。
 */
import { SITE_TITLE, SITE_URL } from '../consts.ts';

/** Xの投稿画面（intent）のエンドポイント */
const X_INTENT_ENDPOINT = 'https://x.com/intent/tweet';

/** シェアURLに付けるフラグメント。踏んだ人が診断セクションへ直接降りられるようにする */
const SHARE_FRAGMENT = '#diagnosis';

/**
 * シェアの本文。1位の植物名だけを差し込む
 * （2位が出ているときも1位だけ。2種並べると文面が長くなりすぎるため）。
 */
export function buildShareText(plantName: string, siteTitle: string = SITE_TITLE): string {
  return (
    `診断結果は「${plantName}」でした🌿\n` +
    `${siteTitle}で、あなたの部屋に合う観葉植物を診断してみませんか？`
  );
}

/** シェアで共有するページのURL（トップの診断セクション） */
export function buildShareTargetUrl(siteUrl: string = SITE_URL): string {
  return `${siteUrl.replace(/\/+$/, '')}/${SHARE_FRAGMENT}`;
}

/**
 * Xの投稿画面のURL。text と url は必ず encodeURIComponent で包む
 * （文面に改行・「？」・絵文字が入るため、素のまま繋ぐとパラメータが壊れる）。
 */
export function buildShareUrl(plantName: string, siteUrl: string = SITE_URL): string {
  const text = encodeURIComponent(buildShareText(plantName));
  const url = encodeURIComponent(buildShareTargetUrl(siteUrl));
  return `${X_INTENT_ENDPOINT}?text=${text}&url=${url}`;
}
