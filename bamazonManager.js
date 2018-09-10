var mysql = require("mysql");
var inquirer = require ("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
  });

console.log("Hello, Manager.  Please make a selection.");

connection.connect(function(err) {
    if (err) throw err;
    runSearch();
  });

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
      .then(function(answer) {
        switch (answer.action) {
        case "View Products for Sale":
          productSearch();
          break;
  
        case "View Low Inventory":
          lowStockSearch();
          break;
  
        case "Add to Inventory":
          addStock();
          break;
  
        case "Add New Product":
          addProduct();
          break;
        }
      });
  };

  function productSearch() {

  };

  function lowStockSearch() {

  };

  function addStock() {

  };

  function addProduct() {
    inquirer
        .prompt([
        {
            name: "product",
            type: "input",
            message: "What product would you like to add?"
        },
        {
            name: "department",
            type: "input",
            message: "In which department does this item belong?"
        },
        {
            name: "price",
            type: "input",
            message: "What is the price of this item?",
            validate: function(value) {
              if (isNaN(value) === false) {
                return true;
              }
              return false;
            }
        },
        {
            name: "quantity",
            type: "input",
            message: "Please enter the quantity of this item:",
            validate: function(value) {
              if (isNaN(value) === false) {
                return true;
              }
              return false;
            }
        }
    ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO product SET ?",
        {
          product_name: answer.product,
          department_name: answer.department,
          price: answer.price,
          stock_quantity: answer.quantity
        },
        function(err) {
          if (err) throw err;
          console.log("This product has been added to the inventory.");
          runSearch();
        }
      );
    });
  };