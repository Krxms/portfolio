/* Mise en forme du texte du site, à la main, dans les chaînes de caractères des pages et des composants.

   Dans une chaîne :
     \n          retour à la ligne (deux \n de suite : une ligne vide)
     *texte*     italique
     **texte**   gras
     <em>, <strong>, <br>, <span class="…">, <a href="…"> : le HTML s'écrit tel quel (les textes viennent du code, pas des visiteurs)

   Ce qui reste du texte brut (aucune mise en forme) : les balises <title> et meta description, les attributs alt et aria-label, et les
   questions/réponses des données structurées (JSON-LD). Elles passent par `plain()`, qui retire les marques ci-dessus.
   Les textes écrits directement dans le balisage d'un composant (la Hero, le manifeste…) s'écrivent en HTML ordinaire. */

/** Texte mis en forme, prêt pour `set:html`. */
export function rich(text: unknown): string {
  if (text == null) return '';
  return String(text)
    .replace(/\*\*([^*\n]+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<![*\w])\*([^*\n]+?)\*(?![*\w])/g, '<em>$1</em>')
    .replace(/\r?\n/g, '<br>');
}

/** Le même texte sans aucune mise en forme (métadonnées, JSON-LD, attributs). */
export function plain(text: unknown): string {
  if (text == null) return '';
  return String(text)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\*\*([^*\n]+?)\*\*/g, '$1')
    .replace(/(?<![*\w])\*([^*\n]+?)\*(?![*\w])/g, '$1')
    .replace(/\s*\r?\n\s*/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
