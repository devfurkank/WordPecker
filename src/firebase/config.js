// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAUxymSokTslFti1E_ovGY7haoJqf2MiQ",
  authDomain: "wordpecker-furkan.firebaseapp.com",
  projectId: "wordpecker-furkan",
  storageBucket: "wordpecker-furkan.firebasestorage.app",
  messagingSenderId: "915039129800",
  appId: "1:915039129800:web:93a6eed02ccf7444ae95fd",
  measurementId: "G-PHPJYGWENL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;
