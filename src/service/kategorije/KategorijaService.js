
import {kategorije} from "./KategorijaPodaci";


async function get() {
    return {data:kategorije}
}

async function dodaj(kategorija){
    if(kategorije.length>0){
        kategorija.sifra = kategorije[kategorije.length - 1].sifra + 1
    }else{
        kategorija.sifra = 1
    }

    kategorije.push(kategorija);
}
export default {
    get,
    dodaj
}