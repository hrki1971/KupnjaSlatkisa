import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import KategorijaService from "../../service/kategorije/KategorijaService"
import { Button, Col, Form, Row, Container, Card } from "react-bootstrap"
import { RouteNames } from "../../constants"
import SlatkisiService from "../../service/slatkisi/SlatkisiService"

export default function SlatkisPromjena(){

    const navigate = useNavigate()
    const params = useParams()
    const [slatkis, setSlatkis] = useState({})
    const [kategorije, setKategorije] = useState([])

    useEffect(()=>{
        ucitajSlatkis()
        ucitajKategorije()
    },[])

    async function ucitajSlatkis() {
        await SlatkisiService.getBySifra(params.sifra).then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            setSlatkis(odgovor.data)
        })
    }

    async function ucitajKategorije() {
        await KategorijaService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis za kategorije')
                return
            }
            setKategorije(odgovor.data)
        })
    }

    async function promjeni(slatkis) {
        await SlatkisiService.promjeni(params.sifra,slatkis).then(()=>{
            navigate(RouteNames.SLATKISI)
        })
    }

    function odradiSubmit(e){
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

        promjeni({
            naziv: podaci.get('naziv'),
            kategorija: odabranaKategorija
        })
    }

    return(
         <>
            <h3>Promjena slatkisa</h3>
            <Form onSubmit={odradiSubmit}>
                <Container className="mt-4">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4">Podaci o slatkisu</Card.Title>

                            {/* Naziv - Pun širina na svim ekranima */}
                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="naziv" className="mb-3">
                                        <Form.Label className="fw-bold">Naziv</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="naziv"
                                            placeholder="Unesite naziv slatkisa"
                                            required
                                            defaultValue={slatkis.naziv}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Kategorija - Select dropdown */}
                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="kategorija" className="mb-3">
                                        <Form.Label className="fw-bold">Kategorija</Form.Label>
                                        <Form.Select name="kategorija" required value={slatkis.kategorija || ''} onChange={(e) => setSlatkis({...slatkis, kategorija: parseInt(e.target.value)})}>
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
                                <Link to={RouteNames.SLATKISI} className="btn btn-danger px-4">
                                    Odustani
                                </Link>
                                <Button type="submit" variant="success">
                                    Promjeni slatkis
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            </Form>
        </>
    )
}
