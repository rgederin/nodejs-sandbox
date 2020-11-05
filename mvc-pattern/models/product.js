const products = [];

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        products.push(this);
        console.log(this);
        console.log(products);
    }

    static fetchAll() {
        return products;
    }
}