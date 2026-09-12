#!/usr/bin/env node
/**
 * OGP画像（1200x630 JPEG）生成CLI。
 *
 * 経緯: `public/og/`配下の画像は記事を足すたびに手作業で1枚ずつ作っていて、
 * テンプレートがリポジトリに残っていなかった（`public/og/README.md`の実測値から
 * 毎回作り直していた）。このスクリプトでコマンド1発にする
 * （vault: 1-projects/green-lab/tasks/20260913-commit-ogp-generator.md）。
 *
 * Playwrightには依存しない。headless Chromeを直接叩けば同じ結果になる
 * （`public/og/README.md`の2026-08-30の記述どおり）。PNG→JPEG変換はmac標準の`sips`を使う。
 * そのため**mac + Google Chromeがローカルにある前提のツール**（CI実行は未検証）。
 *
 * 使い方:
 *   node scripts/og/generate.mjs --slug=root-rot --type=guide \
 *     --photo=src/assets/photos/root-rot.jpg \
 *     --heading="観葉植物の根腐れ" \
 *     --subcopy="見分け方と、まだ間に合う復活のさせ方" \
 *     --position="center 42%"
 *
 * 主な引数:
 *   --slug            (必須) 出力ファイル名に使う識別子
 *   --type            guide (既定) | plant。バッジ既定文言・サブコピー既定スタイルを決める
 *   --photo           (必須) 背景写真のパス（相対 or 絶対）
 *   --heading         (必須) 見出し（1行に収まるサイズへ自動縮小。--heading-sizeで上書き可）
 *   --subcopy         サブコピー（省略可）
 *   --subcopy-style   plain (既定) | italic（植物ページの学名表記はitalic）
 *   --badge           バッジ文言（既定: type=guideなら「お悩み解決ガイド」、plantなら「植物図鑑」）
 *   --site-name       既定: src/consts.ts の SITE_TITLE を読む（読めなければ「グリーン診断ラボ」）
 *   --position        background-position（既定: center。例 "center 42%"）
 *   --two-layer       縦長・被写体が枠いっぱいの写真がcoverで切れる対策の2層構成にする
 *   --heading-size    見出しのpx数を明示指定（自動見積りを使わない）
 *   --out             出力先（既定: public/og/<guide-なら"guide-"を付けて>slug.jpg）
 *   --keep-tmp        中間HTML/PNGを削除せず残す（デバッグ用）
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { estimateHeadingSize, renderOgHtml } from './template.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/**
 * 受け付ける引数の全リスト。**未知の引数は黙って無視せずエラーにする**ため、
 * ここに無いものが来たら止める。
 * 経緯: `--out-dir`（実際には存在しない引数。正しくは`--out`）を渡したとき、
 * 黙って無視されて既定の出力先 public/og/ に書かれ、**コミット済みの画像を
 * 上書きしてしまった**（2026-09-13、検証中のリーダー）。タイプミス1つで
 * 生成済みの成果物が壊れるのは事故が大きすぎる。
 */
const KNOWN_FLAGS = new Set([
  'slug',
  'type',
  'photo',
  'heading',
  'subcopy',
  'subcopy-style',
  'badge',
  'site-name',
  'position',
  'two-layer',
  'heading-size',
  'out',
  'keep-tmp',
]);

function parseArgs(argv) {
  const args = {};
  for (const raw of argv) {
    if (!raw.startsWith('--')) continue;
    const eq = raw.indexOf('=');
    const key = eq === -1 ? raw.slice(2) : raw.slice(2, eq);
    if (!KNOWN_FLAGS.has(key)) {
      console.error(`知らない引数です: --${key}`);
      console.error(`受け付けるのは: ${[...KNOWN_FLAGS].map((f) => `--${f}`).join(' ')}`);
      console.error('出力先を変えたいときは --out=<ファイルパス> です（--out-dir はありません）。');
      process.exit(1);
    }
    args[key] = eq === -1 ? true : raw.slice(eq + 1);
  }
  return args;
}

function mimeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.svg') return 'image/svg+xml';
  throw new Error(`未対応の拡張子です: ${filePath}`);
}

function toDataUri(filePath) {
  const abs = path.isAbsolute(filePath) ? filePath : path.resolve(REPO_ROOT, filePath);
  const buf = fs.readFileSync(abs);
  return `data:${mimeFor(abs)};base64,${buf.toString('base64')}`;
}

function readSiteNameFromConsts() {
  try {
    const src = fs.readFileSync(path.join(REPO_ROOT, 'src/consts.ts'), 'utf8');
    const m = src.match(/SITE_TITLE\s*=\s*'([^']+)'/);
    if (m) return m[1];
  } catch {
    // フォールバックへ
  }
  return 'グリーン診断ラボ';
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.slug || !args.photo || !args.heading) {
    console.error('必須引数が足りません: --slug --photo --heading は必須です。');
    console.error('使い方は scripts/og/generate.mjs の先頭コメントを参照。');
    process.exit(1);
  }

  const type = args.type ?? 'guide';
  if (type !== 'guide' && type !== 'plant') {
    console.error(`--type は guide か plant のみ対応（渡された値: ${type}）`);
    process.exit(1);
  }

  const slug = args.slug;
  const badgeText = args.badge ?? (type === 'guide' ? 'お悩み解決ガイド' : '植物図鑑');
  const subcopyStyle = args['subcopy-style'] ?? (type === 'plant' ? 'italic' : 'plain');
  const siteName = args['site-name'] ?? readSiteNameFromConsts();
  const backgroundPosition = args.position ?? 'center';
  const twoLayer = Boolean(args['two-layer']);
  const heading = args.heading;
  const subcopy = args.subcopy;
  const headingSize = args['heading-size']
    ? Number(args['heading-size'])
    : estimateHeadingSize(heading);

  const defaultOutName = type === 'guide' ? `guide-${slug}.jpg` : `${slug}.jpg`;
  const outPath = args.out
    ? path.isAbsolute(args.out)
      ? args.out
      : path.resolve(REPO_ROOT, args.out)
    : path.join(REPO_ROOT, 'public/og', defaultOutName);

  if (!fs.existsSync(CHROME_PATH)) {
    console.error(`Google Chromeが見つかりません: ${CHROME_PATH}`);
    console.error('このスクリプトはmac + Google Chromeローカル前提です。');
    process.exit(1);
  }

  const photoDataUri = toDataUri(args.photo);
  const faviconDataUri = toDataUri(path.join(REPO_ROOT, 'public/favicon.svg'));

  const html = renderOgHtml({
    siteName,
    badgeText,
    heading,
    headingSize,
    subcopy,
    subcopyStyle,
    photoDataUri,
    faviconDataUri,
    backgroundPosition,
    twoLayer,
  });

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'green-lab-og-'));
  const htmlPath = path.join(tmpDir, `${slug}.html`);
  const pngPath = path.join(tmpDir, `${slug}.png`);
  fs.writeFileSync(htmlPath, html, 'utf8');

  execFileSync(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--window-size=1200,630',
    `--screenshot=${pngPath}`,
    `file://${htmlPath}`,
  ]);

  if (!fs.existsSync(pngPath)) {
    throw new Error('headless Chromeのスクリーンショット出力が見つかりません: ' + pngPath);
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  execFileSync('sips', [
    '-s', 'format', 'jpeg',
    '-s', 'formatOptions', '88',
    pngPath,
    '--out', outPath,
  ]);

  if (!args['keep-tmp']) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } else {
    console.log(`中間ファイルを残しました: ${tmpDir}`);
  }

  console.log(`生成しました: ${path.relative(REPO_ROOT, outPath)} (heading-size=${headingSize}px, two-layer=${twoLayer})`);
}

main();
