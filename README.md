## Bamazon

#### About Bamazon
* Bamazon is an interactive shopping app that allows users to purchase items as a customer; view, track and update the product inventory as a manager. Bamazon is built with mySQL server and node.js and interacts through the command line.

#### Installaltion Instructions
* Install node.js
* Install mySQL database
* Clone Bamazon project directory from GitHub
* Run ```BamazonSchema.sql``` and ```BamazonSeeds.sql``` againt mySQL database
* Navigate to your project folder in command line
* Type ```node bamazon.js``` to start the customer-side app
* Type ```node bamazonManager.js``` to start manager-side app

#### Customer user guide
* Type ```node bamazon.js``` to start customer app
* The app displays all of the products available for sale. Each record includes  
    *  id 
    *  name
    *  price
* To buy a product, follow the prompts and provide
    *  an id of the item to buy 
    *  a number of product units to buy
* Once the order is placed, the app checks if the store has enough of the product to meet the customer's request.
* If not, the app prevents the order from going through and displays a phrase 'Insufficient quantity!'.
* If the store has enough of the product, the order is fulfilled.
* The SQL database gets updated to reflect the remaining product quantity.
* When the update goes through, the app displays the order amount.

#### Manager user guide
* Type ```node bamazonManager.js``` to start customer app
* The app displays a menu containing the following options: 
    *  View Products for Sale 
    *  View Low Inventory
    *  Add to Inventory
    *  Add New Product

    ![Screen 1]("screenshots/bamazonManager-2.Products for Sale.png" "Title")
    
* When user selects View Products, the app lists all available items. Each record includes: 
    *  id
    *  name
    *  department
    *  price
    *  quantity
* When user selects View Low Inventory, the app lists all items with an inventory count lower than five.
* When user selects Add to Inventory, the app displays a dialog that lets the manager to replenish any item currently in the store.
* When user selects Add New Product, the app allows the manager to add a new product to the store. 
* To exit the app, select Exit. 

#### Project owner
* This Bamazon app is created and maintained by Elizabeth Engler. 