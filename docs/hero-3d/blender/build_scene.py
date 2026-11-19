"""Scène maîtresse « atelier numérique » : blockout (phase B).

Usage (depuis docs/hero-3d/blender/) :
    "C:/Program Files/Blender Foundation/Blender 5.3/blender.exe" -b --python build_scene.py

Le script reconstruit entièrement atelier-numerique.blend : il est la source de vérité de la structure (collections, noms, hiérarchies,
matériaux, caméras, éclairage, rendu). Les corrections artistiques se font dans le .blend ou ici, jamais à moitié dans l'un et l'autre :
tout ce qui est modifié à la main dans le .blend doit être reporté ici avant de relancer le script.

Repère : X vers la droite, Y vers le fond de la scène, Z vers le haut, unités en mètres.
Les couleurs viennent du design system du portfolio (src/styles/tokens.css et illustrations existantes).
"""
import math
import os

import bmesh
import bpy
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
BLEND = os.path.join(HERE, 'atelier-numerique.blend')

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.unit_settings.system = 'METRIC'

# ---------------------------------------------------------------- collections
COLL = {}
for n in ['00_Architecture', '01_Structures', '02_UI_Panels', '03_UI_Components', '04_Accents', '05_Lighting', '06_Cameras', '07_Animation']:
    c = bpy.data.collections.new(n)
    scene.collection.children.link(c)
    COLL[n] = c


def put(o, coll):
    for c in list(o.users_collection):
        c.objects.unlink(o)
    COLL[coll].objects.link(o)
    return o


# ---------------------------------------------------------------- matériaux (bibliothèque réutilisable)
def lin(h):
    h = h.lstrip('#')
    out = []
    for i in (0, 2, 4):
        c = int(h[i:i + 2], 16) / 255
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return (*out, 1.0)


def mat(name, hex_, rough=0.85, metal=0.0, **extra):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = lin(hex_)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    for k, v in extra.items():
        if k in b.inputs:
            b.inputs[k].default_value = v
    m.diffuse_color = lin(hex_)
    return m


MAT = {
    'BlueMineral': mat('MAT_BlueMineral', '#1f3fa0', 0.9),          # les murs bleus
    'BlueKlein': mat('MAT_BlueKlein', '#1f45d6', 0.8),              # les modules d'accent bleus
    'MetalBlueDark': mat('MAT_MetalBlueDark', '#17267a', 0.4, 0.8),  # rails, montants, garde-corps
    'CreamWarm': mat('MAT_CreamWarm', '#efe5d0', 0.9),              # architecture crème, panneaux
    'StoneLight': mat('MAT_StoneLight', '#e3d9c5', 0.95),           # sols, plateformes
    'MintWater': mat('MAT_MintWater', '#a6d4ca', 0.8),              # vert d'eau
    'AccentOrange': mat('MAT_AccentOrange', '#ee8532', 0.8),        # l'accent
    'FrostedGlass': mat('MAT_FrostedGlass', '#dff0ec', 0.35, 0.0, **{'Transmission Weight': 0.85, 'Alpha': 1.0}),
}

# ---------------------------------------------------------------- helpers de modélisation
def smooth(o):
    try:
        bpy.context.view_layer.objects.active = o
        o.select_set(True)
        bpy.ops.object.shade_auto_smooth(angle=math.radians(35))
    except Exception:
        for p in o.data.polygons:
            p.use_smooth = True
    o.select_set(False)


def box(name, x0, y0, z0, x1, y1, z1, m, coll, bevel=0.03, parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2))
    o = bpy.context.active_object
    o.name = name
    o.scale = (abs(x1 - x0), abs(y1 - y0), abs(z1 - z0))
    bpy.ops.object.transform_apply(scale=True)
    o.data.materials.append(m)
    put(o, coll)
    if bevel:
        bv = o.modifiers.new('Bevel', 'BEVEL')
        bv.width = min(bevel, min(o.dimensions) * 0.45)
        bv.segments = 3
        bv.limit_method = 'ANGLE'
    if parent:
        keep = o.matrix_world.copy()
        o.parent = parent
        o.matrix_parent_inverse = parent.matrix_world.inverted()
    return o


