// js/app.js
import { initAuth, logout } from './auth.js';
import { initSearch } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    registerServiceWorker();
    
    document.getElementById('btn-logout').addEventListener('click', logout);
    document.getElementById('btn-search').addEventListener('click', initSearch);
    
    const token = localStorage.getItem('authToken');
    if (token) {
        document.getElementById('main-nav').classList.remove('hidden');
        initSearch(); 
    } else {
        initAuth();
    }
});

function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeBtn.textContent = '☀️ Cambiar Tema';
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeBtn.textContent = '☀️ Cambiar Tema';
        } else {
            localStorage.setItem('theme', 'light');
            themeBtn.textContent = '🌙 Cambiar Tema';
        }
    });
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('../sw.js')
                .then(registration => console.log('SW registrado:', registration.scope))
                .catch(error => console.log('Error SW:', error));
        });
    }
}