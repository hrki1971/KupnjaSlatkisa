import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import KategorijaService from "../../service/kategorije/KategorijaService"
import { Button, Col, Form, Row, Container, Card, Table } from "react-bootstrap"
import { RouteNames } from "../../constants"
import SlatkisiService from "../../service/slatkisi/SlatkisiService"
import AlergenService from "../../service/alergeni/AlergenService"
import { slatkisi } from "../../service/slatkisi/SlatkisiPodaci"

export default function SlatkisPromjena(){

    const navigate = useNavigate()
    const params = useParams()
    const [slatkis, setSlatkis] = useState({})
    const [kategorije, setKategorije] = useState([])
    const [alergeni, setAlergeni] = useState([])
    const [odabraniAlergeni, setOdabraniAlergeni] = useState([])
    const [pretragaAlergena, setPretragaAlergena] = useState('')
    const [prikaziAutocomplete, setPrikaziAutocomplete] = useState(false)
    const [odabraniIndex, setOdabraniIndex] = useState(-1)

    useEffect(()=>{
        ucitajSlatkis()
        ucitajKategorije()
        ucitajAlergene()
    },[])

    useEffect(() => {
        if(slatkis.alergeni && alergeni.length > 0) {
            const odabrani = alergeni.filter(a => slatkis.alergeni.includes(a.sifra))
            setOdabraniAlergeni(odabrani)
        }
    }, [slatkis, alergeni])

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

    async function ucitajAlergene() {
        await AlergenService.get().then((odgovor) => {
            if(!odgovor.success) {
                alert('nije implementiran servis za alergene')
                return
            } 
            setAlergeni(odgovor.data)
        
        
        })
    }

    async function promjeni(slatkis) {
        await SlatkisiService.promjeni(params.sifra,slatkis).then(()=>{
            navigate(RouteNames.SLATKISI)
        })
    }

    function dodajAlergen(alergen) {
        if(!odabraniAlergeni.some(a => a.sifra === alergen.sifra)) {
            setOdabraniAlergeni([...odabraniAlergeni, alergen])
        }
        setPretragaAlergena('')
        setPrikaziAutocomplete(false)
        setOdabraniIndex(-1)
    }
    function ukloniAlergen(sifra) {
        setOdabraniAlergeni(odabraniAlergeni.filter(a => a.sifra !== sifra))

        
    }

    function filtrirajAlergene() {
        if(!pretragaAlergena) return []
        return alergeni.filter(a => !odabraniAlergeni.find(oa =>oa.sifra === a.sifra) && (a.naziv.toLowerCase()) || a.opis.toLowerCase().includes(pretragaAlergena.toLowerCase())) 
    
    }
    function handleKeyDown(e) {
        const filtriraniAlergeni = filtrirajAlergene()
        if(e.key === 'ArrowDown') {
            e.preventDefault()
            setOdabraniIndex(prev => 
                prev < filtriraniAlergeni.length - 1 ? prev + 1 : prev
            )
        }else if(e.key === 'ArrowUP') {
            e.preventDefault()
            setOdabraniIndex(prev => prev > 0 ? prev - 1 : 0)  
        }else if(e.key === 'Enter' && odabraniIndex >=0 && filtriraniAlergeni.length > 0) {
            e.preventDefault()
            dodajAlergen(filtriraniAlergeni[odabraniIndex])
        }else if(e.key === 'Escape') {
            setPrikaziAutocomplete(false)
            setOdabraniIndex(-1)
        }
    }

    async function promjeni(slatkis) {
        await SlatkisiService.promjeni(params.sifra,slatkis).then(() => {
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
            alert("Naziv slatkisa mora imati najmanje 3 znaka!");
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

        // --- KONTROLA 5: Alergeni (Validne vrijednosti) ---
        const odabraniAlergeniSifre = odabraniAlergeni.map(a => a.sifra)


        promjeni({
            naziv: podaci.get('naziv'),
            kategorija: odabranaKategorija,
            alergeni: odabraniAlergeni.map(a => a.sifra)
        })
    }

    return(
         <>
            <h3>Promjena slatkiša</h3>
            <Form onSubmit={odradiSubmit}>
                <Container className="mt-4">
                    <Row>
                        {/* Lijeva strana - Podaci o slatkisu */}
                        <Col md={6}>
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title className="mb-4">Podaci o slatkisu</Card.Title>

                                    {/* Naziv */}
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
                                     {/* Kategorija */}
                                    <Form.Group controlId="kategorija" className="mb-3">
                                        <Form.Label className="fw-bold">Kategorija</Form.Label>
                                        <Form.Select name="kategorija" required value={slatkis.kategorija || ''} onChange={(e) => setSlatkis({...slatkis, kategorija: parseInt(e.target.value)})}>
                                            <option value="">Odaberite kategoriju</option>
                                            {kategorije && kategorije.map((s) => (
                                                <option key={s.sifra} value={s.sifra}>
                                                    {s.naziv}
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
                                            <div className="position-absolute w-100 bg-white border rounded shadow-sm" style={{zIndex: 1000, maxHeight: '200px', overflowY: 'auto'}}>
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
                                                    <th style={{width: '80px'}}>Akcija</th>
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
                        <Link to={RouteNames.SLATKISI} className="btn btn-danger px-4">
                            Odustani
                        </Link>
                        <Button type="submit" variant="success">
                            Promjeni slatkis
                        </Button>
                    </div>
                </Container>
            </Form>
        </>
    )
}
                  
                                 
                                            
