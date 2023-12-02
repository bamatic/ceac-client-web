export class Address {
    constructor(address, town, postalCode, state, region) {
        this.address = address;
        this.town = town;
        this.postalCode = postalCode;
        this.state = state;
        this.region = region;
    }
    static fromJSON(jsonAddress) {
        return new Address(
            jsonAddress.address,
            jsonAddress.town,
            jsonAddress.postalCode,
            jsonAddress.state,
            jsonAddress.region
        )
    }
}
