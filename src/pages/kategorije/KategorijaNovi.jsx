import { Button, Card, CardBody, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import KategorijaService from "../../service/kategorije/KategorijaService";
import { useEffect, useState } from "react";
import {SlatkisiSrvice} from "../service/slatkisi/SlatkisiService";
import AlergenService from "../service/alergeni/AlergeniService";

export default function KategorijaNovi() {
    const navigate = useNavigate()
    const [slatkisi,setSlatkisi] = useState([])
    const [alergeni,setAlergeni] = useState([])
    const [odabraniAlergeni,setOdabraniAlergeni] = useState([])
    const [odabraniSlatkisi,setOdabraniSlatkisi] = useState([])
    const [prikaziAutoComplete, setPrikaziAutoComplete] = useState(false)
    const [odabraniIndex, setOdabraniIndeks] = useState(-1)

    useEffect(() => {
        ucitajSlatkise()
        ucitajAlergene()
    },[])

     async function ucitajSlatkise() {
        await SlatkisiService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis za slatkise')
                return
            }
            setSlatkisi(odgovor.data)
        })
    }
    async function ucitajAlergene() {
        await AlergenService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis za alergene')
                return
            }
            setAlergeni(odgovor.data)
        })
    }

    function dodajAlergen(alergen) {
        if (!odabraniAlergeni.find(a => a.sifra === alergen.sifra)) {
            setOdabraniAlergeni([...odabraniAlergeni, alergen])
        }
        setPretragaPolaznika('')
        setPrikaziAutoComplete(false)
        setOdabraniIndex(-1)
    }

    function ukloniAlergen(sifra) {
        setOdabraniAlergeni(odabraniAlergeni.filter(a => a.sifra !== sifra))
    }

    function filtrirajAlergene() {
        if (!pretragaPolaznika) return []
        return alergeni.filter(a =>
            !odabraniAlergeni.find(op    => op.sifra === a.sifra) &&
            a.naziv.toLowerCase().includes(pretragaAlergena.toLowerCase())
        )
        
    }

    function handleKeyDown(e) {
        const filtriraniAlergeni = filtrirajAlergene()

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOdabraniIndex(prev =>
                prev < filtriraniAlergeni.length - 1 ? prev + 1 : prev
            )
            } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setOdabraniIndex(prev => prev > 0 ? prev - 1 : 0)
        } else if (e.key === 'Enter' && odabraniIndex >= 0 && filtriraniAlergeni.length > 0) {
            e.preventDefault()
            dodajAlergen(filtriraniAlergeni[odabraniIndex])
        } else if (e.key === 'Escape') {
            setPrikaziAutoComplete(false)
            setOdabraniIndex    (-1)
        }
    } 


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
        <Row>
                        {/* Lijeva strana - Podaci o kategoriji */}
                        <Col md={6}>
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title className="mb-4">Podaci o kategoriji</Card.Title>

                                    {/* Naziv */}
                                    <Form.Group controlId="naziv" className="mb-3">
                                        <Form.Label className="fw-bold">Naziv</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="naziv"
                                            placeholder="Unesite naziv kategorije"
                                            required
                                        />
                                    </Form.Group>

                                    {/* Slatkis */}
                                    <Form.Group controlId="slatkis" className="mb-3">
                                        <Form.Label className="fw-bold">Slatkis</Form.Label>
                                        <Form.Select name="slatkis" required>
                                            <option value="">Odaberite slatkis</option>
                                            {slatkisi && slatkisi.map((slatkis) => (
                                                <option key={slatkis.sifra} value={slatkis.sifra}>
                                                    {slatkis.naziv}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Desna strana - Alergeni */}
                        <Col md={6}>
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title className="mb-4">Alergeni</Card.Title>

                                    {/* Autocomplete pretraga */}
                                    <Form.Group className="mb-3 position-relative">
                                        <Form.Label className="fw-bold">Dodaj alergen</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Pretraži alergen..."
                                            value={pretragaAlergena}
                                            onChange={(e) => {
                                                setPretragaAlergena(e.target.value)
                                                setPrikaziAutocomplete(e.target.value.length > 0)
                                                setOdabraniIndex(-1)
                                            }}
                                            onFocus={() => setPrikaziAutocomplete(pretragaAlergena.length > 0)}
                                            onKeyDown={handleKeyDown}
                                        />
                                        {prikaziAutocomplete && filtrirajAlergene().length > 0 && (
                                            <div className="position-absolute w-100 bg-white border rounded shadow-sm" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                                                {filtrirajAlergene().map((alergen, index) => (
                                                    <div
                                                        key={alergen.sifra}
                                                        className="p-2 cursor-pointer"
                                                        style={{
                                                            cursor: 'pointer',
                                                            backgroundColor: index === odabraniIndex ? '#007bff' : 'white',
                                                            color: index === odabraniIndex ? 'white' : 'black'
                                                        }}
                                                        onClick={() => dodajAlergen(alergen)}
                                                        onMouseEnter={(e) => {
                                                            setOdabraniIndex(index)
                                                        }}
                                                    >
                                                        {alergen.naziv}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </Form.Group>

                                    {/* Tablica odabranih alergena */}
                                    {odabraniAlergeni.length > 0 && (
                                        <div style={{overflow: 'auto', maxHeight: '300px'}}>
                                            <Table striped bordered hover size="sm">
                                                <thead>
                                                    <tr>
                                                        <th>Naziv</th>
                                                        <th style={{ width: '80px' }}>Akcija</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {odabraniAlergeni.map(alergen => (
                                                        <tr key={alergen.sifra}>
                                                            <td>{alergen.naziv}</td>
                                                            <td>
                                                                <Button
                                                                    variant="danger"
                                                                    size="sm"
                                                                    onClick={() => ukloniAlergen(alergen.sifra)}
                                                                >
                                                                    Obriši
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>

                                    )}
                                    {odabraniAlergeni.length === 0 && (
                                        <p className="text-muted">Nema odabranih alergena</p>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <hr className="my-4" />

                    {/* Gumbi za akciju */}
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <Link to={RouteNames.KATEGORIJE} className="btn btn-danger px-4">
                            Odustani
                        </Link>
                        <Button type="submit" variant="success">
                            Dodaj novu kategoriju
                        </Button>
                    </div>
                </Container>
            </Form>
        </>
    )
}

            
        
        
        <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4">Podaci o novoj kategoriji</Card.Title>
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
