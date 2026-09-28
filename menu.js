const INITIAL_LIMIT = 4;
const STEP = 4;
const WIDE_WIDTH = 1000;

let allProducts = [];
let currentCategory = 'coffee';
let visibleCount = INITIAL_LIMIT;

let itemsEl;
let refreshWrapper;
let refreshBtn;
let options;

function createCard(product) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.addEventListener('click', () => openModal(product));

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

function renderCategory() {
    const filtered = allProducts.filter(p => p.category === currentCategory);

    const isWide = window.innerWidth > WIDE_WIDTH;
    const limit = isWide ? filtered.length : visibleCount;
    const visible = filtered.slice(0, limit);

    itemsEl.replaceChildren();
    visible.forEach(product => {
        itemsEl.append(createCard(product));
    });

    const more = limit < filtered.length;
    refreshWrapper.style.display = more ? '' : 'none';
}

async function initMenu() {
    const res = await fetch('./products.json');
    allProducts = await res.json();

    itemsEl = document.querySelector('.items');
    refreshWrapper = document.querySelector('.refresh-wrapper');
    refreshBtn = document.querySelector('.refresh-btn');
    options = document.querySelectorAll('.menu-selection .option');

    renderCategory();

    options.forEach(option => {
        option.addEventListener('click', () => {
            if (option.classList.contains('active')) return;

            options.forEach(o => {
                o.classList.remove('active');
                o.querySelector('.icon').classList.remove('active');
            });
            option.classList.add('active');
            option.querySelector('.icon').classList.add('active');

            currentCategory = option.dataset.category;
            visibleCount = INITIAL_LIMIT;
            renderCategory();
        });
    });

    refreshBtn.addEventListener('click', () => {
        visibleCount += STEP;
        renderCategory();
    });

    window.addEventListener('resize', () => {
        visibleCount = INITIAL_LIMIT;
        renderCategory();
    });
}

initMenu();


function createModal(product) {
    const modal = document.querySelector('.modal');
    modal.replaceChildren();

    const image = document.createElement('div');
    image.className = 'modal-image';
    image.style.backgroundImage = `url('./assets/img/${product.image}')`;

    const info = document.createElement('div');
    info.className = 'modal-info';

    const title = document.createElement('h2');
    title.id = 'modal-title';
    title.textContent = product.name;

    const desc = document.createElement('p');
    desc.className = 'modal-desc';
    desc.textContent = product.description;

    const sizeLabel = document.createElement('h3');
    sizeLabel.className = 'modal-label';
    sizeLabel.textContent = 'Size';

    const sizesWrap = document.createElement('div');
    sizesWrap.className = 'modal-sizes';

    Object.entries(product.sizes).forEach(([key, data], i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'modal-size' + (i === 0 ? ' active' : '');
        btn.dataset.price = data['add-price'];

        const letter = document.createElement('span');
        letter.className = 'size-letter';
        letter.textContent = key.toUpperCase();

        const volume = document.createElement('span');
        volume.textContent = data.size;

        btn.append(letter, volume);
        sizesWrap.append(btn);
    });

    const addLabel = document.createElement('h3');
    addLabel.className = 'modal-label';
    addLabel.textContent = 'Additives';

    const additivesWrap = document.createElement('div');
    additivesWrap.className = 'modal-additives';

    product.additives.forEach((add, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'modal-additive';
        btn.dataset.price = add['add-price'];

        const num = document.createElement('span');
        num.className = 'additive-num';
        num.textContent = i + 1;

        const name = document.createElement('span');
        name.textContent = add.name;

        btn.append(num, name);
        additivesWrap.append(btn);
    });

    const totalRow = document.createElement('div');
    totalRow.className = 'modal-total';

    const totalLabel = document.createElement('span');
    totalLabel.textContent = 'Total:';

    const totalPrice = document.createElement('span');
    totalPrice.className = 'modal-price';
    totalPrice.textContent = `$${Number(product.price).toFixed(2)}`;

    totalRow.append(totalLabel, totalPrice);

    const note = document.createElement('p');
    note.className = 'modal-note';
    note.textContent = 'The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'modal-close';
    closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', closeModal);

    info.append(title, desc, sizeLabel, sizesWrap, addLabel, additivesWrap, totalRow, note, closeBtn);
    modal.append(image, info);

    const basePrice = Number(product.price);

    function recalc() {
        const sizeExtra = Number(sizesWrap.querySelector('.active')?.dataset.price || 0);
        const additivesExtra = [...additivesWrap.querySelectorAll('.active')]
            .reduce((sum, el) => sum + Number(el.dataset.price), 0);

        const total = basePrice + sizeExtra + additivesExtra;
        totalPrice.textContent = `$${total.toFixed(2)}`;
    }

    sizesWrap.querySelectorAll('.modal-size').forEach(btn => {
        btn.addEventListener('click', () => {
            sizesWrap.querySelectorAll('.modal-size').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            recalc();
        });
    });

    additivesWrap.querySelectorAll('.modal-additive').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            recalc();
        });
    });
}

const overlay = document.getElementById('modal-overlay');

function openModal(product) {
    createModal(product);
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    document.querySelector('.modal').replaceChildren();
}

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hidden) closeModal();
});
