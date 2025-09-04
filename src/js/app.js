import DashboardUi from "./Dashboard.js";
import InventoryUi from "./InventoryView.js";
import CategoryUi from "./categoryView.js";
import IssueUi from "./IssueView.js";


// -------------------------- Sidebar Btns -----------------------------
const dashboardBtns = [...document.querySelectorAll(".sideBar__dashboard")];
const inventoryBtns = [...document.querySelectorAll(".sideBar__inventory")];
const categoryBtns = [...document.querySelectorAll(".sideBar__setting")];

const requestBtns = [...document.querySelectorAll(".sideBar__request")];
const manageRequestBtns = [...document.querySelectorAll(".sideBar__manageRequests")];


// --------------------------  Sidebar-Menu  ---------------------------------
const menuToggle = document.querySelector(".menu-toggle");
const sideBarOnToggle = document.querySelector(".sideBar-ontoggle");
const sideBarBackdrop = document.querySelector(".sideBar-ontoggle-backdrop");

// -------------------------- Search Bar -------------------------------------
const searchBar = document.querySelector(".searchBarInput");

document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.addEventListeners();

const role = localStorage.getItem("role"); // "user" or "admin"

// Hide/Show based on role
if (role === "user") {
  document.querySelectorAll(".sideBar__manageRequests").forEach(btn => btn.style.display = "none");
} else if (role === "admin") {
  document.querySelectorAll(".sideBar__request").forEach(btn => btn.style.display = "none");
}


  CategoryUi.updateCategoryOptions();
  DashboardUi.setApp(); // Updating the ui with the selected default page
});

class App {
  addEventListeners() {
    // Adding event listener to each button when they are clicked
    dashboardBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.dashboardBtnLogic(e);
        this.hideMenu();
      });
    });
    inventoryBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.inventoryBtnLogic(e);
        this.hideMenu();
      });
    });
    categoryBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.categoryBtnLogic(e);
        this.hideMenu();
      });
    });

const issueBtns = [...document.querySelectorAll(".sideBar__issue")];
issueBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    IssueUi.setApp();
    this.hideMenu();
    this.removeCurrentSelectedBtn();
    e.target.classList.add("--selectedBtnUi");
  });
});



    // For Request button (User)
requestBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    this.requestBtnLogic(e);
    this.hideMenu();
  });
});

// For Manage Requests button (Admin)
manageRequestBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    this.manageRequestBtnLogic(e);
    this.hideMenu();
  });
});

    menuToggle.addEventListener("click", () => {
      this.menuToggleLogic();
    });
    sideBarBackdrop.addEventListener("click", () => {
      this.hideMenu();
    });
    searchBar.addEventListener("input", () => {
      this.searchInputLogic();
      this.hideMenu();
      inventoryBtns.forEach((btn) => btn.classList.add("--selectedBtnUi"));
    });

    const sidebar = {
  requestBtnLogic: function(event) {
    import("./RequestView.js").then(module => module.renderRequestView());
    searchBar.value = ""; 
    this.removeCurrentSelectedBtn();
    event.target.classList.add("--selectedBtnUi");
  },

  manageRequestBtnLogic: function(event) {
    import("./ManageRequests.js").then(module => module.renderManageRequests());
    searchBar.value = ""; 
    this.removeCurrentSelectedBtn();
    event.target.classList.add("--selectedBtnUi");
  }
};

  }

  searchInputLogic() {
    InventoryUi.setApp(); // Updating the ui with the Inventory page
    InventoryUi.seachLogic(searchBar.value);
    this.removeCurrentSelectedBtn(); // Removing all previous selected button
  }

  dashboardBtnLogic(event) {
    DashboardUi.setApp(); // Updating the ui with the dashboard page
    console.log(searchBar.value);

    searchBar.value = ""; // Reseting SearchBar
    this.removeCurrentSelectedBtn(); // Removing all previous selected button
    event.target.classList.add("--selectedBtnUi"); // Adding the selected (style) to the dashboard button
  }

  inventoryBtnLogic(event) {
    InventoryUi.setApp(); // Updating the ui with the Inventory page
    searchBar.value = ""; // Reseting SearchBar
    this.removeCurrentSelectedBtn(); // Removing all previous selected button
    event.target.classList.add("--selectedBtnUi"); // Adding the selected (style) to the dashboard button
  }

  categoryBtnLogic(event) {
    CategoryUi.setApp(); // Updating the ui with the Inventory page
    searchBar.value = ""; // Reseting SearchBar
    this.removeCurrentSelectedBtn(); // Removing all previous selected button
    event.target.classList.add("--selectedBtnUi"); // Adding the selected (style) to the dashboard button
  }

  menuToggleLogic(event) {
    sideBarOnToggle.classList.remove("--hidden");
    sideBarBackdrop.classList.remove("--hidden");
  }

  hideMenu() {
    sideBarOnToggle.classList.add("--hidden");
    sideBarBackdrop.classList.add("--hidden");
  }


removeCurrentSelectedBtn() {
  [dashboardBtns, inventoryBtns, categoryBtns, document.querySelectorAll(".sideBar__issue")].forEach((btns) => {
    btns.forEach((btn) => btn.classList.remove("--selectedBtnUi"));
  });
}


  
}
