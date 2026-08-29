import fetchData from './api.js';

import { setActiveButton, hideSections } from './helpers.js';

import {
  URL_API_CHARACTERS,
  HOME_SECTION,
  CHARACTER_SECTION,
  EPISODE_SECTION,
  LOCATION_SECTION
} from './constantes.js';

import { getAllData } from './data.js';
import { filterCharacters, filterEpisodes, filterLocations } from './filters.js';

import {
  renderHomeSection,
  renderAllCharacters,
  renderAllEpisodes,
  renderAllLocations,
  renderCharacterFilters,
  renderEpisodeFilters,
  renderLocationFilters,
  renderPagination,
  renderFavorites
} from './render.js';

const PAGE_SIZE = 20;

let currentSection = HOME_SECTION;

const sectionData = {
  [CHARACTER_SECTION]: [],
  [EPISODE_SECTION]: [],
  [LOCATION_SECTION]: []
};

const DEFAULT_FILTERS = {
  [CHARACTER_SECTION]: { name: '', status: '', gender: '', minAge: '', maxAge: '', occupation: '' },
  [EPISODE_SECTION]: { search: '', season: '', year: '' },
  [LOCATION_SECTION]: { search: '', town: '', use: '' }
};

const filters = {
  [CHARACTER_SECTION]: { ...DEFAULT_FILTERS[CHARACTER_SECTION] },
  [EPISODE_SECTION]: { ...DEFAULT_FILTERS[EPISODE_SECTION] },
  [LOCATION_SECTION]: { ...DEFAULT_FILTERS[LOCATION_SECTION] }
};

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

  const btnFavorites = document.querySelector('[data-view="favorites"]');
  btnFavorites?.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.currentTarget.classList.contains('active')) return;
    hideSections();
    setActiveButton('favorites');
    const favoritesSection = document.getElementById('favorites');
    if (favoritesSection) favoritesSection.style.display = 'grid';
    renderFavorites();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const selectedSection = document.querySelector(`.${section}`);
  if (selectedSection) {
    selectedSection.style.display = section === HOME_SECTION ? 'flex' : 'block';
  }

  if (section === HOME_SECTION) {
    const paginationContainer = document.getElementById('pagination');
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

  await loadFilterableSection(section, page);
}

async function loadFilterableSection(section, page) {
  const gridContainer = document.querySelector(`.${section}-grid`);

  if (sectionData[section].length === 0) {
    if (gridContainer) gridContainer.innerHTML = '<div class="spinner"></div>';
    sectionData[section] = await getAllData(section);
  }

  renderSectionFilters(section);
  renderSectionPage(section, page);
}

function clearFilters(section) {
  filters[section] = { ...DEFAULT_FILTERS[section] };
  renderSectionFilters(section);
  renderSectionPage(section, 1);
}

function renderSectionFilters(section) {
  const data = sectionData[section];

  if (section === CHARACTER_SECTION) {
    renderCharacterFilters(data, filters[CHARACTER_SECTION], (key, value) => {
      filters[CHARACTER_SECTION][key] = value;
      renderSectionPage(CHARACTER_SECTION, 1);
    }, () => clearFilters(CHARACTER_SECTION));
  } else if (section === EPISODE_SECTION) {
    renderEpisodeFilters(data, filters[EPISODE_SECTION], (key, value) => {
      filters[EPISODE_SECTION][key] = value;
      renderSectionPage(EPISODE_SECTION, 1);
    }, () => clearFilters(EPISODE_SECTION));
  } else if (section === LOCATION_SECTION) {
    renderLocationFilters(data, filters[LOCATION_SECTION], (key, value) => {
      filters[LOCATION_SECTION][key] = value;
      renderSectionPage(LOCATION_SECTION, 1);
    }, () => clearFilters(LOCATION_SECTION));
  }
}

function getFilteredData(section) {
  const data = sectionData[section];

  if (section === CHARACTER_SECTION) return filterCharacters(data, filters[CHARACTER_SECTION]);
  if (section === EPISODE_SECTION) return filterEpisodes(data, filters[EPISODE_SECTION]);
  return filterLocations(data, filters[LOCATION_SECTION]);
}

function renderSectionPage(section, page) {
  const filtered = getFilteredData(section);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  if (section === CHARACTER_SECTION) renderAllCharacters(pageItems);
  else if (section === EPISODE_SECTION) renderAllEpisodes(pageItems);
  else if (section === LOCATION_SECTION) renderAllLocations(pageItems);

  const isDataCached = sectionData[section].length > 0;

  renderPagination(totalPages, currentPage, (newPage) => {
    renderSectionPage(section, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, isDataCached);
}
