class Storage {
  getProducts() {
    const allData = JSON.parse(localStorage.getItem("InventoryProducts")) || [];
    this.sortArray(allData);
    return allData;
  }

  getCategories() {
    const allData = JSON.parse(localStorage.getItem("Inventorycategories")) || [];
    this.sortArray(allData);
    return allData;
  }

  getIssues() {
    const allData = JSON.parse(localStorage.getItem("InventoryIssues")) || [];
    this.sortArray(allData);
    return allData;
  }

  saveCategorie(data) {
    const allCategories = this.getCategories();
    if (data.id != 0) {
      const existed = allCategories.find((category) => category.id == data.id);
      existed.title = data.title;
      existed.description = data.description;
      existed.updated = new Date().toISOString();
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
    localStorage.setItem("Inventorycategories", JSON.stringify(allCategories));
  }

  saveProduct(data) {
    const allProducts = this.getProducts();
    if (data.id != 0) {
      const existed = allProducts.find((product) => product.id == data.id);
      existed.title = data.title;
      existed.category = data.category;
      existed.quantity = data.quantity;
      existed.price = data.price;
      existed.updated = new Date().toISOString();
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
    localStorage.setItem("InventoryProducts", JSON.stringify(allProducts));
  }

  saveIssue(data) {
    const allIssues = this.getIssues();
    if (data.id != 0) {
      const existed = allIssues.find((issue) => issue.id == data.id);
      existed.name = data.name;
      existed.item = data.item;
      existed.issueDate = data.issueDate;
      existed.updated = new Date().toISOString();
    } else {
      data.id = new Date().getTime();
      data.updated = new Date().toISOString();
      allIssues.push(data);
    }
    localStorage.setItem("InventoryIssues", JSON.stringify(allIssues));
  }

  sortArray(array) {
    array.sort((a, b) => (new Date(a.updated) < new Date(b.updated) ? 1 : -1));
  }

  deleteProduct(id) {
    const allProducts = this.getProducts();
    const filteredProducts = allProducts.filter((product) => product.id != id);
    localStorage.setItem("InventoryProducts", JSON.stringify(filteredProducts));
  }

  deleteCategory(id) {
    const allCategories = this.getCategories();
    const filteredCategories = allCategories.filter(
      (category) => category.id != id
    );
    localStorage.setItem("Inventorycategories", JSON.stringify(filteredCategories));
  }

  deleteIssue(id) {
    const allIssues = this.getIssues();
    const filteredIssues = allIssues.filter((issue) => issue.id != id);
    localStorage.setItem("InventoryIssues", JSON.stringify(filteredIssues));
  }
}

export default new Storage();
