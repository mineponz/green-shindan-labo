import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  PLANTS,
  QUESTIONS,
  SECOND_PICK_THRESHOLD,
  allAnswerCombinations,
  answerLabel,
  findPlant,
  parseAnswers,
  recommendPlants,
  scorePlant,
  validatePlants,
  type DiagnosisAnswers,
  type Plant,
} from './plants.ts';

const samplePlant: Plant = {
  slug: 'sample',
  name: 'サンプル',
  scientificName: 'Sample sp.',
  summary: 'テスト用',
  strengths: ['a', 'b', 'c'],
  forWho: 'テストする人',
  petSafe: true,
  petNote: '',
  attributes: { sun: 3, shade: 3, ease: 3, pest: 3, interior: 3 },
  publishedDate: '2026-01-01',
};

// --- データの形式 -------------------------------------------------------

test('PLANTS に形式エラーがない', () => {
  assert.deepEqual(validatePlants(PLANTS), []);
});

test('PLANTS は決定した5種を過不足なく持つ', () => {
  assert.deepEqual(
    PLANTS.map((p) => p.slug).sort(),
    ['gajumaru', 'monstera', 'pachira', 'pothos', 'sansevieria']
  );
});

test('validatePlants: 重複slugを検出する', () => {
  const errors = validatePlants([samplePlant, { ...samplePlant, name: '別名' }]);
  assert.ok(errors.some((e) => e.includes('duplicate slug')));
});

test('validatePlants: 不正なslugを検出する', () => {
  const errors = validatePlants([{ ...samplePlant, slug: 'Sample_Plant' }]);
  assert.ok(errors.some((e) => e.includes('invalid slug')));
});

test('validatePlants: 属性が1〜5の範囲外なら検出する', () => {
  const tooHigh = validatePlants([
    { ...samplePlant, attributes: { ...samplePlant.attributes, sun: 6 } },
  ]);
  assert.ok(tooHigh.some((e) => e.includes('attribute sun out of range')));

  const tooLow = validatePlants([
    { ...samplePlant, attributes: { ...samplePlant.attributes, shade: 0 } },
  ]);
  assert.ok(tooLow.some((e) => e.includes('attribute shade out of range')));
});

test('validatePlants: 空のname/summary/forWhoを検出する', () => {
  const errors = validatePlants([{ ...samplePlant, name: '  ', summary: '', forWho: '' }]);
  assert.ok(errors.some((e) => e.includes('empty name')));
  assert.ok(errors.some((e) => e.includes('empty summary')));
  assert.ok(errors.some((e) => e.includes('empty forWho')));
});

test('validatePlants: strengthsが3件でなければ検出する', () => {
  const errors = validatePlants([{ ...samplePlant, strengths: ['a', 'b'] }]);
  assert.ok(errors.some((e) => e.includes('strengths must be 3')));
});

test('validatePlants: ペットに危険なのに注意書きが無ければ検出する', () => {
  const errors = validatePlants([{ ...samplePlant, petSafe: false, petNote: '' }]);
  assert.ok(errors.some((e) => e.includes('missing petNote')));
});

test('validatePlants: 不正な日付を検出する', () => {
  const errors = validatePlants([{ ...samplePlant, publishedDate: '2026/01/01' }]);
  assert.ok(errors.some((e) => e.includes('invalid publishedDate')));
});

test('findPlant: 存在するslugを取得でき、無いものはundefined', () => {
  assert.equal(findPlant('pachira')?.name, 'パキラ');
  assert.equal(findPlant('does-not-exist'), undefined);
});

// --- 設問 ---------------------------------------------------------------

test('QUESTIONS は4問で、キーが重複しない', () => {
  assert.equal(QUESTIONS.length, 4);
  assert.equal(new Set(QUESTIONS.map((q) => q.key)).size, 4);
});

test('QUESTIONS: 各設問の選択肢は2つ以上あり、valueが一意', () => {
  for (const question of QUESTIONS) {
    assert.ok(question.options.length >= 2, `${question.key} の選択肢が足りない`);
    assert.equal(
      new Set(question.options.map((o) => o.value)).size,
      question.options.length,
      `${question.key} の value が重複している`
    );
  }
});

test('answerLabel: 既知の値はラベルを返し、未知の値は空文字', () => {
  assert.equal(answerLabel('light', 'low'), 'あまり当たらない');
  assert.equal(answerLabel('pet', 'yes'), 'いる（誤食に注意したい）');
  assert.equal(answerLabel('light', 'nonsense'), '');
});

// --- 診断ロジック -------------------------------------------------------

const COMBINATIONS = allAnswerCombinations();

test('allAnswerCombinations: 3×2×2×2=24通りを重複なく返す', () => {
  assert.equal(COMBINATIONS.length, 24);
  const keys = COMBINATIONS.map((c) => `${c.light}/${c.care}/${c.priority}/${c.pet}`);
  assert.equal(new Set(keys).size, 24);
});

