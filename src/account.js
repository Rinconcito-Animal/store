import { auth, db, storage, ref, uploadBytes, getDownloadURL } from './firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion, collection, query, where, getDocs } from 'firebase/firestore';
import { initNavbar } from './navbar.js';

// Initialize Navbar
initNavbar();

// UI Elements
const navBtns = document.querySelectorAll('.account-nav-btn');
const sections = document.querySelectorAll('.account-section');
const profileContainer = document.getElementById('profile-data');
const receiptsContainer = document.getElementById('receipts-list');
const petsGrid = document.getElementById('pets-grid');

// Modals
const petModal = document.getElementById('pet-modal');
const profileModal = document.getElementById('profile-modal');

// Forms
const addPetForm = document.getElementById('add-pet-form');
const editProfileForm = document.getElementById('edit-profile-form');

// Buttons
const openPetModalBtn = document.getElementById('open-pet-modal');
const closePetModalBtn = document.getElementById('close-pet-modal');
const openProfileModalBtn = document.getElementById('open-profile-modal');
const closeProfileModalBtn = document.getElementById('close-profile-modal');

let currentUserData = null;

// Tab Switching
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        sections.forEach(s => s.classList.remove('active'));
        document.getElementById(target).classList.add('active');
    });
});

// Modal Helpers
const toggleModal = (modal, show) => {
    if (show) modal.classList.add('active');
    else modal.classList.remove('active');
};

// Modal Listeners (Pets)
if (openPetModalBtn) openPetModalBtn.addEventListener('click', () => toggleModal(petModal, true));
if (closePetModalBtn) closePetModalBtn.addEventListener('click', () => toggleModal(petModal, false));
if (petModal) petModal.addEventListener('click', (e) => { if (e.target === petModal) toggleModal(petModal, false); });

// Modal Listeners (Profile)
if (openProfileModalBtn) {
    openProfileModalBtn.addEventListener('click', () => {
        if (currentUserData) {
            document.getElementById('user-name').value = currentUserData.fullName || '';
            document.getElementById('user-email').value = currentUserData.email || '';
            document.getElementById('user-phone').value = currentUserData.phone || '';
            document.getElementById('user-address').value = currentUserData.address || '';
        }
        toggleModal(profileModal, true);
    });
}
if (closeProfileModalBtn) closeProfileModalBtn.addEventListener('click', () => toggleModal(profileModal, false));
if (profileModal) profileModal.addEventListener('click', (e) => { if (e.target === profileModal) toggleModal(profileModal, false); });

// Auth Observer
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("Usuario detectado:", user.uid);
        await loadUserData(user.uid);
    } else {
        console.log("No hay usuario logueado, redirigiendo...");
        window.location.href = '/signup.html';
    }
});

async function loadUserData(uid) {
    try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
            currentUserData = userDoc.data();
            renderProfile(currentUserData);
            renderPets(currentUserData.pets || []);
            await renderHistory();
        } else {
            console.error("No se encontró el perfil en Firestore");
            profileContainer.innerHTML = '<p>Error al cargar el perfil. Por favor intenta de nuevo.</p>';
        }
    } catch (error) {
        console.error("Error cargando datos:", error);
    }
}

function renderProfile(data) {
    profileContainer.innerHTML = `
        <div class="info-group">
            <span class="info-label">Nombre Completo</span>
            <span class="info-value">${data.fullName || 'No especificado'}</span>
        </div>
        <div class="info-group">
            <span class="info-label">Email</span>
            <span class="info-value">${data.email || 'No especificado'}</span>
        </div>
        <div class="info-group">
            <span class="info-label">Teléfono</span>
            <span class="info-value">${data.phone || 'No especificado'}</span>
        </div>
        <div class="info-group">
            <span class="info-label">Dirección de Despacho</span>
            <span class="info-value">${data.address || 'No especificada'}</span>
        </div>
    `;
}

function renderPets(pets) {
    if (pets.length === 0) {
        petsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; opacity: 0.5;">Aún no has registrado mascotas.</p>';
        return;
    }

    petsGrid.innerHTML = pets.map((p, index) => `
        <div class="pet-card">
            <div class="pet-img">
                <img src="${p.image || 'https://images.unsplash.com/photo-1541364983171-a496838382d6?auto=format&fit=crop&q=80&w=400'}" alt="${p.name}">
                <button class="update-photo-btn" data-index="${index}" title="Actualizar Foto">
                    <span>📷</span>
                </button>
            </div>
            <div class="pet-info">
                <span class="pet-type">${p.species}</span>
                <h3 class="pet-name">${p.name}</h3>
                <p class="pet-meta">Nacimiento: ${p.birthdate}</p>
                ${p.breed ? `<p class="pet-meta">Raza: ${p.breed}</p>` : ''}
            </div>
        </div>
    `).join('');

    // Add listeners to new buttons
    document.querySelectorAll('.update-photo-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.getAttribute('data-index');
            handleUpdatePetPhoto(index);
        });
    });
}

