import AuthManager from "./AuthManager.js";

// ============================================
// UI ELEMENTS
// ============================================

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const showRegisterLink = document.getElementById("showRegister");
const showLoginLink = document.getElementById("showLogin");

// Login form elements
const loginEmailInput = document.getElementById("loginEmail");
const loginPasswordInput = document.getElementById("loginPassword");
const loginMessage = document.getElementById("loginMessage");
const loginEmailError = document.getElementById("loginEmailError");
const loginPasswordError = document.getElementById("loginPasswordError");
const rememberMeCheckbox = document.getElementById("rememberMe");

// Register form elements
const registerEmailInput = document.getElementById("registerEmail");
const registerPasswordInput = document.getElementById("registerPassword");
const registerRoleSelect = document.getElementById("registerRole");
const registerMessage = document.getElementById("registerMessage");
const registerEmailError = document.getElementById("registerEmailError");
const registerPasswordError = document.getElementById("registerPasswordError");
const registerRoleError = document.getElementById("registerRoleError");
const termsAcceptCheckbox = document.getElementById("termsAccept");

// ============================================
// HELPER FUNCTIONS
// ============================================

function showMessage(messageElement, text, type = "error") {
  messageElement.textContent = text;
  messageElement.className = `form-message show ${type}`;
  setTimeout(() => {
    messageElement.classList.remove("show");
  }, 5000);
}

function clearErrors() {
  loginEmailError.textContent = "";
  loginPasswordError.textContent = "";
  registerEmailError.textContent = "";
  registerPasswordError.textContent = "";
  registerRoleError.textContent = "";
}

function switchToRegister(e) {
  e.preventDefault();
  loginForm.classList.remove("active-form");
  registerForm.classList.add("active-form");
  clearErrors();
  loginForm.reset();
  setTimeout(() => registerEmailInput.focus(), 300);
}

function switchToLogin(e) {
  e.preventDefault();
  registerForm.classList.remove("active-form");
  loginForm.classList.add("active-form");
  clearErrors();
  registerForm.reset();
  setTimeout(() => loginEmailInput.focus(), 300);
}

function validateLoginForm() {
  clearErrors();
  let isValid = true;

  // Email validation
  if (!loginEmailInput.value.trim()) {
    loginEmailError.textContent = "Email is required";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmailInput.value)) {
    loginEmailError.textContent = "Please enter a valid email";
    isValid = false;
  }

  // Password validation
  if (!loginPasswordInput.value.trim()) {
    loginPasswordError.textContent = "Password is required";
    isValid = false;
  }

  return isValid;
}

function validateRegisterForm() {
  clearErrors();
  let isValid = true;

  // Email validation
  if (!registerEmailInput.value.trim()) {
    registerEmailError.textContent = "Email is required";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerEmailInput.value)) {
    registerEmailError.textContent = "Please enter a valid email";
    isValid = false;
  }

  // Password validation
  if (!registerPasswordInput.value.trim()) {
    registerPasswordError.textContent = "Password is required";
    isValid = false;
  } else if (registerPasswordInput.value.length < 6) {
    registerPasswordError.textContent = "Password must be at least 6 characters";
    isValid = false;
  }

  // Role validation
  if (!registerRoleSelect.value) {
    registerRoleError.textContent = "Please select a role";
    isValid = false;
  }

  // Terms validation
  if (!termsAcceptCheckbox.checked) {
    showMessage(registerMessage, "You must accept the terms & conditions", "warning");
    isValid = false;
  }

  return isValid;
}

// ============================================
// PASSWORD VISIBILITY TOGGLE
// ============================================

document.querySelectorAll(".toggle-password").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const input = btn.parentElement.querySelector(".password-input");
    const icon = btn.querySelector("i");

    if (input.type === "password") {
      input.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      input.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  });
});

// ============================================
// FORM SWITCHING
// ============================================

showRegisterLink.addEventListener("click", switchToRegister);
showLoginLink.addEventListener("click", switchToLogin);

// ============================================
// LOGIN FORM SUBMISSION
// ============================================

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateLoginForm()) {
    return;
  }

  const loginBtn = loginForm.querySelector(".btn-login");
  const originalText = loginBtn.innerHTML;

  try {
    // Show loading state
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';

    const email = loginEmailInput.value.trim();
    const password = loginPasswordInput.value;

    const user = await AuthManager.login(email, password);

    // Save remember me preference
    if (rememberMeCheckbox.checked) {
      localStorage.setItem("rememberEmail", email);
    } else {
      localStorage.removeItem("rememberEmail");
    }

    showMessage(loginMessage, `Welcome back, ${user.email}!`, "success");

    // Redirect after short delay
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  } catch (error) {
    showMessage(loginMessage, error.message, "error");
    loginBtn.disabled = false;
    loginBtn.innerHTML = originalText;
  }
});

// ============================================
// REGISTER FORM SUBMISSION
// ============================================

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateRegisterForm()) {
    return;
  }

  const registerBtn = registerForm.querySelector(".btn-register");
  const originalText = registerBtn.innerHTML;

  try {
    // Show loading state
    registerBtn.disabled = true;
    registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';

    const email = registerEmailInput.value.trim();
    const password = registerPasswordInput.value;
    const role = registerRoleSelect.value;

    await AuthManager.register(email, password, role);

    showMessage(registerMessage, "Account created successfully! Redirecting to login...", "success");

    // Clear form
    registerForm.reset();
    termsAcceptCheckbox.checked = false;

    // Redirect to login after delay
    setTimeout(() => {
      switchToLogin({ preventDefault: () => {} });
      registerBtn.disabled = false;
      registerBtn.innerHTML = originalText;
    }, 2000);
  } catch (error) {
    showMessage(registerMessage, error.message, "error");
    registerBtn.disabled = false;
    registerBtn.innerHTML = originalText;
  }
});

// ============================================
// RESTORE REMEMBERED EMAIL
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  const rememberedEmail = localStorage.getItem("rememberEmail");
  if (rememberedEmail) {
    loginEmailInput.value = rememberedEmail;
    rememberMeCheckbox.checked = true;
    loginPasswordInput.focus();
  }
});

// ============================================
// LOGOUT FUNCTION
// ============================================

window.logout = function () {
  AuthManager.logout();
  window.location.href = "index1.html";
};

// ============================================
// REAL-TIME VALIDATION
// ============================================

// Login email validation
loginEmailInput.addEventListener("blur", () => {
  if (loginEmailInput.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmailInput.value)) {
    loginEmailError.textContent = "Please enter a valid email";
  } else {
    loginEmailError.textContent = "";
  }
});

// Register email validation
registerEmailInput.addEventListener("blur", () => {
  if (registerEmailInput.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerEmailInput.value)) {
    registerEmailError.textContent = "Please enter a valid email";
  } else {
    registerEmailError.textContent = "";
  }
});

// Register password validation
registerPasswordInput.addEventListener("blur", () => {
  if (registerPasswordInput.value.trim() && registerPasswordInput.value.length < 6) {
    registerPasswordError.textContent = "Password must be at least 6 characters";
  } else {
    registerPasswordError.textContent = "";
  }
});
