/**
 * Obtiene los álbumes de un artista específico.
 * @param {string|number} artistId - El ID del artista.
 * @returns {Promise<Array|null>} - Arreglo de álbumes o null si hay error.
 */
export async function getArtistAlbums(artistId) {
    try {
        const url = `https://corsproxy.io/?https://api.deezer.com/artist/${artistId}/albums`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Fallo al obtener álbumes');
        
        const data = await response.json();
        return data.data; 
    } catch (error) {
        console.error('Error al consultar álbumes:', error);
        return null;
    }
}

/**
 * Obtiene la lista de canciones (tracks) de un álbum.
 * @param {string|number} albumId - El ID del álbum.
 * @returns {Promise<Array|null>} - Arreglo de tracks o null.
 */
export async function getAlbumTracks(albumId) {
    try {
        const url = `https://corsproxy.io/?https://api.deezer.com/album/${albumId}/tracks`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Fallo al obtener tracks');
        
        const data = await response.json();
        return data.data; 
    } catch (error) {
        console.error('Error al consultar tracks:', error);
        return null;
    }
}