import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SFXMenu from './SFXMenu';
import SelectableWrapper from './SelectableWrapper';
import { useStore } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import Alert from 'react-bootstrap/Alert';



const fadeIn = keyframes`
  0% {
    transform: scale(.85) rotate(0);

    filter: hue-rotate(0) ;
  }

  50% {
    transform: scale(1) rotate(20deg);
    filter: hue-rotate(360deg);
   
  }

  100% {
    transform: scale(.85) rotate(0);

    filter: hue-rotate(0);
  }
`;

const CrazyImage = styled.img`
animation: ${fadeIn} 3s linear infinite;
`

const BattleMode = (props) => {


    const [preflight, setPreflight] = useState();
    const [sending, setSending] = useState();
    const [teamLoaded, setTeamLoaded] = useState();

    const unboundGameState = useStore().getState().gamestate;

    const vsMenuHandler = (cmd) => {

    };

    const selectableObjects = [{
        ctrl:
            <SelectableWrapper>
                <div className={'nes-container with-title'} style={{ width: '30rem', padding: '1rem 1rem 1rem 0' }}>
                    <Container>
                        <Row>
                            <Col md={8}> <p><strong>Ready to compete?</strong><br /><br /> Upload your team to Cloud Arena!</p></Col>
                            <Col md={4}>

                                <CrazyImage src={require('../../public/GoLogoPNG.png')} style={{ imageRendering: 'pixelated', height: '8rem' }} />

                            </Col>
                        </Row>

                    </Container>
                </div>
            </SelectableWrapper>,
        val: 'Go!'
    }];

    const checkMark = <img src={require('../../public/Checkmark.png')} style={{ imageRendering: 'pixelated', height: '4rem', position: 'relative', top: '-1.2rem' }} />;
    const xMark = <img src={require('../../public/XIcon.png')} style={{ imageRendering: 'pixelated', height: '4rem', position: 'relative', top: '-1.2rem' }} />;

    //http://localhost:8252/v1/submitteam/83EugeneSloths

    const allChecks = (unboundGameState.team_a.filter(x => !x).length === 0) &&
        (unboundGameState.team_b.filter(x => !x).length === 0) &&
        !unboundGameState.tempPin && (unboundGameState.jwt && unboundGameState.jwt.length > 10);


    return (
        <div style={{ padding: '1rem' }}>
            <h1>Match Prep</h1>
            <Container style={{ fontSize: '1.3rem', padding: '2rem 2rem 0 2rem' }}>
                <Row>
                    <Col xs={2}>{unboundGameState.team_a.filter(x => !x).length === 0 ? checkMark : xMark}</Col>
                    <Col>Team A Full Roster</Col>
                </Row>
                <Row>
                    <Col xs={2}>{unboundGameState.team_b.filter(x => !x).length === 0 ? checkMark : xMark}</Col>
                    <Col>Team B Full Roster</Col>
                </Row>
                <Row>
                    <Col xs={2}>{unboundGameState.tempPin ? xMark : checkMark}</Col>
                    <Col>PIN Set</Col>
                </Row>
                <Row>
                    <Col xs={2}>{unboundGameState.jwt && unboundGameState.jwt.length > 10 ? checkMark : xMark}</Col>
                    <Col>Logged In</Col>
                </Row>
            </Container>

            {allChecks ? <SFXMenu setkey="vssfx" mainMenuHandler={vsMenuHandler} selectableObjects={selectableObjects} onCancel={() => { }} /> :

                <Alert className={'nes-container with-title'} style={{ width: '30rem', padding: '1rem 1rem 1rem 0', margin: '2rem auto 0 auto', textAlign: 'center' }}>                    Complete the items above for your team to be eligible to compete in the Cloud Arena!
                </Alert>
            }


        </div >
    )


};

export default BattleMode;