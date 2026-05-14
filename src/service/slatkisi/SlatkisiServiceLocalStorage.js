const STORAGE_KEY = 'slatkisi';

// Pomoćna funkcija za dohvaćanje podataka iz local storage-a
function dohvatiSveIzStorage() {
    //debugger
    const podaci = localStorage.getItem(STORAGE_KEY);
    return podaci ? JSON.parse(podaci) : [];
}

// Pomoćna funkcija za spremanje podataka u local storage
function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci));
}

// 1/4 Read - dohvati sve
async function get() {
    const slatkisi = dohvatiSveIzStorage();
    return {success: true,  data: [...slatkisi] };
}

// Dohvati jedan po šifri
async function getBySifra(sifra) {
    const slatkisi = dohvatiSveIzStorage();
    const slatkis = slatkisi.find(s => s.sifra === parseInt(sifra));
    return {success: true,  data: slatkis };
}

// 2/4 Create - dodaj novi
async function dodaj(slatkis) {
    const slatkisi = dohvatiSveIzStorage();
    
    if (slatkisi.length === 0) {
        slatkis.sifra = 1;
    } else {
        // Pronalaženje najveće šifre da izbjegnemo duplikate
        const maxSifra = Math.max(...slatkisi.map(s => s.sifra));
        slatkis.sifra = maxSifra + 1;
    }
    
    slatkisi.push(slatkis);
    spremiUStorage(slatkisi);
    return { data: slatkis };
}

// 3/4 Update - promjeni postojeći
async function promjeni(sifra, slatkis) {
    const slatkisi = dohvatiSveIzStorage();
    const index = slatkisi.findIndex(s => s.sifra === parseInt(sifra));
    
    if (index !== -1) {
        slatkisi[index] = { ...slatkisi[index], ...slatkis, sifra: parseInt(sifra) };
        spremiUStorage(slatkisi);
    }
    return { data: slatkisi[index] };
}

// 4/4 Delete - obriši
async function obrisi(sifra) {
    let slatkisi = dohvatiSveIzStorage();
    
    slatkisi = slatkisi.filter(s => s.sifra !== parseInt(sifra));
    spremiUStorage(slatkisi);
    return { message: 'Obrisano' };
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
};
