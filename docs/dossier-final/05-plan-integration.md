# 05 · Plan d'intégration

À exécuter après la validation du dossier. Aucune modification n'a encore été faite.

Les textes à intégrer sont ceux de [01-contenus.md](01-contenus.md) (§ indiqués) et de [02-cgv.md](02-cgv.md). L'ordre proposé suit les lots ci-dessous ; chaque lot est vérifié avant le suivant.

## Lot 1 · Composants communs

| Fichier | Section | À remplacer | Nouveau contenu | Adaptation de composant |
| --- | --- | --- | --- | --- |
| `src/components/Header.astro` | Tableau `links`, bouton | Menu actuel (Projets, FAQ), « Décrire mon projet » | § 1.1 : menu à 6 entrées, bouton « Parlons de votre projet » | Ajouter « Interfaces et logiciels », renommer « Réalisations ». Vérifier la largeur du menu desktop (une entrée de plus) et l'ordre `--i` des animations. |
| `src/components/Footer.astro` | Accroche, navigation, lieu, bouton | « Webdesigner UX/UI freelance · Yvelines », « Yvelines », « Décrire mon projet » | § 1.2 | Ajouter les liens Interfaces, Réalisations, FAQ |
| `src/components/FinalCta.astro` | Liste `cta-facts` | « Réponse sous 24 h ouvrées » | § 1.3 : « Réponse généralement sous deux jours ouvrés » | Aucune |
| `src/components/StickyCta.astro` | Libellé par page | « Décrire mon projet » | § 1.4 | Ajouter une prop `label` si elle n'existe pas |
| `src/components/Hero.astro` | Surtitre, sous-titre, actions, réassurance, preuve | Textes actuels | § 2.1 | Bouton principal vers `/projets/le-cuistologue/` (Voir mes réalisations), lien secondaire vers `/contact/` |
| `src/components/ServiceCards.astro` + `.css` | Tableau `cards` (3 cartes) | Création, Refonte, Audit | § 2.2 : deux cartes de domaine (Sites web, Interfaces et logiciels) | Passer de 3 à 2 cartes (grille et carrousel mobile), avec deux liens pour la carte Sites web. Choisir deux illustrations parmi les trois SVG existants. La note audit devient la note de la carte Sites web. |
| `src/components/Manifesto.astro` | Titre, chapô, `proofs` | Textes actuels (« identité… quand tout se ressemble », « jamais d'un gabarit ») | § 2.3 | Le mot mis en avant (`manifesto-word`) passe sur « concevoir », ou est supprimé |
| `src/components/ExplodedProcess.astro` | Tableau `names` (puces de la scène) | Échange, Audit et structure, Conception, Réalisation | Comprendre, Cadrer, Concevoir, Réaliser | Ajouter le paragraphe « Note interfaces » (§ 2.4) : nouvelle prop `note` ou prolongement de `after` |
| `src/components/ProjectTeaser.astro` | Textes du mode `caseStudy`, jauges, légende, `sc-next` | Besoin, « Ce que j'ai fait », « SEO », « Mesuré avec Lighthouse. », Prochains projets | § 2.5 | La liste `sc-next` devient une ligne « Logiciel SaaS de gestion de maintenance » vers `/interfaces-logiciels/#experience` |
| `src/components/AboutMini.astro` | Introduction, bloc, zone, pastilles, texte alternatif | Textes actuels | § 2.7 | Aucune |
| `src/components/PageHero.astro` | Aucun texte en dur | | Les notes sont passées par les pages | Aucune |

## Lot 2 · Pages de service

| Fichier | Sections | Contenu | Adaptation |
| --- | --- | --- | --- |
| `src/pages/index.astro` | `steps`, `faq`, Tile services, ExplodedProcess (`sub`, `after`), FinalCta, métadonnées | § 2 | Titre de la Tile services : « Deux domaines… » ; données FAQPage mises à jour |
| `src/pages/creation-site-web.astro` | `description`, `received`, `steps`, `levels`, `commitments`, `nextOffers`, `faq`, PageHero, Tile « Vous gardez la main », FinalCta, StickyCta | § 3 | Jauge des formules : trois crans au lieu des pourcentages (`me`), avec le libellé « Ce qui change ». Ajout de la FAQ « Combien de retours » et « Quel outil ». |
| `src/pages/refonte-site-web.astro` | `description`, `steps`, `scopes`, `commitments`, `nextOffers`, `faq`, PageHero, Tile « ampleur », Tile « cadre », FinalCta | § 4 | Même indicateur à trois crans (CSS partagé `cs-`). Titre de la Tile cadre : « Une refonte préparée avec soin. » |
| `src/pages/audit-ux-ui.astro` | `description`, `cases`, `steps`, `nextOffers`, `faq`, PageHero, FinalCta, bloc « Ce que l'audit ne fait pas » | § 5 | Le bloc est remplacé par la section § 5.4, en réutilisant la même mise en forme de paragraphe. Un troisième lien est ajouté dans « Autres façons de commencer ». |
| **`src/pages/interfaces-logiciels.astro` + `.css`** (nouveau) | Toute la page | § 6 | Copie structurelle de `refonte-site-web.astro` : PageHero, Tile situations (liste comme « signes », sans la scène ou avec une scène simplifiée), liste à repères, deux cartes « niveau » sans jauge, section Expérience (ancre `#experience`) avec un schéma SVG original, Tile cadre, FAQ, FinalCta. Données structurées `Service`, `BreadcrumbList`, `FAQPage`. |

## Lot 3 · À propos, Le Cuistologue, Contact

| Fichier | Sections | Contenu | Adaptation |
| --- | --- | --- | --- |
| `src/pages/a-propos.astro` | `description`, `story`, `principles`, `domains`, `faq`, `zones`, AboutHero, Tile domaines, bloc outils (commenté), FinalCta | § 7 | `domains` passe à 2 entrées. Le bloc « Mes outils » devient « Ce que je sais faire » (3 groupes) : réutiliser `.ap-tools` ou les cartes de `.ap-domains`. |
| `src/pages/projets/le-cuistologue.astro` + `.css` | `facts`, chapô du brief, mesures, section « Ce que le visiteur trouve » renommée « Les choix », plans Figma, chapôs Identité et Imprimés, nouvelle liste « Ce qui a été livré », FinalCta, métadonnées, `schema` | § 8 | Ajouter un plan « Une version intermédiaire » au reel Figma : export d'une version de l'accueil depuis la page Figma « Maquettes » (dossier « Old »), au format webp 1440 px, avec un nouveau mouvement de caméra. Corriger le libellé de la mesure SEO. |
| `src/pages/contact.astro` | `promises`, `zones`, `guides` (6 types), libellés, réassurance, métadonnées | § 9.1-9.2 | Ajouter 2 types au `<select>` et leurs canevas ; réordonner les options |
| `src/scripts/contactForm.js` | Message de succès (l. 113) | « sous 24 h ouvrées » | § 9.2 | Aucune |
| `worker/index.js` | E-mail de confirmation (l. 174) | « sous 24h ouvrées » | § 9.3 | Redéployer le Worker (`wrangler deploy`), sur autorisation |

## Lot 4 · Légal, SEO, IA

| Fichier | Contenu | Adaptation |
| --- | --- | --- |
| `src/pages/cgv.astro` | [02-cgv.md](02-cgv.md), texte complet (21 articles) | Reprendre la mise en forme `legal-body` ; mettre à jour la date de version et la `description` (« …conception de sites web et d'interfaces, audit UX/UI… ») |
| `src/pages/mentions-legales.astro` | Aucun changement de contenu | Aucune |
| `src/layouts/BaseLayout.astro` | § 11 : `pageTitle` de l'accueil, `imageAlt`, `services` (4), description du ProfessionalService, `areaServed`, Person (`jobTitle`, description, `knowsAbout`) | Aucune |
| `public/llms.txt` | § 12, texte complet | Aucune |
| `astro.config.mjs` | Autorisation ngrok (développement) | À conserver ou retirer selon votre usage |

## Vérifications après chaque lot

**Fonctionnelles**
- Build sans erreur (`npm run build`).
- Navigation : chaque entrée du menu et du pied de page mène à la bonne page, y compris `/interfaces-logiciels/` et l'ancre `#experience`.
- Accueil : deux cartes de domaine sur ordinateur et en carrousel mobile ; vue éclatée avec ses nouveaux libellés.
- Création et Refonte : indicateur à trois crans lisible (avec un texte pour les lecteurs d'écran).
- Le Cuistologue : reel Figma avec cinq plans (caméra, pastilles, légendes) ; visite du site inchangée.
- Contact :
  - les six types et leurs canevas, et l'insertion du canevas ;
  - un envoi de test réel : réception côté propriétaire et e-mail de confirmation avec « généralement sous deux jours ouvrés », types « Interface ou logiciel » et « Renfort d'équipe » ;
  - les messages d'erreur.
- Recherche dans le code et `dist/` : aucune occurrence restante de « 24 h », « 24h », « webdesigner », « Yvelines » (hors Le Cuistologue), « 2025 » (hors mentions légales et CGV), « plusieurs années », « pack », « préférentiel », « sans coupure », « Tout vous appartient », « sur-mesure » (hors contexte voulu), « GEO », « assistants IA » (hors commentaires de code), « application mobile ».
- Réduction des animations, navigation au clavier sur la nouvelle page et sur le reel Figma, focus visibles.
- Affichage à 375, 768 et 1440 px : aucun débordement horizontal.

**SEO et données**
- Titres et descriptions de chaque page conformes à 01 (longueur à contrôler, environ 50 à 60 et 120 à 160 caractères).
- Un seul H1 par page.
- Balise canonique de `/interfaces-logiciels/`.
- `sitemap-index.xml` qui inclut `/interfaces-logiciels/`.
- JSON-LD valide (Rich Results Test ou validateur schema.org) : FAQPage identiques aux FAQ affichées ; Service de la nouvelle page ; Person et ProfessionalService.
- `llms.txt` accessible, et liens internes valides.
- Liens internes : aucun lien mort, y compris « Voir mon expérience métier » et les « Autres façons de commencer ».
- Lighthouse mobile ≥ 90 sur les pages modifiées et la nouvelle page. Les scores relevés sont rapportés, sans les présenter comme des engagements.

**Légal**
- Lien vers les CGV depuis le pied de page.
- CGV en `noindex` (conservé).
- Version datée.
- Aucune publication des CGV avant la relecture professionnelle des clauses marquées `[VALIDATION PRO]`, si vous le souhaitez ainsi.

**Mise en production**
- Rien n'est commité ni poussé sans votre accord (une poussée sur master met le site en ligne).
- Le Worker est déployé séparément.
