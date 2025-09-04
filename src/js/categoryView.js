import Storage from "./API.js";

const mainApp = document.querySelector(".main");

// ------------------------- Selecting Category Modal --------------------------
const categoryModal = document.querySelector(".EditCategorySection");
const categoryBack = document.querySelector(".EditCategorySection");
const cancelBtnEdit = document.querySelector(".cancelBtnEdit");
const categoryModTitle = document.querySelector(".EditCatMod__title");

// Selecting the inputs
const editTitleInput = document.querySelector("#editTitle");
const editDesInput = document.querySelector("#editDescription");

// Selecting the Btns
const submitBtnEdit = document.querySelector(".submitBtnEdit");

// ---------------------- Category Inputs options in Inventory ------------------
const categoryInput = document.querySelector("#categoryInput");

class CategoryUi {
  constructor() {
    this.id = 0;
    cancelBtnEdit.addEventListener("click", (e) => {
      e.preventDefault();
      this.closeCategoryModal();
    });

    categoryBack.addEventListener("click", (e) => {
      if (e.target.classList.contains("EditCategorySection"))
        this.closeCategoryModal();
    });

    submitBtnEdit.addEventListener("click", (e) => {
      e.preventDefault();
      this.submitBtnLogic();
    });
  }

  setApp() {
    mainApp.innerHTML = `
    <div class="categoryUi">
        <div class="category__header">
            <h1>Categories</h1>
            <button class="addCategoryBtn">Add Category</button>
        </div>
        <div class="category__items">
           
        </div>
    </div>
    `;

    this.HTMLContainer = document.querySelector(".category__items");
    this.updateDOM();
    // Selecting the add Category button on the main page
    const addCategoryBtn = document.querySelector(".addCategoryBtn");

    addCategoryBtn.addEventListener("click", () => {
      categoryModTitle.textContent = "Add Category"; // Updating the Modal Title
      this.openCategoryModal();
    });
  }

  openCategoryModal() {
    // Opening the Modal
    categoryModal.classList.remove("--hidden");
    this.clearInputs();
  }

  closeCategoryModal() {
    // Closing the Modal
    categoryModal.classList.add("--hidden");
    this.clearInputs();
    this.id = 0;
  }

  createHTML(category) {
    return `
     <div class="category__item">
        <div class="category__item__text">
            <h2 class="title">${category.title}</h2>
            <p class="description">${category.description}</p>
        </div>
        <div class="category__item__icons">
            <svg class="icon editCategoryIcon" data-id=${category.id}>
                <use xlink:href="../assets/images/sprite.svg#editIcon"></use>
            </svg>
            <img
                src="../assets/images/deleteIcon.svg"
                alt="delete Icon"
                class="deleteBtnCategory"
                data-id=${category.id}
            />
        </div>
    </div>`;
  }

  submitBtnLogic() {
    // Checking if the input are empty or not
    if (editTitleInput.value == "") {
      alert("Please Enter all of the fields!");
      return -1;
    }

    // checking for duplication
    if (this.id != 0) {
      const allCategories = Storage.getCategories();
      const otherCategories = allCategories.filter(
        (category) => category.id != this.id
      );
      const existed = otherCategories.find(
        (category) =>
          category.title.toLowerCase().trim() ==
          editTitleInput.value.toLowerCase().trim()
      );
      if (existed) {
        alert("Category already Exist");
        return -1;
      }
    }

    // Saving the data to localstorage
    Storage.saveCategorie({
      id: this.id,
      title: editTitleInput.value,
      description: editDesInput.value.trim() === "" ? "N/A" : editDesInput.value.trim(),
    });

    this.id = 0;

    // Update the DOM
    this.updateDOM();

    // Closing the Modal
    this.closeCategoryModal();
  }

  updateDOM() {
    // Creating html for each category
    let result = "";
    const allCategories = Storage.getCategories();
    allCategories.forEach((category) => {
      result += this.createHTML(category);
    });

    this.HTMLContainer.innerHTML = result; // Updating the DOM

    this.updateCategoryOptions();

    // Selecting the delete Icon
    const deleteBtns = document.querySelectorAll(".deleteBtnCategory");
    deleteBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = Number(e.target.dataset.id);
        this.deleteCategory(id);
      });
    });

    // Selecting the edit Icon
    const editBtns = document.querySelectorAll(".editCategoryIcon");
    editBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = Number(e.target.dataset.id);
        this.editCategory(id);
      });
    });
  }

  clearInputs() {
    // Clearing the inputs values
    [editDesInput, editTitleInput].forEach((input) => {
      input.value = "";
    });
  }

  deleteCategory(id) {
    // Deleting the category
    Storage.deleteCategory(id);
    this.updateDOM();
  }

  editCategory(id) {
    const allCategories = Storage.getCategories();

    const selectedCategory = allCategories.find(
      (category) => category.id == id
    );

    // Setting the new id so we can change only this id
    this.id = id;

    // Update the title of the modal
    categoryModTitle.textContent = "Edit Category";

    // Opening the Modal
    this.openCategoryModal();

    // Updating the values
    editTitleInput.value = selectedCategory.title;
    editDesInput.value = selectedCategory.description;
  }

  updateCategoryOptions() {
    // Updating the Options category in the Inventory
    let result = `<option value="">Select product category</option>
    <option value="no-cat">No Category</option>`;
    // Getting all the value
    const allCategories = Storage.getCategories();
    allCategories.forEach((category) => {
      result += `<option value=${category.id}>${category.title}</option>`;
    });

    // Updating the DOM
    categoryInput.innerHTML = result;
  }
}

export default new CategoryUi();
