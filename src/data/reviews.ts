/* Avis clients : le bloc « Ils en parlent » de l'accueil n'apparaît que lorsque cette liste contient au moins un avis.
   - GOOGLE_PLACE_ID : l'identifiant de la fiche Google (Place ID). Il sert à fabriquer le lien vers tous les avis et celui pour en laisser un.
   - Chaque avis : le texte exact tel que publié (rien de réécrit), le prénom ou le nom affiché, la date, la source.
   Aucune note n'est balisée dans les données structurées : Google ne tient pas compte des avis qu'un site publie sur sa propre
   entreprise, et ce balisage peut être pénalisé. Les étoiles ne sont donc affichées qu'en texte, à partir de ces données réelles. */
export const GOOGLE_PLACE_ID = '';
/* GOOGLE_CID : l'identifiant numérique de la fiche (celui des liens Google Maps « ?cid= »). Il suffit pour renvoyer vers la fiche et ses avis. */
export const GOOGLE_CID = '3272981193740455660';
/* GOOGLE_WRITE_REVIEW_URL : le lien court « Demander des avis » de la fiche (de la forme https://g.page/r/…/review), à coller ici. */
export const GOOGLE_WRITE_REVIEW_URL = '';

export interface Review {
  author: string;
  text: string;
  /** Date de l'avis, en toutes lettres (ex. « mai 2026 ») */
  date: string;
  /** Note de 1 à 5 */
  rating: number;
  source: 'Google' | 'Malt' | 'Graphiste.com' | 'Fiverr' | 'Client';
}

export const reviews: Review[] = [];

export const googleReviewsUrl = GOOGLE_PLACE_ID
  ? `https://search.google.com/local/reviews?placeid=${GOOGLE_PLACE_ID}`
  : GOOGLE_CID
    ? `https://www.google.com/maps?cid=${GOOGLE_CID}`
    : '';
export const googleWriteReviewUrl =
  GOOGLE_WRITE_REVIEW_URL || (GOOGLE_PLACE_ID ? `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE_ID}` : '');
