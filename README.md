# 🐾 Defensoras de las Tablas

Un juego tipo *tower defense* para aprender las tablas de multiplicar (del 2 al 10), con temática de animales.

**Juega aquí:** https://juanmezardz.github.io/test/

El juego principal vive en `index.html`; lo acompañan `sw.js`, `manifest.webmanifest` y los íconos (`icon-192.png`, `icon-512.png`) que lo convierten en una app instalable (PWA).

## Cómo se juega

Es un *tower defense*: animalitos traviesos avanzan por el camino hacia el huerto 🏡 y tú decides cómo defenderlo.

1. **Prepara tu defensa.** Antes de cada nivel, toca los círculos ➕ del mapa para colocar a tus defensores (3 por nivel al principio, hasta 5 en los mundos avanzados). Tocar un defensor lo quita. La formación se guarda para cuando repitas el nivel.
2. **Carga energía contestando.** Abajo aparece una multiplicación: cada respuesta correcta da **1⚡**, y **2⚡ si contestas en menos de 3 segundos**. Tras 2 fallos se muestra la respuesta como pista.
3. **Tus defensores disparan solos** al animalito más adelantado dentro de su alcance, y cada disparo gasta 1⚡. Sin energía no pueden disparar, así que ¡hay que seguir contestando!
4. Cada nivel tiene **3 oleadas**, cada una un poco más difícil. Al superar una oleada hay una pausa corta y recuperas una lechuga.
5. Si un animalito llega al huerto, pierdes una lechuga 🥬. Tienes 5; si las pierdes todas, se acaba el nivel.

### Defensores

| | Defensor | Poder |
|---|---|---|
| 🐶 | Toby | Lanza fruta, sencillo y fiel (gratis) |
| 🐱 | Michi | Golpea a 2 animalitos con un solo disparo |
| 🦉 | Sabia | Alcanza muy, muy lejos |
| 🐨 | Kimi | Congela: los hace ir más lento |
| 🦄 | Estrella | Arcoíris: golpea a todo el grupo |
| 🐲 | Chispa | Fuego: doble daño |

Se compran en la tienda, y cada uno se puede **mejorar dos veces** con monedas: primero más alcance, luego más daño.

### Animalitos

- **Normales**: un golpe.
- 💨 **Rápidos**: corren el doble.
- 🛡️ **Acorazados**: muy lentos, pero aguantan 3 golpes.
- ✂️ **Divisores**: llevan un número (por ejemplo 12) y al vencerlos se parten en dos pedacitos con sus factores (3×4 y 2×6).
- 👑 **Jefes**: al perder la mitad de su vida se enfurecen, se apuran y llaman refuerzos.

## Mundos y progresión

- Cada mundo es una tabla: La Pradera 🐰 (tabla del 2), El Bosque 🦊 (del 3)… hasta La Granja 🐷 (del 10) y **El Gran Reto** 🐉 con todas mezcladas.
- Cada mundo tiene 2 niveles + un **jefe** 👑. Los mundos avanzados traen animalitos más rápidos y más numerosos.
- Se ganan hasta 3 estrellas por nivel según las lechugas que conserves (5-4 → ⭐⭐⭐, 3-2 → ⭐⭐, 1 → ⭐). Vencer al jefe desbloquea el siguiente mundo.

## Tienda, logros y app instalable

- **🛒 Tienda:** las monedas ganadas se gastan en defensores nuevos (🐱🦉🐨🦄🐲) y sus mejoras, sets de comida para lanzar (dulces, fiesta, magia) y mascotas de compañía.
- **🏅 Logros:** 10 insignias coleccionables (primera victoria, 5 respuestas rápidas en un nivel, nivel perfecto, vencer 3 jefes, dominar una tabla completa…). Se anuncian al terminar el nivel y se ven en la pantalla de Logros.
- **📱 App instalable (PWA):** al abrir el juego desde el link, el navegador ofrece "Agregar a pantalla de inicio" (en Android/Chrome sale solo; en iPhone/iPad: botón compartir → "Agregar a pantalla de inicio"). Queda con su propio ícono y **funciona sin internet** gracias al service worker.

## Perfiles

- Cada niña (¡y sus amigas!) crea su propio perfil con nombre y avatar de animalito.
- El progreso, las monedas y las estrellas se guardan por perfil en el navegador (`localStorage`).
- **Repetición espaciada:** el juego detecta qué multiplicaciones falla cada perfil y las hace aparecer más seguido.
- **Para papás:** el botón **📊 Progreso** muestra un mapa de calor de todas las multiplicaciones — verde = dominada, amarillo = casi, rojo = a practicar.

## Cómo compartirlo con las amigas

Opción 1 — **GitHub Pages** (recomendada, queda un link para siempre):
1. En GitHub, ve a **Settings → Pages** de este repositorio.
2. En *Source*, elige la rama y la carpeta `/ (root)`, y guarda.
3. En unos minutos tendrás un link tipo `https://<usuario>.github.io/test/` para mandar por WhatsApp.

Opción 2 — **Mandar el archivo**: envía `index.html` tal cual (por correo o WhatsApp); se abre con doble clic en cualquier navegador, sin instalar nada.

> Nota: el progreso se guarda en el navegador de cada dispositivo, así que cada amiga tendrá sus propios perfiles en su tablet/compu.

## Desarrollo

No hay dependencias ni build: es HTML + CSS + JavaScript puro. Para probar localmente basta con abrir `index.html` en el navegador.
