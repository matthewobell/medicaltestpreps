// -------------------------------------
// BASIC ANTI-SCRAPING PROTECTION
// -------------------------------------

// Disable right-click
document.addEventListener("contextmenu", function(e) {
  e.preventDefault();
});

// Disable text selection
document.addEventListener("selectstart", function(e) {
  e.preventDefault();
});

// Disable drag
document.addEventListener("dragstart", function(e) {
  e.preventDefault();
});

// Disable copy
document.addEventListener("copy", function(e) {
  e.preventDefault();
});

// Disable cut
document.addEventListener("cut", function(e) {
  e.preventDefault();
});

// Disable paste
document.addEventListener("paste", function(e) {
  e.preventDefault();
});


// -------------------------------------
// BLOCK COMMON SCRAPING SHORTCUTS
// -------------------------------------

document.addEventListener("keydown", function(e) {

  // F12
  if (e.key === "F12") {
    e.preventDefault();
  }

  // Ctrl+Shift+I
  if (e.ctrlKey && e.shiftKey && e.key === "I") {
    e.preventDefault();
  }

  // Ctrl+Shift+J
  if (e.ctrlKey && e.shiftKey && e.key === "J") {
    e.preventDefault();
  }

  // Ctrl+Shift+C
  if (e.ctrlKey && e.shiftKey && e.key === "C") {
    e.preventDefault();
  }

  // Ctrl+U (view source)
  if (e.ctrlKey && e.key.toLowerCase() === "u") {
    e.preventDefault();
  }

  // Ctrl+S (save page)
  if (e.ctrlKey && e.key.toLowerCase() === "s") {
    e.preventDefault();
  }

  // Ctrl+P (print page)
  if (e.ctrlKey && e.key.toLowerCase() === "p") {
    e.preventDefault();
  }

});


// -------------------------------------
// DEVTOOLS DETECTION
// -------------------------------------

setInterval(function() {

  const threshold = 160;

  if (
    window.outerWidth - window.innerWidth > threshold ||
    window.outerHeight - window.innerHeight > threshold
  ) {

    document.body.innerHTML =
      "<h1 style='font-family:sans-serif;text-align:center;margin-top:40vh;'>Developer tools detected.<br>Access blocked.</h1>";

  }

}, 1000);


// -------------------------------------
// CONSOLE TAMPER DETECTION
// -------------------------------------

(function(){

  const element = new Image();

  Object.defineProperty(element, 'id', {
    get: function() {
      document.body.innerHTML =
        "<h1 style='font-family:sans-serif;text-align:center;margin-top:40vh;'>Unauthorized inspection detected.</h1>";
    }
  });

  console.log('%c', element);

})();


// -------------------------------------
// DISABLE PRINT SCREEN KEY (LIMITED)
// -------------------------------------

document.addEventListener("keyup", function(e) {

  if (e.key === "PrintScreen") {

    navigator.clipboard.writeText("");
    alert("Screenshots are disabled on this page.");

  }

});
