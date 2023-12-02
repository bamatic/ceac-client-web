import {HttpClient} from "./app/services/helpers/HttpClient.js";
import {ProductComponent} from "./app/components/ProductComponent.js";
import {CommandComponent} from "./app/components/CommandComponent.js";
import {InvoiceComponent} from "./app/components/InvoiceComponent.js";
import {ShoppingCardComponent} from "./app/components/ShoppingCardComponent.js";
import {CustomerComponent} from "./app/components/CustomerComponent.js";
import {ProductService} from "./app/services/ProductService.js";
import {CommandService} from "./app/services/CommandService.js";
import {API_URL, LOGIN_URL} from "./config.js";
import {InvoiceService} from "./app/services/InvoiceService.js";
import {ShoppingCardService} from "./app/services/ShoppingCardService.js";
import {CustomerService} from "./app/services/CustomerService.js";
import {TranslatorService} from "./app/services/TranslatorService.js";

function hashRouter(hash, translatorService) {
    switch (hash) {
        case null:
        case '#/':
        case '#/products':
        case '':
            ProductComponent(new ProductService(client), translatorService)
                .catch(error => console.log(error));
            break;
        case '#/commands':
            CommandComponent(new CommandService(client), translatorService)
                .catch(error => console.log(error));
            break;
        case '#/invoices':
            InvoiceComponent(new CommandService(client), translatorService)
                .catch(error => console.log(error));
            break;
        case '#/shopping-card':
            ShoppingCardComponent(new ShoppingCardService(client), translatorService)
                .catch(error => console.log(error));
            break;
        case '#/user':
            CustomerComponent(new CustomerService(client), translatorService)
                .catch(error => console.log(error));
            break;
        default: {
            const productRegex = /^#\/products\/\d+$/;
            if (productRegex.test(hash)) {
                ProductComponent(new ProductService(client), translatorService, hash.slice(hash.lastIndexOf('/') + 1))
                    .catch(error => console.log(error));
                break;
            } else {
                const commandRegex = /^#\/commands\/\d+$/;
                if (commandRegex.test(hash)) {
                    CommandComponent(new CommandService(client), translatorService, hash.slice(hash.lastIndexOf('/') + 1))
                        .catch(error => console.log(error));
                } else {
                    const invoiceRegex = /^#\/invoices\/\d+$/;
                    if (invoiceRegex.test(hash)) {
                        InvoiceComponent(new InvoiceService(client), translatorService, hash.slice(hash.lastIndexOf('/') + 1))
                            .catch(error => console.log(error));
                    }
                }
            }
        }
    }
}
function translateMenus(translator) {
    document.getElementById('products-text').innerText=translator.translate('products', 'title');
    document.getElementById('commands-text').innerText=translator.translate('commands', 'title');
    document.getElementById('invoices-text').innerText=translator.translate('invoices', 'title');
    document.getElementById('sc-text').innerText=translator.translate('shopping-card', 'title');
    document.getElementById('badge-left').innerText=translator.translate('100-natural', 'title');
    document.getElementById('badge-center').innerText=translator.translate('no-fertilizers', 'title');
    document.getElementById('badge-right').innerText=translator.translate('no-preservatives', 'title');
    document.getElementById('side-menu-command').innerText=translator.translate('commands', 'title');
    document.getElementById('side-menu-invoice').innerText=translator.translate('invoices', 'title');
    document.getElementById('side-menu-sc').innerText=translator.translate('shopping card', 'title');
    document.getElementById('side-menu-user').innerText=translator.translate('user', 'title');
}
function load() {
    console.log('loading...')
    const index = location.href.indexOf('#/');
    const hash = index > -1?location.href.slice(index):location.hash;
    import('./lang/' + translatorService.lang + '.js')
        .then((langModule) => {
            translatorService.langDict = langModule.lang;
            translateMenus(translatorService);
            hashRouter(hash, translatorService);
        });
}
function router() {
    const {hash} = location;
    hashRouter(hash, translatorService);
}

const client = new HttpClient(API_URL, LOGIN_URL);
document.addEventListener("DOMContentLoaded",load);
window.addEventListener("hashchange", router);
const translatorService = new TranslatorService();

