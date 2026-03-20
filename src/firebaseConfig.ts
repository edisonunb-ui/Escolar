// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAujnVPBtPzZfh4QIyZy8zJUiTnCV1qeal",
  authDomain: "pesquisa-62831355-9c7d1.firebaseapp.com",
  projectId: "pesquisa-62831355-9c7d1",
  storageBucket: "pesquisa-62831355-9c7d1.firebasestorage.app",
  messagingSenderId: "71498189131",
  appId: "1:71498189131:web:b8ef5785ddff4c844180ce"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Export a instância do banco de dados para ser usada em outros lugares
export { db, app };
