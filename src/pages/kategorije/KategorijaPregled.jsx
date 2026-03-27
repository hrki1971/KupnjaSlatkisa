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
            setKategorije(odgovor.data)
        })
    }
    async function obrisi(sifra) {
        if(!confirm('Sigurno obrisati')){
            return
        }
        await KategorijaService.obrisi(sifra)
        ucitajKategorije
    }
    return (
        <>
            <Link to={RouteNames.KATEGORIJE_NOVI}
            className="btn btn-success w-100 mb-3 mt-3">
                Dodaj novu kategoriju
            </Link>
            <Table>
                <thead>
                    <tr>
                        <th>Naziv</th>
                        <th>Opis</th>
                        <th>Cijena</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {kategorije && kategorije.map((kategorija) => (
                        <tr key={kategorija.sifra}>
                            <td>{kategorija.naziv}</td>
                            <td>{kategorija.opis}</td>
                            <td>
                                <NumericFormat
                                    value={kategorija.cijena}
                                    displayType={'text'}
                                    thousandSeparator='.'
                                    decimalSeparator=','
                                    suffix={' €'}
                                    decimalScale={2}
                                    fixedDecimalScale


                                />
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