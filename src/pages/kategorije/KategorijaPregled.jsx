import { useEffect, useState } from "react"
import { Button, Table } from "react-bootstrap"
import { NumericFormat } from "react-number-format"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import KategorijaService from "../../service/kategorije/KategorijaService"
import SlatkisiService from "../../service/slatkisi/SlatkisiService"
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa"
import { kategorije } from "../../service/kategorije/KategorijaPodaci"



export default function KategorijaPregled() {

    const navigate = useNavigate()
    const [kategorije, setKategorije] = useState([])
    const [slatkisi, setSlatkisi] = useState([])
    const[sortConfig, setSortConfig] = useState({ key: null, direction: null})

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }else if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = null;
        }
        setSortConfig({key,direction})
    };

    const getSortIcon = (columnKey) => {
      if(sortConfig.key !==columnKey || sortConfig.direction === null) {
        return<FaSort />;
        }    
      
      return  sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
    };

    const sortedKategorije = () => {
        if (!kategorije || sortConfig.direction === null) {
            return kategorije;
        }
        const sorted = [...kategorije].sort((a, b)=> {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            //Obrada null/undefined vrijednosti
            if(aValue === null || aValue === undefined)return 1;
            if(bValue === null || bValue === undefined)return -1;

          

            //Sortiranje prema tipu podatka: string
             if (typeof aValue === 'string') {
                // localeCompare s 'hr' parametrom rješava čšćđž ČŠĆĐŽ
                const result = aValue.localeCompare(bValue, 'hr', { sensitivity: 'accent' });
                return sortConfig.direction === 'asc' ? result : -result;
            }



            //Za brojeve (cijena,trajanje)
                if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
            return sorted;

    }

    useEffect(() => {
        async function inicijaliziraj() {
            const podaciSlatkisi = await SlatkisiService.get(); 
            await ucitajKategorije(podaciSlatkisi.data);    
        }
        inicijaliziraj();
        
    }, [])


    async function ucitajKategorije(podaciSlatkisi) {
        
       const odgovor = await KategorijaService.get()

        if(!odgovor.success){
            alert('Nije implementiran servis')
        }
        const kt = odgovor.data

        for(let i=0;i<kt.length;i++){
            kt[i].brojSlatkisa = await dohvatiBrojSlatkisa(podaciSlatkisi,kt[i].sifra)
        }
            
        setKategorije(kt)
       
    }

    async function dohvatiBrojSlatkisa(podaciSlatkisi,sifraKategorija){
        let brojac = 0
        podaciSlatkisi.map((e)=>{
            //console.log(e)
            if(e.kategorija ==sifraKategorija){
                brojac++
            }
        })
        return brojac
    }


    async function obrisi(sifra) {
      // debugger
      
        
      
        if(!confirm('Sigurno obrisati')){
            return
        }
        await KategorijaService.obrisi(sifra)
        ucitajKategorije()
    }


    return (
        <>
            <Link to={RouteNames.KATEGORIJE_NOVI}
            className="btn btn-success w-100 mb-3 mt-3"> 
                Dodaj novu kategoriju
            </Link>
            <Table striped border hover>
                <thead>
                    <tr>
                        <th onClick={()=> handleSort('naziv')} style={{cursor: 'pointer'}}
                         >Naziv {getSortIcon('naziv')}</th>
                        <th onClick={()=> handleSort('opis')} style={{cursor: 'pointer'}}
                            >Opis{getSortIcon('opis')}</th>
                        <th onClick={()=> handleSort('brojSlatkisa')} style={{cursor: 'pointer'}}
                            >Slatkiša u kategoriji{getSortIcon('brojSlatkisa')}</th>
                        <th>Akcija</th>
                            
                        
                    </tr>
                </thead>
                <tbody>
                    {sortedKategorije() && sortedKategorije().map((kategorija) => (
                        <tr key={kategorija.sifra}>
                            <td className="lead">{kategorija.naziv}</td>
                            <td className="lead">{kategorija.opis}</td>
                            <td>
                               {kategorija.brojSlatkisa}
                            </td>
                            
                            

                            
                            <td>
                                <Button onClick={()=>{navigate(`/kategorije/${kategorija.sifra}`)}}>
                                    Promjena
                                </Button>
                                &nbsp;&nbsp;
                                <Button variant="danger" onClick={()=>{obrisi(kategorija.sifra)}}>
                                    Obriši
                                </Button>
                            </td>





                        </tr>
                    ))}
                </tbody>
            </Table>

        </>
    )
}