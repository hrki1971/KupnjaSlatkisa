import { useEffect, useState } from "react"
import AlergenService from "../../service/alergeni/AlergenService"
import { Table, Button } from "react-bootstrap"


import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"

export default function AlergenPregled() {

    const navigate = useNavigate()

    const [alergeni, setAlergeni] = useState([])


    useEffect(() => {
        ucitajAlergene()
    }, [])

    async function ucitajAlergene() {
        await AlergenService.get().then((odgovor) => {
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            setAlergeni(odgovor.data)
        })
    }

    async function obrisi(sifra) {
        if(!confirm('Sigurno obrisati')){
            return
        }
        await AlergenService.obrisi(sifra)
        ucitajAlergene()
    }


    return (
        <>
            <Link to={RouteNames.ALERGENI_NOVI} 
            className="btn btn-success w-100 mb-3 mt-3">
                Dodavanje novog alergena
            </Link>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Naziv</th>
                        <th>Opis</th>
                        <th>Cijena</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {alergeni && alergeni.map((alergen) => (
                        <tr key={alergen.sifra}>
                            <td className="lead">{alergen.naziv}</td>
                            <td className="text-end">{alergen.opis}</td>
                            <td className="text-end">
                                
                            </td>
                           
                            <td>
                                <Button onClick={()=>{navigate(`/alergeni/${alergen.sifra}`)}}>
                                    Promjena
                                </Button>
                                &nbsp;&nbsp;
                                 <Button variant="danger" onClick={()=>{obrisi(alergen.sifra)}}>
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