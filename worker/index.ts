/**
 * 静的アセット配信のWorkerエントリ（wrangler.jsonc の "main"）。
 *
 * これまでは"main"を持たず静的配信だけだったが、独自ドメイン移行にあたり
 * 旧URL（workers.devの無料サブドメイン）から新ドメインへの301リダイレクトのために追加した。
 * 参照: `~/secondBrain/1-projects/carrot-club/tasks/20260823-mineponz-domain-migration-and-adsense.md`
 * （carrot-clubで同じ移行を先にやった際の知見をそのまま踏襲）
 */

interface Env {
  /** 静的アセット。wrangler.jsonc の assets.binding と名前を合わせること */
  ASSETS: { fetch(request: Request): Promise<Response> };
}

/** Cloudflareの無料サブドメイン（独自ドメイン移行前の本番URL）。既存の被リンク・検索インデックスを引き継ぐため301で転送し続ける */
const OLD_HOSTNAME = 'green-shindan-labo.mineponz.workers.dev';
/** 独自ドメイン移行後の正式な本番ホスト名 */
const NEW_HOSTNAME = 'green-lab.mineponz.com';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // 旧URL（workers.devの無料サブドメイン）は独自ドメインへ301で転送する。
    // パス・クエリはそのまま引き継ぐ。
    if (url.hostname === OLD_HOSTNAME) {
      url.hostname = NEW_HOSTNAME;
      return Response.redirect(url.toString(), 301);
    }

    // それ以外は全部静的アセットへ。404-page の扱いもASSETS側が面倒を見る
    return env.ASSETS.fetch(request);
  },
};
