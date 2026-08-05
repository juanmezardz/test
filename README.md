# CulturaTok

Un feed vertical estilo TikTok, pero cada "vídeo" es una tarjeta de cultura: arte, historia,
música, lenguas, gastronomía, mitología, tradiciones, cine y literatura. Se desliza hacia arriba,
se puede dar like, guardar para después y responder un quiz por tarjeta.

## Arrancar

```bash
gradle bootRun
```

Y abrir http://localhost:8080

Tests:

```bash
gradle test
```

## Qué hay dentro

Backend Spring Boot con el catálogo en memoria y una web estática sin dependencias de terceros.

```
src/main/java/com/example/demo/cultura/
  Tarjeta.java             modelo de cada tarjeta del feed
  Quiz.java                pregunta, opciones y respuesta (la solución no se serializa)
  CatalogoCultural.java    las 24 tarjetas de contenido
  CulturaController.java   API REST
src/main/resources/static/ index.html + css/estilos.css + js/app.js
```

### API

| Método | Ruta | Qué hace |
| --- | --- | --- |
| `GET` | `/api/tarjetas?categoria=Arte&mezclar=true` | Feed, opcionalmente filtrado y barajado |
| `GET` | `/api/tarjetas/{id}` | Una tarjeta |
| `GET` | `/api/categorias` | Categorías disponibles |
| `POST` | `/api/tarjetas/{id}/quiz` | Corrige una respuesta: `{"opcion": 1}` |

La respuesta correcta del quiz no viaja al navegador: se comprueba en el servidor, así que no se
puede hacer trampa mirando el JSON.

### Frontend

- Scroll vertical con `scroll-snap`, una tarjeta por pantalla (también con ↑/↓ en teclado).
- Doble toque sobre la tarjeta para dar like.
- Likes, guardados, aciertos y racha se guardan en `localStorage`.
- Filtro por categoría y vista de guardados en la barra superior.
- Sin frameworks ni peticiones externas: HTML, CSS y JS a pelo.

## Añadir contenido

Cada tarjeta es una entrada más en `CatalogoCultural.construir()`. Los tests comprueban que los
identificadores no se repitan, que los campos no queden vacíos y que la respuesta del quiz apunte
a una opción existente.
