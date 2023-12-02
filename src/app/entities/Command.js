import {CommandLine} from "./CommandLine.js";
import {Product} from "./Product.js";
import {Address} from "./Address.js";
import {User} from "./User.js";

export class Command {
    constructor(id, name, lines, state, commandDate, deliveryDate, tax, preTax, price, deliveryAddress, invoiceAddress, customer) {
        this.id = id;
        this.name = name;
        this.lines = lines;
        this.state = state;
        this.commandDate = commandDate;
        this.deliveryDate = deliveryDate;
        this.tax = tax;
        this.preTax = preTax;
        this.price = price;
        this.deliveryAddress = deliveryAddress;
        this.invoiceAddress = invoiceAddress;
        this.customer = customer;
    }
    preTax() {
        const initialValue = 0;
        return this.lines.reduce((accumulator, currentValue) => accumulator + currentValue.preTax(), initialValue);
    }
    tax() {
        const initialValue = 0;
        return this.lines.reduce((accumulator, currentValue) => accumulator + currentValue.tax(), initialValue);
    }
    price() {
        return this.preTax() + this.tax();
    }
    eraseLine(productId) {
        if (this.state !== 'WAITING') return false;
        this.lines = this.lines.filter(product => product.id !== productId);
        return true;
    }
    availableDate() {
        return Math.max(...this.lines.map(line=>line.product.availableDate));
    }
    static fromJSON(command) {
        return new Command(
            command.id,
            command.name,
            Command.commandLines(command.lines),
            command.state,
            new Date(command.command_date),
            new Date(command.delivery_date),
            command.tax,
            command.preTax,
            command.price,
            Address.fromJSON(command.deliveryAddress),
            Address.fromJSON(command.invoiceAddress),
            User.fromJSON(command.customer)
        )
    }
    static commandLines(lines) {
        return lines.map(line =>new CommandLine(
            line.id,
            line.unitPrice,
            line.taxPercent,
            line.qty,
            new Product(
                line.product.id,
                line.product.name,
                line.product.unitPrice,
                line.product.taxPercent,
                line.product.imageUrl,
                new Date(line.product.availableDate)

            )
        ))
    }
    stateTrans(translator) {
        return  translator.translate(this.state,'upper');
    }
    stateColor() {
        if (this.state === 'TRANS')
            return 'alert-warning';
        if (this.state === 'FINISH')
            return 'alert-success';
        return 'alert-info';
    }

}
