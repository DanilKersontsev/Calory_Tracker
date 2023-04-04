// Storage controller
const StorageCtrl = (function (){
    // public methods
    return {
        storeItem: function (item){
            let items;
            // check if any items in ls
            if (localStorage.getItem('items') === null){
                items = [];
                // push new item
                items.push(item);
                //set ls
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                // get what is already in ls
                items = JSON.parse(localStorage.getItem('items'));
                // push new item
                items.push(item);
                // reset ls
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function (){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        }
    }
})();
// create later

// Item Controller
const ItemCtrl = (function(){
    const Item = function(id,name,calories){
        this.id = id
        this.name = name
        this.calories = calories
    }

    const data = {
        items: [
            // {id:0, name:"Steak", calories: 1200},
            // {id:1, name:"Cookie", calories: 400},
            // {id:2, name:"eg", calories: 300}
        ],
        total: 0,
        currentItem: null
    }

    return{
        getItems: function(){
            return data.items
        },
        addItem: function(name, calories){
            let ID;
            if(data.items.length >0){
                ID = data.items[data.items.length-1].id + 1
                console.log(ID)
            } else{
                ID = 0
            }
            calories = parseInt(calories)
            newItem = new Item(ID,name, calories);
            data.items.push(newItem);
            return newItem
        },
        getTotalCalories: function(){
            let total = 0
            data.items.forEach(function(item){
                total = total + item.calories
                console.log(total)
            })
            data.total = total
            console.log(data.total)
            return data.total
        },
        logData: function(){
            return data
        }
    }
})();
const UICtrl = (function(){
    const UISelectors = {
        itemList: "#item-list",
        itemNameInput: "#item-name",
        itemCaloriesInput: "#item-calories",
        addBtn: ".add-btn",
        totalCalories: ".total-calories",
        updateBtn:  ".update-btn",
        deleteBtn: ".delete-btn"
    }
    return {
        populateItemList: function(items){
            let html= "";

            items.forEach(
                function(item) {
                    html += `<li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                    </li>`;
                });
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getSelectors: function(){
            return UISelectors;
        },
        getItemInput: function(){
            return {
                name:document.querySelector(UISelectors.itemNameInput).value,
                calories:document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item){
            const li= document.createElement("li")
            li.className = "collection-item"
            li.id = `item-${item.id}`
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em> <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`
            document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li)
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = ""
            document.querySelector(UISelectors.itemCaloriesInput).value = ""
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories
        },
    }
})();
const App = (function(ItemCtrl,StorageCtrl,UICtrl){
    const loadEventListeners = function(){
        const UISelectors = UICtrl.getSelectors()
        document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);
        document.querySelector('ul').addEventListener("click", updatemeal);
        document.querySelector(UISelectors.updateBtn).addEventListener("click", mealupdate);

        // add document reload event
        document.addEventListener('DOMContentLoaded', getItemsFromStorage)
    }
    // item add submit function
    const itemAddSubmit = function(event) {
        const input = UICtrl.getItemInput()
        if (input.name !== '' && input.calories !== '') {
            const newItem = ItemCtrl.addItem(input.name, input.calories)
            UICtrl.addListItem(newItem)
            // get total calories to UI
            const totalCalories = ItemCtrl.getTotalCalories()
            // add total calories to UI
            UICtrl.showTotalCalories(totalCalories)
            // store in localStorage
            StorageCtrl.storeItem(newItem);
            // clear fields
            UICtrl.clearInput()
            event.preventDefault()
        }
    }
        const updatemeal = function (event){
                if(event.target.className === 'edit-item fa fa-pencil'){
                const UIselector = UICtrl.getSelectors()
                document.querySelector(UIselector.updateBtn).style.display = 'inline'
                document.querySelector(UIselector.deleteBtn).style.display = 'inline'
                document.querySelector(UIselector.addBtn).style.display = 'none'
            }
        }
        // meal update
    const mealupdate = function (event){
        const input = UICtrl.getItemInput()
        const UIselector = UICtrl.getSelectors()
        const newItem = ItemCtrl.addItem(input.name, input.calories)
        if (input.name !== '' && input.calories !== ''){

        }


  }

        // get items from storage
    const getItemsFromStorage = function (){
        // get items from storage
        const items = StorageCtrl.getItemsFromStorage()
        // set storage items to ItemCtrl data items
        items.forEach(function (item){
            ItemCtrl.addItem(item['name'], item['calories'])
        })
        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // ad total calories to UI
        UICtrl.showTotalCalories(totalCalories);
        // populate items list
        UICtrl.populateItemList(items)
    }
    return {
        init: function() {
            console.log('Initializing App')
            // fetch items from data structure
            const items =ItemCtrl.getItems()
            // popilate items list
            UICtrl.populateItemList(items)
            // load event listeners
            loadEventListeners();
        }
    }
}) (ItemCtrl, StorageCtrl, UICtrl);

// Initalize App
App.init()