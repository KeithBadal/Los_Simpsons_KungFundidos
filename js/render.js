import {
  HOME_SECTION,
  URL_API_BASE_IM,
  CHARACTER_SECTION,
  EPISODE_SECTION,
  LOCATION_SECTION
} from './constantes.js';

import { addFavorite, removeFavorite, isFavorite, getFavorites } from './favorites.js';


export function renderAllCharacters(characters) {
  let html = '';

  characters.forEach((character, index) => {
    const imageUrl = `${URL_API_BASE_IM}${character.portrait_path}`
    html += `
      <div class="character" data-index="${index}">
        <div class="character_img">
          <img
          src="${imageUrl}"
            alt="${character.name}">
        </div>

        <div class="character_info">
          <h2>${character.name}</h2>
          <p>Occupation: ${character.occupation || 'Unknown'}</p>
          <p>Gender: ${character.gender || 'Unknown'}</p>
          <p>Status: ${character.status || 'Unknown'}</p>

          <button class="favorite-btn" data-id="${character.id}">
            ${isFavorite(character.id) ? '❤️ Remove from favorite' : '🤍 Add Favorite'}
          </button>
        </div>
      </div>
    `;
  });

  const container = document.querySelector('.characters-grid');
  container.innerHTML = html || '<p class="no-results">No characters found with these filters.</p>';

  container.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = Number(btn.dataset.id);
      const character = characters.find(c => c.id === id);

      if (isFavorite(id)) {
        removeFavorite(id);
        btn.textContent = '🤍 Add Favorite';
      } else {
        addFavorite(character);
        btn.textContent = '❤️ Remove from favorite';
        const favoritesSection = document.getElementById('favorites');
        if (favoritesSection && favoritesSection.style.display === 'grid') {
          renderFavorites();
        }
      }
    });
  });

  document.querySelectorAll('.character').forEach(card => {
    card.addEventListener('click', () => {
      const index = card.getAttribute('data-index');
      showModal(characters[index], 'character');
    });
  });
}

export function renderAllEpisodes(episodes) {
  let html = '';

  episodes.forEach((episode, index) => {
    const imageUrl = `${URL_API_BASE_IM}${episode.image_path}`;

    html += `
      <div class="episode" data-index="${index}">
        <div class="episode_img">
          <img
            src="${imageUrl}"
            alt="${episode.name}"
          >
        </div>

        <div class="episode_info">
          <h2>${episode.name}</h2>
          <p>Airdate: ${episode.airdate || 'Unknown'}</p>
          <p>Season: ${episode.season || 'Unknown'}</p>
          <p>Episode number: ${episode.episode_number || 'Unknown'}</p>
        </div>
      </div>
    `;
  });

  document.querySelector('.episodes-grid').innerHTML = html || '<p class="no-results">No episodes found with these filters.</p>';

  document.querySelectorAll('.episode').forEach(card => {
    card.addEventListener('click', () => {
      const index = card.getAttribute('data-index');
      showModal(episodes[index], 'episode');
    });
  });
}

export function renderAllLocations(locations, currentPage) {
  let html = '';

  locations.forEach(location => {

    const imageUrl = `${URL_API_BASE_IM}${location.image_path}`;

    html += `
      <div class="location">
        <div class="location_img">
          <img
            src="${imageUrl}"
            alt="${location.name}"
          >
        </div>
        <h2>${location.name}</h2>
        <p>Town: ${location.town || 'Unknown'}</p>
        <p>Use: ${location.use || 'Unknown'}</p>
      </div>
    `;
  });

  document.querySelector('.locations-grid').innerHTML = html || '<p class="no-results">No locations found with these filters.</p>';
}

function buildOptions(values, selected) {
  return values
    .map(v => `<option value="${v}" ${v === selected ? 'selected' : ''}>${v}</option>`)
    .join('');
}

function uniqueValues(items, key) {
  const values = [...new Set(items.map(item => item[key]).filter(Boolean))];
  const allNumeric = values.every(v => v !== '' && !isNaN(Number(v)));
  return allNumeric
    ? values.sort((a, b) => Number(a) - Number(b))
    : values.sort();
}

