import {
  URL_API_BASE_IM,
  CHARACTER_SECTION,
  EPISODE_SECTION,
  LOCATION_SECTION
} from './constantes.js';

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
        </div>
      </div>
    `;
  });

  document.querySelector('.characters').innerHTML = html
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

export function renderAllElements(elements, section) {
  if (section === CHARACTER_SECTION) {
    renderAllCharacters(elements);
  } else if (section === EPISODE_SECTION) {
    renderAllEpisodes(elements);
  } else if (section === LOCATION_SECTION) {
    renderAllLocations(elements);
  }
}

export function renderPagination(totalPages, currentPage = 1, onPageClick = () => {}) {
  const container = document.getElementById('pagination');

  if (!container) return; 
  
  container.innerHTML = '';

  const createBtn = (texto, id, paginaDestino, deshabilitado) => {
    const btn = document.createElement('button');
    btn.id = id;
    btn.className = 'btn-paginacion';
    btn.textContent = texto;
    btn.disabled = deshabilitado;

    if (!deshabilitado) {
      btn.addEventListener('click', () => onPageClick(paginaDestino));
    }
    return btn;
  };

  const nextPage = currentPage < totalPages ? currentPage + 1 : totalPages;
  const esUltima = currentPage >= totalPages;

  const btnCurrent = createBtn(`Current page: ${currentPage}`, 'btn-current-page', currentPage, false);
  const btnNext = createBtn(`Next: ${nextPage}`, 'btn-next-page', nextPage, esUltima);
  const btnLast = createBtn(`Last page: ${totalPages}`, 'btn-last-page', totalPages, esUltima);

  btnCurrent.classList.add('btn-actual');

  container.append(btnCurrent, btnNext, btnLast);
}