// src/js/IssueView.js
import Storage from "./API.js";

const mainApp = document.querySelector(".main");

class IssueUi {
  constructor() {
    this.editingId = 0; // Track which issue is being edited
  }

  setApp() {
    // Reuse Inventory layout so styles match
    mainApp.innerHTML = `
      <div class="inventory-app issue-app">
        <div class="product-section__header">
          <h1>Issued Items</h1>
          <div class="product-section__header__buttons">
            <button class="addIssueBtn addProBtn">+ Add Issue</button>
          </div>
        </div>

        <div class="product-section">
          <table class="issue-table">
            <tr class="table__title">
              <td>Name</td>
              <td>Item</td>
              <td>Issue Date</td>
              <td></td>
            </tr>
            <tbody class="issueRows"></tbody>
          </table>
        </div>
      </div>

      <!-- Add Issue Modal -->
      <div class="addIssueSection --hidden">
        <div class="addIssueModal">
          <h1 class="addIssueModal__title">New Issue</h1>
          <form class="addIssueModal__form">
            <div class="addIssueModal__form__inputs">
              <p>Name</p>
              <input type="text" placeholder="Enter name" class="issueNameInput" />
            </div>
            <div class="addIssueModal__form__inputs">
              <p>Item</p>
              <input type="text" placeholder="Enter item" class="issueItemInput" />
            </div>
            <div class="addIssueModal__form__inputs">
              <p>Issue Date</p>
              <input type="date" class="issueDateInput" />
            </div>
            <div class="addIssueModal__form__buttons">
              <button class="addIssueCancelBtn">Discard</button>
              <button class="addIssueSubmitBtn">Add Issue</button>
            </div>
          </form>
        </div>
      </div>
    `;

    this.renderRows();
    this.addListeners();
  }

  renderRows() {
    const issueRows = document.querySelector(".issueRows");
    if (!issueRows) return;
    
    issueRows.innerHTML = ""; // clear existing

    const allIssues = Storage.getIssues();
    allIssues.forEach((issue) => {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td>${issue.name}</td>
        <td>${issue.item}</td>
        <td>${issue.issueDate}</td>
        <td class="editTableSection">
          <div class="table__icons">
            <div class="editIcon" data-id="${issue.id}" title="Edit">
              <svg class="icon">
                <use xlink:href="../assets/images/sprite.svg#editIcon"></use>
              </svg>
            </div>
            <div class="deleteIcon" data-id="${issue.id}" title="Delete">
              <img src="../assets/images/deleteIcon.svg" alt="delete" />
            </div>
          </div>
        </td>
      `;

      // Edit functionality
      newRow.querySelector(".editIcon").addEventListener("click", (e) => {
        const id = Number(e.currentTarget.dataset.id);
        this.editIssue(id);
      });

      // Delete functionality
      newRow.querySelector(".deleteIcon").addEventListener("click", (e) => {
        const id = Number(e.currentTarget.dataset.id);
        if (confirm("Are you sure you want to delete this issue?")) {
          Storage.deleteIssue(id);
          this.renderRows();
        }
      });

      issueRows.appendChild(newRow);
    });
  }

  addListeners() {
    const addIssueBtn = document.querySelector(".addIssueBtn");
    const addIssueSection = document.querySelector(".addIssueSection");
    const addIssueCancelBtn = document.querySelector(".addIssueCancelBtn");
    const addIssueSubmitBtn = document.querySelector(".addIssueSubmitBtn");

    // open modal
    addIssueBtn.addEventListener("click", () => {
      this.editingId = 0; // Reset editing state
      this.clearIssueForm();
      addIssueSection.classList.remove("--hidden");
      document.body.classList.add("disableScroll");
    });

    // close modal
    addIssueCancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.editingId = 0; // Reset editing state
      this.clearIssueForm();
      addIssueSection.classList.add("--hidden");
      document.body.classList.remove("disableScroll");
    });

    // submit new issue
    addIssueSubmitBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const name = document.querySelector(".issueNameInput").value.trim();
      const item = document.querySelector(".issueItemInput").value.trim();
      const issueDate = document.querySelector(".issueDateInput").value;

      if (!name || !item || !issueDate) {
        alert("Please fill all fields!");
        return;
      }

      // Save issue using Storage API
      Storage.saveIssue({
        id: this.editingId,
        name: name,
        item: item,
        issueDate: issueDate
      });

      this.editingId = 0;

      // re-render
      this.renderRows();

      // clear + close
      this.clearIssueForm();
      addIssueSection.classList.add("--hidden");
      document.body.classList.remove("disableScroll");
    });
  }

  editIssue(id) {
    const allIssues = Storage.getIssues();
    const issue = allIssues.find(i => i.id === id);
    
    if (!issue) return;

    this.editingId = id;

    // Open modal and populate fields
    const addIssueSection = document.querySelector(".addIssueSection");
    const modalTitle = document.querySelector(".addIssueModal__title");
    
    modalTitle.textContent = "Edit Issue";
    document.querySelector(".issueNameInput").value = issue.name;
    document.querySelector(".issueItemInput").value = issue.item;
    document.querySelector(".issueDateInput").value = issue.issueDate;
    
    addIssueSection.classList.remove("--hidden");
    document.body.classList.add("disableScroll");
  }

  clearIssueForm() {
    document.querySelector(".issueNameInput").value = "";
    document.querySelector(".issueItemInput").value = "";
    document.querySelector(".issueDateInput").value = "";
    
    const modalTitle = document.querySelector(".addIssueModal__title");
    if (modalTitle) {
      modalTitle.textContent = "New Issue";
    }
  }
}

export default new IssueUi();
