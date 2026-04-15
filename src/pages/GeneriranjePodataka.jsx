import { useState } from 'react';
import { Button, Form, Alert, Container, Row, Col } from 'react-bootstrap';
import { Faker, hr } from '@faker-js/faker';
import KategorijaService from '../service/kategorije/KategorijaService';
import SlatkisiService from '../service/slatkisi/SlatkisiService';
import AlergenService from '../service/alergeni/AlergenService';



export default function GeneriranjePodataka() {
    const [brojKategorija, setBrojKategorija] = useState(5);
    const [brojSlatkisa, setBrojSlatkisa] = useState(20);
    const [brojAlergena, setBrojAlergena] = useState(10);
    
    const [poruka, setPoruka] = useState(null);
    const [loading, setLoading] = useState(false);

    // Postavi faker na hrvatski jezik
    const faker = new Faker({
        locale: [hr]
    });

    const generirajKategorije = async (broj) => {
        const naziviKategorija = [
            'Bomboni',
            'Lizalica',
            'Čokolada',
            'Fotografija'
            
        ];

        for (let i = 0; i < broj; i++) {
            await KategorijaService.dodaj({
                naziv: naziviKategorija[i % naziviKategorija.length] + (i >= naziviKategorija.length ? ` ${Math.floor(i / naziviKategorija.length) + 1}` : ''),
                opis: faker.person.lastName() + ' slatkiš',
                cijena: faker.number.float({ min: 1100, max: 5000, precision: 0.01 }).toFixed(2)
                
                
            });
        }
    };

    const generirajSlatkise = async (broj) => {

        const rezultatKategorije = await KategorijaService.get();
        const kategorije = rezultatKategorije.data;

        if(kategorije.length === 0) {
            throw new Error('Nema dostupnih kategorija.Prvo generirajte kategorije.');
        }
        for (let i = 0; i < broj; i++) {
            const randomKategorija = kategorije[faker.number.int({min: 0,max:kategorije.length -1})]; 

            const slatkisi = {
                naziv:faker.person.firstName() + ' candy',
                kategorija:randomKategorija.sifra
            };

               await SlatkisiService.dodaj(slatkisi); 
            
            }
            
        
    };

    const generirajAlergene = async (broj) => {

        const rezultatSlatkise = await SlatkisiService.get();
        const slatkisi = rezultatSlatkise.data;

        if(slatkisi.length === 0) {
            throw new Error('Nema dostupnih slatkisa.Prvo generirajte slatkise.');

    }
    for (let i = 0; i < broj; i++) {
        const randomSlatkisi = slatkisi[faker.number.int({min: 0,max:slatkisi.length -1})]
        // Generiraj alergene
        const alergen = {
            naziv: faker.food.ingredient() + ' alergen',
            slatkis: randomSlatkisi.sifra
        };
        await SlatkisiService.dodajAlergen(alergen);
    }

    const handleGenerirajKategorije = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPoruka(null);

        try {
            await generirajKategorije(brojKategorija);

            setPoruka({
                tip: 'success',
                tekst: `Uspješno generirano ${brojKategorija} kategorija!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri generiranju kategorija: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGenerirajSlatkise = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPoruka(null);

        try {
            
            await generirajSlatkise(brojSlatkisa);

            setPoruka({
                tip: 'success',
                tekst: `Uspješno generirano ${brojSlatkisa} slatkisa!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri generiranju slatkisa: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleObrisiSlatkise = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati sve slatkise?')) {
            return;
        }

        setLoading(true);
        setPoruka(null);

        try {
            const rezultat = await SlatkisiService.get();
            const slatkisi = rezultat.data;
            
            for (const slatkis of slatkisi) {
                await SlatkisiService.obrisi(slatkis.sifra);
            }

            setPoruka({
                tip: 'success',
                tekst: `Uspješno obrisano ${slatkisi.length} slatkisa!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri brisanju slatkisa: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleObrisiKategorije = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati sve kategorije?')) {
            return;
        }

        setLoading(true);
        setPoruka(null);

        try {
            const rezultat = await KategorijaService.get();
            const kategorije = rezultat.data;
            
            for (const kategorija of kategorije) {
                await KategorijaService.obrisi(kategorija.sifra);
            }

            setPoruka({
                tip: 'success',
                tekst: `Uspješno obrisano ${kategorije.length} kategorija!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri brisanju kategorija: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

   

    return (
        <Container className="mt-4">
            <h1>Generiranje podataka</h1>
            <p className="text-muted">
                Koristite ovaj alat za generiranje testnih podataka s lažnim (fake) podacima na hrvatskom jeziku.
            </p>

            {poruka && (
                <Alert variant={poruka.tip} dismissible onClose={() => setPoruka(null)}>
                    {poruka.tekst}
                </Alert>
            )}

            <Row>
                <Col md={4}>
                    <Form onSubmit={handleGenerirajKategorije}>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj kategorija</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="50"
                                value={brojKategorija}
                                onChange={(e) => setBrojKategorija(parseInt(e.target.value))}
                                disabled={loading}
                            />
                            <Form.Text className="text-muted">
                                Unesite broj kategorija (1-50)
                            </Form.Text>
                        </Form.Group>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            disabled={loading}
                            className="w-100"
                        >
                            {loading ? 'Generiranje...' : 'Generiraj kategorije'}
                        </Button>
                    </Form>
                </Col>
                <Col md={4}>
                    <Form onSubmit={handleGenerirajSlatkise}>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj slatkisa</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="200"
                                value={brojSlatkisa}
                                onChange={(e) => setBrojSlatkisa(parseInt(e.target.value))}
                                disabled={loading}
                            />
                            <Form.Text className="text-muted">
                                Unesite broj slatkisa (1-200)
                            </Form.Text>
                        </Form.Group>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            disabled={loading}
                            className="w-100"
                        >
                            {loading ? 'Generiranje...' : 'Generiraj slatkise'}
                        </Button>
                    </Form>
                </Col>
                
            </Row>

            <Alert variant="warning" className="mt-3">
                <strong>Upozorenje:</strong> Ove akcije će dodati nove podatke u postojeće. 
                Ako želite početi ispočetka, prvo obrišite postojeće podatke.
            </Alert>

            <hr className="my-4" />

            <h3>Brisanje podataka</h3>
            <p className="text-muted">
                Koristite ove opcije za brisanje svih podataka iz baze.
            </p>

            <Row className="mt-3">
                <Col md={4}>
                    <Button 
                        variant="danger" 
                        onClick={handleObrisiKategorije}
                        disabled={loading}
                        className="w-100 mb-2"
                    >
                        {loading ? 'Brisanje...' : 'Obriši sve kategorije'}
                    </Button>
                </Col>
                <Col md={4}>
                    <Button 
                        variant="danger" 
                        onClick={handleObrisiSlatkise}
                        disabled={loading}
                        className="w-100 mb-2"
                    >
                        {loading ? 'Brisanje...' : 'Obriši sve slatkise'}
                    </Button>
                </Col>
                
            </Row>

            <Alert variant="danger" className="mt-3">
                <strong>Oprez!</strong> Brisanje podataka je trajna akcija i ne može se poništiti.
            </Alert>
        </Container>
    );
}
