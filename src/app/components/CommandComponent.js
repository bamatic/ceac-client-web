import {Component} from "./helpers/Component.js";
import {CommandModal} from "./modals/CommandModal.js";
import {InvoiceModal} from "./modals/InvoiceModal.js";

export async function CommandComponent(service, translator, commandId) {
    Component.setTitle('top-nav-commands', translator.translate('commands','title'), '<i class="bi bi-truck">');
    Component.closeALlModals();

    const response = await service.all();

    if ( response && response.status && response.status === 200) {

        const commands = response.data;

        const col = Component.getContentColumn();

        const tableRows = commands.map(command=> {
            return {
                id: command.id,
                name: command.name,
                stateES: command.stateTrans(translator),
                commandDate: command.commandDate,
                deliveryDate: command.deliveryDate,
                price: command.price
            }
        })
        const tableHeaders = [
            {type: 'text', value: translator.translate('command','title'), dataKey: 'name'},
            {type: 'text', value: translator.translate('state','title'), dataKey: 'stateES'},
            {type: 'date', value: translator.translate('date','title'), dataKey: 'commandDate'},
            {type: 'date', value: translator.translate('livraison','title'), dataKey: 'deliveryDate'},
            {type: 'currency', value: translator.translate('price','title'), dataKey: 'price'},
            {type: 'buttons', value:translator.translate('view','title'), dataKey: 'id'}

        ]
        const table = Component.createTable(tableHeaders, tableRows);

        col.appendChild(table);

        addActionButtons(tableRows);

        const modalDiv = document.getElementById('modal-1');
        modalDiv.innerHTML = CommandModal.modal(translator);
        CommandModal.addSCButtonListener(service, translator);
        const modalDiv2 = document.getElementById('modal-2');
        modalDiv2.innerHTML = InvoiceModal.modal(translator);
        InvoiceModal.addSCButtonListener(service, translator);

        Component.setUser(service)
            .catch(error=>console.log(error));

        Component.setShoppingCard(service)
            .catch(error=>console.log(error));

        if (commandId && commandId>0) {
            const commandBtn = document.getElementById('command-id-' + commandId);
            commandBtn.click();
        }

    }
}
function addActionButtons(tableRows) {
    for (const row of tableRows) {
        const btnTd = document.getElementById('button-id-' + row.id);
        const viewBtn = document.createElement('button');
        viewBtn.setAttribute('id', 'command-id-' + row.id);
        viewBtn.setAttribute('type', 'button');
        viewBtn.setAttribute('data-bs-toggle', 'modal');
        viewBtn.setAttribute('data-bs-target', '#commandModal');
        viewBtn.setAttribute('data-bs-command-id', row.id);
        viewBtn.innerHTML = '<i class="bi bi-eye"></i>';
        viewBtn.classList.add('eye-btn','btn', 'btn-outline-success', 'btn-sm');
        btnTd.appendChild(viewBtn);
    }
}
