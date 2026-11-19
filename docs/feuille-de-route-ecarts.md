# Feuille de route : écarts entre la direction et le site actuel

Étape 1 sur 3 : analyse seule, aucune modification du site. Relevé du 16 novembre 2026, branche `design-wip` (travail non commité inclus).

Légende : **Conforme**, **Partiel**, **Écart**, **Manquant**, **À trancher** (décision humaine nécessaire avant d'agir).

---

## 0. Points à trancher avant toute modification

Ces points bloquent l'étape 2, parce que la feuille de route contredit une règle existante ou demande un contenu qui n'existe pas encore.

1. **Nommer l'ancien employeur (« Rock Service »).** La feuille de route demande d'afficher « Expérience SaaS GMAO chez Rock Service ». La règle en vigueur sur le site est inverse : l'ancien employeur et son produit ne sont jamais nommés (« un éditeur de logiciel »), voir le commentaire de `src/pages/a-propos.astro` et la mémoire du projet. Il faut décider : nommer (avec accord écrit de l'entreprise) ou rester anonyme (« un éditeur de logiciel de GMAO »). La confidentialité des captures est un second sujet : sans autorisation, l'étude de cas devra reposer sur des schémas originaux.
2. **Fer Harry.** Aucune trace dans le portfolio. Le projet est en cours (site WordPress, nombreuses informations encore « à compléter » côté client) : pas de site livré, pas de captures finales. Il faut l'accord du client pour le présenter, et décider s'il apparaît maintenant (« en cours ») ou à la livraison.
3. **Le discours anti-gabarit.** La feuille de route demande de ne plus opposer le sur-mesure aux CMS, templates et no-code. Le site actuel le fait à plusieurs endroits (voir § 3.1). Il faut valider la nouvelle ligne avant de réécrire.
4. **« Applications mobiles ».** La page À propos présente « Applications mobiles » comme un domaine de conception. Aucun projet réalisé ne le démontre. La feuille de route interdit d'afficher des prestations non réalisées : à confirmer ou à retirer.
5. **Direction artistique « brutaliste / Bauhaus ».** La feuille de route parle de conserver « l'esprit brutaliste/Bauhaus ». Le site actuel est plutôt : verre (liquid glass), matière riso et béton, formes géométriques (disque, arche, quart de cercle, de filiation Bauhaus), panneaux bleus. Rien à changer si la formule désigne bien l'identité actuelle ; à confirmer pour éviter une mauvaise interprétation.
6. **Longueur des études de cas.** Récemment, la page Le Cuistologue a été volontairement allégée (« trop long, trop scolaire »). La feuille de route demande au contraire de rendre visibles le problème, les enjeux et les décisions. Il faut choisir le format : structure complète mais concise, avec des textes courts et un rythme visuel.

---

## 1. Positionnement (§ 1 de la feuille de route)

