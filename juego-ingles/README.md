# 🎈 Word Party — juego para aprender inglés

Un juego de vocabulario inglés-español pensado para niñas y niños. Es una **PWA**
(aplicación web instalable): se añade a la pantalla de inicio del móvil o el
iPad, se abre a pantalla completa como una app normal y funciona **sin
internet**. No envía datos a ningún sitio: todo el progreso se guarda en el
propio dispositivo.

## Instalarla en el móvil o el iPad

El juego tiene que estar servido por **https** (o `localhost`) para poder
instalarse; abriendo el archivo con doble clic funciona el juego, pero no la
instalación.

Una vez abierto desde su dirección web, el propio juego enseña un banner
**«Instalar el juego»**:

- **Android / Chrome / Edge:** toca *Instalar* y se añade sola.
- **iPhone / iPad (Safari):** toca *Instalar* y sigue los dos pasos que
  aparecen — botón **Compartir** → **Añadir a pantalla de inicio**.

Después de instalarla puedes cerrar el navegador: el icono queda en la pantalla
de inicio y el juego abre incluso en modo avión.

### Probarla en local

```bash
cd juego-ingles
python3 -m http.server 8000
# en el ordenador: http://localhost:8000  (aquí sí se puede instalar)
# desde el móvil por wifi: http://IP-DEL-ORDENADOR:8000  (se juega, pero
#   sin https el navegador no ofrece instalarla)
```

### Qué hace que sea instalable

| Archivo | Para qué sirve |
|---|---|
| `manifest.webmanifest` | Nombre, iconos, color y modo pantalla completa |
| `sw.js` | Service worker: guarda el juego para jugar sin conexión |
| `icons/` | Iconos de la app (normales, *maskable* de Android y el de iOS) |

El service worker guarda el juego entero en la primera visita. Al publicar una
versión nueva conviene subir el número de `VERSION` en `sw.js` para que los
dispositivos recojan el cambio.

## Qué incluye

**Cuatro formas de jugar**, para cubrir habilidades distintas:

| Juego | Qué entrena | Para quién |
|---|---|---|
| 👀 Mira y elige | Reconocer la palabra escrita | ya lee un poco |
| 👂 Escucha | Comprensión oral y pronunciación | también pre-lectoras |
| 🔁 Traduce | Pasar del español al inglés | nivel medio |
| 🔤 Escribe | Ortografía, ordenando letras | nivel más alto |

**154 palabras** repartidas en 12 temas: animales, colores, números, comida,
familia, cuerpo, ropa, casa, cole, naturaleza, acciones y emociones. También hay
un tema «Todo» que las mezcla.

**Un perfil por hija** (hasta 4). Cada una tiene su nombre, su personaje, sus
estrellas y su propio progreso, así que pueden jugar en el mismo dispositivo sin
pisarse.

**Repaso espaciado sencillo.** El juego lleva la cuenta de qué palabras acierta
cada jugadora y las que fallan salen más veces hasta que se dominan. Una palabra
se considera dominada tras 3 aciertos, y las barritas de cada tema muestran
cuánto llevan.

**Pronunciación en voz alta.** Usa la voz de inglés del propio sistema
(`speechSynthesis`), así que la palabra se oye cada vez que se responde y se
puede repetir con el botón 🔊.

**Refuerzo positivo.** Estrellas por acierto, bonus por racha, medallas por
hitos y confeti al terminar bien. Cuando se falla no se pierde nada: se enseña
la respuesta correcta con su traducción y se apunta en «Para repasar».

## Notas para quien lo instala

- El progreso vive en `localStorage`, **por dispositivo**. Si cada hija juega en
  un aparato distinto, cada uno lleva sus propias estrellas; no hay cuentas ni
  servidor que las sincronice.
- El banner de instalar se puede cerrar con la ✕ y no vuelve a salir en ese
  dispositivo (se recuerda en `localStorage`); nunca aparece durante una
  partida.
- La voz depende del sistema operativo. Si no hay ninguna voz inglesa
  instalada, el juego sigue funcionando pero sin audio (en Windows se añade en
  *Configuración → Hora e idioma → Voz*).
- El botón 🔇 de la barra superior silencia efectos y voz.
- Funciona en Chrome, Safari, Firefox y Edge, en escritorio y en móvil, en tema
  claro y oscuro.

## Añadir vocabulario

Todo el vocabulario está en la constante `CATEGORIES`, al principio del
`<script>` de `index.html`. Añadir una palabra es meter una línea en el tema que
toque:

```js
{ en: 'window', es: 'ventana', emoji: '🪟' }
```

Y añadir un tema nuevo es añadir un bloque:

```js
{ id: 'toys', name: 'Juguetes', icon: '🧸', words: [
  { en: 'ball',  es: 'pelota', emoji: '⚽' },
  { en: 'doll',  es: 'muñeca', emoji: '🪆' },
  { en: 'teddy', es: 'osito',  emoji: '🧸' }
]}
```

Dos reglas al elegir emojis:

1. **No repitas un emoji** entre palabras distintas. En el modo «Escucha» las
   respuestas se distinguen por el dibujo, así que dos palabras con el mismo
   emoji darían dos respuestas válidas.
2. Que el dibujo se entienda **sin leer**, porque para las más pequeñas es la
   única pista.

El modo «Escribe» solo usa palabras de 7 letras o menos y sin espacios; las más
largas aparecen en los otros tres modos automáticamente.

## Ideas para más adelante

- Frases cortas además de palabras sueltas (*the cat is black*).
- Modo dos jugadoras por turnos, para que compitan entre ellas.
- Reconocimiento de voz para practicar la pronunciación (`SpeechRecognition`).
- Que un adulto pueda meter su propia lista de palabras (la del cole, por
  ejemplo) sin tocar código.