def cyl(name, x, y, z0, z1, r, m, coll, verts=32, axis='Z'):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=abs(z1 - z0), location=(x, y, (z0 + z1) / 2))
    o = bpy.context.active_object
    o.name = name
    o.data.materials.append(m)
    put(o, coll)
    smooth(o)
    return o


def prism_xz(name, pts, y0, y1, m, coll, bevel=0.02):
    """Prisme extrudé selon Y à partir d'un polygone convexe dans le plan XZ (arche, quart de disque…)."""
    me = bpy.data.meshes.new(name)
    n = len(pts)
    v = [(x, y0, z) for x, z in pts] + [(x, y1, z) for x, z in pts]
    f = [list(range(n))[::-1], list(range(n, 2 * n))]
    for i in range(n):
        j = (i + 1) % n
        f.append([i, j, j + n, i + n])
    me.from_pydata(v, [], f)
    me.update()
    o = bpy.data.objects.new(name, me)
    scene.collection.objects.link(o)
    o.data.materials.append(m)
    put(o, coll)
    if bevel:
        bv = o.modifiers.new('Bevel', 'BEVEL')
        bv.width = bevel
        bv.segments = 3
        bv.limit_method = 'ANGLE'
    return o


def quarter(name, cx, cz, r, y0, y1, m, coll, flip=False):
    pts = [(0, 0)] + [(r * math.cos(a), r * math.sin(a)) for a in [i * math.pi / 2 / 32 for i in range(33)]]
    if flip:
        pts = [(-x, z) for x, z in pts][::-1]
    return prism_xz(name, [(cx + x, cz + z) for x, z in pts], y0, y1, m, coll, bevel=0.0)


def cut(target, cutters):
    """Soustrait des volumes à un mur (booléen exact, appliqué), puis supprime les volumes."""
    bpy.context.view_layer.objects.active = target
    for k, c in enumerate(cutters):
        bm = target.modifiers.new(f'Cut{k}', 'BOOLEAN')
        bm.operation = 'DIFFERENCE'
        bm.object = c
        bm.solver = 'EXACT'
        bpy.ops.object.modifier_apply(modifier=bm.name)
    for c in cutters:
        bpy.data.objects.remove(c, do_unlink=True)


def cutter_box(x0, y0, z0, x1, y1, z1):
    bpy.ops.mesh.primitive_cube_add(size=1, location=((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2))
    o = bpy.context.active_object
    o.scale = (abs(x1 - x0), abs(y1 - y0), abs(z1 - z0))
    bpy.ops.object.transform_apply(scale=True)
    return o


def cutter_arch(cx, y0, y1, zspring, r):
    """Ouverture en arche : un rectangle surmonté d'un demi-cercle."""
    a = cutter_box(cx - r, y0, -0.5, cx + r, y1, zspring)
    bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=r, depth=abs(y1 - y0), location=(cx, (y0 + y1) / 2, zspring), rotation=(math.pi / 2, 0, 0))
    c = bpy.context.active_object
    return [a, c]


def empty(name, loc, coll, parent=None, kind='PLAIN_AXES', size=0.4):
    e = bpy.data.objects.new(name, None)
    e.empty_display_type = kind
    e.empty_display_size = size
    e.location = loc
    scene.collection.objects.link(e)
    put(e, coll)
    if parent:
        e.parent = parent
        e.matrix_parent_inverse = parent.matrix_world.inverted()
    return e


# ================================================================ 00_Architecture
H = 7.2
floor = box('ARCH_Floor_Main', -9, -3, -0.4, 9, 12, 0, MAT['StoneLight'], '00_Architecture', bevel=0.0)
stage = box('ARCH_Floor_Stage', -3.8, 2.4, 0, 4.6, 7.2, 0.3, MAT['StoneLight'], '00_Architecture', bevel=0.03)

