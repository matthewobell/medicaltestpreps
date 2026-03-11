import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

async function signup(){

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const institution = document.getElementById("institution").value;
  const residency = document.getElementById("residency").value;
  const gradYear = document.getElementById("gradYear").value;

  if(password !== confirmPassword){
    alert("Passwords do not match.");
    return;
  }

  try{

    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    const user = userCredential.user;

    await setDoc(doc(firebaseDB,"users",user.uid),{

      name: name,
      email: email,
      institution: institution,
      residency: residency,
      gradYear: gradYear,

      isPremium: true,
      createdAt: serverTimestamp()

    });

    window.location.href = "index.html";

  }
  catch(error){
    alert(error.message);
  }

}

window.signup = signup;
