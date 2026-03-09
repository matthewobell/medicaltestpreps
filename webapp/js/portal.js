function toggleDropdown(menuId, button){

const menu = document.getElementById(menuId);
const arrow = button.querySelector(".arrow");

if(menu.style.display === "block"){

menu.style.display = "none";
arrow.classList.remove("open");

}else{

menu.style.display = "block";
arrow.classList.add("open");

}

}


// -----------------------------
// QUIZ MODULE DEFINITIONS
// -----------------------------

const EMIGS_MODULES = [

{ title: "Module 1", file: "emigs_module1.json" },
{ title: "Module 2", file: "emigs_module2.json" },
{ title: "Module 3 – Part 1", file: "emigs_module3_part1.json" },
{ title: "Module 3 – Part 2", file: "emigs_module3_part2.json" },
{ title: "Module 4", file: "emigs_module4.json" },
{ title: "Module 5", file: "emigs_module5.json" },
{ title: "Module 6 – Part 1", file: "emigs_module6_part1.json" }

];

const FLS_MODULES = [

{ title: "Module 1", file: "fls_module1.json" },
{ title: "Module 2", file: "fls_module2.json" },
{ title: "Module 3", file: "fls_module3.json" },
{ title: "Module 4", file: "fls_module4.json" }

];


// -----------------------------
// BUILD DROPDOWNS
// -----------------------------

function populateMenu(menuId, modules){

const menu = document.getElementById(menuId);

modules.forEach(module => {

const link = document.createElement("a");

link.href = `quiz.html?file=${module.file}`;
link.textContent = module.title;

menu.appendChild(link);

});

}


// -----------------------------
// INITIALIZE PORTAL
// -----------------------------

document.addEventListener("DOMContentLoaded", () => {

populateMenu("emigs-menu", EMIGS_MODULES);

populateMenu("fls-menu", FLS_MODULES);

});
