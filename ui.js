// js/ui.js
import { searchArtist } from './api.js';

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
            <button class="btn-detail" data-id="${artist.id}">Ver Detalle</button>
        </div>
    `).join('');

    container.innerHTML = html;
}