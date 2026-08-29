// Revisa si un texto contiene la palabra buscada (sin importar mayúsculas/minúsculas)
function contieneTexto(texto, busqueda) {
  return (texto || '').toLowerCase().includes(busqueda.toLowerCase());
}

export function filterCharacters(personajes, filtros) {
  return personajes.filter(personaje => {
    if (filtros.name && !contieneTexto(personaje.name, filtros.name)) {
      return false;
    }

    if (filtros.occupation && !contieneTexto(personaje.occupation, filtros.occupation)) {
      return false;
    }

    if (filtros.status && personaje.status !== filtros.status) {
      return false;
    }

    if (filtros.gender && personaje.gender !== filtros.gender) {
      return false;
    }

    if (filtros.minAge !== '' && (personaje.age === null || personaje.age < Number(filtros.minAge))) {
      return false;
    }

    if (filtros.maxAge !== '' && (personaje.age === null || personaje.age > Number(filtros.maxAge))) {
      return false;
    }

    return true;
  });
}

export function filterEpisodes(episodios, filtros) {
  return episodios.filter(episodio => {
    if (filtros.search && !contieneTexto(episodio.name, filtros.search)) {
      return false;
    }

    if (filtros.season && String(episodio.season) !== filtros.season) {
      return false;
    }

    if (filtros.year && !(episodio.airdate || '').startsWith(filtros.year)) {
      return false;
    }

    return true;
  });
}

export function filterLocations(ubicaciones, filtros) {
  return ubicaciones.filter(ubicacion => {
    if (filtros.search && !contieneTexto(ubicacion.name, filtros.search)) {
      return false;
    }

    if (filtros.town && ubicacion.town !== filtros.town) {
      return false;
    }

    if (filtros.use && ubicacion.use !== filtros.use) {
      return false;
    }

    return true;
  });
}
