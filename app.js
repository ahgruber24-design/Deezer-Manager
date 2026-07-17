// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    registerServiceWorker();
    
    // Aquí luego evaluaremos si hay sesión activa para mostrar el Login o el Buscador
});

/**
 * Lógica para alternar entre Modo Claro y Oscuro
 */
function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    
    // Verificar si el usuario ya tenía una preferencia guardada
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

/**
 * Registro del Service Worker para el Modo Offline
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('../sw.js')
                .then(registration => {
                    console.log('ServiceWorker registrado con éxito:', registration.scope);
                })
                .catch(error => {
                    console.log('Error al registrar el ServiceWorker:', error);
                });
        });
    }
}