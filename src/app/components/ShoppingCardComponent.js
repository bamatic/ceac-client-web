import {Component} from "./helpers/Component.js";

export async function ShoppingCardComponent(service, translator) {

    Component.setTitle('top-nav-shopping-card', translator.translate("shopping card", "title") , '<i class="bi bi-cart4"></i>');

    const response = await service.all();

    if (response && response.status && response.status === 200) {

        const items = response.data;

        const col = Component.getContentColumn();

        if (items.length > 0) {

            const headButtons =  headerButtons(service, translator);
            col.appendChild(headButtons);

            const headTable = headerTable(items, translator);
            col.appendChild(headTable);

            const addresses = customerAddress(items[0], translator);
            col.appendChild(addresses);

            const tableRows = items.map(item => {
                return {
                    id: item.id,
                    product_name: item.product.name,
                    product_unitPrice: item.product.unitPrice,
                    qty: item.qty,
                    preTax: item.preTax,
                    tax: item.tax,
                    price: item.price
                }
            });
            const tableHeaders = [
                {type: 'text', value: translator.translate("product", "title"), dataKey: 'product_name'},
                {type: 'currency', value: translator.translate("unit", "title"), dataKey: 'product_unitPrice'},
                {type: 'number', value: translator.translate("qty", "title"), dataKey: 'qty'},
                {type: 'currency', value: translator.translate("pretax", "upper"), dataKey: 'preTax'},
                {type: 'currency', value: translator.translate("tax", "upper"), dataKey: 'tax'},
                {type: 'currency', value: translator.translate("price", "title"), dataKey: 'price'},
                {type: 'buttons', value: translator.translate("action", "title"), dataKey: 'id'}
            ];

            const table = Component.createTable(tableHeaders, tableRows);

            col.appendChild(table);

            addActionButtons(tableRows);
            addEditButtonListener(service, translator);
            addDeleteButtonListener(service, translator);
        }
        else {
            const h4 = document.createElement('h4');
            h4.innerHTML = translator.translate("empty-card", "title");
            col.appendChild(h4);
            col.classList.add('text-center');
            const btn = document.createElement('a');
            btn.classList.add('btn', 'btn-success');
            btn.setAttribute('href', '#/products');
            btn.innerHTML = translator.translate("add-products", "title");
            col.appendChild(btn);
        }
    }
    Component.setUser(service)
        .catch(error=>console.log(error));

    Component.setShoppingCard(service)
        .catch(error=>console.log(error));
}
function addActionButtons(tableRows) {
    for (const row of tableRows) {
        const btnTd = document.getElementById('button-id-' + row.id);
        const editBtn = document.createElement('button');
        editBtn.setAttribute('id', 'edit-item-id-' + row.id);
        editBtn.setAttribute('type', 'button');
        editBtn.innerHTML = '<i class="bi bi-pencil-square" data-bs-item-id="' + row.id + '"></i>';
        editBtn.classList.add('edit-btn','btn', 'btn-outline-info', 'btn-sm');
        editBtn.setAttribute('data-bs-item-id', row.id)
        btnTd.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('id', 'delete-item-id-' + row.id);
        deleteBtn.setAttribute('type', 'button');
        deleteBtn.innerHTML = '<i class="bi bi-x" data-bs-item-id="' + row.id + '"></i>';
        deleteBtn.classList.add('delete-btn','btn', 'btn-outline-danger', 'btn-sm', 'ms-3');
        deleteBtn.setAttribute('data-bs-item-id', row.id)
        btnTd.appendChild(deleteBtn);
    }
}
function addEditButtonListener(service, translator) {
    const editButtons = document.getElementsByClassName('edit-btn');
    for (const editButton of editButtons) {
        editButton.addEventListener('click', (event) => {
            const btn = event.target;
            const id = btn.getAttribute('data-bs-item-id');
            const qtyTd = document.getElementById('row-qty-' + id);
            const inlineForm = document.getElementById('inline-form-' + id);
            if (inlineForm) {
                hideInlineEditForm(id, qtyTd,inlineForm.getAttribute('data-qty'));
            }
            else {
                showInlineEditForm(id, qtyTd, service, translator);
            }

        });
    }
}
function showInlineEditForm(id, qtyTd, service, translator) {
    qtyTd.innerHTML = '<form id="inline-form-' + id + '" data-qty="' + qtyTd.innerText + '"' + '">'  +
        '    <input type="number" class="form-control" value="' + qtyTd.innerText +
        '"    style="width: 80%; display: inline" id="qty-input-' + id + '" min="1">' +
        '    <button type="button" class="btn btn-primary btn-sm-square" id="edit-ok-' + id +
        '" data-id="' + id + '" style="display: inline-block">OK</button>' +
        '  </form>';
    const editOKButton = document.getElementById('edit-ok-' + id);
    editOKButton.addEventListener('click', async function (event) {
        const okBtn = event.target;
        const id = okBtn.getAttribute('data-id');
        const qtyInput = document.getElementById('qty-input-' + id);
        const updatedShoppingCard = await service.update(parseInt(id), parseInt(qtyInput.value));
        if (updatedShoppingCard != null) {
            ShoppingCardComponent(service, translator)
                .catch(error => console.log(error));
        } else {
            alert('try again later');
        }
    })
}
function hideInlineEditForm(id, qtyTd, qty) {
    qtyTd.innerText = qty;
}
function addDeleteButtonListener(service, translator) {
    const deleteButtons = document.getElementsByClassName('delete-btn');
    for (const deleteButton of deleteButtons) {
        deleteButton.addEventListener('click', async function (event) {
            const btn = event.target;
            const id = btn.getAttribute('data-bs-item-id');
            const response = await service.delete(id);
            if (response != null) {
                ShoppingCardComponent(service, translator)
                    .catch(error => console.log(error));
            } else {
                alert('try again later');
            }
        });
    }
}
function headerTable(items, translator) {
    const commandDate = new Date();
    const numberAvailableDate = Math.max(...items.map(item=>item.product.availableDate.getTime()));
    const availableDate = new Date(numberAvailableDate);
    const preTax = items.map(item=>item.preTax).reduce((prev, current)=>prev + current,0);
    const tax = items.map(item=>item.tax).reduce((prev, current)=>prev + current,0);
    const price = items.map(item=>item.price).reduce((prev, current)=>prev + current,0);

    const row = document.createElement('div');
    row.classList.add('row', 'mb-4');
    const col = document.createElement('div');
    col.classList.add('col-sm-12');
    col.innerHTML = '<div class="row"><div class="col-sm-12">' +
        '<table class="table">' +
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
        '      <th scope="row" class="text-center" id="current-date">' + commandDate.toLocaleDateString('es-ES') + '</th>' +
        '      <td class="text-center" id="available-date">' + availableDate.toLocaleDateString('es-ES') + '</td>' +
        '      <td class="text-center" id="pre-tax">' + preTax.toFixed(2) + ' €</td>' +
        '      <td class="text-center" id="tax">' + tax.toFixed(2) + ' €</td>' +
        '      <td class="text-center" id="price">' + price.toFixed(2) + ' €</td>' +
        '    </tr>' +
        '  </tbody>' +
        '</table></div></div>'
    row.appendChild(col);
    return row;
}
function headerButtons(service, translator) {
    const row = document.createElement('div');
    row.classList.add('row', 'mb-4');
    const col = document.createElement('div');
    col.classList.add('col-sm-12');
    const commandNameInput = document.createElement('input');
    commandNameInput.classList.add('form-control', 'mb-4');
    commandNameInput.setAttribute('placeholder', translator.translate('command-ref','title'));
    commandNameInput.setAttribute('type', 'text');
    commandNameInput.setAttribute('id', 'command-name');
    commandNameInput.setAttribute('max', '80');
    col.appendChild(commandNameInput);

    const addProducts = document.createElement('a');
    addProducts.classList.add('btn', 'btn-primary', 'mb-4', 'me-4');
    addProducts.setAttribute('href',  "#/products")
    addProducts.innerHTML = translator.translate('add-products','title');
    col.appendChild(addProducts);

    const commandBtn = document.createElement('button');
    commandBtn.classList.add('btn', 'btn-success', 'mb-4');
    commandBtn.setAttribute('id', 'command-btn')
    commandBtn.innerText = translator.translate('do-command','title');
    commandBtn.addEventListener('click', ()=>doCommand(service, translator));

    col.appendChild(commandBtn);
    return col;
}
function customerAddress(item, translator) {
    const row = document.createElement('div');
    row.classList.add('row', 'mb-4');
    const leftCol = document.createElement('div');
    leftCol.classList.add('col-sm-6');
    leftCol.innerHTML = addressCard(translator.translate('livraison address', 'title'), 'success', item.deliveryAddress, item.name, translator);
    row.appendChild(leftCol);
    const rightCol = document.createElement('div');
    rightCol.classList.add('col-sm-6');
    rightCol.innerHTML = addressCard(translator.translate('billing address', 'title'), 'primary', item.invoiceAddress, item.name, translator)
    row.appendChild(rightCol);
    return row;
}
function addressCard(title, color, address, name, translator) {
    return '<div class="card border-' + color + ' mb-3">' +
        '  <div class="card-header"><a href="#/user">' + translator.translate('edit','title') + '</a></div>' +
        '  <div class="card-body text-' + color + '">' +
        '    <h5 class="card-title">' + title + '</h5>' +
        '    <p class="card-text"> ' + textAddress(address, name) + '</p>' +
        '  </div>' +
        '</div>'
}
function textAddress(delivery, name) {
    return '<p><i class="bi bi-person"></i> ' + name + '</p>' +
        '<p><i class="bi bi-house"></i> ' + delivery.address+ ', ' + delivery.postalCode + ', ' + delivery.town + '-'
        + delivery.region + '-' + delivery.state + '</p>'
}
async function doCommand(service, translator){
    const commandName = document.getElementById('command-name');
    if (!commandName || commandName.value === '') {
        alert(translator.translate('command-ref-error', 'title'));
        return;
    }
    const response = await service.doCommand(commandName.value);
    if (response && response.status && response.status === 200) {
        window.location.href = '#/commands/' + response.data;
    }
    else {
        alert('try again later');
    }

}