# mur gauche, bleu, avec une fenêtre en fente (vitre vert d'eau)
wall_l = box('ARCH_Wall_Left_Blue', -8, 0, 0, -7.6, 11, H, MAT['BlueMineral'], '00_Architecture', bevel=0.0)
cut(wall_l, [cutter_box(-8.5, 4.2, 2.4, -7.0, 5.8, 5.0)])
box('ARCH_Window_Left_Glass', -7.85, 4.2, 2.4, -7.75, 5.8, 5.0, MAT['MintWater'], '00_Architecture', bevel=0.0)

# mur du fond, bleu, percé d'une grande arche ; liseré crème autour de l'arche ; niche bleue derrière
wall_b = box('ARCH_Wall_Back_Blue', -8, 10.4, 0, 3.2, 10.9, H, MAT['BlueMineral'], '00_Architecture', bevel=0.0)
cut(wall_b, cutter_arch(-4.4, 9.9, 11.4, 2.7, 2.2))
rim = box('ARCH_ArchRim_Cream', -7.4, 10.2, 0, -1.4, 11.1, 5.7, MAT['CreamWarm'], '00_Architecture', bevel=0.0)
cut(rim, cutter_arch(-4.4, 9.9, 11.4, 2.7, 2.2))
box('ARCH_Niche_Back_Blue', -7.2, 11.9, 0, -1.6, 12.0, 5.2, MAT['BlueMineral'], '00_Architecture', bevel=0.0)
box('ARCH_Niche_Side_Left', -6.9, 10.9, 0, -6.6, 12.0, 5.0, MAT['BlueMineral'], '00_Architecture', bevel=0.0)
box('ARCH_Niche_Side_Right', -2.2, 10.9, 0, -1.9, 12.0, 5.0, MAT['BlueMineral'], '00_Architecture', bevel=0.0)

# mur de droite, crème, avec une niche éclairée qui porte les jetons du design system
wall_r = box('ARCH_Wall_Right_Cream', 6.6, 0, 0, 7.5, 11, H, MAT['CreamWarm'], '00_Architecture', bevel=0.0)
cut(wall_r, [cutter_box(6.5, 6.0, 2.3, 7.1, 9.6, 3.8)])

# plateforme haute, à droite, avec garde-corps (la zone d'en-tête, en hauteur)
box('ARCH_Platform_Upper', 1.6, 5.0, 4.5, 6.6, 10.4, 4.8, MAT['CreamWarm'], '00_Architecture', bevel=0.03)
for i, x in enumerate([1.7, 2.9, 4.1, 5.3, 6.5]):
    cyl(f'STRUCT_Railing_Post_{i + 1:02d}', x, 5.08, 4.8, 5.8, 0.03, MAT['MetalBlueDark'], '01_Structures', verts=12)
box('STRUCT_Railing_Top', 1.6, 5.05, 5.78, 6.6, 5.12, 5.84, MAT['MetalBlueDark'], '01_Structures', bevel=0.01)

# escalier à gauche (4 marches) : transition de niveau
for i in range(4):
    box(f'ARCH_Stairs_Left_{i + 1:02d}', -7.6, 0.8 + i * 0.6, 0, -4.8 - (3 - i) * 0.0, 1.4 + i * 0.6, 0.2 * (i + 1), MAT['StoneLight'], '00_Architecture', bevel=0.02)

# bloc d'avant-plan gauche (socle du quart de disque orange)
box('ARCH_Plinth_Left', -6.9, -1.4, 0, -3.6, 1.4, 1.2, MAT['CreamWarm'], '00_Architecture', bevel=0.04)

# cadre architectural du haut (premier plan) : deux dalles qui encadrent la vue
box('ARCH_Frame_TopLeft', -9, -3, 6.7, -4.6, 3.0, 7.2, MAT['CreamWarm'], '00_Architecture', bevel=0.03)
box('ARCH_Frame_TopRight', 4.8, -3, 6.7, 9, 4.0, 7.2, MAT['CreamWarm'], '00_Architecture', bevel=0.03)

