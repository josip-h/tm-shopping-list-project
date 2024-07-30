let EDIT_MODE = false;
let ELEMENT_TO_MODIFY = null;

// 1. DOM elements
const form = document.querySelector(".form");
const formInput = document.querySelector(".form__input");
const formButton = document.querySelector(".form__button");
const itemsList = document.querySelector(".items-list");
const filterInput = document.querySelector(".filter");
const clearAllButton = document.querySelector(".clear-all-button");

// 2. Utilities
function itemsListEmpty() {
  const items = itemsList.querySelectorAll("li");
  return items.length;
}

function updateUI() {
  if (itemsListEmpty()) {
    filterInput.style.display = "block";
    clearAllButton.style.display = "block";
  } else {
    filterInput.style.display = "none";
    clearAllButton.style.display = "none";
  }
}

function updateDOM() {
  clearItemsList();
  const items = getItemsFromLocalStorage();
  items.forEach((item) => addItemToDOM(item));
  updateUI();
}

// 2. Local storage functions

// - Helper functions
// Get items from local storage
function getItemsFromLocalStorage() {
  let itemsArray;

  if (localStorage.getItem("items") === null) itemsArray = [];
  else itemsArray = JSON.parse(localStorage.getItem("items"));

  return itemsArray;
}

// Update items from local storage
function updateItemsFromLocalStorage(items) {
  localStorage.setItem("items", JSON.stringify(items));
}

// - Main functions
// Add
function addItemToLocalStorage(item) {
  const items = getItemsFromLocalStorage();
  const itemsInLowercase = items.map((item) => item.toLowerCase());
  if (itemsInLowercase.includes(item.toLowerCase())) {
    alert("Item already on the list!");
    return false;
  } else {
    items.push(item);
    updateItemsFromLocalStorage(items);
  }
  return true;
}

// Remove
function removeItemFromLocalStorage(item) {
  let items = getItemsFromLocalStorage();
  items = items.filter((storageItem) => storageItem !== item);
  updateItemsFromLocalStorage(items);
}

// Update
function updateItemFromLocalStorage(oldItem, newItem) {
  let items = getItemsFromLocalStorage();
  items.forEach((listItem, itemIndex) => {
    if (listItem === oldItem) items[itemIndex] = newItem;
  });
  updateItemsFromLocalStorage(items);
}

// Clear
function clearItemsFromLocalStorage() {
  localStorage.removeItem("items");
}

// 3. DOM functions

// - Helper functions
// Create icon
function createIconElement(classString) {
  const icon = document.createElement("i");
  icon.className = classString;
  return icon;
}

// Create button
function createButtonElement(classString) {
  const button = document.createElement("button");
  button.className = classString;
  return button;
}

// Create list item
function createListItem(item) {
  const listItem = document.createElement("li");
  listItem.appendChild(document.createTextNode(item));

  const icon = createIconElement("fa-solid fa-x");
  const button = createButtonElement("");

  button.appendChild(icon);
  listItem.appendChild(button);

  return listItem;
}

// - Main functions
// Add
function addItemToDOM(item) {
  const itemElement = createListItem(item);
  itemsList.appendChild(itemElement);
}

// Remove
function removeItemFromDOM(item) {
  const items = itemsList.querySelectorAll("li");
  items.forEach((listItem) => {
    const itemName = listItem.firstChild.textContent;
    if (itemName === item) listItem.remove();
  });
}

// Update
function updateItemFromDOM(oldItem, newItem) {
  removeItemFromDOM(oldItem);
  updateDOM();
}

// Clear
function clearItemsList() {
  items = itemsList.querySelectorAll("li");
  items.forEach((listItem) => listItem.remove());
}

// Filter
function filterItemsList(value) {
  items = itemsList.querySelectorAll("li");
  items.forEach((listItem) => {
    const listItemName = listItem.firstChild.textContent.toLowerCase();
    if (listItemName.includes(value.toLowerCase()))
      listItem.style.display = "flex";
    else listItem.style.display = "none";
  });
}

// 4. Event handlers
function onSubmit(event) {
  event.preventDefault();
  const item = formInput.value;
  if (EDIT_MODE) {
    updateItemFromLocalStorage(ELEMENT_TO_MODIFY, item);
    updateItemFromDOM(ELEMENT_TO_MODIFY, item);
    EDIT_MODE = false;
    ELEMENT_TO_MODIFY = null;
    formButton.textContent = "+ Add Item";
    itemsList.addEventListener("click", onClickItem);
  } else {
    if (addItemToLocalStorage(item)) {
      addItemToDOM(item);
      updateUI();
    }
  }
  formInput.value = "";
}

function onClickItem(event) {
  const clickedElement = event.target;
  const elementTagName = clickedElement.tagName;
  if (elementTagName === "I") {
    const item = clickedElement.parentElement.parentElement.textContent;
    removeItemFromDOM(item);
    removeItemFromLocalStorage(item);
    updateUI();
  } else if (elementTagName === "LI") {
    EDIT_MODE = true;
    ELEMENT_TO_MODIFY = clickedElement.textContent;
    clickedElement.classList.add("item--edit-mode");
    formInput.value = ELEMENT_TO_MODIFY;
    formButton.textContent = "Save";
    itemsList.removeEventListener("click", onClickItem);
  }
}

function onClearAll() {
  clearItemsFromLocalStorage();
  clearItemsList();
  updateUI();
}

function onFilterItems(event) {
  const filterInput = event.target.value;
  filterItemsList(filterInput);
  updateUI();
}

// 5. Event listeners
form.addEventListener("submit", onSubmit);
itemsList.addEventListener("click", onClickItem);
clearAllButton.addEventListener("click", onClearAll);
filterInput.addEventListener("input", onFilterItems);

window.onload = updateDOM();
