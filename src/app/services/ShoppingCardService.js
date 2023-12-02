import {Service} from "./helpers/Service.js";
import {ShoppingCardItem} from "../entities/ShoppingCardItem.js";

export class ShoppingCardService extends Service{
    constructor(client) {
        super(client);
        this.client = client;
    }
    async all() {
        const response = await this.client.all(0,'/shopping-card/');
        if (response && response.status && response.data && response.status === 200) {
            console.log('i have the items', response.data)
            return {
                status: 200,
                data: response.data.map(item => ShoppingCardItem.fromJSON(item))
            };
        }
        console.log('i do NOT have the items', response.status)
        return null;
    }
    async update(id, qty){
        const data = {
            product_id:id,
            qty:qty
        }
        const response = await this.client.update(data, '/shopping-card/' + id);
        if (response && response.status && response.data && response.status === 200) {
            console.log('i have the items', response.data)
            return {
                status: 200,
                data: ShoppingCardItem.fromJSON(response.data)
            };
        }
        console.log('i do NOT have the items', response.status)
        return null;
    }
    async delete(id) {
        console.log('deleting id=' + id);
        const response = await this.client.delete('/shopping-card/' + id);
        if (response && response.status && response.data && response.status === 200) {
            console.log('i have delete the items', response.data)
            return {
                status: 200,
                data: true
            };
        }
        console.log('i do NOT have delete the item');
        return null;
    }
    async doCommand(commandName) {
        const response1 = await this.all();
        if (response1 && response1.status && response1.status === 200) {
            const items = response1.data;
            for (const item of items) {
                console.log(item)
            }
            const totalPrice = items
                .map(item => item.price)
                .reduce((partialSum, price) => partialSum + price, 0);
            console.log(totalPrice);
            const data = {
                commandDate: new Date(),
                deliveryDate: new Date(Math.max(
                    Math.max(...items.map(item=>item.product.availableDate)),
                    (new Date()).getTime() + 2 * 24 * 60 * 60 * 1000
                )),
                name: commandName,
                buyerPrice: totalPrice,
                lines: items.map((item) => {
                    return {
                        product_id: item.product.id,
                        qty: item.qty
                    }
                })
            }
            console.log(data)
            const response = await this.client.store(data, '/commands/', true);
            if (response && response.status && response.data && response.status === 200) {
                return {
                    status: 200,
                    data: response.data.id
                };
            }
            return null;
        }
    }
}
