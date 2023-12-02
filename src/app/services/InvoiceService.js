export class InvoiceService {
    constructor(client) {
        this.client = client;
    }

    get() {
        const response = this.client.get('invoices');
    }
    store(invoice) {
        return this.client.store('invoice', invoice);
    }
}
