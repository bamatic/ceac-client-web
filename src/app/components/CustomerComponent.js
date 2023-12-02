import {Component} from "./helpers/Component.js";
import {User} from "../entities/User.js";
import {LOGIN_URL} from "../../config.js";

export async function CustomerComponent(service, translator) {
    Component.setTitle('top-nav-user', translator.translate("your user data", "title"), '<i class="bi bi-person-circle"></i>');
    const response = await service.getUser();
    if (response && response.status && response.status === 200) {
        const user = response.data;
        console.log('user', user);
        const col = Component.getContentColumn();
        col.innerHTML = userCard(user, translator);
        const logoutBtn = document.getElementById('logout');
        logoutBtn.addEventListener('click', logout);


        const editUser = document.getElementById('edit-user');
        editUser.addEventListener('click',() => editCustomer('user-data'));
        const cancelEditUser = document.getElementById('cancel-edit');
        cancelEditUser.addEventListener('click', () =>cancelEditCustomer('user-data'));
        const sentEditUser = document.getElementById('send-edit');
        sentEditUser.addEventListener('click', ()=>sendEditCustomer(user, service, translator));

        const editDelivery = document.getElementById('edit-delivery');
        editDelivery.addEventListener('click',() => editCustomer('delivery'));
        const cancelDelivery = document.getElementById('cancel-delivery');
        cancelDelivery.addEventListener('click', () =>cancelEditCustomer('delivery'));
        const sendDelivery = document.getElementById('send-delivery');
        sendDelivery.addEventListener('click', ()=>sendAddress(service, translator, 'delivery'));

        const editInvoice = document.getElementById('edit-invoice');
        editInvoice.addEventListener('click',() => editCustomer('invoice'));
        const cancelInvoice = document.getElementById('cancel-invoice');
        cancelInvoice.addEventListener('click', () =>cancelEditCustomer('invoice'));
        const sendInvoice = document.getElementById('send-invoice');
        sendInvoice.addEventListener('click', ()=>sendAddress(service, translator, 'invoice'));
    }


}
async function sendAddress(service, translator, type) {
    const deliveryAddressInput = document.getElementById(type + '-address');
    const deliveryPostalCodeInput = document.getElementById(type + '-postal-code');
    const deliveryTownInput = document.getElementById(type + '-town');
    const deliveryRegionInput = document.getElementById(type + '-region');
    const deliveryStateInput = document.getElementById(type + '-state');
    if ( !deliveryAddressInput || !deliveryPostalCodeInput || !deliveryTownInput || !deliveryRegionInput ||
        !deliveryStateInput) {
        CustomerComponent(service)
            .catch(error => console.log(error));
        return null;
    }
    const address = deliveryAddressInput.value;
    const postalCode = deliveryPostalCodeInput.value;
    const town = deliveryTownInput.value;
    const region = deliveryRegionInput.value;
    const state = deliveryStateInput.value;
    if (!address || !postalCode || !town || !region || !state) {
        CustomerComponent(service)
            .catch(error => console.log(error));
        return null;
    }
    if (address.length <3 || address.length > 255) {
        alert(translator.translate('address-validation','lower'));
        return;
    }
    if (postalCode.length !== 5) {
        alert(translator.translate('postal-code-validation','lower'));
        return;
    }
    if (town.length <3 || town.length > 80) {
        translator.translate('town-validation','lower');
        return;
    }
    if (region.length <3 || region.length > 25) {
        translator.translate('region-validation','lower');
        return;
    }
    if (state.length <3 || state.length > 25) {
        translator.translate('state-validation','lower');
        return;
    }
    const response = await service.createAddress({
        id:0,
        address: address,
        postal_code: postalCode,
        town: town,
        region: region,
        state: state
    }, type);
    if (response && response.status && response.status === 200) {
        CustomerComponent(service)
            .catch(error => console.log(error));
    }
    if (response && response.status) {
        return {
            status: response.status,
            data: response
        }
    }
    return null;

}
async function sendEditCustomer(user, service, translator) {

    const passwordInput = document.getElementById('user-password');
    const emailInput = document.getElementById('user-email');
    if (passwordInput && emailInput) {
        const email = emailInput.value;
        if (email === '') {
            alert(translator.translate('no-email','lower'));
            return;
        }
        const password = passwordInput.value;
        if (password === '') {
            if (user.email !== email) {
                user.email = email;
                user.password = null;
            }
            else {
                alert(translator.translate('no-form','lower'));
                return;
            }
        }
        else {
            if ( !User.validePassword(password)) {
                alert(translator.translate('no-password','lower'));
                return;
            }
            else {
                user.password = password;
            }
        }
        const response = await service.update(user);
        if (response && response.status && response.status === 200) {
            CustomerComponent(service)
                .catch(error => console.log(error));
        }
        if (response && response.status) {
            return {
                status: response.status,
                data: response
            }
        }
        return null;
    }
    else {
        CustomerComponent(service)
            .catch(error => console.log(error));
    }
}
function editCustomer(section) {
    const editables1 = document.getElementsByClassName("hidden " + section);
    for (const editable of editables1) {
        editable.style.display = 'block';
    }
    const editables2 = document.getElementsByClassName("hidden-row " + section);
    for (const editable of editables2) {
        editable.style.display = 'table-row';
    }
    const noEditables1 = document.getElementsByClassName("shown " + section);
    for (const noEditable of noEditables1) {
        noEditable.style.display = 'none';
    }
    const noEditables2 = document.getElementsByClassName("shown-inline " + section);
    for (const noEditable of noEditables2) {
        noEditable.style.display = 'none';
    }
}
function cancelEditCustomer(section) {
    const editables1 = document.getElementsByClassName("hidden " + section);
    for (const editable of editables1) {
        editable.style.display = 'none';
    }
    const editables2 = document.getElementsByClassName("hidden-row " + section);
    for (const editable of editables2) {
        editable.style.display = 'none';
    }
    const noEditables1 = document.getElementsByClassName("shown " + section);
    for (const noEditable of noEditables1) {
        noEditable.style.display = 'block';
    }
    const noEditables2 = document.getElementsByClassName("shown-inline " + section);
    for (const noEditable of noEditables2) {
        noEditable.style.display = 'inline';
    }
}
function logout() {
    localStorage.clear();
    window.location.href = LOGIN_URL;
}
function userCard(user, translator) {
    return '<div class="card border-success mb-3">' +
        '  <div class="card-header">' +
        '       <button class="btn btn-outline-danger" id="logout">' +
        '           <i class="bi bi-door-closed"></i> Logout' +
        '       </button>' +
        '  </div>' +
        '  <div class="card-body">' +
        '' +
        '' +
        '' +
        '    <h5 class="card-title text-primary">' +
        '        <i class="bi bi-person-circle"></i> ' + user.name + ' ' + user.surname  +
        '        <button class="btn btn-outline-success btn-sm ms-4 shown-inline user-data" id="edit-user">' +
        '           <i class="bi bi-pencil-square"></i> ' + translator.translate('edit', "title") +
        '       </button>' +
        '     </h5>' +
        '   <table class="table table-bordered border-primary">' +
        '   <tbody>' +
        '   <tr><th>' + translator.translate('name', "title") + '</th><td>' + user.name + '</td></tr>       ' +
        '   <tr><th>' + translator.translate('surnames', "title") + '</th><td>' + user.surname + '</td></tr>       ' +
        '   <tr><th>email</th>' +
        '   <td>' + '' +
        '       <div class="shown user-data">' + user.email + '</div>' +
        '       <div class="hidden user-data">' +
        '           <input class="form-control" id="user-email" type="email" value="' + user.email + '">' +
        '           <small id="emailHelp" class="form-text text-muted">' + translator.translate('set-command-ref', "title") + '</small>' +
        '       </div>' +
        '   </td></tr>' +
        '   <tr class="hidden-row user-data"><th>password</th>' +
        '       <td>' +
        '           <input class="form-control" type="password" id="user-password" min="8" max="32">' +
        '           <small id="passwordHelp" class="form-text text-muted">' + translator.translate('keep-empty', "title") +
        ',<br>' + translator.translate('password-validation', "title") + '</small>' +
        '       </td>' +
        '   </tr>       ' +
        '   <tr class="hidden-row user-data"><th></th>' +
        '       <td class="text-end">' +
        '           <button type="button" class="btn btn-primary" id="cancel-edit"><i class="bi bi-x"></i> ' + translator.translate('cancel', "title") + '</button>' +
        '           <button type="button" class="btn btn-success" id="send-edit"><i class="bi bi-send"></i>'  + translator.translate("edit", "title") + '</button>' +
        '       </td>' +
        '   </tr>' +
        '   <tr><th>NIF</th><td>' + user.taxId + '</td></tr>       ' +
        '   </tbody>' +
        '   </table>' +
        '' +
        '' +
        '' +
        '   <h5 class="card-title text-primary">' +
        '        <i class="bi bi-receipt"></i>'  + translator.translate("livraison address", "title") +
        '        <button class="btn btn-outline-success btn-sm ms-4 shown-inline delivery" id="edit-delivery">' +
        '            <i class="bi bi-pencil-square"></i>'  + translator.translate("edit", "title") +
        '        </button>' +
        '   </h5>' +
        '   <table class="table table-bordered border-primary">' +
        '   <tbody>' +
        '   <tr><th>'  + translator.translate("street-and-door", "title") + '</th>' +
        '   <td>' +
        '       <div class="shown delivery">' + user.deliveryAddress.address + '</div>' +
        '       <div class="hidden delivery"><input class="form-control" type="text" min="3" max="255" value="' +
                   user.deliveryAddress.address + '" id="delivery-address">' +
        '        </div>' +
        '   </td></tr>' +
        '   <tr><th>'  + translator.translate("postal-code", "title") + '</th>' +
        '   <td>' +
        '       <div class="shown delivery">' + user.deliveryAddress.postalCode + '</div>' +
        '       <div class="hidden delivery"><input class="form-control" type="text" max="5" value="' +
                      user.deliveryAddress.postalCode + '" id="delivery-postal-code">' +
        '        </div>' +
        '   </td></tr>' +
        '   <tr><th>'  + translator.translate("town", "title") + '</th>' +
        '   <td>' +
        '       <div class="shown delivery">' + user.deliveryAddress.town + '</div>' +
        '       <div class="hidden delivery"><input class="form-control" type="text" max="80" value="' +
                         user.deliveryAddress.town + '" id="delivery-town">' +
        '        </div>' +
            '</td></tr>' +
        '   <tr><th>'  + translator.translate("region", "title") + '</th>' +
        '   <td>' +
        '       <div class="shown delivery">' + user.deliveryAddress.region + '</div>' +
        '       <div class="hidden delivery"><input class="form-control" type="text" max="25" value="' +
                        user.deliveryAddress.region + '" id="delivery-region">' +
        '        </div>' +
        '   </td></tr>       ' +
        '   <tr><th>'  + translator.translate("state", "title") + '</th>' +
        '   <td>' +
        '       <div class="shown delivery">' + user.deliveryAddress.state + '</div>' +
        '       <div class="hidden delivery"><input class="form-control" type="text" max="25" value="' +
                          user.deliveryAddress.state + '" id="delivery-state">' +
        '        </div>' +
        '   </td></tr>' +
        '   <tr class="hidden-row delivery"><th></th>' +
        '       <td class="text-end">' +
        '           <button type="button" class="btn btn-primary" id="cancel-delivery"><i class="bi bi-x"></i> Cancelar</button>' +
        '           <button type="button" class="btn btn-success" id="send-delivery"><i class="bi bi-send"></i> Modificar</button>' +
        '       </td>' +
        '   </tr>' +
        '   </tbody>' +
        '   </table>' +
        '' +
        '' +
        '' +
        '   <h5 class="card-title text-primary">' +
        '        <i class="bi bi-receipt"></i>'  + translator.translate("livraison address", "title") +
        '        <button class="btn btn-outline-success btn-sm ms-4 shown-inline invoice" id="edit-invoice">' +
        '            <i class="bi bi-pencil-square"></i> Modificar' +
        '        </button>' +
        '   </h5>' +
        '   <table class="table table-bordered border-primary">' +
        '   <tbody>' +
        '   <tr><th>'  + translator.translate("street-and-door", "title") + '</th>' +
        '   <td>' +
        '       <div class="shown invoice">' + user.invoiceAddress.address + '</div>' +
        '       <div class="hidden invoice"><input class="form-control" type="text" max="255" value="' +
        user.invoiceAddress.address + '" id="invoice-address">' +
        '        </div>' +
        '   </td></tr>' +
        '   <tr><th>'  + translator.translate("postal-code", "title") + '</th>' +
        '   <td>' +
        '       <div class="shown invoice">' + user.invoiceAddress.postalCode + '</div>' +
        '       <div class="hidden invoice"><input class="form-control" type="text" min="5" max="5" value="' +
        user.invoiceAddress.postalCode + '" id="invoice-postal-code">' +
        '        </div>' +
        '   </td></tr>' +
        '   <tr><th>'  + translator.translate("town", "title") + '</th>' +
        '   <td>' +
        '       <div class="shown invoice">' + user.invoiceAddress.town + '</div>' +
        '       <div class="hidden invoice"><input class="form-control" type="text" max="80" value="' +
        user.invoiceAddress.town + '" id="invoice-town">' +
        '        </div>' +
        '</td></tr>' +
        '   <tr><th>'  + translator.translate("region", "title") + '</th>' +
        '   <td>' +
        '       <div class="shown invoice">' + user.invoiceAddress.region + '</div>' +
        '       <div class="hidden invoice"><input class="form-control" type="text" max="25" value="' +
        user.invoiceAddress.region + '" id="invoice-region">' +
        '        </div>' +
        '   </td></tr>       ' +
        '   <tr><th>'  + translator.translate("state", "title") + '</th>' +
        '   <td>' +
        '       <div class="shown invoice">' + user.invoiceAddress.state + '</div>' +
        '       <div class="hidden invoice"><input class="form-control" type="text" max="25" value="' +
        user.invoiceAddress.state + '" id="invoice-state">' +
        '        </div>' +
        '   </td></tr>' +
        '   <tr class="hidden-row invoice"><th></th>' +
        '       <td class="text-end">' +
        '           <button type="button" class="btn btn-primary" id="cancel-invoice"><i class="bi bi-x"></i> '  + translator.translate("cancel", "title") + '</button>' +
        '           <button type="button" class="btn btn-success" id="send-invoice"><i class="bi bi-send"></i> '  + translator.translate("edit", "title") + '</button>' +
        '       </td>' +
        '   </tr>' +
        '   </tbody>' +
        '   </table>' +
        '  </div>' +
        '</div>'
}
async function getUser(service) {
    const response = await service.getUser();
    if (response && response.status && response.status === 200) {
        const user = response.data;
        const userMenu = document.getElementById('top-nav-user');
        userMenu.innerHTML = '<i class="bi bi-person-circle"></i> ' + user.name + ' ' + user.surname;
        userMenu.setAttribute('user-id', user.id);
        return {
            status: 200,
            data: User.fromJSON(response.data)
        }
    }
    if (response && response.status) {
        return {
            status: response.status,
            data: response
        }
    }
    return null;

}
