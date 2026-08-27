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
          <p>Airdate: ${episode.air_date || 'Unknown'}</p>
          <p>Season: ${episode.season || 'Unknown'}</p>
          <p>Episode number: ${episode.episode_number || 'Unknown'}</p>
        </div>
      </div>
    `;
  });

  document.querySelector('.episodes').innerHTML = html

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
      <p><strong>Air date:</strong> ${data.air_date || 'Unknown'}</p>
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