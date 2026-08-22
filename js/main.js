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
  renderAllLocations,
  renderPagination
} from './render.js';

let currentSection = CHARACTER_SECTION;

document.addEventListener('DOMContentLoaded', async () => {
  pages();
  await loadSection(CHARACTER_SECTION, 1);
});

function pages() {
  const btnCharacter = document.getElementById('characters');
  const btnEpisode = document.getElementById('episodes');
  const btnLocation = document.getElementById('locations');

  btnCharacter?.addEventListener('click', async (e) => {
    e.preventDefault();
    await loadSection(CHARACTER_SECTION, 1);
  });

  btnEpisode?.addEventListener('click', async (e) => {
    e.preventDefault();
    await loadSection(EPISODE_SECTION, 1);
  });

  btnLocation?.addEventListener('click', async (e) => {
    e.preventDefault();
    await loadSection(LOCATION_SECTION, 1);
  });
}

async function loadSection(section, page = 1) {
  currentSection = section;

  let baseUrl;

  if (section === CHARACTER_SECTION) {
    baseUrl = URL_API_CHARACTERS;
  } else if (section === EPISODE_SECTION) {
    baseUrl = URL_API_EPISODES;
  } else if (section === LOCATION_SECTION) {
    baseUrl = URL_API_LOCATIONS;
  }

  if (!baseUrl) {
    console.error(`Sección desconocida: ${section}`);
    return;
  }

  hideSections();

  const selectedSection = document.querySelector(`.${section}`);

  if (selectedSection) {
    selectedSection.style.display = 'grid';
  }

  const url = `${baseUrl}?page=${page}`;
  const data = await fetchData(url);

  if (!data) {
    console.error(`No se pudieron cargar los datos de ${section}`);
    return;
  }

  const elements = data.results || data;

  if (section === CHARACTER_SECTION) {
    renderAllCharacters(elements);
  } else if (section === EPISODE_SECTION) {
    renderAllEpisodes(elements);
  } else if (section === LOCATION_SECTION) {
    renderAllLocations(elements);
  }

  const totalPages = data.pages || 1;
  renderPagination(totalPages, page, (newPage) => {
    loadSection(currentSection, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
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
