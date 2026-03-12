// -------------------------------------
// FIREBASE INITIALIZATION
// -------------------------------------

// Import Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { getFirestore, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-analytics.js";


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWe_6sDJOTmsNoRbuPnVHISA8jlwnDab8",
  authDomain: "medical-test-prep.firebaseapp.com",
  projectId: "medical-test-prep",
  storageBucket: "medical-test-prep.firebasestorage.app",
  messagingSenderId: "106764694288",
  appId: "1:106764694288:web:b0aa0d15921ee12d956b95",
  measurementId: "G-F46FLL5GZH"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (e) {
  console.warn("Analytics unavailable on this browser:", e);
}

const auth = getAuth(app);
const db = getFirestore(app);

window.firebaseReady = setPersistence(auth, browserLocalPersistence);

window.firebaseAuth = auth;
window.firebaseDB = db;
window.serverTimestamp = serverTimestamp;
window.firebaseAnalytics = analytics;
window.logEvent = logEvent;
