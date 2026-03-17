import { useEffect, useState } from "react"
import KategorijeServis from "../../service/kategorije/KategorijeService"

export default function KategorijaPregled(){

    const [kategorije,setKategorije]=useState([])

    useEffect(()=>{
        ucitajKategorije()

    },[])
    async function ucitajKategorije(){
        await <KategorijeServis.get().then((odgovor)=>{
            setKategorije(odgovor.data)
        })
    }
    return(
        <>
        <ul>
            {kategorije && kategorije.map((kategorija)=>(
                <li>{kategorija.naziv}</li>
            ))}
        </ul>
        Ovdje će se vidjeti kategorije
        </>
    )
}