// src/js/IssueView.js
const mainApp = document.querySelector(".main");

class IssueUi {
  constructor() {
    this.issues = JSON.parse(localStorage.getItem("issues")) || [];
  }

  saveIssues() {
    localStorage.setItem("issues", JSON.stringify(this.issues));
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
    issueRows.innerHTML = ""; // clear existing

    this.issues.forEach((issue, index) => {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td>${issue.name}</td>
        <td>${issue.item}</td>
        <td>${issue.date}</td>
        <td class="editTableSection">
          <div class="table__icons">
            <div class="editIcon" title="Edit">
              <svg class="icon">
                <use xlink:href="../assets/images/sprite.svg#editIcon"></use>
              </svg>
            </div>
            <div class="deleteIcon" title="Delete">
              <img src="../assets/images/deleteIcon.svg" alt="delete" />
            </div>
          </div>
        </td>
      `;

      // delete
      newRow.querySelector(".deleteIcon").addEventListener("click", () => {
        this.issues.splice(index, 1);
        this.saveIssues();
        this.renderRows();
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
      addIssueSection.classList.remove("--hidden");
      document.body.classList.add("disableScroll");
    });

    // close modal
    addIssueCancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      addIssueSection.classList.add("--hidden");
      document.body.classList.remove("disableScroll");
    });

    // submit new issue
    addIssueSubmitBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const name = document.querySelector(".issueNameInput").value.trim();
      const item = document.querySelector(".issueItemInput").value.trim();
      const date = document.querySelector(".issueDateInput").value;

      if (!name || !item || !date) {
        alert("Please fill all fields!");
        return;
      }

      // save issue
      this.issues.push({ name, item, date });
      this.saveIssues();

      // re-render
      this.renderRows();

      // clear + close
      document.querySelector(".issueNameInput").value = "";
      document.querySelector(".issueItemInput").value = "";
      document.querySelector(".issueDateInput").value = "";
      addIssueSection.classList.add("--hidden");
      document.body.classList.remove("disableScroll");
    });
  }
}

export default new IssueUi();
