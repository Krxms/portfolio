// Images adaptées à l'écran : à partir d'une image importée, produit un srcset en WebP aux largeurs données (jamais au-delà de l'original)
// et garde les dimensions d'origine pour réserver la place (aucun décalage de mise en page). Le navigateur choisit la plus petite version
// suffisante pour la taille affichée (attribut sizes) et la densité de l'écran : un téléphone ne télécharge plus l'image prévue pour un
// grand écran.
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

export async function responsive(source: ImageMetadata, widths: number[], sizes: string) {
  const usable = [...new Set(widths.filter((w) => w < source.width).concat(source.width))].sort((a, b) => a - b);
  const variants = await Promise.all(usable.map((w) => getImage({ src: source, width: w, format: 'webp', quality: 78 })));
  return {
    src: variants[variants.length - 1].src,
    srcset: variants.map((v, i) => `${v.src} ${usable[i]}w`).join(', '),
    sizes,
    width: source.width,
    height: source.height,
  };
}
