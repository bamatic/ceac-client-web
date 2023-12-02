import {VENDOR_NAME, VENDOR_ADDRESS} from '../../../config.js';
export class InvoiceModal {
    static addSCButtonListener(service, translator) {
        const exampleModal = document.getElementById('invoiceModal')
        exampleModal.addEventListener('show.bs.modal', async function (event) {
            const button = event.relatedTarget
            const invoiceId = button.getAttribute('data-bs-invoice-id')
            const response = await service.get(invoiceId);
            if (response && response.status && response.status === 200) {
                console.log('we have a valide response')
                const command = response.data;
                const modalTitle = exampleModal.querySelector('.modal-title')
                modalTitle.textContent = translator.translate("invoice", "title") +' : ' + command.id;
                document.getElementById('enterprise-name').innerText = VENDOR_NAME;
                document.getElementById('enterprise-address').innerText = VENDOR_ADDRESS;
                document.getElementById('invoice-ID').innerHTML = command.id;
                document.getElementById('invoice-ID-2').innerHTML = command.id;
                document.getElementById('invoice-date').innerHTML = command.commandDate.toLocaleDateString('es-ES');
                document.getElementById('command-name').innerHTML = command.name;
                document.getElementById('customer-name').innerHTML = command.customer.name + ' ' +
                    command.customer.surname;
                document.getElementById('customer-address').innerHTML = command.invoiceAddress.address +
                    ' ' + command.invoiceAddress.postalCode;
                document.getElementById('customer-location').innerHTML = command.invoiceAddress.town +
                    '-' + command.invoiceAddress.region + '-' + command.invoiceAddress.state;
                document.getElementById('customer-tax-id').innerHTML = command.customer.taxId;
                document.getElementById('final-price').innerHTML = command.price.toFixed(2) + ' €';
                document.getElementById('command-link').setAttribute('href', '#/commands/' + command.id);
                const tbody = document.getElementById('invoice-body');
                tbody.innerHTML = '';
                for (const line of command.lines) {
                    const tr = document.createElement('tr');
                    tbody.appendChild(tr);
                    const td1 = document.createElement('td');
                    td1.appendChild(document.createTextNode(line.product.name));
                    tr.appendChild(td1);
                    const td2 = document.createElement('td');
                    td2.appendChild(document.createTextNode(line.qty));
                    tr.appendChild(td2);
                    const td3 = document.createElement('td');
                    td3.appendChild(document.createTextNode(line.unitPrice.toFixed(2) + ' € '));
                    td3.classList.add('text-end');
                    tr.appendChild(td3);
                    const td4 = document.createElement('td');
                    td4.appendChild(document.createTextNode(line.preTax().toFixed(2) + ' € '));
                    td4.classList.add('text-end');
                    tr.appendChild(td4);
                    const td5 = document.createElement('td');
                    td5.appendChild(document.createTextNode(line.tax().toFixed(2) + ' € '));
                    td5.classList.add('text-end');
                    tr.appendChild(td5);
                    const td6 = document.createElement('td');
                    td6.appendChild(document.createTextNode(line.price().toFixed(2) + ' € '));
                    td6.classList.add('text-end');
                    tr.appendChild(td6);
                }
                const tr = document.createElement('tr');
                tbody.appendChild(tr);
                const td3 = document.createElement('td');
                td3.appendChild(document.createTextNode(translator.translate("total", "upper")));
                td3.classList.add('text-end');
                td3.setAttribute('colspan','3');
                tr.appendChild(td3);
                const td4 = document.createElement('td');
                td4.appendChild(document.createTextNode(command.preTax.toFixed(2) + ' € '));
                td4.classList.add('text-end');
                tr.appendChild(td4);
                const td5 = document.createElement('td');
                td5.appendChild(document.createTextNode(command.tax.toFixed(2) + ' € '));
                td5.classList.add('text-end');
                tr.appendChild(td5);
                const td6 = document.createElement('td');
                td6.appendChild(document.createTextNode(command.price.toFixed(2) + ' € '));
                td6.classList.add('text-end');
                tr.appendChild(td6);
                document.getElementById('print-button')
                    .addEventListener('click', ()=> window.print());


            } else {

                console.log('we do not have a valide response')
                console.log(response);
            }
        })
    }
    static modal(translator) {
        return '<div class="modal fade" id="invoiceModal" tabindex="-1" >' +
            '  <div class="modal-dialog modal-lg modal-dialog-centered printable-size">' +
            '    <div class="modal-content">' +
            '      <div class="modal-header no-print">' +
            '        <h5 class="modal-title" id="productModalLabel">New message</h5>' +
            '        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
            '      </div>' +
            '      <div class="modal-body">' +
            InvoiceModal.invoiceTemplate(translator) +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</div>'
    }
    static invoiceTemplate(translator) {
        return  '<div class="card">' +
            '  <div class="card-body">' +
            '    <div class="container mb-5 mt-3">' +
            '      <div class="row d-flex align-items-baseline  no-print">' +
            '        <div class="col-xl-9 no-print">' +
            '          <p style="color: #7e8d9f;font-size: 20px;">' + translator.translate("invoice", "title") +
            ' >> <strong>N: <span id="invoice-ID"></span></strong></p>' +
            '        </div>' +
            '        <div class="col-xl-3 float-end no-print">' +
            '          <a class="btn btn-light text-capitalize border-0" id="print-button" data-mdb-ripple-color="dark"><i' +
            '              class="fas fa-print text-primary" ></i> Print</a>' +
            '        </div>' +
            '        <hr>' +
            '      </div>' +
            '' +
            '      <div class="container printable">' +
            '        <div class="col-md-12">' +
            '          <div class="text-center">' +
            '            <i class="fab fa-mdb fa-4x ms-0" style="color:#5d9fc5 ;"></i>' +
            '            <p class="pt-0" id="enterprise-name"></p>' +
            '            <p class="pt-0" id="enterprise-address"></p>' +
            '          </div>' +
            '        </div>' +
            '       <div class="row  printable">' +
            '          <div class="col-xl-8">' +
            '            <ul class="list-unstyled">' +
            '              <li class="text-muted">' + translator.translate("to", "upper") + ': <span style="color:#5d9fc5 ;" id="customer-name">John Lorem</span></li>' +
            '              <li class="text-muted" id="customer-address">Street, City</li>' +
            '              <li class="text-muted" id="customer-location">State, Country</li>' +
            '              <li class="text-muted" id="customer-tax-id">NIF</li>' +
            '            </ul>' +
            '          </div>' +
            '          <div class="col-xl-4">' +
            '            <ul class="list-unstyled">' +
            '              <li class="text-muted"><i class="fas fa-circle" style="color:#84B0CA ;"></i> <span' +
            '                  class="fw-bold">N: </span><span id="invoice-ID-2"></span></li>' +
            '              <li class="text-muted"><i class="fas fa-circle" style="color:#84B0CA ;"></i> <span' +
            '                  class="fw-bold">' + translator.translate("date", "title") + ': </span><span id="invoice-date"></span></li>' +
            '              <li class="text-muted"><i class="fas fa-circle" style="color:#84B0CA ;"></i> <span' +
            '                  class="me-1 fw-bold">' + translator.translate("command", "title") + ':</span><a id="command-link"><span id="command-name" class="badge bg-warning text-black fw-bold">' +
            '                  Unpaid</span></a></li>' +
            '            </ul>' +
            '          </div>' +
            '        </div>' +
            '        <div class="row my-2 mx-1 justify-content-center  printable">' +
            '          <table class="table table-striped table-borderless">' +
            '            <thead style="background-color:#84B0CA ;" class="text-white">' +
            '              <tr>' +
            '                <th scope="col">' + translator.translate("product", "title") + '</th>' +
            '                <th scope="col">' + translator.translate("qty", "title") + '</th>' +
            '                <th scope="col">' + translator.translate("unit", "title") + '</th>' +
            '                <th scope="col">' + translator.translate("pretax", "upper") + '</th>' +
            '                <th scope="col">' + translator.translate("tax", "upper") + '</th>' +
            '                <th scope="col">' + translator.translate("price", "upper") + '</th>' +
            '              </tr>' +
            '            </thead>' +
            '            <tbody id="invoice-body">' +
            '              ' +
            '            </tbody>' +
            '          </table>' +
            '        </div>' +
            '        <div class="row  printable">' +
            '          <div class="col-xl-2">' +
            '            <p class="ms-3"></p>' +
            '          </div>' +
            '          <div class="col-xl-9">' +
            '            <p class="text-black float-end"><span class="text-black me-3"> ' + translator.translate("total", "upper") + '</span><span' +
            '                style="font-size: 25px;" id="final-price">$1221</span></p>' +
            '          </div>' +
            '        </div>' +
            '        <hr>' +
            '        <div class="row  printable">' +
            '          <div class="col-xl-10">' +
            '            <p>' + translator.translate("thanks-buy", "upper") + '</p>' +
            '          </div>' +
            '        </div>' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</div>';
    }
}
