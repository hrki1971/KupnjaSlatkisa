import AlergenServiceLocalStorage from "./AlergenServiceLocalStorage";
import AlergenServiceMemorija from "./AlergenServiceMemorija";
import { DATA_SOURCE } from "../../constants";

let Servis = null;


switch (DATA_SOURCE) {
    case 'memorija':
        Servis = AlergenServiceMemorija;
        break;
    case 'localStorage':
        Servis = AlergenServiceLocalStorage;
        break;
    default:
        Servis = null;
}


const PrazanServis = {
    get: async () => ({ success: false, data: []}),
    getBySifra: async (sifra) => ({ success: false, data: {} }),
    dodaj: async (alergen) => { console.error("Servis nije učitan"); },
    promjeni: async (sifra, alergen) => { console.error("Servis nije učitan"); },
    obrisi: async (sifra) => { console.error("Servis nije učitan"); }
};

const AktivniServis = Servis || PrazanServis;

export default {
    get: () => AktivniServis.get(),
    getBySifra: (sifra) => AktivniServis.getBySifra(sifra),
    dodaj: (alergen) => AktivniServis.dodaj(alergen),
    promjeni: (sifra, alergen) => AktivniServis.promjeni(sifra, alergen),
    obrisi: (sifra) => AktivniServis.obrisi(sifra)
};