test('全24パターンで、おすすめが1〜2種返る', () => {
  for (const answers of COMBINATIONS) {
    const result = recommendPlants(answers);
    assert.ok(
      result.length === 1 || result.length === 2,
      `${JSON.stringify(answers)} で ${result.length} 件返った`
    );
    assert.equal(result[0].rank, 'best');
    if (result[1]) assert.equal(result[1].rank, 'also');
  }
});

test('全24パターンで、返る植物はPLANTSに実在し重複しない', () => {
  const slugs = new Set(PLANTS.map((p) => p.slug));
  for (const answers of COMBINATIONS) {
    const result = recommendPlants(answers);
    for (const r of result) assert.ok(slugs.has(r.plant.slug));
    assert.equal(new Set(result.map((r) => r.plant.slug)).size, result.length);
  }
});

test('全24パターンで、2位は1位以下かつ僅差のときだけ返る', () => {
  for (const answers of COMBINATIONS) {
    const result = recommendPlants(answers);
    if (result.length === 2) {
      assert.ok(result[0].score >= result[1].score);
      assert.ok(result[0].score - result[1].score <= SECOND_PICK_THRESHOLD);
    }
  }
});

test('ペット「いる」を選ぶと、1位は必ずペットに安全な植物になる', () => {
  for (const answers of COMBINATIONS.filter((c) => c.pet === 'yes')) {
    const result = recommendPlants(answers);
    assert.equal(
      result[0].plant.petSafe,
      true,
      `${JSON.stringify(answers)} の1位 ${result[0].plant.slug} がペットに安全でない`
    );
  }
});

test('同じ回答なら常に同じ結果になる（決定的）', () => {
  for (const answers of COMBINATIONS) {
    const a = recommendPlants(answers).map((r) => r.plant.slug);
    const b = recommendPlants(answers).map((r) => r.plant.slug);
    assert.deepEqual(a, b);
  }
});

test('全24パターンを合わせると、5種すべてが少なくとも1回はおすすめされる', () => {
  const recommended = new Set<string>();
  for (const answers of COMBINATIONS) {
    for (const r of recommendPlants(answers)) recommended.add(r.plant.slug);
  }
  assert.deepEqual([...recommended].sort(), PLANTS.map((p) => p.slug).sort());
});

test('日当たりが悪い部屋では、耐陰性のいちばん高いポトスが日光好きのガジュマルより高得点', () => {
  const answers: DiagnosisAnswers = { light: 'low', care: 'lazy', priority: 'pest', pet: 'no' };
  const pothos = scorePlant(findPlant('pothos')!, answers).total;
  const gajumaru = scorePlant(findPlant('gajumaru')!, answers).total;
  assert.ok(pothos > gajumaru, `pothos=${pothos} gajumaru=${gajumaru}`);
});

test('ズボラ・虫嫌いの組み合わせではサンスベリアが1位', () => {
  const result = recommendPlants({ light: 'bright', care: 'lazy', priority: 'pest', pet: 'no' });
  assert.equal(result[0].plant.slug, 'sansevieria');
});

test('scorePlant: 内訳の合計が total と一致する', () => {
  for (const answers of COMBINATIONS) {
    for (const plant of PLANTS) {
      const s = scorePlant(plant, answers);
      assert.equal(s.total, s.light + s.care + s.priority + s.pet);
    }
  }
});

test('scorePlant: ペット「いない」ならペット加点は0', () => {
  for (const plant of PLANTS) {
    const s = scorePlant(plant, { light: 'half', care: 'lazy', priority: 'pest', pet: 'no' });
    assert.equal(s.pet, 0);
  }
});

// --- 入力の検査（localStorage / フォームの値は信用しない） ----------------

test('parseAnswers: 正しい回答はそのまま返す', () => {
  const answers = { light: 'low', care: 'lazy', priority: 'interior', pet: 'no' };
  assert.deepEqual(parseAnswers(answers), answers);
});

test('parseAnswers: 未知の値・欠けた項目・非オブジェクトはnull', () => {
  assert.equal(parseAnswers({ light: 'ultraviolet', care: 'lazy', priority: 'pest', pet: 'no' }), null);
  assert.equal(parseAnswers({ light: 'low', care: 'lazy', priority: 'pest' }), null);
  assert.equal(parseAnswers({ light: 1, care: 'lazy', priority: 'pest', pet: 'no' }), null);
  assert.equal(parseAnswers(null), null);
  assert.equal(parseAnswers('low'), null);
  assert.equal(parseAnswers(undefined), null);
});

test('parseAnswers: 余分なキーが混ざっていても4項目が正しければ通す', () => {
  const parsed = parseAnswers({
    light: 'bright',
    care: 'often',
    priority: 'pest',
    pet: 'yes',
    injected: '<script>',
  });
  assert.deepEqual(parsed, { light: 'bright', care: 'often', priority: 'pest', pet: 'yes' });
});
