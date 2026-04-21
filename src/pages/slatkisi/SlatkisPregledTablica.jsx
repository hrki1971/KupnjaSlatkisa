import { Button, Table } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import { GrValidate } from "react-icons/gr";
import FormatDatuma from "../../components/FormatDatuma";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { useState } from "react";

export default function SlatkisPregledTablica({ slatkisi, navigate, brisanje, generirajPDF, kategorije }) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = null;
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey || sortConfig.direction === null) {
            return <FaSort />;
        }
        return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
    };

        const sortedSlatkisi = () => {
        if (!slatkisi || sortConfig.direction === null) {
            return slatkisi;
        }

        const sorted = [...slatkisi].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // Obrada null/undefined vrijednosti
            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            // Sortiranje prema tipu podatka: Date
            if (sortConfig.key === 'datumPokretanja') {
                const dateA = new Date(aValue);
                const dateB = new Date(bValue);
                return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
            }

            // Sortiranje prema tipu podatka: boolean
            if (sortConfig.key === 'aktivan') {
                const valA = aValue ? 1 : 0;
                const valB = bValue ? 1 : 0;
                return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
            }

            // Sortiranje prema tipu podatka: string
            if (typeof aValue === 'string') {
                // localeCompare s 'hr' parametrom rješava čšćđž ČŠĆĐŽ
                const result = aValue.localeCompare(bValue, 'hr', { sensitivity: 'accent' });
                return sortConfig.direction === 'asc' ? result : -result;
            }

            // Za brojeve (cijena, trajanje)
            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return sorted;
    };

    const dohvatiNazivKategorije = (sifraKategorije) => {
        if (!kategorije) return sifraKategorije;
        const kat = kategorije.find(k => k.sifra === sifraKategorije);
        return kat ? kat.naziv : sifraKategorije;
    };

    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th onClick={() => handleSort('naziv')} style={{ cursor: 'pointer' }}>
                        Naziv {getSortIcon('naziv')}
                    </th>
                    <th onClick={() => handleSort('kategorija')} style={{ cursor: 'pointer' }}>
                         Kategorija {getSortIcon('kategorija')}
                    </th>
                    <th onClick={() => handleSort('alergeni')} style={{ cursor: 'pointer' }}>
                        Alergeni {getSortIcon('alergeni')}
                    </th>
                  
                   
                    <th>Akcija</th>
                </tr>
            </thead>
            <tbody>
                {sortedSlatkisi() && sortedSlatkisi().map((slatkis) => (
                    <tr key={slatkis.sifra}>
                        <td className="lead">{slatkis.naziv}</td>
                        <td className='text-end'>{dohvatiNazivKategorije(slatkis.kategorija)}</td>
                        <td className='text-end'>
                          
                            {slatkis.alergeni ? slatkis.alergeni.length : 0}
                        </td>
                       
                        <td>
                            <Button variant="info" onClick={() => generirajPDF(slatkis)} title="PDF">
                                 PDF
                            </Button>
                            &nbsp;&nbsp;
                            <Button onClick={() => navigate(`/slatkisi/${slatkis.sifra}`)} title="Promjeni">
                                 <FaEdit />
                            </Button>
                            &nbsp;&nbsp;
                            <Button variant="danger" onClick={() => brisanje(slatkis.sifra)} title="Obriši">
                                 <FaTrash />
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}