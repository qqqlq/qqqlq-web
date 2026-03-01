import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    // @ts-ignore
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    // @ts-ignore
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    // @ts-ignore
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    // @ts-ignore
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    // @ts-ignore
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    // @ts-ignore
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    // @ts-ignore
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
