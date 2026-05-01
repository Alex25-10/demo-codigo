# Dental Image Fetcher Skill

## Descripción
Herramienta para descargar imágenes dentales reales de Pexels API para sitios web de clínicas dentales.

## Cuándo usar este skill
- Cuando necesites reemplazar imágenes genéricas con fotos reales de odontología
- Para proyectos de clínicas dentales que requieran: interiores de consultorios, dentistas trabajando, pacientes sonriendo, casos antes/después
- Cuando el usuario solicite "imágenes reales del rubro dental" o "fotos de clínicas dentales"

## Requisitos
- API Key de Pexels (gratuita en https://www.pexels.com/api/)
- Python 3.x instalado

## Instrucciones de uso

### 1. Configurar API Key
Guardar la API key en el script `download_pexels.py`:
```python
PEXELS_API_KEY = "TU_API_KEY_AQUI"
```

### 2. Ejecutar descarga
```bash
cd /ruta/al/proyecto
python download_pexels.py
```

### 3. Tipos de imágenes soportadas
- **Hero**: Dentista con paciente sonriendo (contexto clínico moderno)
- **About**: Interiores de clínicas dentales modernas
- **Services**: 
  - Implantes: Dentista trabajando con paciente (primer plano)
  - Estética: Sonrisas blancas naturales
  - Rehabilitación: Consultas dentista-paciente
- **Before/After**: Casos reales (no gráficos, no desagradables)
- **Testimonios**: Personas reales sonriendo (retrato)

### 4. Formato de salida
- JPG optimizados (800px de ancho para escritorio, 400px para testimonios)
- WebP cuando está disponible
- Estructura de archivos:
  ```
  assets/
    hero-patient.jpg
    clinic-interior.jpg
    service-implants.jpg
    service-esthetic.jpg
    service-rehab.jpg
    case-before.jpg
    case-after.jpg
    testimonial-1.jpg
    testimonial-2.jpg
    testimonial-3.jpg
  ```

## Reglas obligatorias para imágenes dentales
1. NO usar imágenes genéricas ni abstractas
2. NO usar ilustraciones
3. SOLO fotos reales de clínicas dentales, dentistas y pacientes
4. Estilo moderno, limpio, profesional (clínica privada, no hospital público)
5. Iluminación clara/blanca, sensación de higiene y confianza

## Requisitos técnicos para HTML
```html
<picture>
  <source srcset="assets/imagen.webp" type="image/webp">
  <img src="assets/imagen.jpg" alt="Descripción clara" class="nombre-clase" loading="lazy" width="800" height="600">
</picture>
```

## CSS requerido
```css
.img-container {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4/3;
}

.img-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.testimonial-avatar-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}
```

## Solución de problemas
- **Error 401**: API key inválida o no configurada
- **Error 404 en WebP**: No todas las imágenes tienen versión WebP, usar solo JPG
- **Rate limit**: Pexels permite 200 requests/hora en plan gratuito, usar `time.sleep(0.5)` entre descargas

## Notas
- Las fotos deben parecer de una clínica premium en cualquier ciudad latinoamericana, no stock genérico barato
- Siempre usar `alt` descriptivo en español
- Mantener peso de imagen bajo (< 100KB preferiblemente)
