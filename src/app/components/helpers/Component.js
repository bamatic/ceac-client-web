export class Component {
    static setTitle(menuId, title, htmlIcon) {
        const appTitle = document.getElementById('page-title');
        appTitle.replaceChildren();
        const div = document.createElement('div')
        div.innerHTML = htmlIcon + ' ' + title;
        appTitle.appendChild(div);
        const menuItems = document.getElementsByClassName('nav-link');
        for (const menuItem of menuItems) {
            menuItem.classList.remove('active');
        }
        const activeMenu = document.getElementById(menuId);
        activeMenu.classList.add('active')
    }
    static getContentColumn() {
        const root = document.getElementById("right");
        const html = document.createElement('div');
        html.classList.add('row');
        root.replaceChildren();
        root.appendChild(html);
        const col = document.createElement('div');
        col.classList.add('col-sm-12');
        html.appendChild(col);
        return col;
    }
    static getContentRow() {
        const root = document.getElementById("right");
        const row = document.createElement('div');
        row.classList.add('row');
        root.replaceChildren();
        root.appendChild(row);
        return row;
    }
    static async setUser(service) {
        const response = await service.getUser();
        if (response && response.status && response.status === 200) {
            const user = response.data;
            const userMenu = document.getElementById('top-nav-user');
            userMenu.innerHTML = '<i class="bi bi-person-circle"></i> ' + user.name + ' ' + user.surname;
            userMenu.setAttribute('user-id', user.id);
        }

    }
    static async setShoppingCard(service) {
        const response = await service.getShoppingCard();
        if (response && response.status && response.status === 200) {
            const shoppingCardItems = response.data;
            const totalPrice = shoppingCardItems
                .map(product => product.price)
                .reduce((partialSum, price) => partialSum + price, 0);
            const sc = document.getElementById('sc-price');
            sc.innerHTML = '<i class="bi bi-credit-card"> ' + totalPrice.toFixed(2) + ' €';
        }

    }
    static closeALlModals()  {
        const divs = document.getElementsByClassName('modal-backdrop');
        for (const div of divs) {
            div.remove();
        }
        document.getElementsByTagName("body")[0].style.overflowY = "scroll";
    }
    static centerTableHeaders() {
        const ths = document.getElementsByTagName('th');
        for (const th of ths) {
            th.classList.add('text-center');
        }
    }
    static createTable(headers, rows, extraRows) {
        const table = document.createElement('table');
        table.classList.add('table', 'bg-white', 'table-hover');
        const thead = document.createElement('thead');
        table.appendChild(thead);
        const tr = document.createElement('tr');
        for (const header of headers) {
            const th = document.createElement('th');
            th.appendChild(document.createTextNode(header.value));
            th.classList.add('text-center');
            tr.appendChild(th);
        }
        thead.appendChild(tr);
        const tbody = document.createElement('tbody');
        tbody.classList.add('table-hover')
        table.appendChild(tbody);

        for (const row of rows) {
            const tr = document.createElement('tr');
            tr.setAttribute('id', 'row-id-' + row['id']);
            tbody.appendChild(tr);
            for (const header of headers) {
                const td = document.createElement('td');

                if (header.type === 'text') {
                    td.appendChild(document.createTextNode(row[header.dataKey]));
                }
                if (header.type === 'date') {
                    td.appendChild(document.createTextNode(row[header.dataKey].toLocaleDateString("es-ES")));
                    td.classList.add('text-end');
                }
                if (header.type === 'number') {
                    td.appendChild(document.createTextNode(row[header.dataKey]));
                    td.setAttribute('id', 'row-' + header.dataKey + '-' + row['id']);
                    td.classList.add('text-end');
                }
                if (header.type === 'currency') {
                    td.appendChild(document.createTextNode(row[header.dataKey].toFixed(2) + ' €'))
                    td.setAttribute('id', 'row-' + header.dataKey + '-' + row['id']);
                    td.classList.add('text-end');
                }
                if (header.type === 'buttons') {
                    {
                        td.setAttribute('id', 'button-id-' + row[header.dataKey])
                        td.classList.add('text-end');
                    }
                }
                tr.appendChild(td);


            }
        }
        return table;
    }
}
