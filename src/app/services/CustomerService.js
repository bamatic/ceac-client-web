import {Service} from "./helpers/Service.js";
import {User} from "../entities/User.js";

export class CustomerService extends Service {
    constructor(client) {
        super(client);
        this.client = client;
    }
    async update(user) {
        const data = {
            tax_id: user.taxId,
            name: user.name,
            surname: user.surname,
            delivery_address_id: user.deliveryAddress.id,
            invoice_address_id: user.invoiceAddress.id,
            password: user.password,
            email: user.email
        }
        const response = await this.client.update(data, '/users/' + user.id);
        if (response && response.status && response.status === 200) {
            return {
                status:200,
                data: User.fromJSON(response.data)
            }
        }
        if (response && response.status ) {
            return {
                status: response.status,
                data: response
            }
        }
        return null;
    }
    async createAddress(data, type){
        const response = await this.client.store(data, '/addresses/?customerAddress=' + type, false);
        if (response && response.status && response.status === 200) {
            return {
                status:200,
                data: User.fromJSON(response.data)
            }
        }
        if (response && response.status ) {
            return {
                status: response.status,
                data: response
            }
        }
        return null;
    }
}
