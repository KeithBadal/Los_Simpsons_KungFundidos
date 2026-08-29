export function getJsonItem(llave, porDefecto = null) {
    try {
        const myJson = localStorage.getItem(llave);
        return myJson === null ? porDefecto : JSON.parse(myJson);
    } catch {
        return porDefecto; // JSON inválido o storage inaccesible
    }
}

export function setJsonItem(llave, valor) {
    if (typeof llave !== 'string' || llave === '') {
        throw new TypeError('La llave debe ser un string no vacío');
    }
    if (valor === undefined) {
        throw new TypeError('No se puede guardar undefined');
    }

    try {
        localStorage.setItem(llave, JSON.stringify(valor));
        return true;
    } catch (e) {
        console.warn(`No se pudo guardar "${llave}"`, e);
        return false;
    }
}