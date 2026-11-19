"""Reconstruction 3D fidèle de l'illustration de référence (reference-validee.webp, 1672 x 941).

    "C:/Program Files/Blender Foundation/Blender 5.3/blender.exe" -b --python build_reference_scene.py

Méthode (voir README) : la référence n'est pas une perspective géométriquement cohérente (points de fuite et focale
différents d'un objet à l'autre). Chaque volume est donc reconstruit à partir des coins de ses faces lus sur l'image,
rétro-projetés sur un plan 3D (vertical, horizontal ou incliné) à une profondeur choisie, puis extrudé. La caméra
principale (refcam.py) restitue ainsi la composition de la référence ; la scène reste un vrai modèle 3D (volumes,
matériaux, lumières, poignées d'animation), éditable et animable.

Repère : X droite, Y profondeur, Z haut, mètres. La dalle principale a son dessus à Z = 0.
"""
import math
import os
import sys

import bmesh
import bpy
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import refcam as RC  # noqa: E402

BLEND = os.path.join(HERE, 'atelier-numerique.blend')
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.unit_settings.system = 'METRIC'

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


# ------------------------------------------------------------------ matériaux
def lin(h):
    h = h.lstrip('#')
    out = []
    for i in (0, 2, 4):
        c = int(h[i:i + 2], 16) / 255
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return (*out, 1.0)


def mat(name, hex_, rough=0.85, metal=0.0, bump=0.0, scale=60.0, **extra):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = lin(hex_)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    for k, v in extra.items():
        if k in b.inputs:
            b.inputs[k].default_value = v
    if bump:
        tc = nt.nodes.new('ShaderNodeTexCoord')
        nz = nt.nodes.new('ShaderNodeTexNoise')
        nz.inputs['Scale'].default_value = scale
        nz.inputs['Detail'].default_value = 8
        bp = nt.nodes.new('ShaderNodeBump')
        bp.inputs['Strength'].default_value = bump
        nt.links.new(tc.outputs['Object'], nz.inputs['Vector'])
        nt.links.new(nz.outputs['Fac'], bp.inputs['Height'])
        nt.links.new(bp.outputs['Normal'], b.inputs['Normal'])
    m.diffuse_color = lin(hex_)
    return m


MAT = {
    'BlueMineral': mat('MAT_BlueMineral', '#1f3fa0', 0.9, bump=0.25),
    'BlueKlein': mat('MAT_BlueKlein', '#1f45d6', 0.75, bump=0.1),
    'MetalBlueDark': mat('MAT_MetalBlueDark', '#17267a', 0.4, 0.8),
    'CreamWarm': mat('MAT_CreamWarm', '#efe5d0', 0.9, bump=0.12),
    'StoneLight': mat('MAT_StoneLight', '#e3d9c5', 0.9, bump=0.1),
    'MintWater': mat('MAT_MintWater', '#a6d4ca', 0.7, bump=0.08),
    'AccentOrange': mat('MAT_AccentOrange', '#ee8532', 0.85, bump=0.2),
    'FrostedGlass': mat('MAT_FrostedGlass', '#e4f1ec', 0.4, 0.0, **{'Transmission Weight': 0.25}),
    'MetalGrey': mat('MAT_MetalGrey', '#b9b3a6', 0.35, 0.7),
    'GlassMint': mat('MAT_GlassMint', '#d3e8df', 0.5, 0.0, **{'Transmission Weight': 0.3}),
}
lamp = bpy.data.materials.new('MAT_LedWarm')
lamp.use_nodes = True
_e = lamp.node_tree.nodes['Principled BSDF']
_e.inputs['Base Color'].default_value = lin('#ffd9a0')
_e.inputs['Emission Color'].default_value = lin('#ffc277')
_e.inputs['Emission Strength'].default_value = 6.0
MAT['LedWarm'] = lamp


