// -------------------------------------
// FIREBASE INITIALIZATION
// -------------------------------------

// Import Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// Your Firebase configuration
const firebaseConfig = {

  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "medical-test-prep",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "XXXXXX",
  appId: "1:106764694288:ios:319234da530cbb58956b95"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);


// Make available globally
window.firebaseAuth = auth;
window.firebaseDB = db;
