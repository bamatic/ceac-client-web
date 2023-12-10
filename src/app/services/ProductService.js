import {Product} from "../entities/Product.js";
import {Service} from "./helpers/Service.js";
import {ShoppingCardItem} from "../entities/ShoppingCardItem.js";

export class ProductService extends Service{
    constructor(client) {
        super(client);
        this.client = client;
    }
    async all() {
      const response = await this.client.all(0,'/products/');
      if (response && response.status && response.data && response.status === 200)
          return response;
      return null;
    }
    async get(id) {
        const response = await this.client.get('/products/' + id);
        if (response.status === 200)
            return {
                status: 200,
                data: Product.fromJSON(response.data)
            };
        return null;
    }
    async addToShoppingCard(data){
        const response = await this.client.store(data, '/shopping-card/', false);
        if (response && response.status && response.data && response.status === 200) {
            return {
                status: 200,
                data: ShoppingCardItem.fromJSON(response.data)
            };
        }
        return null;
    }
}