async function handleUpdatePetPhoto(index) {
    const user = auth.currentUser;
    if (!user || !currentUserData) return;

    // Create a hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            // Show loading state on the button
            const btn = document.querySelector(`.update-photo-btn[data-index="${index}"]`);
            const originalContent = btn.innerHTML;
            btn.innerHTML = '<span>⏳</span>';
            btn.disabled = true;

            // 1. Upload to Storage
            const storageRef = ref(storage, `pets/${user.uid}/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const imageUrl = await getDownloadURL(snapshot.ref);

            // 2. Update Firestore Array
            const updatedPets = [...currentUserData.pets];
            updatedPets[index].image = imageUrl;

            await updateDoc(doc(db, "users", user.uid), {
                pets: updatedPets
            });

            // 3. Reload UI
            await loadUserData(user.uid);
            alert("¡Foto actualizada con éxito!");
        } catch (error) {
            console.error("Error al actualizar foto:", error);
            alert("Hubo un error al subir la foto.");
            const btn = document.querySelector(`.update-photo-btn[data-index="${index}"]`);
            btn.innerHTML = '<span>📷</span>';
            btn.disabled = false;
        }
    };

    fileInput.click();
}

async function renderHistory() {
    const user = auth.currentUser;
    if (!user) return;

    receiptsContainer.innerHTML = '<p style="text-align:center; opacity:0.5; padding:20px;">Cargando historial...</p>';

    try {
        const ordersQuery = query(
            collection(db, 'orders'),
            where('userId', '==', user.uid)
        );
        const snapshot = await getDocs(ordersQuery);

        if (snapshot.empty) {
            receiptsContainer.innerHTML = '<p style="text-align:center; opacity:0.5; padding:20px;">Aún no tienes compras registradas.</p>';
            return;
        }

        // Sort client-side by createdAt descending
        const orders = snapshot.docs
            .map(docSnap => docSnap.data())
            .sort((a, b) => {
                const timeA = a.createdAt?.toMillis?.() || 0;
                const timeB = b.createdAt?.toMillis?.() || 0;
                return timeB - timeA;
            });

        receiptsContainer.innerHTML = orders.map(r => {
            const itemsSummary = r.items
                ? r.items.map(i => `${i.name} x${i.quantity}`).join(', ')
                : '';

            const deliveryDateFormatted = r.deliveryDate
                ? new Date(r.deliveryDate + 'T00:00:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })
                : null;

            return `
            <div class="receipt-card">
                <div class="receipt-icon">📄</div>
                <div class="receipt-details">
                    <h4>Compra #${r.id || 'N/A'}</h4>
                    <p>Fecha Compra: ${r.date || 'Sin fecha'}</p>
                    ${deliveryDateFormatted ? `<p style="font-weight: 700; color: var(--accent-sage);">📅 Entrega: ${deliveryDateFormatted} (18:00 - 22:00)</p>` : ''}
                    <p style="font-size:0.8rem; opacity:0.7; margin-top:4px;">${itemsSummary}</p>
                    <p style="font-size:0.8rem; opacity:0.7;">${r.paymentMethod || ''} · ${r.deliveryMethod || ''}${r.deliveryAddress ? ' · ' + r.deliveryAddress : ''}</p>
                </div>
                <div class="receipt-amount">$${(r.total || 0).toLocaleString('es-CL')}</div>
                <div class="receipt-status status-completed">${r.status || 'Completado'}</div>
            </div>`;
        }).join('');
    } catch (error) {
        console.error('Error cargando historial de compras:', error);
        receiptsContainer.innerHTML = '<p style="text-align:center; color:#ff4444; padding:20px;">Error al cargar el historial. Intenta de nuevo más tarde.</p>';
    }
}

// Update Profile
if (editProfileForm) {
    editProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) return;

        const updatedData = {
            fullName: document.getElementById('user-name').value,
            phone: document.getElementById('user-phone').value,
            address: document.getElementById('user-address').value
        };

        try {
            await updateDoc(doc(db, "users", user.uid), updatedData);
            toggleModal(profileModal, false);
            loadUserData(user.uid);
            alert("Perfil actualizado correctamente");
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
            alert("Error al actualizar el perfil.");
        }
    });
}

// Add Pet
if (addPetForm) {
    addPetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) return;

        const submitBtn = addPetForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        const petName = document.getElementById('pet-name').value;
        const petSpecies = document.getElementById('pet-type').value;
        const petBreed = document.getElementById('pet-breed').value;
        const petBirthdate = document.getElementById('pet-age').value;
        const imageFile = document.getElementById('pet-image').files[0];

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Subiendo...';

            let imageUrl = '';
            if (imageFile) {
                const storageRef = ref(storage, `pets/${user.uid}/${Date.now()}_${imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            const newPet = {
                name: petName,
                species: petSpecies,
                breed: petBreed,
                birthdate: petBirthdate,
                image: imageUrl
            };

            await updateDoc(doc(db, "users", user.uid), {
                pets: arrayUnion(newPet)
            });

            addPetForm.reset();
            toggleModal(petModal, false);
            loadUserData(user.uid);
            alert("Mascota registrada correctamente");
        } catch (error) {
            console.error("Error al agregar mascota:", error);
            alert("Error al registrar la mascota.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}
