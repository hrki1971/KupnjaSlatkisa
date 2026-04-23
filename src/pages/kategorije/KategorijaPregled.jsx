import { useEffect, useState } from "react"
import { Button, Table } from "react-bootstrap"
import { NumericFormat } from "react-number-format"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import KategorijaService from "../../service/kategorije/KategorijaService"


export default function KategorijaPregled() {

    const navigate = useNavigate()
    const [kategorije, setKategorije] = useState([])

    useEffect(() => {
        ucitajKategorije()

    }, [])
    async function ucitajKategorije() {
        await KategorijaService.get().then((odgovor) => {
            if(!odgovor.success){
                alert('Nije implementiran servis')
            }
            setKategorije(odgovor.data)
        })
    }
    async function obrisi(sifra) {
      // debugger
      
        
      
        if(!confirm('Sigurno obrisati')){
            return
        }
        await KategorijaService.obrisi(sifra)
        ucitajKategorije()
    }
    return (
        <>
            <Link to={RouteNames.KATEGORIJE_NOVI}
            className="btn btn-success w-100 mb-3 mt-3"> 
                Dodaj novu kategoriju
            </Link>
            <Table striped border hover>
                <thead>
                    <tr>
                        <th>Naziv</th>
                        <th>Opis</th>
                        <th>Slatkiša u kategoriji</th>
                        <th>Akcija</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {kategorije && kategorije.map((kategorija) => (
                        <tr key={kategorija.sifra}>
                            <td className="lead">{kategorija.naziv}</td>
                            <td className="lead">{kategorija.opis}</td>
                            <td>
                               Napraviti
                            </td>
                            <td>
                                <Button onClick={()=>{navigate(`/kategorije/${kategorija.sifra}`)}}>
                                    Promjena
                                </Button>
                                &nbsp;&nbsp;
                                <Button variant="danger" onClick={()=>{obrisi(kategorija.sifra)}}>
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