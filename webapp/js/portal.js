function toggleDropdown(menuId, button){

  const menu = document.getElementById(menuId);
  const arrow = button.querySelector(".arrow");

  const isOpen = menu.style.display === "block";

  // close all dropdowns
  document.querySelectorAll(".dropdown-menu").forEach(menu => {
    menu.style.display = "none";
  });

  document.querySelectorAll(".arrow").forEach(arrow => {
    arrow.classList.remove("open");
  });

  // reopen selected if it was closed
  if(!isOpen){
    menu.style.display = "block";
    arrow.classList.add("open");
  }

}
