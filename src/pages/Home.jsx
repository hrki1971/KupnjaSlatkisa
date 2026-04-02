import { IME_APLIKACIJE } from "../constants";
import slika from '../assets/slika.jpg';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Home(){
    return(
    <>
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
     
    
    </>
    )
}