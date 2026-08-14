/**
 * 植物データと診断ロジック。
 *
 * このファイルが「唯一の出所」。診断フォームの設問（QUESTIONS）も、結果に出す植物カードの
 * 中身（PLANTS）も、ここから静的にレンダリングする。フォームのvalueと採点ロジックが
 * 別々に書かれてずれる事故を防ぐため、選択肢のIDは必ずこの型を経由する。
 *
 * 診断はブラウザ内で完結させる（サーバーへ回答を送らない）。そのためスコアリングは
 * ここに置いた純粋関数だけで完結し、ビルド時にもクライアントでも同じ関数を使う。
 */

/** Q1 お部屋の日当たり */
export type LightAnswer = 'bright' | 'half' | 'low';
/** Q2 お世話にかけられる手間 */
export type CareAnswer = 'often' | 'lazy';
/** Q3 重視したいこと。'both' は「どちらも」（虫のつきにくさと見ばえを半分ずつ見る） */
export type PriorityAnswer = 'pest' | 'interior' | 'both';
/** Q4 ペットの有無 */
export type PetAnswer = 'yes' | 'no';

export interface DiagnosisAnswers {
  light: LightAnswer;
  care: CareAnswer;
  priority: PriorityAnswer;
  pet: PetAnswer;
}

/** 診断の設問キー。フォームのradio name にそのまま使う */
export type QuestionKey = keyof DiagnosisAnswers;

export interface QuestionOption {
  /** radio の value。型に載せてスコアリング側とずれないようにする */
  value: string;
  label: string;
  /** 選択肢の補足（フォームに小さく出す） */
  hint: string;
}

export interface Question {
  key: QuestionKey;
  /** 「Q1」などの表示用番号 */
  number: number;
  title: string;
  /** 「あなたの回答」の要約行に使う短いラベル */
  summaryLabel: string;
  options: QuestionOption[];
}

export const QUESTIONS: Question[] = [
  {
    key: 'light',
    number: 1,
    title: 'お部屋の日当たりは？',
    summaryLabel: '日当たり',
    options: [
      { value: 'bright', label: 'よく当たる', hint: '南向きの窓ぎわなど、日中しっかり明るい' },
      { value: 'half', label: '半日陰', hint: '直射は入らないけれど、日中は明るい' },
      { value: 'low', label: 'あまり当たらない', hint: '北向き・窓から離れた場所・廊下など' },
    ],
  },
  {
    key: 'care',
    number: 2,
    title: 'お世話にかけられる手間は？',
    summaryLabel: 'お世話の手間',
    options: [
      { value: 'often', label: 'こまめに見れる', hint: '水やりや葉の手入れを楽しめるタイプ' },
      { value: 'lazy', label: 'ズボラでも平気なのがいい', hint: '水やりを忘れがち。放っておいても枯れにくい方がいい' },
    ],
  },
  {
    key: 'priority',
    number: 3,
    title: 'とくに重視したいことは？',
    summaryLabel: '重視したいこと',
    options: [
      { value: 'pest', label: '虫がつきにくさ', hint: 'コバエやカイガラムシが苦手' },
      { value: 'interior', label: 'インテリア映え', hint: '部屋の主役になる見ためを重視したい' },
      { value: 'both', label: 'どちらも', hint: '虫は避けたいけれど、見ためもあきらめたくない' },
    ],
  },
  {
    key: 'pet',
    number: 4,
    title: 'ペットはいますか？',
    summaryLabel: 'ペット',
    options: [
      { value: 'yes', label: 'いる（誤食に注意したい）', hint: '犬・猫・うさぎなど、葉をかじる可能性がある' },
      { value: 'no', label: 'いない', hint: '誤食の心配はしなくて大丈夫' },
    ],
  },
];

/**
 * 植物の属性。すべて1〜5の5段階（大きいほどその性質が強い）。
 * この数値がそのまま診断の点数になるので、変えると診断結果が変わる。
 */
