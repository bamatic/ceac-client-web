import {PRODUCTS_PAR_PAGE} from "../../../config.js";

export class Paginator {
    constructor(items, translator) {
        this.items = items;
        this.itemsPerPage = PRODUCTS_PAR_PAGE;
        if (items.length % this.itemsPerPage > 0) {
            this.lastPage = Math.floor(items.length / this.itemsPerPage) + 1;
        }
        else {
            this.lastPage = Math.floor(items.length / this.itemsPerPage)
        }
        this.translator = translator;
    }
    getChunk(page) {
        return this.items.slice(
            (page-1) * this.itemsPerPage,
            (page-1) * this.itemsPerPage + this.itemsPerPage
        );
    }
    nav(page) {
        const nav = document.createElement('nav');
        const ul = document.createElement('ul');
        ul.classList.add('pagination', 'justify-content-center');
        nav.appendChild(ul);
        const prev = document.createElement('li');
        prev.setAttribute('id', 'pagination-prev');
        prev.classList.add('page-item');
        if (page === 1){
            prev.classList.add('disabled');
        }
        ul.appendChild(prev);
        const prevLink = document.createElement('button');
        prevLink.classList.add('page-link');
        prevLink.setAttribute('id', 'pagination-link-prev')
        prevLink.innerText = this.translator.translate('previous', 'title');
        prev.appendChild(prevLink);
        for (let i = 1; i < this.lastPage + 1; i++) {
            const li = document.createElement('li');
            li.setAttribute('id', 'pagination-' + page);
            li.classList.add('page-item');
            if (page === i){
                li.classList.add('active');
            }
            ul.appendChild(li);
            const link = document.createElement('button');
            link.setAttribute('id', 'pagination-link-' + i);
            link.classList.add('page-link');
            link.innerText = '' + i;
            li.appendChild(link);
        }

        const next = document.createElement('li');
        next.setAttribute('id', 'pagination-next');
        next.classList.add('page-item');
        ul.appendChild(next)
        const nextLink = document.createElement('button');
        nextLink.classList.add('page-link');
        nextLink.setAttribute('id', 'pagination-link-next')
        if (page === this.lastPage) {
            next.classList.add('disabled');
        }
        nextLink.innerText = this.translator.translate('next', 'title');
        next.appendChild(nextLink);
        return nav;
    }
    addPrevListener(prev) {
        document.getElementById('pagination-link-prev')
            .addEventListener('click', prev )
    }
    addNextListener(next) {
        document.getElementById('pagination-link-next')
            .addEventListener('click', next )
    }
    addPageListener(pageFunction) {
        for (let i = 1; i < this.lastPage + 1; i++) {
            document.getElementById('pagination-link-' + i)
                .addEventListener('click', pageFunction)
        }
    }
    setPage(page) {
        const prev = document.getElementById('pagination-prev');
        if (!prev.classList.contains('disabled'))
            prev.classList.add('disabled');
        const next = document.getElementById('pagination-next');
        if (!next.classList.contains('disabled'))
            next.classList.add('disabled');
        for (let i = 1; i < this.lastPage + 1; i++) {
            const btn = document.getElementById('pagination-link-' + i);
             btn.classList.remove('active');
        }
        const activeBtn = document.getElementById('pagination-link-' + page);
        activeBtn.classList.add('active');
    }

}
