import AuthManager from "./AuthManager.js";

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

// Register logic with password hashing
document.getElementById("registerForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const role = document.getElementById("registerRole").value;

  try {
    await AuthManager.register(email, password, role);
    alert("Registration successful! You can login now.");
    document.getElementById("registerForm").reset();
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
  } catch (error) {
    alert(error.message);
  }
});

// Login logic with password hashing
document.getElementById("loginForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const user = await AuthManager.login(email, password);
    alert("Login successful! Welcome " + user.email + " (" + user.role + ")");
    window.location.href = "index.html"; // redirect to dashboard
  } catch (error) {
    alert(error.message);
  }
});

// Logout function (to be used in index.html)
window.logout = function() {
  AuthManager.logout();
  window.location.href = "index1.html";
};
