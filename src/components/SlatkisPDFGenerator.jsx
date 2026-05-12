import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

export default function SlatkisPDFGenerator({ slatkis, kategorija, alergeni }) {

    const fetchFontAsBase64 = async (url) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Font nije pronađen: ${url}`);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(blob);
        });
    };

    const generirajPDF = async () => {
        const [regBase64, boldBase64] = await Promise.all([
            fetchFontAsBase64('/fonts/Roboto-Regular.ttf'),
            fetchFontAsBase64('/fonts/Roboto-Bold.ttf')
        ]);

        const doc = new jsPDF();

        // 2. Registracija REGULAR verzije
        doc.addFileToVFS('Roboto-Regular.ttf', regBase64);
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');

        // 3. Registracija BOLD verzije
        // Ključno: isto ime 'Roboto', ali stil 'bold'
        doc.addFileToVFS('Roboto-Bold.ttf', boldBase64);
        doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');

        // 4. Postavi defaultni font
        doc.setFont('Roboto', 'normal');
        // Dodaj logo - konvertiraj SVG u tekst (jednostavna verzija)
        doc.setFontSize(20);
        doc.setTextColor(46, 125, 50); // Zelena boja iz loga
        doc.text('SLATKIŠI', 20, 20);

        doc.setFontSize(10);
        doc.setTextColor(102, 102, 102);
        doc.text('EVIDENCIJA SLATKIŠA, KATEGORIJA I ALERGENA', 20, 27);

        // Naslov dokumenta
        doc.setFont('Roboto', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('POPIS SLATKIŠA', 20, 45);

        // Linija ispod naslova
        doc.setDrawColor(46, 125, 50);
        doc.setLineWidth(0.5);
        doc.line(20, 48, 190, 48);

        let yPosition = 60;

        // Podaci o slatkisu
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Podaci o slatkišu:', 20, yPosition);
        yPosition += 10;

        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.text(`Naziv: ${slatkis.naziv}`, 25, yPosition);
        yPosition += 7;
        doc.text(`Kategorija: ${kategorija}`, 25, yPosition);
        yPosition += 7;
        doc.text(`Alergeni: ${alergeni ? alergeni.length : 0}`, 25, yPosition);
        yPosition += 15;

        // Podaci o kategoriji
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Podaci o kategoriji:', 20, yPosition);
        yPosition += 10;

        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.text(`Naziv: ${kategorija}`, 25, yPosition);
        yPosition += 7;
        doc.text(`Kategorija: ${kategorija}`, 25, yPosition);
        yPosition += 7;
        doc.text(`Alergeni: ${alergeni ? alergeni.length : 0}`, 25, yPosition);
        yPosition += 7;
        
        doc.text(`Aktivan: ${slatkis.aktivan ? 'Da' : 'Ne'}`, 25, yPosition);
        yPosition += 15;

        // Popis kategorija
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Popis kategorija:', 20, yPosition);
        yPosition += 10;

        if (alergeni  && alergeni.length > 0) {
            // Tablica s polaznicima
            const tableData = alergeni.map(alergen => [
                alergen.naziv,
                alergen.opis
            ]);
                

            autoTable(doc,{
                startY: yPosition,
                head: [['Naziv', 'Opis']],
                body: tableData,
               // 1. Postavi ukupnu širinu tablice na širinu dostupnog prostora (npr. 180mm)
    tableWidth: 'auto', 
    
    // 2. Margine (lijevo, desno) - osiguraj da ima mjesta
    margin: { left: 15, right: 15 },

    styles: { 
        font: 'Roboto', 
        fontStyle: 'normal',
        fontSize: 10, // Smanji malo font ako i dalje ne stane (default je 12)
        overflow: 'linebreak' // Prebaci dugački tekst u novi red
    },
    
    headStyles: { 
        font: 'Roboto', 
        fontStyle: 'bold',
        fillColor: [46, 125, 50] 
    },

    // 3. Ručno podešavanje širine stupaca (ukupno cca 180mm za A4)
    columnStyles: {
        0: { cellWidth: 35 }, // Naziv
        1: { cellWidth: 35 }, // Opis
    }
            });
        } else {
            doc.setFontSize(11);
            doc.setFont(undefined, 'italic');
            doc.text('Nema alergena u ovoj kategoriji.', 25, yPosition);
        }

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text(
                `Stranica ${i} od ${pageCount}`,
                doc.internal.pageSize.getWidth() / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
            doc.text(
                `Generirano: ${new Date().toLocaleString('hr-HR')}`,
                20,
                doc.internal.pageSize.getHeight() - 10
            );
        }

        // Otvori PDF u novom prozoru
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
    };

    return generirajPDF;
}
