// Toggle forms
document.getElementById("showRegister").addEventListener("click", function(e) {
  e.preventDefault();
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
});

document.getElementById("showLogin").addEventListener("click", function(e) {
  e.preventDefault();
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
});

// Register logic
document.getElementById("registerForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let email = document.getElementById("registerEmail").value;
  let password = document.getElementById("registerPassword").value;
  let role = document.getElementById("registerRole").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Only one admin allowed
  if (role === "admin") {
    let adminExists = users.some(user => user.role === "admin");
    if (adminExists) {
      alert("Admin account already exists!");
      return;
    }
  }

  // Prevent duplicate email
  let userExists = users.some(user => user.email === email);
  if (userExists) {
    alert("Email already registered!");
    return;
  }

  users.push({ email, password, role });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Registration successful! You can login now.");
  document.getElementById("registerForm").reset();
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
});

// Login logic
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let email = document.getElementById("loginEmail").value;
  let password = document.getElementById("loginPassword").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  let user = users.find(user => user.email === email && user.password === password);

  if (user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    alert("Login successful! Welcome " + user.email + " (" + user.role + ")");
    window.location.href = "index.html"; // redirect to dashboard
  } else {
    alert("Invalid credentials!");
  }
});

// Logout function (to be used in index.html)
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index1.html";
}
