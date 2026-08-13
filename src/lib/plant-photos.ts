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
import pothosPhoto from '../assets/photos/pothos.jpg';
import gajumaruPhoto from '../assets/photos/gajumaru.jpg';

export interface Photo {
  src: ImageMetadata;
  /** alt は「写真に何が写っているか」を日本語で書く。装飾ではなく内容の説明にする */
  alt: string;
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
    alt: '白い鉢に植えられ、白い背景の中で肉厚の葉をまっすぐ上へ伸ばすサンスベリア',
  },
  pothos: {
    src: pothosPhoto,
    alt: '白いボウル型の鉢に植えられ、白い背景の中でハート形の葉を茂らせるポトス',
  },
  gajumaru: {
    src: gajumaruPhoto,
    alt: '黒い丸鉢に植えられ、白い背景の中で根元がぷっくりと太った幹を見せるガジュマル',
  },
};

/** slug に対応する写真を返す。未登録なら undefined（記事側で写真なしとして扱う） */
export function findPlantPhoto(slug: string): Photo | undefined {
  return PLANT_PHOTOS[slug];
}
