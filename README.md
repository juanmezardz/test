# 🐾 Defensoras de las Tablas

Un juego tipo *tower defense* para aprender las tablas de multiplicar (del 2 al 10), con temática de animales. Todo el juego vive en un solo archivo: `index.html`.

## Cómo se juega

- Animalitos traviesos avanzan por el camino hacia el huerto 🏡, cada uno con una multiplicación sobre la cabeza.
- El animalito **al frente** (burbuja amarilla) es el objetivo: escribe la respuesta con el teclado numérico y pulsa **✔ ¡Lanzar!**.
- Respuesta correcta → el perrito guardián 🐶 le lanza una fruta y el animalito se va feliz 💖.
- Respuesta **rápida** (menos de 3 segundos) → ¡bono de monedas ×2! ✨
- Respuesta incorrecta → el animalito se apura un poquito. Tras 2 fallos, se muestra la respuesta como pista.
- Si un animalito llega al huerto, pierdes una lechuga 🥬. Con 3 lechugas perdidas, se acaba el nivel.

## Mundos y progresión

- Cada mundo es una tabla: La Pradera 🐰 (tabla del 2), El Bosque 🦊 (del 3)… hasta La Granja 🐷 (del 10) y **El Gran Reto** 🐉 con todas mezcladas.
- Cada mundo tiene 2 niveles + un **jefe** 👑 (hay que responder 5 multiplicaciones para vencerlo).
- Se ganan hasta 3 estrellas por nivel según las lechugas que conserves. Vencer al jefe desbloquea el siguiente mundo.

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
