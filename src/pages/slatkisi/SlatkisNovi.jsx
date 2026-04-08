import { useEffect, useState } from "react"
import { Form, Button, Row, Col, Container, Card } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { Link, useNavigate } from "react-router-dom"
import KategorijaService from "../../service/kategorije/KategorijaService"
import SlatkisiService from "../../service/slatkisi/SlatkisiService"

export default function SlatkisNovi() {

    const navigate = useNavigate()
    const [kategorije, setKategorije] = useState([])

    useEffect(() => {
        ucitajKategorije()
    }, [])

    async function ucitajKategorije() {
        await KategorijaService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis za kategorije')
                return
            }
            setKategorije(odgovor.data)
        })
    }

    async function dodaj(slatkis) {
        await SlatkisiService.dodaj(slatkis).then(() => {
            navigate(RouteNames.SLATKIŠI)
        })
    }

    function odradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)

        // --- KONTROLA 1: Naziv (Postojanje) ---
        if (!podaci.get('naziv') || podaci.get('naziv').trim().length === 0) {
            alert("Naziv je obavezan i ne smije sadržavati samo razmake!");
            return;
        }

        // --- KONTROLA 2: Naziv (Minimalna duljina) ---
        if (podaci.get('naziv').trim().length < 3) {
            alert("Naziv grupe mora imati najmanje 3 znaka!");
            return;
        }

        // --- KONTROLA 3: Kategorija (Postojanje) ---
        if (!podaci.get('kategorija') || podaci.get('kategorija') === "") {
            alert("Morate odabrati kategoriju!");
            return;
        }

        // --- KONTROLA 4: Kategorija (Validna vrijednost) ---
        const odabranaKategorija = parseInt(podaci.get('kategorija'));
        if (isNaN(odabranaKategorija) || odabranaKategorija <= 0) {
            alert("Odabrana kategorija nije valjana!");
            return;
        }

        dodaj({
            naziv: podaci.get('naziv'),
            kategorija: odabranaKategorija
        })
    }

    return (
        <>
            <h3>Unos novog slatkisa</h3>
            <Form onSubmit={odradiSubmit}>
                <Container className="mt-4">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4">Podaci o grupi</Card.Title>

                            {/* Naziv - Pun širina na svim ekranima */}
                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="naziv" className="mb-3">
                                        <Form.Label className="fw-bold">Naziv</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="naziv"
                                            placeholder="Unesite naziv grupe"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Smjer - Select dropdown */}
                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="kategorija" className="mb-3">
                                        <Form.Label className="fw-bold">Kategorija</Form.Label>
                                        <Form.Select name="kategorija" required>
                                            <option value="">Odaberite kategoriju</option>
                                            {kategorije && kategorije.map((kategorija) => (
                                                <option key={kategorija.sifra} value={kategorija.sifra}>
                                                    {kategorija.naziv}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr />

                            {/* Gumbi za akciju */}
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <Link to={RouteNames.GRUPE} className="btn btn-danger px-4">
                                    Odustani
                                </Link>
                                <Button type="submit" variant="success">
                                    Dodaj novi slatkisa
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            </Form>
        </>
    )
}
