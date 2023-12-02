export class CommandLine {
    constructor(id, unitPrice, taxPercent, qty, product) {
        this.id = id;
        this.unitPrice = unitPrice;
        this.taxPercent = taxPercent;
        this.qty = qty;
        this.product = product;

    }
    preTax() {
        return this.unitPrice * this.qty;
    }
    tax() {
        return this.preTax() * this.taxPercent / 100;
    }
    price() {
        return this.tax() + this.preTax();
    }
}
