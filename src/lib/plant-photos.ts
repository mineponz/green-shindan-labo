/**
 * 写真素材の対応表。
 *
 * 画像の import は Astro（Vite）のビルドが解決するので、**このファイルは .astro からだけ
 * import する**。`src/lib/plants.ts` は `node --test` から素のNodeで読み込まれるため、
 * あちらに画像 import を持ち込むとテストが動かなくなる。だからデータ（plants.ts）と
 * 素材（ここ）を分けている。
 *
 * `<Image>`（astro:assets）に渡すとビルド時にリサイズ・WebP化されて dist/_astro に出る。
 * 生成された <img> は静的HTMLに入るので、クローラーにもそのまま見える
 * （vault: 3-resources/knowledge/20260811-client-render-kills-seo.md）。
 *
 * 出典・撮影者は src/assets/photos/CREDITS.md に一覧化している（表示義務はないが、
 * 差し替えるときに元をたどれるようにするため）。
 */
import type { ImageMetadata } from 'astro';

import heroPhoto from '../assets/photos/hero-plants.jpg';
import pachiraPhoto from '../assets/photos/pachira.jpg';
import monsteraPhoto from '../assets/photos/monstera.jpg';
import sansevieriaPhoto from '../assets/photos/sansevieria.jpg';
import sansevieriaThumbPhoto from '../assets/photos/sansevieria-thumb.jpg';
import pothosPhoto from '../assets/photos/pothos.jpg';
import gajumaruPhoto from '../assets/photos/gajumaru.jpg';
import gajumaruThumbPhoto from '../assets/photos/gajumaru-thumb.jpg';
import arecaPalmPhoto from '../assets/photos/areca-palm.jpg';
import arecaPalmThumbPhoto from '../assets/photos/areca-palm-thumb.jpg';
import peperomiaPhoto from '../assets/photos/peperomia.jpg';
import tillandsiaPhoto from '../assets/photos/tillandsia.jpg';
import tillandsiaThumbPhoto from '../assets/photos/tillandsia-thumb.jpg';

export interface Photo {
  src: ImageMetadata;
  /** alt は「写真に何が写っているか」を日本語で書く。装飾ではなく内容の説明にする */
  alt: string;
  /**
   * 一覧・診断結果カードの小さいサムネイル用に、あらかじめ寄って切り出した別カット。
   * 未指定なら `src` をそのまま中央基準でクロップする（PlantCard.astro側の処理）。
   * サンスベリア・ガジュマルは元写真が横長/縦長すぎて56角のサムネイルだと
   * 主役が真ん中に来なかったため専用カットを用意した
   * （2026-08-13、管理者の見た目フィードバックで追加）。
   * アレカヤシ・チランジアも同じ理由（株が小さく写っていて56角だと何の植物か伝わらない）で
   * 寄せたカットを持たせている（2026-08-14）。
   */
  thumbSrc?: ImageMetadata;
}

/** トップページのヒーロー写真 */
export const HERO_PHOTO: Photo = {
  src: heroPhoto,
  alt: '光が入る明るいミニマルな部屋に、棚や窓辺へ何鉢もの観葉植物がすっきりと飾られている様子',
};

