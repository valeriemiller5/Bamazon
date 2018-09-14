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
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          message: "Please enter the id number of the item you would like to purchase:",
          choices: function() {
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
            
            var choiceArray = [];
            for (var i = 0; i < res.length; i++) {
              choiceArray.push(res[i].product_name);
            }
            return choiceArray;
          }
        },
        {
          name: "purchase",
          type: "input",
          message: "Please enter the quantity you would like to purchase:",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            console.log(" <-- PLEASE INPUT NUMERICAL VALUES ONLY")
            return false;
          }
        }
      ]).then(function(answer){
        var chosenItem;
        for (var i = 0; i < res.length; i++) {
          if (res[i].product_name === answer.choice) {
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
              console.log("Purchase success!" + "\nYour total is: " + "$" + totalDue);
              setTimeout(runInventory, 500);
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
              setTimeout(runInventory, 500);
            }
          )
        } else {
          console.log("Insufficient quantity!  Please try again.");
          setTimeout(runInventory, 500);
        }
      });
  });
};
  