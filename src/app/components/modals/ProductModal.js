import {ProductComponent} from "../ProductComponent.js";
import {Component} from "../helpers/Component.js";

export class ProductModal {
    static modal(translator) {
        return '<div class="modal fade" id="productModal" tabindex="-1" >' +
            '  <div class="modal-dialog  modal-dialog-centered modal-lg">' +
            '    <div class="modal-content">' +
            '      <div class="modal-header">' +
            '        <h5 class="modal-title" id="productModalLabel">New message</h5>' +
            '        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
            '      </div>' +
            '      <div class="modal-body">' +
            '          <div class="mb-3" id="product-view">' +
            '                  <img class="img-fluid mb-4 ml-4" id="product-photo" src="/images/product.png" alt="product">' +
            '                  <p id="product-description"></p>' +
            '          </div>' +
            '          <div class="mb-3" id="product-resume"></div>' +
            '        <form>' +
            '          <div class="mb-3">' +
            '            <label for="recipient-name" class="col-form-label">' + translator.translate('qty', "title") + ':</label>' +
            '            <input type="number" class="form-control" id="qty" name="qty" min="1" value="1">' +
            '          </div>' +
            '        </form>' +
            '      </div>' +
            '      <div class="modal-footer">' +
            '        <button type="button" class="btn btn-secondary" id="close-buy-modal" data-bs-dismiss="modal">Close</button>' +
            '        <button type="button" class="btn btn-success" id="buy">' + translator.translate('buy', "title") + '</button>' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</div>'
    }
    static addSCButtonListener(service, translator) {
        const exampleModal = document.getElementById('productModal')
        exampleModal.addEventListener('show.bs.modal', async function (event) {
            const button = event.relatedTarget
            const productId = button.getAttribute('data-bs-product-id');
            const response = await service.get(productId);
            if (response && response.status && response.status === 200) {
                const product = response.data;
                const modalTitle = exampleModal.querySelector('.modal-title')
                modalTitle.textContent = product.name;
                const productResume = document.getElementById('product-resume');
                productResume.innerHTML = ProductModal.headerTable(product, translator);
                const qtyInput = document.getElementById('qty');
                qtyInput.value = 1;
                document.getElementById('buy').style.display = 'block';
                qtyInput.addEventListener('change', (event) =>
                    ProductModal.updateHeaderTable(product, event));
                if (product.imageUrl) {
                    document.getElementById('product-photo')
                        .setAttribute('src', '/images/' + product.imageUrl);
                }
                else {
                    document.getElementById('product-photo')
                        .setAttribute('src', '/images/product.png');
                }
                if (product.description) {
                    document.getElementById('product-photo').textContent = product.description;
                }
                const buyBtn = document.getElementById('buy');
                buyBtn.addEventListener('click', () =>
                    ProductModal.addToShoppingCard(service, translator, productId))
            }
        })
    }
    static headerTable(product, translator) {
        return '<table class="table">' +
            '  <thead>' +
            '    <tr>' +
            '      <th class="text-center" scope="col">' + translator.translate('products', "title") + '</th>' +
            '      <th class="text-center" scope="col">' + translator.translate('unit', "title") + '</th>' +
            '      <th class="text-center" scope="col">' + translator.translate('pretax', "upper") + '</th>' +
            '      <th class="text-center" scope="col">' + translator.translate('tax', "upper") + '</th>' +
            '      <th class="text-center" scope="col">' + translator.translate('total', "upper") + '</th>' +
            '    </tr>' +
            '  </thead>' +
            '  <tbody>' +
            '    <tr>' +
            '      <th scope="row" class="text-center">' + product.availableDate.toLocaleDateString('es-ES') + '</th>' +
            '      <td class="text-center">' + product.unitPrice.toFixed(2)  + ' €' + '</td>' +
            '      <td id="pre-tax" class="text-center">' + product.preTax().toFixed(2) + ' €</td>' +
            '      <td id="tax" class="text-center">' + product.tax().toFixed(2) + ' €</td>' +
            '      <td id="price" class="text-center">' + product.price().toFixed(2) + ' €</td>' +
            '    </tr>' +
            '  </tbody>' +
            '</table>'
    }
    static updateHeaderTable(product, event) {
        const qty = event.target.value;
        const preTax = qty * product.unitPrice;
        const tax = preTax * product.taxPercent / 100;
        const price = preTax + tax;
        document.getElementById('pre-tax').textContent = preTax.toFixed(2) + ' €';
        document.getElementById('tax').textContent = tax.toFixed(2) + ' €';
        document.getElementById('price').textContent = price.toFixed(2) + ' €';
    }
    static async addToShoppingCard(service, translator, productId) {
        document.getElementById('buy').style.display = 'none';
        const data = {
            product_id: parseInt(productId),
            qty: parseInt(document.getElementById('qty').value)
        };
        const response = await service.addToShoppingCard(data);
        if (response && response.status && response.status === 200) {
            ProductComponent(service, translator)
                .catch(error => console.log(error));
            Component.closeALlModals();
        }
    }

}