export interface PlantAttributes {
  /** 直射日光・強い光への強さ */
  sun: number;
  /** 耐陰性（暗い場所での育ちやすさ） */
  shade: number;
  /** ズボラ耐性（水やりを忘れても枯れにくいか） */
  ease: number;
  /** 虫のつきにくさ */
  pest: number;
  /** インテリアとしての見ばえ・存在感 */
  interior: number;
}

export interface Plant {
  slug: string;
  /** 表示名（和名） */
  name: string;
  /** 学名 */
  scientificName: string;
  /** 一覧・診断結果カードに出す1〜2行の紹介 */
  summary: string;
  /** 診断結果カードに出す「推しポイント」。3件そろえる */
  strengths: string[];
  /** 「こんな人に向いています」の1行 */
  forWho: string;
  /**
   * ペット（犬・猫など）が誤食しても比較的安全か。
   * false の植物は結果カードに注意書きバッジを常時出す（診断の回答に関係なく静的に表示）。
   */
  petSafe: boolean;
  /** ペットに関する注意書き（petSafe が false のとき表示） */
  petNote: string;
  attributes: PlantAttributes;
  /** ISO 8601 (YYYY-MM-DD) */
  publishedDate: string;
}

/**
 * 紹介している観葉植物8種。
 * 掲載順＝同点時の優先順でもある（パートナーが特に好きなパキラ・モンステラを前に置く）。
 *
 * 2026-08-14: ペットに安全な種がパキラだけで選択肢が乏しかったため、ASPCA（米国動物虐待防止協会）で
 * 犬・猫に非毒性と分類されている3種（アレカヤシ・ペペロミア・チランジア）を追加して4/8種にした。
 */