# ------------------------------------------------------------------ plans et rétro-projection
class Plane:
    def __init__(self, n, q):
        self.n = Vector(n).normalized()
        self.q = q

    @staticmethod
    def vertical(theta_deg, px, py, y):
        """Plan vertical dont les horizontales fuient vers l'azimut theta (0 = axe optique, > 0 vers la droite)."""
        t = math.radians(theta_deg)
        n = Vector((-math.cos(t), math.sin(t), 0)) if math.sin(t) > 0 else Vector((math.cos(t), -math.sin(t), 0))
        p = Vector(RC.at_y(px, py, y))
        return Plane(n, n.dot(p))

    @staticmethod
    def horizontal(z):
        return Plane((0, 0, 1), z)

    @staticmethod
    def through(p0, p1, p2):
        n = (p1 - p0).cross(p2 - p0)
        return Plane(n, n.normalized().dot(p0))

    def hit(self, px, py):
        d = Vector(RC.ray(px, py))
        c = Vector(RC.C)
        t = (self.q - self.n.dot(c)) / self.n.dot(d)
        return c + d * t


def W(px, py, y):
    return Vector(RC.at_y(px, py, y))


def solid(name, front, ext, m, coll, bevel=0.0, smooth_=False):
    """Prisme : le polygone `front` (liste de Vector) extrudé de `ext` (Vector)."""
    n = len(front)
    back = [p + ext for p in front]
    me = bpy.data.meshes.new(name)
    verts = [tuple(p) for p in front] + [tuple(p) for p in back]
    faces = [list(range(n)), list(range(2 * n - 1, n - 1, -1))]
    for i in range(n):
        j = (i + 1) % n
        faces.append([i, j, j + n, i + n])
    me.from_pydata(verts, [], faces)
    me.update()
    bm = bmesh.new()
    bm.from_mesh(me)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(name, me)
    scene.collection.objects.link(o)
    o.data.materials.append(m)
    put(o, coll)
    if bevel:
        bv = o.modifiers.new('Bevel', 'BEVEL')
        bv.width = bevel
        bv.segments = 2
        bv.limit_method = 'ANGLE'
    if smooth_:
        for p in me.polygons:
            p.use_smooth = True
    return o


def vsolid(name, pts, plane, thick, m, coll, bevel=0.0):
    """Face verticale/inclinée définie par ses coins image, extrudée vers l'arrière (loin de la caméra)."""
    front = [plane.hit(*p) for p in pts]
    return solid(name, front, plane.n * thick, m, coll, bevel)


def hsolid(name, pts, z, thick, m, coll, bevel=0.0):
    """Face horizontale à la hauteur z, extrudée de `thick` (positif : vers le haut, négatif : vers le bas)."""
    pl = Plane.horizontal(z)
    front = [pl.hit(*p) for p in pts]
    if thick < 0:
        front = front[::-1]
    return solid(name, front, Vector((0, 0, thick)), m, coll, bevel)


def cut(target, cutters):
    bpy.context.view_layer.objects.active = target
    for k, c in enumerate(cutters):
        bm = target.modifiers.new(f'Cut{k}', 'BOOLEAN')
        bm.operation = 'DIFFERENCE'
        bm.object = c
        bm.solver = 'EXACT'
        bpy.ops.object.modifier_apply(modifier=bm.name)
    for c in cutters:
        bpy.data.objects.remove(c, do_unlink=True)


