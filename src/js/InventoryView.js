import Storage from "./API.js";

const mainApp = document.querySelector(".main");
// Selecting the prodcut modal
const addProModal = document.querySelector(".addProSection");
const ProModalAddBtn = document.querySelector(".addProModalSubmitBtn");
const ProModalCancelBtn = document.querySelector(".addProModalCancelBtn");
const ModalTitle = document.querySelector(".addProModal__title");

// Selecting the inputs in the add Product Modal
const productNameInput = document.querySelector(".productNameInput");
const categoryInput = document.querySelector("#categoryInput");
const productQuantityInput = document.querySelector(".productQuantityInput");
const productPriceInput = document.querySelector(".productPriceInput");

// --------------------- SearchBar --------------------------------
const searchBar = document.querySelector(".searchBarInput");

class InventoryUi {
  constructor() {
    this.id = 0; // Setting a default id
    ProModalAddBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.addProductModalLogic();
    });
    ProModalCancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.closeProductModal();
    });

    addProModal.addEventListener("click", (e) => {
      // Checking if the user click on the empty black space behind the add modal so we can close it
      if (e.target.classList.contains("addProSection")) {
        this.closeProductModal(e); // Closing the Modal
      }
    });
  }
  setApp() {
    // Updating our DOM with needed HTML!
    mainApp.innerHTML = `
    <div class="inventory-app">
        <div class="product-section__header">
        <h1>Products</h1>
        <div class="product-section__header__buttons">
            <button class="addProBtn">Add Product</button>
        </div>
        </div>

        <div class="product-section">
        <table class ="product-section-table">
        </table>
        </div>
    </div>`;

    //  Selecting add Product Button and add eventListener
    const addProBtn = document.querySelector(".addProBtn");
    addProBtn.addEventListener("click", () => {
      // Setting the title to be Add new Product
      ModalTitle.textContent = "New Product";
      ProModalAddBtn.textContent = "Add Product";
      this.openProductModal();
    });

    // Selecting the products table section
    this.productSectionHTMl = document.querySelector(".product-section-table");
    this.updateDom(Storage.getProducts());
  }

  updateDom(allProducts) {
    let result = `
    <tr class="table__title">
        <td>Product</td>
        <td>Quantity</td>
        <td>Price</td>
        <td>Category</td>
        <td></td>
    </tr>    
    `;

    // Getting all the Data
    allProducts.forEach((product) => {
      result += this.createProductHTML(product); // Create HTML for each data
    });

    this.productSectionHTMl.innerHTML = result; // Update the Dom

    // Selecting the delete and edit Icon
    const deleteBtns = document.querySelectorAll(".deleteIcon");
    deleteBtns.forEach((deleteBtn) =>
      deleteBtn.addEventListener("click", (e) => {
        const id = Number(e.target.dataset.id);
        this.deleteBtnLogic(id);
      })
    );

    const editBtns = document.querySelectorAll(".editIcon");
    editBtns.forEach((editBtn) =>
      editBtn.addEventListener("click", (e) => {
        const id = Number(e.target.dataset.id);
        this.editBtnLogic(id);
      })
    );
  }

  createProductHTML(prodcut) {
    return `
     <tr>
        <td>${prodcut.title}</td>
        <td>${prodcut.quantity}</td>
        <td>$${prodcut.price}</td>
        <td>${this.getCategoryName(prodcut.category)}</td>
        <td class="editTableSection">
            <div class="table__icons">
            <div class="editIcon" data-id=${prodcut.id}>
                <svg class="icon">
                <use
                    xlink:href="../assets/images/sprite.svg#editIcon"
                ></use>
                </svg>
            </div>
            <div class="deleteIcon" data-id=${prodcut.id}>
                <img src="../assets/images/deleteIcon.svg" alt="deleteIcon" />
            </div>
            </div>
        </td>
    </tr>

    `;
  }

  getCategoryName(id) {
    const allCategories = Storage.getCategories();
    const existed = allCategories.find((category) => category.id == id);
    if (existed) {
      return existed.title;
    }
    return "No-Category";
  }

  openProductModal() {
    addProModal.classList.remove("--hidden");
    this.clearInputsField();
  }

  closeProductModal() {
    addProModal.classList.add("--hidden");
    this.clearInputsField();
    this.id = 0;
  }

  clearInputsField() {
    // clear the input fields
    [
      productPriceInput,
      productQuantityInput,
      categoryInput,
      productNameInput,
    ].forEach((input) => (input.value = ""));
  }

  addProductModalLogic() {
    // Checking of the field are empty or not
    
    if (
      !productNameInput.value ||
      !categoryInput.value ||
      !productQuantityInput.value
    ) {
      alert("Please enter all of the fields!");
      return -1;
    }
    if (
      Number(productPriceInput.value) < 0 ||
      Number(productQuantityInput.value) < 0
    ) {
      alert("Quantity and Price should be at least 0");
      return -1;
    }

    // checking for duplication
    if (this.id != 0) {
      const allProducts = Storage.getProducts();
      const otherProducts = allProducts.filter(
        (product) => product.id != this.id
      );
      console.log(productNameInput.value);

      const existed = otherProducts.find(
        (product) =>
          product.title.toLowerCase().trim() ==
          productNameInput.value.toLowerCase().trim()
      );
      if (existed) {
        alert("Product already Exist");
        return -1;
      }
    }

    // Updating Local Storage
    Storage.saveProduct({
      id: this.id,
      title: productNameInput.value.trim(),
      category: categoryInput.value,
      quantity: Number(productQuantityInput.value),
      price: productPriceInput.value ? Number(productPriceInput.value) : 0,
    });

    this.id = 0;

    searchBar.value = "";

    // Updating the DOM
    this.updateDom(Storage.getProducts());
    // Closing the modal
    this.closeProductModal();
  }

  deleteBtnLogic(id) {
    // Deleting the Product
    Storage.deleteProduct(id);
    // Update the DOM
    searchBar.value = "";

    this.updateDom(Storage.getProducts());
  }

  editBtnLogic(id) {
    this.id = id;
    // Getting all the Products
    const allProducts = Storage.getProducts();
    // Finding the product with ID
    const selectedProduct = allProducts.find((prodcut) => prodcut.id == id);

    // Opening the Modal
    this.openProductModal();

    ModalTitle.textContent = "Edit Product"; // Upating Modal title
    ProModalAddBtn.textContent = "Submit Edit";
    // Updating the value for each input
    productNameInput.value = selectedProduct.title;
    categoryInput.value = selectedProduct.category;
    productQuantityInput.value = selectedProduct.quantity;
    productPriceInput.value = selectedProduct.price;
  }

  seachLogic(inputValue) {
    const targetValue = inputValue.toLowerCase().trim();
    const allProducts = Storage.getProducts();
    const filteredItem = allProducts.filter((product) =>
      product.title.toLowerCase().trim().includes(targetValue)
    );
    this.updateDom(filteredItem);
  }
}

export default new InventoryUi();
