DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS product;

USE bamazon_db;

CREATE TABLE product (
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
    stock_quantity INT(100) NOT NULL,
    product_sales DECIMAL(65,2) NOT NULL,
	PRIMARY KEY(item_id)
);

CREATE TABLE departments (
	department_id INTEGER(11) AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(100) NOT NULL,
	over_head_costs DECIMAL(65,2) NOT NULL,
	PRIMARY KEY(department_id)
);

/* Pre-selected items inserted into product table */
INSERT INTO product SET product_name="Cashmere Sweater", department_name="Clothing", price=50.00, stock_quantity=10, product_sales=0;
INSERT INTO product SET product_name="Bicycle", department_name="Sporting Goods", price=75.50, stock_quantity=55, product_sales=0;
INSERT INTO product SET product_name="Dishware Set", department_name="Home Furnishings", price=250.70, stock_quantity=5, product_sales=0;
INSERT INTO product SET product_name="Canoe", department_name="Sporting Goods", price=100.00, stock_quantity=250, product_sales=0;
INSERT INTO product SET product_name="Playstation 4", department_name="Games/Entertainment", price=375.00, stock_quantity=2, product_sales=0;
INSERT INTO product SET product_name="Puppy Chew Toy", department_name="Pet Supplies", price=5.99, stock_quantity=300, product_sales=0;
INSERT INTO product SET product_name="iPhone 10", department_name="Electronics", price=900.00, stock_quantity=1, product_sales=0;
INSERT INTO product SET product_name="Diskman", department_name="Antiques", price=1.45, stock_quantity=500, product_sales=0;
INSERT INTO product SET product_name="Lego Set", department_name="Toys", price=25.00, stock_quantity=756, product_sales=0;
INSERT INTO product SET product_name="Guess Jeans", department_name="Clothing", price=150.00, stock_quantity=689, product_sales=0;

/* Pre-selected items inserted into departments table */
INSERT INTO departments SET department_name="Clothing", over_head_costs=1000.00;
INSERT INTO departments SET department_name="Sporting Goods", over_head_costs=1500.00;
INSERT INTO departments SET department_name="Home Furnishings", over_head_costs=2000.00;
INSERT INTO departments SET department_name="Games/Entertainment", over_head_costs=1000.00;
INSERT INTO departments SET department_name="Pet Supplies", over_head_costs=1000.00;
INSERT INTO departments SET department_name="Electronics", over_head_costs=3000.00;
INSERT INTO departments SET department_name="Antiques", over_head_costs=1000.00;
INSERT INTO departments SET department_name="Toys", over_head_costs=1500.00;

SELECT * FROM product;

SELECT * FROM departments;

SELECT DISTINCT department_id, departments.department_name, over_head_costs, product_sales FROM departments INNER JOIN product ON departments.department_name = product.department_name;