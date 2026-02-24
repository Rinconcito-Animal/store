import { cart } from './cart.js';
import { db } from './firebase.js';
import { collection, getDocs } from 'firebase/firestore';

const productsGrid = document.getElementById('products-grid');
const searchInput = document.getElementById('product-search');
const suggestionsContainer = document.getElementById('search-suggestions');
const resultsCount = document.getElementById('results-count');
const sortBy = document.getElementById('sort-by');

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

// --- Filter State ---
let filterState = {
    search: '',
    species: [],
    categories: [],
    brands: [],
    priceMin: 0,
    priceMax: Infinity,
};

// ============================
// PRODUCT LOADING
// ============================
async function loadProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, 'inventory'));
        allProducts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        if (allProducts.length === 0) {
            console.warn('No products found in Firestore inventory collection');
        }

        // Set price max from data
        const maxPrice = allProducts.length > 0 ? Math.max(...allProducts.map(p => p.price)) : 100000;
        filterState.priceMax = maxPrice;

        buildSidebarFilters();
        applyAllFilters();
    } catch (error) {
        console.error('Error loading products from Firestore:', error);
        productsGrid.innerHTML = '<div class="error" style="padding:40px; text-align:center; opacity:0.5;">Error al cargar productos. Intenta de nuevo más tarde.</div>';
    }
}

// ============================
// SIDEBAR FILTER BUILDER
// ============================
function buildSidebarFilters() {
    buildCheckboxGroup('filter-species', getUniqueValues('species', true), 'species');
    buildCheckboxGroup('filter-categories', getUniqueValues('category'), 'categories');
    buildCheckboxGroup('filter-brands', getUniqueValues('brand'), 'brands');
    buildPriceRange();
}

function getUniqueValues(field, isArray = false) {
    const values = new Set();
    allProducts.forEach(p => {
        if (isArray && Array.isArray(p[field])) {
            p[field].forEach(v => values.add(v));
        } else if (!isArray && p[field]) {
            values.add(p[field]);
        }
    });
    return [...values].sort();
}

function buildCheckboxGroup(containerId, values, filterKey) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = values.map(value => {
        // Count products matching this value
        const count = allProducts.filter(p => {
            if (Array.isArray(p[filterKey === 'species' ? 'species' : (filterKey === 'categories' ? 'category' : 'brand')])) {
                return p[filterKey === 'species' ? 'species' : 'category']?.includes(value);
            }
            const fieldMap = { species: 'species', categories: 'category', brands: 'brand' };
            const field = fieldMap[filterKey];
            return Array.isArray(p[field]) ? p[field].includes(value) : p[field] === value;
        }).length;

        const labelText = capitalize(value);
        return `
            <label class="filter-checkbox">
                <input type="checkbox" data-filter="${filterKey}" data-value="${value}">
                ${labelText}
                <span class="count">${count}</span>
            </label>
        `;
    }).join('');

    // Attach listeners
    container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', () => {
            const key = cb.getAttribute('data-filter');
            const val = cb.getAttribute('data-value');
            if (cb.checked) {
                if (!filterState[key].includes(val)) filterState[key].push(val);
            } else {
                filterState[key] = filterState[key].filter(v => v !== val);
            }
            applyAllFilters();
        });
    });
}

function buildPriceRange() {
    const maxPrice = Math.max(...allProducts.map(p => p.price));
    const slider = document.getElementById('price-slider');
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');

    if (!slider) return;

    slider.max = maxPrice;
    slider.value = maxPrice;
    priceMax.value = maxPrice.toLocaleString('es-CL');
    priceMin.value = 0;

    slider.addEventListener('input', () => {
        filterState.priceMax = parseInt(slider.value);
        priceMax.value = parseInt(slider.value).toLocaleString('es-CL');
        applyAllFilters();
    });

    priceMin.addEventListener('change', () => {
        filterState.priceMin = parseInt(priceMin.value.replace(/\D/g, '')) || 0;
        applyAllFilters();
    });

    priceMax.addEventListener('change', () => {
        const val = parseInt(priceMax.value.replace(/\D/g, '')) || maxPrice;
        filterState.priceMax = val;
        slider.value = val;
        applyAllFilters();
    });
}

