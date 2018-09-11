var mysql = require("mysql");
var inquirer = require ("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
  });

console.log("Welcome to Bamazon!" + "\nPlease wait while available items load...");

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
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < res.length; i++) {
              choiceArray.push(res[i].product_name);
            }
            return choiceArray;
          },
          message: "Please enter the id number of the item you would like to purchase:"
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
              //setTimeout(runInventory, 500);
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