import { Form, Button, Row, Col, Container, Card } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import AlergenService from "../../service/alergeni/AlergenService";

export default function AlergenNovi(){

    const navigate = useNavigate()

    async function dodaj(alergen){
        //console.table(alergen) // ovo je za kontrolu da li je sve OK
        await AlergenService.dodaj(alergen).then(()=>{
            navigate(RouteNames.ALERGENI)
        })
    }


    function odradiSubmit(e){ //e je event
        e.preventDefault() // nemoj odraditi submit
        const podaci = new FormData(e.target)

        // --- KONTROLA 1: Naziv (Postojanje) ---
        if (!podaci.get('naziv') || podaci.get('naziv').trim().length === 0) {
            alert("Naziv je obavezan i ne smije sadržavati samo razmake!")
            return // Prekid
        }

        // --- KONTROLA 2: Naziv (Minimalna duljina) ---
        if (!podaci.get('opis') || podaci.get('opis').trim().length < 3) {
            alert("Opis alergena mora imati najmanje 3 znaka!")
            return // Prekid
        }

        
        
        

        

        dodaj({
            naziv: podaci.get('naziv'),
            opis: podaci.get('opis'),

            
        })
    }

    return(
        <>
            <h3>Unos novog alergenta</h3>
            <Form onSubmit={odradiSubmit}>


                <Container className="mt-4">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4">Podaci o alergenu</Card.Title>

                            {/* Naziv - Pun širina na svim ekranima */}
                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="naziv" className="mb-3">
                                        <Form.Label className="fw-bold">Naziv</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="naziv"
                                            placeholder="Unesite naziv alergena"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Trajanje i Cijena - Jedno pored drugog na md+, jedno ispod drugog na mobitelu */}
                            <Row>
                               
                                
                                <Col md={6}>
                                    <Form.Group controlId="opis" className="mb-3">
                                        <Form.Label className="fw-bold">Opis</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="opis"
                                            placeholder="Unesite opis alergena"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            

                            

                                

                            <hr />

                            {/* Gumbi za akciju - RWD pozicioniranje */}
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <Link to={RouteNames.SMJEROVI} className="btn btn-danger px-4">
                                    Odustani
                                </Link>
                                <Button type="submit" variant="success">
                                    Dodaj novi alergen
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>

            </Form>
        </>
    )
}