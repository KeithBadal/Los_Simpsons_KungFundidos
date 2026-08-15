

export default function renderAllCharacters (characters) {
  let html = ''
  characters.forEach(character => {
    html += `
      <div class="character">
        <div class="character_img">
        
          <img 
            src="https://cdn.thesimpsonsapi.com/500${character.portrait_path}" alt="${character.name}">
        </div>
        <div class="character_info">
          <h2>${character.name}</h2>
          <p>Ocupation: ${character.occupation}</p>
          <p>Gender: ${character.gender}</p>
          <p>Status: ${character.status}</p>
          <p>Birthdate: ${character.birthdate}</p>
         

        </div>
      </div>
    `
  })
  document.querySelector('.characters').innerHTML = html
}




export function renderAllEpisodes (episodes) {
    let html = ''
    episodes.forEach(episode => {
    html += `
         <div class="episode">
        <div class="episode_img">
         <img src="${episode.image}" alt="">
        </div>
        <div class="episode_info">
          <h2>${episode.name}</h2>
          <p>airdate: ${episode.air_date}</p>
          <p>Season: ${episode.season}</p>
          <p>Species: ${episode.synopsis}</p>
        </div>
      </div>
    `
    })
    document.querySelector('.episodes').innerHTML = html
} 