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
    start();
});

// function which prints items available for sale
function start() {
    var query = "SELECT item_id, product_name, price FROM products"
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + ". " + res[i].product_name + " ($" + res[i].price + ")");
        }
        itemSelect();
    });
}

function itemSelect() {
    inquirer
        .prompt([
            {
                name: "idSelection",
                type: "input",
                message: "Enter id of the item you would like to purchase:",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    console.log("  Your selection must be a number")
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
                    console.log("  Your selection must be a number")
                    connection.end();
                    return false;
                }
            }
        ])
        .then(function (answer) {
            var query = "SELECT stock_quantity FROM products WHERE item_id = ?";
            connection.query(query, [answer.idSelection], function (err, res) {
                if (answer.quantitySelection > res[0].stock_quantity) {
                    console.log("Insufficient quantity!")
                    return false
                }
                runPurchase(answer.idSelection, answer.quantitySelection);
            });
        });
}

function runPurchase(itemId, qty) {
    var query = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?";
    connection.query(query, [qty, itemId], function (err, res) {
        console.log("You purchase was sucessful!")
        connection.end();
        return true
    });
}
