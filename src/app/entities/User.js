export class User {
    constructor(id, name, surname, taxId) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.taxId = taxId;
    }
    static fromJSON(json) {
        return new User(
            json.id,
            json.name,
            json.surname,
            json.taxId
        )
    }
    static validePassword(password) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
        return password.length>7 && password.length < 32 && regex.test(password);
    }
}
