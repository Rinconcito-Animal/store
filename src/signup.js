import { auth, db, storage, ref, uploadBytes, getDownloadURL } from './firebase.js';
import {
    createUserWithEmailAndPassword
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { initNavbar } from './navbar.js';

// Initialize Navbar
initNavbar();

// DOM Elements
const emailForm = document.getElementById('email-signup-form');
const petsContainer = document.getElementById('pets-container');
const addPetBtn = document.getElementById('add-pet-btn');
const togglePasswordBtn = document.getElementById('toggle-password');
const passwordInput = document.getElementById('password');

// Password Visibility Toggle
if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePasswordBtn.querySelector('.icon').textContent = type === 'password' ? '👁️' : '🔒';
    });
}

// Add more pets logic
addPetBtn.addEventListener('click', () => {
    const petEntry = document.createElement('div');
    petEntry.className = 'pet-entry';
    petEntry.innerHTML = `
        <div class="form-group">
            <label>Nombre de la Mascota</label>
            <input type="text" class="pet-name" placeholder="Ej: Pelusa" required>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Especie</label>
                <select class="pet-species" required>
                    <option value="">Selecciona</option>
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Otro">Otro</option>
                </select>
            </div>
            <div class="form-group">
                <label>Fecha Nacimiento (Aprox.)</label>
                <input type="date" class="pet-birthdate" required>
            </div>
        </div>
        <div class="form-group" style="margin-top: 15px;">
            <label>Foto de la Mascota</label>
            <input type="file" class="pet-image" accept="image/*" required>
        </div>
    `;
    petsContainer.appendChild(petEntry);
});

// Email/Password Signup
emailForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fullName = document.getElementById('fullName').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Collect pets
    const petEntries = document.querySelectorAll('.pet-entry');

    try {
        const submitBtn = emailForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creando cuenta...';

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        submitBtn.textContent = 'Subiendo fotos...';

        const pets = [];
        for (let i = 0; i < petEntries.length; i++) {
            const entry = petEntries[i];
            const petName = entry.querySelector('.pet-name').value;
            const petSpecies = entry.querySelector('.pet-species').value;
            const petBirthdate = entry.querySelector('.pet-birthdate').value;
            const imageFile = entry.querySelector('.pet-image').files[0];

            let imageUrl = '';
            if (imageFile) {
                const storageRef = ref(storage, `pets/${user.uid}/${Date.now()}_${imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            pets.push({
                name: petName,
                species: petSpecies,
                birthdate: petBirthdate,
                image: imageUrl
            });
        }

        // Save additional info to Firestore
        await setDoc(doc(db, "users", user.uid), {
            fullName,
            address,
            phone,
            email,
            pets,
            createdAt: new Date().toISOString()
        });

        console.log("Usuario registrado con email y guardado en Firestore:", user);
        alert("¡Registro exitoso!");
        window.location.href = '/account.html';
    } catch (error) {
        console.error("Error en registro de email:", error);
        alert("Error: " + error.message);
        const submitBtn = emailForm.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Registrarse';
    }
});
