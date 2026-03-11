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

// Disable common devtools shortcuts
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

  // Ctrl+U (view source)
  if (e.ctrlKey && e.key === "u") {
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
    document.body.innerHTML = "Developer tools detected. Access blocked.";
  }

}, 1000);
