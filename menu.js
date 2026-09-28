function createCard(product) {
    const card = document.createElement('div');
    card.className = 'item-card';

    const image = document.createElement('div');
    image.className = 'item-image';
    image.style.backgroundImage = `url('./assets/img/${product.image}')`;

    const desc = document.createElement('div');
    desc.className = 'item-description';

    const title = document.createElement('h3');
    title.textContent = product.name;

    const text = document.createElement('p');
    text.textContent = product.description;

    const price = document.createElement('h3');
    price.textContent = "$" + product.price;

    desc.append(title, text, price);
    card.append(image, desc);

    return card;
}

function renderCategory(products, category, container) {
    container.replaceChildren();

    const filtered = products.filter(p => p.category === category);

    filtered.forEach(product => {
        container.append(createCard(product));
    });
}

async function initMenu() {
    const res = await fetch('./products.json');
    const products = await res.json();

    const items = document.querySelector('.items');
    const options = document.querySelectorAll('.menu-selection .option');
    console.log(options)
    renderCategory(products, 'coffee', items);

    options.forEach(option => {
        option.addEventListener('click', () => {
            if (option.classList.contains('active')) return;

            options.forEach(o => {
                o.classList.remove('active');
                o.querySelector('.icon').classList.remove('active');
            });
            option.classList.add('active');
            option.querySelector('.icon').classList.add('active');

            const category = option.dataset.category;
            renderCategory(products, category, items);
        });
    });
}

initMenu();