import {Paginator} from "./helpers/Paginator.js";
import {Component} from "./helpers/Component.js";
import {ProductCardComponent} from "./ProductComponent.js";

export class ProductPaginator extends Paginator {
    constructor(items, translator) {
        super(items, translator);
    }
    addNavigationListeners() {
        this.addPageListener(this.changePage.bind(this));
        this.addPrevListener(this.previousPage.bind(this));
        this.addNextListener(this.nextPage.bind(this));
    }
    previousPage(event) {

        this.goToPage(this.getActivePage() - 1);
    }
    nextPage(event) {
        this.goToPage(this.getActivePage() + 1);
    }
    changePage(event) {
        this.goToPage(parseInt(event.target.getAttribute('id').slice(16)));
    }
    goToPage(page) {
        const row = Component.getContentRow();
        row.classList.add('g-4');
        const items = this.getChunk(page);
        for (const product of this.getChunk(page)) {
            const col = document.createElement('div');
            col.classList.add(...['col-sm-6','col-md-4', 'col-lg-3']);
            const productCard = ProductCardComponent(product, this.translator);
            col.appendChild(productCard);
            row.appendChild(col);
        }
        Component.addPagination(row, this.nav(page));
        this.addNavigationListeners();
    }
    getActivePage() {
        const links = document.getElementsByClassName('page-item');
        for (let link of links) {
            const pageId = link.getAttribute('id').slice(11);
            if (pageId !== 'prev' && pageId !== 'next' && link.classList.contains('active')) {
                return parseInt(pageId);
            }
        }
        return 1;
    }
}
