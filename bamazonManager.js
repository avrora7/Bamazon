var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

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

// function to set questions choices
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
                "Add New Product",
                "Exit"
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

                case "Exit":
                    connection.end();
                    return true;
            }
        });
}

// function to print items available for sale
function productSaleSearch() {
    var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products"
    connection.query(query, function (err, res) {
        if (err) throw err;

        // instantiate
        var table = new Table({
            head: ['ID', 'Name', 'Department', 'Price', 'Quantity'],
            colWidths: [10, 20, 20, 10, 10]
        });
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price, res[i].stock_quantity]
            );
        }
        console.log(table.toString());
        console.log("End of inventory list");
        console.log("************************\n");
        runSearch();
    });
}

// function to print low inventory list
function lowInventorySearch() {
    var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE stock_quantity < 5";
    connection.query(query, function (err, res) {
        if (res.length === 0) {
            console.log("All quantities are up to date!");
            console.log("************************\n");
        } else {
            // instantiate
            var table = new Table({
                head: ['ID', 'Name', 'Department', 'Price', 'Quantity'],
                colWidths: [10, 20, 20, 10, 10]
            });
            for (var i = 0; i < res.length; i++) {
                table.push(
                    [res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price, res[i].stock_quantity]
                );
            }
            console.log(table.toString());
            console.log("End of low inventory list");
            console.log("************************\n");
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
            message: "Enter the item id number you would like to add to the inventory: ",
        }

            // function to check if id # exists
        ]).then(function (managerCheck) {
            connection.query("SELECT count(*) AS quantity FROM products WHERE item_id = ?",
                [managerCheck.inputId], function (err, res) {
                    if (res[0].quantity === 0) {
                        console.log("This item id does not exist");
                        console.log("************************\n");
                        runSearch();
                    }

                    // function to add specific amount of items to inventory
                    inquirer
                        .prompt([{
                            name: "inputAmount",
                            type: "input",
                            message: "Enter quantity of units you would you like to add: ",
                        }
                        ]).then(function (managerAdd) {
                            connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?", [
                                managerAdd.inputAmount, managerCheck.inputId], function (err, res) {
                                    if (err) throw err;
                                    console.log("Item(s) added to inventory");
                                    console.log("************************\n");
                                    runSearch();
                                });
                        })
                }
            )
        });
}

// function to add new product to inventory
function newProductAdd() {
    inquirer
        .prompt([{
            name: "inputName",
            type: "input",
            message: "Enter the item name you would like to add to the inventory: ",
        },
        {
            name: "inputDept",
            type: "input",
            message: "Enter the department you would like the item to be added to: ",
        },
        {
            name: "inputPrice",
            type: "input",
            message: "Enter the item price: $",
        },
        {
            name: "inputAmount",
            type: "input",
            message: "Enter the amount of units to be added: ",
        }
        ]).then(function (managerNewAdd) {
            connection.query("INSERT INTO products SET ?", [{
                product_name: managerNewAdd.inputName,
                department_name: managerNewAdd.inputDept,
                price: managerNewAdd.inputPrice,
                stock_quantity: managerNewAdd.inputAmount
            }], function (err, res) {
                if (err != null) {
                    console.log(err);
                }
            });
            console.log("New item(s) added to inventory");
            console.log("************************\n");
            runSearch();
        });
}
