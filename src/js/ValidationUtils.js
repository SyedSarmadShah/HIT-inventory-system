// ValidationUtils.js - Centralized validation functions

class ValidationUtils {
  // Validate email format
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  static isValidPassword(password) {
    return password && password.length >= 6;
  }

  // Validate positive number (for quantity, price, etc)
  static isValidPositiveNumber(value) {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
  }

  // Validate non-negative number
  static isValidNonNegativeNumber(value) {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
  }

  // Validate required string field
  static isValidString(value) {
    return value && typeof value === 'string' && value.trim().length > 0;
  }

  // Validate date string
  static isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }

  // Validate product data
  static validateProduct(product) {
    const errors = [];

    if (!this.isValidString(product.title)) {
      errors.push("Product name is required");
    }

    if (!this.isValidNonNegativeNumber(product.quantity)) {
      errors.push("Quantity must be a valid positive number");
    }

    if (!this.isValidNonNegativeNumber(product.price)) {
      errors.push("Price must be a valid positive number");
    }

    if (!product.category) {
      errors.push("Category must be selected");
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // Validate category data
  static validateCategory(category) {
    const errors = [];

    if (!this.isValidString(category.title)) {
      errors.push("Category name is required");
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // Validate issue data
  static validateIssue(issue) {
    const errors = [];

    if (!this.isValidString(issue.name)) {
      errors.push("Name is required");
    }

    if (!this.isValidString(issue.item)) {
      errors.push("Item is required");
    }

    if (!this.isValidDate(issue.issueDate)) {
      errors.push("Valid issue date is required");
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // Check for duplicate in array
  static checkDuplicate(array, field, value, excludeId = null) {
    return array.some(item => {
      if (excludeId && item.id === excludeId) {
        return false; // Exclude the item being edited
      }
      return item[field] && item[field].toLowerCase().trim() === value.toLowerCase().trim();
    });
  }

  // Format error message
  static formatErrorMessage(errors) {
    if (Array.isArray(errors) && errors.length > 0) {
      return errors.join('\n');
    }
    return errors;
  }
}

export default ValidationUtils;
