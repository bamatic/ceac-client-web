export class MockClient {
    get(type) {
        switch (type) {
            case 'products':
                return [
                    {id:1,name:"P01", unitPrice:45, taxPercent:0.21,imageUrl:"https://img01.ztat.net/article/spp-media-p1/bab5d963f1ea3cc29aa11088ec5e0d11/b1fbcd0cf8394dfb84074ac3267ad715.jpg?imwidth=1800&filter=packshot",availableDate:new Date()},
                    {id:11,name:"P01 Automatic", unitPrice:450, taxPercent:0.21,imageUrl:"https://img01.ztat.net/article/spp-media-p1/bab5d963f1ea3cc29aa11088ec5e0d11/b1fbcd0cf8394dfb84074ac3267ad715.jpg?imwidth=1800&filter=packshot",availableDate:new Date()},
                    {id:71,name:"P04 Simple SPA", unitPrice:145, taxPercent:0.21,imageUrl:"https://img01.ztat.net/article/spp-media-p1/bab5d963f1ea3cc29aa11088ec5e0d11/b1fbcd0cf8394dfb84074ac3267ad715.jpg?imwidth=1800&filter=packshot",availableDate:new Date()},
                    {id:85,name:"P06 Software", unitPrice:25, taxPercent:0.21,imageUrl:"https://img01.ztat.net/article/spp-media-p1/bab5d963f1ea3cc29aa11088ec5e0d11/b1fbcd0cf8394dfb84074ac3267ad715.jpg?imwidth=1800&filter=packshot",availableDate:new Date()},
                    {id:124,name:"P08 Hola Cabrones", unitPrice:5.2, taxPercent:0.21,imageUrl:"https://img01.ztat.net/article/spp-media-p1/bab5d963f1ea3cc29aa11088ec5e0d11/b1fbcd0cf8394dfb84074ac3267ad715.jpg?imwidth=1800&filter=packshot",availableDate:new Date()},
                ];
            case 'commands':
                return [
                    {id:"51",title:"Relojes Regalo", commandDate:"2023-09-14", state:"IN_DELIVERY", deliveryDate:"2023-05-05", finalPrice:47},
                    {id:"31", title: "Ropa Chica",  commandDate:"2023-09-14", state:"DELIVERED", deliveryDate:"2023-07-07", finalPrice: 65}
                ]
            case 'invoices':
                return [];
            case 'shopping_card':
                return [];
            case 'user':
                return {
                    id: "65",
                    name: "Victor",
                    surnames: "ZUGADI GARCIA",
                    address: "Dendari 17,3, 48280, Lekeitio",
                    avatar: "",
                    email: "vzugadi@bamatic.com"
                }
            default:
                return [];
        }

    }
    store(type, obj) {
        switch (type) {
            case 'command':
                return true;
        }
    }
    getAccess(credentials) {
        return true;
    }
}
