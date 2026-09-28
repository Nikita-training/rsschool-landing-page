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


function createSlide(slide) {
    const el = document.createElement('div');
    el.className = 'carousel';

    const img = document.createElement('img');
    img.src = slide.image;
    img.alt = slide.alt;

    const title = document.createElement('h3');
    title.textContent = slide.title;

    const desc = document.createElement('p');
    desc.textContent = slide.description;

    const price = document.createElement('h3');
    price.className = 'price';
    price.textContent = slide.price;

    el.append(img, title, desc, price);
    return el;
}

async function initCarousel() {
    const res    = await fetch('./slider.json');
    const data   = await res.json();
    const slides = data.slides;

    const track   = document.querySelector('.carousel-track');
    const dots    = Array.from(document.querySelectorAll('.pagination .dot'));
    const prevBtn = document.querySelector('.left');
    const nextBtn = document.querySelector('.right');

    track.replaceChildren();

    const slide = document.createDocumentFragment();
    slide.append(createSlide(slides[slides.length - 1]));
    slides.forEach(s => slide.append(createSlide(s)));
    slide.append(createSlide(slides[0]));
    track.append(slide);

    const TOTAL = slides.length;
    const TRACK_SIZE = TOTAL + 2;

    let current = 1;

    function goTo(index, animate = true) {
        current = index;
        track.style.transition = animate ? 'transform 0.4s ease' : 'none';
        track.style.transform  = `translateX(-${(100) * index}%)`;

        const dotIndex = (index - 1 + TOTAL) % TOTAL;
        dots.forEach((dot, i) => dot.classList.toggle('is-active', i === dotIndex));
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    track.addEventListener('transitionend', (e) => {
        if (e.propertyName !== 'transform') return;
        if (current === TRACK_SIZE - 1) goTo(1, false);
        if (current === 0) goTo(TOTAL, false);
    });

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => goTo(i + 1));
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft')  prev();
        if (e.key === 'ArrowRight') next();
    });

    goTo(1, false);
}

initCarousel();