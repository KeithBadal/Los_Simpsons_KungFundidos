import fetchData from './api.js';
import { getJsonItem, setJsonItem } from './starage.js';
import {
  URL_API_CHARACTERS,
  URL_API_EPISODES,
  URL_API_LOCATIONS,
  CHARACTER_SECTION,
  EPISODE_SECTION,
  LOCATION_SECTION
} from './constantes.js';

const STORAGE_KEYS = {
  [CHARACTER_SECTION]: 'simpsons_characters_data',
  [EPISODE_SECTION]: 'simpsons_episodes_data',
  [LOCATION_SECTION]: 'simpsons_locations_data'
};

const BASE_URLS = {
  [CHARACTER_SECTION]: URL_API_CHARACTERS,
  [EPISODE_SECTION]: URL_API_EPISODES,
  [LOCATION_SECTION]: URL_API_LOCATIONS
};

async function downloadAllPages(baseUrl) {
  const firstPage = await fetchData(`${baseUrl}?page=1`);
  if (!firstPage) return [];

  let results = [...firstPage.results];
  const totalPages = firstPage.pages || 1;

  const pagePromises = [];
  for (let page = 2; page <= totalPages; page++) {
    pagePromises.push(fetchData(`${baseUrl}?page=${page}`));
  }

  const otherPages = await Promise.all(pagePromises);
  otherPages.forEach(pageData => {
    if (pageData?.results) results = results.concat(pageData.results);
  });

  return results;
}

export async function getAllData(section) {
  const cached = getJsonItem(STORAGE_KEYS[section]);
  if (cached) return cached;

  const data = await downloadAllPages(BASE_URLS[section]);
  setJsonItem(STORAGE_KEYS[section], data);
  return data;
}
