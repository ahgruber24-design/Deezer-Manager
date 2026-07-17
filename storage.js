// js/storage.js

const FAVORITES_KEY = 'deezer_manager_favorites';
const SYNC_QUEUE_KEY = 'deezer_sync_queue'; // Cola para la sincronización diferida

export function getFavorites() {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
}

export function toggleFavorite(album) {
    let favorites = getFavorites();
    const index = favorites.findIndex(fav => String(fav.id) === String(album.id));

    if (index >= 0) {
        favorites.splice(index, 1);
        alert(`Álbum eliminado de favoritos.`);
    } else {
        album.rating = 0; 
        favorites.push(album);
        alert(`Álbum guardado en favoritos.`);
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function rateAlbum(albumId, rating) {
    let favorites = getFavorites();
    const index = favorites.findIndex(fav => String(fav.id) === String(albumId));

    if (index >= 0) {
        favorites[index].rating = rating;
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));

        // LÓGICA DE SINCRONIZACIÓN DIFERIDA
        if (!navigator.onLine) {
            // Si no hay red, guardamos la acción en la cola
            let queue = JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY)) || [];
            queue.push({ albumId, rating, timestamp: new Date().toISOString() });
            localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
            alert('Sin conexión: Calificación guardada localmente. Se sincronizará al volver la red.');
        } else {
            // Si hay red, simulamos enviar al servidor personal inmediatamente
            console.log(`Calificación de ${rating} estrellas para el álbum ${albumId} enviada al servidor.`);
        }
    }
}

/**
 * Procesa las calificaciones pendientes cuando vuelve el internet.
 */
export function syncPendingRatings() {
    let queue = JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY)) || [];
    
    if (queue.length > 0) {
        console.log('Iniciando sincronización diferida...', queue);
        
        // Simulamos el envío asíncrono al servidor de cada elemento en la cola
        setTimeout(() => {
            console.log(`Se sincronizaron ${queue.length} calificaciones con el servidor.`);
            // Vaciamos la cola tras sincronizar
            localStorage.removeItem(SYNC_QUEUE_KEY);
            alert('¡Conexión recuperada! Tus calificaciones offline se han sincronizado.');
        }, 1500);
    }
}