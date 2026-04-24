import { useEffect, useState } from "react"
import { Button, Table } from "react-bootstrap"
import { NumericFormat } from "react-number-format"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import KategorijaService from "../../service/kategorije/KategorijaService"
import SlatkisiService from "../../service/slatkisi/SlatkisiService"



export default function KategorijaPregled() {

    const navigate = useNavigate()
    const [kategorije, setKategorije] = useState([])
    const [slatkisi, setSlatkisi] = useState([])

    useEffect(() => {
        ucitajKategorije()
        ucitajSlatkise()
    }, [])
    async function ucitajKategorije() {
        await KategorijaService.get().then((odgovor) => {
            if(!odgovor.success){
                alert('Nije implementiran servis')
            }
            setKategorije(odgovor.data)
        })
    }

    async function ucitajSlatkise() {
            await SlatkisiService.get().then((odgovor)=>{
                if(!odgovor.success){
                    alert('Nije implementiran servis')
                    return
                }
                setSlatkisi(odgovor.data)
            })
        }

    function dohvatiBrojSlatkisa(sifraKategorija){
        let brojac = 0
        slatkisi.map((e)=>{
            if(e.kategorija ===sifraKategorija){
                brojac++
            }
        })
        return brojac
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
                               {dohvatiBrojSlatkisa(kategorija.sifra)}
                            </td>
                            <td className="text-center">

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