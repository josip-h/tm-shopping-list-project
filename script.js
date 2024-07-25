const form = document.getElementById("form");
const itemInput = document.querySelector(".form__input");
const addItemButton = document.querySelector(".form__button");
const filterInput = document.querySelector(".filter");
const itemsList = document.querySelector(".items-list");
const clearAllButton = document.querySelector(".clear-all-button");

// Utility functions
function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

// Event handlers
function addItem(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  if (newItem === "") {
    alert("Please input item.");
    return;
  }

  const li = document.createElement("li");
  li.appendChild(document.createTextNode(newItem));
  const button = createButton("");
  li.appendChild(button);

  itemsList.appendChild(li);
}

function removeItem(e) {
  console.log(e.target);
  if (e.target.tagName === "I") {
  }
}

// Event listeners
form.addEventListener("submit", addItem);

itemsList.addEventListener("click", removeItem);
