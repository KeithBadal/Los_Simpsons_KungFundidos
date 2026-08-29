# Documentación del proyecto

Esta es una guía rápida de cómo está armada la aplicación, pensada para que
cualquiera del equipo pueda entenderla y modificarla sin tener que leer todo
el código de cero.

## ¿Qué es esto?

Una página web (sin frameworks, JS puro con módulos ES) que consume la API
pública [thesimpsonsapi.com](https://thesimpsonsapi.com/) para mostrar
personajes, episodios y ubicaciones de Los Simpson, con búsqueda, filtros,
favoritos y paginación. No hay backend propio ni build step: se abre
`index.html` con un servidor estático y ya funciona.

## Estructura de archivos

```
index.html          Estructura de la página (nav, secciones, modal)
css/styles.css       Todos los estilos
js/
  main.js            El "director de orquesta": conecta clicks con datos y render
  constantes.js       URLs de la API y nombres de las secciones
  api.js              fetch genérico con manejo de errores
  data.js             Descarga y cachea en localStorage TODOS los datos de una sección
  filters.js          Funciones que filtran arrays de datos (sin tocar el DOM)
  render.js           Todo lo que construye HTML y lo mete al DOM
  favorites.js         Guardar/quitar favoritos en localStorage
  helpers.js           Mostrar/ocultar secciones, marcar el link activo del nav
  starage.js           Wrapper simple de localStorage (getJsonItem / setJsonItem)
```

## Flujo general

1. `index.html` carga `js/main.js` como módulo.
2. Al cargar la página, `main.js` engancha los clicks del menú (`setupPages`)
   y muestra la sección Home.
3. Cuando el usuario da clic en Characters / Episodes / Locations, `main.js`
   llama a `loadSection(seccion)`, que:
   - oculta las demás secciones (`helpers.hideSections`)
   - pide los datos de esa sección (`data.getAllData`)
   - dibuja la barra de filtros (`render.renderXFilters`)
   - dibuja la primera página de resultados (`render.renderAllX`)
   - dibuja el paginador (`render.renderPagination`)
4. Cada vez que el usuario cambia un filtro, escribe una búsqueda o cambia
   de página, `main.js` vuelve a filtrar el array completo (ya descargado)
   y a dibujar solo esa "rebanada" de resultados. No se vuelve a llamar a la
   API para eso.

`render.js` nunca decide QUÉ mostrar (eso lo decide `main.js` con los
filtros), solo sabe CÓMO convertir datos en HTML.

## Cómo funciona la descarga y el caché (lo importante)

Antes, cada clic de paginación pedía una página nueva a la API. Ahora, para
poder buscar/filtrar entre TODOS los personajes/episodios/ubicaciones (no
solo los 20 que trae una página), la primera vez que entras a una sección se
descargan **todas** sus páginas de una sola vez y se guardan completas.

Esto pasa en `js/data.js`, función `getAllData(seccion)`:

1. Revisa si ya existe en `localStorage` (usando `starage.js`). Si existe,
   regresa esos datos al instante, **sin pedir nada a la API**.
2. Si no existe, pide la página 1 para saber cuántas páginas hay en total
   (`pages` que devuelve la API), y luego pide el resto de páginas **en
   paralelo** con `Promise.all`.
3. Junta todos los resultados en un solo array y lo guarda en `localStorage`
   con `setJsonItem`.

A partir de ahí, `main.js` guarda ese array completo en memoria
(`sectionData[seccion]`) y todo lo demás (buscar, filtrar, cambiar de
página) es solo cortar ese array con `.filter()` y `.slice()` — instantáneo,
sin red.

Por eso en el paginador los números de página tienen un **borde verde**:
indica que esa sección ya está completa en memoria/localStorage y que
moverte de página no va a generar tráfico de red.

> Nota: como se descarga todo de golpe, no hay un estado intermedio donde
> "algunas páginas sí y otras no" — o está toda la sección cacheada, o
> todavía se está descargando (se ve el spinner).

## Cómo funcionan los filtros

- `js/filters.js` tiene funciones puras: reciben el array completo de datos
  y un objeto de filtros, y regresan el array filtrado. No tocan el DOM.
- `js/render.js` tiene funciones `renderCharacterFilters`,
  `renderEpisodeFilters`, `renderLocationFilters` que dibujan los inputs y
  selects de la barra de filtros, y avisan a `main.js` cuando algo cambia
  (con una función `onChange` que le pasan).
- `js/main.js` guarda el estado actual de los filtros de cada sección
  (objeto `filters`) y, cuando `onChange` avisa un cambio, vuelve a filtrar
  y a dibujar la página 1 de resultados.

Los inputs de texto (buscar por nombre, ocupación, etc.) no filtran al
teclear cada letra: solo se aplican al hacer clic en "Search" o al
presionar Enter, para que no esté recargando la lista en cada tecla.

## Cómo añadir una sección nueva

Como ejemplo, digamos que quieres agregar "Quotes" (frases). Los pasos son
siempre los mismos que se siguieron para Characters/Episodes/Locations:

1. **`js/constantes.js`**: agrega la URL de la API y el nombre de la
   sección.
   ```js
   const URL_API_QUOTES = `${URL_API_BASE}quotes`;
   const QUOTE_SECTION = "quotes";
   ```
   y expórtalos.

2. **`index.html`**: agrega el link en el `<nav>` y la sección con su barra
   de filtros y su grid (mismo patrón que las otras tres):
   ```html
   <li><a id="quotes" href="#">Quotes</a></li>
   ...
   <section class="quotes">
     <div class="filters" id="quotes-filters"></div>
     <div class="quotes-grid"></div>
   </section>
   ```

3. **`css/styles.css`**: copia el bloque `.characters-grid` / `.character`
   y renómbralo a `.quotes-grid` / `.quote` para darle estilo a las tarjetas.

4. **`js/data.js`**: agrega la sección a `STORAGE_KEYS` y `BASE_URLS` para
   que `getAllData` sepa descargarla y cachearla igual que las demás.

5. **`js/filters.js`** (opcional, solo si quieres filtros/búsqueda): agrega
   una función `filterQuotes(quotes, filtros)` siguiendo el mismo patrón
   que `filterCharacters`.

6. **`js/render.js`**: agrega
   - `renderAllQuotes(quotes)` que construye las tarjetas (copia
     `renderAllCharacters` como base).
   - `renderQuoteFilters(quotes, filters, onChange, onClear)` si vas a
     tener barra de filtros (copia `renderEpisodeFilters` como base).

7. **`js/main.js`**: aquí es donde se conecta todo:
   - importa las nuevas funciones de `render.js` y `filters.js`
   - agrega `[QUOTE_SECTION]: []` a `sectionData`
   - agrega sus filtros por defecto a `DEFAULT_FILTERS` (si aplica)
   - agrega un `btnQuotes` y su `addEventListener('click', ...)` en
     `setupPages()`, igual que `btnCharacter`
   - agrega la sección en los `if/else` de `renderSectionFilters`,
     `getFilteredData` y `renderSectionPage`

Con eso, la nueva sección ya descarga, cachea, filtra y pagina exactamente
igual que las demás.
