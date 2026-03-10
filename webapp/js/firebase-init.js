// -------------------------------------
// FIREBASE INITIALIZATION
// -------------------------------------

// Import Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// Your Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyBWe_6sDJOTmsNoRbuPnVHISA8jlwnDab8",
  authDomain: "medical-test-prep.firebaseapp.com",
  projectId: "medical-test-prep",
  storageBucket: "medical-test-prep.appspot.com",
  messagingSenderId: "106764694288",
  appId: "1:106764694288:web:b0aad15921ee12d956b95"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);


// Make available globally
window.firebaseAuth = auth;
window.firebaseDB = db;
