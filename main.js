import fetchData from './api.js'
import renderAllCharacters, { renderAllEpisodes } from './render.js'

const apiUrl = 'https://thesimpsonsapi.com/api/characters'

const response = await fetchData(apiUrl)
console.log(response.results)

renderAllCharacters(response.results)

const episodesUrl = 'https://thesimpsonsapi.com/api/episodes'

const episodesResponse = await fetchData(episodesUrl)

renderAllEpisodes(episodesResponse.results)
