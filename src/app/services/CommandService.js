import {Command} from "../entities/Command.js";
import {Service} from "./helpers/Service.js";

export class CommandService extends Service{
    constructor(client) {
        super(client);
        this.client = client;
    }
    async all() {
        const response = await this.client.all(0,'/commands/');
        if (response && response.status && response.data && response.status === 200) {
            return {
                status: 200,
                data: response.data.map(command => Command.fromJSON(command))
            };
        }
        return null;
    }
    async get(id) {
        const response = await this.client.get('/commands/' + id);
        if (response && response.status && response.data && response.status === 200) {
            return {
                status: 200,
                data: Command.fromJSON(response.data)
            };
        }
        return null;
    }
}
