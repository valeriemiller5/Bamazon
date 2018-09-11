DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE product (
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
    stock_quantity INT(100) NOT NULL,
	PRIMARY KEY(item_id)
);

INSERT INTO product SET product_name="Cashmere Sweater", department_name="Clothing", price=50.00, stock_quantity="10";
INSERT INTO product SET product_name="Bicycle", department_name="Sporting Goods", price=75.50, stock_quantity="55";
INSERT INTO product SET product_name="Dishware Set", department_name="Home Furnishings", price=250.70, stock_quantity="5";
INSERT INTO product SET product_name="Canoe", department_name="Sporting Goods", price=100.00, stock_quantity="250";
INSERT INTO product SET product_name="Playstation 4", department_name="Games/Entertainment", price=375.00, stock_quantity="2";
INSERT INTO product SET product_name="Puppy Chew Toy", department_name="Pet Supplies", price=5.99, stock_quantity="300";
INSERT INTO product SET product_name="iPhone 10", department_name="Electronics", price=900.00, stock_quantity="1";
INSERT INTO product SET product_name="Diskman", department_name="Antiques", price=1.45, stock_quantity="500";
INSERT INTO product SET product_name="Lego Set", department_name="Toys", price=25.00, stock_quantity="756";
INSERT INTO product SET product_name="Guess Jeans", department_name="Clothing", price=150.00, stock_quantity="689";

SELECT * FROM product;