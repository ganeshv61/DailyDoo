// User management with enhanced security
const users = JSON.parse(localStorage.getItem('users')) || [];

document.addEventListener("DOMContentLoaded", () => {
  // Password toggle for both forms
  const togglePassword = document.getElementById('togglePassword');
  if (togglePassword) {
    togglePassword.addEventListener('change', function() {
      const passwordField = document.getElementById('password');
      passwordField.type = this.checked ? 'text' : 'password';
    });
  }

  // Form submissions
  if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', loginUser);
  }

  if (document.getElementById('signupForm')) {
    document.getElementById('signupForm').addEventListener('submit', createAccount);
  }

  // Check for remembered user
  checkRememberedUser();
});

function hashPassword(password) {
  return CryptoJS.SHA256(password).toString();
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function createAccount(e) {
  e.preventDefault();

  const user = {
    fname: document.getElementById('fname').value.trim(),
    lname: document.getElementById('lname').value.trim(),
    age: parseInt(document.getElementById('age').value),
    email: document.getElementById('signupEmail').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    password: hashPassword(document.getElementById('signupPassword').value),
    joined: new Date().toISOString()
  };

  // Validation
  if (!validateEmail(user.email)) {
    alert("Please enter a valid email address.");
    return;
  }

  if (document.getElementById('signupPassword').value !== 
      document.getElementById('confirmPassword').value) {
    alert("Passwords don't match!");
    return;
  }

  if (users.some(u => u.email === user.email)) {
    alert("Email already registered!");
    return;
  }

  // Handle profile picture
  const profilePic = document.getElementById('profilePic').files[0];
  if (profilePic) {
    const reader = new FileReader();
    reader.onload = function(e) {
      user.profilePic = e.target.result;
      completeRegistration(user);
    };
    reader.readAsDataURL(profilePic);
  } else {
    completeRegistration(user);
  }
}

function completeRegistration(user) {
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
  
  // Auto-login if remember me was checked
  if (document.getElementById('rememberMe')?.checked) {
    localStorage.setItem('rememberedUser', user.email);
  }
  
  alert("Account created successfully!");
  window.location.href = "homepage.html?name=" + encodeURIComponent(user.fname);
}

function loginUser(e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = hashPassword(document.getElementById('password').value);
  const rememberMe = document.getElementById('rememberMe')?.checked;

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    if (rememberMe) {
      localStorage.setItem('rememberedUser', email);
    } else {
      localStorage.removeItem('rememberedUser');
    }
    window.location.href = `homepage.html?name=${encodeURIComponent(user.fname)}`;
  } else {
    alert("Invalid email or password.");
  }
}

function checkRememberedUser() {
  const rememberedEmail = localStorage.getItem('rememberedUser');
  if (rememberedEmail && document.getElementById('email')) {
    document.getElementById('email').value = rememberedEmail;
    document.getElementById('rememberMe').checked = true;
  }
}

function googleLogin() {
  // This would be replaced with actual Firebase auth in production
  alert("Google authentication would be implemented here");
  // Simulate successful login
  window.location.href = "homepage.html?name=GoogleUser";
}