| Élément | État | Constat |
| --- | --- | --- |
| Identité « Concepteur numérique indépendant — UX/UI, sites web et interfaces métier » | **Écart** | Partout, l'identité est « Webdesigner UX/UI freelance » : surtitre du Hero (`src/components/Hero.astro`), surtitre d'À propos, `jobTitle` des données structurées (« Designer UX/UI et webdesigner freelance », `src/layouts/BaseLayout.astro`), `llms.txt`, descriptions de pages. La feuille de route demande d'éviter le positionnement « uniquement webdesigner ». |
| Double compétence conception et réalisation | **Partiel** | Présente (« je conçois l'interface, puis je la construis ou la transmets à votre équipe » : Création de site, Qui suis-je) mais jamais posée comme un trait d'identité principal. |
| Compréhension des enjeux métier | **Partiel** | Le Manifeste et Qui suis-je en parlent (« comprendre votre activité »). Pas de démonstration sur des projets métier, faute d'étude de cas GMAO. |
| Interlocuteur unique | **Conforme** | Très présent (Qui suis-je, Création, À propos, FAQ, contact). |
| Approche pragmatique, outils choisis selon le projet | **Partiel** | FAQ de l'accueil (« Celles qui servent votre projet ») et `llms.txt`. Contredit par le discours anti-gabarit (§ 3.1). |
| Ne pas ressembler à une agence généraliste | **Conforme** | Ton personnel, « je », une seule personne. |
| Ne pas proposer « huit métiers » | **Conforme** | Trois offres seulement (Création, Refonte, Audit). |
| Positionnement transversal, offres spécialisées | **Écart** | Les trois offres mélangent site, application et logiciel. Les surtitres des pages Création et Refonte disent « Site, application, logiciel ». Il n'y a pas de séparation par domaine. |

## 2. Deux domaines d'intervention (§ 2)

| Élément | État | Constat |
| --- | --- | --- |
| Domaine A, Sites web | **Partiel** | Couvert par Création et Refonte, mais ces pages parlent aussi d'applications et de logiciels. Les publics (indépendants, artisans, PME, B2B) sont en partie cités : « indépendants, petites entreprises ». |
| Domaine B, Interfaces et logiciels | **Manquant** | Pas de page dédiée. Il n'existe qu'en filigrane : Hero (« équipes produit »), Audit (« site, application, logiciel »), À propos (« Logiciels SaaS »), FAQ (« Travaillez-vous sur des applications et des logiciels ? »). Les prestations du domaine B (architecture de l'information, wireframes, prototypage, design system, spécifications, front-end) ne sont détaillées nulle part. |
| Visibilité équivalente dans l'identité | **Écart** | Le menu, le pied de page et les données structurées (`services` dans `BaseLayout.astro`) ne connaissent que les trois offres orientées site. |
| Renfort ponctuel d'équipe | **Partiel** | Mentionné une fois dans la FAQ de l'accueil (« travailler avec votre équipe comme designer »). |

## 3. Page d'accueil (§ 3)

Structure actuelle (`src/pages/index.astro`) : Hero → Manifeste → « Trois façons de mettre votre interface au travail » (3 cartes) → Méthode en 4 étapes (vue éclatée) → Dernier projet (Le Cuistologue + « Prochains projets ») → Avis (masqués tant qu'il n'y en a pas) → Qui suis-je → FAQ → Appel final.

### 3.1 Hero

| Élément | État | Constat |
| --- | --- | --- |
| Ce que je fais | **Partiel** | « Des interfaces que l'on retient. » est une accroche de marque. Le « quoi » arrive dans le sous-titre (« Sites, applications, logiciels : j'audite, conçois ou refais… »). |
| Pour qui | **Conforme** | « indépendants, petites entreprises et équipes produit ». |
| Ce qui différencie | **Partiel** | La preuve « Ancien designer UX/UI d'un logiciel SaaS métier » est présente. La double compétence conception et réalisation n'est pas dite. |
| Où cliquer | **Écart** | Le CTA principal est « Décrire mon projet » ; il n'y a pas de « Découvrir mes réalisations ». Le lien secondaire mène à l'audit. |
| Éviter les promesses génériques | **Conforme** | Aucune formule de type « boostez ». |
| Discours anti-gabarit (à trancher, § 0.3) | **Écart** | Manifeste : « Que reste-t-il de votre identité quand tout se ressemble ? » et « jamais d'un gabarit ». À propos, principe 02 : « L'humain et le sur‑mesure, pas le gabarit » (critique des sites « bâtis sur des modèles et des outils entièrement automatisés »). Hero d'À propos : « Une personne, pas un modèle ». `llms.txt` : « à l'opposé des sites bâtis sur des modèles automatisés ». Création de site : « non un assemblage de blocs ». |

### 3.2 Les deux domaines après le Hero

**Manquant.** La section actuelle juste après le Hero est le Manifeste, puis trois cartes de services (Création, Refonte, Audit), organisées par situation du client, pas par domaine. Les cartes sont riches et bien illustrées (`src/components/ServiceCards.astro`), et leur langage visuel peut être réutilisé pour deux cartes de domaine.

### 3.3 Approche en quatre étapes

**Partiel.** Il y a quatre étapes sur l'accueil (Échange, Audit et structure, Conception, Réalisation), proches de Comprendre, Structurer, Concevoir, Réaliser. Incohérences entre pages :
- l'accueil compte 4 étapes ;
- Création de site en compte 5 (Échange, Cadrage, Maquettes, Intégration, Mise en ligne) ;
- Refonte en compte 5 (Audit, Cadrage, Maquettes, Intégration, Bascule) ;
- `llms.txt` reprend l'ancienne formulation de l'accueil.

Le libellé de l'étape 2 (« Audit et structure ») mélange une prestation et une étape.

### 3.4 Sélection de projets

| Élément | État | Constat |
| --- | --- | --- |
| Trois projets | **Écart** | Un seul projet affiché (Le Cuistologue). |
| Fer Harry | **Manquant** | À trancher (§ 0.2). |
| GMAO | **Manquant** | À trancher (§ 0.1). |
| Image, nom, nature, enjeu, lien | **Partiel** | La vitrine Le Cuistologue a une image, le nom, le besoin et ce qui a été fait (mode `caseStudy`), un lien, des scores Lighthouse. Le format est adapté à un projet, pas à une liste de trois. |
| « Prochains projets » | **Écart** | La liste (Logiciel SaaS « En conception », Site sur mesure « À venir ») renvoie vers À propos, où le bloc correspondant (« Sur ma table de travail ») est commenté : le lien mène à une page qui n'en parle plus. |
| Menu « Projets » | **Écart** | Pointe directement vers `/projets/le-cuistologue/` : il n'y a pas de page qui liste les projets. |

### 3.5 Présentation personnelle (Qui suis-je)

**Partiel.** Courte, avec un lien vers À propos. Elle repose uniquement sur l'expérience SaaS (« Pendant plusieurs années, j'ai dessiné les interfaces d'un logiciel métier chez un éditeur »). Les trois compétences demandées n'y sont pas réunies : la culture de la création et de l'image est absente, le développement n'est qu'évoqué (« je construis »), l'UX/UI est présente.

### 3.6 Appel final

**Partiel.** « Mettons votre interface au travail » et « Décrire mon projet ». Le texte rassure (réponse sous 24 h, premier échange gratuit). La formulation proposée (« sans partir d'une solution toute faite ») est absente.

## 4. Pages de prestations (§ 4)

### 4.1 Création de site

| Élément | État | Constat |
| --- | --- | --- |
| Angle « besoin de communication et de présentation » | **Écart** | Le surtitre « Site, application, logiciel » et la phrase « Pour indépendants, PME et équipes produit » élargissent la page au domaine B. Le titre « Une interface qui donne envie de l'utiliser » parle d'interface, pas de site. |
| Compréhension de l'activité | **Partiel** | Étape Échange (« Votre activité, vos clients, ce que le site doit déclencher »). |
| Structuration des contenus, parcours | **Partiel** | Cadrage (« Les pages, les contenus attendus ») et maquettes. L'architecture de l'information n'est pas nommée comme un travail à part entière. |
| Adaptation aux écrans | **Conforme** | Livrables et étapes. |
| Cohérence identité et UX | **Manquant** | Non abordée. |
| Autonomie après livraison | **Conforme** | Trois formules, de « Je m'occupe de tout » à « Vous menez, je vous forme ». |
| Transparence sur les outils | **Partiel** | Absente de la page ; présente dans la FAQ de l'accueil et dans `llms.txt`. |

### 4.2 Refonte

| Élément | État | Constat |
| --- | --- | --- |
| « On ne refait que ce qui le mérite » | **Conforme** | Sous-titre de « Vous choisissez l'ampleur » et carte de service. |
| Trois niveaux | **Conforme** | Retouche ciblée, Refonte partielle, Refonte complète, avec une jauge. La feuille de route dit « Corrections ciblées » ; le site dit « Retouche ciblée » (nuance de vocabulaire). |
| Périmètre fixé après analyse | **Conforme** | Étape Audit, puis Cadrage. |
| Cible | **Écart** | Surtitre « Site, application, logiciel existants » et accroche « Votre site, votre application ou votre logiciel a vieilli ? » : mélange des deux domaines. |

### 4.3 Audit UX/UI

| Élément | État | Constat |
| --- | --- | --- |
| Ce qui est analysé | **Conforme** | « Cinq regards » (parcours, clarté, navigation, mobile, accessibilité). |
| Méthodes | **Partiel** | Revue experte décrite (« je parcours… comme le ferait un utilisateur »). Pas de nommage des référentiels (heuristiques, critères d'accessibilité) ni de distinction avec un test utilisateur. |
| Livrables | **Conforme** | Constats illustrés, une recommandation par constat, ordre d'action, restitution. |
| Limites d'un audit expert | **Manquant** | Rien n'indique qu'une revue experte ne remplace pas un test avec des utilisateurs ni des données d'usage. |
| Suites possibles | **Conforme** | Renvois vers Refonte et Création ; audit déduit si le projet se poursuit. |
| Pas de promesse de résultats | **Partiel** | Le cas « Peu de demandes » (« l'audit repère où vos visiteurs décrochent ») reste prudent. À relire pour ne laisser entendre aucun gain chiffré. |
| Porte d'entrée vers des missions plus importantes | **Conforme** | Déduction du prix et tarif préférentiel du pack audit et conception. |

### 4.4 Page « Interfaces et logiciels »

**Manquant.** Composants réutilisables : `PageHero`, `Tile`, scène illustrée `cs-stage` et repères (pages de service), liste d'étapes, engagements, FAQ et données structurées `Service` et `FAQPage` (même schéma que les autres pages de service), `ExplodedProcess` en mode `plain`.

## 5. Études de cas (§ 5 et § 6)

### 5.1 Le Cuistologue (`src/pages/projets/le-cuistologue.astro`)

Structure actuelle : en-tête, Le projet (une phrase et une fiche), mesures Lighthouse, Dans Figma (wireframe, maquettes, neuf pages), Le site (visite défilante), L'identité (logo, typographie, palette), Les imprimés, Pour votre projet, appel final.

| Étape demandée | État | Constat |
| --- | --- | --- |
| 1. Présentation (client, secteur, contexte, intervention, périmètre) | **Conforme** | Fiche : client, territoire, livrables, démarrage. Le secteur est dans le chapô. |
| 2. Le problème | **Partiel** | Une phrase : « Un cuisinier vient travailler dans votre cuisine… on veut savoir qui il est, ce qu'il prépare et ce que ça coûte. » Juste, mais très bref. |
| 3. Les enjeux | **Manquant** | Pas de section. Confiance, lisibilité du prix et zone d'intervention apparaissent seulement en légendes. |
| 4. La réflexion (choix et pourquoi) | **Écart** | Les décisions d'architecture et de parcours ne sont pas expliquées. Les légendes de la séquence Figma disent « quoi », pas « pourquoi ». |
| 5. La réalisation | **Conforme** | Wireframe, maquettes, site en ligne sur ordinateur et téléphone, identité, imprimés. |
| 6. Le résultat | **Partiel** | Les mesures Lighthouse sont honnêtes et datées, avec leurs défauts restants. Le reste de ce qui a été livré n'est pas récapitulé ; il n'y a pas de retour client. |
| Angle « rendre lisible une offre de service à domicile » | **Partiel** | Présent dans le titre du brief. La page reste dominée par les visuels (identité, imprimés), ce que la feuille de route demande d'éviter. |

### 5.2 Fer Harry

**Manquant** (à trancher, § 0.2). Aucun gabarit d'étude de cas réutilisable : la page Le Cuistologue est monolithique (données, sections et styles propres).

### 5.3 GMAO

**Manquant** (à trancher, § 0.1). Il faudra des illustrations originales si les captures ne peuvent pas être publiées.

### 5.4 SaaS de classification des déchets

À venir (P2). Il correspond probablement à « Logiciel SaaS, En conception » dans les « Prochains projets » de l'accueil.

### 5.5 Gabarit commun

**Manquant.** Pour trois études de cas, il faudra une structure commune : un composant ou une mise en page partagée pour les sections Présentation, Problème, Enjeux, Réflexion, Réalisation et Résultat, plutôt que trois pages entièrement spécifiques. La séquence Figma et la visite du site de la page Le Cuistologue sont des candidats à l'extraction en composants.

## 6. Page À propos (§ 7)

| Élément | État | Constat |
| --- | --- | --- |
| Récit création sonore, création numérique, développement, UX/UI | **Manquant** | Le parcours tient en deux phrases (SaaS, puis indépendant). Il n'y a rien sur le son, la culture visuelle ni le développement. Le commentaire du code indique un « texte provisoire, à réécrire ». |
| Formation UX/UI | **Manquant** | Non mentionnée. |
| Expérience SaaS/GMAO | **Conforme** | « logiciel SaaS de gestion de maintenance, chez un éditeur ». |
| Activité indépendante | **Conforme** | « Depuis 2025 ». |
| Phrase « Je comprends les enjeux de conception, mais aussi les contraintes techniques… » | **Manquant** | |
| Ton sans grandes déclarations | **Partiel** | Le principe 01 (« L'utile et le beau vont ensemble ») est un peu déclaratif ; le principe 02 est anti-gabarit (§ 0.3). |
| Domaines « Sites web / Logiciels SaaS / Applications mobiles » | **À trancher** | Voir § 0.4. Ils peuvent aussi devenir les deux domaines de la feuille de route. |
| Compétences techniques | **Manquant** | Le bloc « Mes outils » est commenté, en attente d'une vraie présentation des compétences. |

## 7. Éléments commerciaux (§ 8)

| Élément | État | Constat |
| --- | --- | --- |
| CTA contextuels | **Écart** | « Décrire mon projet » partout : en-tête, Hero, cartes, Hero et appel final de chaque page. Seule exception : Audit (« Demander un devis d'audit »). Les liens secondaires sont contextuels (« Commencer par un audit », « Voir un exemple »). |
| Formulaire : nom, e-mail, type, description | **Conforme** | Champs présents, avec en plus des canevas d'aide par type de projet et un modèle de message insérable. |
| Budget indicatif (facultatif) | **Manquant** | |
| Délai envisagé (facultatif) | **Partiel** | Demandé seulement dans le canevas du message (« Échéance souhaitée »), pas comme champ. |
| Types de projet | **Écart** | « Création de site, d'application ou de logiciel », « Refonte… », « Audit UX/UI », « Autre » : pas d'entrée pour le domaine B (interface, renfort d'équipe). |
| Premier échange pour comprendre | **Conforme** | « Premier échange gratuit et sans engagement ». |
| Périmètre défini avant démarrage | **Conforme** | « Un devis écrit » (Création), étape Cadrage. |
| Modalités explicites | **Conforme** | Acompte, solde à la livraison, CGV. |
| Outils selon le projet | **Partiel** | Voir § 4.1. |
| Propriété des livrables | **Conforme** | « Tout vous appartient… au paiement intégral ». |
| Pas de tarifs publics | **Conforme** | Devis uniquement. |

## 8. Direction artistique (§ 9)

**Conforme** dans l'ensemble : la feuille de route demande de conserver l'identité. Points d'attention pour l'étape 2 :
- les ajouts récents de la page Le Cuistologue (séquence Figma épinglée, visite défilante, bande d'imprimés) sont des mouvements liés au défilement ; ils restent sobres, mais trois sections épinglées sur une même page font beaucoup ;
- la vue éclatée de la méthode sur l'accueil est animée ; les autres pages affichent leurs étapes à plat ;
- à vérifier à l'étape 2 : cohérence des titres de section entre pages (formes « Vous gardez la main. », « Rien ne se perd en route. », etc.).

## 9. Référencement, accessibilité, technique (§ 10)

Relevé de lecture du code ; mesures à refaire à l'étape 2.

| Élément | État | Constat |
| --- | --- | --- |
| Titre de l'accueil | **Écart** | `title="Antoine Bruneau"` : trop court, ne dit ni le métier ni le lieu. |
| Titres et descriptions des autres pages | **Partiel** | Spécifiques, mais orientés « webdesigner UX/UI freelance » ; à aligner sur le nouveau positionnement. La description de Le Cuistologue parle de « cartes de visite et flyer », sans les affiches. |
| Données structurées | **Partiel** | `ProfessionalService`, `Person`, `Service`, `FAQPage`, `BreadcrumbList`, `CreativeWork` : bonne base. Le `jobTitle`, le catalogue `services` et les `knowsAbout` devront refléter les deux domaines ; « Design d'application mobile » est à confirmer (§ 0.4). |
| `llms.txt` | **Écart** | Il reprend l'ancien positionnement, l'ancienne méthode et le discours anti-modèles. À réécrire après validation des contenus. |
| `robots.txt` et sitemap | **Conforme** | Robots des assistants IA autorisés, `/api/` et `/erreurs/` exclus, sitemap déclaré, pages légales exclues du sitemap. |
| Open Graph | **Partiel** | Balises présentes, mais une seule image (`og-image.jpg`) pour toutes les pages, y compris l'étude de cas. |
| URL lisibles | **Conforme** | |
| Liens internes | **Écart** | « Prochains projets » renvoie vers une section commentée ; « Projets » ne mène pas à une liste. |
| Config ngrok | **Note** | `astro.config.mjs` autorise les domaines ngrok en développement (ajout du 16 novembre). Sans effet sur le build, mais à garder en tête. |
| Contrastes, clavier, focus, performances | **À mesurer** | Lighthouse mobile ≥ 90 relevé plus tôt sur toutes les pages, avant les derniers ajouts de la page Le Cuistologue. |

## 10. Plan de modifications proposé, par priorité

Ce plan est soumis à validation. Rien n'est lancé tant que les points du § 0 ne sont pas tranchés.

### P0 — avant publication

1. **Positionnement et Hero.** Nouvelle identité (surtitre, `jobTitle`, titre de l'accueil), Hero qui dit quoi, pour qui et en quoi c'est différent, CTA « Découvrir mes réalisations » et « Parlons de votre projet ». Composants modifiés : `Hero.astro`, `BaseLayout.astro` (données structurées), `index.astro`.
2. **Deux domaines après le Hero.** Remplacer ou réorganiser « Trois façons… » en deux cartes de domaine (Sites web ; Interfaces et logiciels), chacune avec ses besoins, ses prestations et un lien. Création, Refonte et Audit restent accessibles depuis la carte Sites web et le menu. Réutiliser `ServiceCards` (même langage visuel).
3. **Discours anti-gabarit.** Reformuler les passages relevés au § 3.1, une fois la ligne validée (§ 0.3).
4. **Hiérarchie des prestations.** Recentrer Création et Refonte sur les sites (surtitres, accroches) ; ajouter à l'Audit ses méthodes et ses limites ; harmoniser les étapes (4 sur l'accueil, versions détaillées cohérentes sur les pages).
5. **CTA et formulaire.** CTA contextuels par page ; champs facultatifs Budget et Délai ; type de projet « Interface ou logiciel » et « Renfort UX/UI ».
6. **Incohérences.** Lien « Prochains projets », menu « Projets », description de la page Le Cuistologue, « Applications mobiles » (§ 0.4).
7. **Deux études de cas solides.** Restructurer Le Cuistologue selon le gabarit commun (problème, enjeux, réflexion, résultat), en gardant le format visuel actuel. Seconde étude : Fer Harry ou GMAO, selon le § 0.

### P1 — différenciation

1. Page « Interfaces et logiciels » (composants existants des pages de service).
2. Étude de cas GMAO, avec des schémas originaux si nécessaire.
3. Page Projets (liste des études de cas), en remplacement du lien direct du menu.
4. À propos : récit du parcours (son, image, développement, UX/UI), formation, compétences techniques (remplacement du bloc « Mes outils »).
5. SEO : titres et descriptions alignés, `llms.txt` réécrit, image Open Graph par étude de cas.

### P2 — évolution commerciale

1. Offres et périmètres formalisés, tarifs testés.
2. Page renfort UX/UI si le volume le justifie.
3. Projet SaaS de classification des déchets.

## 11. Informations à fournir

- Décisions du § 0.
- Pour le parcours : les dates et intitulés à afficher (son, création numérique, développement, formation UX/UI : nom de la formation et année).
- Pour Fer Harry : l'accord du client et l'état d'avancement présentable.
- Pour la GMAO : ce qui peut être dit (profils utilisateurs, types d'écrans, rôle exact, durée) et ce qui ne peut pas l'être.
- Le nouveau libellé d'identité retenu : « Concepteur numérique indépendant » ou une variante.
