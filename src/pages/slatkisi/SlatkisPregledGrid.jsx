import { Button, Card, Row, Col, Container } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import { GrValidate } from "react-icons/gr";
import FormatDatuma from "../../components/FormatDatuma";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function SlatkisPregledGrid({ slatkisi, navigate, brisanje }) {
    return (
        <Container className="py-3 px-0">
            <Row>
                {slatkisi && slatkisi.map((slatkis) => (
                    <Col key={slatkis.sifra} xs={12} md={6} className="mb-4">
                        <Card className="shadow-sm h-100">
                            <Card.Header className="d-flex justify-content-between align-items-center bg-white py-3">
                                <span className="fw-bold text-primary" style={{ fontSize: '1.1rem' }}>
                                    {slatkis.naziv}
                                </span>
                                <GrValidate
                                    size={22}
                                    color={slatkis.aktivan ? 'green' : 'red'}
                                    title={slatkis.aktivan ? "Aktivan" : "Neaktivan"}
                                />
                            </Card.Header>

                            <Card.Body>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Naziv:</span>
                                    <span className="fw-semibold">{slatkis.naziv} h</span>
                                </div>
                                
                                    <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Kategorija:</span>
                                    <span className="fw-semibold">{slatkis.kategorija} h</span>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Alergeni:</span>
                                    <span className="fw-semibold">{slatkis.alergeni} h</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Cijena:</span>
                                    <span className="fw-bold text-dark">
                                        <NumericFormat
                                            value={slatkis.cijena}
                                            displayType={'text'}
                                            thousandSeparator='.'
                                            decimalSeparator=','
                                            suffix=' €'
                                            decimalScale={2}
                                            fixedDecimalScale
                                        />
                                    </span>
                                </div>

                                
                            </Card.Body>

                            <Card.Footer className="bg-light d-flex gap-2">
                                <Button
                                    variant="outline-primary"
                                    className="flex-fill"
                                    onClick={() => navigate(`/slatkisi/${slatkis.sifra}`)}
                                    title="Promjeni"
                                >
                                    <FaEdit />
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    className="flex-fill"
                                    onClick={() => brisanje(slatkis.sifra)}
                                    title="Obriši"
                                >
                                    <FaTrash />
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}