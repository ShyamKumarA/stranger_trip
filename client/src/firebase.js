// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "stranger-trip-82d21.firebaseapp.com",
  projectId: "stranger-trip-82d21",
  storageBucket: "stranger-trip-82d21.firebasestorage.app",
  messagingSenderId: "1020208747974",
  appId: "1:1020208747974:web:4ed7324354507126dbcec7",
  measurementId: "G-NY3VLN49Z5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);