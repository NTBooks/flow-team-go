import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import styled, { keyframes } from 'styled-components';
import ControllerBox from "./ControllerBox";

const fadeIn = keyframes`
  from {
    opacity: 0;
    filter: blur(1.5rem);
  }

  to {
    opacity: 1;
    filter: blur(0);
  }
`;

const BGPane = styled.div`
background-image: url(${props => props.bg ? props.bg : require('../../public/ai_art/Night.png')});
position: fixed;
width: 100%;
height: 100%;
background-size: cover;
background-position: center center;
z-index: -10000;
image-rendering: pixelated;
animation: ${fadeIn} 1s linear;
`

function Layout(props) {

    const [lastCreatedAddress, setLastCreatedAddress] = useState("");
    const [bg, setBg] = useState();

    useEffect(() => {
        setLastCreatedAddress(localStorage.getItem("lastGallery"));
    }, []);

    useEffect(() => {
        const currentHour = (new Date()).getHours();

        if (currentHour > 20 || currentHour < 4) {
            setBg(require('../../public/ai_art/Night.png'));
        }

        else if (currentHour < 7) {
            setBg(require('../../public/ai_art/PreDawn.png'));
        }

        else if (currentHour < 10) {
            setBg(require('../../public/ai_art/Morning.png'));
        }

        else if (currentHour < 15) {
            setBg(require('../../public/ai_art/Day.png'));
        }

        else if (currentHour < 18) {
            setBg(require('../../public/ai_art/Afternoon.png'));
        }

        else if (currentHour < 20) {
            setBg(require('../../public/ai_art/Sunset.png'));
        }

    }, []);

    return (
        <>
            <BGPane bg={bg} />
            <Container className="" style={{ paddingTop: '0.5rem', marginTop: '0 !important' }} fluid>
                <Row style={{ width: '100%' }}>
                    <Col xl={6} lg={12}>
                        {props.children}
                    </Col>
                    <Col xl={6} lg={12}>
                        <ControllerBox />
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Layout;
