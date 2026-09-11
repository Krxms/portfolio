# Portfolio — Antoine Bruneau

Portfolio freelance UX/UI design & direction artistique (identité, UX/UI, sites/interfaces sur-mesure, accompagnement continu), construit avec [Astro](https://astro.build).

## Structure

```
src/
├── components/       Un composant par section, avec son propre <style> scoped
├── layouts/
│   └── BaseLayout.astro   Head, Header, Footer, script global
├── content/
│   └── projets/*.md       Une étude de cas = un fichier (content collection)
├── content.config.ts      Schéma des données de projet
├── scripts/                JS partagé (nav, menu mobile, reveal, marquee, formulaire)
├── styles/
│   ├── tokens.css          Variables (couleurs, typographies, rayons)
│   └── global.css          Reset + classes utilitaires partagées (.btn, .section, .tag...)
└── pages/
    ├── index.astro          Page d'accueil (une seule page qui assemble les sections)
    ├── contact.astro
    ├── a-propos.astro
    └── projets/
        ├── index.astro      Liste des projets
        └── [slug].astro     Gabarit d'étude de cas (généré depuis src/content/projets)
```

Chaque section de la page d'accueil (Hero, Services, Process, Projects, Pricing, FAQ...) est un composant Astro avec son propre bloc `<style>` : le CSS d'un composant ne fuit jamais vers un autre. Seuls les tokens et quelques classes utilitaires vraiment partagées (boutons, conteneur `.wrap`, titres de section) vivent dans `src/styles/global.css`.

## Ajouter un projet

Créer un fichier dans `src/content/projets/mon-projet.md` avec ce frontmatter :

```yaml
---
title: "Nom du projet"
sector: "Secteur du client"
tags: ["Tag 1", "Tag 2"]
summary: "Une phrase pour la carte."
variant: 1        # 1 à 4 — détermine la couleur de couverture et l'icône
order: 5
brief: "Le contexte du client, sa problématique."
approach: "Ce que tu as fait, comment tu as abordé le problème."
outcome: "Le résultat concret."
---
```

La page `/projets/mon-projet` est générée automatiquement, ainsi que sa carte sur `/projets` et sur l'accueil.

## Développement local

```bash
npm install   # une seule fois
npm run dev   # démarre le serveur local sur http://localhost:4321
```

`npm run build` génère le site statique dans `dist/` (déployable sur Netlify, Vercel, GitHub Pages, ou tout hébergement statique).

## À personnaliser avant mise en ligne publique

- **Projets** : les 4 études de cas dans `src/content/projets/` sont des projets *conceptuels* clairement identifiés ("Projet concept") — à remplacer par de vrais projets clients au fur et à mesure.
- **À propos** (`src/pages/a-propos.astro`) : le paragraphe de bio et la photo sont des emplacements à remplir (clairement indiqués sur la page).
- **Tarifs** (`src/components/Pricing.astro`) : montants indicatifs (890 € / 2 400 € / 950 €/mois) à ajuster.
- **Contact** : le formulaire ouvre le client email par défaut avec un message pré-rempli vers `antoine.bruneau@protonmail.com` (aucun backend requis).
- **Réseaux sociaux** : volontairement absents du footer pour éviter des liens morts — à ajouter quand disponibles.
