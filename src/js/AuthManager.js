// AuthManager.js - Centralized authentication and authorization

class AuthManager {
  constructor() {
    this.USERS_KEY = "inventory_users";
    this.LOGGED_USER_KEY = "inventory_loggedInUser";
  }

  // Simple hash function using Web Crypto API
  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }

  // Get all users
  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(this.USERS_KEY)) || [];
    } catch (error) {
      console.error("Error reading users:", error);
      return [];
    }
  }

  // Save users
  saveUsers(users) {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Error saving users:", error);
    }
  }

  // Register new user
  async register(email, password, role) {
    const users = this.getUsers();

    // Validate inputs
    if (!email || !password || !role) {
      throw new Error("All fields are required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // Validate password strength
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    // Check for admin limit
    if (role === "admin") {
      const adminExists = users.some(user => user.role === "admin");
      if (adminExists) {
        throw new Error("Admin account already exists!");
      }
    }

    // Check for duplicate email
    const userExists = users.some(user => user.email === email);
    if (userExists) {
      throw new Error("Email already registered!");
    }

    // Hash password and save user
    const hashedPassword = await this.hashPassword(password);
    users.push({ 
      email, 
      password: hashedPassword, 
      role,
      createdAt: new Date().toISOString()
    });
    
    this.saveUsers(users);
    return true;
  }

  // Login user
  async login(email, password) {
    const users = this.getUsers();

    // Validate inputs
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Hash the entered password
    const hashedPassword = await this.hashPassword(password);

    // Find user
    const user = users.find(
      u => u.email === email && u.password === hashedPassword
    );

    if (!user) {
      throw new Error("Invalid credentials!");
    }

    // Save logged in user (without password)
    const loggedUser = { 
      email: user.email, 
      role: user.role,
      loginTime: new Date().toISOString()
    };
    
    try {
      localStorage.setItem(this.LOGGED_USER_KEY, JSON.stringify(loggedUser));
    } catch (error) {
      console.error("Error saving logged user:", error);
      throw new Error("Failed to save session");
    }

    return loggedUser;
  }

  // Logout user
  logout() {
    try {
      localStorage.removeItem(this.LOGGED_USER_KEY);
      // Also remove old keys for backward compatibility
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("role");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }

  // Get currently logged in user
  getCurrentUser() {
    try {
      const user = localStorage.getItem(this.LOGGED_USER_KEY);
      if (user) {
        return JSON.parse(user);
      }
      
      // Check old key for backward compatibility
      const oldUser = localStorage.getItem("loggedInUser");
      if (oldUser) {
        return JSON.parse(oldUser);
      }
      
      return null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }

  // Check if user has specific role
  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.role === role;
  }

  // Check if user is admin
  isAdmin() {
    return this.hasRole("admin");
  }

  // Check if user is regular user
  isUser() {
    return this.hasRole("user");
  }

  // Redirect if not authenticated
  requireAuth(redirectUrl = "index1.html") {
    if (!this.isAuthenticated()) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  }

  // Redirect if not admin
  requireAdmin(redirectUrl = "index.html") {
    if (!this.isAdmin()) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  }
}

export default new AuthManager();
