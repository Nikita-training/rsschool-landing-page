initTheme()

function initTheme() {
    const root = document.documentElement;
    const light = document.querySelector('.theme-btn .light');
    const dark = document.querySelector('.theme-btn .dark');

    function apply(theme) {
        if (theme === 'light') {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', theme);
        }

        localStorage.setItem('theme', theme);

        light.classList.toggle('is-active', theme === 'light');
        dark.classList.toggle('is-active', theme === 'dark');
    }

    const saved = localStorage.getItem('theme') || 'light';
    apply(saved);

    light?.addEventListener('click', () => apply('light'));
    dark?.addEventListener('click', () => apply('dark'));
};


const burger = document.querySelector('.burger-btn');
const nav    = document.querySelector('#burger-menu');


burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('is-open');
    nav.classList.toggle('is-open', isOpen);
    blockScroll(isOpen)
});

nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('is-open');
        nav.classList.remove('is-open');
        blockScroll(false)
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        burger.classList.remove('is-open');
        nav.classList.remove('is-open');
        blockScroll(false)
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth >= 769) {
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        blockScroll(false)
    }
});

function blockScroll(isOpen) {
    document.body.style.overflow = isOpen ? 'hidden' : '';
}