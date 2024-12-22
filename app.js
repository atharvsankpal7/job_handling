const crtBtn = document.getElementById("crtBtn");
const table = document.querySelector(".table");
const jobName = document.querySelector("#new-job-name");
const jobPrio = document.querySelector("#job-prio-list");
const jobCount = document.querySelector("#job-count");
const jobDeadline = document.querySelector("#due-date");
const searchPrio = document.querySelector("#search-prio");
const searchField = document.querySelector("#search-field");
const app = document.querySelector("#app");
let data = [];
let unFilteredList = [];
let filteredList = [];
let filteredText = "";
let filteredPrio = "";
let selectedTableItem;
let selectedTableText;
let selectedItemPrio;
let selectedItemDueDate;

function sortMethod(arr) {
  let arr1 = arr;
  arr = [];
  arr1.forEach((item) => {
    if (item.jobPriority == "urgent") {
      arr.push(item);
    }
  });
  arr1.forEach((item) => {
    if (item.jobPriority == "regular") {
      arr.push(item);
    }
  });
  arr1.forEach((item) => {
    if (item.jobPriority == "trivial") {
      arr.push(item);
    }
  });
  return arr;
}

import JobsData from "./JobsData.js";

class Handler {
  static controle() {
    if (JSON.parse(localStorage.getItem("list") !== null)) {
      data = JSON.parse(localStorage.getItem("list"));
    }
    unFilteredList = JobsData.concat(data);
    unFilteredList = sortMethod(unFilteredList);
  }

  static saveItem() {
    localStorage.setItem("list", JSON.stringify(data));
  }
  static changeItemText(jobId, newJobName) {
    data.find((item) => {
      if (item.id === jobId) {
        item.jobText = newJobName;
      }
      this.saveItem();
    });
  }
  static changeItemPrio(jobId, newJobPrio) {
    data.find((item) => {
      if (item.id === jobId) {
        item.jobPriority = newJobPrio;
      }
      this.saveItem();
    });
  }
  static changeItemDueDate(jobId, newDueDate) {
    data.find((item) => {
      if (item.id === jobId) {
        item.dueDate = newDueDate;
      }
      this.saveItem();
    });
  }
}

class Job {
  constructor(jobText, jobPriority, id, dueDate) {
    this.id = id;
    this.jobText = jobText;
    this.jobPriority = jobPriority;
    this.dueDate = dueDate;
  }
}

class UI {
  static jobCounter(list) {
    const totalJobs = unFilteredList.length;
    const shownJobs = list.length;
    jobCount.innerHTML = `${shownJobs}/${totalJobs} Jobs`;
  }
  static showItems(list) {
    list.forEach((job) => {
      const job1 = new Job(job.jobText, job.jobPriority, job.id, job.dueDate);
      this.createItem(job1);
    });
    this.jobCounter(list);
  }
  static displayListOnUI(arr) {
    this.clearItems();
    arr.forEach((item) => {
      this.createItem(item);
    });
    this.jobCounter(arr);
  }
  static deleteHandle(e) {
    const apprvBtn = document.querySelector("#approve-btn");
    const cancelBtn = document.querySelector("#del-cnc-btn");
    const deleteBackground = document.querySelector(".delete-background");
    if (e.target === apprvBtn) {
      table.removeChild(selectedTableItem);
      const itemId = selectedTableItem.id;
      const unFilteredfound = unFilteredList.find((item) => item.id == itemId);
      const unFilteredIndex = unFilteredList.indexOf(unFilteredfound);
      unFilteredList.splice(unFilteredIndex, 1);
      const found = data.find((item) => item.id == itemId);
      if (found !== undefined) {
        const indexNumber = data.indexOf(found);
        data.splice(indexNumber, 1);
        localStorage.setItem("list", JSON.stringify(data));
      }
      app.removeChild(deleteBackground);
      UI.jobCounter(unFilteredList);
    } else if (e.target === cancelBtn) {
      app.removeChild(deleteBackground);
    } else {
      return;
    }
  }
  static deleteItem(e) {
    UI.deleteWindow(e);
    const deleteButtons = document.querySelector(".delete-buttons");
    deleteButtons.addEventListener("click", UI.deleteHandle);
  }
  static deleteWindow(e) {
    selectedTableItem = e.target.parentElement.parentElement.parentElement;
    const deleteBtn = e.target.classList[1];
    if (deleteBtn === "fa-trash-can") {
      const deleteBackground = document.createElement("div");
      deleteBackground.classList.add("delete-background");
      const deleteWindow = document.createElement("div");
      deleteWindow.classList.add("delete-window");
      deleteWindow.innerHTML = `<i id="delete-header" class="fas fa-exclamation-triangle"></i>
            <h2>Are you sure you want to delete?</h2>
            <div class="delete-buttons">
            <button id="approve-btn">Approve</button>
            <button id="del-cnc-btn">Cancel</button>
            </div>`;

      deleteBackground.appendChild(deleteWindow);
      app.appendChild(deleteBackground);
    }
  }

