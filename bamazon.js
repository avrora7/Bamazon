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
    console.log("************************\n");
    start();
});

// function which prints items available for sale
function start() {
    var query = "SELECT item_id, product_name, department_name, price FROM products"
    connection.query(query, function (err, res) {
        if (err) throw err;

        // instantiate
        var table = new Table({
            head: ['ID', 'Name', 'Department', 'Price'],
            colWidths: [10, 20, 20, 10]
        });
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price]
            );
        }
        console.log(table.toString());
        itemSelect();
    });
}

function itemSelect() {
    inquirer
        .prompt([
            {
                name: "idSelection",
                type: "input",
                message: "Enter item id you would like to purchase: ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    console.log("\nYour selection must be a number");
                    return false;
                }
            },
            {
                name: "quantitySelection",
                type: "input",
                message: "Enter number of items you would like to purchase: ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    console.log("\nYour selection must be a number");
                    return false;
                }
            }
        ])
        .then(function (answer) {
            var query = "SELECT stock_quantity FROM products WHERE item_id = ?";
            connection.query(query, [answer.idSelection], function (err, res) {
                if (res.length === 0) {
                    console.log("Incorrect item id. \nChoose item id from the list above\n");
                    start();
                }
                else if (answer.quantitySelection > res[0].stock_quantity) {
                    console.log("Insufficient quantity!");
                    console.log("Choose smaller quantity or another item from the list");
                    start();
                } else {
                    runPurchase(answer.idSelection, answer.quantitySelection);
                }
            });
        });
}

function runPurchase(itemId, qty) {
    var query = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?";
    connection.query(query, [qty, itemId], function (err, res) {
        var query = "SELECT price FROM products WHERE item_id = ?";
        connection.query(query, [itemId], function (err, res) {
            var priceChosen = res[0].price;
            console.log("Your total purchase price is $" + priceChosen * qty);
            console.log("Thank you for shopping with us!")
            connection.end();
            return true;
        });
    });
}
