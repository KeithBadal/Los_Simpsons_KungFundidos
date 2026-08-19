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

function pages() {
  const btnCharacter = document.getElementById('characters');
  const btnEpisode = document.getElementById('episodes');
  const btnLocation = document.getElementById('locations');

  btnCharacter?.addEventListener('click', async (e) => {
    e.preventDefault();
    await loadSection(CHARACTER_SECTION);
  });

  btnEpisode?.addEventListener('click', async (e) => {
    e.preventDefault();
    await loadSection(EPISODE_SECTION);
  });

  btnLocation?.addEventListener('click', async (e) => {
    e.preventDefault();
    await loadSection(LOCATION_SECTION);
  });
}

async function loadSection(section) {
  let url;

  if (section === CHARACTER_SECTION) {
    url = URL_API_CHARACTERS;
  }

  if (section === EPISODE_SECTION) {
    url = URL_API_EPISODES;
  }

  if (section === LOCATION_SECTION) {
    url = URL_API_LOCATIONS;
  }

  if (!url) {
    console.error(`Sección desconocida: ${section}`);
    return;
  }

  hideSections();

  const selectedSection = document.querySelector(`.${section}`);

  if (selectedSection) {
    selectedSection.style.display = 'grid';
  }

  const data = await fetchData(url);

  if (!data) {
    console.error(`No se pudieron cargar los datos de ${section}`);
    return;
  }

  const elements = data.results || data;

  if (section === CHARACTER_SECTION) {
    renderAllCharacters(elements);
  }

  if (section === EPISODE_SECTION) {
    renderAllEpisodes(elements);
  }

  if (section === LOCATION_SECTION) {
    renderAllLocations(elements);
  }
}

function hideSections() {
  const sections = [
    document.querySelector('.characters'),
    document.querySelector('.episodes'),
    document.querySelector('.locations')
  ];

  sections.forEach(section => {
    if (section) {
      section.style.display = 'none';
    }
  });
}
