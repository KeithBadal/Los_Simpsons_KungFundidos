
import {
  CHARACTER_SECTION,
  EPISODE_SECTION,
  LOCATION_SECTION,
  HOME_SECTION
} from './constantes.js';

function setActiveButton(section) {
  const btnHome = document.getElementById(HOME_SECTION);
  const btnCharacter = document.getElementById(CHARACTER_SECTION);
  const btnEpisode = document.getElementById(EPISODE_SECTION);
  const btnLocation = document.getElementById(LOCATION_SECTION);
  const btnFavorites = document.getElementById('favorites-link');

  [btnHome, btnCharacter, btnEpisode, btnLocation, btnFavorites].forEach(btn => {
    if (btn) btn.classList.remove('active');
  });

  if (section === CHARACTER_SECTION) btnCharacter.classList.add('active');
  else if (section === EPISODE_SECTION) btnEpisode.classList.add('active');
  else if (section === LOCATION_SECTION) btnLocation.classList.add('active');
  else if (section === HOME_SECTION) btnHome.classList.add('active');
  else if (section === "favorites") btnFavorites.classList.add('active');
}


function hideSections() {
  [HOME_SECTION, CHARACTER_SECTION, EPISODE_SECTION, LOCATION_SECTION].forEach(s => {
    const el = document.querySelector(`.${s}`) || document.getElementById(s);
    if (el) el.style.display = 'none';
  });
}


export { setActiveButton, hideSections };