// js/api.js

/**
 * Realiza la búsqueda de artistas consumiendo la API de Deezer.
 * @param {string} query - El nombre del artista a buscar.
 * @returns {Promise<Array|null>} - Arreglo de artistas o null si hay error.
 */
export async function searchArtist(query) {
    try {
        const url = `https://corsproxy.io/?https://api.deezer.com/search/artist?q=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Fallo en la respuesta del servidor');
        }
        
        const data = await response.json();
        return data.data; 
        
    } catch (error) {
        console.error('Error al consultar la API de Deezer:', error);
        return null;
    }
}