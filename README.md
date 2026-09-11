# Portfolio — Antoine Bruneau

Portfolio freelance UX/UI design & direction artistique (identité, UX/UI, sites/interfaces sur-mesure, accompagnement continu).

Le site est un fichier unique et autonome : `index.html` (CSS et JS inline, polices via Google Fonts en CDN). Aucune étape de build n'est nécessaire.

## Travailler en local

Ouvrir directement `index.html` dans un navigateur, ou utiliser un serveur local (recommandé pour que les ancres `#section` et le rechargement se comportent normalement) :

```bash
npx serve .
```

Puis ouvrir l'URL affichée (par défaut http://localhost:3000).

Avec l'extension **Live Server** de VS Code : clic droit sur `index.html` → "Open with Live Server".

## À personnaliser avant mise en ligne publique

- **Projets** (section `#projets`) : les 4 cartes sont des projets *conceptuels* clairement identifiés ("Projet concept") — à remplacer par de vrais projets clients au fur et à mesure.
- **Tarifs** (section `#tarifs`) : montants indicatifs (890 € / 2 400 € / 950 €/mois) à ajuster.
- **Contact** : le formulaire ouvre le client email par défaut avec un message pré-rempli vers `antoine.bruneau@protonmail.com` (aucun backend requis).
- **Réseaux sociaux** : volontairement absents du footer pour éviter des liens morts — à ajouter quand disponibles.

## Déploiement

Le site n'a besoin d'aucun hébergement particulier : n'importe quel hébergeur statique convient (Netlify, Vercel, GitHub Pages, OVH/o2switch mutualisé classique, etc.) — il suffit de déposer `index.html`.
