import { cart } from './cart.js';

const productsGrid = document.getElementById('products-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('product-search');
const suggestionsContainer = document.getElementById('search-suggestions');

// Modal Elements
const productModal = document.getElementById('product-modal');
const modalClose = document.getElementById('modal-close');
const modalImg = document.getElementById('modal-img');
const modalCategory = document.getElementById('modal-category');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalDescription = document.getElementById('modal-description');
const modalAddBtn = document.getElementById('modal-add-btn');

let allProducts = [];
let filterState = {
    category: 'all',
    species: 'all',
    search: ''
};

async function loadProducts() {
    try {
        const response = await fetch(`${import.meta.env.BASE_URL}products.json`);
        if (!response.ok) throw new Error('Failed to load products');

        allProducts = await response.json();
        renderProducts(allProducts);
    } catch (error) {
        console.error('Error loading products:', error);
        productsGrid.innerHTML = '<div class="error">Error al cargar productos. Por favor, intenta de nuevo más tarde.</div>';
    }
}

function renderProducts(products) {
    productsGrid.innerHTML = '';

    if (products.length === 0) {
        productsGrid.innerHTML = '<div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 40px; opacity: 0.5;">No se encontraron productos con los filtros seleccionados.</div>';
        return;
    }

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="product-badges">
                    ${product.species ? product.species.map(s => `<span class="species-badge">${s}</span>`).join('') : ''}
                </div>
            </div>
            <div class="product-info">
                <div class="product-top">
                    <span class="product-category">${product.category}</span>
                    <span class="product-sku">#${product.sku || ''}</span>
                </div>
                <h3 class="product-name">${product.name}</h3>
                <span class="product-brand">${product.brand || 'Marca propia'}</span>
                <p class="product-price">$${product.price.toLocaleString('es-CL')}</p>
                <button class="add-to-cart" data-id="${product.id}">Agregar al Carrito</button>
            </div>
        `;

        const addBtn = productCard.querySelector('.add-to-cart');
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            cart.addItem(product);
            addBtn.textContent = '¡Agregado!';
            addBtn.style.background = 'var(--accent-sage)';
            addBtn.style.color = 'var(--white)';
            setTimeout(() => {
                addBtn.textContent = 'Agregar al Carrito';
                addBtn.style.background = '';
                addBtn.style.color = '';
            }, 1000);
        });

        productCard.addEventListener('click', () => {
            openModal(product);
        });

        productsGrid.appendChild(productCard);
    });
}

function applyAllFilters() {
    const filtered = allProducts.filter(product => {
        const matchesCategory = filterState.category === 'all' || product.category === filterState.category;
        const matchesSpecies = filterState.species === 'all' || (product.species && product.species.includes(filterState.species));

        const searchTerms = filterState.search.toLowerCase().trim();
        const matchesSearch = searchTerms === '' ||
            product.name.toLowerCase().includes(searchTerms) ||
            (product.brand && product.brand.toLowerCase().includes(searchTerms)) ||
            (product.sku && product.sku.toLowerCase().includes(searchTerms));

        return matchesCategory && matchesSpecies && matchesSearch;
    });

    renderProducts(filtered);
}

function openModal(product) {
    modalImg.src = product.image;
    modalImg.alt = product.name;
    modalCategory.textContent = `${product.category} • ${product.subcategoria || ''}`;
    modalTitle.textContent = product.name;
    modalPrice.textContent = `$${product.price.toLocaleString('es-CL')}`;
    modalDescription.innerHTML = `
        <p style="margin-bottom: 20px;">${product.description}</p>
        <div style="font-size: 0.9rem; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 15px;">
            <p><strong>Marca:</strong> ${product.brand || 'N/A'}</p>
            <p><strong>Especies:</strong> ${product.species ? product.species.join(', ') : 'N/A'}</p>
            <p><strong>Código:</strong> ${product.sku || 'N/A'}</p>
        </div>
    `;

    modalAddBtn.onclick = () => {
        cart.addItem(product);
        modalAddBtn.textContent = '¡Agregado!';
        setTimeout(() => modalAddBtn.textContent = 'Agregar al Carrito', 1000);
    };

    productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    productModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Event Listeners
modalClose.addEventListener('click', closeModal);
productModal.addEventListener('click', (e) => {
    if (e.target === productModal) closeModal();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filterType = btn.getAttribute('data-filter');
        const value = btn.getAttribute('data-value');

        // Update state
        filterState[filterType] = value;

        // Update active class within the same filter group
        const groupBtns = document.querySelectorAll(`.filter-btn[data-filter="${filterType}"]`);
        groupBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        applyAllFilters();
    });
});

function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function renderSuggestions(query) {
    if (!suggestionsContainer) return;

    if (query.length < 2) {
        suggestionsContainer.classList.remove('active');
        return;
    }

    const searchTerms = query.toLowerCase().trim();
    const suggestions = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerms) ||
        (product.brand && product.brand.toLowerCase().includes(searchTerms)) ||
        (product.sku && product.sku.toLowerCase().includes(searchTerms))
    ).slice(0, 5);

    if (suggestions.length === 0) {
        suggestionsContainer.classList.remove('active');
        return;
    }

    suggestionsContainer.innerHTML = suggestions.map(p => `
        <div class="suggestion-item" data-id="${p.id}">
            <img src="${p.image}" alt="${p.name}" class="suggestion-img">
            <div class="suggestion-info">
                <span class="suggestion-name">${p.name}</span>
                <span class="suggestion-brand">${p.brand || 'Marca propia'}</span>
            </div>
            <span class="suggestion-price">$${p.price.toLocaleString('es-CL')}</span>
        </div>
    `).join('');

    suggestionsContainer.classList.add('active');

    // Add click events to suggestions
    suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = item.getAttribute('data-id');
            const product = allProducts.find(p => p.id == id);
            if (product) {
                searchInput.value = product.name;
                filterState.search = product.name;
                suggestionsContainer.classList.remove('active');
                applyAllFilters();
            }
        });
    });
}

const debouncedSearch = debounce((query) => {
    filterState.search = query;
    applyAllFilters();
    renderSuggestions(query);
}, 300);

searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
});

// Hide suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (suggestionsContainer && !e.target.closest('.search-container')) {
        suggestionsContainer.classList.remove('active');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', loadProducts);