export const PLANTS: Plant[] = [
  {
    slug: 'pachira',
    name: 'パキラ',
    scientificName: 'Pachira aquatica',
    summary:
      '手のひらを広げたような葉と、編み込まれた幹が特徴。明るい日陰でよく育ち、乾燥にも強い優等生。犬や猫がいるお部屋でも選びやすい一鉢です。',
    strengths: [
      '明るい日陰でも元気に育つ',
      '土が乾いてからの水やりでよく、水やり忘れに強い',
      '犬・猫にとって毒性が低いとされている',
    ],
    forWho: 'はじめての一鉢を探している人、ペットと暮らしている人',
    petSafe: true,
    petNote: '',
    attributes: { sun: 3, shade: 4, ease: 4, pest: 4, interior: 5 },
    publishedDate: '2026-08-12',
  },
  {
    slug: 'monstera',
    name: 'モンステラ',
    scientificName: 'Monstera deliciosa',
    summary:
      '深い切れ込みの入った大きな葉で、一鉢あるだけで部屋の雰囲気が変わります。写真映えではこのサイトの8種のなかでも随一。',
    strengths: [
      '大きな葉の存在感で部屋の主役になる',
      '直射日光を避けた明るい場所でよく育つ',
      '生長が早く、変化を楽しみやすい',
    ],
    forWho: '部屋の主役になる一鉢がほしい人、植物の生長を眺めるのが好きな人',
    petSafe: false,
    petNote:
      'サトイモ科でシュウ酸カルシウムを含み、犬・猫が口にすると口内の刺激やよだれの原因になります。かじられない高さに置いてください。',
    attributes: { sun: 2, shade: 4, ease: 3, pest: 2, interior: 5 },
    publishedDate: '2026-08-12',
  },
  {
    slug: 'sansevieria',
    name: 'サンスベリア',
    scientificName: 'Dracaena trifasciata',
    summary:
      '肉厚でまっすぐな葉が縦に伸びる、乾燥にとても強い植物。水やりの頻度が少なくてよく、虫もつきにくい「ズボラ向けの王様」です。',
    strengths: [
      '乾燥に非常に強く、冬はほぼ水やり不要',
      '肉厚の葉で虫がつきにくい',
      '縦に伸びるので置き場所を取らない',
    ],
    forWho: '水やりを忘れがちな人、虫がとにかく苦手な人',
    petSafe: false,
    petNote:
      'サポニンを含み、犬・猫が食べると嘔吐や下痢の原因になることがあります。棚の上など届かない場所に置いてください。',
    attributes: { sun: 5, shade: 4, ease: 5, pest: 5, interior: 3 },
    publishedDate: '2026-08-12',
  },
  {
    slug: 'pothos',
    name: 'ポトス',
    scientificName: 'Epipremnum aureum',
    summary:
      'つるを伸ばして垂れ下がる姿がかわいい、定番中の定番。このサイトの8種のなかで耐陰性がいちばん高く、暗めの部屋でも育ちます。',
    strengths: [
      'このサイトの8種のなかでいちばん暗い場所に強い',
      '価格が手ごろで手に入りやすい',
      '水挿しで簡単に増やせる',
    ],
    forWho: '日当たりの悪い部屋の人、まずは安く試してみたい人',
    petSafe: false,
    petNote:
      'サトイモ科でシュウ酸カルシウムを含みます。垂れ下がるつるをペットがかじりやすいので、吊るす位置に注意してください。',
    attributes: { sun: 2, shade: 5, ease: 3, pest: 3, interior: 3 },
    publishedDate: '2026-08-12',
  },
  {
    slug: 'gajumaru',
    name: 'ガジュマル',
    scientificName: 'Ficus microcarpa',
    summary:
      'ぷっくりと太った幹（気根）が個性的な、沖縄でおなじみの木。日光が大好きで、日当たりのよい窓ぎわが得意です。',
    strengths: [
      '日当たりのよい場所でぐんぐん育つ',
      '幹の形が一鉢ずつ違い、造形を楽しめる',
      '生命力が強く、多少切り戻しても回復しやすい',
    ],
    forWho: '日当たりのよい窓ぎわがある人、樹形の個性を楽しみたい人',
    petSafe: false,
    petNote:
      'クワ科イチジク属で、切り口から出る白い樹液が皮膚や口内を刺激することがあります。剪定時の樹液にも注意してください。',
    attributes: { sun: 5, shade: 2, ease: 3, pest: 3, interior: 4 },
    publishedDate: '2026-08-12',
  },
  {
    slug: 'areca-palm',
    name: 'アレカヤシ',
    scientificName: 'Dypsis lutescens',
    summary:
      '細い葉が涼しげに広がる、リゾートのような雰囲気の大型のヤシ。犬・猫に対して非毒性とされているので、「大きな鉢がほしいけれどペットが心配」という部屋の主役候補です。',
    strengths: [
      '大きく育ち、部屋にリゾート感のある存在感を出せる',
      '犬・猫に対して非毒性とされている（ASPCA）',
      '乾燥気味の管理を好み、水のやりすぎにさえ注意すれば育てやすい',
    ],
    forWho: '大きめの観葉植物がほしい人、ペットと安全に暮らしたい人',
    petSafe: true,
    petNote: '',
    // 乾燥するとハダニがつきやすいので pest は低め（虫対策ガイドでも要注意種として触れている）
    attributes: { sun: 4, shade: 2, ease: 3, pest: 2, interior: 5 },
    publishedDate: '2026-08-14',
  },
  {
    slug: 'peperomia',
    name: 'ペペロミア',
    scientificName: 'Peperomia spp.',
    summary:
      '厚みのある葉がぷっくりとかわいい、手のひらサイズの観葉植物。多少の水やり忘れや弱い日当たりでも育ってくれます。属全体が犬・猫に非毒性とされているのも心強いところ。',
    strengths: [
      '犬・猫に対して非毒性とされている（ASPCA、ペペロミア属全体）',
      'コンパクトで、棚やデスクの上にも置きやすい',
      '多少の水やり忘れ・弱い日当たりでも育つ',
    ],
    forWho: '小さめの一鉢がほしい人、はじめて植物を育てる人、ペットと暮らしている人',
    petSafe: true,
    petNote: '',
    attributes: { sun: 2, shade: 4, ease: 5, pest: 4, interior: 3 },
    publishedDate: '2026-08-14',
  },
  {
    slug: 'tillandsia',
    name: 'チランジア（エアプランツ）',
    scientificName: 'Tillandsia spp.',
    summary:
      '土を使わずに育てられるユニークな植物。土がないぶんコバエなど土由来の虫がそもそもわきません。霧吹きだけのお手入れで、雑貨のように好きな場所へ飾れます。',
    strengths: [
      '土を使わないので、コバエなど土由来の虫がわかない',
      '霧吹きで水をやるだけの簡単なお手入れ',
      '置き場所を選ばず、雑貨のように飾れる',
    ],
    forWho: '虫が特に苦手な人、インテリアとして遊び心のある飾り方をしたい人',
    petSafe: true,
    petNote: '',
    attributes: { sun: 3, shade: 3, ease: 4, pest: 5, interior: 4 },
    publishedDate: '2026-08-14',
  },
];

