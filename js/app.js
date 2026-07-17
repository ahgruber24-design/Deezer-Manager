// js/app.js
import { initAuth, logout } from './auth.js';
import { initSearch, initMyAlbums } from './ui.js';
import { syncPendingRatings } from './storage.js'; // Importamos el sincronizador

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    registerServiceWorker();
    setupNetworkListeners(); // Inicializar monitoreo de red
    
    document.getElementById('btn-logout').addEventListener('click', logout);
    document.getElementById('btn-search').addEventListener('click', initSearch);
    document.getElementById('btn-my-albums').addEventListener('click', initMyAlbums);
    
    const token = localStorage.getItem('authToken');
    if (token) {
        document.getElementById('main-nav').classList.remove('hidden');
        initSearch(); 
    } else {
        initAuth();
    }
});

/**
 * Escucha los cambios de conexión a internet para la Sincronización Diferida.
 */
function setupNetworkListeners() {
    window.addEventListener('online', () => {
        document.body.classList.remove('offline-mode');
        syncPendingRatings(); // Dispara la sincronización al volver la red
    });

    window.addEventListener('offline', () => {
        document.body.classList.add('offline-mode');
        console.warn('Estás navegando sin conexión. Los cambios se guardarán localmente.');
    });
}

function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    
    // Aplicar el tema guardado al iniciar
    if (savedTheme === 'dark') {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
        themeBtn.textContent = '☀️ Cambiar Tema';
    } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        themeBtn.textContent = '🌙 Cambiar Tema';
    }

    themeBtn.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-mode');
        
        if (isDark) {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
            themeBtn.textContent = '🌙 Cambiar Tema';
        } else {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            themeBtn.textContent = '☀️ Cambiar Tema';
        }
    });
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // Ruta relativa al documento HTML (index.html en la raíz)
            navigator.serviceWorker.register('./sw.js')
                .then(registration => console.log('SW registrado con alcance:', registration.scope))
                .catch(error => console.log('Error al registrar SW:', error));
        });
    }
}
