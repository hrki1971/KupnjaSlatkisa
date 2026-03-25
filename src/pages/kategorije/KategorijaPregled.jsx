import { useEffect, useState } from "react"
import KategorijeServis from "../../service/kategorije/KategorijaService"
import { Table } from "react-bootstrap"
import { NumericFormat } from "react-number-format"
import { Link } from "react-router-dom"
import { RouteNames } from "../../constants"


export default function KategorijaPregled() {

    const [kategorije, setKategorije] = useState([])

    useEffect(() => {
        ucitajKategorije()

    }, [])
    async function ucitajKategorije() {
        await KategorijeServis.get().then((odgovor) => {
            setKategorije(odgovor.data)
        })
    }
    return (
        <>
            <Link to={RouteNames.KATEGORIJE_NOVI}>
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
                            <td></td>





                        </tr>
                    ))}
                </tbody>
            </Table>

        </>
    )
}