/** 記事の見出し写真。キーは plants.ts の slug と一致させる */
export const PLANT_PHOTOS: Record<string, Photo> = {
  pachira: {
    src: pachiraPhoto,
    alt: '明るい背景の中、テラコッタ鉢に植えられた、手のひらを広げたような葉をつけるパキラ',
  },
  monstera: {
    src: monsteraPhoto,
    alt: '白い鉢に植えられ、白い背景の中で深い切れ込みの入った葉を広げるモンステラ',
  },
  sansevieria: {
    src: sansevieriaPhoto,
    thumbSrc: sansevieriaThumbPhoto,
    alt: '白い鉢に植えられ、白い背景の中で肉厚の葉をまっすぐ上へ伸ばすサンスベリア',
  },
  pothos: {
    src: pothosPhoto,
    alt: '白いボウル型の鉢に植えられ、白い背景の中でハート形の葉を茂らせるポトス',
  },
  gajumaru: {
    src: gajumaruPhoto,
    thumbSrc: gajumaruThumbPhoto,
    alt: '白い背景を大きく取り、上へまっすぐ伸びる枝先に茂る葉をアップで見せるガジュマル',
  },
  'areca-palm': {
    src: arecaPalmPhoto,
    thumbSrc: arecaPalmThumbPhoto,
    alt: '白い鉢に植えられ、明るい窓辺のサイドテーブルの上で細い葉を涼しげに広げるアレカヤシ',
  },
  peperomia: {
    src: peperomiaPhoto,
    alt: 'クリーム色と緑の斑入りの葉が明るく茂る、白い背景に置かれたペペロミア',
  },
  tillandsia: {
    src: tillandsiaPhoto,
    thumbSrc: tillandsiaThumbPhoto,
    alt: '白い壁に置かれ、土も鉢も使わずに細く波打った葉を四方へ伸ばすチランジア（エアプランツ）',
  },
};

/** slug に対応する写真を返す。未登録なら undefined（記事側で写真なしとして扱う） */
export function findPlantPhoto(slug: string): Photo | undefined {
  return PLANT_PHOTOS[slug];
}

/**
 * 横断ガイド記事（/guides/<slug>/）の見出し写真。キーは src/lib/guides.ts の slug と一致させる。
 *
 * 2026-08-22、SNSシェア時のリンクカード画像（public/og/guide-<slug>.jpg、
 * BaseLayoutのogImagePath）を記事ごとに個別化した際、当初はhero-plants/pachira/monsteraを
 * 複数ガイドで使い回していて「タイムラインで画像を見ても記事の見分けがつかない」と本人指摘。
 * OGP画像とこの見出し写真がずれるとクリック後の見た目が変わって違和感が出るため、
 * 両方まとめて8ガイド全てに重複のない写真を割り当て直した（新規素材は増やさず、
 * 既存の8種＋ヒーロー写真の中からrelatedPlantsを優先しつつ全て別カットになるよう選定）。
 * - 初心者のNG行動＝特定の種の話ではなく「部屋に植物を置く」全体の話なのでヒーロー写真
 * - 虫対策＝丈夫で虫がつきにくいと言われる代表種のサンスベリア
 * - 日当たり＝いちばん耐陰性の高いポトス
 * - ペット＝ASPCA基準で非毒性とされるアレカヤシ（4種中もっとも「観葉植物らしい」見た目）
 * - 季節のお手入れ＝土を使わない分、季節による水やり頻度の調整が特に必要なチランジア
 * - 鉢の選び方＝8種のうち唯一テラコッタ鉢が写り込んでいるパキラ
 * - 植え替え＝鉢に植わった株がはっきり写っていて、大きく育つぶん根詰まりの話が想像しやすいモンステラ
 * - 肥料＝葉の斑（色の変化）が出やすく、肥料の効き・与えすぎの影響が視覚的に伝わりやすいペペロミア
 * - 増やし方（2026-08-22追加）＝挿し木で増やせるガジュマル。相性は良いがrelatedPlantsは
 *   水挿しの定番であるポトス・モンステラにしている（記事本文の主役と写真の主役をあえて分け、
 *   8本+本記事で9本とも重複のない写真になるようにした）
 * alt はどれも「写っているもの」の説明なので、記事が変わってもそのまま使える。
 */
export const GUIDE_PHOTOS: Record<string, Photo> = {
  'beginner-mistakes': HERO_PHOTO,
  'pest-control': PLANT_PHOTOS.sansevieria,
  'low-light-plants': PLANT_PHOTOS.pothos,
  'pet-safe-plants': PLANT_PHOTOS['areca-palm'],
  'seasonal-care': PLANT_PHOTOS.tillandsia,
  'pot-guide': PLANT_PHOTOS.pachira,
  repotting: PLANT_PHOTOS.monstera,
  fertilizer: PLANT_PHOTOS.peperomia,
  propagation: PLANT_PHOTOS.gajumaru,
};

export function findGuidePhoto(slug: string): Photo | undefined {
  return GUIDE_PHOTOS[slug];
}
