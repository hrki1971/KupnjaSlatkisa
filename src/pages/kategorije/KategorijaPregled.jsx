import { useEffect, useState } from "react"
import KategorijeServis from "../../service/kategorije/KategorijaService"
import { Table } from "react-bootstrap"


export default function KategorijaPregled(){

    const [kategorije,setKategorije]=useState([])

    useEffect(()=>{
        ucitajKategorije()

    },[])
    async function ucitajKategorije(){
        await KategorijeServis.get().then((odgovor)=>{
            setKategorije(odgovor.data)
        })
    }
    return(
        <>
       <Table>
        <thead>
            <tr>
                <th>Naziv</th>
                <th>Opis</th>
                <th>Akcija</th>
            </tr>
        </thead>
        <tbody>
            {kategorije && kategorije.map((kategorija)=>(
                <tr>
                    <td>{kategorija.naziv}</td>
                    <td>{kategorija.opis}</td>
                    <td></td>
                    
                    
                    

                    
                </tr>
            ))}
        </tbody>
       </Table>
   
        </>
    )
}