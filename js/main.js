import fetchData from './api.js';

import { setActiveButton, hideSections } from './helpers.js';

import {
  URL_API_CHARACTERS,
  URL_API_EPISODES,
  URL_API_LOCATIONS,
  HOME_SECTION,
  CHARACTER_SECTION,
  EPISODE_SECTION,
  LOCATION_SECTION
} from './constantes.js';

import {
  renderHomeSection,
  renderAllCharacters,
  renderAllEpisodes,
  renderAllLocations,
  renderPagination
} from './render.js';

let currentSection = HOME_SECTION;

document.addEventListener('DOMContentLoaded', async () => {
  setupPages();
  await loadSection(HOME_SECTION);
  setActiveButton(HOME_SECTION);
});



function setupPages() {
  let btnCharacter = document.getElementById(CHARACTER_SECTION);
  let btnEpisode = document.getElementById(EPISODE_SECTION);
  let btnLocation = document.getElementById(LOCATION_SECTION);
  let btnHome = document.getElementById(HOME_SECTION);

  btnHome?.addEventListener('click', async (e) => {
    e.preventDefault();
    if (e.currentTarget.classList.contains('active')) return;
    setActiveButton(HOME_SECTION);
    await loadSection(HOME_SECTION);
  });

  document.querySelector('.home')?.addEventListener('click', async (e) => {
    const card = e.target.closest('[data-target]');

    if (card) {
      const target = card.dataset.target;

      if (target === CHARACTER_SECTION || target === EPISODE_SECTION || target === LOCATION_SECTION) {
        setActiveButton(target);
        await loadSection(target, 1);
      }

      return;
    }

    if (!e.target.closest('#random-character-btn')) return;
    await loadSection(HOME_SECTION);
  });


  btnCharacter?.addEventListener('click', async (e) => {
    e.preventDefault();
    if (e.currentTarget.classList.contains('active')) return;
    setActiveButton(CHARACTER_SECTION);
    await loadSection(CHARACTER_SECTION, 1);
  });

  btnEpisode?.addEventListener('click', async (e) => {
    e.preventDefault();
    if (e.currentTarget.classList.contains('active')) return;
    setActiveButton(EPISODE_SECTION);
    await loadSection(EPISODE_SECTION, 1);
  });

  btnLocation?.addEventListener('click', async (e) => {
    e.preventDefault();
    if (e.currentTarget.classList.contains('active')) return;
    setActiveButton(LOCATION_SECTION);
    await loadSection(LOCATION_SECTION, 1);
  });
}

async function loadSection(section, page = 1) {
  currentSection = section;

  hideSections();

  const selectedSection = document.querySelector(`.${section}`);
  if (selectedSection) selectedSection.style.display = section === HOME_SECTION ? 'flex' : 'grid';

  const paginationContainer = document.getElementById('pagination');

  if (section === HOME_SECTION) {
    if (paginationContainer) paginationContainer.innerHTML = '';

    const randomContainer = document.querySelector('.home_random');
    if (randomContainer) randomContainer.innerHTML = '<div class="spinner"></div>';

    let randon = Math.floor(Math.random() * 1182);
    if (randon === 0) {
      randon += 1;
    }

    const data = await fetchData(`${URL_API_CHARACTERS}/${randon}`);

    if (!data) {
      console.error(`Failed to load data for ${section}`);
      return;
    }

    renderHomeSection(data);
    return;
  }

  let baseUrl;

  if (section === CHARACTER_SECTION) {
    baseUrl = URL_API_CHARACTERS;
  } else if (section === EPISODE_SECTION) {
    baseUrl = URL_API_EPISODES;
  } else if (section === LOCATION_SECTION) {
    baseUrl = URL_API_LOCATIONS;
  }

  if (!baseUrl) {
    console.error(`Unknown section: ${section}`);
    return;
  }

  const url = `${baseUrl}?page=${page}`;
  const data = await fetchData(url);

  if (!data) {
    console.error(`Failed to load data for ${section}`);
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