import { useEffect, useState } from "react"
import KategorijaService from "../../service/kategorije/KategorijaService"
import { Button, Table } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import SlatkisiService from "../../service/slatkisi/SlatkisiService"

export default function SlatkisPregled(){

    const navigate = useNavigate()

    const [slatkisi, setSlatkise] = useState([])
    const [kategorije, setKategorije] = useState([])

    useEffect(()=>{
        ucitajSlatkise()
        ucitajKategorije()
    },[])

    async function ucitajSlatkise() {
        await SlatkisiService.get().then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            setGrupe(odgovor.data)
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

    async function brisanje(sifra) {
        if (!confirm('Sigurno obrisati?')) return;
        await SlatkisiService.obrisi(sifra);
        await SlatkisiService.get().then((odgovor)=>{
            setSlatkise(odgovor.data)
        })
    }

    function dohvatiNazivKategorije(sifraKategorije) {
        const kategorija = kategorije.find(k => k.sifra === sifraKategorije)
        return kategorija ? kategorija.naziv : 'Nepoznata kategorija'
    }

    return(
        <>
        <Link to={RouteNames.SLATKIŠI_NOVI}
        className="btn btn-success w-100 my-3">
            Dodavanje novog slatkisa
        </Link>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Naziv</th>
                    <th>Kategorija</th>
                    <th>Akcija</th>
                </tr>
            </thead>
            <tbody>
                {slatkisi && slatkisi.map((slatkis)=>(
                    <tr key={slatkis.sifra}>
                        <td className="lead">{slatkis.naziv}</td>
                        <td>{dohvatiNazivKategorije(slatkis.kategorija)}</td>
                        <td>
                            <Button onClick={()=>{navigate(`/slatkisi/${slatkis.sifra}`)}}>
                                Promjeni
                            </Button>
                            &nbsp;&nbsp;
                            <Button variant="danger" onClick={() => brisanje(slatkis.sifra)}>
                                Obriši
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    )
}
