

import {kategorije} from "./KategorijaPodaci";


async function get() {
    return {data: [...kategorije]}
}

async function getBySifra(sifra){
    return {data: kategorije.find(s => s.sifra === parseInt(sifra))}
}

async function dodaj(kategorija){
    if(kategorije.length>0){
        kategorija.sifra = kategorije[kategorije.length - 1].sifra + 1
    }else{
        kategorija.sifra = 1
    }

    kategorije.push(kategorija);
}

async function promjeni(sifra,kategorija){
    const index = nadiIndex(sifra)
    kategorije[index] = {...kategorije[index], ...kategorija}
}

function nadiIndex(sifra) {
    return kategorije.findIndex(s => s.sifra === parseInt(sifra))
    
}

async function obrisi(sifra) {
    const index = nadiIndex(sifra)
    kategorije.slice(index,1)
}
export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
}