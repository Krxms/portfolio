# Dossier final : portfolio, CGV et intégration

Consolidation du 16 novembre 2026, après les arbitrages E1 à E6. Elle remplace les documents antérieurs du dossier `docs/` (feuille de route, versions 1 à 3, passes de correction, finalisation), qui restent consultables pour l'historique.

| Fichier | Contenu |
| --- | --- |
| [01-contenus.md](01-contenus.md) | Tous les textes du portfolio, page par page, avec les données structurées et `llms.txt` |
| [02-cgv.md](02-cgv.md) | CGV révisées (texte complet, 21 articles), clauses à faire valider, sources officielles |
| [03-devis-checklist.md](03-devis-checklist.md) | Mentions et clauses du modèle de devis et du contrat de renfort |
| [04-verification-transversale.md](04-verification-transversale.md) | Anciennes promesses relevées dans le code, et matrice de cohérence site, CGV et devis |
| [05-plan-integration.md](05-plan-integration.md) | Fichiers, sections, adaptations de composants et vérifications, par lot |

Aucun fichier du site n'a été modifié.

---

## Points restant ouverts

Seuls les trois types autorisés figurent ici. Aucune décision E1 à E6 n'est rouverte.

### Vérifications juridiques (expertise professionnelle)

1. **Cession de droits** (CGV art. 13) : formalisme de l'article L131-3 du CPI, règles propres au logiciel et au logo.
2. **Plafond de responsabilité** (art. 15) : articles 1170 et 1231-3 du Code civil.
3. **Associations et organismes** : statut éventuel de « non-professionnel », qui leur ouvre la protection contre les clauses abusives (C. consom. L212-2). Effets sur les articles 9, 15 et 17.
4. **Petits professionnels hors établissement** (art. 16) : information précontractuelle, formulaire de rétractation, encaissement de l'acompte.
5. **Réception après rappel sans réponse** (art. 9).
6. **Clause de juridiction** (art. 21).
7. **Référence fiscale de la franchise** à la date de publication (article 293 B du CGI ou L223-3 du CIBS).
8. **Modèle d'accord de sous-traitance** (article 28 du RGPD).

### Contrôles factuels (éléments non disponibles)

- **C1** : récit À propos, phrase « C'est dans ces projets que je me suis mis au développement » (contexte exact de votre apprentissage du développement).
- **C2** : Le Cuistologue, choix de la ou des versions intermédiaires des maquettes à montrer, dans la page Figma « Maquettes » (dossier « Old » : V1 à V4).
- **C3** : Le Cuistologue, contenu exact de la prise en main réalisée (compte tenu de l'intégration ACF à venir), et existence ou non d'une maintenance déjà exécutée (sinon, elle n'apparaît pas).
- **Textes de l'étude de cas** : ceux « proposés dans notre dernière discussion » ne figurent pas dans les échanges dont je dispose. Les textes du § 8 sont rédigés à partir de E6 seulement ; à remplacer si vous me les transmettez.

### Détails techniques à vérifier pendant l'intégration

- Passage de 3 à 2 cartes de service (grille, carrousel mobile, illustrations).
- Indicateur à trois crans (Création, Refonte) et son équivalent accessible.
- Largeur du menu desktop avec six entrées.
- Nouveau plan du reel Figma (export de la version intermédiaire).
- Redéploiement du Worker pour l'e-mail de confirmation.
- Envoi de test du formulaire avec les nouveaux types.
- Contrôle visuel du texte vectorisé des scènes et de l'image de partage.
- Lecture de `confidentialite.astro` au regard de l'article 19 des CGV.

---

## État de validation

| Statut | Éléments |
| --- | --- |
| **Validé définitivement** | Positionnement, identité, H1 de l'accueil, deux domaines, architecture et navigation, titres des pages de service, direction artistique ; décisions E1 à E6 ; faits de référence (§ 0 de 01) ; mentions légales inchangées |
| **Prêt à intégrer après votre validation du dossier** | Contenus 01, sauf C1 à C3 ; CGV 02 hors clauses `[VALIDATION PRO]` ; checklist 03 ; corrections du tableau 04 ; plan 05 |
| **Conditionné** | C1 à C3 (contrôles factuels ci-dessus) |
| **Vérification juridique** | Les 8 points ci-dessus, avant publication des CGV |
