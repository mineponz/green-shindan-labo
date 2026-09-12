/**
 * OGP画像（1200x630）のHTMLレイアウトを組み立てるテンプレート。
 *
 * `public/og/README.md`に書かれた実測値（2026-08-25 guide-pruning.jpg再現時点のもの）を
 * コードに落としたもの。数値を変えたら README.md 側の実測値の記述も合わせて直すこと。
 *
 * 写真は<img>ではなくCSSのbackgroundにdata URIで埋め込む。file://で開くheadless Chromeでも
 * 確実に読めるようにするため（相対パスの<img src>はfile://だと読めないことがある）。
 */

const ACCENT = '#146c43';

/**
 * @param {object} opts
 * @param {string} opts.siteName サイト名（左上、白）
 * @param {string} opts.badgeText バッジ文言（右上、白背景+accent文字）
 * @param {string} opts.heading 見出し（下部、白・太字・1行）
 * @param {number} opts.headingSize 見出しのfont-size(px)。46〜52を想定
 * @param {string} [opts.subcopy] サブコピー（下部、白・26px）。省略可
 * @param {'plain'|'italic'} [opts.subcopyStyle] 'italic'は植物ページの学名表記用
 * @param {string} opts.photoDataUri 背景写真のdata URI
 * @param {string} opts.faviconDataUri ロゴ（favicon.svg）のdata URI
 * @param {string} [opts.backgroundPosition] 背景のbackground-position。既定'center'
 * @param {boolean} [opts.twoLayer] true なら「ぼかし下地+auto 630pxの前面」の2層構成にする
 *   （縦長・被写体が枠いっぱいの写真がcoverで切れる対策。public/og/README.md参照）
 */
export function renderOgHtml(opts) {
  const {
    siteName,
    badgeText,
    heading,
    headingSize,
    subcopy,
    subcopyStyle = 'plain',
    photoDataUri,
    faviconDataUri,
    backgroundPosition = 'center',
    twoLayer = false,
  } = opts;

  const backgroundLayers = twoLayer
    ? `
      <div class="bg-blur" style="background-image:url('${photoDataUri}');"></div>
      <div class="bg-sharp" style="background-image:url('${photoDataUri}'); background-position:${backgroundPosition};"></div>`
    : `
      <div class="bg-single" style="background-image:url('${photoDataUri}'); background-position:${backgroundPosition};"></div>`;

  const subcopyHtml = subcopy
    ? `<div class="subcopy${subcopyStyle === 'italic' ? ' subcopy-italic' : ''}">${escapeHtml(subcopy)}</div>`
    : '';

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    font-family: 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif;
    background: #111;
  }
  .card { position: relative; width: 1200px; height: 630px; overflow: hidden; }
  .bg-single {
    position: absolute; inset: 0;
    background-size: cover;
    background-repeat: no-repeat;
  }
  .bg-blur {
    position: absolute;
    top: -40px; left: -40px; right: -40px; bottom: -40px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: blur(28px) brightness(0.9);
  }
  .bg-sharp {
    position: absolute; inset: 0;
    background-size: auto 630px;
    background-repeat: no-repeat;
  }
  .scrim {
    position: absolute; inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 35%,
      rgba(0, 0, 0, 0.18) 58%,
      rgba(0, 0, 0, 0.62) 100%
    );
  }
  .header-row {
    position: absolute; top: 24px; left: 24px;
    display: flex; align-items: center; gap: 14px;
  }
  .logo {
    width: 44px; height: 44px; border-radius: 50%;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  }
  .logo img { width: 28px; height: 28px; }
  .site-name {
    color: #fff; font-size: 30px; font-weight: 700;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.55);
  }
  .badge {
    position: absolute; top: 24px; right: 24px;
    background: #fff; color: ${ACCENT};
    font-size: 22px; font-weight: 700;
    padding: 10px 26px; border-radius: 999px;
  }
  .bottom {
    position: absolute; left: 48px; right: 48px; bottom: 58px;
    display: flex; flex-direction: column; gap: 14px;
  }
  .heading {
    color: #fff; font-weight: 700;
    font-size: ${headingSize}px; line-height: 1.2;
    white-space: nowrap;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
  }
  .subcopy {
    color: #fff; font-size: 26px; font-weight: 500;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.55);
  }
  .subcopy-italic { font-style: italic; font-weight: 400; }
</style>
</head>
<body>
  <div class="card">
    ${backgroundLayers}
    <div class="scrim"></div>
    <div class="header-row">
      <div class="logo"><img src="${faviconDataUri}" alt=""></div>
      <div class="site-name">${escapeHtml(siteName)}</div>
    </div>
    <div class="badge">${escapeHtml(badgeText)}</div>
    <div class="bottom">
      <div class="heading">${escapeHtml(heading)}</div>
      ${subcopyHtml}
    </div>
  </div>
</body>
</html>
`;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

/**
 * 見出しが1行に収まるよう font-size を見積もる（46〜52pxの範囲）。
 * ブラウザの実測はできないので、全角=1em・半角=0.55em程度という粗い概算で
 * 収まる幅（1200 - 左右余白48*2 = 1104px）に収まるサイズへ縮める。
 * ぴったり合わせたい場合は generate.mjs の --heading-size で上書きする。
 */
export function estimateHeadingSize(heading) {
  const MAX_SIZE = 52;
  const MIN_SIZE = 46;
  const AVAILABLE_WIDTH = 1200 - 48 * 2;

  const widthAt = (fontSize) => {
    let units = 0;
    for (const ch of heading) {
      units += /[　-鿿＀-￯]/.test(ch) ? 1.0 : 0.55;
    }
    return units * fontSize;
  };

  if (widthAt(MAX_SIZE) <= AVAILABLE_WIDTH) return MAX_SIZE;
  const scaled = Math.floor((AVAILABLE_WIDTH / widthAt(MAX_SIZE)) * MAX_SIZE);
  return Math.max(MIN_SIZE, Math.min(MAX_SIZE, scaled));
}
