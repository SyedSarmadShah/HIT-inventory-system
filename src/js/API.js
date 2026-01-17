class Storage {
  constructor() {
    // Consistent storage keys with inventory_ prefix
    this.PRODUCTS_KEY = "inventory_products";
    this.CATEGORIES_KEY = "inventory_categories";
    this.ISSUES_KEY = "inventory_issues";
  }

  getProducts() {
    try {
      // Backward compatibility: migrate old keys if they exist
      const oldData = localStorage.getItem("InventoryProducts");
      if (oldData) {
        const data = JSON.parse(oldData);
        this.saveAllProducts(data);
        localStorage.removeItem("InventoryProducts");
      }

      const allData = JSON.parse(localStorage.getItem(this.PRODUCTS_KEY)) || [];
      this.sortArray(allData);
      return allData;
    } catch (error) {
      console.error("Error reading products:", error);
      return [];
    }
  }

  getCategories() {
    try {
      // Backward compatibility: migrate old keys if they exist
      const oldData = localStorage.getItem("Inventorycategories");
      if (oldData) {
        const data = JSON.parse(oldData);
        this.saveAllCategories(data);
        localStorage.removeItem("Inventorycategories");
      }

      const allData = JSON.parse(localStorage.getItem(this.CATEGORIES_KEY)) || [];
      this.sortArray(allData);
      return allData;
    } catch (error) {
      console.error("Error reading categories:", error);
      return [];
    }
  }

  getIssues() {
    try {
      // Backward compatibility: migrate old keys if they exist
      const oldData = localStorage.getItem("InventoryIssues");
      if (oldData) {
        const data = JSON.parse(oldData);
        this.saveAllIssues(data);
        localStorage.removeItem("InventoryIssues");
      }
      
      // Also check for "issues" key from previous version
      const legacyData = localStorage.getItem("issues");
      if (legacyData) {
        const data = JSON.parse(legacyData);
        this.saveAllIssues(data);
        localStorage.removeItem("issues");
      }

      const allData = JSON.parse(localStorage.getItem(this.ISSUES_KEY)) || [];
      this.sortArray(allData);
      return allData;
    } catch (error) {
      console.error("Error reading issues:", error);
      return [];
    }
  }

  saveCategorie(data) {
    try {
      const allCategories = this.getCategories();
      if (data.id != 0) {
        const existed = allCategories.find((category) => category.id == data.id);
        if (existed) {
          existed.title = data.title;
          existed.description = data.description;
          existed.updated = new Date().toISOString();
        }
      } else {
        const existed = allCategories.find(
          (category) =>
            category.title.toLowerCase().trim() == data.title.toLowerCase().trim()
        );
        if (existed) {
          existed.title = data.title;
          existed.description = data.description;
          existed.updated = new Date().toISOString();
        } else {
          data.id = new Date().getTime();
          data.updated = new Date().toISOString();
          allCategories.push(data);
        }
      }
      this.saveAllCategories(allCategories);
    } catch (error) {
      console.error("Error saving category:", error);
      throw new Error("Failed to save category");
    }
  }

  saveProduct(data) {
    try {
      const allProducts = this.getProducts();
      if (data.id != 0) {
        const existed = allProducts.find((product) => product.id == data.id);
        if (existed) {
          existed.title = data.title;
          existed.category = data.category;
          existed.quantity = data.quantity;
          existed.price = data.price;
          existed.updated = new Date().toISOString();
        }
      } else {
        const existed = allProducts.find(
          (product) =>
            product.title.toLowerCase().trim() == data.title.toLowerCase().trim()
        );
        if (existed) {
          existed.title = data.title;
          existed.category = data.category;
          existed.quantity = data.quantity;
          existed.price = data.price;
          existed.updated = new Date().toISOString();
        } else {
          data.id = new Date().getTime();
          data.updated = new Date().toISOString();
          allProducts.push(data);
        }
      }
      this.saveAllProducts(allProducts);
    } catch (error) {
      console.error("Error saving product:", error);
      throw new Error("Failed to save product");
    }
  }

  saveIssue(data) {
    try {
      const allIssues = this.getIssues();
      if (data.id != 0) {
        const existed = allIssues.find((issue) => issue.id == data.id);
        if (existed) {
          existed.name = data.name;
          existed.item = data.item;
          existed.issueDate = data.issueDate;
          existed.updated = new Date().toISOString();
        }
      } else {
        data.id = new Date().getTime();
        data.updated = new Date().toISOString();
        allIssues.push(data);
      }
      this.saveAllIssues(allIssues);
    } catch (error) {
      console.error("Error saving issue:", error);
      throw new Error("Failed to save issue");
    }
  }

  // Private helper methods to save all data with error handling
  saveAllProducts(products) {
    try {
      localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
    } catch (error) {
      console.error("Error writing products to storage:", error);
      throw new Error("Storage quota exceeded or unavailable");
    }
  }

  saveAllCategories(categories) {
    try {
      localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
    } catch (error) {
      console.error("Error writing categories to storage:", error);
      throw new Error("Storage quota exceeded or unavailable");
    }
  }

  saveAllIssues(issues) {
    try {
      localStorage.setItem(this.ISSUES_KEY, JSON.stringify(issues));
    } catch (error) {
      console.error("Error writing issues to storage:", error);
      throw new Error("Storage quota exceeded or unavailable");
    }
  }

  sortArray(array) {
    array.sort((a, b) => (new Date(a.updated) < new Date(b.updated) ? 1 : -1));
  }

  deleteProduct(id) {
    try {
      const allProducts = this.getProducts();
      const filteredProducts = allProducts.filter((product) => product.id != id);
      this.saveAllProducts(filteredProducts);
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  deleteCategory(id) {
    try {
      const allCategories = this.getCategories();
      const filteredCategories = allCategories.filter(
        (category) => category.id != id
      );
      this.saveAllCategories(filteredCategories);
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }

  deleteIssue(id) {
    try {
      const allIssues = this.getIssues();
      const filteredIssues = allIssues.filter((issue) => issue.id != id);
      this.saveAllIssues(filteredIssues);
    } catch (error) {
      console.error("Error deleting issue:", error);
      throw error;
    }
  }
}

export default new Storage();
