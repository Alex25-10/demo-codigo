# INSTRUCCIONES PARA IMÁGENES REALES

## Estado actual
Las imágenes están usando **Lorem Picsum** (placeholders genéricos  que no parecen fotos reales de dentistas).

## Lo que necesitás hacer:

### 1. DESCARGAR FOTOS REALES (Unsplash/Pexels)
Usá estas búsquedas en tu navegador:
- **Hero (paciente sonriendo)**: https://unsplash.com/s/photos/dental-smile
- **Clínica exterior**: https://unsplash.com/s/photos/dental-clinic
- **Antes/Después Caso 1**: https://unsplash.com/s/photos/dental-implants-before-after
- **Antes/Después Caso 2**: https://unsplash.com/s/photos/dental-treatment
- **Antes/Después Caso 3**: https://unsplash.com/s/photos/dentist-patient

### 2. GUARDAR EN `assets/`
Descargá las fotos y guardalas como:
- `hero-patient.jpg` (800x600)
- `clinic-exterior.jpg` (800x600)
- `case1-before.jpg` (400x300)
- `case1-after.jpg` (400x300)
- `case2-before.jpg` (400x300)
- `case2-after.jpg` (400x300)
- `case3-before.jpg` (400x300)
- `case3-after.jpg` (400x300)

### 3. EDITAR `index.html`
Reemplazá las URLs de Lorem Picsum por rutas locales:

```html
<!-- Hero -->
<img src="assets/hero-patient.jpg" alt="Paciente sonriendo">

<!-- Clínica -->
<img src="assets/clinic-exterior.jpg" alt="Clínica dental">

<!-- Casos -->
<img src="assets/case1-before.jpg" alt="Antes - Paciente ocultaba su sonrisa">
<img src="assets/case1-after.jpg" alt="Después - Sonrisa natural recuperada">
<img src="assets/case2-before.jpg" alt="Antes - Dificultad para comer">
<img src="assets/case2-after.jpg" alt="Después - Come sin restricciones">
<img src="assets/case3-before.jpg" alt="Antes - Miedo a la cirugía">
<img src="assets/case3-after.jpg" alt="Después - Resultado inmediato">
```

### 4. OPCIÓN RÁPIDA (si no querés descargar)
Dejá las URLs de Lorem Picsum tal como están (la demo "funciona" visualmente, aunque no parezcan fotos reales).

---

**NOTA**: Las fotos de Lorem Picsum dan error 404 en algunos casos. Si ves imágen rota, reemplazá con:
`https://picsum.photos/800/600` (o `400/300` para casos)
