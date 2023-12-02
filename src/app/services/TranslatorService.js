
 export class TranslatorService {

    constructor() {
        this.lang = document.getElementsByTagName('html')[0].getAttribute('lang').toLowerCase();
        this.langDict = null;
        this.locale = this.lang + '-' + this.lang.toUpperCase();
    }
    toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            function(txt) {
                return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
            }
        );
    }
    translate(str, caseStyle) {
        if (!(str.toLowerCase() in this.langDict)) {
            return str;
        }
        switch (caseStyle) {
            case "lower":
                return this.langDict[str.toLowerCase()].toLowerCase();
            case "upper":
                return this.langDict[str.toLowerCase()].toUpperCase();
            case "title":
                return  this.toTitleCase(this.langDict[str.toLowerCase()]);
            default:
                return this.langDict[str.toLowerCase()];
        }
    }

}
