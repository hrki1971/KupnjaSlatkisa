import { Button, Card, CardBody, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import KategorijaService from "../../service/kategorije/KategorijaService";

export default function KategorijaNovi() {
    const navigate = useNavigate()

    async function dodaj(kategorija) {
        await KategorijaService.dodaj(kategorija).then(() => {
            navigate(RouteNames.KATEGORIJE)
        })
    }


    function odradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)
        if(!podaci.get('naziv') || podaci.get('naziv').trim().length===0){
            alert("Naziv je obavezan i ne smije sadržavati samo razmake!")
            return
        }

        if(!podaci.get('opis') || podaci.get('opis').trim().length===0){
            alert("Opis ne smije sadržavati samo razmake!")
        }

        if(!podaci.get('cijena') || podaci.get('cijena') ===""){
            alert("Cijena je obavezna!")
            return  
        }        dodaj({
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

    <Container className="mt-4">
        <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4">Unos nove kategorije</Card.Title>
           <Row>
            <Col xs={12}>
                <Form.Group controlId="naziv">
                    <Form.Label>Naziv</Form.Label>
                    <Form.Control type="text" name="naziv" required />
                </Form.Group>
            </Col> 
           

            <Col xs ={12}>

                <Form.Group controlId="opis">
                    <Form.Label>Opis</Form.Label>
                    <Form.Control type="text" name="opis" />

            
                </Form.Group>
            </Col>
            </Row>

            <Row>
            <Col xs={6}>
                <Form.Group controlId="cijena">
                    <Form.Label>Cijena</Form.Label>
                    <Form.Control type="number" name="cijena" step={0.01} />

                </Form.Group>
            </Col>

            </Row>


                <hr />

                <Row>
                    <Col>
                        <Link to={RouteNames.KATEGORIJE} className="btn btn-danger">
                            Odustani
                        </Link>


                    </Col>
                    <Col>
                        <Button type="submit" variant="success">
                            Dodaj novu kategoriju
                        </Button>

                    </Col>
                </Row>
                </Card.Body>
                </Card>
                </Container>
            </Form>




        </>
    )



}
