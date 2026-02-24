import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// TODO: REmplazar con las credenciales de tu proyecto de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDnqGQdge0tgSbGDLMf5n0NzdxWIjl3bpw",
    authDomain: "store-a4c42.firebaseapp.com",
    projectId: "store-a4c42",
    storageBucket: "store-a4c42.firebasestorage.app",
    messagingSenderId: "1089725910590",
    appId: "1:1089725910590:web:2d4271346e0b4abc8e8b6f",
    measurementId: "G-JSKKJP5WT6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { signOut, ref, uploadBytes, getDownloadURL };
