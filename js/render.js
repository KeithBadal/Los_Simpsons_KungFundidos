import {
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
    `
    })
    document.querySelector('.episodes').innerHTML = html
}  
