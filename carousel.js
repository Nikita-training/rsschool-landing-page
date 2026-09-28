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