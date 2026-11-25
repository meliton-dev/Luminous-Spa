// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import { getFirestore } from "firebase/firestore"; 
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from "firebase/storage";



// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "spa-firebase-tuto.firebaseapp.com",
  projectId: "spa-firebase-tuto",
  storageBucket: "spa-firebase-tuto.firebasestorage.app",
  messagingSenderId: "540938612236",
  appId: "1:540938612236:web:b6e875e90263e49a3e0829",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  // Add this line to initialize Firestore
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Add this line after initializing the app
const storage = getStorage(app);

// Update the exports
export { auth, db, storage };