# ================================================================ 01_Structures : le système de conception central
XA, XB, YA, YB = -2.9, 3.1, 3.1, 6.1
for k, (x, y) in enumerate([(XA, YA), (XB, YA), (XA, YB), (XB, YB)]):
    cyl(f'STRUCT_Post_{"ABCD"[k]}', x, y, 0.3, 4.7, 0.09, MAT['MetalBlueDark'], '01_Structures', verts=24)
for nme, y in [('Front', YA), ('Back', YB)]:
    box(f'STRUCT_TopRail_X_{nme}', XA - 0.1, y - 0.07, 4.55, XB + 0.1, y + 0.07, 4.7, MAT['CreamWarm'], '01_Structures', bevel=0.02)
for nme, x in [('Left', XA), ('Right', XB)]:
    box(f'STRUCT_TopRail_Y_{nme}', x - 0.07, YA - 0.1, 4.55, x + 0.07, YB + 0.1, 4.7, MAT['CreamWarm'], '01_Structures', bevel=0.02)
# rails bas : ils portent la feuille de mise en page
for nme, x in [('Left', XA), ('Right', XB)]:
    box(f'STRUCT_LowRail_{nme}', x - 0.1, YA - 0.2, 0.95, x + 0.1, YB + 0.2, 1.1, MAT['CreamWarm'], '01_Structures', bevel=0.02)
# la feuille de mise en page (plan de travail) : grille à venir en phase D
box('STRUCT_Surface_Layout', -2.5, 3.3, 1.1, 2.7, 5.9, 1.25, MAT['CreamWarm'], '01_Structures', bevel=0.03)
# la plateforme bleue, suspendue au-dessus par quatre tiges (un niveau intermédiaire)
box('STRUCT_Platform_Blue', -2.3, 3.5, 2.0, 2.5, 5.7, 2.2, MAT['BlueKlein'], '01_Structures', bevel=0.03)
for k, (x, y) in enumerate([(-2.1, 3.7), (2.3, 3.7), (-2.1, 5.5), (2.3, 5.5)]):
    cyl(f'STRUCT_Hanger_{k + 1:02d}', x, y, 2.2, 4.55, 0.03, MAT['MetalBlueDark'], '01_Structures', verts=12)
# étagère basse (les cartes en attente)
box('STRUCT_Shelf_Low', -2.7, 2.7, 0.3, 2.9, 3.4, 0.42, MAT['CreamWarm'], '01_Structures', bevel=0.03)
for x in (-2.5, 2.7):
    box(f'STRUCT_Shelf_Leg_{"L" if x < 0 else "R"}', x - 0.05, 2.75, 0, x + 0.05, 3.35, 0.3, MAT['MetalBlueDark'], '01_Structures', bevel=0.0)
# bureau de droite (contrôles) : plan incliné sur deux pieds
desk = box('STRUCT_Desk_Right', 3.7, 3.6, 1.45, 6.5, 5.9, 1.6, MAT['CreamWarm'], '01_Structures', bevel=0.03)
desk.rotation_euler = (math.radians(-7), 0, 0)
for k, (x, y) in enumerate([(3.9, 3.9), (6.3, 3.9), (3.9, 5.6), (6.3, 5.6)]):
    cyl(f'STRUCT_Desk_Leg_{k + 1:02d}', x, y, 0, 1.45, 0.05, MAT['MetalBlueDark'], '01_Structures', verts=16)