/** ペットの回答による加点・減点幅。属性由来の最大差（実測8点）より大きくして優先度を明確にする */
export const PET_SAFE_BONUS = 6;

/** 1位との差がこの範囲に収まる2位までを「こちらも合います」として出す */
export const SECOND_PICK_THRESHOLD = 4;

/** 各設問の配点内訳。結果画面の説明にも使えるよう、内訳を返す */
export interface ScoreBreakdown {
  light: number;
  care: number;
  priority: number;
  pet: number;
  total: number;
}

/**
 * 1つの植物に対する診断スコアを求める（純粋関数）。
 *
 * - 日当たり: よく当たる=sun*2 / 半日陰=sun+shade / あまり当たらない=shade*2
 * - 手間: ズボラ=ease*2 / こまめ=(6-ease)*2（手のかかる植物を許容できるため逆向きに配点）
 * - 重視: 虫=pest*2 / 映え=interior*2 / どちらも=pest+interior
 * - ペット: いる場合のみ、安全なら+6 / そうでなければ-6
 *
 * 「どちらも」は2つの属性に配点を**按分**する（片方に全振りした場合と配点の総量を
 * そろえる）。pest*2 と interior*2 のちょうど中間になるので、「どちらも」を選ぶと
 * 総得点が他の選択肢より過大／過小になることはなく、ペット加点（±6）が属性由来の
 * 点差を上回るという設計も崩れない。
 */
export function scorePlant(plant: Plant, answers: DiagnosisAnswers): ScoreBreakdown {
  const a = plant.attributes;

  const light =
    answers.light === 'bright' ? a.sun * 2 : answers.light === 'low' ? a.shade * 2 : a.sun + a.shade;

  const care = answers.care === 'lazy' ? a.ease * 2 : (6 - a.ease) * 2;

  const priority =
    answers.priority === 'pest'
      ? a.pest * 2
      : answers.priority === 'interior'
        ? a.interior * 2
        : a.pest + a.interior;

  const pet = answers.pet === 'yes' ? (plant.petSafe ? PET_SAFE_BONUS : -PET_SAFE_BONUS) : 0;

  return { light, care, priority, pet, total: light + care + priority + pet };
}

export interface Recommendation {
  plant: Plant;
  score: number;
  /** 1位なら 'best'、2位なら 'also' */
  rank: 'best' | 'also';
}

/**
 * 回答から1〜2種のおすすめを返す。
 * 2位は1位との差が SECOND_PICK_THRESHOLD 以内のときだけ添える（僅差なら両方見せる）。
 * 同点の並びは PLANTS の掲載順で決まる（実行のたびに変わらないようにするため）。
 */
