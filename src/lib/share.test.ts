import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildShareText, buildShareTargetUrl, buildShareUrl } from './share.ts';
import { PLANTS } from './plants.ts';
import { SITE_TITLE, SITE_URL } from '../consts.ts';

test('シェア文面は1位の植物名とサイト名を含む', () => {
  const text = buildShareText('パキラ');
  assert.ok(text.includes('「パキラ」'));
  assert.ok(text.includes(SITE_TITLE));
  assert.ok(text.includes('診断してみませんか'));
});

test('シェア文面に2位は入れない（1位だけを差し込む）', () => {
  const text = buildShareText('パキラ');
  assert.ok(!text.includes('モンステラ'));
});

test('共有するURLはトップページの診断セクション。スラッシュが重ならない', () => {
  assert.equal(buildShareTargetUrl('https://example.com'), 'https://example.com/#diagnosis');
  assert.equal(buildShareTargetUrl('https://example.com/'), 'https://example.com/#diagnosis');
  assert.equal(buildShareTargetUrl(), `${SITE_URL}/#diagnosis`);
});

test('シェアURLは x.com のintentで、text/url がエンコードされている', () => {
  const href = buildShareUrl('サンスベリア');
  const url = new URL(href);

  assert.equal(url.origin + url.pathname, 'https://x.com/intent/tweet');
  // URLSearchParams で読み戻せる＝エンコードが壊れていない
  assert.equal(url.searchParams.get('text'), buildShareText('サンスベリア'));
  assert.equal(url.searchParams.get('url'), buildShareTargetUrl());

  // 生の改行・「#」がクエリにそのまま出ていないこと（パラメータが割れる原因になる）
  const query = href.slice(href.indexOf('?') + 1);
  assert.ok(!query.includes('\n'));
  assert.ok(!query.includes('#'));
  assert.ok(query.includes('%23diagnosis'));
});

test('8種すべての植物名でシェアURLが組み立てられる', () => {
  for (const plant of PLANTS) {
    const url = new URL(buildShareUrl(plant.name));
    assert.equal(url.searchParams.get('text'), buildShareText(plant.name));
    assert.ok(url.searchParams.get('text')!.includes(`「${plant.name}」`));
  }
});