export function renderCharacterFilters(characters, filters, onChange, onClear) {
  const container = document.getElementById('characters-filters');
  if (!container) return;

  const statuses = uniqueValues(characters, 'status');
  const genders = uniqueValues(characters, 'gender');

  container.innerHTML = `
    <input type="search" id="filter-character-search" class="search-primary" placeholder="Search character by name..." value="${filters.name}">
    <input type="search" id="filter-occupation" placeholder="Search by occupation..." value="${filters.occupation}">
    <select id="filter-status">
      <option value="">Status</option>
      ${buildOptions(statuses, filters.status)}
    </select>
    <select id="filter-gender">
      <option value="">Gender</option>
      ${buildOptions(genders, filters.gender)}
    </select>
    <input type="number" id="filter-min-age" placeholder="Min age" value="${filters.minAge}">
    <input type="number" id="filter-max-age" placeholder="Max age" value="${filters.maxAge}">
    <button type="button" id="btn-search-characters">🔍 Search</button>
    <button type="button" class="btn-clear-filters" id="btn-clear-characters">✖ Clear Filters</button>
  `;

  const nameInput = container.querySelector('#filter-character-search');
  const occupationInput = container.querySelector('#filter-occupation');
  const statusSelect = container.querySelector('#filter-status');
  const genderSelect = container.querySelector('#filter-gender');
  const minAgeInput = container.querySelector('#filter-min-age');
  const maxAgeInput = container.querySelector('#filter-max-age');

  const triggerSearch = () => {
    onChange({
      name: nameInput.value,
      occupation: occupationInput.value,
      status: statusSelect.value,
      gender: genderSelect.value,
      minAge: minAgeInput.value,
      maxAge: maxAgeInput.value
    });
  };

  container.querySelector('#btn-search-characters').addEventListener('click', triggerSearch);
  [nameInput, occupationInput, minAgeInput, maxAgeInput].forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') triggerSearch();
    });
  });

  container.querySelector('#btn-clear-characters').addEventListener('click', onClear);
}

export function renderEpisodeFilters(episodes, filters, onChange, onClear) {
  const container = document.getElementById('episodes-filters');
  if (!container) return;

  const seasons = uniqueValues(episodes, 'season');
  const years = [...new Set(episodes.map(e => (e.airdate || '').slice(0, 4)).filter(Boolean))].sort();

  container.innerHTML = `
    <input type="search" id="filter-episode-search" placeholder="Search episode by name..." value="${filters.search}">
    <select id="filter-season">
      <option value="">Season</option>
      ${buildOptions(seasons, filters.season)}
    </select>
    <select id="filter-year">
      <option value="">Release Year</option>
      ${buildOptions(years, filters.year)}
    </select>
    <button type="button" id="btn-search-episodes">🔍 Search</button>
    <button type="button" class="btn-clear-filters" id="btn-clear-episodes">✖ Clear Filters</button>
  `;

  const searchInput = container.querySelector('#filter-episode-search');
  const seasonSelect = container.querySelector('#filter-season');
  const yearSelect = container.querySelector('#filter-year');

  const triggerSearch = () => {
    onChange({
      search: searchInput.value,
      season: seasonSelect.value,
      year: yearSelect.value
    });
  };

  container.querySelector('#btn-search-episodes').addEventListener('click', triggerSearch);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') triggerSearch();
  });

  container.querySelector('#btn-clear-episodes').addEventListener('click', onClear);
}

export function renderLocationFilters(locations, filters, onChange, onClear) {
  const container = document.getElementById('locations-filters');
  if (!container) return;

  const towns = uniqueValues(locations, 'town');
  const uses = uniqueValues(locations, 'use');

  container.innerHTML = `
    <input type="search" id="filter-location-search" placeholder="Search location by name..." value="${filters.search}">
    <select id="filter-town">
      <option value="">Town</option>
      ${buildOptions(towns, filters.town)}
    </select>
    <select id="filter-use">
      <option value="">Use</option>
      ${buildOptions(uses, filters.use)}
    </select>
    <button type="button" id="btn-search-locations">🔍 Search</button>
    <button type="button" class="btn-clear-filters" id="btn-clear-locations">✖ Clear Filters</button>
  `;

  const searchInput = container.querySelector('#filter-location-search');
  const townSelect = container.querySelector('#filter-town');
  const useSelect = container.querySelector('#filter-use');

  const triggerSearch = () => {
    onChange({
      search: searchInput.value,
      town: townSelect.value,
      use: useSelect.value
    });
  };

  container.querySelector('#btn-search-locations').addEventListener('click', triggerSearch);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') triggerSearch();
  });

  container.querySelector('#btn-clear-locations').addEventListener('click', onClear);
}

export function renderHomeSection(randonCharacter) {
  const container = document.querySelector('.home_random');
  let html = '';

  if (randonCharacter) {
    html = `
      <div class="home_character">
        <div class="home_character_img">
          <img
            src="${URL_API_BASE_IM}${randonCharacter.portrait_path}"
            alt="${randonCharacter.name}">
        </div>

        <div class="home_character_info">
          <h2>${randonCharacter.name}</h2>
          <p>Occupation: ${randonCharacter.occupation || 'Unknown'}</p>
          <p>Gender: ${randonCharacter.gender || 'Unknown'}</p>
          <p>Status: ${randonCharacter.status || 'Unknown'}</p>
          <p>Birthdate: ${randonCharacter.birthdate || 'Unknown'}</p>
        </div>
      </div>
    `;
  } else {
    html = '<p>No character data available.</p>';
  }

  html += `<button id="random-character-btn" class="btn-random">Search another character</button>`;
  if (container) {
    container.innerHTML = html;
  }
}

const FAVORITES_PAGE_SIZE = 8;