def ellipse(cx, cy, rx, ry, a0=180, a1=360, n=40):
    """Arc d'ellipse en coordonnées image (a0 -> a1 degrés, 180 = gauche, 270 = sommet, 360 = droite)."""
    return [(cx + rx * math.cos(math.radians(a0 + (a1 - a0) * i / n)), cy + ry * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]


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


A, B = '00_Architecture', '01_Structures'
PN, CP, AC = '02_UI_Panels', '03_UI_Components', '04_Accents'
M = MAT

# ================================================================== 00_Architecture
# --- sols : sol bas, dalle principale (dessus à Z = 0), bord de dalle lu sur la référence
vsolid  # noqa
ground = hsolid('ARCH_Ground', [(-3000, 600), (3000, 600), (3000, 2400), (-3000, 2400)], -0.45, -0.3, M['StoneLight'], A)
slab = hsolid('ARCH_Slab_Main', [(-300, 534), (491, 1104), (1643, 747), (1643, 600), (-300, 600)], 0.0, -0.45, M['StoneLight'], A)

# --- mur bleu principal (texte « DESIGN SYSTEM »), famille de plans theta = 58 degrés
PL_W1 = Plane.vertical(58, 130, 688, RC.floor(130, 688)[1])
w1 = vsolid('ARCH_Wall_Blue_Main', [(130, 688), (130, -40), (1000, 136), (1000, 635)], PL_W1, 1.2, M['BlueMineral'], A)
cut(w1, [vsolid('cut', [(280, 244), (380, 252), (380, 499), (280, 497)], PL_W1, 0.5, M['BlueMineral'], A)])
vsolid('ARCH_Window_Glass', [(281, 256), (353, 262), (353, 497), (281, 497)], Plane(PL_W1.n, PL_W1.q + 0.42), 0.04, M['GlassMint'], A)

# --- piliers cream (gauche, droite)
PL_PL = Plane.vertical(58, 15, 690, 6.0)
vsolid('ARCH_Pillar_Left', [(0, -40), (30, -40), (30, 700), (0, 720)], PL_PL, 1.0, M['CreamWarm'], A)
PL_PR = Plane.vertical(-70, 1657, 700, 11.0)
vsolid('ARCH_Pillar_Right', [(1643, 80), (1672, 80), (1672, 830), (1643, 800)], PL_PR, 1.0, M['CreamWarm'], A)
# pan bleu bas à gauche (retour du mur sous la fenêtre)
vsolid('ARCH_Wall_Blue_Left_Low', [(30, 531), (130, 525), (130, 690), (30, 694)], Plane.vertical(58, 30, 694, RC.floor(30, 694)[1] - 1.2), 0.6, M['BlueMineral'], A)

# --- poutres du haut (sous-faces)
hsolid('ARCH_Beam_TopLeft', [(30, 99), (150, 0), (333, 0), (87, 153)], 5.0, 0.8, M['CreamWarm'], A)
hsolid('ARCH_Beam_TopRight', [(1423, 0), (1529, 110), (1643, 87), (1569, 0)], 5.0, 0.8, M['CreamWarm'], A)

# --- arche (anneau crème percé, profondeur 0,6 devant le mur bleu)
PL_AR = Plane(PL_W1.n, PL_W1.q - 0.6)
arch_outer = ellipse(610, 235, 213, 145, 180, 360, 48)
arch_pts = [(397, 700)] + arch_outer + [(823, 700)]
arch = vsolid('ARCH_Arch_Ring', arch_pts, PL_AR, 0.55, M['CreamWarm'], A)
inner = [(470, 720)] + ellipse(610, 240, 140, 105, 180, 360, 48) + [(750, 720)]
cut(arch, [vsolid('cut', inner, PL_AR, 0.7, M['CreamWarm'], A)])
# plaque de fond sombre dans l'arche (niche bleue)
vsolid('ARCH_Niche_Back', [(466, 700), (466, 232), (756, 232), (756, 700)], Plane(PL_W1.n, PL_W1.q + 0.02), 0.05, M['BlueMineral'], A)

# --- passerelle haute : face avant, sous-face, face d'extrémité droite, petit bloc, garde-corps
PL_WK = Plane.vertical(-63, 712, 246, 8.9)
vsolid('ARCH_Walkway_Front', [(712, 246), (1345, 176), (1344, 212), (712, 272)], PL_WK, 0.4, M['CreamWarm'], A)
# dessus de la passerelle : plan incliné (la référence le montre vu d'en haut, au-dessus de l'horizon)
_p0, _p1 = PL_WK.hit(712, 246), PL_WK.hit(1345, 176)
_top = Plane.through(_p0, _p1, PL_WK.hit(1230, 138) + Vector((0, 1.6, 0)))
solid('ARCH_Walkway_Top', [_top.hit(*p) for p in [(712, 246), (1230, 138), (1345, 176), (1236, 184)]], Vector((0, 0, -0.1)), M['CreamWarm'], A)
vsolid('ARCH_Walkway_End', [(1230, 138), (1345, 176), (1344, 211), (1236, 185)], Plane.vertical(60, 1230, 138, PL_WK.hit(1230, 138)[1] + 0.4), 0.2, M['CreamWarm'], A)
vsolid('ARCH_Walkway_Block', [(1048, 150), (1130, 120), (1160, 122), (1160, 168), (1048, 172)], Plane.vertical(-63, 1048, 150, PL_WK.hit(1048, 150)[1] + 1.8), 0.6, M['CreamWarm'], A)
vsolid('ARCH_Walkway_Block_Window', [(1068, 150), (1128, 133), (1128, 168), (1068, 172)], Plane.vertical(-63, 1068, 150, PL_WK.hit(1068, 150)[1] + 1.78), 0.05, M['LedWarm'], A)

# --- mur droit (niche des jetons)
PL_RW = Plane.vertical(-80, 1153, 400, 15.5)
rw = vsolid('ARCH_Wall_Right_Cream', [(1150, 250), (1333, 104), (1480, 62), (1643, 84), (1643, 700), (1150, 700)], PL_RW, 1.0, M['CreamWarm'], A)
cut(rw, [vsolid('cut', [(1210, 293), (1565, 283), (1565, 411), (1210, 411)], PL_RW, 0.45, M['CreamWarm'], A)])
vsolid('ARCH_Niche_Light', [(1215, 297), (1560, 288), (1560, 300), (1215, 309)], Plane(PL_RW.n, PL_RW.q + 0.3), 0.03, M['LedWarm'], A)
vsolid('ARCH_Wall_Right_Under', [(1153, 250), (1153, 700), (1255, 700), (1255, 540)], Plane.vertical(-80, 1153, 400, 14.8), 0.4, M['CreamWarm'], A)

# --- escalier gauche
for i, (x0, x1, y0, y1) in enumerate([(50, 215, 672, 697), (92, 215, 633, 672), (135, 215, 597, 633)]):
    vsolid(f'ARCH_Stairs_{i + 1:02d}', [(x0, y0), (x1, y0 - 4), (x1, y1), (x0, y1)], Plane.vertical(58, x0, y1, RC.floor(x0, y1)[1]), 1.2, M['StoneLight'], A)

# --- bloc crème gauche et son porte-à-faux, quart de disque orange
PL_BL = Plane.vertical(58, 215, 740, 10.8)
vsolid('ARCH_Plinth_Block', [(213, 560), (440, 565), (440, 770), (213, 745)], PL_BL, 1.0, M['CreamWarm'], A)
vsolid('ARCH_Plinth_Cantilever', [(213, 535), (565, 531), (565, 570), (213, 562)], PL_BL, 1.6, M['CreamWarm'], A)
pts = [(440, 798)] + [(275 + 165 * (1 - math.sin(math.radians(a))), 798 - 220 * math.sin(math.radians(a)) + 0) for a in range(0, 91, 3)]
# quart de disque : arc entre (283,735) et (440,578), coin droit en (440,798)
arc = [(283 + (440 - 283) * (1 - math.cos(math.radians(a))), 735 - (735 - 578) * math.sin(math.radians(a))) for a in range(0, 91, 3)]
orange = [(440, 798), (283, 740)] + arc[1:] + [(440, 578)]
vsolid('ACCENT_Quarter_Orange', orange, Plane.vertical(-35, 440, 798, 8.4), 0.5, M['AccentOrange'], AC)

# --- quart de disque vert d'eau (à droite)
mint = [(1455, 740)] + [(1455 + 165 * math.sin(math.radians(a)), 740 - 138 + 138 * (1 - math.cos(math.radians(a)))) for a in range(0, 91, 3)]
mint = [(1455, 740), (1455, 608)] + [(1455 + 150 * math.sin(math.radians(a)), 608 + 132 * (1 - math.cos(math.radians(a)))) for a in range(3, 91, 3)] + [(1618, 748)]
vsolid('ACCENT_Quarter_Mint', mint, Plane.vertical(-70, 1455, 740, RC.floor(1455, 740)[1]), 0.5, M['MintWater'], AC)

# ================================================================== 01_Structures : le système central (famille de plans theta = 59)
FA = lambda px, py, t=0.0: Plane.vertical(59, 470, 747, 10.22)  # noqa: E731


def PLc(t):
    base = Plane.vertical(59, 470, 747, 10.22)
    return Plane(base.n, base.q + t)


# poteaux et rails (lus en pixels)
vsolid('STRUCT_Post_Left', [(466, 266), (478, 267), (478, 748), (466, 747)], PLc(0.0), 0.12, M['MetalBlueDark'], B)
vsolid('STRUCT_Post_Right', [(1128, 326), (1143, 328), (1143, 700), (1128, 698)], PLc(0.0), 0.12, M['MetalBlueDark'], B)
vsolid('STRUCT_TopRail_Back', [(466, 264), (1142, 322), (1142, 338), (466, 280)], PLc(0.0), 0.12, M['MetalGrey'], B, 0.01)
vsolid('STRUCT_TopRail_Front', [(616, 254), (1058, 310), (1058, 326), (616, 270)], PLc(-0.8), 0.12, M['MetalGrey'], B, 0.01)
vsolid('STRUCT_Hanger_A', [(612, 150), (621, 150), (621, 600), (612, 600)], PLc(-0.8), 0.09, M['MetalBlueDark'], B)
vsolid('STRUCT_Hanger_B', [(953, 238), (962, 238), (962, 524), (953, 524)], PLc(-0.8), 0.09, M['MetalBlueDark'], B)
vsolid('STRUCT_Hanger_C', [(1051, 240), (1059, 240), (1059, 318), (1051, 318)], PLc(-0.8), 0.09, M['MetalBlueDark'], B)
for k, (x, y) in enumerate([(616, 265), (726, 276), (960, 303), (1058, 318)]):
    vsolid(f'STRUCT_Joint_{k + 1}', [(x - 11, y - 17), (x + 11, y - 15), (x + 11, y + 16), (x - 11, y + 14)], PLc(-0.85), 0.2, M['MetalGrey'], B, 0.01)

# plateforme bleue suspendue (dessus + chant)
hsolid('STRUCT_Platform_Blue_Top', [(552, 532), (1077, 536), (1077, 546), (746, 571), (552, 544)], 1.2, 0.0, M['BlueKlein'], B) if False else None
PLB = Plane.horizontal(1.2)
vsolid('STRUCT_Platform_Blue_Front', [(552, 544), (746, 571), (1077, 546), (1077, 557), (746, 591), (552, 556)], Plane.vertical(59, 746, 575, 11.5), 0.1, M['BlueKlein'], B)
solid('STRUCT_Platform_Blue_Top', [PLB.hit(*p) for p in [(552, 532), (1077, 536), (1077, 546), (746, 571), (552, 544)]], Vector((0, 0, -0.28)), M['BlueKlein'], B)

# feuille de mise en page (table) + pieds
PLS = Plane.horizontal(0.62)
solid('STRUCT_Layout_Sheet', [PLS.hit(*p) for p in [(534, 605), (1061, 563), (1161, 606), (634, 647)]], Vector((0, 0, -0.13)), M['CreamWarm'], B, 0.01)
vsolid('STRUCT_Layout_Leg_Left', [(722, 663), (740, 662), (740, 766), (722, 767)], Plane.vertical(59, 730, 700, 11.3), 0.1, M['MetalBlueDark'], B)
vsolid('STRUCT_Layout_Leg_Right', [(1128, 616), (1143, 614), (1143, 693), (1128, 695)], PLc(0.0), 0.1, M['MetalBlueDark'], B)
vsolid('STRUCT_Layout_Base', [(720, 764), (1146, 696), (1146, 710), (720, 780)], Plane.vertical(59, 720, 775, 11.1), 0.1, M['CreamWarm'], B)

# cartes de la feuille (étagère basse)
cards = [[(761, 675), (896, 664), (896, 725), (761, 747)], [(899, 661), (1015, 647), (1015, 708), (899, 724)], [(1016, 646), (1125, 631), (1125, 678), (1016, 702)]]
for k, pts_ in enumerate(cards):
    vsolid(f'COMP_Card_Shelf_{"ABC"[k]}', pts_, Plane.vertical(59, pts_[0][0], pts_[0][1], 11.1 + 0.4 * k), 0.25, M['CreamWarm'], CP, 0.03)

# panneaux : nav, menthe, cream, frosted principal
anim_panel = empty('ANIM_Panel_Rail', (0, 11, 2.2), '07_Animation', size=0.6)
vsolid('PANEL_Main_Frosted', [(687, 302), (1005, 334), (1005, 494), (687, 502)], PLc(-0.75), 0.07, M['FrostedGlass'], PN, 0.03).parent = anim_panel
vsolid('PANEL_Nav_Vertical', [(562, 296), (640, 302), (640, 515), (562, 512)], PLc(-0.95), 0.1, M['CreamWarm'], PN, 0.05)
vsolid('PANEL_Mint_Back_A', [(513, 305), (563, 308), (563, 487), (513, 486)], PLc(-0.7), 0.06, M['GlassMint'], PN, 0.02)
vsolid('PANEL_Cream_Back', [(471, 313), (513, 313), (513, 449), (471, 449)], PLc(-0.55), 0.06, M['CreamWarm'], PN, 0.02)

# ================================================================== bureau de droite (plan incliné)
d0 = W(1089, 517, 12.2)
d1 = W(1523, 500, 14.6)
d2 = W(1459, 571, 12.8)
desk_pl = Plane.through(d0, d1, d2)
desk_top = [desk_pl.hit(*p) for p in [(1089, 517), (1523, 500), (1526, 533), (1459, 571), (1089, 527)]]
solid('STRUCT_Desk_Right', desk_top, Vector((0, 0, -0.16)), M['CreamWarm'], B, 0.02)
vsolid('STRUCT_Desk_Support', [(1254, 576), (1254, 690), (1362, 690), (1362, 575)], Plane.vertical(-80, 1254, 690, 14.8), 0.4, M['CreamWarm'], B)
vsolid('STRUCT_Control_Box', [(1008, 446), (1108, 441), (1108, 516), (1008, 520)], Plane.vertical(59, 1008, 520, 12.4), 0.3, M['CreamWarm'], B)

# ================================================================== lumières, monde, caméra
world = bpy.data.worlds.new('World')
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes['Background']
bg.inputs['Color'].default_value = lin('#f6e8d2')
bg.inputs['Strength'].default_value = 0.35


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


light('LIGHT_Sun_Key', 'SUN', (0, 0, 30), (55, 0, 60), 2.4, '#ffd0a0', angle=math.radians(3))
light('LIGHT_Fill_Front', 'AREA', (0, -2, 6), (80, 0, 0), 160, '#fff1de', shape='RECTANGLE', size=14, size_y=8)

cd = bpy.data.cameras.new('CAM_Hero_Desktop')
cd.lens = RC.LENS_MM
cd.sensor_width = 36
cd.sensor_fit = 'HORIZONTAL'
cd.shift_y = RC.SHIFT_Y
cam = bpy.data.objects.new('CAM_Hero_Desktop', cd)
scene.collection.objects.link(cam)
put(cam, '06_Cameras')
cam.location = RC.C
cam.rotation_euler = (math.pi / 2, 0, 0)
scene.camera = cam

scene.render.engine = 'CYCLES'
cy = scene.cycles
cy.samples = 64
cy.use_denoising = True
cy.denoiser = 'OPENIMAGEDENOISE'
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
scene.render.resolution_x, scene.render.resolution_y = RC.W, RC.H
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.view_settings.view_transform = 'Standard'
scene.render.film_transparent = False

bpy.ops.wm.save_as_mainfile(filepath=BLEND)
print('SAVED', BLEND, 'objets :', len(bpy.data.objects))
