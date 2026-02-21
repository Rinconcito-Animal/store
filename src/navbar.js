export function initNavbar() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('header nav');
    const header = document.querySelector('header');

    if (!menuToggle || !nav) return;

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('active') && !nav.contains(e.target) && e.target !== menuToggle) {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Close menu when clicking a link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}
