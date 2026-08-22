import {
  HOME_SECTION,
  CHARACTER_SECTION,
  EPISODE_SECTION,
  LOCATION_SECTION
} from './constantes.js';

export function renderAllCharacters(characters) {
  let html = '';

  characters.forEach(character => {
    html += `
      <div class="character">
        <div class="character_img">
          <img
          src="https://cdn.thesimpsonsapi.com/500${character.portrait_path}" 
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

  const container = document.querySelector('.characters');

  if (container) {
    container.innerHTML = html;
  }
}

export function renderAllEpisodes(episodes) {
  let html = '';

  episodes.forEach(episode => {
    const imageUrl = `https://cdn.thesimpsonsapi.com/500${episode.image_path}`;

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

  const container = document.querySelector('.episodes');

  if (container) {
    container.innerHTML = html;
  }
}

export function renderAllLocations(locations) {
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

  const container = document.querySelector('.locations');

  if (container) {
    container.innerHTML = html;
  }
}


export function renderHomeSection(randonCharacter) {
  const container = document.querySelector('.home');
  let html = '';

  if (randonCharacter) {
    html = `
      <div class="home_character">
        <div class="home_character_img">
          <img
            src="https://cdn.thesimpsonsapi.com/500${randonCharacter.portrait_path}"
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

  html += `<button id="random-character-btn" class="btn-random">Buscar otro personaje</button>`;
  if (container) {
    container.innerHTML = html;
  }
}


export function renderAllElements(elements, section) {
  if (section === CHARACTER_SECTION) {
    renderAllCharacters(elements);
  } else if (section === EPISODE_SECTION) {
    renderAllEpisodes(elements);
  } else if (section === LOCATION_SECTION) {
    renderAllLocations(elements);
  }
  if (section === HOME_SECTION) {
    renderHomeSection(elements);
  }
}