const mainApp = document.querySelector(".main");
import Storage from "./API.js";

class DashboardUi {
  setApp() {
    mainApp.innerHTML = `
    <div class="dashboardUi">
        <div class="dashboardUi__header">
        <h1>Overview</h1>
        </div>
        <div class="dashboardUi__main">

        <div class="dashboardUi__main__items">
            <img src="../assets/images/Cancel.svg" alt="Cancel Item" />
            <p class="dashboardUi__notAvailable">${this.calculateProducts()}</p>
            <p>Number of Producs</p>
        </div>

        <div class="dashboardUi__main__items">
            <img src="../assets/images/Quantity.svg" alt="quantity" />
            <p class="dashboardUi__quantity">${this.calculateQuantity()}</p>
            <p>Total Quantity</p>
        </div>

        <div class="dashboardUi__main__items">
            <img src="../assets/images/Sales.svg" alt="salesItem" />
            <p class="dashboardUi__sales">$${this.calculatePrice()}</p>
            <p>Total Value in Hand</p>
        </div>

 

        <div class="dashboardUi__main__items">
            <img src="../assets/images/Categoriescolor.svg" alt="category" />
            <p class="dashboardUi__notAvailable">${this.totalCategories()}</p>
            <p>Total Categories</p>
        </div>
        </div>
    </div>`;
  }

  // Calculate the Quantity
  calculateQuantity() {
    const allProducts = Storage.getProducts();
    return allProducts
      .reduce((acc, product) => acc + product.quantity, 0)
      .toLocaleString();
  }

  // Calculate the Price
  calculatePrice() {
    const allProducts = Storage.getProducts();
    const totalPrice = allProducts.reduce(
      (acc, product) => acc + product.price,
      0
    );
    return totalPrice.toLocaleString();
  }

  // Calculate total categories
  totalCategories() {
    const allCategories = Storage.getCategories();
    const total = allCategories.length;
    return total.toLocaleString();
  }

  // Calculate total Products
  calculateProducts() {
    const allCategories = Storage.getProducts();
    return allCategories.length.toLocaleString();
  }
}

export default new DashboardUi();
