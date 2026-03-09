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
