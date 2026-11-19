"""Caméra de référence et rétro-projection image -> monde (sans bpy : utilisable partout).

Calibration (voir README) : image de référence 1672 x 941 px.
  - horizon à y = 510 px (point de fuite gauche vers x = -540, droit vers x = 2311) ;
  - focale 1425 px (soit 30,7 mm sur un capteur de 36 mm de large) ;
  - caméra de niveau, décalée (shift) pour que l'horizon soit à y = 510 : les verticales restent verticales ;
  - hauteur d'œil 1,7 m au-dessus du dessus de la dalle (Z = 0).
Repère monde : X droite, Y profondeur (axe optique), Z haut. Axes de la scène : aR (vers le point de fuite droit),
aL (vers le point de fuite gauche), à environ 45 degrés de l'axe optique.
"""
import math

W, H = 1672, 941
F = 1425.0
CX = 836.0
HY = 510.0
HC = 1.7
C = (0.0, 0.0, HC)
LENS_MM = F * 36.0 / W
SHIFT_Y = (HY - H / 2) / W   # le décalage (en fraction de la largeur) qui place l'horizon à HY

_aR = (math.sin(math.radians(46)), math.cos(math.radians(46)), 0.0)
_aL = (-math.sin(math.radians(44)), math.cos(math.radians(44)), 0.0)
AR = _aR
AL = _aL


def ray(px, py):
    return ((px - CX) / F, 1.0, (HY - py) / F)


def at_y(px, py, y):
    d = ray(px, py)
    return (d[0] * y, y, HC + d[2] * y)


def floor(px, py, z=0.0):
    """Point du plan horizontal Z = z vu en (px, py)."""
    d = ray(px, py)
    t = (z - HC) / d[2]
    return (d[0] * t, t, z)


def _dot(a, b):
    return sum(x * y for x, y in zip(a, b))


def plane(px, py, n, q):
    """Intersection du rayon (px, py) avec le plan n . P = q."""
    d = ray(px, py)
    t = (q - _dot(n, C)) / _dot(n, d)
    return (d[0] * t, d[1] * t, HC + d[2] * t)


def q_of(axis, px, py, z=0.0):
    """Décalage q d'un plan vertical (axis 'R' : contient aR, normale aL ; 'L' : contient aL, normale aR) passant par le point du sol vu en (px, py)."""
    n = AL if axis == 'R' else AR
    return _dot(n, floor(px, py, z))


def normal(axis):
    return AL if axis == 'R' else AR


def project(p):
    """Monde -> pixel de l'image de référence."""
    x, y, z = p
    return (CX + F * x / y, HY - F * (z - HC) / y)
