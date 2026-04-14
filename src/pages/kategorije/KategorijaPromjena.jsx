import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import KategorijaService from "../../service/kategorije/KategorijaService";
import { useState } from "react";
import { useEffect } from "react";
import {SlatkisiService} from "../../service/slatkisi/SlatkisiService";

export default function KategorijaPromjena() {
    const navigate = useNavigate()
    const params = useParams()
    const [kategorija, setKategorija] = useState({})
    const [slatkisi, setSlatkisi] = useState([])
    const [alergeni,setAlergeni] = useState([])
    const [odabraniSlatkisi, setOdabraniSlatkisi] = useState([])
    const [pretragaSlatkisi, setPretragaSlatkisa] = useState('')
    const [prikaziAutocomplete, setPrikaziAutocomplete] = useState(false)
    const [odabraniInsex, setOdabraniIndex] = useState(-1)

    useEffect(()=>{
        ucitajKategorija()
        ucitajSlatkise()
        ucitajAlergene()
    },[])

    useEffect(() => {
        if(kategorija.slatkisi && slatkisi.length > 0) {
            const odabrani = slatkisi.filter(p => kategorija.slatkisi.includes(p.sifra))
        }
        
    },[kategorija, slatkisi])

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


async function ucitajKategorije() {
        await KategorijaService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis za kategorije')
                return
            }
            setKategorije(odgovor.data)
        })
    }


    async function ucitajAlergente() {
        await AlergenService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis za alergene')
                return
            }
            setAlergeni(odgovor.data)
        })
    }

function dodajSlatkisi(slatkisi) {
        if (!odabraniSlatkisi.find(p => p.sifra === slatkisi.sifra)) {
            setOdabraniSlatkisi([...odabraniSlatkisi, slatkisi])
        }
        setPretragaSlatkisi('')
        setPrikaziAutocomplete(false)
        setOdabraniIndex(-1)
    }

    function ukloniSlatkisi(sifra) {
        setOdabraniSlatkisi(odabraniSlatkisi.filter(p => p.sifra !== sifra))
    }

    function filtrirajSlatkise() {
        if (!pretragaSlatkisi) return []
        return slatkisi.filter(p => 
            !odabraniSlatkisi.find(op => op.sifra === p.sifra) &&
            (p.ime.toLowerCase().includes(pretragaSlatkisi.toLowerCase()) ||
             p.prezime.toLowerCase().includes(pretragaSlatkisi.toLowerCase()))
        )
    }

     function handleKeyDown(e) {
        const filtriraniSlatkisi = filtrirajSlatkise()
        
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOdabraniIndex(prev => 
                prev < filtriraniSlatkisi.length - 1 ? prev + 1 : prev
            )
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setOdabraniIndex(prev => prev > 0 ? prev - 1 : 0)
        } else if (e.key === 'Enter' && odabraniIndex >= 0 && filtriraniSlatkisi.length > 0) {
            e.preventDefault()
            dodajSlatkisi(filtriraniSlatkisi[odabraniIndex])
        } else if (e.key === 'Escape') {
            setPrikaziAutocomplete(false)
            setOdabraniIndex(-1)
        }
    }

    async function promjeni(kategorija) {
        await KategorijaService.promjeni(params.sifra, kategorija).then(() => {
            navigate(RouteNames.KATEGORIJE)
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
         // --- KONTROLA 3: Opis (Postojanje) ---
        if (!podaci.get('opis') || podaci.get('opis') === "") {
            alert("Morate odabrati opis!");
            return;
        }

        // --- KONTROLA 4: Opis  (Validna vrijednost) ---
        const odabraniOpis = parseInt(podaci.get('opis'));
        if (isNaN(odabraniOpis) || odabraniOpis <= 0) {
            alert("Odabrani opis nije valjan!");
            return;
        }

        
        promjeni({
            naziv: podaci.get('naziv'),
            opis: odabraniOpis,
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
