const fs = require('fs');
const path = require('path');

const pathToFile = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

const getProductsFromFile = callBack => {
    fs.readFile(pathToFile, (err, fileContent) => {
        if (err) {
            callBack([]);
        } else {
            callBack(JSON.parse(fileContent));
        }
    });
};

module.exports = class Product {
    constructor(title, imageUrl, price, description) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }

    save() {
        this.id = Math.random().toString();

        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(pathToFile, JSON.stringify(products), err => {
                console.log(err);
            });
        });
    }

    static fetchAll(callBack) {
        getProductsFromFile(callBack);
    }

    static findById(id, callBack) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id == id);
            callBack(product);
        });
    }
}