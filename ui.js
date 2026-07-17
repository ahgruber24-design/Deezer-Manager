// js/ui.js
import { searchArtist, getArtistAlbums } from './api.js';

/**
 * Inicializa y renderiza la vista del buscador en el contenedor principal.
 */
export function initSearch() {
    const appContainer = document.getElementById('app-container');
    
    appContainer.innerHTML = `
        <div class="search-section">
            <h2>Buscador de Artistas</h2>
            <form id="search-form" class="search-form">
                <input type="text" id="search-input" placeholder="Ej. Daft Punk" required>
                <button type="submit">Buscar</button>
            </form>
            <div id="results-container" class="results-container"></div>
        </div>
    `;

    document.getElementById('search-form').addEventListener('submit', handleSearch);
}

/**
 * Maneja el evento de búsqueda, controla el spinner y los estados vacíos.
 */
async function handleSearch(event) {
    event.preventDefault();
    
    const query = document.getElementById('search-input').value.trim();
    const spinner = document.getElementById('global-spinner');
    const resultsContainer = document.getElementById('results-container');

    // 1. Limpiar resultados previos y mostrar el spinner
    resultsContainer.innerHTML = '';
    spinner.classList.remove('hidden');

    // 2. Realizar petición asíncrona a la API
    const results = await searchArtist(query);

    // 3. Ocultar el spinner al recibir respuesta
    spinner.classList.add('hidden');

    // 4. Gestión de estados vacíos (Resultados no encontrados)
    if (!results || results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <h3>Resultados no encontrados</h3>
                <p>No existen registros para "${query}". Por favor, intenta con otra búsqueda.</p>
            </div>
        `;
        return;
    }

    // 5. Renderizar los resultados si existen
    renderArtists(results, resultsContainer);
}

/**
 * Genera el HTML semántico para presentar los artistas encontrados.
 */
function renderArtists(artists, container) {
    const html = artists.map(artist => `
        <div class="artist-card">
            <img src="${artist.picture_medium}" alt="${artist.name}">
            <h3>${artist.name}</h3>
            <button class="btn-detail" data-id="${artist.id}" data-name="${artist.name}">Ver Detalle</button>
        </div>
    `).join('');

    container.innerHTML = html;
    
    // Añadir eventos a los botones de "Ver Detalle"
    const detailButtons = document.querySelectorAll('.btn-detail');
    detailButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const artistId = e.target.getAttribute('data-id');
            const artistName = e.target.getAttribute('data-name');
            loadArtistDetail(artistId, artistName);
        });
    });
}

/**
 * Carga y renderiza el panel de detalle de un artista (sus álbumes).
 */
async function loadArtistDetail(artistId, artistName) {
    const appContainer = document.getElementById('app-container');
    const spinner = document.getElementById('global-spinner');

    // Mostrar spinner mientras cargan los álbumes
    spinner.classList.remove('hidden');

    const albums = await getArtistAlbums(artistId);

    // Ocultar spinner tras la respuesta
    spinner.classList.add('hidden');

    // Inyectar el HTML del contenedor de álbumes
    appContainer.innerHTML = `
        <div class="detail-section">
            <button id="btn-back" class="btn-secondary">⬅ Volver al Buscador</button>
            <h2>Discografía de ${artistName}</h2>
            <div id="albums-container" class="results-container">
                <!-- Los álbumes irán aquí -->
            </div>
        </div>
    `;

    // Botón para regresar al buscador principal
    document.getElementById('btn-back').addEventListener('click', initSearch);

    const albumsContainer = document.getElementById('albums-container');
    
    // Validar si el artista no tiene álbumes registrados
    if (!albums || albums.length === 0) {
        albumsContainer.innerHTML = `<p class="empty-state">No se encontraron álbumes para este artista.</p>`;
        return;
    }

    // Renderizar los álbumes en la vista
    renderAlbums(albums, albumsContainer);
}

/**
 * Genera el HTML para las tarjetas de los álbumes.
 */
function renderAlbums(albums, container) {
    const html = albums.map(album => `
        <div class="album-card">
            <img src="${album.cover_medium}" alt="${album.title}">
            <h4>${album.title}</h4>
            <p>Lanzamiento: ${album.release_date || 'Desconocido'}</p>
            <div class="album-actions">
                <button class="btn-tracks" data-id="${album.id}">Ver Canciones</button>
                <button class="btn-fav" data-id="${album.id}" data-title="${album.title}" data-cover="${album.cover_medium}">⭐ Guardar</button>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}