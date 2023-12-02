export class Product {

    constructor(id, name, unitPrice, taxPercent, imageUrl, availableDate, isInShoppingCard) {
        this.id = id;
        this.name = name;
        this.unitPrice = unitPrice;
        this.taxPercent = taxPercent;
        this.imageUrl = imageUrl;
        this.availableDate = availableDate;
        this.isInShoppingCard = isInShoppingCard;
    }
    preTax() {
        return this.unitPrice;
    }
    tax() {
        return this.preTax() * this.taxPercent / 100;
    }
    price() {
        return this.preTax() + this.tax();
    }
    static fromJSON(json) {
        return new Product(
            json.id,
            json.name,
            json.unitPrice,
            json.taxPercent,
            json.imageUrl,
            new Date(json.availableDate),
            json.isInShoppingCard
        )
    }
}
