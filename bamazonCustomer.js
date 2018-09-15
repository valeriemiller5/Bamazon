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

console.log("WELCOME TO BAMAZON!".bold.magenta + "\nPlease wait while available items load...");

connection.connect(function(err) {
    if (err) throw err;
    runInventory();
  });

function runInventory() {
  connection.query("SELECT * FROM product", function(err, res) {
    if (err) throw err;

    var product = {
      id: [],
      prodName: [],
      deptName: [],
      price: [],
      stock: []
    };

    var table = new Table({
      head: ["Item ID".header, "Product".header, "Department".header, "Price".header, "Available Stock".header], 
      colWidths: [20, 20, 20, 20, 20]
    });
    
    for(var i = 0; i < res.length; i++) {
        product.id.push(res[i].item_id);
        product.prodName.push(res[i].product_name); 
        product.deptName.push(res[i].department_name);
        product.price.push(res[i].price);
        product.stock.push(res[i].stock_quantity);
    };
    
    for(var j = 0; j < product.id.length && product.prodName.length && product.deptName.length && product.price.length && product.stock.length; j++) {
    table.push(
          [product.id[j], product.prodName[j], product.deptName[j], "$"+product.price[j], product.stock[j]],
          //['First value', 'Second value', 'Third value', 'Fourth value', 'Fifth value']
    )
    };
    console.log(table.toString());
    
    inquirer
      .prompt([
        {
          name: "choice",
          type: "input",
          message: "Please enter the id number of the item you would like to purchase:",
          filter: Number,
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            console.log(" <-- PLEASE INPUT NUMERICAL VALUES ONLY".error)
            return false;
          }
        },
        {
          name: "purchase",
          type: "input",
          message: "Please enter the quantity you would like to purchase:",
          filter: Number,
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            console.log(" <-- PLEASE INPUT NUMERICAL VALUES ONLY".error)
            return false;
          }
        }
      ]).then(function(answer){
        var chosenItem;
        for (var i = 0; i < res.length; i++) {
          if (res[i].item_id === answer.choice) {
            chosenItem = res[i];
          }
        }
        if(chosenItem.stock_quantity >= parseFloat(answer.purchase)) {
          connection.query(
            "UPDATE product SET ? WHERE ?",
            [
              {
                stock_quantity: chosenItem.stock_quantity - answer.purchase
              },
              {
                item_id: chosenItem.item_id
              }
            ],
            function(err, result) {
              //if(err) throw err;
              //console.log(result.affectedRows + " record(s) updated");
              console.log(("Purchase success!" + "\nYour total is: " + "$" + totalDue).bold.welcome);
              //setTimeout(runInventory, 1000);
              setTimeout(quit, 1500);
            }
          );
          var totalDue = parseFloat(answer.purchase * chosenItem.price);
          connection.query(
            "UPDATE product SET ? WHERE ?", 
            [
              {
                product_sales: totalDue
              },
              {
                item_id: chosenItem.item_id
              }
            ],
            function(err, result) {
              //if(err) throw err;
              //console.log(result.affectedRows + " record(s) updated");
              //setTimeout(quit, 1000);
            }
          )
        } else {
          console.log("Insufficient quantity!  Please try again.");
          setTimeout(quit, 1000);
        }
      });
  });
};

function quit() {
  inquirer
    .prompt([
      {
        name: "confirm",
        type: "confirm",
        message: "Do you wish to purchase more items?",
        default: true
      }
  ]).then(function(end){
    if(end.confirm) {
      //runInventory();
      return runInventory();
    } else {
      connection.end();
      return false;
    }
  });
};
  