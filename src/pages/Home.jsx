import { IME_APLIKACIJE } from "../constants";
import slika from '../assets/slika.jpg';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Card, Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import KategorijaService from "../service/kategorije/KategorijaService";
import SlatkisiService from "../service/slatkisi/SlatkisiService";

export default function Home(){
    const [brojKategorija, setBrojKategorija] = useState(0);
    const [brojSlatkisa, setBrojSlatkisa] = useState(0);
    const [animatedKategorije, setAnimatedKategorije] = useState(0);
    const [animatedSlatkisi, setAnimatedSlatkisi] = useState(0);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const kategorijeRezultat = await KategorijaService.get();
                const slatkisi = await SlatkisiService.get();

                setBrojKategorija(kategorijeRezultat.data.length);
                setBrojSlatkisa(slatkisi.data.length);
            } catch (error) {
                console.error("Greška pri dohvaćanju podataka:", error);    
            }
        };
        fetchData();
    },[]);

    useEffect(() => {
        if(animatedKategorije < brojKategorija) {
            const timer = setTimeout(() => {
                setAnimatedKategorije(prev => Math.min(prev + 1, brojKategorija));
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [animatedKategorije, brojKategorija]);

    useEffect(() => {
        if(animatedSlatkisi < brojSlatkisa) {
            const timer = setTimeout(() => {
                setAnimatedSlatkisi(prev => Math.min(prev + 1, brojSlatkisa));
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [animatedSlatkisi, brojSlatkisa]);

    return(
    <>
    <Row>
    <Col md={6}>
    <div style={{ textAlign:'center', marginTop:'4 rem'}}>
        <img src={slika} alt="slika" />


   </div>
    
        
    
    <p className="lead m-5 text-center">Dobrodošli na {IME_APLIKACIJE}</p>
    <div style={{maxWidth: '300px', margin: 'auto' }}>
        <DotLottieReact 
        src="Shapes.lottie"

        loop autoplay
        />
        
    </div>
    </Col> 
    <Col className="d-flex align-items-center justify-content-center">
        <div style={{width: '100%', maxWidth: '400px'}}>
            <Card className="mb-3 shadow-lg border-0 statistikaPanel">
                <Card.Body className="text-center">
                    <p className="text-white">Kategorije</p>
                    <div className="statistikaText">
                        {animatedKategorije}
                    </div>
                </Card.Body>

            </Card>
            <Card className="mb-3 shadow-lg border-0 statistikaPanel">
                <Card.Body className="text-center">
                    <p className="text-white">Slatkiši</p>
                    <div className="statistikaText">
                        {animatedSlatkisi}
                    </div>
                </Card.Body>
            </Card>



        </div>
    
    
    
    
    
    
    
    
    
    </Col>
</Row>
     
    
    </>
    )
}