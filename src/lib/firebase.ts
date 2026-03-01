import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const cleanEnv = (val?: string) => val ? val.replace(/^["']|["']$/g, '') : '';

const firebaseConfig = {
    // @ts-ignore
    apiKey: cleanEnv(import.meta.env.VITE_FIREBASE_API_KEY),
    // @ts-ignore
    authDomain: cleanEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
    // @ts-ignore
    projectId: cleanEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID),
    // @ts-ignore
    storageBucket: cleanEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
    // @ts-ignore
    messagingSenderId: cleanEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
    // @ts-ignore
    appId: cleanEnv(import.meta.env.VITE_FIREBASE_APP_ID),
    // @ts-ignore
    measurementId: cleanEnv(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID)
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