# ================================================================ 02_UI_Panels
# panneau principal : une fenêtre d'interface en verre dépoli, entre les montants (se déplace sur rail : ANIM_Panel_Rail)
anim_panel = empty('ANIM_Panel_Rail', (0.6, 4.6, 0), '07_Animation', size=0.6)
main_panel = box('PANEL_Main_Frosted', -1.3, 4.55, 2.55, 2.5, 4.67, 4.3, MAT['FrostedGlass'], '02_UI_Panels', bevel=0.03, parent=anim_panel)
box('COMP_Main_Image', -1.1, 4.5, 2.75, 0.2, 4.55, 3.65, MAT['MintWater'], '03_UI_Components', bevel=0.02, parent=main_panel)
box('COMP_Main_Line_A', 0.5, 4.5, 3.5, 2.2, 4.55, 3.56, MAT['MetalBlueDark'], '03_UI_Components', bevel=0.01, parent=main_panel)
box('COMP_Main_Line_B', 0.5, 4.5, 3.3, 1.9, 4.55, 3.36, MAT['MetalBlueDark'], '03_UI_Components', bevel=0.01, parent=main_panel)
box('COMP_Main_Button_Blue', 0.5, 4.5, 2.78, 1.6, 4.55, 3.08, MAT['BlueKlein'], '03_UI_Components', bevel=0.04, parent=main_panel)
# module de navigation vertical (les formes de base du système), et son panneau vert d'eau derrière
nav = box('PANEL_Nav_Vertical', -2.4, 4.35, 2.35, -1.55, 4.55, 4.5, MAT['CreamWarm'], '02_UI_Panels', bevel=0.05)
for k in range(5):
    box(f'COMP_Nav_Icon_{k + 1:02d}', -2.12, 4.3, 2.55 + k * 0.38, -1.82, 4.35, 2.55 + k * 0.38 + 0.26, MAT['BlueKlein'] if k == 0 else MAT['StoneLight'], '03_UI_Components', bevel=0.02, parent=nav)
box('PANEL_Mint_Back_A', -2.75, 4.72, 2.7, -1.9, 4.8, 4.3, MAT['MintWater'], '02_UI_Panels', bevel=0.03)
box('PANEL_Mint_Back_B', -3.0, 4.9, 2.9, -2.2, 4.98, 4.1, MAT['MintWater'], '02_UI_Panels', bevel=0.03)

# ================================================================ 03_UI_Components
for k, x in enumerate([-2.4, -1.2, 0.0]):
    box(f'COMP_Card_Shelf_{"ABC"[k]}', x, 2.85, 0.42, x + 1.0, 3.3, 0.66, MAT['CreamWarm'], '03_UI_Components', bevel=0.04)
# la carte en cours d'assemblage : elle glisse sur un rail vers sa place (ANIM_Card_Slide pilote le déplacement)
anim_card = empty('ANIM_Card_Slide', (1.5, 3.05, 0.9), '07_Animation', size=0.4)
box('COMP_Card_Moving', 1.0, 2.85, 0.9, 2.0, 3.3, 1.14, MAT['CreamWarm'], '03_UI_Components', bevel=0.04, parent=anim_card)
# contrôles du bureau de droite : un curseur et un bouton
box('COMP_Slider_Track', 4.0, 4.0, 1.66, 5.5, 4.08, 1.7, MAT['MetalBlueDark'], '03_UI_Components', bevel=0.01)
box('COMP_Slider_Handle', 4.9, 3.97, 1.66, 5.05, 4.11, 1.76, MAT['StoneLight'], '03_UI_Components', bevel=0.03)
box('COMP_Button_Blue', 5.2, 4.7, 1.62, 6.0, 5.2, 1.7, MAT['BlueKlein'], '03_UI_Components', bevel=0.05)
# les jetons (couleurs et typographie) dans la niche du mur de droite
for k, (c, nme) in enumerate([('BlueKlein', 'Blue'), ('CreamWarm', 'Cream'), ('MintWater', 'Mint'), ('StoneLight', 'Type'), ('StoneLight', 'More')]):
    box(f'COMP_Token_{nme}', 6.62, 6.3 + k * 0.62, 2.55, 6.9, 6.3 + k * 0.62 + 0.52, 3.05, MAT[c], '03_UI_Components', bevel=0.04)

# ================================================================ 04_Accents
quarter('ACCENT_Quarter_Orange', -6.4, 1.2, 2.1, -1.2, 1.0, MAT['AccentOrange'], '04_Accents')
q2 = quarter('ACCENT_Quarter_Mint', 5.9, 0, 1.7, -1.8, -0.4, MAT['MintWater'], '04_Accents', flip=True)

