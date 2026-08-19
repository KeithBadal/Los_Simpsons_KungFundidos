import fetchData from './api.js';

import {
  URL_API_CHARACTERS,
  URL_API_EPISODES,
  URL_API_LOCATIONS,
  CHARACTER_SECTION,
  EPISODE_SECTION,
  LOCATION_SECTION
} from './constantes.js';

import {
  renderAllCharacters,
  renderAllEpisodes,
  renderAllLocations
} from './render.js';

document.addEventListener('DOMContentLoaded', async () => {
  pages();

  await loadSection(CHARACTER_SECTION);
});

 
