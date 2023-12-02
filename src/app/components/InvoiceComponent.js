import {Component} from "./helpers/Component.js";
import {InvoiceModal} from "./modals/InvoiceModal.js";
export async function InvoiceComponent(service, translator) {

    Component.setTitle('top-nav-invoices', translator.translate("your invoices", "title"),'<i class="bi bi-receipt">');

    const response = await service.all();
    if (response && response.status && response.status === 200) {

        const commands = response.data;

        const col = Component.getContentColumn();

        const tableRows = commands.map(command=> {
            return {
                id: command.id,
                commandDate: command.commandDate,
                preTax: command.preTax,
                tax: command.tax,
                price: command.price
            }
        })
        const tableHeaders = [
            {type: 'text', value: 'N°', dataKey: 'id'},
            {type: 'date', value: translator.translate("date", "title"), dataKey: 'commandDate'},
            {type: 'currency', value: translator.translate("pretax", "upper"), dataKey: 'preTax'},
            {type: 'currency', value: translator.translate("tax", "upper"), dataKey: 'tax'},
            {type: 'currency', value: translator.translate("price", "title"), dataKey: 'price'},
            {type: 'buttons', value:translator.translate("view", "title"), dataKey: 'id'}

        ]
        const table = Component.createTable(tableHeaders, tableRows);

        col.appendChild(table);

        addActionButtons(tableRows);

        const modalDiv = document.getElementById('modal-1');
        modalDiv.innerHTML = InvoiceModal.modal(translator);
        InvoiceModal.addSCButtonListener(service,translator);
        Component.setUser(service)
            .catch(error => console.log(error));

        Component.setShoppingCard(service)
            .catch(error => console.log(error));

    }
}
function addActionButtons(tableRows) {
    for (const row of tableRows) {
        const btnTd = document.getElementById('button-id-' + row.id);
        const pdfBtn = document.createElement('button');
        pdfBtn.setAttribute('id', 'invoice-id' + row.id);
        pdfBtn.setAttribute('type', 'button');
        pdfBtn.setAttribute('data-bs-toggle', 'modal');
        pdfBtn.setAttribute('data-bs-target', '#invoiceModal');
        pdfBtn.setAttribute('data-bs-invoice-id', row.id);
        pdfBtn.style.marginLeft = '1em';
        pdfBtn.innerHTML = '<i class="bi bi-receipt"></i>';
        pdfBtn.classList.add('invoice-btn', 'btn', 'btn-outline-danger', 'btn-sm');
        btnTd.appendChild(pdfBtn);
    }
}
