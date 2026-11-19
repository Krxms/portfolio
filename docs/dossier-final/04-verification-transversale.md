# 04 · Vérification transversale

Comparaison faite le 16 novembre 2026 entre le projet actuel (branche `design-wip`), les contenus finaux ([01-contenus.md](01-contenus.md)) et les CGV révisées ([02-cgv.md](02-cgv.md)).

Sources analysées :
- les pages du site ;
- `src/components/*` ;
- `src/layouts/BaseLayout.astro` ;
- `src/pages/cgv.astro` et `src/pages/mentions-legales.astro` ;
- `src/pages/contact.astro` et `src/scripts/contactForm.js` ;
- `worker/index.js` (e-mail de confirmation) ;
- `public/llms.txt`.

Il n'y a pas de modèle de devis dans le projet.

## 1. Anciennes promesses encore présentes dans le code

Toutes sont corrigées par les contenus finaux.

| Sujet | Où (actuel) | Correction |
| --- | --- | --- |
| « Réponse sous 24 h ouvrées » | `Hero.astro:19` ; `FinalCta.astro:32` ; notes des Hero de Création, Refonte et Audit ; FAQ Audit ; appels finaux ; `contact.astro` (engagements, réassurance) ; `contactForm.js:113` ; `worker/index.js:174` (« sous 24h ouvrées ») ; `llms.txt` | « Généralement sous deux jours ouvrés » partout, ou retrait là où la mention est redondante |
| Audit « déduit » sans précision | `ServiceCards.astro:31` ; `audit-ux-ui.astro:78,128` ; `creation-site-web.astro:81` ; `refonte-site-web.astro:80,95,122` | « 50 % de l'audit déduit si le projet suit dans les 3 mois » (court) ou la formulation complète |
| « Tarif préférentiel pour le pack audit + conception » | `refonte-site-web.astro:95` ; `BaseLayout.astro:59` | Retiré |
| « Devis gratuit » seul | `audit-ux-ui.astro:128` | « Devis gratuit et détaillé » |
| « Tout vous appartient » et cession générale | `creation-site-web.astro` (engagements, FAQ) ; `refonte-site-web.astro` (engagements) ; `index.astro` (FAQ 5) | « Ce qui vous revient » (créations finales, licences tierces, comptes) |
| « Je m'occupe de tout… vous ne touchez à rien » | `creation-site-web.astro` (formules) | « Je m'en occupe » : maintenance sur contrat distinct |
| « Suivi mensuel si vous le souhaitez » | `index.astro` (`after` de la méthode) | Maintenance facultative, sur devis ou contrat distinct |
| « Sans coupure » | `refonte-site-web.astro` (étape Bascule) | Retiré |
| « Votre référencement préservé » | `refonte-site-web.astro:67` | Retiré |
| « Référencement… n'est pas remis à zéro » | `refonte-site-web.astro:72` | Plan de redirection |
| « Rien ne se perd en route » | `refonte-site-web.astro` (titre) | « Une refonte préparée avec soin. » |
| « Rien n'est jeté sans votre accord… sauvegardé » | `refonte-site-web.astro` (engagement) | « Une bascule préparée » (sauvegarde réalisée ou vérifiée) |
| « Rapport classé par priorité » à l'étape 1 de la Refonte | `refonte-site-web.astro` (étapes) | Lecture rapide gratuite, sans livrable |
| Proportions 25 %, 60 %, 100 % | `refonte-site-web.astro` (niveaux, `me`, `share`) | Trois crans et « Ce qui change » |
| Pourcentages 100 %, 55 %, 18 % | `creation-site-web.astro` (formules) | Trois crans |
| « Webdesigner UX/UI freelance » | `Hero.astro`, `Footer.astro`, `BaseLayout.astro` (titre, `jobTitle`, description, image), `a-propos.astro`, `AboutMini.astro` (texte alternatif) | Identité « Concepteur numérique indépendant » |
| « Yvelines » (zone du prestataire) | `Hero`, `Footer`, `AboutMini`, `BaseLayout` (zones), `a-propos`, `contact`, `audit-ux-ui`, `creation-site-web`, `index`, `llms.txt` | Île-de-France et à distance. Les zones du client Le Cuistologue restent. |
| « Indépendant depuis 2025 », « plusieurs années », « 2023 à 2025 » | `BaseLayout:112`, `a-propos:15,48,65`, `AboutMini:30`, `llms.txt` | 2026 ; environ deux ans |
| GEO, assistants IA, application mobile | `BaseLayout:58,91,118`, `ServiceCards:14`, `llms.txt`, `a-propos` (domaine Applications mobiles) | Retirés |
| Renfort « UX/UI ou front-end » | Textes de la V3 (pas encore dans le code) | UX/UI uniquement, déjà corrigé dans les contenus finaux |
| CGV, objet « identité de marque, développement de sites sur-mesure » | `cgv.astro` art. 1 | CGV révisées, art. 1 |
| CGV, « pénalités conformément à la législation » | `cgv.astro` art. 3 | CGV art. 5 (taux et 40 €) |

