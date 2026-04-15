import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import KategorijaService from "../../service/kategorije/KategorijaService";
import { useState } from "react";
import { useEffect } from "react";

export default function KategorijaPromjena() {
    const navigate = useNavigate()
    const params = useParams()
    const [kategorija, setKategorija] = useState({})


    async function ucitajKategorija() {
        await KategorijaService.getBySifra(params.sifra).then((odgovor) => {
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            const s = odgovor.data


            setKategorija(s)

        })


    }

    useEffect(() => {
        ucitajKategorija()
    }, [])


    async function promjeni(kategorija) {
        await KategorijaService.promjeni(params.sifra, kategorija).then(() => {
            navigate(RouteNames.KATEGORIJE)
        })
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
                Promjena kategorije
            </h3>
            <Form onSubmit={odradiSubmit}>
                <Form.Group controlId="naziv">
                    <Form.Label>Naziv</Form.Label>
                    <Form.Control type="text" name="naziv" required
                        defaultValue={kategorija.naziv} />
                </Form.Group>

                <Form.Group controlId="opis">
                    <Form.Label>Opis</Form.Label>
                    <Form.Control type="text" name="opis"
                        defaultValue={kategorija.opis} />


                </Form.Group>
                <Form.Group controlId="cijena">
                    <Form.Label>Cijena</Form.Label>
                    <Form.Control type="number" name="cijena" step={0.01}
                        defaultValue={kategorija.cijena} />

                </Form.Group>

                <hr style={{ marginTop: '50px', border: '0' }} />

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
