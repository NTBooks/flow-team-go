import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SFXMenu from './SFXMenu';
import SelectableWrapper from './SelectableWrapper';
import { useStore } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import Alert from 'react-bootstrap/Alert';
import { Spinner } from 'react-bootstrap';
import BattleGrid3x2 from './BattleGrid3x2';

const ScrollContainer = styled.div`
overflow-y: scroll;
overflow-x: hidden;
width:100%;
height:31rem;
margin-top:1rem;
margin-left:-1rem;

`;


const SystemLabel = styled.div`
width: 16rem;
text-align: left;
color: #CC0000;

`

const BattleLobby = (props) => {
    //props.data contains the battle data
    const BattleHeader = props.data;


    const unboundGameState = useStore().getState().gamestate;

    const [enemyTeam, setEnemyTeam] = useState();
    const [enemyTeamName, setEnemyTeamName] = useState();

    const [battleError, setBattleError] = useState();

    const selectableObjects = [{
        ctrl:
            <SelectableWrapper>
                <SystemLabel>
                    Random Match!
                </SystemLabel>

            </SelectableWrapper>,
        val: 'Random',

    }, {
        ctrl:
            <SelectableWrapper>
                <SystemLabel>
                    Versus Match!
                </SystemLabel>
            </SelectableWrapper>,
        val: 'VS Match'
    }];

    // TOOD: add list of previous matches

    const vsMenuHandler = async (cmd) => {
        switch (cmd) {
            case 'Random':
                // Get list of battle team names
                // You always fight enemy teams at full health
                // Pick Random Name
                // Get newest team for that random name and fight them


                const fres = await fetch('/v1/randombattle', { method: 'GET', headers: { 'authorization': unboundGameState.jwt, 'content-type': 'application/json' } });
                if (fres.status !== 200) {
                    setBattleError("Server error.")
                    return;
                }

                const fresjson = await fres.json();

                break;
            case 'VS Match':
                break;
        }

    };


    console.log("LOBBY", BattleHeader);

    return BattleHeader ?
        <Container>
            <Row>
                <Col style={{ textAlign: 'center' }} >
                    <h1 style={{ fontSize: '1.8rem' }}>{BattleHeader.teamData[0].userName.substring(BattleHeader.teamData[0].userName.indexOf(",") + 1)}</h1>
                    <h2 style={{ fontSize: '1.3rem' }}>Owned by {BattleHeader.wallet[0].alias}</h2>

                </Col>
            </Row>

            <Row>
                <Col>
                    <Container>
                        <Row>
                            <Col>
                                <BattleGrid3x2 data={JSON.parse(BattleHeader.teamData[0].team)} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>{BattleHeader.teamData[0].team.userName}</Col>
                        </Row>
                        {enemyTeam && <>
                            <Row>
                                <Col>vs. </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <BattleGrid3x2 data={JSON.parse(BattleHeader.teamData[0].team)} />
                                </Col>
                            </Row>
                        </>

                        }
                    </Container>

                </Col>
                <Col>
                    <ScrollContainer>

                        <SFXMenu setkey="matchsfx" mainMenuHandler={vsMenuHandler} selectableObjects={selectableObjects} onCancel={() => { }} />

                    </ScrollContainer>

                </Col>
            </Row>
        </Container>

        : <></>;


};

export default BattleLobby;