## 2. Cohérence entre les ensembles (après correction)

| Point | Site (01) | CGV (02) | Devis (03) | État |
| --- | --- | --- | --- | --- |
| Premier échange gratuit et sans engagement | Partout | Art. 3 | n/a | OK |
| Devis gratuit et détaillé, valable 30 jours | FAQ, Contact | Art. 3 | § 1 | OK. La validité n'est pas affichée sur le site, ce qui ne pose pas de problème. |
| Lecture préalable gratuite, sans livrable | Accueil 01, FAQ 6, Refonte étape 1 et FAQ 3 | Art. 3 | n/a | OK |
| Audit facturé, déduction de 50 % sous 3 mois | Audit, Refonte, Création | Absent : condition commerciale qui relève du devis | § 6 | OK. Choix volontaire de ne pas la mettre dans les CGV. |
| Acompte 40 %, démarrage après encaissement | Méthode (« acompte », sans taux) | Art. 4-5 | § 6 | OK. Le taux n'est pas affiché sur le site, ce qui ne pose pas de problème. |
| Solde facturé à la livraison | Méthode | Art. 5, 9 | § 6-7 | OK |
| Deux séries de retours par étape | FAQ Création 4, méthode | Art. 6 | § 4 | OK |
| Pas de validation tacite intermédiaire | Rien d'affiché | Art. 6 | § 4 | OK |
| Réception, 10 jours ouvrés | Rien d'affiché | Art. 9 | § 7 | OK |
| Prise en main si le client administre son site | Accueil 04, Création | Art. 9 | § 7 | OK |
| Corrections pendant 30 jours | Création (cadre), Refonte | Art. 10 | § 7 | OK |
| Maintenance facultative | Accueil (note), Création (formule) | Art. 11 | § 7 | OK |
| Sauvegarde réalisée ou vérifiée | Refonte | Art. 12 | § 2 | OK |
| Cession au paiement, licences tierces | Création, Refonte, FAQ | Art. 13-14 | § 9 | OK |
| Sources Figma et code | Interfaces (cadre) | Art. 13.3 | § 3 | OK |
| Comptes au nom du client lorsque c'est possible | Création, FAQ | Art. 14 | § 8 | OK |
| Confidentialité, NDA, sous-traitance RGPD | Interfaces (cadre) | Art. 18-19 | § 9 | OK |
| Portfolio | Implicite | Art. 18 | § 9 | OK. Le Cuistologue a l'accord écrit du client (E6-2). |
| Renfort comme designer UX/UI, facturé au temps | Accueil (carte, FAQ 7), Interfaces, À propos | Art. 1, 5 | § 10 | OK |
| Développement front-end réservé aux projets complets | Interfaces, À propos, FAQ | Art. 1 | § 10 | OK |
| Identité visuelle en complément | Carte Sites web, Création, À propos | Art. 1 | § 2 | OK |
| Pas de garantie SEO, de conformité ni de résultat | Refonte, Audit, Lighthouse | Art. 15 | § 2 | OK |
| Petits professionnels hors établissement | Rien d'affiché | Art. 16 | § 1, 11 | OK |
| TVA | Rien d'affiché | En-tête | § 1 | OK |
| Mentions légales : immatriculation 2025, indépendance 2026 | À propos (2026) | En-tête (2025) | n/a | OK : deux contextes distincts |

## 3. Points d'attention réels (non bloquants pour valider les contenus)

1. **`worker/index.js`** : l'e-mail de confirmation est envoyé côté serveur (Cloudflare Worker). Sa modification exige un redéploiement du Worker, pas seulement du site statique.
2. **Nouveaux types de projet** : le Worker accepte un `type` libre (200 caractères au plus) et ne filtre pas sur une liste fermée. Les nouveaux types (« Interface ou logiciel », « Renfort d'équipe ») passent sans modification du Worker. À vérifier en test d'envoi.
3. **Page de confidentialité** : `src/pages/confidentialite.astro` n'a pas été comparée en détail. Il faut vérifier qu'elle ne promet pas de délai de réponse et qu'elle décrit le traitement des données du formulaire de façon cohérente avec l'article 19 des CGV. C'est un contrôle d'intégration.
4. **Scènes illustrées** (`creation-front.svg`, `audit-front.svg`) : elles contiennent du texte vectorisé, sans mention « 24 h » détectée par recherche textuelle. Un contrôle visuel est à faire à l'intégration.
5. **Image de partage** (`og-image.jpg`) : son texte incrusté (« Votre site, avec du caractère », d'après le texte alternatif actuel) est à vérifier visuellement. Aucune modification n'est prévue si l'image ne contredit pas le positionnement.
6. **`astro.config.mjs`** : il contient l'autorisation des domaines ngrok en développement. Sans effet sur le site publié ; à garder ou à retirer selon votre usage.