  static createItem(job) {
    const tableItem = document.createElement("div");
    tableItem.classList.add("shown");
    tableItem.classList.add("table-item");
    tableItem.setAttribute("id", job.id);
    tableItem.innerHTML = `
          <p>${job.jobText}</p>
          <p class="prio-${job.jobPriority}">${job.jobPriority}</p>
          <p>${job.dueDate}</p>
          <div class="action-item">
          <a><i class="fa-solid fa-pen-to-square"></i></a>
          </div>
          <div class="action-item">
          <a><i class="fa-solid fa-trash-can"></i></a>
          </div>
          `;
    table.appendChild(tableItem);
    this.clearItem();
  }
  static addItem(job) {
    data.push(job);
    Handler.saveItem();
    unFilteredList.push(job);
    unFilteredList = sortMethod(unFilteredList);
    UI.displayListOnUI(unFilteredList);
  }
  static clearItem() {
    jobName.value = "";
    jobPrio.value = 0;
  }
  static filterItems(e) {
    if (e.target.id === searchField.id) {
      filteredText = e.target.value;
    } else {
      filteredPrio = e.target.value;
    }
    filteredList = unFilteredList.filter((item) => {
      if (filteredPrio == "") {
        return item.jobText.toLowerCase().includes(filteredText.toLowerCase());
      } else {
        return (
          item.jobText.toLowerCase().includes(filteredText.toLowerCase()) &&
          item.jobPriority.toLowerCase() == filteredPrio.toLowerCase()
        );
      }
    });

    filteredList = sortMethod(filteredList);
    UI.displayListOnUI(filteredList);
  }

  static clearItems() {
    table.innerHTML = `<div class="table-item table-head">
    <p>Name</p>
    <p class="prio">Priority</p>
    <p class="due-date">Due Date</p>
    <p class="action">Edit</p>
    <p class="action">Delete</p>
  </div>`;
  }
  static editWindow(e) {
    const editBtn = e.target.classList[1];
    selectedTableItem = e.target.parentElement.parentElement.parentElement;
    selectedTableText = selectedTableItem.firstChild.nextSibling.innerText;
    selectedItemPrio =
      selectedTableItem.firstElementChild.nextElementSibling.innerText;
    selectedItemDueDate =
      selectedTableItem.firstElementChild.nextElementSibling.nextElementSibling
        .innerHTML;
    if (editBtn === "fa-pen-to-square") {
      const editBackground = document.createElement("div");
      editBackground.classList.add("edit-background");
      const editWindow = document.createElement("div");
      editWindow.classList.add("edit-window");

      editWindow.innerHTML = `<i id="edit-header" class="fa-regular fa-pen-to-square"></i>
      <h1 id="edit-headline">Job Edit</h1>
      <p>Job Name</p>
      <textarea rows="3" cols="35" wrap="soft" class="edit-text" type="text">
      ${selectedTableText}</textarea
      >
      <p>Job Priority</p>
      <select class="edit-prio">
        <option id="urgent" value="urgent">Urgent</option>
        <option id="regular" value="regular">Regular</option>
        <option id="trivial" value="trivial">Trivial</option>
      </select>
      <p>Job Deadline</p>
      <div class="edit-dueDate">
          <input type="date" name="" id="edit-due-date-input" value="${selectedItemDueDate}">
      </div>
      <div class="edit-buttons">
        <button id="save-btn">Save</button>
        <button id="cancel-btn">Cancel</button>
      </div>`;
      const selectedPrios = editWindow.childNodes[10].childNodes;
      selectedPrios.forEach((item) => {
        if (item.value == selectedItemPrio) {
          item.setAttribute("selected", "selected");
        }
      });

      editBackground.appendChild(editWindow);
      app.appendChild(editBackground);
    }
  }
  static handleEditWindow(e) {
    const btnPressed = e.target.innerText;
    const editBackground = document.querySelector(".edit-background");
    const editText = document.querySelector(".edit-text");
    const editPrio = document.querySelector(".edit-prio");
    const editDueDate = document.querySelector("#edit-due-date-input");
    const jobId = parseInt(selectedTableItem.id);

    if (btnPressed === "Cancel") {
      app.removeChild(editBackground);
    } else if (btnPressed === "Save") {
      unFilteredList.find((item) => {
        if (item.id === jobId) {
          item.jobText = editText.value;
          item.jobPriority = editPrio.value;
          item.dueDate =
            editDueDate.value == "" ? item.dueDate : editDueDate.value;
        }
      });

      Handler.changeItemText(jobId, editText.value);
      Handler.changeItemPrio(jobId, editPrio.value);
      // Update due date in localStorage
      Handler.changeItemDueDate(jobId, editDueDate.value);

      app.removeChild(editBackground);
      unFilteredList = sortMethod(unFilteredList);
      UI.displayListOnUI(unFilteredList);
    } else {
      return;
    }
  }

  static editItem(e) {
    UI.editWindow(e);
    const editWindowUI = document.querySelector(".edit-buttons");
    editWindowUI.addEventListener("click", UI.handleEditWindow);
  }
  static createButton() {
    if (
      jobName.value == "" ||
      jobPrio.value == "0" ||
      jobDeadline.value == ""
    ) {
      crtBtn.setAttribute("disabled", "");
    } else {
      crtBtn.removeAttribute("disabled");
    }
  }
}

crtBtn.addEventListener("click", (e) => {
  if (e.target === crtBtn) {
    const job = new Job(
      jobName.value,
      jobPrio.value,
      Math.floor(Math.random() * 1000000),
      jobDeadline.value
    );
    UI.addItem(job);
    UI.createButton();
  }
});
Handler.controle();
addEventListener("DOMContentLoaded", UI.showItems(unFilteredList));

searchField.addEventListener("input", UI.filterItems);
searchPrio.addEventListener("input", UI.filterItems);
table.addEventListener("click", UI.deleteItem);
table.addEventListener("click", UI.editItem);
jobName.addEventListener("input", UI.createButton);
jobPrio.addEventListener("input", UI.createButton);
jobDeadline.addEventListener("input", UI.createButton);
