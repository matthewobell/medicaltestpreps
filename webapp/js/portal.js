// -------------------------------------
// AUTH GUARD (PREMIUM ACCESS)
// -------------------------------------

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

async function verifyPremiumAccess(){

onAuthStateChanged(window.firebaseAuth, async (user)=>{

if(!user){
window.location.href="login.html";
return;
}

try{

const userRef = doc(firebaseDB,"users",user.uid);
const userSnap = await getDoc(userRef);

if(!userSnap.exists()){
window.location.href="signup.html";
return;
}

const userData = userSnap.data();

if(userData.isPremium !== true){
window.location.href="signup.html";
return;
}

initializePortal();

}catch(error){

console.error("Access verification failed:",error);
window.location.href="login.html";

}

});

}


// -------------------------------------
// DROPDOWN
// -------------------------------------

function toggleDropdown(menuId,button){

const menu=document.getElementById(menuId);
const arrow=button.querySelector(".arrow");

const isOpen=menu.style.display==="grid";

document.querySelectorAll(".dropdown-menu").forEach(m=>{
m.style.display="none";
});

document.querySelectorAll(".arrow").forEach(a=>{
a.classList.remove("open");
});

if(!isOpen){

menu.style.display="grid";

if(arrow){
arrow.classList.add("open");
}

}

}

window.toggleDropdown = toggleDropdown;


// -------------------------------------
// LOAD QUIZ INDEX
// -------------------------------------

async function loadQuizIndex(){

const response = await fetch("data/quiz-index.json");
const index = await response.json();

const emigsMenu = document.getElementById("emigs-menu");
const flsMenu = document.getElementById("fls-menu");

index.files.forEach(file=>{

const link=document.createElement("a");

link.href=`quiz.html?file=${file}`;

let label=file
.replace("emigs/","")
.replace("fls/","")
.replace(".json","")
.replace(/-/g," ");

label=label.replace(/^emigs /i,"").replace(/^fls /i,"");

label=label.replace(/\b\w/g,l=>l.toUpperCase());

label=label.replace(" Part "," — Part ");

link.textContent=label;

if(file.startsWith("emigs/")){
emigsMenu.appendChild(link);
}

if(file.startsWith("fls/")){
flsMenu.appendChild(link);
}

});

}


// -------------------------------------
// INITIALIZE
// -------------------------------------

function initializePortal(){

document.getElementById("portal-content").style.display="block";

if(window.firebaseAnalytics){
logEvent(firebaseAnalytics,"portal_opened");
}

loadQuizIndex();

}


document.addEventListener("DOMContentLoaded", async ()=>{

await window.firebaseReady;

verifyPremiumAccess();

document.addEventListener("click",function(event){

const clickedInsideDropdown = event.target.closest(".dropdown");

if(!clickedInsideDropdown){

document.querySelectorAll(".dropdown-menu").forEach(menu=>{
menu.style.display="none";
});

document.querySelectorAll(".arrow").forEach(arrow=>{
arrow.classList.remove("open");
});

}

});

});
