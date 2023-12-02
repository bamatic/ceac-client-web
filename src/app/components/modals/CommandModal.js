import {Component} from '../helpers/Component.js';
export class CommandModal {

    static addSCButtonListener(service, translator) {
        const exampleModal = document.getElementById('commandModal')
        exampleModal.addEventListener('show.bs.modal', async function (event) {
            const button = event.relatedTarget
            const commandId = button.getAttribute('data-bs-command-id')
            const response = await service.get(commandId);
            if (response && response.status && response.status === 200) {
                const command = response.data;
                const modalTitle = exampleModal.querySelector('.modal-title')
                const invoiceButton = document.getElementById("invoice-button");
                invoiceButton.setAttribute('data-bs-invoice-id', command.id);
                modalTitle.textContent = translator.translate('command', "title") + ': ' + command.name;
                const stateHeader = document.getElementById('state');
                stateHeader.innerHTML = '<b>' + command.stateTrans(translator) + '</b>';
                removeColors(stateHeader);
                stateHeader.classList.add(command.stateColor());

                document.getElementById('header-table').innerHTML = CommandModal.headerTable(command, translator);
                document.getElementById('delivery').innerHTML = CommandModal.delivery(
                    command.deliveryAddress,
                    command.customer,
                    translator
                );
                const itemsDiv = document.getElementById('items');
                itemsDiv.innerHTML = '';
                const items = CommandModal.itemsTable(command.lines, translator);
                itemsDiv.appendChild(items);
            } else {

                console.log('we do not have a valide response')
                console.log(response);
            }
        })
    }
    static modal(translator) {
        return '<div class="modal fade" id="commandModal" tabindex="-1" >' +
            '  <div class="modal-dialog modal-lg modal-dialog-centered">' +
            '    <div class="modal-content">' +
            '      <div class="modal-header">' +
            '        <h5 class="modal-title" id="productModalLabel">New message</h5>' +
            '        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
            '      </div>' +
            '      <div class="modal-body">' +
            '      <div id="state" class="alert"></div>' +
            '      <div id="header-table"></div>' +
            '      <div id="delivery" class="alert alert-light"></div>' +
            '      <div id="items"></div>' +
            '      <button id="invoice-button" class="btn btn-outline-danger" data-bs-target="#invoiceModal" ' +
            '      data-bs-toggle="modal" data-bs-dismiss="modal">' + translator.translate('view', "title") + ' ' +
            translator.translate('invoice', "title") + ': <i class="bi bi-receipt"></i></button>' +
            '      </div>' +
            '      <div class="modal-footer">' +
            '        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</div>'
    }
    static headerTable(command, translator) {
        return '<table class="table">' +
            '  <thead>' +
            '    <tr>' +
            '      <th class="text-center" scope="col">' + translator.translate('date', "title") + '</th>' +
            '      <th class="text-center" scope="col">' + translator.translate('livraison', "title") + '</th>' +
            '      <th class="text-center" scope="col">' + translator.translate('pretax', "upper") + '</th>' +
            '      <th class="text-center" scope="col">' + translator.translate('tax', "upper") + '</th>' +
            '      <th class="text-center" scope="col">' + translator.translate('total', "upper") + '</th>' +
            '    </tr>' +
            '  </thead>' +
            '  <tbody>' +
            '    <tr>' +
            '      <th scope="row" class="text-center">' + command.commandDate.toLocaleDateString(translator.locale) + '</th>' +
            '      <td class="text-center">' + command.deliveryDate.toLocaleDateString(translator.locale) + '</td>' +
            '      <td class="text-center">' + command.preTax.toFixed(2) + ' €</td>' +
            '      <td class="text-center">' + command.tax.toFixed(2) + ' €</td>' +
            '      <td class="text-center">' + command.price.toFixed(2) + ' €</td>' +
            '    </tr>' +
            '  </tbody>' +
            '</table>'
    }
    static delivery(delivery, customer, translator) {
        return translator.translate('livraison', "title") + ': ' + delivery.address+ ', ' + delivery.postalCode + ', ' + delivery.town + '-'
            + delivery.region + '-' + delivery.state + ', ' + translator.translate('to', "title") + ': ' + customer.name + ' ' + customer.surname
    }
    static itemsTable(lines,translator) {

        const headers = [
            {type: 'text', value: translator.translate('buy', "title"), dataKey:'name'},
            {type:'currency', value: translator.translate('unit', "title"), dataKey: 'unitPrice'},
            {type:'number', value: translator.translate('qty', "title"), dataKey: 'qty'},
            {type: 'currency', value: translator.translate('pretax', "upper"), dataKey: 'preTax'},
            {type: 'currency', value: translator.translate('tax', "upper"), dataKey: 'tax'},
            {type: 'currency', value: translator.translate('total', "title"), dataKey: 'price'}
        ];
        const rows = lines.map(line => {
            return {
                name: line.product.name,
                unitPrice: line.unitPrice,
                qty: line.qty,
                preTax: line.preTax(),
                tax: line.tax(),
                price: line.price()
            }
        })
        return Component.createTable(headers, rows);
    }
}
function removeColors(el) {
    el.classList.remove('alert-warning', 'alert-success', 'alert-info');
}
