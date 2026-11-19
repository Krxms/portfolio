# Finalisation : contenus, CGV et cohérence

Dernière itération avant intégration, au 16 novembre 2026. Aucun fichier du site n'est modifié.

Documents de référence :
- [contenus-version-finale.md](contenus-version-finale.md) (V3) ;
- [contenus-passe-finale.md](contenus-passe-finale.md) (passe ciblée, validée dans l'essentiel).

**Avertissement.** Les parties B, C et D sont une analyse et un projet de rédaction faits à partir des textes officiels consultés (liste en fin de document). Elles ne remplacent pas la relecture d'un juriste ou d'un avocat. Aucune clause n'est présentée comme « conforme » : je signale ce que les textes exigent, ce qu'ils recommandent et ce qui relève de votre choix.

Fichiers lus intégralement :
- `src/pages/cgv.astro` : 9 articles, seule source des CGV dans le projet ; aucun autre fichier ne contient de disposition contractuelle ;
- `src/pages/mentions-legales.astro`.

---

## A. Dernières corrections éditoriales

Seuls les passages modifiés par cette itération figurent ici. Le reste de la V3 et de la passe ciblée reste valable.

### A1. Retours sur les maquettes

Étape « Concevoir » de l'accueil, de la page Création et de la page Refonte.

- **Accueil, étape 03 Concevoir** : J'organise les contenus et la navigation, puis je conçois les écrans pour ordinateur et mobile. Nous échangeons sur les maquettes, que j'ajuste selon les étapes et les retours prévus au devis. Vous recevez : le plan du site et les maquettes validées.
- **Création, étape 3 Concevoir** : Le plan du site, puis les écrans pour ordinateur et mobile. Nous échangeons sur les maquettes, que j'ajuste selon les étapes et les retours prévus au devis. Vous recevez : le plan du site et les maquettes validées.
- **Refonte, étape 3 Concevoir** : la même phrase, avec « le plan de la refonte ».

Vérification des autres pages :
- la page Interfaces (« de l'analyse aux maquettes validées ») ne promet pas de retours illimités ;
- aucune autre page ne contredit ce cadre.

### A2. Note sur les interfaces, sous la méthode de l'accueil

Elle remplace la note A7 de la passe ciblée :

> Pour les interfaces de logiciels, la démarche s'adapte à votre organisation : conception des parcours et des écrans, prototypage, transmission à votre équipe ou intégration front-end selon la mission.

Cohérence avec la page Interfaces et logiciels : elle correspond aux sections « Ce que je peux prendre en charge » et « Deux façons de travailler ensemble ». Rien n'est à modifier sur cette page.

### A3. Récit À propos (version finale proposée)

Les phrases signalées sont retirées, ainsi que toute analogie entre la musique et les interfaces. La formation n'est plus présentée comme un moyen de « structurer » une pratique UX antérieure. `[À VALIDER : mot pour mot]`

> J'ai commencé par la musique : la composition, puis le sound design. Ce travail m'a mené au spectacle vivant, où j'ai exercé dans les métiers techniques du son.
>
> Je me suis ensuite tourné vers la création numérique et visuelle, notamment au sein d'une association qui mêlait arts visuels et numériques. C'est dans ces projets que je me suis mis au développement.
>
> J'ai ensuite choisi de me former à la conception d'interfaces à la Wild Code School, où j'ai obtenu le titre professionnel de concepteur UI ; la formation incluait l'UX. J'ai été designer UX/UI pendant environ deux ans sur un logiciel SaaS de gestion de maintenance, utilisé par des professionnels dans leur travail quotidien.
>
> Depuis 2026, je travaille à mon compte. J'y réunis ce que ces expériences m'ont donné : concevoir des interfaces, et savoir les réaliser.

Deux points à vérifier par vous :
- « C'est dans ces projets que je me suis mis au développement » : est-ce exact ?
- « utilisé par des professionnels dans leur travail quotidien » : formulation reprise du texte actuel de « Qui suis-je ».

### A4. Redirections (formulation harmonisée)

| Emplacement | Formulation finale |
| --- | --- |
| Refonte, engagement | **Un plan de redirection.** J'identifie les anciennes adresses et prépare les redirections vers les pages les plus pertinentes du nouveau site, lorsque cela est justifié, afin de préserver autant que possible les accès et le référencement existants. |
| Refonte, niveau « Refonte complète » | Nouvelle structure, nouveau design, contenus repris et plan de redirection des anciennes adresses. |
| Refonte, étape 4 Réaliser | Je construis le site, je reprends vos contenus et je prépare les redirections des anciennes adresses vers les pages les plus pertinentes du nouveau site. |
| Refonte, FAQ « Vais-je perdre mon référencement ? » | Je limite ce risque : les anciennes adresses sont redirigées, lorsque c'est justifié, vers les pages les plus pertinentes du nouveau site, les titres et descriptions utiles sont repris, et je vérifie le site après la mise en ligne. Aucune refonte ne garantit une position dans les résultats. |

Dans la FAQ, la fin « mais elle n'a pas à repartir de zéro » est retirée, car c'est une affirmation absolue.

### A5. Prise en main

Le texte dépend des réponses E3. Formulation qui reste exacte quelle que soit la réponse :

- **Accueil, étape 04, ligne « Vous recevez »** : votre site en ligne et ses accès. La prise en main est prévue au devis, selon l'outil et ce que vous gérez vous-même.
- **Création, étape 5** : Publication, vérifications et, si elle est prévue au devis, prise en main de l'outil. Solde selon les conditions du devis. Vous recevez : votre site en ligne et ses accès.
- **Création, formules « Vous gardez la main »** : textes inchangés. La formule « Vous menez, je vous forme » suppose une formation : elle reste valable si la prise en main est proposée (E3).

### A6. Scores Lighthouse

Les scores et leur contexte de mesure sont inchangés.

- **Jauges de la vitrine** (accueil, Création, Refonte) : le libellé « SEO » devient **« SEO · Lighthouse »**.
- **Légende des jauges** : Mesuré avec Lighthouse : un contrôle automatisé de bonnes pratiques, pas une mesure de positionnement ni un audit SEO complet.
- **Le Cuistologue, ligne de mesure** : « Référencement : 100/100 » devient **« SEO · Lighthouse : 100/100 »**, avec la note « Lighthouse mobile, contrôle automatisé de bonnes pratiques ».

---

## B. Examen des CGV actuelles

### B0. Constat général

Les CGV actuelles tiennent en neuf articles courts. Elles posent une base saine : devis préalable, acompte, délais indicatifs, cession des droits après paiement, référence au portfolio, obligations du client.

Quatre faiblesses de fond :

1. **Mentions de paiement incomplètes.** Les mentions exigées entre professionnels ne sont pas assurées : délai de règlement, taux des pénalités, indemnité forfaitaire de 40 €.
2. **Cession de droits trop générale.** Elle ne détaille ni les droits cédés, ni le domaine d'exploitation, ce que le Code de la propriété intellectuelle exige.
3. **Particuliers acceptés, sans le cadre qui va avec.** Le champ couvre « toute personne physique ou morale », donc aussi les particuliers, sans aucune des dispositions de consommation correspondantes.
4. **Exécution du projet non encadrée.** Aucune clause sur les retours, la réception, les anomalies, les services tiers, la confidentialité ni la maintenance, alors que le site parle de chacun de ces sujets.

### B1. Clause par clause

**Art. 1 · Objet**
- **Prévoit** : prestations de « design UX/UI, identité de marque et développement de sites sur-mesure », pour « toute personne physique ou morale ».
- **Problèmes** :
  - le périmètre ne correspond plus aux offres : création et refonte de sites, interfaces et logiciels, audit, renfort d'équipe ;
  - « identité de marque » n'est plus une offre affichée, alors que Le Cuistologue en comporte une ;
  - « sur-mesure » contredit le choix d'outil pragmatique (CMS, no-code) ;
  - « toute personne physique » inclut les consommateurs.
- **Risque** : si un particulier signe, les règles du Code de la consommation s'appliquent (information précontractuelle, rétractation dans certains cas, médiation obligatoire, clauses abusives), et les CGV ne les prévoient pas.
- **Correction** : aligner l'objet sur les quatre offres et la mission de renfort, et définir les clients visés (voir E2-1).
- **Décision** : oui, clientèle professionnelle seule ou aussi particuliers (E2-1).

**Art. 2 · Devis et commande**
- **Prévoit** : devis détaillé, gratuit et sans engagement. Commande ferme au devis signé ou à l'accord écrit par e-mail, « accompagné le cas échéant de l'acompte ».
- **Problèmes** :
  - pas de durée de validité du devis ;
  - ambiguïté sur le démarrage : la commande est-elle ferme sans acompte ? Le travail commence-t-il avant son encaissement ?
  - pas d'ordre de priorité entre le devis et les CGV ;
  - pas de mention de l'acceptation des CGV.
- **Risque** : litige sur la date de démarrage et sur l'opposabilité des CGV si elles n'ont pas été remises avant la commande.
- **Correction** : validité du devis ; démarrage à l'encaissement de l'acompte ; priorité des conditions particulières du devis ; CGV jointes au devis et acceptées avec lui.
- **Décision** : durée de validité (E2-3).

**Art. 3 · Tarifs et paiement**
- **Prévoit** : prix en euros ; acompte « à la commande » et solde « à la livraison », sauf accord contraire ; factures payables « selon les modalités indiquées sur celles-ci » ; pénalités « conformément à la législation en vigueur ».
- **Problèmes** :
  1. **Délais et pénalités.** Entre professionnels, les CGV doivent comprendre les conditions de règlement (C. com. L441-1) : délai de paiement, taux des pénalités de retard, indemnité forfaitaire pour frais de recouvrement. Un renvoi à « la législation » ou aux factures ne suffit pas. L'administration précise que les 40 € doivent figurer en toutes lettres (C. com. L441-10 et D441-5).
  2. **Délai légal.** À défaut de stipulation, le délai est de 30 jours après l'exécution de la prestation. Il est plafonné à 60 jours après la date de facture, ou 45 jours fin de mois si c'est convenu (L441-10).
  3. **Prix et TVA.** Rien n'est dit sur le prix hors taxe ou toutes taxes comprises, ni sur la TVA. Si vous êtes en franchise en base, la mention « TVA non applicable, article 293 B du CGI » doit figurer sur les factures (la référence évolue vers l'article L223-3 du CIBS, à vérifier au moment de la facturation). Les mentions légales affichent un numéro de TVA intracommunautaire : le régime réel doit être confirmé.
  4. **Montant de l'acompte et échéancier.** Ni le montant ni le pourcentage ne sont fixés, et aucun échéancier n'est prévu pour un projet long.
  5. **« Livraison » non définie.** S'agit-il de la mise en ligne, de la remise des fichiers ou de la réception ?
  6. **Particuliers.** Une somme versée d'avance vaut arrhes, sauf stipulation contraire (C. consom. L214-1). Les arrhes permettent de se dédire (le client perd la somme, le professionnel restitue le double). Il faut écrire explicitement « acompte ».
- **Risque** : amende administrative en cas de mentions de paiement manquantes ; contestation des pénalités ; ambiguïté sur l'exigibilité du solde.
- **Correction** : article complet sur les conditions de règlement (voir C, art. 5).
- **Décision** : taux d'acompte, échéancier, délai de paiement, taux des pénalités, régime de TVA (E2-2 à E2-4).

**Art. 4 · Délais**
- **Prévoit** : délais indicatifs, dépendant de la réactivité du client ; « un retard raisonnable ne saurait engager la responsabilité ».
- **Problèmes** :
  - « raisonnable » n'est pas défini ;
  - rien sur le décalage du calendrier quand le client tarde à fournir ses éléments, ni sur la suspension ou l'abandon (client injoignable) ;
  - pas de clause de force majeure (C. civ. 1218).
- **Risque** : blocage d'un projet sans issue contractuelle ; solde jamais exigible si le client ne valide jamais.
- **Correction** : calendrier décalé d'autant ; après une période d'inactivité du client, facturation du travail réalisé et clôture possible ; clause de force majeure.
- **Décision** : durée d'inactivité déclenchant la clôture (E2-5).

**Art. 5 · Propriété intellectuelle**
- **Prévoit** : droits « sur les livrables (créations graphiques, code) cédés au fur et à mesure du paiement intégral des factures correspondantes, sauf mention contraire au devis ». Mention de la réalisation à titre de référence, « sauf demande contraire du Client ».
- **Problèmes** :
  1. Une cession de droits d'auteur suppose que chaque droit cédé fasse l'objet d'une mention distincte, avec un domaine d'exploitation délimité en étendue, destination, lieu et durée (CPI L131-3). Une cession générale « des droits » est fragile : elle s'interprète restrictivement en faveur de l'auteur.
  2. « Au fur et à mesure du paiement intégral » est contradictoire : progressif ou au paiement complet ?
  3. Rien sur les éléments tiers (CMS, thèmes, extensions, polices, bibliothèques, photos de banque d'images), qui ne peuvent pas être cédés et restent sous leurs licences.
  4. Rien sur les travaux préparatoires non retenus, ni sur les fichiers sources (Figma, fichiers de travail) : sont-ils remis ou non ?
  5. Rien sur vos savoir-faire et outils génériques réutilisables (composants, méthodes).
  6. Droit de portfolio : formulé comme une simple « mention ». Il n'est pas articulé avec la confidentialité, ni avec l'usage de visuels (captures, maquettes).
- **Risque** : contestation de l'étendue de ce que le client a acquis (par exemple, peut-il modifier ou décliner le logo ?) ; promesse « Tout vous appartient » impossible à tenir pour les composants tiers.
- **Correction** : clause détaillée (voir C, art. 9 et 10).
- **Décision** : étendue de la cession, remise des sources, portfolio (E4-1 à E4-3).

**Art. 6 · Obligations du client**
- **Prévoit** : fournir les informations, contenus et validations ; disposer des droits sur les éléments transmis.
- **Problèmes** : bonne base, mais incomplète. Il manque :
  - la désignation d'un interlocuteur ;
  - la fourniture des accès ;
  - les délais de validation ;
  - la responsabilité du client sur les contenus légaux de son propre site (mentions légales, politique de confidentialité, conformité de ses traitements de données) ;
  - ses sauvegardes et ses comptes.
- **Correction** : compléter (C, art. 7).
- **Décision** : non, hors sauvegarde de l'ancien site (E3-4).

**Art. 7 · Responsabilité**
- **Prévoit** : exécution « avec soin et selon les règles de l'art » ; exclusion en cas de mauvaise utilisation ou de contenus du client.
- **Problèmes** :
  - l'obligation de moyens n'est pas dite explicitement ;
  - rien sur les services tiers (hébergeur, CMS, extensions, mises à jour, pannes) ;
  - pas de plafond de responsabilité ;
  - pas d'exclusion des dommages indirects ;
  - rien sur l'absence de garantie de résultat commercial ou de positionnement, alors que le site le dit.
- **Cadre légal** :
  - entre professionnels, une limitation de responsabilité est possible, sauf faute lourde ou dolosive et sauf si elle vide l'obligation essentielle de sa substance (C. civ. 1170) ;
  - avec un consommateur, une clause qui supprime ou réduit son droit à réparation est présumée abusive de manière irréfragable (C. consom. R212-1, 6°) et réputée non écrite.
- **Correction** : clause distincte selon le type de client (C, art. 13).
- **Décision** : montant du plafond pour les professionnels (E4-4).

**Art. 8 · Résiliation**
- **Prévoit** : en cas d'annulation par le client après le démarrage, les sommes engagées et le travail réalisé restent dus.
- **Problèmes** :
  - rien sur une annulation avant le démarrage (sort de l'acompte) ;
  - rien sur la résiliation à votre initiative (impayé, manquement grave), ni sur la suspension pour impayé ;
  - « sommes engagées » : lesquelles ?
  - pour un particulier, ce texte peut se heurter au droit de rétractation dans certains cas (voir B2).
- **Correction** : clause complète (C, art. 15).
- **Décision** : sort de l'acompte en cas d'annulation avant démarrage (E2-6).

**Art. 9 · Droit applicable et litiges**
- **Prévoit** : droit français ; tribunaux français à défaut d'accord amiable.
- **Problèmes** : si vous acceptez des particuliers, l'information sur un médiateur de la consommation est obligatoire : désigner un médiateur référencé et afficher ses coordonnées sur le site et dans les CGV (C. consom. L612-1 ; fiches DGCCRF et CECMC). Cela ne s'applique pas aux litiges entre professionnels.
- **Correction** : ajout de la médiation si les particuliers sont acceptés (C, art. 17).
- **Décision** : liée à E2-1.

### B2. Dispositions absentes

| Disposition | Statut | Pourquoi |
| --- | --- | --- |
| Identification du prestataire (nom, statut, SIREN, adresse, contact) dans les CGV | Recommandé | Clarté contractuelle ; ces informations sont aujourd'hui dans les mentions légales seulement |
| Conditions de règlement complètes (délai, pénalités, indemnité de 40 €) | **Obligatoire** entre professionnels | C. com. L441-1, L441-10, D441-5 |
| Mention de TVA (régime) | **Obligatoire** sur les factures ; recommandé dans les CGV | CGI 293 B / CIBS L223-3 en cas de franchise |
| Retours et validations des maquettes | Choix contractuel | Le site promet désormais « les étapes et retours prévus au devis » : il faut un cadre |
| Modifications hors périmètre, avenants | Choix contractuel, fortement recommandé | Éviter la dérive du périmètre |
| Livraison et réception | Choix contractuel, fortement recommandé | Rend le solde exigible et fait démarrer la période de corrections |
| Corrections d'anomalies après livraison | Choix contractuel | Le site parle de corrections « pendant la période prévue au devis » |
| Maintenance, assistance, évolutions | Choix contractuel | Le site parle de formule de suivi et de « Je m'occupe de tout » |
| Services tiers, abonnements, licences | Fortement recommandé | Le site annonce les coûts récurrents à part |
| Noms de domaine, hébergement, comptes | Fortement recommandé | Le site promet que tout est « à votre nom » |
| Confidentialité | Choix contractuel | Le site mentionne la confidentialité et un accord possible |
| Portfolio | Choix contractuel | Il existe en une phrase ; à articuler avec la confidentialité |
| Données personnelles (sous-traitance au sens du RGPD) | Obligatoire **si** vous traitez des données personnelles pour le client (art. 28 RGPD : contrat de sous-traitance) | Accès à des formulaires, à une base clients ou à un CRM lors d'une refonte ou d'un renfort |
| Force majeure | Recommandé | C. civ. 1218 s'applique sans clause, mais la clause en précise les effets |
| Particuliers : information précontractuelle, droit de rétractation, médiateur | **Obligatoire si** vous contractez avec des particuliers | C. consom. L111-1, L221-5, L221-18, L221-25, L612-1 |
| Petits professionnels démarchés hors établissement | **Obligatoire dans ce cas précis** | C. consom. L221-3 : un professionnel d'au plus 5 salariés, pour un contrat signé hors établissement (par exemple chez lui) et hors de son activité principale, bénéficie du droit de rétractation de 14 jours et des règles d'information. Cela peut viser un artisan qui signe un devis de site chez lui. |
| Renfort d'équipe (facturation au temps, régie) | Choix contractuel | Aucune clause ; à traiter au devis ou dans un article dédié |

---

## C. Projet de CGV révisées

Ce projet n'est pas une validation juridique professionnelle. Il conserve les dispositions utiles des CGV actuelles, et les clauses conditionnées par vos réponses portent un marqueur `[DÉCISION E…]`.

Il est rédigé pour une clientèle **professionnelle**, avec un article 18 optionnel pour les particuliers (voir E2-1). Les montants et délais entre crochets sont des exemples à arbitrer, pas des choix.

---

**Conditions générales de vente**

Version du `[date]`. Antoine Bruneau, entrepreneur individuel. Adresse : 8 rue Odette Roger, 78440 Guitrancourt. SIRET : 788 566 719 00035. Contact : contact@antoinebruneau.fr · 06 09 11 18 38. `[DÉCISION E5-1 : régime de TVA à indiquer]`

**1. Objet et champ d'application**
Les présentes conditions générales de vente (CGV) s'appliquent aux prestations d'Antoine Bruneau (« le Prestataire ») :
- création et refonte de sites web ;
- conception UX/UI et intégration front-end d'interfaces d'applications et de logiciels ;
- audit UX/UI ;
- interventions en renfort d'équipe ;
- `[DÉCISION E1-5 : identité visuelle, si elle reste proposée]`.

Elles sont conclues avec des clients agissant à des fins professionnelles (« le Client »). `[DÉCISION E2-1 : ou « ainsi qu'avec des consommateurs, dans les conditions de l'article 18 »]`. Elles sont communiquées avec chaque devis et acceptées avec lui.

**2. Documents contractuels**
Le contrat est formé du devis accepté et des présentes CGV. En cas de contradiction, les conditions particulières du devis prévalent. Le devis précise notamment :
- le périmètre ;
- les livrables ;
- le nombre de séries de retours ;
- le calendrier indicatif ;
- le prix et l'échéancier ;
- le cas échéant, la prise en main, la période de corrections, la cession de droits et les services tiers.

**3. Premier échange et devis**
Le premier échange, destiné à comprendre le besoin, est gratuit et sans engagement `[DÉCISION E2-7]`. Le devis est gratuit `[DÉCISION E2-7]`. Il est valable `[30]` jours à compter de son envoi `[DÉCISION E2-3]`.

Une analyse détaillée d'un site ou d'une interface existante relève de la prestation d'audit UX/UI, facturée selon devis `[DÉCISION E1-1]`.

**4. Commande et démarrage**
La commande est ferme à l'acceptation du devis par signature ou par accord écrit (e-mail). Les travaux démarrent à l'encaissement de l'acompte prévu au devis. Le calendrier court à compter de cette date.

**5. Prix, facturation et paiement**
- **Prix** : en euros, `[hors taxes / TVA non applicable, article 293 B du CGI]` `[DÉCISION E5-1]`.
- **Acompte** : la somme versée à la commande est un **acompte**. Il représente `[30 à 50 %]` du montant du devis `[DÉCISION E2-2]`.
- **Échéancier** : pour les projets d'une durée supérieure à `[2 mois]`, un échéancier intermédiaire peut être prévu au devis `[DÉCISION E2-2]`.
- **Solde** : le solde est facturé à la livraison au sens de l'article 11.
- **Renfort d'équipe** : les missions sont facturées `[au temps passé, selon le tarif journalier du devis, mensuellement]` `[DÉCISION E1-4]`.
- **Délai de paiement** : les factures sont payables `[à réception / à 30 jours à compter de leur date d'émission]` `[DÉCISION E2-4]`.
- **Retard de paiement** : tout retard entraîne de plein droit :
  - des pénalités au taux de `[trois fois le taux d'intérêt légal / taux de la BCE majoré de 10 points]` `[DÉCISION E2-4]` ;
  - une indemnité forfaitaire pour frais de recouvrement de quarante euros (40 €), sans préjudice d'une indemnisation complémentaire sur justification (C. com. L441-10 et D441-5).
- **Suspension** : après relance restée sans effet pendant `[15]` jours, le Prestataire peut suspendre ses travaux jusqu'au paiement.

**6. Déroulement : conception et validations**
- **Étapes et retours** : chaque étape (plan du site, maquettes, réalisation) est soumise à la validation du Client. Le devis prévoit, pour chaque étape, `[deux]` séries de retours `[DÉCISION E1-2]`. Une série de retours est une liste regroupée de demandes, transmise en une fois.
- **Validation** : la validation d'une étape vaut accord sur celle-ci. Une demande qui revient sur une étape validée est traitée comme une modification (article 8).
- **Absence de réponse** : sans retour du Client dans un délai de `[10]` jours ouvrés après une demande de validation, l'étape est réputée validée `[DÉCISION E1-3]`.

**7. Obligations du Client**
Le Client s'engage à :
- désigner un interlocuteur ;
- fournir dans les délais convenus les informations, contenus, accès et validations nécessaires ;
- disposer des droits d'utilisation des éléments qu'il transmet (textes, images, marques, données).

Il reste responsable :
- des contenus publiés sur son site et de leur conformité légale, notamment ses mentions légales, sa politique de confidentialité et ses traitements de données personnelles ;
- de la conservation de ses propres sauvegardes.

**8. Modifications du périmètre**
Toute demande qui sort du périmètre du devis ou des retours prévus fait l'objet d'un devis complémentaire ou d'un avenant, accepté avant exécution. Le calendrier est ajusté en conséquence.

**9. Propriété intellectuelle**
- **Créations cédées** : les créations originales réalisées spécifiquement pour le Client et livrées (maquettes retenues, éléments graphiques, code développé pour le projet) font l'objet d'une cession des droits suivants :
  - reproduction ;
  - représentation ;
  - adaptation `[DÉCISION E4-1 : retirer l'adaptation pour un logo ?]`.
- **Domaine d'exploitation** : la cession vaut pour les supports et usages suivants : `[site web du Client, supports de communication du Client]`, pour `[le monde entier]` et pour `[la durée légale de protection des droits d'auteur]` `[DÉCISION E4-1]`.
- **Moment** : la cession prend effet au **paiement intégral** du prix. Jusqu'à ce paiement, le Client dispose d'un droit d'usage pour les besoins de la validation.
- **Non cédés** :
  - les travaux préparatoires et propositions non retenues ;
  - les fichiers sources de travail, sauf mention contraire au devis `[DÉCISION E4-2]` ;
  - les savoir-faire, méthodes et éléments génériques réutilisables du Prestataire, qui peut les réemployer sans reprendre d'élément propre au Client.

**10. Éléments et services tiers**
Les solutions de tiers intégrées au projet restent régies par leurs propres licences et conditions, que le Client accepte : CMS, thèmes, extensions, bibliothèques, polices, images, hébergement, outils en ligne. Leurs coûts (licences, abonnements, renouvellements) sont indiqués à part dans le devis et réglés par le Client, directement ou sur refacturation `[DÉCISION E4-5]`.

Le Prestataire ne répond pas des évolutions, interruptions ou changements de conditions de ces services.

**11. Livraison et réception**
- **Livraison** : elle intervient `[à la mise en ligne du site / à la remise des livrables]`.
- **Réception** : le Client dispose de `[10]` jours ouvrés pour signaler par écrit les anomalies. Une anomalie est un écart avec ce qui a été validé ou un dysfonctionnement.
- **Réception tacite** : sans réserve dans ce délai, la prestation est réputée reçue. `[DÉCISION E3-1]`
- **Prise en main** : elle est fournie si le devis la prévoit, sous la forme qui y est indiquée `[DÉCISION E3-2]`.

**12. Corrections après livraison, maintenance et évolutions**
- **Corrections** : pendant `[30]` jours après la réception, le Prestataire corrige sans frais les anomalies qui relèvent de sa prestation `[DÉCISION E3-3]`. Ne sont pas couvertes :
  - les demandes d'évolution ;
  - les dysfonctionnements causés par une intervention du Client ou d'un tiers ;
  - les mises à jour de services tiers ;
  - les changements d'hébergement.
- **Maintenance et évolutions** : la maintenance, l'assistance et les évolutions ultérieures font l'objet d'un devis ou d'un contrat distinct `[DÉCISION E3-5]`.

**13. Responsabilité**
- **Obligation de moyens** : le Prestataire exécute sa prestation avec soin et selon les règles de l'art. Il est tenu d'une obligation de moyens.
- **Pas de garantie de résultat** : il ne garantit aucun résultat commercial, aucun positionnement dans les moteurs de recherche, ni la conformité complète d'un site à un référentiel d'accessibilité. Un audit UX/UI est une revue experte, qui ne vaut ni test utilisateur ni audit de conformité.
- **Exclusions** : sa responsabilité ne peut être engagée en cas d'utilisation non conforme des livrables, de contenus fournis par le Client, ou de défaillance d'un service tiers.
- **Plafond (Clients professionnels)** : la responsabilité du Prestataire est limitée aux dommages directs et plafonnée au montant hors taxes de la commande concernée `[DÉCISION E4-4]`, sauf faute lourde ou dolosive.

**14. Noms de domaine, hébergement et comptes**
- **Titularité** : les noms de domaine, hébergements et comptes de services créés pour le projet sont ouverts au nom du Client, ou lui sont transférés à la livraison `[DÉCISION E4-5]`.
- **Accès** : les accès administrateurs lui sont remis.
- **Renouvellements** : le Client est responsable des renouvellements, sauf contrat de maintenance prévoyant leur gestion.

**15. Annulation, résiliation et suspension**
- **Annulation avant démarrage** : en cas d'annulation par le Client après l'acceptation du devis et avant le démarrage, l'acompte `[est conservé / est restitué déduction faite des frais engagés]` `[DÉCISION E2-6]`.
- **Annulation après démarrage** : le travail réalisé jusqu'à l'annulation et les frais engagés pour le projet (licences, services tiers commandés) restent dus.
- **Inactivité du Client** : si le Client ne donne plus suite pendant `[60]` jours malgré relance, le Prestataire peut clore le projet et facturer le travail réalisé `[DÉCISION E2-5]`.
- **Résiliation par le Prestataire** : il peut résilier le contrat en cas de manquement grave du Client, notamment un défaut de paiement, après mise en demeure restée sans effet pendant `[15]` jours.

**16. Confidentialité et références**
- **Confidentialité** : chaque partie garde confidentielles les informations non publiques reçues de l'autre pour l'exécution du contrat. Un accord de confidentialité spécifique peut être signé `[DÉCISION E4-3]`.
- **Références** : sauf refus écrit du Client ou engagement de confidentialité contraire, le Prestataire peut présenter la réalisation dans son portfolio et ses supports de communication. Il peut citer le nom du Client et montrer les livrables publics ou des visuels issus du projet, sans y faire figurer d'informations confidentielles `[DÉCISION E4-3]`.

**17. Force majeure, droit applicable et litiges**
- **Force majeure** : aucune partie n'est responsable d'un manquement dû à un cas de force majeure au sens de l'article 1218 du Code civil. Les obligations sont suspendues pendant sa durée.
- **Droit et juridiction** : les présentes CGV sont soumises au droit français. Les parties recherchent d'abord une solution amiable. À défaut, le litige relève des tribunaux compétents.

**18. Clients consommateurs `[OPTIONNEL : DÉCISION E2-1]`**
Si le Client est un consommateur :
- **Information précontractuelle** : avant la commande, le Prestataire lui communique les informations prévues aux articles L111-1 et L221-5 du Code de la consommation.
- **Droit de rétractation** : pour un contrat conclu à distance ou hors établissement, le Client dispose de quatorze jours pour se rétracter (C. consom. L221-18), selon le formulaire joint au devis.
  - Si le Client demande expressément que la prestation commence avant la fin de ce délai, il doit, en cas de rétractation, le montant proportionné au service déjà fourni (C. consom. L221-25).
- **Clauses non applicables** : les limitations de responsabilité de l'article 13 et la réception tacite de l'article 11 ne s'appliquent pas.
- **Médiation** : en cas de litige, le Client peut recourir gratuitement au médiateur de la consommation suivant : `[nom et coordonnées d'un médiateur référencé par la CECMC]` (C. consom. L612-1).

**Annexe facultative : données personnelles.** Si la prestation conduit le Prestataire à traiter des données personnelles pour le compte du Client (formulaires, bases clients, CRM), les parties signent les clauses de sous-traitance prévues à l'article 28 du RGPD `[DÉCISION E4-6]`.

---

## D. Matrice de cohérence : site et CGV

État :
- **OK** : cohérent ;
- **Écart** : contradiction à corriger ;
- **Sans cadre** : promesse du site sans clause correspondante ;
- **Décision** : dépend d'une réponse.

| Engagement du site | Pages | CGV actuelles | CGV proposées | État |
| --- | --- | --- | --- | --- |
| Premier échange gratuit et sans engagement | Accueil, Création, Refonte, Audit, Interfaces, Contact | Rien | Art. 3 | Décision E2-7 |
| Devis gratuit et détaillé | FAQ accueil, Contact, Audit | Art. 2 « gratuit et sans engagement » | Art. 3 | Décision E2-7 |
| Réponse sous 24 h ouvrées | Partout | Rien (engagement commercial, pas contractuel) | Rien : à garder hors CGV | Décision E2-7 |
| Analyse avant devis, audit facturé | Accueil 02, FAQ 6, Refonte 1, Audit | Rien | Art. 3 | Décision E1-1 |
| Audit déduit si le projet se poursuit | Audit, Refonte | Rien | Au devis (condition commerciale) | Décision E2-8 |
| Tarif préférentiel audit et conception | FAQ Refonte | Rien | Au devis | Décision E2-8 |
| Devis validé, puis acompte | Méthode (accueil, Création, Refonte) | Art. 2-3 (ambigu) | Art. 4-5 | Décision E2-2 |
| Solde à la livraison | Méthode | Art. 3 (« livraison » non définie) | Art. 5 et 11 | Décision E3-1 |
| Retours selon les étapes prévues au devis | Méthode (A1) | Rien | Art. 6 | Décision E1-2 |
| Livrables par étape | Méthode | Rien | Art. 2 (au devis) | OK après intégration |
| Prise en main | Accueil 04, Création | Rien | Art. 11 | Décision E3-2 |
| Corrections après mise en ligne | Refonte, engagement | Rien | Art. 12 | Décision E3-3 |
| Suivi, maintenance, « Je m'occupe de tout » | Accueil (note), Création (formule) | Rien | Art. 12 | Décision E3-5 : sans cadre aujourd'hui |
| Créations originales cédées selon le devis | Création, Refonte, FAQ | Art. 5 (cession générale) | Art. 9 | Écart aujourd'hui, réglé par l'art. 9 et E4-1 |
| Solutions tierces sous licences | Création, Refonte | Rien | Art. 10 | Sans cadre aujourd'hui |
| Coûts récurrents indiqués à part | Création, engagement | Rien | Art. 10 | Sans cadre aujourd'hui |
| Domaine, hébergement et comptes au nom du client | Création, FAQ | Rien | Art. 14 | Décision E4-5 |
| Plan de redirection | Refonte | Rien | Couvert par le devis et l'obligation de moyens (art. 13) | OK |
| Ancien site sauvegardé avant la bascule | Refonte | Rien | Art. 7 (sauvegardes du client) | Décision E3-4 : contradiction possible |
| Confidentialité, accord possible | Interfaces | Rien | Art. 16 | Décision E4-3 |
| Présentation dans le portfolio | Implicite (réalisations) | Art. 5, dernière phrase | Art. 16 | OK, à confirmer E4-3 |
| Pas de garantie SEO ni de résultat commercial | Refonte FAQ, Audit, A6 | Rien | Art. 13 | OK après intégration |
| Audit : revue experte, pas de conformité WCAG | Audit | Rien | Art. 13 | OK après intégration |
| Renfort ponctuel selon les modalités définies ensemble | Interfaces | Rien (objet sans renfort) | Art. 1 et 5 | Décision E1-4 |
| Identité visuelle (étude de cas Le Cuistologue) | Le Cuistologue | Art. 1 « identité de marque » | Art. 1 | Décision E1-5 |
| Particuliers : le site ne les exclut pas | Toutes (« indépendants », sans exclusion) | Art. 1 « toute personne physique » | Art. 1 et 18 | Décision E2-1 |

---

## E. Questionnaire final consolidé

Les questions dont la réponse est déjà établie ne sont pas reposées : zone, durée de l'expérience SaaS, date d'indépendance, formation, refus du champ budget, Fer Harry.

### E1. Prestations et processus

**E1-1. Analyse avant devis et audit facturé**
- **Conditionne** : accueil (étape 02, FAQ 6), Refonte (étape 1, FAQ 3), Audit ; CGV art. 3.
- **Question** : avant de chiffrer une refonte, faites-vous une lecture rapide et gratuite du site, sans document ? L'analyse détaillée passe-t-elle uniquement par l'audit payant ?
- **Option recommandée** : lecture rapide gratuite pour établir le devis, sans livrable ; tout diagnostic écrit relève de l'audit.
- **Effet sur le site** : formulations de la passe ciblée conservées, marqueurs levés.

**E1-2. Séries de retours**
- **Conditionne** : méthode (A1) ; CGV art. 6.
- **Question** : combien de séries de retours par étape, par défaut ?
- **Option recommandée** : deux par étape, ajustables au devis ; au-delà, un avenant.

**E1-3. Validation tacite**
- **Conditionne** : CGV art. 6.
- **Question** : une étape est-elle réputée validée sans réponse du client après un délai ? Lequel ?
- **Option recommandée** : oui, après 10 jours ouvrés, entre professionnels uniquement.

**E1-4. Renfort d'équipe**
- **Conditionne** : page Interfaces ; CGV art. 1 et 5.
- **Question** : comment le facturez-vous (journée, demi-journée, forfait), et sur quel document (devis ou contrat dédié) ?
- **Option recommandée** : tarif journalier au devis, facturation mensuelle des jours réalisés.

**E1-5. Identité visuelle**
- **Conditionne** : CGV art. 1 ; Le Cuistologue ; À propos.
- **Question** : l'identité visuelle reste-t-elle une prestation proposée, au moins dans le cadre d'un site ?
- **Effet sur le site** : si oui, à mentionner sobrement (carte Sites web : « direction artistique ») ; si non, l'étude de cas reste une réalisation passée.

### E2. Conditions commerciales

**E2-1. Clientèle**
- **Conditionne** : CGV art. 1 et 18 ; tout le site.
- **Question** : travaillez-vous uniquement avec des professionnels, ou aussi avec des particuliers ?
- **Option recommandée** : professionnels uniquement, ce qui évite l'article 18 et la désignation d'un médiateur. Le site vise déjà des entreprises.
- **Point à connaître** : même entre professionnels, un artisan de 5 salariés au plus qui signe chez lui un contrat hors de son activité principale bénéficie d'un droit de rétractation de 14 jours (L221-3). Il faut alors l'informer de ce droit et ne rien encaisser avant 7 jours.

**E2-2. Acompte et échéancier**
- **Conditionne** : méthode ; CGV art. 5.
- **Question** : quel pourcentage d'acompte, et quel échéancier pour un projet long ?
- **Option recommandée** : 30 à 50 % à la commande. Pour un projet long : acompte, puis une échéance à la validation des maquettes, puis le solde.

**E2-3. Validité du devis**
- **Conditionne** : CGV art. 3.
- **Question** : combien de temps un devis est-il valable ?
- **Option recommandée** : 30 jours.

**E2-4. Délai de paiement et pénalités**
- **Conditionne** : CGV art. 5 (mentions obligatoires).
- **Question** : quel délai de paiement, et quel taux de pénalités ?
- **Option recommandée** : à 30 jours de la date de facture, pénalités à trois fois le taux d'intérêt légal ; l'indemnité de 40 € est fixe et obligatoire.

**E2-5. Projet à l'arrêt**
- **Conditionne** : CGV art. 4 et 15.
- **Question** : après combien de temps d'inactivité du client pouvez-vous clore le projet et facturer le travail réalisé ?
- **Option recommandée** : 60 jours après relance.

**E2-6. Annulation avant démarrage**
- **Conditionne** : CGV art. 15.
- **Question** : l'acompte est-il conservé en cas d'annulation avant le démarrage ?
- **Option recommandée** : conservé à hauteur des frais engagés et du temps de préparation. Une restitution partielle est plus lisible pour un client que la conservation totale.

**E2-7. Engagements d'accueil**
- **Conditionne** : toutes les pages ; CGV art. 3.
- **Question** : confirmez-vous chacun de ces engagements : premier échange gratuit et sans engagement, devis gratuit, réponse sous 24 h ouvrées ?
- **Option recommandée** : garder les deux premiers. Pour le troisième, si les 24 h ne peuvent pas être tenues en période chargée, écrire « en général sous 24 h ouvrées » ou « sous 48 h ouvrées ».

**E2-8. Audit déduit et offre groupée**
- **Conditionne** : Audit, Refonte (Hero, FAQ 3) ; devis.
- **Question** : l'audit est-il déduit en totalité ou en partie, et dans quel délai ? Le « tarif préférentiel du pack audit et conception » existe-t-il réellement ?
- **Option recommandée** : garder la déduction, avec un délai (par exemple une commande dans les trois mois). Retirer le « pack » s'il n'est pas défini.

### E3. Livraison et suivi

**E3-1. Livraison et réception**
- **Conditionne** : CGV art. 5 et 11 ; méthode (solde).
- **Question** : la livraison correspond-elle à la mise en ligne (site) ou à la remise des fichiers (maquettes) ? Quel délai de réception ?
- **Option recommandée** : la mise en ligne pour un site, la remise des fichiers pour une mission de conception ; 10 jours ouvrés pour signaler les anomalies.

**E3-2. Prise en main**
- **Conditionne** : accueil 04, Création ; CGV art. 11.
- **Question** : la prévoyez-vous dans chaque projet de site, et sous quelle forme (séance en visio, guide écrit) ?
- **Effet sur le site** : si elle est systématique, A5 peut l'affirmer ; sinon, « si elle est prévue au devis » reste.

**E3-3. Corrections après livraison**
- **Conditionne** : Refonte (engagement) ; CGV art. 12.
- **Question** : quelle durée pour les corrections gratuites ?
- **Option recommandée** : 30 jours, limités aux anomalies relevant de votre prestation.

**E3-4. Sauvegarde de l'ancien site**
- **Conditionne** : Refonte (engagement) ; CGV art. 7.
- **Question** : la faites-vous vous-même avant la bascule ?
- **Effet sur le site** : si non, retirer « l'ancien site est sauvegardé » du site, ou écrire « une sauvegarde est réalisée ou vérifiée avant la mise en ligne ».

**E3-5. Maintenance et suivi**
- **Conditionne** : formule « Je m'occupe de tout », note sur le suivi, FAQ ; CGV art. 12.
- **Question** : proposez-vous réellement une offre de maintenance ou de suivi ?
- **Option recommandée** : si oui, « sur devis ou contrat distinct », sans périodicité affichée. Si non, retirer la formule « Je m'occupe de tout » (la page Création garde deux formules) et la note de suivi de l'accueil.

### E4. Droits et responsabilités

**E4-1. Étendue de la cession**
- **Conditionne** : Création et Refonte (« Ce qui vous revient »), FAQ ; CGV art. 9.
- **Question** : quels droits cédez-vous (reproduction, représentation, adaptation), pour quels usages, quel territoire et quelle durée ?
- **Option recommandée** : ces trois droits ; pour les usages liés à l'activité du client ; monde entier ; durée légale ; au paiement intégral. Pour un logo, l'adaptation est en général cédée aussi, le client devant pouvoir le décliner.

**E4-2. Fichiers sources**
- **Conditionne** : CGV art. 9.
- **Question** : remettez-vous les fichiers de travail (Figma) au client ?
- **Option recommandée** : remis sur demande ou selon le devis, éventuellement facturés.

**E4-3. Confidentialité et portfolio**
- **Conditionne** : page Interfaces (« Le cadre ») ; CGV art. 16.
- **Question** : proposez-vous réellement un accord de confidentialité ? Le droit de présenter vos projets est-il acquis par défaut, avec refus possible du client ?
- **Option recommandée** : oui aux deux, avec l'exclusion des informations confidentielles.

**E4-4. Plafond de responsabilité**
- **Conditionne** : CGV art. 13.
- **Question** : acceptez-vous de plafonner votre responsabilité au montant de la commande (clients professionnels) ?
- **Option recommandée** : oui. À vérifier aussi auprès de votre assureur, si vous avez une responsabilité civile professionnelle (non obligatoire pour cette activité, mais recommandée).

**E4-5. Comptes et services tiers**
- **Conditionne** : Création (« Ce qui vous revient », coûts annoncés) ; CGV art. 10 et 14.
- **Question** : ouvrez-vous les comptes au nom du client dès le départ, ou les transférez-vous à la livraison ? Refacturez-vous des licences ?
- **Option recommandée** : au nom du client dès le départ, avec paiement direct par le client.

**E4-6. Données personnelles**
- **Conditionne** : annexe RGPD.
- **Question** : accédez-vous à des données personnelles des clients (formulaires, bases de contacts) lors de vos missions ?
- **Effet** : si oui, un contrat de sous-traitance (art. 28 RGPD) devient obligatoire pour ces missions.

### E5. Informations factuelles

**E5-1. Régime de TVA**
- **Conditionne** : CGV en-tête et art. 5 ; factures.
- **Question** : êtes-vous en franchise en base de TVA ? Les mentions légales affichent un numéro de TVA intracommunautaire.
- **Effet** : la mention « TVA non applicable » si oui, des prix hors taxes sinon.

**E5-2. Date du 09/04/2025**
- **Conditionne** : mentions légales.
- **Question** : est-ce la date d'immatriculation de votre entreprise individuelle actuelle ?
- **Effet** : si oui, elle reste, et elle est compatible avec « activité indépendante depuis 2026 » si vous avez commencé à exercer en 2026.

**E5-3. Intitulés**
- **Conditionne** : À propos, page Interfaces.
- **Question** : l'intitulé officiel exact du titre professionnel (s'il est cité tel quel), et l'intitulé de votre poste sur le logiciel de maintenance.

**E5-4. Technologies**
- **Conditionne** : À propos, « Ce que je sais faire ».
- **Question** : lesquelles afficher ?

**E5-5. Mentions légales (activité)**
- **Conditionne** : mentions légales.
- **Question** : l'intitulé « Activité : conception d'interfaces numériques (UX/UI design) et de sites web » doit-il être aligné sur le positionnement, ou correspond-il à votre déclaration d'activité ?
- **Option recommandée** : le laisser s'il reprend votre déclaration d'activité.

### E6. Étude de cas Le Cuistologue

**Faits établis**
- Client : cuisinier à domicile ; territoire : Oise, Val-d'Oise, Yvelines, Eure ; démarrage en avril 2026.
- Livrables présents dans le fichier Figma et sur la page : logo, palette des imprimés, trois affiches A3, cartes de visite en trois versions, flyer recto verso, maquettes du site.
- Mesures Lighthouse relevées le 6 novembre 2026, avec leurs réserves.

**Éléments à confirmer (E6-1)**
- Le périmètre exact livré : outil de gestion du site, mise en ligne, prise en main, référencement.
- La situation de départ de l'activité.

**Contenus publiables (E6-2)**
- Peut-on citer le tarif « À partir de 74,50 € / intervention » ?
- Peut-on montrer des versions intermédiaires des maquettes (V1 à V4 dans le fichier Figma) ?
- Ces publications ont-elles l'accord du client ?

**Décisions UX/UI à expliquer par vous (E6-3)**
Rien ne sera rédigé avant vos réponses.
- **Offre** : comment le client présentait-il son offre au départ, et qu'avez-vous changé dans sa présentation (formules, prix affiché, contenu d'une intervention, crédit d'impôt) ? Pourquoi ?
- **Hiérarchie** : l'ordre des sections de l'accueil vient-il de vous, du client ou des itérations V1 à V4 ? Qu'est-ce qui a changé, et pourquoi ?
- **Contact** : quel parcours avez-vous prévu pour un visiteur prêt à commander (devis, formulaire, téléphone, réservation), et pourquoi deux chemins dès le premier écran ?
- **Direction visuelle** : qui a défini les trois publics des affiches ? Pourquoi une palette différente entre les imprimés et le site ?

**Résultats mesurés**
Seuls les scores Lighthouse et leurs réserves sont publiés. Aucune extrapolation : pas de conversion, de trafic ni de chiffre d'affaires.

---

## F. État de validation

### F1. Validé définitivement
- Positionnement, ligne d'identité, H1 de l'accueil, deux domaines et leur distinction.
- Architecture des pages et navigation (y compris la nouvelle page Interfaces et logiciels).
- Titres principaux des pages de services.
- Faits de référence : Île-de-France et distance, depuis 2026, environ deux ans en SaaS, Wild Code School, GMAO anonyme, pas de Fer Harry, pas de champ budget, pas d'applications mobiles.
- Direction artistique inchangée.
- Textes de la V3 non touchés par la passe ciblée et par la partie A.

### F2. Prêt à intégrer (après votre accord sur ce document)
- Passe ciblée, points A (méthode), C (niveaux de refonte sans proportions), D1 à D3 et D5 (formulations), I1 à I6 (cohérence).
- Partie A de ce document : A1, A2, A4 et A6 ; A3 après votre relecture mot pour mot.
- Retrait des promesses SEO et GEO et des mentions « Yvelines », « 2025 », « plusieurs années ».

### F3. Conditionné par vos réponses
- Toutes les mentions commerciales : premier échange, devis, 24 h, audit déduit, pack (E2-7, E2-8).
- Déroulement : analyse avant devis, retours, prise en main, solde (E1-1, E1-2, E3-1, E3-2).
- Engagements de la Refonte : sauvegarde, corrections après livraison (E3-3, E3-4).
- Formule « Je m'occupe de tout » et note de suivi (E3-5).
- Clause des droits sur le site et dans les CGV (E4-1, E4-2).
- CGV : articles 1, 3, 5, 6, 9, 11, 12, 13, 14, 15, 16 et 18.
- Le Cuistologue : sections « Ce que le visiteur trouve » et « Ce qui a été livré », et futures explications de conception (E6).
- À propos : technologies, intitulés (E5-3, E5-4).

### F4. Vérifications juridiques encore nécessaires
- Relecture des CGV finales par un professionnel du droit, surtout pour la cession de droits (CPI L131-3) et le plafond de responsabilité.
- Si des particuliers sont acceptés : choix et adhésion à un médiateur référencé, formulaire de rétractation, information précontractuelle.
- Mention de TVA à jour au moment de la facturation (passage de l'article 293 B du CGI à l'article L223-3 du CIBS, tolérance annoncée jusqu'à fin 2027, à vérifier).
- Contrat de sous-traitance RGPD type, si E4-6 est positive.
- Concordance des factures avec les CGV (délai, pénalités, 40 €).

---

## Sources consultées

- [Code de commerce, art. L441-1 (CGV, conditions de règlement)](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038414469)
- [Code de commerce, art. L441-10 (délais de paiement, pénalités)](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038414392)
- [Code de commerce, art. D441-5 (indemnité de 40 €)](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043197457)
- [DGCCRF : mentions obligatoires des CGV](https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/conditions-generales-de-vente-quelles-mentions-sont-obligatoires)
- [Service-public : délais de paiement entre professionnels](https://entreprendre.service-public.gouv.fr/vosdroits/F23211?lang=en)
- [DGCCRF : indemnité forfaitaire, questions et réponses](https://www.economie.gouv.fr/files/directions_services/dgccrf/actualites/breves/2013/QR_indemnite_forfaitaire.pdf)
- [CPI, art. L131-3 (cession des droits d'auteur)](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006278958)
- [Service-public : contrat de cession de droits d'auteur](https://entreprendre.service-public.gouv.fr/vosdroits/F22667?lang=en)
- [Code civil, art. 1170 (obligation essentielle)](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006436553/1804-03-21)
- [Code de la consommation, art. R212-1 (clauses noires)](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032807196)
- [DGCCRF : clauses abusives](https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/clauses-abusives-12-clauses-interdites-et-10-clauses-dont-il-faut-demontrer-la-legitimite)
- [Code de la consommation, art. L221-3 (petits professionnels hors établissement)](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032226882)
- [DGCCRF : petits professionnels, 14 jours de rétractation](https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/petits-professionnels-vous-avez-14-jours-pour-vous-retracter-en-cas-de-contrat-conclu-hors-etablissement)
- [Code de la consommation, art. L221-18 (délai de rétractation)](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032226842/)
- [Code de la consommation, art. L221-25 (exécution pendant le délai)](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044563179)
- [Code de la consommation, art. L214-1 (arrhes et acomptes)](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032226990)
- [DGCCRF : acompte, arrhes, avoir](https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/acompte-arrhes-avoir)
- [Code de la consommation, art. L612-1 (médiation)](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032224805)
- [Médiation de la consommation : obligations des professionnels](https://www.economie.gouv.fr/mediation-conso/vous-etes-un-professionnel/vos-principales-obligations-0)
- [impots.gouv : micro-entrepreneur et TVA](https://www.impots.gouv.fr/professionnel/questions/je-suis-micro-entrepreneur-ou-la-tete-dune-micro-entreprise-ai-je-des)
- [BOFiP : conséquences de la franchise en base (version 2026)](https://bofip.impots.gouv.fr/bofip/1079-PGP.html/identifiant%3DBOI-TVA-DECLA-40-10-20-20260701)

Non vérifié sur source officielle dans cette passe : le régime de garantie légale des contenus et services numériques (C. consom. L224-25-1 et suivants), qui pourrait concerner un client consommateur. C'est à faire vérifier si E2-1 inclut les particuliers.
