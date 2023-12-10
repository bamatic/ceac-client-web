import {Component} from "./helpers/Component.js";
import {ProductModal} from "./modals/ProductModal.js";
import {ProductPaginator} from "./ProductPaginator.js";

export async function ProductComponent(service, translator) {
    Component.setTitle('top-nav-products', translator.translate('Products', "title"), '');

    const response = await service.all();
    if ( response && response.status && response.status === 200) {
        const paginator = new ProductPaginator(response.data, translator );
        const activePage = paginator.getActivePage();
        const row = Component.getContentRow();
        row.classList.add('g-4');
        for (const product of paginator.getChunk(activePage)) {
            const col = document.createElement('div');
            col.classList.add('col-sm-6','col-md-4', 'col-lg-3');
            const productCard = ProductCardComponent(product, translator);
            col.appendChild(productCard);
            row.appendChild(col);
        }
        Component.addPagination(row, paginator.nav(activePage));
        paginator.addNavigationListeners();
        const modalDiv = document.getElementById('modal-1');
        modalDiv.innerHTML = ProductModal.modal(translator);
        ProductModal.addSCButtonListener(service, translator);

        Component.setUser(service)
            .catch(error=>console.log(error));

        Component.setShoppingCard(service)
            .catch(error=>console.log(error));
    }
    else {
        console.log('bad response');
    }
}
export function ProductCardComponent(product, translator) {
    const div = document.createElement('div');
    div.classList.add('product-item', 'text-center', 'border', 'h-100', 'p-4');
    const img = document.createElement('img');
    img.classList.add('img-fluid', 'mb-4');
    if (product.imageUrl) {
        img.setAttribute('src', '/images/' + product.imageUrl);
    }
    img.setAttribute('alt', product.name);
    div.appendChild(img);
    const starDiv = document.createElement('div');
    starDiv.classList.add('mb-4');
    div.appendChild(starDiv);
    const productLink = document.createElement('a');
    productLink.classList.add('text-success');
    productLink.appendChild(document.createTextNode(product.name));
    div.appendChild(productLink);
    const price = document.createElement('h5');
    price.classList.add('text-success', 'mb-3');
    price.appendChild(document.createTextNode(product.unitPrice.toFixed(2) + '€' ));
    div.appendChild(price);

    if (product.isInShoppingCard) {
        const goToShoppingCard = document.createElement('a');
        goToShoppingCard.classList.add('btn','btn-primary');
        goToShoppingCard.innerText = translator.translate(translator.translate('product-in-sc','title'));
        goToShoppingCard.setAttribute('type', 'button');
        goToShoppingCard.setAttribute('href', '#/shopping-card');
        div.appendChild(goToShoppingCard);
    }
    else {
        const addToCartLink = document.createElement('button');
        addToCartLink.classList.add('btn', 'btn-outline-success', 'px-3');
        addToCartLink.setAttribute('type', 'button');
        addToCartLink.setAttribute('data-bs-toggle', 'modal');
        addToCartLink.setAttribute('data-bs-target', '#productModal');
        addToCartLink.setAttribute('data-bs-product-id', product.id);
        addToCartLink.setAttribute('id', 'sp-btn-' + product.id);
        addToCartLink.appendChild(document.createTextNode(translator.translate("buy", "title")));
        div.appendChild(addToCartLink);
    }
    return  div;

}


