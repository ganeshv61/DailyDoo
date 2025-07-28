document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("signupPassword");
  const strengthBar = document.getElementById("passwordStrength");
  const strengthText = document.getElementById("strengthText");
  
  if (passwordInput) {
    passwordInput.addEventListener("input", checkPasswordStrength);
  }
});

function checkPasswordStrength() {
  const password = document.getElementById("signupPassword").value;
  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  
  // Complexity checks
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  
  // Update UI
  const strengthBar = document.getElementById("passwordStrength");
  const strengthText = document.getElementById("strengthText");
  
  strengthBar.value = strength;
  
  // Visual feedback
  if (strength <= 2) {
    strengthBar.className = "weak";
    strengthText.textContent = "Weak";
    strengthText.style.color = "#ef5350";
  } else if (strength === 3) {
    strengthBar.className = "medium";
    strengthText.textContent = "Medium";
    strengthText.style.color = "#ffa726";
  } else {
    strengthBar.className = "strong";
    strengthText.textContent = "Strong";
    strengthText.style.color = "#66bb6a";
  }
}