function toggleDropdown(menuId, button){

  const menu = document.getElementById(menuId);
  const arrow = button.querySelector(".arrow");

  const isOpen = menu.style.display === "block";

  // close all dropdowns
  document.querySelectorAll(".dropdown-menu").forEach(m=>{
    m.style.display = "none";
  });

  document.querySelectorAll(".arrow").forEach(a=>{
    a.classList.remove("open");
  });

  if(!isOpen){
    menu.style.display = "block";
    arrow.classList.add("open");
  }

}


// -------------------------------------
// LOAD QUIZ INDEX
// -------------------------------------

async function loadQuizIndex(){

  const response = await fetch("data/quiz-index.json");
  const index = await response.json();

  const emigsMenu = document.getElementById("emigs-menu");
  const flsMenu = document.getElementById("fls-menu");

  index.files.forEach(file => {

    const link = document.createElement("a");

    link.href = `quiz.html?file=${file}`;

    let label = file
  .replace("emigs/","")
  .replace("fls/","")
  .replace(".json","")
  .replace(/-/g," ");

// Remove program prefix
label = label.replace(/^emigs /i,"").replace(/^fls /i,"");

// Capitalize words
label = label.replace(/\b\w/g, l => l.toUpperCase());

// Make "Part" formatting nicer
label = label.replace(" Part ", " — Part ");

    link.textContent = label;

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

document.addEventListener("DOMContentLoaded", () => {

  loadQuizIndex();

});
