// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDLDXe41C19Ws4xmYShnujUgB9o097oI_s",
  authDomain: "petro-knowledge-hub.firebaseapp.com",
  projectId: "petro-knowledge-hub",
  storageBucket: "petro-knowledge-hub.firebasestorage.app",
  messagingSenderId: "437931706117",
  appId: "1:437931706117:web:8c74c80ccecc7fa8a2d96c"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
