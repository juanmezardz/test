# DietaPlan · Contador de Calorías (PWA)

Aplicación web instalable (PWA) para contar calorías y planificar tu dieta, inspirada en las apps móviles de seguimiento nutricional. Funciona 100 % en el navegador, sin servidor ni cuentas: todos los datos se guardan en tu dispositivo y la app funciona sin conexión.

## Funciones

- **Onboarding personalizado**: sexo, edad, altura, peso, actividad y objetivo (perder / mantener / ganar). Calcula tus calorías diarias con la fórmula Mifflin-St Jeor y reparte macros (proteínas, carbohidratos y grasas).
- **Diario de comidas**: desayuno, almuerzo, cena y snacks, con navegación por días.
- **Base de datos de alimentos** en español (más de 100 alimentos con calorías y macros por 100 g y porciones habituales), búsqueda instantánea, alimentos recientes y creación de alimentos propios.
- **Anillo de calorías** con restantes/consumidas y barras de progreso de macros.
- **Registro de agua** por vasos, con meta calculada según tu peso.
- **Progreso**: gráfica de evolución del peso, calorías de los últimos 7 días frente a tu objetivo, cambio de peso, media semanal y racha de días.
- **Perfil**: recalcular el plan, ajustar calorías manualmente, exportar datos en JSON o borrarlos.
- **PWA completa**: manifest, service worker con caché offline, iconos maskable, modo oscuro automático y botón "Instalar en el dispositivo".

## Ejecutar en local

Es una web estática; basta cualquier servidor de archivos:

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

> El service worker requiere HTTPS o `localhost`.

## Instalar como app

1. Abre la web en Chrome/Edge (Android o escritorio) o Safari (iOS).
2. Usa el botón **📲 Instalar en el dispositivo** en la pestaña Perfil, o el menú del navegador → *Instalar app* / *Añadir a pantalla de inicio*.

## Despliegue

Sube los archivos tal cual a cualquier hosting estático (GitHub Pages, Netlify, Vercel, Cloudflare Pages…). No hay pasos de build.

## Estructura

```
index.html            Interfaz (onboarding + app)
css/styles.css        Estilos, temas claro/oscuro
js/app.js             Lógica: estado, cálculo del plan, diario, gráficas SVG, PWA
js/foods.js           Base de datos de alimentos (por 100 g)
manifest.webmanifest  Manifest de la PWA
sw.js                 Service worker (offline)
icons/                Iconos de la app
```
