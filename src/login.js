import { auth } from './firebase.js';
import {
    signInWithEmailAndPassword
} from "firebase/auth";
import { initNavbar } from './navbar.js';
import { initWhatsAppButton } from './whatsapp.js';

// Initialize Navbar & WhatsApp
initNavbar();
initWhatsAppButton();

// DOM Elements
const emailForm = document.getElementById('email-login-form');
const togglePasswordBtn = document.getElementById('toggle-login-password');
const passwordInput = document.getElementById('login-password');
const errorDisplay = document.getElementById('login-error');

// Password Visibility Toggle
if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePasswordBtn.querySelector('.icon').textContent = type === 'password' ? '👁️' : '🔒';
    });
}


// Email/Password Login
emailForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const submitBtn = document.getElementById('login-email-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Ingresando...';
        errorDisplay.classList.add('hidden');

        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = '/account.html';
    } catch (error) {
        console.error("Error en login de email:", error);
        const submitBtn = document.getElementById('login-email-btn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Ingresar';
        }

        let message = "Error al iniciar sesión. Por favor verifica tus credenciales.";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            message = "Email o contraseña incorrectos.";
        } else if (error.code === 'auth/invalid-email') {
            message = "El formato del email no es válido.";
        }

        errorDisplay.textContent = message;
        errorDisplay.classList.remove('hidden');
    }
});

