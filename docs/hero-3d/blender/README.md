# Scène maîtresse « atelier numérique » : projet Blender

État : **blockout (phase B)**. Les volumes, la hiérarchie, les caméras et les poignées d'animation sont en place ; les matériaux, la lumière et le détail sont provisoires.

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `build_scene.py` | Source de vérité : reconstruit `atelier-numerique.blend` (collections, objets, matériaux, lumières, caméras, rendu). |
| `atelier-numerique.blend` | Le fichier de travail, généré par le script. Pas de texture externe à ce stade. |
| `render.py` | Rend une caméra : `blender -b atelier-numerique.blend --python render.py -- desktop\|mobile sortie.png [L H échantillons]`. |
| `renders/` | Rendus de contrôle (`blockout-desktop.png` 1600×1200, `blockout-mobile.png` 1200×1200). |
| `../reference/reference-validee.webp` | L'illustration de référence validée. |

Reconstruire : `"C:/Program Files/Blender Foundation/Blender 5.3/blender.exe" -b --python build_scene.py` (Blender 5.3.0, installé via winget ; rendu Cycles sur la RTX 3070 Ti, OptiX). Une modification faite à la main dans le `.blend` doit être reportée dans le script avant de le relancer, sinon elle est perdue.

Repère : X droite, Y vers le fond, Z haut, mètres.

## Collections et rôle des objets

| Collection | Contenu | Rôle dans le système |
| --- | --- | --- |
| `00_Architecture` | `ARCH_Floor_*`, `ARCH_Wall_Left_Blue` (fenêtre en fente), `ARCH_Wall_Back_Blue` (percé de l'arche), `ARCH_ArchRim_Cream`, `ARCH_Niche_*`, `ARCH_Wall_Right_Cream` (niche des jetons), `ARCH_Platform_Upper`, `ARCH_Stairs_Left_*`, `ARCH_Plinth_Left`, `ARCH_Frame_Top*` | La structure générale ; les plateformes sont les zones de mise en page ; les dalles du haut cadrent la vue. |
| `01_Structures` | `STRUCT_Post_A-D`, `STRUCT_TopRail_*`, `STRUCT_LowRail_*`, `STRUCT_Surface_Layout`, `STRUCT_Platform_Blue`, `STRUCT_Hanger_*`, `STRUCT_Shelf_*`, `STRUCT_Desk_*`, `STRUCT_Railing_*` | Le système de conception : les rails organisent et portent les composants ; la plateforme bleue est un niveau intermédiaire suspendu. |
| `02_UI_Panels` | `PANEL_Main_Frosted` (verre dépoli), `PANEL_Nav_Vertical`, `PANEL_Mint_Back_A/B` | Les écrans et états d'interface. |
| `03_UI_Components` | `COMP_Main_*`, `COMP_Nav_Icon_*`, `COMP_Card_*`, `COMP_Slider_*`, `COMP_Button_Blue`, `COMP_Token_*` | Les composants réutilisables ; les jetons (couleurs, typographie) dans la niche de droite. |
| `04_Accents` | `ACCENT_Quarter_Orange`, `ACCENT_Quarter_Mint` | Les formes du logo, en volume ; elles ferment la composition à gauche et à droite. |
| `05_Lighting` | `LIGHT_Sun_Key` (chaud, directionnel), `LIGHT_Fill_Soft`, `LIGHT_Niche_Warm`, `LIGHT_Platform_Under` | Une lumière principale et trois lumières d'ambiance qui détachent les plans. |
| `06_Cameras` | `CAM_Hero_Desktop` (30 mm), `CAM_Hero_Mobile` (32 mm), cibles `TARGET_*` | Deux compositions de la même scène ; on déplace les cibles pour recadrer. |
| `07_Animation` | `ANIM_Panel_Rail`, `ANIM_Card_Slide`, `ANIM_Camera_Drift` | Poignées de mouvement (voir ci-dessous). |

## Matériaux (bibliothèque `MAT_*`)

`BlueMineral` `#1f3fa0`, `BlueKlein` `#1f45d6`, `MetalBlueDark` `#17267a` (métal), `CreamWarm` `#efe5d0`, `StoneLight` `#e3d9c5`, `MintWater` `#a6d4ca`, `AccentOrange` `#ee8532`, `FrostedGlass` (transmission). Les couleurs viennent de `src/styles/tokens.css` et des illustrations existantes. Provisoires : couleur et rugosité seulement, sans texture (phase D).

## Poignées d'animation (phase F, rien n'est animé aujourd'hui)

- `ANIM_Panel_Rail` : parent de `PANEL_Main_Frosted` et de ses composants (déplacement court sur rail, selon X).
- `ANIM_Card_Slide` : parent de `COMP_Card_Moving` (la carte qui glisse vers sa place sur l'étagère, selon X).
- `ANIM_Camera_Drift` : parent de `CAM_Hero_Desktop` (léger mouvement de caméra).

## Rendu

Cycles, OptiX, denoise OpenImageDenoise, 96 échantillons de contrôle, transformation de vue « Standard » (pas de désaturation du design system), fond non transparent.

## Sorties web prévues (phase E)

Desktop 4:3, rendu 2400×1800, livré en AVIF et WebP (≈ 1800 et 900 px) ; mobile 1:1, rendu 1200×1200, livré à 600 et 1000 px ; image de repli en WebP ; attributs `width`/`height` explicites pour éviter tout décalage de mise en page ; image principale en `fetchpriority="high"`.

## Reconstruction fidèle de la référence (en cours)

`build_reference_scene.py` remplace le blockout inventé : chaque volume est rétro-projeté depuis les coins lus sur `reference-validee.webp` (voir `refcam.py` pour la caméra : 1672 x 941, 30,7 mm, horizon à y = 510, shift Y = 0,0236, œil à 1,7 m).
Contrainte constatée : la référence n'est pas une perspective cohérente (points de fuite et focale différents d'un objet à l'autre). Aucune caméra unique ne la restitue : chaque volume est donc placé sur son propre plan 3D, la caméra principale reproduit la composition, la scène reste un modèle éditable.
Contrôle : `renders/comparaison-v2-cote-a-cote.png` et `comparaison-v2-superposition.png`.
