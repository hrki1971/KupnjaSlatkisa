import { useEffect, useState } from "react"
import KategorijaService from "../../service/kategorije/KategorijaService"
import { Button, Table } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import SlatkisiService from "../../service/slatkisi/SlatkisiService"
import useBreakpoint from "../../hooks/useBreakpoint"
import SlatkisPregledGrid from "./SlatkisPregledGrid"
import SlatkisPregledTablica from "./SlatkisPregledTablica"
import AlergenService from "../../service/alergeni/AlergenService"
import SlatkisPDFGenerator from "../../components/SlatkisPDFGenerator"
export default function SlatkisPregled(){

    const navigate = useNavigate()
    const sirina = useBreakpoint();

    const [slatkisi, setSlatkisi] = useState([])
    const [kategorije, setKategorije] = useState([])
    const [alergeni, setAlergeni] = useState([])

    useEffect(()=>{
        ucitajSlatkise()
        ucitajKategorije()
        ucitajAlergene()
    },[])

    async function ucitajSlatkise() {
        await SlatkisiService.get().then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            setSlatkisi(odgovor.data)
        })
    }

    async function ucitajKategorije() {
        await KategorijaService.get().then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis za kategorije')
                return
            }
            setKategorije(odgovor.data)
        })
    }

    async function ucitajAlergene() {
        await AlergenService.get().then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis za alergene')
                return
            }
            setAlergeni(odgovor.data)
        })
    }

    async function brisanje(sifra) {
        if (!confirm('Sigurno obrisati?')) return;
        await SlatkisiService.obrisi(sifra);
        await SlatkisiService.get().then((odgovor)=>{
            setSlatkisi(odgovor.data)
        })
    }

    function dohvatiNazivKategorije(sifraKategorije) {
        const kategorija = kategorije.find(k => k.sifra === sifraKategorije)
        return kategorija ? kategorija.naziv : 'Nepoznata kategorija'
    }

    function generirajPDF(slatkis) {
        const nazivKategorije = dohvatiNazivKategorije(slatkis.kategorija);
        const alergeniObjekti = (slatkis.alergeni || []).map(sifra => alergeni.find(a => a.sifra === sifra)).filter(Boolean);
        const generiraj = SlatkisPDFGenerator({ slatkis, kategorija: nazivKategorije, alergeni: alergeniObjekti });
        generiraj();
    }

    return(
        <>
        <Link to={RouteNames.SLATKISI_NOVI}
        className="btn btn-success w-100 my-3">
            Dodavanje novog slatkiša
        </Link>
        {/* tableti prema manje */}
            {['xs', 'sm', 'md'].includes(sirina) ? (
                <SlatkisPregledGrid 
                    slatkisi={slatkisi} 
                    navigate={navigate} 
                    brisanje={brisanje} 
                    generirajPDF={generirajPDF}
                    kategorije={kategorije}
                />
            ) : (
                <SlatkisPregledTablica
                    slatkisi={slatkisi} 
                    navigate={navigate} 
                    brisanje={brisanje} 
                    generirajPDF={generirajPDF}
                    kategorije={kategorije}
                />
            )}
        </>
    )
}
