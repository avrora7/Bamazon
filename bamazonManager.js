var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "bootcamp",
    database: "bamazon_DB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    runSearch();
});

// questions to take further actions
function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    productSaleSearch();
                    break;

                case "View Low Inventory":
                    lowInventorySearch();
                    break;

                case "Add to Inventory":
                    inventoryAdd();
                    break;

                case "Add New Product":
                    newProductAdd();
                    break;
            }
        });
}

// function to print items available for sale
function productSaleSearch() {
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products"
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + ". " + res[i].product_name + " ($" + res[i].price + ") " + res[i].stock_quantity + " unit(s)");
        }
        runSearch();
    });
}

// function to print low inventory list
function lowInventorySearch() {
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("==> " + res[i].item_id + ". " + res[i].product_name + " ($" + res[i].price + ") " + res[i].stock_quantity + " unit(s)");
            console.log("End of low inventory list");
        }
        runSearch();
    });
}

// function to add item to inventory
function inventoryAdd() {
    inquirer
        .prompt([{
            name: "inputId",
            type: "input",
            message: "Enter the id number of the item you would like to add to the inventory",
        },
        {
            name: "inputAmount",
            type: "input",
            message: "How many units of this item would you like to add?",
        }
        ]).then(function (managerAdd) {
            connection.query("SELECT count(*) AS quantity FROM products WHERE item_id = ?",
                [managerAdd.inputId], function (err, res) {
                    if (res[0].quantity === 0) {
                        console.log("This item id does not exist")
                        return false
                    }
                    connection.query("UPDATE products SET ? WHERE ?", [{
                        stock_quantity: managerAdd.inputAmount
                    }, {
                        item_id: managerAdd.inputId
                    }], function (err, res) {
                        runSearch();
                    });
                }
            )
        });
}

// function to add new product to inventory
function newProductAdd() {
    inquirer
        .prompt([{
            name: "inputId",
            type: "input",
            message: "Enter the id number of the item you would like to add to the inventory",
        },
        {
            name: "inputName",
            type: "input",
            message: "Enter the item name you would like to add to the inventory",
        },
        {
            name: "inputDept",
            type: "input",
            message: "Enter the department you would like the item to be added to",
        },
        {
            name: "inputPrice",
            type: "input",
            message: "Enter the item price",
        },
        {
            name: "inputAmount",
            type: "input",
            message: "Enter the amount of units to be added",
        }
        ]).then(function (managerNewAdd) {
            connection.query("UPDATE products SET ?", [{
                item_id: managerNewAdd.inputId,
                product_name: managerNewAdd.inputName,
                department_name: managerNewAdd.inputDept,
                price: managerNewAdd.inputPrice,
                stock_quantity: managerNewAdd.inputAmount
            }], function (err, res) {
            });
            runSearch();
            connection.end();
        });
}
