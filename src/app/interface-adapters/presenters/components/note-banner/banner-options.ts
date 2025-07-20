/** Representa uma categoria de cor de banner com rótulo e lista de cores. */
export interface BannerColorCategory {
  label: string;
  colors: string[];
}

/** Lista de categorias de cores disponíveis para os banners. */
export const COLOR_CATEGORIES: BannerColorCategory[] = [
  {
    label: 'Vibrantes',
    colors: ['#1037B8', '#F52650', '#F9A800', '#00C853', '#FF6F00', '#5901de'],
  },
  {
    label: 'Tons pastéis',
    colors: ['#cce5ff', '#d0f0c0', '#ffd6d6', '#fff4b2', '#ffebcc', '#e2ccff'],
  },
];