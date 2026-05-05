import { useEffect, useState } from "react"
import AlergenService from "../../service/alergeni/AlergenService"
import { Table, Button, InputGroup, Container, Row, Pagination, Form, Col, Card } from "react-bootstrap"


import { Link, useNavigate } from "react-router-dom"
import { IME_APLIKACIJE, RouteNames } from "../../constants"
import { FaEdit, FaSearch, FaTrash } from "react-icons/fa"

export default function AlergenPregled() {

    const navigate = useNavigate()

    const [alergeni, setAlergeni] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [totalItems, setTotalItems] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const pageSize = 8

    useEffect(()=>{document.title = 'Alergeni,' + IME_APLIKACIJE})


    useEffect(() => {
        ucitajAlergene(currentPage, searchTerm)
    }, [currentPage, searchTerm])

    async function ucitajAlergene(page, search) {
        await AlergenService.getPage(page, pageSize, search).then((odgovor) => {
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            setAlergeni(odgovor.data)
            setTotalPages(odgovor.totalPages)
            setTotalItems(odgovor.totalItems)
        })
    }

    async function obrisi(sifra) {
        if(!confirm('Sigurno obrisati')){
            return
        }
        await AlergenService.obrisi(sifra)
        ucitajAlergene()

        const newTotalItems = totalItems -1;
        const newTotalPages = Math.ceil(newTotalItems / pageSize);

        if(currentPage > newTotalItems && newTotalPages > 0) {
            setCurrentPage(newTotalPages);

        }else{
            ucitajAlergene(currentPage, searchTerm);

        }
    }

    function handlePageChange(page) {
        setCurrentPage(page)
    }


    function handleSearchChange(e) {
        setSearchTerm(e.target.value)
        setCurrentPage(1)
    }


    return (
        <>
            <Link to={RouteNames.ALERGENI_NOVI} 
            className="btn btn-success w-100 mb-3 mt-3">{/* Search input */}
                Dodavanje novog alergena
            </Link>

            {/* Search input */}
            <InputGroup className="mb-3">
                <InputGroup.Text>
                    <FaSearch />
                </InputGroup.Text>
                <Form.Control 
                type="text"
                placeholder="Pretraga..."
                value={searchTerm}
                onChange={handleSearchChange}
                />
            </InputGroup>

            <Container className="py-3 px-0">
                <Row>
                    {alergeni && alergeni.map((alergen) => (
                        <Col key={alergen.sifra} xs={12} sm={6} lg={4} xl={3}  className="mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>{alergen.naziv}</Card.Title>
                                    <Card.Text>{alergen.opis}</Card.Text>
                                    <div className="mt-auto d-flex gap-2">
                                        <Button 
                                        variant="outline-primary"
                                        className="flex-fill"
                                        onClick={()=>navigate(`/alergeni/${alergen.sifra}`)}
                                        title="Promjeni"
                                    >
                                    <FaEdit />
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        onClick={()=> obrisi(alergen.sifra)}
                                        title="Obriši"
                                        >
                                            <FaTrash />
                                        </Button>
                                </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            {/*Pagination komponeneata*/}
            {totalPages > 1 && (
                
                <div className="d-flex justify-content-center">
                    <Pagination>
                        <Pagination.First 
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        />

                        {[...Array(totalPages)].map((_, index) => {
                            const pageNumber = index + 1;
                            //Prikažinsamo stranice blizu trenutne stranice
                            if (
                                pageNumber === 1 ||
                                pageNumber === totalPages ||
                                (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                            ){
                                return (
                                    <Pagination.Item
                                        key={pageNumber}
                                        active={pageNumber === currentPage}
                                        onClick={()=> handlePageChange(pageNumber)}
                                    >
                                        {pageNumber}
                                    </Pagination.Item>
                                );
                            }else if (
                                pageNumber === currentPage - 3 ||
                                pageNumber === currentPage + 3
                            ){
                                return <Pagination.Ellipsis key={pageNumber} disabled />;
                            }
                            return null;
                        })}

                        <Pagination.Next
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        />

                        <Pagination.Last
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        />
                    </Pagination>
                </div>
            )}
        </>
    )
}