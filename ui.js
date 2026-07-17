// js/ui.js
import { searchArtist, getArtistAlbums } from './api.js';
import { toggleFavorite, getFavorites, rateAlbum } from './storage.js';

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

async function handleSearch(event) {
    event.preventDefault();
    
    const query = document.getElementById('search-input').value.trim();
    const spinner = document.getElementById('global-spinner');
    const resultsContainer = document.getElementById('results-container');

    resultsContainer.innerHTML = '';
    spinner.classList.remove('hidden');

    const results = await searchArtist(query);

    spinner.classList.add('hidden');

    if (!results || results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <h3>Resultados no encontrados</h3>
                <p>No existen registros para "${query}". Por favor, intenta con otra búsqueda.</p>
            </div>
        `;
        return;
    }

    renderArtists(results, resultsContainer);
}

function renderArtists(artists, container) {
    const html = artists.map(artist => `
        <div class="artist-card">
            <img src="${artist.picture_medium}" alt="${artist.name}">
            <h3>${artist.name}</h3>
            <button class="btn-detail" data-id="${artist.id}" data-name="${artist.name}">Ver Detalle</button>
        </div>
    `).join('');

    container.innerHTML = html;
    
    const detailButtons = document.querySelectorAll('.btn-detail');
    detailButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const artistId = e.target.getAttribute('data-id');
            const artistName = e.target.getAttribute('data-name');
            loadArtistDetail(artistId, artistName);
        });
    });
}

async function loadArtistDetail(artistId, artistName) {
    const appContainer = document.getElementById('app-container');
    const spinner = document.getElementById('global-spinner');

    spinner.classList.remove('hidden');
    const albums = await getArtistAlbums(artistId);
    spinner.classList.add('hidden');

    appContainer.innerHTML = `
        <div class="detail-section">
            <button id="btn-back" class="btn-secondary">⬅ Volver al Buscador</button>
            <h2>Discografía de ${artistName}</h2>
            <div id="albums-container" class="results-container"></div>
        </div>
    `;

    document.getElementById('btn-back').addEventListener('click', initSearch);

    const albumsContainer = document.getElementById('albums-container');
    
    if (!albums || albums.length === 0) {
        albumsContainer.innerHTML = `<p class="empty-state">No se encontraron álbumes para este artista.</p>`;
        return;
    }

    renderAlbums(albums, albumsContainer);
}

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

    const favButtons = document.querySelectorAll('.btn-fav');
    favButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const albumData = {
                id: e.target.getAttribute('data-id'),
                title: e.target.getAttribute('data-title'),
                cover_medium: e.target.getAttribute('data-cover')
            };
            toggleFavorite(albumData);
        });
    });
}

/**
 * Inicializa la vista de Mis Álbumes (Colección Privada).
 */
export function initMyAlbums() {
    const appContainer = document.getElementById('app-container');
    
    appContainer.innerHTML = `
        <div class="detail-section">
            <h2>Mis Álbumes Guardados</h2>
            <div class="filter-section">
                <label for="rating-filter">Filtrar por calificación:</label>
                <select id="rating-filter">
                    <option value="all">Todas</option>
                    <option value="5">5 Estrellas</option>
                    <option value="4">4 Estrellas</option>
                    <option value="3">3 Estrellas</option>
                    <option value="2">2 Estrellas</option>
                    <option value="1">1 Estrella</option>
                    <option value="0">Sin calificar</option>
                </select>
            </div>
            <div id="favorites-container" class="results-container"></div>
        </div>
    `;

    const filterSelect = document.getElementById('rating-filter');
    filterSelect.addEventListener('change', (e) => {
        renderFavorites(e.target.value);
    });

    // Renderizar todos los favoritos inicialmente
    renderFavorites('all');
}

/**
 * Renderiza los álbumes favoritos con base en un filtro de calificación.
 */
function renderFavorites(filterValue) {
    const container = document.getElementById('favorites-container');
    let favorites = getFavorites();

    // Aplicar filtro si no es "all"
    if (filterValue !== 'all') {
        favorites = favorites.filter(fav => String(fav.rating) === String(filterValue));
    }

    if (favorites.length === 0) {
        container.innerHTML = `<p class="empty-state">No hay álbumes que coincidan con este criterio.</p>`;
        return;
    }

    const html = favorites.map(album => {
        // Generar las 5 estrellas dinámicamente
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            const isFilled = i <= (album.rating || 0) ? 'filled' : '';
            starsHtml += `<span class="star ${isFilled}" data-id="${album.id}" data-val="${i}">★</span>`;
        }

        return `
            <div class="album-card">
                <img src="${album.cover_medium}" alt="${album.title}">
                <h4>${album.title}</h4>
                <div class="rating-container">
                    ${starsHtml}
                </div>
                <div class="album-actions">
                    <button class="btn-tracks" data-id="${album.id}">Ver Canciones</button>
                    <button class="btn-fav btn-remove" data-id="${album.id}">❌ Eliminar</button>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;

    // Eventos para eliminar de favoritos
    const removeButtons = document.querySelectorAll('.btn-remove');
    removeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const albumId = e.target.getAttribute('data-id');
            toggleFavorite({ id: albumId }); // Esto lo eliminará
            renderFavorites(document.getElementById('rating-filter').value); // Refrescar vista
        });
    });

    // Eventos para calificar con estrellas
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', (e) => {
            const albumId = e.target.getAttribute('data-id');
            const ratingValue = parseInt(e.target.getAttribute('data-val'));
            rateAlbum(albumId, ratingValue);
            renderFavorites(document.getElementById('rating-filter').value); // Refrescar vista
        });
    });
}