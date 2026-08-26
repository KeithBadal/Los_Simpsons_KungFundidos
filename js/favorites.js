const favorites_key ="simpsons_favorites";

export function getFavorites() {
    return JSON.parse(localStorage.getItem(favorites_key)) || [];
}

export function addFavorite(character) {
    const favs = getFavorites();

    if (!favs.some(fav => fav.id === character.id)) {
        favs.push(character);
        localStorage.setItem(favorites_key, JSON.stringify(favs));
    }
}

export function removeFavorite(id) {
    const favs = getFavorites().filter(fav => fav.id !== id);
    localStorage.setItem(favorites_key, JSON.stringify(favs));
}

export function isFavorite(id) {
    return getFavorites().some(fav => fav.id === id);
}
