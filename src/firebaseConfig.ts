// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcQ7vm_ZBas6dF8zY-F7Q56HqfqyNvvRA",
  authDomain: "questionarioescolar-ccdc5.firebaseapp.com",
  projectId: "questionarioescolar-ccdc5",
  storageBucket: "questionarioescolar-ccdc5.firebasestorage.app",
  messagingSenderId: "950664598936",
  appId: "1:950664598936:web:c3358364d3dc3f188b47ed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Export a instância do banco de dados para ser usada em outros lugares
export { db, auth, app };
