const mockUser = {
    name: "Juan Pérez",
    email: "juan.perez@email.com",
    phone: "+56 9 1234 5678",
    address: "Calle Los Aromos 123, Providencia, Santiago"
};

const mockReceipts = [
    { id: "BOL-2026-001", date: "15 Feb 2026", amount: 65000, status: "Completado" },
    { id: "BOL-2026-045", date: "02 Feb 2026", amount: 15000, status: "Completado" },
    { id: "BOL-2026-102", date: "20 Jan 2026", amount: 42500, status: "Completado" }
];

const mockPets = [
    {
        name: "Max",
        type: "Perro",
        breed: "Golden Retriever",
        age: "3 años",
        image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400"
    },
    {
        name: "Luna",
        type: "Gato",
        breed: "Siamés",
        age: "2 años",
        image: "https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=400"
    }
];

// Elements
const navBtns = document.querySelectorAll('.account-nav-btn');
const sections = document.querySelectorAll('.account-section');
const profileContainer = document.getElementById('profile-data');
const receiptsContainer = document.getElementById('receipts-list');
const petsContainer = document.getElementById('pets-grid');
const petModal = document.getElementById('pet-modal');
const addPetForm = document.getElementById('add-pet-form');
const openPetModalBtn = document.getElementById('open-pet-modal');
const closePetModalBtn = document.getElementById('close-pet-modal');

const profileModal = document.getElementById('profile-modal');
const editProfileForm = document.getElementById('edit-profile-form');
const openProfileModalBtn = document.getElementById('open-profile-modal');
const closeProfileModalBtn = document.getElementById('close-profile-modal');

// Tab Switching
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');

        // Update active buttons
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update active sections
        sections.forEach(s => s.classList.remove('active'));
        document.getElementById(target).classList.add('active');
    });
});

// Modal Interaction
if (openModalBtn && closeModalBtn && petModal) {
    openModalBtn.addEventListener('click', () => {
        petModal.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
        petModal.classList.remove('active');
    });

    // Close when clicking overlay
    petModal.addEventListener('click', (e) => {
        if (e.target === petModal) {
            petModal.classList.remove('active');
        }
    });
}

// Modal Interaction (Pets)
if (openPetModalBtn && closePetModalBtn && petModal) {
    openPetModalBtn.addEventListener('click', () => {
        petModal.classList.add('active');
    });

    closePetModalBtn.addEventListener('click', () => {
        petModal.classList.remove('active');
    });

    petModal.addEventListener('click', (e) => {
        if (e.target === petModal) petModal.classList.remove('active');
    });
}

// Modal Interaction (Profile)
if (openProfileModalBtn && closeProfileModalBtn && profileModal) {
    openProfileModalBtn.addEventListener('click', () => {
        const user = JSON.parse(localStorage.getItem('user_profile')) || mockUser;
        document.getElementById('user-name').value = user.name;
        document.getElementById('user-email').value = user.email;
        document.getElementById('user-phone').value = user.phone;
        document.getElementById('user-address').value = user.address;
        profileModal.classList.add('active');
    });

    closeProfileModalBtn.addEventListener('click', () => {
        profileModal.classList.remove('active');
    });

    profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) profileModal.classList.remove('active');
    });
}

// Render Functions
function renderProfile() {
    const user = JSON.parse(localStorage.getItem('user_profile')) || mockUser;
    profileContainer.innerHTML = `
        <div class="info-group">
            <span class="info-label">Nombre Completo</span>
            <span class="info-value">${user.name}</span>
        </div>
        <div class="info-group">
            <span class="info-label">Email</span>
            <span class="info-value">${user.email}</span>
        </div>
        <div class="info-group">
            <span class="info-label">Teléfono</span>
            <span class="info-value">${user.phone}</span>
        </div>
        <div class="info-group">
            <span class="info-label">Dirección de Despacho</span>
            <span class="info-value">${user.address}</span>
        </div>
    `;
}

function renderHistory() {
    const realHistory = JSON.parse(localStorage.getItem('purchase_history')) || [];
    const allHistory = [...realHistory, ...mockReceipts];

    if (allHistory.length === 0) {
        receiptsContainer.innerHTML = '<p style="text-align: center; opacity: 0.5; margin-top: 40px;">No tienes compras registradas</p>';
        return;
    }

    receiptsContainer.innerHTML = allHistory.map(r => `
        <div class="receipt-card">
            <div class="receipt-icon">📄</div>
            <div class="receipt-details">
                <h4>Compra #${r.id}</h4>
                <p>Fecha: ${r.date}</p>
                ${r.items ? `<p style="font-size: 0.8rem; opacity: 0.5;">${r.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</p>` : ''}
            </div>
            <div class="receipt-amount">$${r.total ? r.total.toLocaleString('es-CL') : r.amount.toLocaleString('es-CL')}</div>
            <div class="receipt-status status-completed">${r.status}</div>
        </div>
    `).join('');
}

function renderPets() {
    const userPets = JSON.parse(localStorage.getItem('user_pets')) || [];
    const allPets = [...userPets, ...mockPets];

    petsContainer.innerHTML = allPets.map(p => `
        <div class="pet-card">
            <div class="pet-img">
                <img src="${p.image || 'https://images.unsplash.com/photo-1541364983171-a496838382d6?auto=format&fit=crop&q=80&w=400'}" alt="${p.name}">
            </div>
            <div class="pet-info">
                <span class="pet-type">${p.type} • ${p.breed}</span>
                <h3 class="pet-name">${p.name}</h3>
                <p class="pet-meta">Edad: ${p.age}</p>
            </div>
        </div>
    `).join('');
}

// Save Pet
if (addPetForm) {
    addPetForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newPet = {
            name: document.getElementById('pet-name').value,
            type: document.getElementById('pet-type').value,
            breed: document.getElementById('pet-breed').value,
            age: document.getElementById('pet-age').value,
            image: document.getElementById('pet-image').value
        };

        const userPets = JSON.parse(localStorage.getItem('user_pets')) || [];
        userPets.unshift(newPet);
        localStorage.setItem('user_pets', JSON.stringify(userPets));

        // Reset and close
        addPetForm.reset();
        petModal.classList.remove('active');

        // Re-render
        renderPets();
    });
}

// Save Profile
if (editProfileForm) {
    editProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const updatedUser = {
            name: document.getElementById('user-name').value,
            email: document.getElementById('user-email').value,
            phone: document.getElementById('user-phone').value,
            address: document.getElementById('user-address').value
        };

        localStorage.setItem('user_profile', JSON.stringify(updatedUser));
        profileModal.classList.remove('active');
        renderProfile();
    });
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    renderProfile();
    renderHistory();
    renderPets();
});
