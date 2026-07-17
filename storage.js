// js/storage.js

const FAVORITES_KEY = 'deezer_manager_favorites';

/**
 * Obtiene todos los álbumes guardados en favoritos.
 * @returns {Array} Arreglo de álbumes.
 */
export function getFavorites() {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
}

/**
 * Guarda un álbum en favoritos o lo elimina si ya existe (toggle).
 * @param {Object} album - Objeto con id, title, y cover.
 */
export function toggleFavorite(album) {
    let favorites = getFavorites();
    const index = favorites.findIndex(fav => String(fav.id) === String(album.id));

    if (index >= 0) {
        // Si ya existe, lo eliminamos
        favorites.splice(index, 1);
        alert(`Álbum eliminado de favoritos.`);
    } else {
        // Si no existe, lo agregamos con una calificación inicial de 0
        album.rating = 0; 
        favorites.push(album);
        alert(`Álbum guardado en favoritos.`);
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

/**
 * Actualiza la calificación por estrellas de un álbum guardado.
 * @param {string|number} albumId - ID del álbum.
 * @param {number} rating - Valor de 1 a 5.
 */
export function rateAlbum(albumId, rating) {
    let favorites = getFavorites();
    const index = favorites.findIndex(fav => String(fav.id) === String(albumId));

    if (index >= 0) {
        favorites[index].rating = rating;
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
}