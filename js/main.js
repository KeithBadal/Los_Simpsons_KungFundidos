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
  renderAllLocations
} from './render.js';

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
    if (!e.target.closest('#random-character-btn')) return;
    await loadSection(HOME_SECTION);
  });


  btnCharacter?.addEventListener('click', async (e) => {
    e.preventDefault();
    if (e.currentTarget.classList.contains('active')) return;
    setActiveButton(CHARACTER_SECTION);
    await loadSection(CHARACTER_SECTION);
  });

  btnEpisode?.addEventListener('click', async (e) => {
    e.preventDefault();
    if (e.currentTarget.classList.contains('active')) return;
    setActiveButton(EPISODE_SECTION);
    await loadSection(EPISODE_SECTION);
  });

  btnLocation?.addEventListener('click', async (e) => {
    e.preventDefault();
    if (e.currentTarget.classList.contains('active')) return;
    setActiveButton(LOCATION_SECTION);
    await loadSection(LOCATION_SECTION);
  });
}

async function loadSection(section) {
  let url;
  let render;

  switch (section) {

    case HOME_SECTION:
      //entre 1 y 1182
      let randon = Math.floor(Math.random() * 1182);
      if (randon === 0) {
        randon+=1;
      }
      url = URL_API_CHARACTERS + `/${randon}`;
      render = renderHomeSection;
      break;
    case CHARACTER_SECTION:
      url = URL_API_CHARACTERS;
      render = renderAllCharacters;
      break;
    case EPISODE_SECTION:
      url = URL_API_EPISODES;
      render = renderAllEpisodes;
      break;
    case LOCATION_SECTION:
      url = URL_API_LOCATIONS;
      render = renderAllLocations;
      break;
    default:
      console.error(`Sección desconocida: ${section}`);
      return;
  }

  hideSections();

  const selectedSection = document.querySelector(`.${section}`);
  if (selectedSection) selectedSection.style.display = section === HOME_SECTION ? 'flex' : 'grid';

  if (section === HOME_SECTION && selectedSection) {
    selectedSection.innerHTML = '<div class="spinner"></div>';
  }

  const data = await fetchData(url);

  if (!data) {
    console.error(`No se pudieron cargar los datos de ${section}`);
    return;
  }

  render(data.results || data);
}

