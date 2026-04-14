import { Form, Button, Row, Col, Container, Card } from "react-bootstrap"
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import AlergenService from "../../service/alergeni/AlergenService";
import { useEffect, useState } from "react";

export default function AlergenPromjena(){

    const navigate = useNavigate()
    const params = useParams()
    const [alergen,setAlergen] = useState({})


    async function ucitajAlergen() {
        await AlergenService.getBySifra(params.sifra).then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            const s = odgovor.data
            // po potrebi prilagođavam podatke
            
            s.datumPokretanja = s.datumPokretanja.substring(0,10)
            
            setAlergen(s)

            
        })
    }

    useEffect(()=>{
        ucitajAlergen()
    },[])

    async function promjeni(alergen){
        //console.table(alergen) // ovo je za kontrolu da li je sve OK
        await AlergenService.promjeni(params.sifra,alergen).then(()=>{
            navigate(RouteNames.ALERGENI)
        })
    }


    function odradiSubmit(e){ //e je event
        e.preventDefault() // nemoj odraditi submit
        const podaci = new FormData(e.target)
        promjeni({
            naziv: podaci.get('naziv'),
            opis: podaci.get('opis')
        })

        
        
      

         
        

       
    }

    return(
        <>
            <h3>Promjena alergena</h3>
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
                                            defaultValue={alergen.naziv}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="opis" className="mb-3">
                                        <Form.Label className="fw-bold">Opis</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="opis"
                                            placeholder="Unesite opis alergena"
                                            defaultValue={alergen.opis}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                          
                               

                      
                                
                            <hr style={{marginTop: '50px', border: '0' }} />

                            {/* Gumbi za akciju - RWD pozicioniranje */}
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <Link to={RouteNames.ALERGENI} className="btn btn-danger px-4">
                                    Odustani
                                </Link>
                                <Button type="submit" variant="success">
                                    Promjeni alergen
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>


            </Form>
        </>
    )
}