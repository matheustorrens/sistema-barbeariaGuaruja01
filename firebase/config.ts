import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD-jmzZFnkK9l763pz3pDFTgPWqGQxZnTE",
  authDomain: "barbearia-guaruja-01.firebaseapp.com",
  projectId: "barbearia-guaruja-01",
  storageBucket: "barbearia-guaruja-01.firebasestorage.app",
  messagingSenderId: "36769301956",
  appId: "1:36769301956:web:b27391d8df3d08cd1bd091",
};

const app = initializeApp(firebaseConfig);

export const db   = getFirestore(app);
export const auth = getAuth(app);

// Default: session only — auth is cleared when the browser is closed.
// The login page switches to browserLocalPersistence when "Continuar logado" is checked.
setPersistence(auth, browserSessionPersistence).catch(() => {});
