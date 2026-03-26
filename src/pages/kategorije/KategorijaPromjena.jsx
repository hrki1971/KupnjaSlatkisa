import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import KategorijaService from "../../service/kategorije/KategorijaService";
import { useState } from "react";
import { useEffect } from "react";

export default function KategorijaPromjena() {
    const navigate = useNavigate()
    const parms = useParams()
    const [kategorija,setKategorija] = useState({})
    const [aktivan,setAktivan] = useState(false)

    async function ucitajKategorija() {
        await KategorijaService.getBySifra(parms.sifra).then((odgovor) => {
            const s = odgovor.data

            s.datumPokretanja = s.datumPokretanja.substring(0,10)

            setKategorija(s)

            setAktivan(s.aktivan)
        })

        useEffect(()=>{
            ucitajKategorija()
        },[])
    }


    function odradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)
        promjeni({
            naziv: podaci.get('naziv'),
            opis: podaci.get('opis'),
            cijena: parseFloat(podaci.get('cijena'))
        })
    }
    return (
        <>
            <h3>
                Unos nove kategorije
            </h3>
            <Form onSubmit={odradiSubmit}>
                <Form.Group controlId="naziv">
                    <Form.Label>Naziv</Form.Label>
                    <Form.Control type="text" name="naziv" required />
                </Form.Group>

                <Form.Group controlId="opis">
                    <Form.Label>Opis</Form.Label>
                    <Form.Control type="text" name="opis" />


                </Form.Group>
                <Form.Group controlId="cijena">
                    <Form.Label>Cijena</Form.Label>
                    <Form.Control type="number" name="cijena" step={0.01} />

                </Form.Group>

                <hr style={{ margiTop: '50px', border: '0' }} />

                <Row>
                    <Col>
                        <Link to={RouteNames.KATEGORIJE} className="btn btn-danger">
                            Odustani
                        </Link>


                    </Col>
                    <Col>
                        <Button type="submit" variant="success">
                            Promjeni  kategoriju
                        </Button>

                    </Col>
                </Row>
            </Form>




        </>
    )



}
