import { slatkisi } from "./SlatkisiPodaci";


// 1/4 Read od CRUD
async function get(){
    return {success: true, data: [...slatkisi]} // [...] stvara novi niz s istim podacima
}

async function getBySifra(sifra) {
    return {success: true, data: slatkisi.find(s => s.sifra === parseInt(sifra))}
}

// 2/4 Create od CRUD
async function dodaj(slatkis){
    if(slatkisi.length===0){
        slatkis.sifra=1
    }else{
        slatkis.sifra = slatkisi[slatkisi.length - 1].sifra + 1
    }
    
    slatkisi.push(slatkis)
}

// 3/4 Update od CRUD
async function promjeni(sifra,slatkis) {
    const index = nadiIndex(sifra)
    slatkisi[index] = {...slatkisi[index], ...slatkis}
}

function nadiIndex(sifra){
    return slatkisi.findIndex(s=>s.sifra === parseInt(sifra))
}

// 4/4 Delete od CRUD
async function obrisi(sifra) {
    const index = nadiIndex(sifra);
    if (index > -1) {
        slatkisi.splice(index, 1);
    }
    return;
}


export default{
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
}