// ============================
// FILTERING
// ============================
function applyAllFilters() {
    let filtered = allProducts.filter(product => {
        // Search
        const searchTerm = filterState.search.toLowerCase().trim();
        const matchesSearch = searchTerm === '' ||
            product.name.toLowerCase().includes(searchTerm) ||
            (product.brand && product.brand.toLowerCase().includes(searchTerm)) ||
            (product.sku && product.sku.toLowerCase().includes(searchTerm));

        // Species (multi-select OR logic)
        const matchesSpecies = filterState.species.length === 0 ||
            (product.species && filterState.species.some(s => product.species.includes(s)));

        // Category (multi-select OR logic)
        const matchesCategory = filterState.categories.length === 0 ||
            filterState.categories.includes(product.category);

        // Brand (multi-select OR logic)
        const matchesBrand = filterState.brands.length === 0 ||
            filterState.brands.includes(product.brand);

        // Price Range
        const matchesPrice = product.price >= filterState.priceMin &&
            product.price <= filterState.priceMax;

        return matchesSearch && matchesSpecies && matchesCategory && matchesBrand && matchesPrice;
    });

    // Sorting
    const sortValue = sortBy ? sortBy.value : 'featured';
    if (sortValue === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sortValue === 'newest') {
        filtered.sort((a, b) => {
            const dateA = a.created_at?.toMillis ? a.created_at.toMillis() : (a.created_at || 0);
            const dateB = b.created_at?.toMillis ? b.created_at.toMillis() : (b.created_at || 0);
            return dateB - dateA;
        });
    }

    renderProducts(filtered);
    updateResultsCount(filtered.length);
}

// ============================
// RENDER PRODUCTS
// ============================
function renderProducts(products) {
    productsGrid.innerHTML = '';

    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; opacity: 0.5;">
                <p style="font-size: 2rem; margin-bottom: 15px;">🐾</p>
                <p style="font-weight: 600;">No se encontraron productos con los filtros seleccionados.</p>
                <p style="font-size: 0.9rem; margin-top: 8px;">Intenta ajustar los filtros en la barra lateral.</p>
            </div>`;
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
                    <span class="product-category">${capitalize(product.category)}</span>
                    <span class="product-sku">#${product.sku || ''}</span>
                </div>
                <h3 class="product-name">${product.name}</h3>
                <span class="product-brand">${product.brand || 'Marca propia'}</span>
                <p class="product-price">$${product.price.toLocaleString('es-CL')}</p>
                <button class="add-to-cart" data-id="${product.id}">Agregar al Carrito</button>
            </div>
        `;

        const addBtn = productCard.querySelector('.add-to-cart');

        if (product.stock <= 0) {
            addBtn.textContent = 'Sin Stock';
            addBtn.disabled = true;
            addBtn.style.opacity = '0.5';
            addBtn.style.cursor = 'not-allowed';
        } else {
            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                cart.addItem(product);
            });
        }

        productCard.addEventListener('click', () => openModal(product));
        productsGrid.appendChild(productCard);
    });

    // Sync button states after rendering
    syncCartButtons();
}

