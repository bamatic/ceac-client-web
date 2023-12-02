export class Service {
    constructor(client) {
        this.client = client;
    }
    async getUser() {
        const response = await this.client.get('/users/5');
        if (response && response.status && response.data && response.status === 200)
            return response;
        return null;
    }
    async getShoppingCard() {
        const response = await this.client.get('/shopping-card/');
        if (response && response.status && response.data && response.status === 200)
            return response;
        return null;
    }

}
