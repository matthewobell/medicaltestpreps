import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

import "./js/firebase-init.js";

async function signup() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const institution = document.getElementById("institution").value.trim();
  const residency = document.getElementById("residency").value.trim();
  const gradYear = document.getElementById("gradYear").value.trim();

  if (!name || !email || !password || !confirmPassword || !institution || !gradYear) {
    alert("Please complete all required fields.");
    return;
  }

  if (password.length < 8) {
    alert("Password must be at least 8 characters.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      window.firebaseAuth,
      email,
      password
    );

    const user = userCredential.user;

    await setDoc(doc(window.firebaseDB, "users", user.uid), {
      name: name,
      email: email,
      institution: institution,
      residency: residency,
      gradYear: gradYear,
      isPremium: true,
      createdAt: serverTimestamp()
    });

    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("signup-button");
  if (button) {
    button.addEventListener("click", signup);
  }
});
