
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