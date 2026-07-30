# 🎈 Word Party — juego para aprender inglés

Un juego de vocabulario inglés-español pensado para niñas y niños, en **un solo
archivo HTML**. No necesita instalar nada, no necesita internet y no envía datos
a ningún sitio: todo el progreso se guarda en el propio dispositivo.

## Cómo jugar

Abre `index.html` con doble clic. Eso es todo.

Para jugarlo en la tablet o el móvil tienes dos opciones:

- **Copiar el archivo** al dispositivo (por AirDrop, correo, Drive…) y abrirlo
  con el navegador.
- **Servirlo desde el ordenador** y entrar desde el móvil por wifi:

  ```bash
  cd juego-ingles
  python3 -m http.server 8000
  # en el móvil: http://IP-DEL-ORDENADOR:8000
  ```

En iPhone/iPad y Android puedes usar «Añadir a pantalla de inicio» para que
quede como una app más.

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

- El progreso vive en `localStorage`. Si se borran los datos del navegador,
  se pierde; no hay cuentas ni servidor.
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
