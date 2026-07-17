// js/auth.js
import { initSearch } from './ui.js';

/**
 * Inicializa la vista de inicio de sesión inyectando el HTML en el contenedor principal.
 */
export function initAuth() {
    const appContainer = document.getElementById('app-container');
    
    appContainer.innerHTML = `
        <div class="login-wrapper">
            <h2>Bienvenido a Deezer-Manager</h2>
            <p>Ingresa tus credenciales para continuar</p>
            <form id="login-form">
                <div class="form-group">
                    <label for="username">Usuario</label>
                    <input type="text" id="username" placeholder="Ingresa tu usuario" required>
                </div>
                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <input type="password" id="password" placeholder="Ingresa tu contraseña" required>
                </div>
                <button type="submit" id="btn-submit">Iniciar Sesión</button>
            </form>
        </div>
    `;

    document.getElementById('login-form').addEventListener('submit', handleLogin);
}

/**
 * Maneja el proceso de validación de credenciales.
 */
function handleLogin(event) {
    event.preventDefault();

    const spinner = document.getElementById('global-spinner');
    spinner.classList.remove('hidden');

    setTimeout(() => {
        spinner.classList.add('hidden');
        localStorage.setItem('authToken', 'token_demo_12345');
        document.getElementById('main-nav').classList.remove('hidden');
        
        // Redirigir al buscador
        initSearch();
    }, 2000);
}

/**
 * Cierra la sesión de forma segura y redirige a la pantalla de bienvenida.
 */
export function logout() {
    localStorage.removeItem('authToken');
    document.getElementById('main-nav').classList.add('hidden');
    initAuth();
}
