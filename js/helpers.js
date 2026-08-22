
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

  if (section === CHARACTER_SECTION) {
    btnCharacter.classList.add('active');
    btnEpisode.classList.remove('active');
    btnLocation.classList.remove('active');
    btnHome.classList.remove('active');
  } else if (section === EPISODE_SECTION) {
    btnCharacter.classList.remove('active');
    btnEpisode.classList.add('active');
    btnLocation.classList.remove('active');
    btnHome.classList.remove('active');
  } else if (section === LOCATION_SECTION) {
    btnCharacter.classList.remove('active');
    btnEpisode.classList.remove('active');
    btnLocation.classList.add('active');
    btnHome.classList.remove('active');
  }else if (section === HOME_SECTION) {
    btnCharacter.classList.remove('active');
    btnEpisode.classList.remove('active');
    btnLocation.classList.remove('active');
    btnHome.classList.add('active');
  }
}

function hideSections() {
  [HOME_SECTION, CHARACTER_SECTION, EPISODE_SECTION, LOCATION_SECTION].forEach(s => {
    const el = document.querySelector(`.${s}`);
    if (el) el.style.display = 'none';
  });
}


export { setActiveButton, hideSections };