//Storage Controller

//Item Controller
const ItemCtrl = (function () {
  //Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };
  //Data Structure /State
  const data = {
    items: [
      //   { id: 0, name: "Schabowy z kapustą", calories: 1200 },
      //   { id: 1, name: "Piwo", calories: 120 },
      //   { id: 2, name: "Sernik", calories: 200 },
    ],
    currentItem: null,
    totalCalories: 0,
  };

  //Public methods
  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      let ID;
      //Create ID
      if (data.items.length) {
        ID = data.items.length;
      } else {
        ID = 0;
      }
      //Calories to number
      calories = parseInt(calories);

      //Create new item
      newItem = new Item(ID, name, calories);

      //Add to items array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function (id) {
      const found = data.items.filter(function (item) {
        return item.id === id;
      });
      return found;
    },
    setCurrentItem: function (currentItem) {
      data.currentItem = currentItem;
    },
    getTotalCalories: function () {
      let total = 0;
      data.items.forEach(function (item) {
        total += item.calories;
      });
      //Set total calories in Data Array
      data.totalCalories = total;

      return data.totalCalories;
    },

    logData: function () {
      return data;
    },
  };
})();

//UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
  };
  //Public methods
  return {
    populateItemList: function (items) {
      let html = "";
      items.forEach(function (item) {
        html += `<li class="collection-item" id="item-${item.id}">
              <strong>${item.name}:</strong> <em> ${item.calories} Kalorii</em>
              <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
              </a>
          </li>`;
      });

      //Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },
    addListItem: function (item) {
      //Show the list
      document.querySelector(UISelectors.itemList).style.display = "block";
      //Create li element
      const li = document.createElement("li");
      //Add class
      li.className = "collection-item";
      //Add ID
      li.id = `item-${item.id}`;
      //Add html
      li.innerHTML = `
            <strong>${item.name}:</strong> <em> ${item.calories} Kalorii</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
              `;
      //Insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories: function (sumOfCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = sumOfCalories;
    },
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    getSelectors: function () {
      return UISelectors;
    },
  };
})();

//App Controller
const App = (function (ItemCtrl, UICtrl) {
  //Load event listeners
  const loadEventListeners = function () {
    //Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    //Add item Event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    //Edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemUpdateSubmit);
  };

  //Add item submit
  const itemAddSubmit = function (e) {
    e.preventDefault();
    //Get form input from UI Controller
    const input = UICtrl.getItemInput();
    //Check for name and calorie input
    if (input.name !== "" && input.calories > 0) {
      //Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      //Add item to UI list
      UICtrl.addListItem(newItem);

      //Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //Clear input fields
      UICtrl.clearInput();
    }
  };

  //Update item submit
  const itemUpdateSubmit = function (e) {
    e.preventDefault();
    if (e.target.classList.contains("edit-item")) {
      //Get list item id
      const listId = e.target.parentNode.parentNode.id;
      const id = parseInt(listId.replace("item-", ""));
      console.log(id);

      //Get item
      const item2edit = ItemCtrl.getItemById(id);

      //Set current item
      ItemCtrl.setCurrentItem(item2edit);
    }
  };

  //Public methods
  return {
    init: function () {
      //Clear edit state
      UICtrl.clearEditState();
      //Fetch items from data structure
      const items = ItemCtrl.getItems();
      //Check if any items has been loaded
      if (!items.length) {
        UICtrl.hideList();
      } else {
        //Populate list with items
        UICtrl.populateItemList(items);
      }
      //Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //Load event listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, UICtrl);

//Initialize App
App.init();
