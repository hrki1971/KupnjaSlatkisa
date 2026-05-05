const STORAGE_KEY = 'alergeni';

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY);
    return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci));
}

async function get() {
    const alergeni = dohvatiSveIzStorage();
    return {success: true,  data: [...alergeni] };
}

async function getBySifra(sifra) {
    const alergeni = dohvatiSveIzStorage();
    const alergen = alergeni.find(a => a.sifra === parseInt(sifra));
    return {success: true,  data: alergen };
}

async function dodaj(alergen) {
    const alergeni = dohvatiSveIzStorage();
    
    if (alergeni.length === 0) {
        alergen.sifra = 1;
    } else {
        const maxSifra = Math.max(...alergeni.map(a => a.sifra));
        alergen.sifra = maxSifra + 1;
    }
    
    alergeni.push(alergen);
    spremiUStorage(alergeni);
    return { data: alergen };
}

async function promjeni(sifra, alergen) {
    const alergeni = dohvatiSveIzStorage();
    const index = alergeni.findIndex(a => a.sifra === parseInt(sifra));
    
    if (index !== -1) {
        alergeni[index] = { ...alergeni[index], ...alergen };
        spremiUStorage(alergeni);
    }
    return { data: alergeni[index] };
}

async function obrisi(sifra) {
    let alergeni = dohvatiSveIzStorage();
    alergeni = alergeni.filter(a => a.sifra !== parseInt(sifra));
    spremiUStorage(alergeni);
    return { message: 'Obrisano' };
}

async function getPage(page = 1, pageSize = 8, searchTerm = '') {
    let alergeni = dohvatiSveIzStorage();
    
    // Filtriranje prema search termu
    if (searchTerm && searchTerm.trim() !== '') {
        const lowerSearchTerm = searchTerm.toLowerCase().trim();
        alergeni = alergeni.filter(polaznik => {
            const ime = (polaznik.naziv || '').toLowerCase();
            return ime.includes(lowerSearchTerm);
        });
    }
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = alergeni.slice(startIndex, endIndex);
    const totalItems = alergeni.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
        success: true,
        data: paginatedData,
        currentPage: page,
        pageSize: pageSize,
        totalPages: totalPages,
        totalItems: totalItems
    };
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi,
    getPage
};