# ================================================================ 05_Lighting
world = bpy.data.worlds.new('World')
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes['Background']
bg.inputs['Color'].default_value = lin('#f2e2c6')
bg.inputs['Strength'].default_value = 0.9


def light(name, kind, loc, rot_deg, energy, color, **kw):
    ld = bpy.data.lights.new(name, kind)
    ld.energy = energy
    ld.color = lin(color)[:3]
    for k, v in kw.items():
        setattr(ld, k, v)
    o = bpy.data.objects.new(name, ld)
    scene.collection.objects.link(o)
    put(o, '05_Lighting')
    o.location = loc
    o.rotation_euler = tuple(math.radians(a) for a in rot_deg)
    return o


light('LIGHT_Sun_Key', 'SUN', (0, 0, 12), (42, 0, -32), 3.0, '#ffd8a6', angle=math.radians(2.5))
light('LIGHT_Fill_Soft', 'AREA', (-6, -9, 7), (70, 0, -35), 420, '#fff0dc', shape='RECTANGLE', size=9, size_y=6)
light('LIGHT_Niche_Warm', 'AREA', (6.4, 7.8, 3.6), (0, 90, 0), 120, '#ffb46a', shape='RECTANGLE', size=3.4, size_y=0.18)
light('LIGHT_Platform_Under', 'AREA', (4.0, 5.2, 4.4), (180, 0, 0), 90, '#ffbf80', shape='RECTANGLE', size=4.5, size_y=0.2)

# ================================================================ 06_Cameras + 07_Animation (cibles pilotables)
def camera(name, loc, target, focal, coll='06_Cameras'):
    cd = bpy.data.cameras.new(name)
    cd.lens = focal
    cd.sensor_width = 36
    o = bpy.data.objects.new(name, cd)
    scene.collection.objects.link(o)
    put(o, coll)
    o.location = loc
    t = empty(f'TARGET_{name}', target, '06_Cameras', kind='SPHERE', size=0.2)
    con = o.constraints.new('TRACK_TO')
    con.target = t
    con.track_axis = 'TRACK_NEGATIVE_Z'
    con.up_axis = 'UP_Y'
    return o


cam_d = camera('CAM_Hero_Desktop', (-4.4, -7.4, 3.7), (1.4, 5.4, 2.9), 30)
cam_m = camera('CAM_Hero_Mobile', (-2.6, -3.0, 3.1), (1.0, 4.6, 3.0), 32)
# un parent de dérive : un léger mouvement de caméra pourra être animé sans toucher aux caméras
drift = empty('ANIM_Camera_Drift', (0, 0, 0), '07_Animation', size=0.5)
cam_d.parent = drift
scene.camera = cam_d

# ================================================================ rendu
scene.render.engine = 'CYCLES'
cy = scene.cycles
cy.samples = 96
cy.use_denoising = True
cy.denoiser = 'OPENIMAGEDENOISE'
cy.use_adaptive_sampling = True
try:
    prefs = bpy.context.preferences.addons['cycles'].preferences
    for dt in ('OPTIX', 'CUDA'):
        try:
            prefs.compute_device_type = dt
            prefs.get_devices()
            if any(d.type == dt for d in prefs.devices):
                for d in prefs.devices:
                    d.use = d.type == dt
                cy.device = 'GPU'
                break
        except Exception:
            continue
except Exception as e:
    print('GPU non configuré :', e)
scene.render.resolution_x, scene.render.resolution_y = 1600, 1200
scene.render.image_settings.file_format = 'PNG'
scene.view_settings.view_transform = 'Standard'
scene.view_settings.look = 'None'
scene.render.film_transparent = False

# ================================================================ sauvegarde
bpy.ops.wm.save_as_mainfile(filepath=BLEND)
print('SAVED', BLEND, 'objets :', len(bpy.data.objects))
