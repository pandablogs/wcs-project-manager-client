import React from "react";
import { Navbar, Nav, Button, Container, Row, Col, Card, Form, Accordion } from "react-bootstrap";
import Logo2 from '../../assets/images/logo/logo-2.png'
import service1 from '../../assets/images/services/pre-listing.png'
import service2 from '../../assets/images/services/commercial-building.png'
import service3 from '../../assets/images/services/re-inspection.png'
import service4 from '../../assets/images/services/new-construction.png'
import service5 from '../../assets/images/services/mold-testing.png'
import service6 from '../../assets/images/services/month-inspection.png'
import service7 from '../../assets/images/services/radon-testing.png'
import service8 from '../../assets/images/services/foundation-repair.png'
import about1 from '../../assets/images/about/about1.png'
import about2 from '../../assets/images/about/about2.png'
import user1 from '../../assets/images/team/user1.png'
import user2 from '../../assets/images/team/user2.png'
import user3 from '../../assets/images/team/user3.png'
import user4 from '../../assets/images/team/user4.png'
import Logo1 from '../../assets/images/logo/logo-1.png'
import LogoV1 from '../../assets/images/logo/wcs-pm.png'
import "bootstrap/dist/css/bootstrap.min.css"
import './Home.scss'
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    return (
        <>
            {/* navbar */}
            <Navbar expand="lg" className="Navbarsection bg-light fixed-top">
                <Container>
                    <Navbar.Brand className="navbar-custom" href="#">
                        <img
                            src={LogoV1}
                            alt="logo"
                            className="img-custom"
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto fw-bold">
                            <Nav.Link href="#" className="text-dark">HOME</Nav.Link>
                            <Nav.Link href="#" className="text-dark">SERVICE</Nav.Link>
                            <Nav.Link href="#" className="text-dark">ABOUT</Nav.Link>
                            <Nav.Link href="#" className="text-dark">TEAM</Nav.Link>
                            <Nav.Link href="#" className="text-dark">CONTACT</Nav.Link>
                        </Nav>

                        <Button className="btnnavbar ms-3 fw-bold rounded-pill px-4 border-0" onClick={() => navigate("/project-estimater")}>
                            Get Estimate
                        </Button>
                        <Button className="btnnavbar ms-3 fw-bold rounded-pill px-4 border-0" onClick={() => navigate("/login")}>
                            Login
                        </Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {/* herosection */}
            <section className="hero-section">
                <Container className="text-center text-white ">
                    <h1 className="fw-bold display-2">
                        WE ARE <span className="text-warning">EXPERIENCED</span>
                    </h1>
                    <div className="fw-bold fs-3 my-4">To Inspect Your Home</div>
                    <Button className="btnhero fw-bold rounded-pill py-3 px-4 border-0" onClick={() => navigate("/project-estimater")}>
                        Get Your Estimate
                    </Button>
                </Container>
            </section>

            {/* servicesection */}
            <section className="servicesection">
                <div className="servicesecontain">
                    <Container className="text-center">
                        <Row className="justify-content-center mb-5">
                            <Col md={8}>
                                <h6 className="fw-bold">OUR SERVICES</h6>
                                <h2 className="fw-bold">
                                    WHAT WE <span className="text-warning">OFFER</span>
                                </h2>
                                <p>
                                    Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Curabitur Quis Volutpat Nibh. Ut Mattis Ante Et Magna Eleifend, Quis Aliquam Dui Vestibulum. Suspendisse Eget Massa Vehicula.
                                </p>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div className="servicecard">
                    <Container className="text-center">
                        <Row className="justify-content-center">
                            <Col className="justify-content-center">
                                <Card className="card">
                                    <Card.Body>
                                        <img src={service1} className="icon-container" alt="" />
                                        <Card.Title className="cardheding fw-bold my-3">PRE-LISTING SELLER’S INSPECTIONS</Card.Title>
                                        <Card.Text className="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a augue non ante vulputate aliquet. Quisque in tellus eu magna rhoncus scelerisque. Vivamus dolor ligula.</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col className="justify-content-center">
                                <Card className="card">
                                    <Card.Body>
                                        <img src={service2} className="icon-container" alt="" />
                                        <Card.Title className="cardheding fw-bold my-3">COMMERCIAL BUILDINGS PROPERTY INSPECTIONS</Card.Title>
                                        <Card.Text className="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a augue non ante vulputate aliquet. Quisque in tellus eu magna rhoncus scelerisque. Vivamus dolor ligula.</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col className="justify-content-center">
                                <Card className="card">
                                    <Card.Body>
                                        <img src={service3} className="icon-container" alt="" />
                                        <Card.Title className="cardheding fw-bold my-3">RE-INSPECTIONS</Card.Title> <br />
                                        <Card.Text className="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a augue non ante vulputate aliquet. Quisque in tellus eu magna rhoncus scelerisque. Vivamus dolor ligula.</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                    <Container className="text-center my-4">
                        <Row className="justify-content-center">
                            <Col className="justify-content-center">
                                <Card className="card">
                                    <Card.Body>
                                        <img src={service4} className="icon-container" alt="" />
                                        <Card.Title className="cardheding fw-bold my-3">RE-INSPECTIONS</Card.Title> <br />
                                        <Card.Text className="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a augue non ante vulputate aliquet. Quisque in tellus eu magna rhoncus scelerisque. Vivamus dolor ligula.</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col className="justify-content-center">
                                <Card className="card">
                                    <Card.Body>
                                        <img src={service5} className="icon-container" alt="" />
                                        <Card.Title className="cardheding fw-bold my-3">MOLD TESTING</Card.Title> <br />
                                        <Card.Text className="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a augue non ante vulputate aliquet. Quisque in tellus eu magna rhoncus scelerisque. Vivamus dolor ligula.</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col className="justify-content-center">
                                <Card className="card">
                                    <Card.Body>
                                        <img src={service6} className="icon-container" alt="" />
                                        <Card.Title className="cardheding fw-bold my-3">11-MONTH BUILDER’S WARRANTY INSPECTIONS</Card.Title>
                                        <Card.Text className="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a augue non ante vulputate aliquet. Quisque in tellus eu magna rhoncus scelerisque. Vivamus dolor ligula.</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                    <Container className="text-center">
                        <Row className="justify-content-center">
                            <Col className="justify-content-center col-md-4">
                                <Card className="card">
                                    <Card.Body>
                                        <img src={service7} className="icon-container" alt="" />
                                        <Card.Title className="cardheding fw-bold my-3">RADON TESTING</Card.Title>
                                        <Card.Text className="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a augue non ante vulputate aliquet. Quisque in tellus eu magna rhoncus scelerisque. Vivamus dolor ligula.</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col className="justify-content-center col-md-4">
                                <Card className="card">
                                    <Card.Body>
                                        <img src={service8} className="icon-container" alt="" />
                                        <Card.Title className="cardheding fw-bold my-3">FOUNDATION REPAIR</Card.Title>
                                        <Card.Text className="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a augue non ante vulputate aliquet. Quisque in tellus eu magna rhoncus scelerisque. Vivamus dolor ligula.</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </section>

            {/* about section  */}
            <section className="aboutsection">
                <div className="about1">
                    <Container>
                        <Row>
                            {/* Left Side Image */}
                            <Col md={6}>
                                <img
                                    src={about1}
                                    alt=""
                                    className="about1-image"
                                />
                            </Col>

                            {/* Right Side Text Content */}
                            <Col md={6} className="mt-3">
                                <h6 className="text-danger fw-bold">ABOUT US</h6>
                                <h2 className="heading fw-bold">
                                    WE ARE <span className="text-warning">PROFESSIONAL</span> <br />
                                    INSPECTION SERVICE PROVIDER.
                                </h2><br />
                                <p className="description">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab non quaerat recusandae consequuntur sit nam atque perferendis laborum perspiciatis tempore ullam earum id, doloribus incidunt ipsa nostrum, obcaecati aliquid consectetur quos esse porro, quidem at. Et aspernatur dicta alias quae asperiores nisi beatae ad, adipisci est recusandae! Libero, suscipit quis.
                                </p><br />
                                <p className="description">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat perferendis neque ad qui inventore tenetur, quo magni aliquid enim corporis accusamus dolore? Veniam, cumque repellendus.
                                </p>
                            </Col>
                        </Row>

                        <Row className="mt-5 icon">
                            <Col md={3} className="d-flex gap-3">
                                <div>
                                    <span>
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </span>
                                </div>
                                <div className="iconcontain">
                                    <h2 className="fw-bold">
                                        110
                                    </h2>
                                    <p className="fw-bold">
                                        INSPECTIONS
                                    </p>
                                </div>
                            </Col>
                            <Col md={3} className="d-flex gap-3">
                                <div>
                                    <span>
                                        <i className="fa-solid fa-user-tie"></i>
                                    </span>
                                </div>
                                <div className="iconcontain">
                                    <h2 className="fw-bold">
                                        80
                                    </h2>
                                    <p className="fw-bold">
                                        INSPECTORS
                                    </p>
                                </div>
                            </Col>
                            <Col md={3} className="d-flex gap-3">
                                <div>
                                    <span>
                                        <i className="fa-solid fa-user"></i>
                                    </span>
                                </div>
                                <div className="iconcontain">
                                    <h2 className="fw-bold">
                                        100
                                    </h2>
                                    <p className="fw-bold">
                                        AGENTS
                                    </p>
                                </div>
                            </Col>
                            <Col md={3} className="d-flex gap-3">
                                <div>
                                    <span>
                                        <i className="fa-solid fa-user"></i>
                                    </span>
                                </div>
                                <div className="iconcontain">
                                    <h2 className="fw-bold">
                                        105
                                    </h2>
                                    <p className="fw-bold">
                                        CLIENTS
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div className="about2">
                    <Container className="text-white">
                        <Row>
                            {/* left Side Text Content */}
                            <Col md={6} >
                                <h6 className="text-danger fw-bold">WHY CHOOSE US</h6>
                                <h2 className="heading">
                                    WE ARE PROFESSIONAL THAT<br />
                                    MAKE <span className="text-warning">CLIENTS HAPPY.
                                    </span> <br />
                                </h2><br />
                                <p className="description">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab non quaerat recusandae consequuntur sit nam atque perferendis laborum perspiciatis tempore ullam earum id, doloribus incidunt ipsa nostrum, obcaecati aliquid consectetur quos esse porro, quidem at. Et aspernatur dicta alias quae asperiores nisi beatae ad, adipisci est recusandae! Libero, suscipit quis.
                                </p><br />
                                <p className="description">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat perferendis neque ad qui inventore tenetur, quo magni aliquid enim corporis accusamus dolore? Veniam, cumque repellendus.
                                </p>
                            </Col>
                            {/* right Side Image */}
                            <Col md={6}>
                                <img
                                    src={about2}
                                    alt=""
                                    className="about2-image"
                                />
                            </Col>
                        </Row>
                    </Container>
                </div>
            </section>

            {/* team section  */}
            <section className="teamsection">
                <div className="team">
                    <Container className="text-center">
                        <Row className="justify-content-center">
                            <Col md={8}>
                                <h6 className="text-danger fw-bold">MEET THE TEAM</h6>
                                <h2 className="fw-bold">
                                    OUR CREATIVE <span className="text-warning">TEAM</span>
                                </h2>
                                <p className>
                                    Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Curabitur Quis Volutpat Nibh. Ut Mattis Ante Et Magna Eleifend, Quis Aliquam Dui Vestibulum. Suspendisse Eget Massa Vehicula.
                                </p>
                            </Col>
                        </Row>
                    </Container>
                    <Container className="text-center mt-5">
                        <Row className="justify-content-center fw-bold">
                            <Col md={3}>
                                <img src={user1} alt="" />
                                <div className="py-4">
                                    <h5>Adam Clark</h5>
                                    <span>Co-Founder</span>
                                </div>
                            </Col>
                            <Col md={3}>
                                <img src={user2} alt="" />
                                <div className="py-4">
                                    <h5>JOHN DEO</h5>
                                    <span>Co-Founder</span>
                                </div>
                            </Col>
                            <Col md={3}>
                                <img src={user3} alt="" />
                                <div className="py-4">
                                    <h5>DAVID MILLER</h5>
                                    <span>CEO</span>
                                </div>
                            </Col>
                            <Col md={3}>
                                <img src={user4} alt="" />
                                <div className="py-4">
                                    <h5>JAMES WHITE</h5>
                                    <span>MANAGER</span>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div className="lets-talk">
                    <Container className="text-center">
                        <Row className="justify-content-center text-white">
                            <Col md={8}>
                                <h6>LET'S TALK ABOUT WHAT WE CAN DO FOR YOUR HOME.</h6>
                                <h2 className="my-5 fw-bold">WE HAVE 10+ YEARS EXPERIENCE IN <span className="text-warning">INSPECTION</span> SERVICES.</h2>
                                <button type="button" className="btn btn-outline-light rounded-pill p-2">LET'S TALK</button>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div className="ourclients">
                    <Container className="text-center py-5">
                        <Row className="justify-content-center">
                            <Col md={8}>
                                <h6 className="fw-bold">TRUSTED BY THE EXPERTS</h6>
                                <h2 className="fw-bold">CHECK WHAT'S OUR <span className="text-warning">CLIENTS SAID</span></h2>
                            </Col>
                        </Row>
                    </Container>

                </div>
            </section>
            {/* Accordionsection */}
            <section className="accordionsection">
                <Container >
                    <Row className="justify-content-center">
                        <Col md={12}>
                            <Accordion defaultActiveKey="0" >
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Accordion Item #1</Accordion.Header>
                                    <Accordion.Body>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                        culpa qui officia deserunt mollit anim id est laborum.
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="1">
                                    <Accordion.Header>Accordion Item #2</Accordion.Header>
                                    <Accordion.Body>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                        culpa qui officia deserunt mollit anim id est laborum.
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="2">
                                    <Accordion.Header>Accordion Item #2</Accordion.Header>
                                    <Accordion.Body>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                        culpa qui officia deserunt mollit anim id est laborum.
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="3">
                                    <Accordion.Header>Accordion Item #2</Accordion.Header>
                                    <Accordion.Body>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                        culpa qui officia deserunt mollit anim id est laborum.
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="4">
                                    <Accordion.Header>Accordion Item #2</Accordion.Header>
                                    <Accordion.Body>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                        culpa qui officia deserunt mollit anim id est laborum.
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="5">
                                    <Accordion.Header>Accordion Item #2</Accordion.Header>
                                    <Accordion.Body>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                        culpa qui officia deserunt mollit anim id est laborum.
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="6">
                                    <Accordion.Header>Accordion Item #2</Accordion.Header>
                                    <Accordion.Body>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                        culpa qui officia deserunt mollit anim id est laborum.
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="7">
                                    <Accordion.Header>Accordion Item #2</Accordion.Header>
                                    <Accordion.Body>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                        culpa qui officia deserunt mollit anim id est laborum.
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="8">
                                    <Accordion.Header>Accordion Item #2</Accordion.Header>
                                    <Accordion.Body>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                        culpa qui officia deserunt mollit anim id est laborum.
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="9">
                                    <Accordion.Header>Accordion Item #2</Accordion.Header>
                                    <Accordion.Body>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                        culpa qui officia deserunt mollit anim id est laborum.
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="10">
                                    <Accordion.Header>Accordion Item #2</Accordion.Header>
                                    <Accordion.Body>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                        culpa qui officia deserunt mollit anim id est laborum.
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Contact us  */}
            <section className="contactus">
                <Container className="text-center">
                    <Row className="justify-content-center">
                        <Col md={8}>
                            <h6 className="fw-bold">CONTACT US</h6>
                            <h2 className="fw-bold">GET IN <span className="text-warning">TOUCH</span></h2>
                            <p className="pt-3 pb-5">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laboriosam facere expedita eaque cupiditate excepturi modi officia minima, blanditiis ullam. Ducimus deleniti ex sunt repellendus voluptates.</p>
                        </Col>
                    </Row>
                </Container>
                <Container>
                    <Row className="justify-content-center ">
                        <Col md={8}>
                            <Form>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="forName">
                                            <Form.Control type="name" placeholder="Name" className="bgplaceholder" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formEmail">
                                            <Form.Control type="email" placeholder="Email" className="bgplaceholder" />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3" controlId="formsubject">
                                    <Form.Control type="text" placeholder="subject" className="bgplaceholder" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formmessage">
                                    <Form.Control type="text" as="textarea" rows={4} placeholder="Write message Here" className="bgplaceholder" />
                                </Form.Group>
                                <Row>
                                    <Button type="submit" className="btnform border rounded-pill">SEND MESSAGE</Button>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* footer  */}
            <section className="footer">
                <Container className="text-center">
                    <Row className="justify-content-center">
                        <Col md={8}>
                            <img src={LogoV1} alt="logo" />
                        </Col>
                    </Row>
                    <Nav className="justify-content-center social-media-footer py-4">
                        <Nav.Item>
                            <Nav.Link href="#" className="facebook">
                                <i className="fab fa-facebook-f"></i>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#" className="twitter">
                                <i className="fab fa-twitter"></i>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#" className="linkedin">
                                <i className="fab fa-linkedin"></i>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Link to="/admin-login" className=" text-decoration-none">
                                Admin Panel
                            </Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Link to="/project-manager-login" className=" text-decoration-none">
                                Project Manager Panel
                            </Link>
                        </Nav.Item>
                    </Nav>
                    <hr className="text-white" />
                    <div className="copyright text-white pt-2">© 2025 WCS PRoject Manager. All Rights Reserved.</div>
                </Container>
            </section>
        </>
    );
};

export default Home;
