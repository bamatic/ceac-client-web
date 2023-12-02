export class AuthenticationService {
    constructor(client) {
        this.client = client;
    }
    async getAccess(username, password) {
        localStorage.clear();
        await this.client.login(username, password, "/login/");
        const token = localStorage.getItem("X-BAMATIC-AUTH")
        return !!token;

    }
}
