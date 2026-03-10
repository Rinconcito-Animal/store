import { auth } from './firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

export function initNavbar() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('header nav');
    const navList = document.querySelector('header nav ul');

    if (!menuToggle || !nav || !navList) return;

    // Create overlay if it doesn't exist
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
    }

    // Create Close Button for Mobile Nav
    let closeBtn = nav.querySelector('.nav-close');
    if (!closeBtn) {
        closeBtn = document.createElement('button');
        closeBtn.className = 'nav-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Cerrar menú');
        nav.insertBefore(closeBtn, nav.firstChild);
    }

    // Close function helper
    const closeMenu = () => {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    };

    // Handle Authentication State for Navbar
    onAuthStateChanged(auth, (user) => {
        // Base navigation links
        const baseLinks = [
            { text: 'Inicio', href: '/index.html' },
            { text: 'Tienda', href: '/shop.html' }
        ];

        let authLinks = [];
        if (user) {
            authLinks.push({ text: 'Mi Cuenta', href: '/account.html' });
            authLinks.push({ text: 'Cerrar Sesión', href: '#', id: 'logout-btn' });
        } else {
            authLinks.push({ text: 'Ingresar', href: '/login.html' });
            authLinks.push({ text: 'Registrarse', href: '/signup.html' });
        }

        // Check if there's a cart toggle (only on shop.html)
        const cartToggle = document.getElementById('cart-toggle');
        const cartHtml = cartToggle ? cartToggle.closest('li').outerHTML : '';

        // Rebuild the nav list
        const linksHtml = [...baseLinks, ...authLinks].map(link => `
            <li id="${link.id ? link.id + '-item' : ''}">
                <a href="${link.href}" ${link.id ? `id="${link.id}"` : ''} class="${link.id === 'logout-btn' ? 'logout-link' : ''}">
                    ${link.text}
                </a>
            </li>
        `).join('');

        navList.innerHTML = linksHtml + cartHtml;

        // Re-attach cart toggle listener if it was preserved
        if (cartToggle) {
            // Usually the cart toggle listener is attached in shop.html script, 
            // but since we replaced the innerHTML, we might need to be careful.
            // However, the cartToggle variable still refers to the OLD element.
            // We need to find the NEW one in the DOM.
            const newCartToggle = document.getElementById('cart-toggle');
            if (newCartToggle && typeof window.toggleCart === 'function') {
                newCartToggle.addEventListener('click', window.toggleCart);
            }
            // Note: shop.html typically handles this internally after initNavbar()
        }

        // Re-attach logout listener if logged in
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    const { signOut } = await import('./firebase.js');
                    await signOut(auth);
                    window.location.href = '/index.html';
                } catch (error) {
                    console.error("Error al cerrar sesión:", error);
                }
            });
        }
    });

    // Toggle menu
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Event Listeners for closing
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMenu();
    });

    overlay.addEventListener('click', closeMenu);

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('active') && !nav.contains(e.target) && e.target !== menuToggle) {
            closeMenu();
        }
    });

    // Close menu when clicking any link
    nav.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            closeMenu();
        }
    });
}
