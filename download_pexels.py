#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Dental Image Fetcher - Script para descargar imágenes dentales reales de Pexels API
Sigue las instrucciones del Dental Image Fetcher Skill
"""

import urllib.request
import urllib.parse
import json
import os
import time
import sys

# Configurar salida UTF-8
sys.stdout.reconfigure(encoding='utf-8')

# API Key de Pexels (proporcionada por el usuario)
PEXELS_API_KEY = "j8h7BRtP0WS3w6h5W2RBiI8vTqIWEuB6oUiGzmF6valPumOBxkAHDfdF"

# Directorio de salida
ASSET_DIR = r"C:\ai-agency\projects\agencia-web\demo\dental-cordoba\assets"

def search_pexels(query, per_page=10):
    """Busca imágenes en Pexels API"""
    headers = {
        'Authorization': PEXELS_API_KEY,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    params = urllib.parse.urlencode({
        'query': query,
        'per_page': per_page,
        'orientation': 'landscape'
    })
    
    url = f"https://api.pexels.com/v1/search?{params}"
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as response:
            data = json.loads(response.read().decode('utf-8'))
            return data.get('photos', [])
    except Exception as e:
        print(f"[X] Error buscando '{query}': {e}")
        return []

def download_image(url, filepath):
    """Descarga una imagen desde URL"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.pexels.com/'
    }
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as response:
            data = response.read()
            if len(data) > 1000:
                with open(filepath, 'wb') as f:
                    f.write(data)
                return True
            else:
                print(f"    ⚠️ Archivo muy pequeño ({len(data)} bytes)")
                return False
    except Exception as e:
        print(f"    [X] Error descargando: {e}")
        return False

def main():
    # Crear directorio si no existe
    os.makedirs(ASSET_DIR, exist_ok=True)
    
    print("=" * 60)
    print("DENTAL IMAGE FETCHER - Pexels API")
    print("=" * 60)
    print()
    
    # Definir búsquedas por sección (según Dental Image Fetcher Skill)
    searches = [
        # HERO: Dentista con paciente sonriendo
        {
            'filename': 'hero-patient.jpg',
            'query': 'dentist patient smiling',
            'desc': 'HERO - Dentista con paciente sonriendo'
        },
        # ABOUT: Interiores de clínicas dentales modernas
        {
            'filename': 'clinic-interior.jpg',
            'query': 'modern dental clinic interior',
            'desc': 'ABOUT - Interior clínica moderna'
        },
        # SERVICES: Implantes (dentista trabajando)
        {
            'filename': 'service-implants.jpg',
            'query': 'dental implant procedure',
            'desc': 'SERVICE - Implantes (dentista trabajando)'
        },
        # SERVICES: Estética (sonrisas blancas)
        {
            'filename': 'service-esthetic.jpg',
            'query': 'teeth whitening smile',
            'desc': 'SERVICE - Estética (sonrisa blanca)'
        },
        # SERVICES: Rehabilitación (consulta)
        {
            'filename': 'service-rehab.jpg',
            'query': 'dentist consultation patient',
            'desc': 'SERVICE - Rehabilitación (consulta)'
        },
        # BEFORE/AFTER: Antes del tratamiento
        {
            'filename': 'case-before.jpg',
            'query': 'before dental treatment',
            'desc': 'BEFORE - Antes del tratamiento'
        },
        # BEFORE/AFTER: Después del tratamiento
        {
            'filename': 'case-after.jpg',
            'query': 'after dental treatment smile',
            'desc': 'AFTER - Después del tratamiento'
        },
        # TESTIMONIOS: Personas reales sonriendo
        {
            'filename': 'testimonial-1.jpg',
            'query': 'happy patient portrait',
            'desc': 'TESTIMONIO 1 - Paciente feliz'
        },
        {
            'filename': 'testimonial-2.jpg',
            'query': 'smiling woman dental',
            'desc': 'TESTIMONIO 2 - Mujer sonriendo'
        },
        {
            'filename': 'testimonial-3.jpg',
            'query': 'smiling man dental',
            'desc': 'TESTIMONIO 3 - Hombre sonriendo'
        }
    ]
    
    downloaded = 0
    total = len(searches)
    
    for i, search in enumerate(searches, 1):
        filename = search['filename']
        query = search['query']
        desc = search['desc']
        
        print(f"\n🔍 [{i}/{total}] Buscando: {desc}")
        print(f"   Query: '{query}'")
        
        # Buscar en Pexels
        photos = search_pexels(query, per_page=5)
        
        if not photos:
            print(f"   [X] No se encontraron imágenes")
            continue
        
        # Tomar la primera foto de buena calidad
        photo = photos[0]
        src = photo.get('src', {})
        
        # URL de tamaño mediano (800px aprox para escritorio)
        url = src.get('large', src.get('medium', ''))
        
        if not url:
            print(f"   [X] No hay URL de imagen")
            continue
        
        # Descargar JPG
        filepath = os.path.join(ASSET_DIR, filename)
        print(f"   Descargando {filename}...", end="")
        
        if download_image(url, filepath):
            print(" OK ✓")
            downloaded += 1
        else:
            print(" FALLÓ ✗")
        
        # Rate limit: Pexels permite 200 requests/hora (plan gratuito)
        time.sleep(0.5)
    
    print()
    print("=" * 60)
    print(f"RESULTADO: {downloaded}/{total} imágenes descargadas")
    print("=" * 60)
    
    # Listar archivos descargados
    if downloaded > 0:
        print(f"\nArchivos en {ASSET_DIR}:")
        for f in sorted(os.listdir(ASSET_DIR)):
            if f.endswith(('.jpg', '.jpeg', '.png', '.webp')):
                fpath = os.path.join(ASSET_DIR, f)
                size = os.path.getsize(fpath)
                print(f"  ✓ {f} ({size/1024:.1f} KB)")

if __name__ == '__main__':
    main()
