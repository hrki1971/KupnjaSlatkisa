import { alergeni } from "./AlergenPodaci";



async function get(){
    return {success: true, data: [...alergeni]} // [...] stvara novi niz s istim podacima
}

async function getBySifra(sifra) {
    return {success: true, data: alergeni.find(a => a.sifra === parseInt(sifra))}
}

// 2/4 Create od CRUD
async function dodaj(alergen){
    if(alergeni.length===0){
        alergen.sifra=1
    }else{
        alergen.sifra = alergeni[alergeni.length - 1].sifra + 1
    }
    
    alergeni.push(alergen)
}

// 3/4 Update od CRUD
async function promjeni(sifra,alergen) {
    const index = nadiIndex(sifra)
    alergeni[index] = {...alergeni[index], ...alergen}
}

function nadiIndex(sifra){
    return alergeni.findIndex(a=>a.sifra === parseInt(sifra))
}

// 4/4 Delete od CRUD
async function obrisi(sifra) {
    const index = nadiIndex(sifra);
    if (index > -1) {
        alergeni.splice(index, 1);
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