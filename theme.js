document.addEventListener("DOMContentLoaded", () => {
  const themeBtn = document.getElementById("themeBtn");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  // Initialize theme
  if (!localStorage.getItem("theme")) {
    localStorage.setItem("theme", prefersDark ? "dark" : "light");
  }
  
  applyTheme();
  
  // Toggle theme
  if (themeBtn) {
    themeBtn.addEventListener("click", toggleTheme);
  }
});

function applyTheme() {
  const theme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", theme);
  
  // Update button text
  const themeBtn = document.getElementById("themeBtn");
  if (themeBtn) {
    themeBtn.textContent = theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode";
  }
}

function toggleTheme() {
  const currentTheme = localStorage.getItem("theme") || "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  
  localStorage.setItem("theme", newTheme);
  applyTheme();
}