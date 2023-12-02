import {AuthenticationService} from '../app/services/AuthenticationService.js'
import {HttpClient} from "../app/services/helpers/HttpClient.js";
import * as Config from "../config.js";
async function login(event) {
    const email = document.getElementById('email');
    const pass = document.getElementById('password');
    if (email && pass) {
        console.log(email.value)
        console.log(pass.value)
        const service = new AuthenticationService(new HttpClient(Config.API_URL))
        let access = false;
        access = await service.getAccess(email.value, pass.value);
        if (access === true) {
            window.location.href= "../index.html";
        }
        else {
            const div = document.getElementById('msg').innerHTML='Connexion Imposible';
            console.log('mierda')
            document.getElementById("login").reset();
            event.preventDefault();
        }
    }
}
function load() {
    document.getElementById('submit').addEventListener('click', login);
}
document.addEventListener("DOMContentLoaded",load);