function updateResultsCount(count) {
    if (resultsCount) {
        resultsCount.textContent = `${count} producto${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
    }
}

// ============================
// SYNC CART BUTTON STATES
// ============================
function syncCartButtons() {
    document.querySelectorAll('.add-to-cart[data-id]').forEach(btn => {
        const id = btn.getAttribute('data-id');
        const cartItem = cart.items.find(i => String(i.id) === String(id));
        if (cartItem) {
            btn.textContent = `✓ En carrito (${cartItem.quantity})`;
            btn.classList.add('in-cart');
        } else {
            btn.textContent = 'Agregar al Carrito';
            btn.classList.remove('in-cart');
        }
    });
}

// ============================
// MODAL
// ============================
function openModal(product) {
    modalImg.src = product.image;
    modalImg.alt = product.name;
    modalCategory.textContent = `${capitalize(product.category)} • ${product.subcategoria || ''}`;
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

// ============================
// CLEAR FILTERS
// ============================
function clearAllFilters() {
    filterState = {
        search: '',
        species: [],
        categories: [],
        brands: [],
        priceMin: 0,
        priceMax: Math.max(...allProducts.map(p => p.price)),
    };

    // Reset checkboxes
    document.querySelectorAll('.filter-checkbox input[type="checkbox"]').forEach(cb => cb.checked = false);

    // Reset slider and price inputs
    const slider = document.getElementById('price-slider');
    const priceMinInput = document.getElementById('price-min');
    const priceMaxInput = document.getElementById('price-max');
    if (slider) slider.value = slider.max;
    if (priceMinInput) priceMinInput.value = 0;
    if (priceMaxInput) priceMaxInput.value = parseInt(slider?.max || 0).toLocaleString('es-CL');

    // Reset search
    if (searchInput) searchInput.value = '';

    // Reset sort
    if (sortBy) sortBy.value = 'featured';

    applyAllFilters();
}

// ============================
// SEARCH & SUGGESTIONS
// ============================
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
    const suggestions = allProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerms) ||
        (p.brand && p.brand.toLowerCase().includes(searchTerms)) ||
        (p.sku && p.sku.toLowerCase().includes(searchTerms))
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

    suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = item.getAttribute('data-id');
            const product = allProducts.find(p => String(p.id) === String(id));
            if (product) {
                searchInput.value = product.name;
                filterState.search = product.name;
                suggestionsContainer.classList.remove('active');
                applyAllFilters();
            }
        });
    });
}

// ============================
// UTILS
// ============================
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================
// MOBILE DRAWER TOGGLE
// ============================
const sidebar = document.getElementById('shop-sidebar');
const filterOverlay = document.getElementById('filter-overlay');
const filterToggleBtn = document.getElementById('filter-toggle-btn');
const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
const activeFilterCountEl = document.getElementById('active-filter-count');

function openDrawer() {
    sidebar?.classList.add('drawer-open');
    filterOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDrawer() {
    sidebar?.classList.remove('drawer-open');
    filterOverlay?.classList.remove('active');
    document.body.style.overflow = '';
}

function updateActiveFilterCount() {
    if (!activeFilterCountEl) return;
    const count =
        filterState.species.length +
        filterState.categories.length +
        filterState.brands.length +
        (filterState.priceMin > 0 || filterState.priceMax < Infinity ? 1 : 0);

    if (count > 0) {
        activeFilterCountEl.textContent = count;
        activeFilterCountEl.classList.remove('hidden');
    } else {
        activeFilterCountEl.classList.add('hidden');
    }
}

filterToggleBtn?.addEventListener('click', openDrawer);
sidebarCloseBtn?.addEventListener('click', closeDrawer);
filterOverlay?.addEventListener('click', closeDrawer);

// ============================
// EVENT LISTENERS
// ============================
modalClose.addEventListener('click', closeModal);
productModal.addEventListener('click', (e) => { if (e.target === productModal) closeModal(); });

// Keep buttons in sync whenever the cart changes
cart.subscribe(syncCartButtons);

document.getElementById('clear-filters')?.addEventListener('click', () => {
    clearAllFilters();
    updateActiveFilterCount();
});

sortBy?.addEventListener('change', applyAllFilters);

const debouncedSearch = debounce((query) => {
    filterState.search = query;
    applyAllFilters();
    renderSuggestions(query);
}, 300);

searchInput?.addEventListener('input', (e) => debouncedSearch(e.target.value));

document.addEventListener('click', (e) => {
    if (suggestionsContainer && !e.target.closest('.search-container')) {
        suggestionsContainer.classList.remove('active');
    }
});

// Patch applyAllFilters to also update badge
const _originalApplyFilters = applyAllFilters;
// We re-wire via a wrapper after DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Wrap every checkbox listener to update badge
    document.querySelectorAll('.filter-checkbox input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', updateActiveFilterCount);
    });

    // Price range badge
    document.getElementById('price-slider')?.addEventListener('input', updateActiveFilterCount);
    document.getElementById('price-min')?.addEventListener('change', updateActiveFilterCount);
    document.getElementById('price-max')?.addEventListener('change', updateActiveFilterCount);
});

// Initialize
document.addEventListener('DOMContentLoaded', loadProducts);
