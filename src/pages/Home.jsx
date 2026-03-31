import { IME_APLIKACIJE } from "../constants";
import slika from '../assets/slika.jpg';

export default function Home(){
    return(
    <>
    <div style={{ textAlign:'center'}}>
        <img src={slika} alt="slika" />
    </div>
    
        
    
    <p className="lead m-5 text-center">Dobrodošli na {IME_APLIKACIJE}</p>
    <div style={{maxWidth: '300px', margin: 'auto' }}>
        
    </div>
     
    
    </>
    )
}