export function recommendPlants(
  answers: DiagnosisAnswers,
  plants: Plant[] = PLANTS
): Recommendation[] {
  const scored = plants
    .map((plant, index) => ({ plant, index, score: scorePlant(plant, answers).total }))
    .sort((x, y) => (y.score !== x.score ? y.score - x.score : x.index - y.index));

  const result: Recommendation[] = [{ plant: scored[0].plant, score: scored[0].score, rank: 'best' }];

  if (scored.length > 1 && scored[0].score - scored[1].score <= SECOND_PICK_THRESHOLD) {
    result.push({ plant: scored[1].plant, score: scored[1].score, rank: 'also' });
  }

  return result;
}

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ATTRIBUTE_KEYS: (keyof PlantAttributes)[] = ['sun', 'shade', 'ease', 'pest', 'interior'];

/** PLANTS の形式が壊れていないかを検証する。テスト用に切り出した純粋関数。 */
export function validatePlants(plants: Plant[]): string[] {
  const errors: string[] = [];
  const seenSlugs = new Set<string>();

  for (const plant of plants) {
    if (!SLUG_PATTERN.test(plant.slug)) {
      errors.push(`invalid slug: "${plant.slug}"`);
    }
    if (seenSlugs.has(plant.slug)) {
      errors.push(`duplicate slug: "${plant.slug}"`);
    }
    seenSlugs.add(plant.slug);

    if (plant.name.trim().length === 0) {
      errors.push(`empty name for slug: "${plant.slug}"`);
    }
    if (plant.summary.trim().length === 0) {
      errors.push(`empty summary for slug: "${plant.slug}"`);
    }
    if (plant.forWho.trim().length === 0) {
      errors.push(`empty forWho for slug: "${plant.slug}"`);
    }
    if (plant.strengths.length !== 3 || plant.strengths.some((s) => s.trim().length === 0)) {
      errors.push(`strengths must be 3 non-empty items for slug: "${plant.slug}"`);
    }
    // ペットに安全でない植物は必ず注意書きを持つ（バッジを出す条件と一致させる）
    if (!plant.petSafe && plant.petNote.trim().length === 0) {
      errors.push(`missing petNote for unsafe plant: "${plant.slug}"`);
    }
    for (const key of ATTRIBUTE_KEYS) {
      const value = plant.attributes[key];
      if (!Number.isInteger(value) || value < 1 || value > 5) {
        errors.push(`attribute ${key} out of range (1-5) for slug: "${plant.slug}"`);
      }
    }
    if (!DATE_PATTERN.test(plant.publishedDate) || Number.isNaN(Date.parse(plant.publishedDate))) {
      errors.push(`invalid publishedDate for slug: "${plant.slug}"`);
    }
  }

  return errors;
}

export function findPlant(slug: string): Plant | undefined {
  return PLANTS.find((p) => p.slug === slug);
}

/** 診断の全回答パターン（3×2×3×2=36通り）。テストと網羅確認に使う */
export function allAnswerCombinations(): DiagnosisAnswers[] {
  const combos: DiagnosisAnswers[] = [];
  for (const light of ['bright', 'half', 'low'] as LightAnswer[]) {
    for (const care of ['often', 'lazy'] as CareAnswer[]) {
      for (const priority of ['pest', 'interior', 'both'] as PriorityAnswer[]) {
        for (const pet of ['yes', 'no'] as PetAnswer[]) {
          combos.push({ light, care, priority, pet });
        }
      }
    }
  }
  return combos;
}

/** 文字列（フォームの値やlocalStorageの中身）が正しい回答かを判定する。信用せずに検査する */
export function parseAnswers(raw: unknown): DiagnosisAnswers | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const record = raw as Record<string, unknown>;

  for (const question of QUESTIONS) {
    const value = record[question.key];
    if (typeof value !== 'string') return null;
    if (!question.options.some((o) => o.value === value)) return null;
  }

  return {
    light: record.light as LightAnswer,
    care: record.care as CareAnswer,
    priority: record.priority as PriorityAnswer,
    pet: record.pet as PetAnswer,
  };
}

/** 回答の表示用ラベル（「あなたの回答」の行に使う） */
export function answerLabel(key: QuestionKey, value: string): string {
  const question = QUESTIONS.find((q) => q.key === key);
  return question?.options.find((o) => o.value === value)?.label ?? '';
}
