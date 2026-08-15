import fetchData from './api.js'
import renderAllCharacters, { renderAllEpisodes } from './render.js'
const { URL_API_CHARACTERS, URL_API_EPISODES, URL_API_LOCATIONS } = await import('./constantes.js');

const characters = await fetchData(URL_API_CHARACTERS);
renderAllCharacters(characters.results);




