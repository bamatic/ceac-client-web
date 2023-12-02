
export class HttpClient {
    constructor(API_URL, LOGIN_URL) {
        this.BASE_URL = API_URL;
        this.LOGIN_URL = LOGIN_URL;
        this.JWT_TOKEN = localStorage.getItem('X-BAMATIC-AUTH');
    }
    async all(limit, endpoint) {
        if (this.JWT_TOKEN === null) {
            window.location.href = this.LOGIN_URL;
        }
        let url = this.BASE_URL + endpoint;
        if (limit > 0) {
            url += "?limit=" + limit;
        }
        console.log(url)

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-type": "application/json; charset=utf8",
                "Authorization": "bamatic-bearer=" + this.JWT_TOKEN
            }
        });
        if (!response.ok) {
            if (response.status === 403) {
                window.location.href = this.LOGIN_URL;
            }
            else {
                throw new Error(`${response.status} ${response.statusText}`);
            }
        }
        const data = await response.json();
        return {
            status:200,
            data:data
        }

    }
    async get(endpoint) {
        if (this.JWT_TOKEN === null) {
            window.location.href = this.LOGIN_URL;
        }
        let url = this.BASE_URL + endpoint;
        console.log(url)

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-type": "application/json; charset=utf8",
                "Authorization": "bamatic-bearer=" + this.JWT_TOKEN
            }
        });
        if (!response.ok) {
            if (response.status === 403) {
                window.location.href = this.LOGIN_URL;
            }
            else {
                throw new Error(`${response.status} ${response.statusText}`);
            }
        }
        const data = await response.json();
        return {
            status:200,
            data:data
        }

    }
    async store(data, endpoint, deleteSP) {
        if (this.JWT_TOKEN === null) {
            window.location.href = this.LOGIN_URL;
        }
        let url = this.BASE_URL + endpoint;
        console.log(url)
        if (deleteSP) {
            url += "?deleteSP=true";
        }
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=utf8",
                "Authorization": "bamatic-bearer=" + this.JWT_TOKEN
            }
        });
        if (!response.ok) {
            if (response.status === 403) {
                window.location.href = this.LOGIN_URL;
            } else {
                throw new Error(`${response.status} ${response.statusText}`);
            }
        }
        const jsonData = await response.json();
        return {
            status: 200,
            data: jsonData
        }

    }
    async delete(endpoint) {
        if (this.JWT_TOKEN === null) {
            window.location.href = this.LOGIN_URL;
        }
        let url = this.BASE_URL + endpoint;
        console.log(url)
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                "Content-type": "application/json; charset=utf8",
                "Authorization": "bamatic-bearer=" + this.JWT_TOKEN
            }
        });
        if (!response.ok) {
            if (response.status === 403) {
                window.location.href = this.LOGIN_URL;
            } else {
                throw new Error(`${response.status} ${response.statusText}`);
            }
        }
        const jsonData = await response.json();
        return {
            status: 200,
            data: jsonData
        }


    }
    async update(data, endpoint) {
        if (this.JWT_TOKEN === null) {
            window.location.href = this.LOGIN_URL;
        }
        let url = this.BASE_URL + endpoint;
        console.log('update url',url)
        console.log('json data', data)
        console.log('string data', JSON.stringify(data))
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                "Content-type": "application/json; charset=utf8",
                "Authorization": "bamatic-bearer=" + this.JWT_TOKEN
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            if (response.status === 403) {
                window.location.href = this.LOGIN_URL;
            } else {
                throw new Error(`${response.status} ${response.statusText}`);
            }
        }
        const jsonData = await response.json();
        return {
            status: 200,
            data: jsonData
        }

    }
    async login(email, password, endpoint) {
        console.log('httpclient login')
        let url = this.BASE_URL + endpoint;
        console.log(url);
        localStorage.clear();
        const response = await fetch(url, {
            method: 'POST',
            body:JSON.stringify({
                email:email,
                password:password
            }),
            headers: {
                "Content-type": "application/json; charset=utf8"
            }
        })
        if (!response.ok) {
            console.log('network error');
            if (response.status === 403) {
                return {
                    status:403,
                    data:null
                }
            }
            else {
                throw new Error(`${response.status} ${response.statusText}`);
            }
        }
        const data = await response.json();
        if (data['bamatic-bearer']) {
            console.log("setting X-BAMATIC-AUTH to " + data['bamatic-bearer']);
            localStorage.setItem("X-BAMATIC-AUTH", data['bamatic-bearer']);
            return true;
        }
        else {
            console.log("no bamatic bearer");
            return false;
        }
    }

}
