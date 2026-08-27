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

  characters.forEach(character => {
    const imageUrl = `${URL_API_BASE_IM}${character.portrait_path}`
    html += `
      <div class="character">
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
          <p>Birthdate: ${character.birthdate || 'Unknown'}</p>

          <button class="favorite-btn" data-id="${character.id}">
            ${isFavorite(character.id) ? '❤️ Quitar favorito' : '🤍 Agregar favorito'}
          </button>
        </div>
      </div>
    `;
  });

  const container = document.querySelector('.characters');
  container.innerHTML = html;

  container.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const character = characters.find(c => c.id === id);

      if (isFavorite(id)) {
        removeFavorite(id);
        btn.textContent = '🤍 Agregar favorito';
      } else {
        addFavorite(character);
        btn.textContent = '❤️ Quitar favorito';
        const favoritesSection = document.getElementById('favorites');
        if (favoritesSection && favoritesSection.style.display === 'grid') {
          renderFavorites();
        }
      }
    });
  });
}

export function renderAllEpisodes(episodes) {
  let html = '';

  episodes.forEach(episode => {
    const imageUrl = `${URL_API_BASE_IM}${episode.image_path}`;

    html += `
      <div class="episode">
        <div class="episode_img">
          <img
            src="${imageUrl}"
            alt="${episode.name}"
          >
        </div>

        <div class="episode_info">
          <h2>${episode.name}</h2>
          <p>Airdate: ${episode.air_date || 'Unknown'}</p>
          <p>Season: ${episode.season || 'Unknown'}</p>
          <p>Synopsis: ${episode.synopsis || 'No synopsis available'}</p>
        </div>
      </div>
    `;
  });

  document.querySelector('.episodes').innerHTML = html
}

export function renderAllLocations(locations, currentPage) {
  let html = '';

  locations.forEach(location => {
    html += `
      <div class="location">
        <h2>${location.name}</h2>
        <p>Town: ${location.town || 'Unknown'}</p>
        <p>Use: ${location.use || 'Unknown'}</p>
      </div>
    `;
  });

  document.querySelector('.locations').innerHTML = html
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

export function renderPagination(totalPages, currentPage = 1, onPageClick = () => {}) {
  const container = document.getElementById('pagination');
  
  if (!container) return;
  
  container.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    
    btn.className = 'btn-paginacion';

    if (i === parseInt(currentPage)) {
      btn.classList.add('btn-actual');
    }

    btn.addEventListener('click', () => onPageClick(i));

    container.appendChild(btn);
  }
}