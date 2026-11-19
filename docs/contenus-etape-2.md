# Étape 2 : version éditoriale corrigée

Version 2, du 16 novembre 2026, à valider page par page avant toute intégration. Aucune modification du code.

Cette version applique les arbitrages du 16 novembre : faits harmonisés, promesses non garanties retirées, contenus de cas limités aux faits vérifiés. Les variantes ne sont gardées que là où un choix reste ouvert.

Marqueurs :
- `[À CONFIRMER]` : fait que je ne peux pas vérifier ;
- `[OBSERVÉ]` : relevé sur le site en ligne lecuistologue.fr le 13 novembre 2026, à confirmer comme choix de conception.

---

## 0. Faits de référence (à utiliser partout, à l'identique)

| Sujet | Formulation de référence |
| --- | --- |
| Identité | Concepteur numérique indépendant · Sites web, interfaces et logiciels |
| Activité indépendante | Depuis 2026 |
| Expérience SaaS | Environ deux ans de conception UX/UI sur un logiciel SaaS métier (gestion de maintenance, GMAO), chez un éditeur de logiciel, sans le nommer |
| Formation | Wild Code School, titre professionnel de concepteur UI, formation incluant l'UX `[À CONFIRMER : intitulé officiel exact du titre s'il est cité]` |
| Zone | Île-de-France, et missions à distance partout en France. La commune reste dans les mentions légales et les données structurées (adresse), pas dans les accroches |
| Renfort d'équipe | Possible selon le projet, ponctuellement, en conception UX/UI ou en développement front-end. Ni rythme, ni disponibilité, ni présence annoncés |
| Audit | Revue experte, appuyée sur les bonnes pratiques ergonomiques et les WCAG comme référentiel de travail. Aucune certification ni conformité revendiquée ; ne remplace pas un test utilisateur |
| Référencement | Structure technique, sémantique et bases du référencement. Aucune promesse de positionnement, de visibilité dans les assistants IA ni d'absence de perte lors d'une refonte |
| Écrans | « adapté aux différents écrans » (plus « accessible à tous les écrans ») |

## 1. Passages actuels à corriger (relevé dans le code)

Ces passages contredisent les faits de référence. Ils seront remplacés à l'intégration par les textes des sections suivantes.

| Fichier | Passage actuel | Correction |
| --- | --- | --- |
| `src/components/Hero.astro:9` | Webdesigner UX/UI freelance · Yvelines | Concepteur numérique indépendant · Sites web, interfaces et logiciels |
| `src/components/Footer.astro:10` | Webdesigner UX/UI freelance · Yvelines | Concepteur numérique indépendant · Île-de-France |
| `src/components/Footer.astro:35` | Yvelines | Île-de-France |
| `src/components/AboutMini.astro:8` | zones Yvelines, Val-d'Oise, Oise | Île-de-France · À distance, partout en France |
| `src/components/AboutMini.astro:30` | Pendant plusieurs années… | Voir § 2.7 |
| `src/components/AboutMini.astro:49` | Basé à Guitrancourt (78)… Yvelines… | Je travaille en Île-de-France et à distance, partout en France. |
| `src/components/ServiceCards.astro:14` | Référencement inclus, pour les moteurs de recherche comme pour les assistants IA | Section remplacée (§ 2.3) |
| `src/components/ServiceCards.astro:22` | …sans perdre votre référencement | Section remplacée (§ 2.3) |
| `src/layouts/BaseLayout.astro:35` | texte alternatif de l'image de partage : « …dans les Yvelines… » | Antoine Bruneau, concepteur numérique indépendant : sites web, interfaces et logiciels |
| `src/layouts/BaseLayout.astro:49` | Webdesigner UX/UI freelance, Yvelines — Antoine Bruneau | Voir § 2.10 |
| `src/layouts/BaseLayout.astro:58-60` | services (« moteurs de réponse IA ») | Voir § 9 |
| `src/layouts/BaseLayout.astro:73` | …dans les Yvelines et à distance… | …en Île-de-France et à distance partout en France |
| `src/layouts/BaseLayout.astro:91` | « Optimisation pour les moteurs de réponse et les assistants IA (GEO) » | Retiré |
| `src/layouts/BaseLayout.astro:99-103` | zones Yvelines, Val-d'Oise, Oise, Paris, Île-de-France | Île-de-France, France |
| `src/layouts/BaseLayout.astro:112` | indépendant depuis 2025 | depuis 2026 (§ 9) |
| `src/layouts/BaseLayout.astro:118` | « Design d'application mobile », « GEO » | Retirés |
| `src/pages/index.astro:78` | Je suis basé dans les Yvelines | Voir § 2.8 |
| `src/pages/index.astro:99` | description « (Yvelines)… utiles et accessibles » | Voir § 2.10 |
| `src/pages/a-propos.astro:15` | description « …dans les Yvelines… depuis 2025 » | Voir § 7.8 |
| `src/pages/a-propos.astro:48` | plusieurs années… | Voir § 7.6 |
| `src/pages/a-propos.astro:52` | Guitrancourt (78)… Yvelines, Val-d'Oise, Oise… | Voir § 7.6 |
| `src/pages/a-propos.astro:65` | Depuis 2025… | Depuis 2026 (§ 7.3) |
| `src/pages/a-propos.astro:87`, `src/pages/contact.astro:33` | zones Yvelines, Val-d'Oise, Oise… | Île-de-France · À distance, partout en France |
| `src/pages/a-propos.astro:133` | webdesigner UX/UI freelance · Yvelines | Voir § 7.2 |
| `src/pages/audit-ux-ui.astro:18` | description « …Yvelines. » | Voir § 5.6 |
| `src/pages/audit-ux-ui.astro:97` | basé dans les Yvelines | Voir § 5.5 |
| `src/pages/creation-site-web.astro:18` | description « (Yvelines) : design accessible… » | Voir § 3.7 |
| `src/pages/refonte-site-web.astro:19` | description « …sans perdre votre SEO » | Voir § 4.6 |
| `src/pages/refonte-site-web.astro:67` | « Une base neuve, votre référencement préservé » | Voir § 4.3 |
| `src/pages/refonte-site-web.astro:72` | « …votre référencement n'est pas remis à zéro » | Voir § 4.4 |
| `public/llms.txt` (plusieurs lignes) | Yvelines, 2023 à 2025, depuis 2025, assistants IA, « sans perdre le référencement acquis », opposition aux modèles | Réécrit (§ 9) |

Les zones du Cuistologue (Oise, Val-d'Oise, Yvelines, Eure) concernent le client et restent inchangées.

**Point à vérifier** : les mentions légales (`src/pages/mentions-legales.astro:22`) indiquent une date au 09/04/2025. Si c'est la date d'immatriculation de l'entreprise, elle reste exacte et n'a pas à changer. Sinon, à corriger `[À CONFIRMER]`.

---

## 2. Accueil

Structure validée : Hero, deux domaines, manifeste, méthode, réalisations, présentation, FAQ, appel final.

### 2.1 Hero

- **Surtitre** : Concepteur numérique indépendant · Sites web, interfaces et logiciels
- **Titre (h1)** : Des sites et des interfaces pensés pour leur usage.
- **Sous-titre** : Je conçois et réalise des sites web pour les indépendants et les PME, ainsi que des interfaces de logiciels pour les équipes produit. De la compréhension du besoin au développement, vous avez un seul interlocuteur.
- **Bouton principal** : Voir mes réalisations
- **Lien secondaire** : Parlons de votre projet
- **Réassurance** : Premier échange gratuit · Réponse sous 24 h ouvrées
- **Preuve** : Environ 2 ans de conception UX/UI sur un logiciel SaaS métier · Développement front-end

### 2.2 Deux domaines

- **Titre** : Deux domaines, une même façon de travailler.
- **Sous-titre** : Un site pour présenter votre activité et faciliter la prise de contact, ou une interface pour que vos utilisateurs travaillent mieux.

**Carte 1**
- Surtitre : Sites web
- Titre : Un site qui présente clairement votre activité.
- Pour qui : Indépendants, artisans, commerçants, PME et entreprises de services.
- Besoins : une activité difficile à expliquer ; un site vieillissant qui ne vous ressemble plus ; des visiteurs qui ne prennent pas contact.
- Ce que je fais : création ou refonte, organisation des contenus, UX/UI et direction artistique, intégration, bases du référencement et performances, mise en ligne et prise en main.
- Liens : Créer un site · Refaire un site
- Note : Pas sûr du point de départ ? Un audit UX/UI vous aide à décider.

**Carte 2**
- Surtitre : Interfaces et logiciels
- Titre : Des écrans clairs pour des usages métier.
- Pour qui : Éditeurs SaaS, PME avec un logiciel métier, outils internes, agences et studios.
- Besoins : un nouveau produit ou un nouveau module à concevoir ; des parcours trop complexes ; des écrans incohérents entre eux ; une équipe qui a besoin d'un renfort ponctuel.
- Ce que je fais : audit, organisation des parcours, wireframes et prototypes, conception UI et design system, spécifications et intégration front-end selon le projet.
- Lien : Découvrir les interfaces et logiciels

### 2.3 Manifeste

- **Titre** : Comprendre avant de concevoir.
- **Chapô** : Chaque projet commence par une conversation. Avant de dessiner, je cherche à comprendre votre activité, vos utilisateurs et ce qu'ils doivent pouvoir faire. L'outil vient ensuite : WordPress, Webflow, un outil no-code ou du code sur mesure, selon ce qui sert le projet.

Trois repères :
1. **Une structure qui part du besoin.** Les pages, les parcours et les contenus sont organisés autour de ce que vos visiteurs ou vos utilisateurs viennent faire.
2. **Des écrans pensés pour ceux qui s'en servent.** Lisibles, cohérents entre eux, utilisables au clavier et adaptés aux différents écrans.
3. **Une qualité vérifiée avant la mise en ligne.** Performance, accessibilité et bases du référencement sont prises en compte dès les maquettes, puis contrôlées.

### 2.4 Méthode

- **Titre** : De la première conversation à la mise en ligne
- **Sous-titre** : Quatre étapes, chacune validée avec vous : vous savez toujours où en est votre projet.

| # | Libellé | Texte et « Vous recevez » |
| --- | --- | --- |
| 01 | Comprendre | Vos textes du 14 novembre, inchangés |
| 02 | Structurer | Inchangé |
| 03 | Concevoir | Inchangé |
| 04 | Réaliser | Inchangé |

- **Note après les étapes** : Après la livraison, une prise en main et, si vous le souhaitez, un suivi mensuel.

### 2.5 Réalisations

- **Libellé** : Réalisations · **Titre** : Le Cuistologue
- Le besoin : présenter clairement une offre de cuisine à domicile et ses prestations.
- Ce que j'ai fait : l'identité visuelle, le site web et les supports imprimés, de la première conversation à la mise en ligne.
- Les jauges Lighthouse et la scène restent en place.

**Ligne sous la vitrine** (remplace « Prochains projets », qui pointait vers une section désactivée) :

| Ligne | État | Lien |
| --- | --- | --- |
| Logiciel SaaS de gestion de maintenance · Conception UX/UI | Environ 2 ans, en entreprise | Vers la section « Une expérience métier » de la page Interfaces et logiciels |

Fer Harry n'apparaît pas.

### 2.6 Présentation (Qui suis-je)

- **Libellé** : Qui suis-je ? · **Titre** : Antoine Bruneau
- **Introduction** : De la création sonore à l'UX/UI, en passant par la création numérique et le développement : je réunis aujourd'hui ces métiers pour concevoir et réaliser des sites et des interfaces.
- **Bloc « Ma façon de travailler »** :
  - Titre : Concevoir et réaliser, avec le même interlocuteur.
  - Texte : Je comprends les enjeux de conception, mais aussi les contraintes techniques nécessaires à leur réalisation. Je dessine, puis je construis, ou je transmets à votre équipe : vous choisissez.
  - En exergue (conservé) : Je vous explique chaque choix simplement, et vous parlez toujours à la même personne.
- **Zone** : Je travaille en Île-de-France et à distance, partout en France.
- **Lien** : Voir mon parcours

### 2.7 Texte remplaçant `AboutMini.astro:30`

Il est intégré à l'introduction ci-dessus. L'expérience SaaS apparaît dans la preuve du Hero et dans À propos.

### 2.8 FAQ (réponses modifiées seulement)

- **Travaillez-vous sur des applications et des logiciels ?** Oui. Je conçois ou fais évoluer les interfaces de logiciels métier, de produits SaaS et d'outils internes : audit, parcours, wireframes, prototypes, conception UI, et l'intégration front-end selon le projet. Je peux aussi intervenir ponctuellement en renfort d'une équipe. Avant de me mettre à mon compte, j'ai conçu pendant environ deux ans les interfaces d'un logiciel SaaS de gestion de maintenance.
- **Avec quelles technologies travaillez-vous ?** Celles qui servent votre projet : WordPress (classique ou headless), Webflow, des outils no-code ou low-code quand ils suffisent, du code sur mesure quand il le faut. Je vous recommande ce qui convient à votre besoin, à votre budget et à votre autonomie après la livraison.
- **Travaillez-vous à distance ?** Oui. Je travaille en Île-de-France et à distance partout en France ; nous pouvons nous rencontrer si c'est plus simple pour vous.

### 2.9 Appel final

- **Titre** : Vous avez un site ou un outil à faire évoluer ?
- **Texte** : Présentez-moi votre besoin en quelques lignes. Nous verrons ensemble la meilleure manière d'avancer, sans partir d'une solution toute faite. Je vous réponds sous 24 h ouvrées.
- **CTA** : Parlons de votre projet

### 2.10 Métadonnées

- **Titre** : Concepteur numérique indépendant, sites et interfaces · Antoine Bruneau
- **Description** : Conception et réalisation de sites web et d'interfaces de logiciels métier : création, refonte, audit UX/UI et développement front-end. Île-de-France et à distance.

---

## 3. Création de site

### 3.1 Hero

- **Fil d'Ariane** : Création de site
- **Surtitre** : Sites web · Indépendants, artisans, PME
- **Titre** :
  - Un site qui explique / ce que vous faites. (recommandé)
  - Variante : Un site à la hauteur / de votre activité.
- **Chapô** : Vous ne commandez pas seulement des pages : vous obtenez un site construit autour de votre activité, de vos clients et de leurs besoins réels. Je le conçois, je le réalise et je le mets en ligne, avec vous à chaque étape.
- **CTA** : Parlons de votre site · **Lien** : Voir un exemple
- **Note** : Premier échange gratuit · Périmètre défini avant de commencer · Réponse sous 24 h ouvrées

### 3.2 Ce que vous recevez

- **Titre** : Un site pensé pour votre activité, du contenu à la mise en ligne.
- **Sous-titre** : Un site complet, organisé autour de ce que vos visiteurs viennent chercher.

1. **Une structure claire.** Les pages, les contenus et les parcours organisés autour de votre offre et de vos clients.
2. **Une conception sur mesure.** Maquettes ordinateur et mobile, cohérentes avec votre identité visuelle.
3. **Une réalisation soignée.** Un site rapide et adapté aux différents écrans, testé avant la mise en ligne.
4. **Les bases du référencement.** Une structure technique propre, un balisage sémantique, des titres, des descriptions et des données structurées.
5. **Une mise en ligne complète.** Nom de domaine, hébergement et mise en route, à votre nom.

### 3.3 Vous gardez la main

Les trois formules sont inchangées. Une phrase est ajoutée sous le sous-titre :

> L'outil est choisi selon ce que vous voulez gérer vous-même : WordPress, Webflow, un outil no-code ou du code sur mesure.

### 3.4 Méthode

Libellés : Comprendre (ex-Échange) · Structurer (ex-Cadrage) · Concevoir (ex-Maquettes) · Réaliser (ex-Intégration) · Mettre en ligne. Textes inchangés.

### 3.5 FAQ (question ajoutée)

- **Quel outil allez-vous utiliser ?** Celui qui correspond à votre besoin : ce que le site doit faire, ce que vous voulez modifier vous-même et votre budget. WordPress, Webflow, no-code ou code sur mesure : je vous explique le choix dans le devis.

### 3.6 Appel final

- **Titre** : Parlons de votre site.
- **Texte** : Dites-moi ce que fait votre entreprise et ce que votre site doit permettre. Je vous réponds sous 24 h ouvrées.
- **CTA** : Parlons de votre site

### 3.7 Métadonnées

- **Titre** : Création de site web professionnel sur mesure
- **Description** : Création de site web pour indépendants, artisans et PME : organisation des contenus, UX/UI, réalisation, bases du référencement et mise en ligne. Premier échange gratuit.

---

## 4. Refonte de site

### 4.1 Hero

- **Surtitre** : Sites web existants
- **Titre** : Gardez ce qui marche, / refaites le reste.
- **Chapô** : Votre site a vieilli, ne reflète plus votre activité ou amène peu de demandes ? Je pars de l'existant : on corrige ce qui freine, on garde ce qui fonctionne.
- **CTA** : Faire évoluer mon site · **Lien** : Commencer par un audit
- **Note** : Premier échange gratuit · Réponse sous 24 h ouvrées · Audit déduit si nous poursuivons

### 4.2 Les signes

Inchangés.

### 4.3 Vous choisissez l'ampleur

- **Sous-titre** : On ne refait que ce qui le mérite : de la correction ciblée à la refonte complète.
- **Phrase ajoutée** : Le niveau d'intervention est décidé après l'analyse de votre site et de vos besoins, pas avant.
- **Niveau 1** : « Retouche ciblée » devient « Corrections ciblées » ; textes inchangés.
- **Niveau 2** : inchangé.
- **Niveau 3** : titre « Une base neuve, votre référencement préservé » remplacé par **« Une base neuve, vos contenus repris »**.
- **Renvoi** sous les niveaux : Votre besoin concerne une application ou un logiciel ? Voir Interfaces et logiciels.

### 4.4 Ce que je protège

Engagement « Vos adresses redirigées » réécrit :

> **Vos adresses redirigées.** Vos anciennes adresses mènent aux nouvelles, pour limiter les risques de perte de référencement.

Les autres engagements sont inchangés.

### 4.5 Méthode et FAQ

- Libellés : Analyser (ex-Audit) · Structurer · Concevoir · Réaliser · Mettre en ligne (ex-Bascule).
- FAQ « Vais-je perdre mon référencement ? » : réponse actuelle conservée. Elle dit déjà qu'aucune refonte ne garantit une position.

### 4.6 Appel final et métadonnées

- **Appel final** : Dites-moi ce qui ne va plus. · CTA : Faire évoluer mon site
- **Titre de page** : Refonte de site web, sans repartir de zéro
- **Description** : Refonte de site web : analyse de l'existant, corrections ciblées, refonte partielle ou complète, et redirections pour limiter les risques SEO. Premier échange gratuit.

---

## 5. Audit UX/UI

### 5.1 Hero

- **Surtitre** : Site web, application ou logiciel
- **Titre** : Un audit UX/UI pour voir clair / avant de décider.
- **Chapô** : Avant de refaire, identifiez ce qui freine. J'examine votre site ou votre interface, et je vous dis quoi corriger en premier.
- **CTA** : Demander un audit · **Lien** : Voir le rapport

### 5.2 Sections conservées

Cinq regards, Quand un audit est utile, Comment je procède, Ce que vous recevez.

Le cas « Peu de demandes » est reformulé : Le trafic est là, personne n'écrit : l'audit repère ce qui peut freiner vos visiteurs dans leur parcours.

### 5.3 Nouvelle section : la méthode et ses limites

Elle se place après « Comment je procède ».

- **Titre** : Une revue experte, et ce qu'elle ne remplace pas.
- **Mes références** : J'examine votre interface à partir des bonnes pratiques ergonomiques (clarté, cohérence, navigation, prévention des erreurs) et des WCAG, que j'utilise comme référentiel de travail pour l'accessibilité : contrastes mesurés, usage au clavier, libellés, structure des titres.
- **Ce que c'est** : Une revue experte. Je parcours votre interface et je relève les problèmes probables, avec leur emplacement et une recommandation.
- **Ce que ce n'est pas** : Ni un test utilisateur, qui observe de vraies personnes utiliser votre interface ; ni un audit de conformité ou une certification d'accessibilité ; ni la garantie d'un résultat commercial. Quand une question mérite d'être vérifiée auprès de vos utilisateurs, je l'indique dans le rapport.
- **Et après** : Les recommandations sont à vous. Vous pouvez les appliquer vous-même, avec votre équipe, ou me confier les corrections, une refonte ou la conception de nouveaux écrans.

### 5.4 Ce que vous recevez

Inchangé. La « Une recommandation par constat » reste formulée sans promesse de résultat.

### 5.5 FAQ (réponse modifiée)

- **Faut-il être en Île-de-France pour demander un audit ?** Non. L'audit se fait à distance, avec une restitution en visio. Je travaille en Île-de-France et à distance, partout en France.

### 5.6 Métadonnées

- **Titre** : Audit UX/UI et accessibilité de site ou de logiciel
- **Description** : Revue experte UX/UI d'un site ou d'un logiciel : parcours, clarté, navigation, mobile, accessibilité au regard des WCAG. Constats illustrés et recommandations classées.

---

## 6. Interfaces et logiciels (nouvelle page, `/interfaces-logiciels/`)

### 6.1 Structure

Hero · Les situations · Ce que je peux prendre en charge · Deux façons de travailler ensemble · Une expérience métier · Le cadre · FAQ · Appel final.

Mêmes composants que les autres pages de service.

### 6.2 Hero

- **Fil d'Ariane** : Interfaces et logiciels
- **Surtitre** : Logiciels métier, SaaS, outils internes
- **Titre** : Des interfaces conçues / pour les usages réels.
- **Chapô** : Je conçois et fais évoluer les interfaces de logiciels métier, de produits SaaS et d'outils internes. De l'organisation des parcours aux maquettes, jusqu'à l'intégration front-end selon les besoins du projet.
- **CTA** : Échanger sur mon interface · **Lien** : Voir mon expérience métier
- **Note** : Mission de conception ou renfort ponctuel · Premier échange gratuit

### 6.3 Les situations

- **Titre** : Quand faire appel à moi.
- **Sous-titre** : Un nouveau produit comme un existant à faire évoluer.

1. **Un nouveau produit ou un nouveau module.** Une fonctionnalité à concevoir, des parcours à imaginer avant le développement.
2. **Une interface à faire évoluer.** Des écrans ajoutés au fil des besoins, un ensemble qui a perdu sa cohérence.
3. **Des parcours trop longs.** Des utilisateurs qui cherchent, se trompent ou contournent l'outil.
4. **Pas de système commun.** Chaque nouvel écran est redessiné à partir de rien, et les écarts s'accumulent.
5. **Un besoin de renfort.** Votre équipe produit ou technique a besoin d'aide en conception UX/UI ou en front-end.

### 6.4 Ce que je peux prendre en charge

- **Titre** : Ce que je peux prendre en charge.
- **Sous-titre** : Selon votre besoin, une partie ou l'ensemble.

1. **Comprendre l'existant.** Audit de l'interface, analyse des parcours et des retours dont vous disposez.
2. **Organiser l'information.** Architecture des écrans, navigation, priorités de chaque vue.
3. **Prototyper.** Wireframes et prototypes pour valider les parcours avant de les développer.
4. **Concevoir l'interface.** Maquettes, composants et design system pour garder des écrans cohérents.
5. **Accompagner le développement.** Spécifications, échanges avec les développeurs et intégration front-end.

Sous la liste :

> Je travaille avec les informations et les utilisateurs auxquels vous me donnez accès. Quand une question mérite d'être testée auprès d'eux, je vous le signale.

### 6.5 Deux façons de travailler ensemble

- **Mission de conception.** Un périmètre défini (un produit, un module, un parcours ou une évolution d'interface), de l'analyse aux maquettes validées, avec ou sans intégration front-end.
- **Renfort d'équipe.** Renfort ponctuel, selon le projet et les modalités définies ensemble, en conception UX/UI ou en développement front-end, au sein de votre équipe produit ou technique.

### 6.6 Une expérience métier

Présentation courte et factuelle, sans page dédiée pour l'instant.

- **Titre** : Environ deux ans sur un logiciel de maintenance.
- **Texte** : Avant de me mettre à mon compte, j'ai été designer UX/UI pendant environ deux ans sur un logiciel SaaS de gestion de maintenance (GMAO), chez un éditeur de logiciel. Concevoir pour des professionnels qui utilisent leur outil chaque jour est l'exigence que j'apporte à chaque projet. `[À CONFIRMER : intitulé du poste]`
- Illustration : schéma original et abstrait, sans aucun élément du logiciel.
- Aucun type d'écran, profil d'utilisateur, décision ni résultat n'est cité tant que vous ne les avez pas confirmés. L'étude de cas détaillée viendra plus tard, à partir de vos informations.

### 6.7 Le cadre

- **Un périmètre écrit.** Ce qui est inclus, ce qui ne l'est pas, et le calendrier, avant de commencer.
- **Vos outils.** Je m'adapte à votre environnement et à vos conventions.
- **La confidentialité.** Ce que vous me confiez reste chez vous ; un accord de confidentialité peut être signé avant d'entrer dans le détail.
- **Des livrables exploitables.** Maquettes, composants et spécifications que votre équipe peut reprendre.

### 6.8 FAQ

- **Travaillez-vous avec des équipes de développement ?** Oui. Je fournis des maquettes et des spécifications exploitables, je réponds aux questions pendant le développement, et je peux intégrer le front-end selon le projet.
- **Pouvez-vous reprendre un design system existant ?** Oui. Je pars de ce qui existe, je complète les composants manquants et je documente les règles.
- **Faut-il un accès au logiciel ?** Pour un audit ou une évolution, oui : un accès de test ou de démonstration suffit. Nous réglons ce point avant le devis.
- **Intervenez-vous à distance ?** Oui. Je travaille en Île-de-France et à distance, partout en France.

### 6.9 Appel final et métadonnées

- **Appel final** :
  - Titre : Une interface à concevoir ou à faire évoluer ?
  - Texte : Décrivez-moi votre produit, ceux qui l'utilisent et ce que vous voulez construire ou améliorer. Nous verrons ensemble quelle forme d'intervention convient.
  - CTA : Échanger sur mon interface
- **Titre de page** : Conception UX/UI d'interfaces et de logiciels métier
- **Description** : Conception UX/UI et intégration front-end d'interfaces de logiciels métier, de produits SaaS et d'outils internes. Mission de conception ou renfort ponctuel.

---

## 7. À propos

### 7.1 Structure

Hero · Mon parcours · Ma façon de concevoir · Ce que je conçois (deux domaines) · Compétences (remplace « Mes outils ») · FAQ · Appel final.

### 7.2 Hero

- **Surtitre** : Antoine Bruneau, concepteur numérique indépendant
- **Titre** : De la création sonore / à la conception d'interfaces.
- **Chapô** : Je conçois et réalise des sites et des interfaces. Je comprends les enjeux de conception, mais aussi les contraintes techniques nécessaires à leur réalisation.
- **Zones** : Île-de-France · À distance, partout en France

### 7.3 Mon parcours

- **Titre de tuile** : D'une discipline à l'autre, le même fil.

Quatre temps, dans l'ordre chronologique. Les détails (dates, lieux, projets) restent à fournir. Les phrases ci-dessous n'affirment rien au-delà du parcours que vous avez décrit.

1. **La création sonore.** J'ai commencé par le son. `[À COMPLÉTER : une phrase sur ce que vous y faisiez, si vous le souhaitez]`
2. **La création numérique et visuelle.** Puis l'image et le numérique. `[À COMPLÉTER : idem]`
3. **Le développement.** J'ai appris à construire ce que je dessinais. `[À COMPLÉTER : idem]`
4. **L'UX/UI.** Je me suis formé à la Wild Code School (titre professionnel de concepteur UI, formation incluant l'UX), puis j'ai conçu pendant environ deux ans les interfaces d'un logiciel SaaS de gestion de maintenance, chez un éditeur.

**Phrase de liaison** : Depuis 2026, je réunis ces métiers à mon compte : je conçois, je réalise, et je reste votre interlocuteur du premier échange à la mise en ligne.

### 7.4 Ma façon de concevoir

1. **L'utile et le beau vont ensemble.** Une interface doit servir avant de plaire, et ce qui sert bien se remarque.
2. **Le bon outil pour le projet.** WordPress, Webflow, un outil no-code ou du code sur mesure : je choisis selon votre besoin, votre budget et ce que vous voulez gérer vous-même, et je vous explique pourquoi.
3. **L'accessibilité dès le départ.** Contrastes, navigation au clavier, textes lisibles : des critères pris en compte dès les premières maquettes, pas ajoutés à la fin.

### 7.5 Ce que je conçois

- **Sous-titre** : Deux domaines, une même exigence.
- **Sites web** : Création et refonte de sites professionnels, de l'organisation des contenus à la mise en ligne. Lien : Création de site.
- **Interfaces et logiciels** : Interfaces de logiciels métier, de produits SaaS et d'outils internes, des parcours aux maquettes et à l'intégration front-end. Lien : Interfaces et logiciels.

### 7.6 Compétences (remplace « Mes outils »)

- **Titre** : Ce que je sais faire.
- **Concevoir** : architecture de l'information, parcours, wireframes, prototypes, UI, design system.
- **Réaliser** : intégration et développement front-end, WordPress, Webflow. `[À CONFIRMER : technologies à citer]`
- **Mettre en ligne** : bases du référencement, performances, accessibilité, hébergement.

### 7.7 FAQ

- **Travaillez-vous seul ?** Inchangé.
- **D'où vient votre expérience ?** D'un parcours qui va de la création sonore et visuelle au développement, puis à l'UX/UI, avec une formation à la Wild Code School. J'ai ensuite conçu pendant environ deux ans les interfaces d'un logiciel SaaS de gestion de maintenance chez un éditeur, avant de me mettre à mon compte en 2026.
- **Où travaillez-vous ?** En Île-de-France et à distance, partout en France : visio, téléphone et e-mail suffisent à chaque étape.

### 7.8 Appel final et métadonnées

- **Appel final** :
  - Titre : Échangeons sur votre besoin.
  - Texte : Quelques lignes suffisent : votre activité, ce que vous voulez construire ou faire évoluer. Je réponds sous 24 h ouvrées.
  - CTA : Échanger sur mon besoin
- **Titre de page** : À propos d'Antoine Bruneau, concepteur numérique
- **Description** : Un parcours de la création sonore à la conception d'interfaces : création numérique, développement, formation UX/UI et deux ans sur un logiciel SaaS métier.

---

## 8. Le Cuistologue

### 8.1 Structure

| # | Section | État |
| --- | --- | --- |
| 1 | En-tête | Inchangé |
| 2 | Le projet | Titre conservé |
| 3 | Ce que montre le site livré | Nouvelle section, faits observés |
| 4 | Dans Figma | Inchangé |
| 5 | Le site en ligne | Inchangé |
| 6 | L'identité | Inchangé |
| 7 | Les imprimés | Inchangé |
| 8 | Ce qui a été livré | Nouvelle section, à confirmer |
| 9 | Pour votre projet | Inchangé |
| 10 | Appel final | Inchangé, CTA « Présenter mon projet » |

### 8.2 Le projet

- **Titre** : Faire confiance avant d'ouvrir sa porte.
- **Chapô** : inchangé.
- La phrase sur la situation de départ n'est ajoutée que si vous la fournissez `[À CONFIRMER]`.

### 8.3 Ce que montre le site livré

Le principe : on ne présente que ce qui est visible sur le site en ligne, sans lui attribuer de raison tant que vous ne l'avez pas confirmée. Chaque ligne porte un « pourquoi » vide à remplir, ou à supprimer.

- **Surtitre** : Les choix
- **Titre** : Ce qui devait être clair avant l'appel.

| Question du visiteur | Ce que montre la page d'accueil en ligne | Pourquoi |
| --- | --- | --- |
| Qui vient chez moi ? | La présentation du cuisinier, avec sa photo, juste après le premier écran `[OBSERVÉ]` | `[À CONFIRMER]` |
| Combien ça coûte ? | « À partir de 74,50 € / intervention » et le contenu d'une intervention, sur la page d'accueil `[OBSERVÉ]` | `[À CONFIRMER]` |
| Comment ça se passe ? | « Une semaine qui se prépare en trois étapes » `[OBSERVÉ]` | `[À CONFIRMER]` |
| Est-ce près de chez moi ? | « Une cuisine à domicile, près de chez vous », avec les quatre départements desservis `[OBSERVÉ]` | `[À CONFIRMER]` |

Si vous préférez ne pas expliquer ces choix, la section peut rester sous forme de constats, avec le titre « Ce que le visiteur trouve dès l'accueil ».

### 8.4 Légendes de « Dans Figma »

Les légendes sont factuelles, sans mention de nombre de pages :

1. Fil de fer : Le squelette de la page d'accueil.
2. Premier écran : La promesse et deux boutons : découvrir les formules ou demander un devis.
3. Formules : Le prix « à partir de » et le contenu d'une intervention.
4. Les pages : Les pages du site, côte à côte dans le même fichier.

Le libellé de pastille « Neuf pages » devient « Les pages ».

### 8.5 Ce qui a été livré

- **Titre** : Ce qui a été livré.
- **Liste** :
  - Identité visuelle et logo ;
  - Site web, sur ordinateur et sur mobile ;
  - Trois affiches A3, des cartes de visite en trois versions, un flyer recto verso ;
  - Mise en ligne `[À CONFIRMER : périmètre exact, par exemple CMS, prise en main, référencement]`.

Les supports imprimés sont présents dans le fichier Figma et déjà montrés sur la page. Le reste est à confirmer.

---

## 9. Contact

### 9.1 Panneau

- **Titre** : Parlons de / votre projet. (inchangé)
- **Chapô** : Quelques lignes suffisent. Je reviens vers vous sous 24 h ouvrées.
- **Promesses** : Premier échange gratuit, pour comprendre votre besoin · Périmètre et devis écrits avant de commencer · Réponse sous 24 h ouvrées
- **Zones** : Île-de-France · À distance, partout en France

### 9.2 Formulaire

- **Titre** : Présenter mon projet

| Champ | Statut | Contenu |
| --- | --- | --- |
| Nom | requis | Nom |
| E-mail | requis | E-mail |
| Type de projet | requis | Création de site · Refonte de site · Interface ou logiciel · Audit UX/UI · Renfort d'équipe · Autre |
| Votre besoin | requis | Message |

- Aucun champ Budget.
- Aucun champ Délai : il n'existe pas aujourd'hui, et l'échéance reste une simple suggestion dans les canevas d'aide, ce qui ne freine pas l'envoi.

**Canevas d'aide** : les quatre actuels sont conservés. Deux sont ajoutés :
- **Interface ou logiciel** : Le produit et ce qu'il permet de faire · Qui l'utilise · Ce que vous voulez concevoir ou améliorer · Votre équipe (design, développement)
- **Renfort d'équipe** : Votre équipe et votre produit · Le besoin (UX/UI, front-end) · La période envisagée, même approximative · Vos outils

### 9.3 Métadonnées

- **Titre** : Contact, présenter votre projet de site ou d'interface
- **Description** : Présentez votre projet de site web, d'interface de logiciel ou d'audit UX/UI. Premier échange gratuit, réponse sous 24 h ouvrées.

---

## 10. Navigation et éléments transversaux

### 10.1 Menu

Création de site · Refonte de site · Interfaces et logiciels · Audit UX/UI · Réalisations · À propos

- « Réalisations » pointe vers Le Cuistologue, seule étude de cas pour l'instant.
- Pas de page `/realisations/` ni de page GMAO dédiée dans ce lot : elles viendront avec la deuxième étude de cas.
- « FAQ » reste dans le pied de page.
- **Bouton d'en-tête** : Parlons de votre projet

### 10.2 Pied de page

- Accroche : Concepteur numérique indépendant · Île-de-France
- Lieu : Île-de-France
- Liens : ajout de « Interfaces et logiciels »

### 10.3 Données structurées et `llms.txt`

Ils sont rédigés à l'intégration, à partir des faits de référence (§ 0). Ce lot ne contient aucun nouveau texte public.

- **`jobTitle`** : Concepteur numérique indépendant, UX/UI et développement front-end
- **Description de la personne** : Concepteur numérique indépendant, ancien designer UX/UI pendant environ deux ans sur un logiciel SaaS métier, formé à la Wild Code School, indépendant depuis 2026.
- **Services** : Création de site web · Refonte de site web · Conception d'interfaces et de logiciels · Audit UX/UI, avec des descriptions sans promesse de référencement ni mention des assistants IA.
- **`knowsAbout`** : retrait de « Design d'application mobile » et de « GEO ».
- **Zone** : Île-de-France, France.
- **`llms.txt`** : il reprend les faits du § 0, sans « 2023 à 2025 » (années à confirmer si elles sont citées), sans opposition aux modèles et sans « sans perdre le référencement acquis ».

---

## 11. Restant à fournir

| Sujet | Information |
| --- | --- |
| Formation | Intitulé officiel exact du titre, s'il doit être cité |
| GMAO | Intitulé du poste (sinon « designer UX/UI ») |
| Parcours | Une phrase facultative pour le son, l'image et le développement |
| Compétences | Technologies à citer sous « Réaliser » |
| Le Cuistologue | Les « pourquoi » du § 8.3 (ou la version constats seuls), situation de départ, périmètre livré |
| Mentions légales | Nature de la date 09/04/2025 |
