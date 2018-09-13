var mysql = require("mysql");
var inquirer = require ("inquirer");
var Table = require("cli-table");
var colors = require("colors");
colors.setTheme({
    bgOne: 'bgCyan',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    header: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
  });


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
  });

console.log("Hello, Supervisor.  Please make a selection.".bgOne);

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
          "View Product Sales by Department",
          "Create New Department"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "View Product Sales by Department":
          salesByDept();
          break;
  
        case "Create New Department":
          createDept();
          break;
        }
      });
  };

  function salesByDept() {
    connection.query("SELECT DISTINCT department_id, product.department_name, over_head_costs, product_sales FROM product INNER JOIN departments ON product.department_name = departments.department_name;", function(err, res) {
      var dept = {
        id: [],
        name: [],
        overhead: [],
        sales: [],
        profit: []
      };

      var table = new Table({
        head: ["department_id".header, "department_name".header, "over_head_costs".header, "product_sales".header, "total_profit".header], 
        colWidths: [20, 20, 20, 20, 20]
      });
      
      for(var i = 0; i < res.length; i++) {
          dept.id.push(res[i].department_id);
          dept.name.push(res[i].department_name); 
          dept.overhead.push(res[i].over_head_costs);
          dept.sales.push(res[i].product_sales);
      };
      
      for(var j = 0; j < dept.id.length && dept.name.length && dept.overhead.length && dept.sales.length; j++) {
      table.push(
            [dept.id[j], dept.name[j], "$"+dept.overhead[j], "$"+dept.sales[j]],
            //['First value', 'Second value', 'Third value', 'Fourth value', 'Fifth value']
      )
      };
      console.log(table.toString());
  });
};

  function createDept() {

  };