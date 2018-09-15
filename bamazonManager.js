var mysql = require("mysql");
var inquirer = require ("inquirer");
var Table = require("cli-table");
var colors = require("colors");
colors.setTheme({
    bgOne: 'bgCyan',
    info: 'green',
    header: 'cyan',
    welcome: 'magenta',
    warn: 'yellow',
    error: 'red',
    bold: 'bold'
  });

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
  });

console.log("Hello, Manager.  Please make a selection.".bold.header);

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
          "Add New Product", 
          "Quit"
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
        
        case "Quit":
          console.log("Goodbye!".bold.info);
          connection.end();
          break;
        }
      });
  };

  function productSearch() {
    connection.query("SELECT * FROM product;", function(err, res) {
      var table = new Table({
        head: ["item_id".header, "product_name".header, "department_name".header, "price".header, "stock_quantity".header], 
        colWidths: [20, 20, 20, 20, 20]
      });

      for(var i = 0; i < res.length; i++) {
        table.push(
          [res[i].item_id, res[i].product_name, res[i].department_name, "$"+res[i].price, res[i].stock_quantity]
        )
      };
      console.log(table.toString());
      setTimeout(runSearch, 500);
    });
  };

  function lowStockSearch() {
    console.log("These products are low in inventory:".warn);
    connection.query("SELECT * FROM product;", function(err, res) {
      var table = new Table({
        head: ["product_name".header, "stock_quantity".header], 
        colWidths: [50, 50]
      });

      for(var i = 0; i < res.length; i++) {
          if(res[i].stock_quantity < 6) {
            table.push(
              [res[i].product_name, res[i].stock_quantity]
            )
          }
        };
        console.log(table.toString());
        setTimeout(runSearch, 500);
    });
  };

  function addStock() {
    connection.query("SELECT * FROM product", function(err, res) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "productChoice",
            type: "list",
            choices: function() {
              var choiceArray = [];
              for (var i = 0; i < res.length; i++) {
                choiceArray.push(res[i].product_name);
              }
              return choiceArray;
            },
            message: "Which product would you like to restock?"
          },
          {
            name: "restock",
            type: "input",
            message: "Please enter the quantity to restock this product:",
            validate: function(value) {
              if (isNaN(value) === false) {
                return true;
              }
              console.log(" <-- PLEASE INPUT NUMERICAL VALUES ONLY".error)
              return false;
            }
          }
        ]).then(function(answer){
          var restockItem;
          for (var i = 0; i < res.length; i++) {
            if (res[i].product_name === answer.productChoice) {
              restockItem = res[i];
            }
          }
          var replenish = restockItem.stock_quantity + parseInt(answer.restock);
          connection.query(
            "UPDATE product SET ? WHERE ?",
              [
                {
                  stock_quantity: replenish
                },
                {
                  item_id: restockItem.item_id
                }
              ],
            function(err, result) {
                //if(err) throw err;
                console.log(result.affectedRows + " record(s) updated");
                console.log("This product has been restocked!");
                setTimeout(runSearch, 500);
              }
            );
        });
    });
  };

  function addProduct() {
    connection.query("SELECT * FROM product", function(err, res) {
      if(err) throw err;
      inquirer
          .prompt([
          {
              name: "product",
              type: "input",
              message: "What product would you like to add?"
          },
          {
              name: "department",
              type: "list",
              message: "In which department does this item belong?",
              choices: function() {
                var choiceArray = [];
              for (var i = 0; i < res.length; i++) {
                choiceArray.push(res[i].department_name);
              }
              return choiceArray;
              }
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
            stock_quantity: answer.quantity,
            product_sales: 0
          },
          function(err) {
            if (err) throw err;
            console.log("This product has been added to the inventory.");
            setTimeout(runSearch, 500);
          }
        );
      });
    });
  };