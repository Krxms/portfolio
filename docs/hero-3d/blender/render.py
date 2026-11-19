"""Rend une caméra de atelier-numerique.blend.

    blender.exe -b atelier-numerique.blend --python render.py -- <desktop|mobile> <sortie.png> [largeur hauteur] [échantillons]
"""
import sys

import bpy

args = sys.argv[sys.argv.index('--') + 1:]
view, out = args[0], args[1]
w, h = (int(args[2]), int(args[3])) if len(args) >= 4 else ((1600, 1200) if view == 'desktop' else (1200, 1200))
samples = int(args[4]) if len(args) >= 5 else 96

sc = bpy.context.scene
sc.camera = bpy.data.objects['CAM_Hero_Desktop' if view == 'desktop' else 'CAM_Hero_Mobile']
sc.render.resolution_x, sc.render.resolution_y = w, h
sc.render.resolution_percentage = 100
sc.cycles.samples = samples
sc.render.filepath = out
bpy.ops.render.render(write_still=True)
print('RENDERED', out)
