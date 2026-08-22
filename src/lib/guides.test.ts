import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GUIDES, findGuide, otherGuides, validateGuides, type Guide } from './guides.ts';
import { PLANTS } from './plants.ts';

const PLANT_SLUGS = PLANTS.map((p) => p.slug);

const sampleGuide: Guide = {
  slug: 'sample-guide',
  title: 'サンプル記事',
  navLabel: 'サンプル',
  description: 'テスト用',
  summary: 'テスト用',
  lead: '私がテスト用に書いたリード文です。',
  relatedPlants: ['pachira'],
  publishedDate: '2026-01-01',
};

// --- データの形式 -------------------------------------------------------

test('GUIDES に形式エラーがない（relatedPlants が実在する植物を指している）', () => {
  assert.deepEqual(validateGuides(GUIDES, PLANT_SLUGS), []);
});

test('GUIDES は決定した9本を過不足なく持つ', () => {
  assert.deepEqual(
    GUIDES.map((g) => g.slug).sort(),
    [
      'beginner-mistakes',
      'fertilizer',
      'low-light-plants',
      'pest-control',
      'pet-safe-plants',
      'pot-guide',
      'propagation',
      'repotting',
      'seasonal-care',
    ]
  );
});

test('validateGuides: 重複slug・不正なslugを検出する', () => {
  const duplicated = validateGuides([sampleGuide, { ...sampleGuide, title: '別記事' }]);
  assert.ok(duplicated.some((e) => e.includes('duplicate slug')));

  const invalid = validateGuides([{ ...sampleGuide, slug: 'Sample_Guide' }]);
  assert.ok(invalid.some((e) => e.includes('invalid slug')));
});

test('validateGuides: 空のタイトル・リード文を検出する', () => {
  const errors = validateGuides([{ ...sampleGuide, title: '  ', lead: '' }]);
  assert.ok(errors.some((e) => e.includes('empty title')));
  assert.ok(errors.some((e) => e.includes('empty lead')));
});

test('validateGuides: 実在しない植物へのリンクを検出する', () => {
  const errors = validateGuides([{ ...sampleGuide, relatedPlants: ['does-not-exist'] }], PLANT_SLUGS);
  assert.ok(errors.some((e) => e.includes('unknown related plant')));
});

test('validateGuides: 不正な日付を検出する', () => {
  const errors = validateGuides([{ ...sampleGuide, publishedDate: '2026/01/01' }]);
  assert.ok(errors.some((e) => e.includes('invalid publishedDate')));
});

// --- 文章のトーン -------------------------------------------------------

test('各記事のリード文に一人称「私」が入っている（AIっぽい説明調にしないための固定）', () => {
  // 本人からの明示指示。書き換えるときも人称と語りかけの調子は残す
  // （vault: 3-resources/knowledge/feedback-affili-lab-article-tone）
  for (const guide of GUIDES) {
    assert.ok(guide.lead.includes('私'), `${guide.slug} のリード文に「私」が無い`);
    assert.ok(guide.lead.includes('ます') || guide.lead.includes('です'), `${guide.slug} のリード文がですます調でない`);
  }
});

// --- 取り出し -----------------------------------------------------------

test('findGuide: 存在するslugを取得でき、無いものはundefined', () => {
  assert.equal(findGuide('pest-control')?.navLabel, '観葉植物の虫対策ガイド');
  assert.equal(findGuide('does-not-exist'), undefined);
});

test('otherGuides: 自分以外のガイドを返す', () => {
  const others = otherGuides('pest-control');
  assert.equal(others.length, GUIDES.length - 1);
  assert.ok(!others.some((g) => g.slug === 'pest-control'));
});

test('otherGuides: limitを渡すと先頭から件数を絞る', () => {
  const limited = otherGuides('pest-control', 4);
  assert.equal(limited.length, 4);
  assert.ok(!limited.some((g) => g.slug === 'pest-control'));
});