export function renderFavorites(page = 1) {
  const favs = getFavorites();
  const container = document.querySelector('.favorites');
  const paginationContainer = document.getElementById('pagination');

  if (!favs.length) {
    container.innerHTML = "<p>No hay favoritos aún.</p>";
    if (paginationContainer) paginationContainer.innerHTML = '';
    return;
  }

  const totalPages = Math.ceil(favs.length / FAVORITES_PAGE_SIZE);
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * FAVORITES_PAGE_SIZE;
  const pageFavs = favs.slice(start, start + FAVORITES_PAGE_SIZE);

  let html = '';

  pageFavs.forEach(character => {
    const imageUrl = `${URL_API_BASE_IM}${character.portrait_path}`;

    html += `
      <div class="character">
        <div class="character_img">
          <img src="${imageUrl}" alt="${character.name}">
        </div>

        <div class="character_info">
          <h2>${character.name}</h2>
          <button class="remove-fav-btn" data-id="${character.id}">
            ❌ Quitar
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  container.querySelectorAll('.remove-fav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      removeFavorite(id);
      renderFavorites(currentPage);
    });
  });

  renderPagination(totalPages, currentPage, (newPage) => {
    renderFavorites(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

export function renderAllElements(elements, section) {
  if (section === CHARACTER_SECTION) {
    renderAllCharacters(elements);
  } else if (section === EPISODE_SECTION) {
    renderAllEpisodes(elements);
  } else if (section === LOCATION_SECTION) {
    renderAllLocations(elements);
  } else if (section === HOME_SECTION) {
    renderHomeSection(elements);
  }
}

export function renderPagination(totalPages, currentPage = 1, onPageClick = () => {}, isDataCached = false) {
  const container = document.getElementById('pagination');

  if (!container) return;

  container.innerHTML = '';

  currentPage = parseInt(currentPage);

  const makeButton = (label, page, isCurrent = false, disabled = false, cached = false) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.className = 'btn-paginacion';

    if (isCurrent) btn.classList.add('btn-actual');

    if (cached) {
      btn.classList.add('btn-cached');
      btn.title = 'Already downloaded and saved in localStorage';
    }

    if (disabled) btn.disabled = true;

    if (!disabled) {
      btn.addEventListener('click', () => onPageClick(page));
    }

    return btn;
  };

  container.appendChild(makeButton('<', currentPage - 1, false, currentPage === 1));

  const scrollContainer = document.createElement('div');
  scrollContainer.className = 'pagination-scroll';

  let currentBtn = null;

  for (let i = 1; i <= totalPages; i++) {
    const btn = makeButton(i, i, i === currentPage, false, isDataCached);
    if (i === currentPage) currentBtn = btn;
    scrollContainer.appendChild(btn);
  }

  container.appendChild(scrollContainer);
  container.appendChild(makeButton('>', currentPage + 1, false, currentPage === totalPages));

  if (currentBtn) {
    requestAnimationFrame(() => {
      scrollContainer.scrollLeft = currentBtn.offsetLeft - (scrollContainer.clientWidth / 2) + (currentBtn.offsetWidth / 2);
    });
  }
}

function showModal(data, type) {
  const modal = document.getElementById('info-modal');
  const modalBody = document.getElementById('modal-body');
  
  let html = '';
if (type === 'character') {
    const imageUrl = `${URL_API_BASE_IM}${data.portrait_path}`;

    let phrasesHtml = '';

    if (data.phrases && data.phrases.length > 0) {
      const listItems = data.phrases.map(frase => `<li>"${frase}"</li>`).join('');
      phrasesHtml = `
        <div class="phrases-box">
          <strong>Phrases:</strong>
          <ul>
            ${listItems}
          </ul>
        </div>
      `;
    }

    html = `
      <img src="${imageUrl}" alt="${data.name}">
      <h2>${data.name}</h2>
      <p><strong>Occupation:</strong> ${data.occupation || 'Unknown'}</p>
      <p><strong>Gender:</strong> ${data.gender || 'Unknown'}</p>
      <p><strong>Status:</strong> ${data.status || 'Unknown'}</p>
      <p><strong>Birthday:</strong> ${data.birthdate || 'Unknown'}</p>
      ${phrasesHtml} 
    `;
  } else if (type === 'episode') {
    const imageUrl = `${URL_API_BASE_IM}${data.image_path}`;
    html = `
      <img src="${imageUrl}" alt="${data.name}">
      <h2>${data.name}</h2>
      <p><strong>Air date:</strong> ${data.airdate || 'Unknown'}</p>
      <p><strong>Season:</strong> ${data.season || 'Unknown'}</p>
      <p><strong>Episode number:</strong> ${data.episode_number || 'Unknown'}</p>
      <p><strong>Synopsis:</strong> ${data.synopsis || 'No synopsis available'}</p>
    `;
  }
  
  modalBody.innerHTML = html;
  modal.style.display = 'flex';
}

document.addEventListener('click', (e) => {
  const modal = document.getElementById('info-modal');
  if (!modal) return;
  if (e.target.classList.contains('close-btn') || e.target === modal) {
    modal.style.display = 'none';
  }
})