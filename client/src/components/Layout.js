import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";

function Layout(props) {

    const [lastCreatedAddress, setLastCreatedAddress] = useState("");

    useEffect(() => {

        setLastCreatedAddress(localStorage.getItem("lastGallery"));

    }, []);

    return (
        <>
            <Navbar bg="dark" fixed="top" style={{ padding: 0 }}>
                <Container>
                    <Navbar.Brand href="/">
                        <Image src={require('../../public/ai_art/BG1.png')} height="50" alt="Logo" />
                    </Navbar.Brand>
                    <Nav className="ml-auto">
                        <Nav.Link href="/">New Gallery</Nav.Link>
                        {lastCreatedAddress && <Nav.Link href={"/g/" + lastCreatedAddress}>My Team</Nav.Link>}
                        <Nav.Link href="" target={'_blank'}>My Twitter</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <Container className="mt-5" style={{ marginBottom: '4rem', paddingTop: '1rem' }}>
                <Row>
                    <Col xs={12}>
                        {props.children}
                    </Col>
                </Row>
            </Container>

            <Navbar bg="dark" fixed="bottom" style={{ padding: 0 }}>
                <Container>
                    <Row>
                        <Col xs={12}>
                            Footer
                        </Col>
                    </Row>
                </Container>
            </Navbar>

        </>
    );
}

export default Layout;
