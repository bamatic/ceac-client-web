import {Product} from "./Product.js";
import {Address} from "./Address.js";

export class ShoppingCardItem {

    constructor(id, preTax, tax, price, qty, product, deliveryAddress, invoiceAddress, name) {
        this.id = id;
        this.preTax = preTax;
        this.tax = tax;
        this.price = price;
        this.qty = qty;
        this.product = product;
        this.deliveryAddress = deliveryAddress;
        this.invoiceAddress = invoiceAddress;
        this.name = name;
    }
    static fromJSON(json) {
        return new ShoppingCardItem(
            json.id,
            json.preTax,
            json.tax,
            json.price,
            json.qty,
            Product.fromJSON(json.product),
            Address.fromJSON(json.customer.deliveryAddress),
            Address.fromJSON(json.customer.invoiceAddress),
            json.customer.name + ' ' + json.customer.surname
        )
    }
    preTax() {
        return this.price * this.qty;
    }
    tax() {
        return this.preTax() * this.tax / 100;
    }
    price() {
        return this.tax() + this.preTax();
    }
}
