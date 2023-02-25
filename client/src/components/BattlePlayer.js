import React, { useEffect, useState } from 'react';
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

const BattlePlayer = (props) => {
    //props.data contains the battle data
    const BattleData = props.data;

    const homeTeam = props.data?.header[0].teamAGalleryID;
    const awayTeam = props.data?.header[0].teamBGalleryID;


    const homeTeamName = props.data?.teamAData[0].userName.split(",")[1];
    const awayTeamName = props.data?.teamBData[0].userName.split(",")[1];

    const homeTeamData = props.data ? JSON.parse(props.data.teamAData[0].team) : null;
    const awayTeamData = props.data ? JSON.parse(props.data.teamBData[0].team) : null;

    const unboundGameState = useStore().getState().gamestate;


    const [battleError, setBattleError] = useState();

    const [currLine, setCurrLine] = useState(0);
    const [currLineText, setCurrLineText] = useState();

    const [homeTeamRoundData, setHomeTeamRoundData] = useState();
    const [awayTeamRoundData, setAwayTeamRoundData] = useState();


    useEffect(() => {
        if (!BattleData)
            return;




        if (+currLine >= BattleData.lines.length) {
            setCurrLineText("Match concluded!");
            return;
        }

        const currLineContent = BattleData.lines[currLine];
        const currDeltas = JSON.parse(currLineContent.idStatsDeltas);
        setHomeTeamRoundData(currDeltas.A);
        setAwayTeamRoundData(currDeltas.B);
        // overlay

        console.log("CURR LINE", homeTeamData, currDeltas);
        if (currLineContent) {
            const compose = composeLine(currLineContent.statRoll, currLineContent.highestLowestRoll);
            console.log("CURR LINE2", compose);
            setCurrLineText(compose);
            // Use idStatsDeltas to set all healthbars
        }


    }, [currLine]);


    const selectableObjects = [{
        ctrl:
            <SelectableWrapper>
                <SystemLabel>
                    Press 'A' to Continue
                </SystemLabel>

            </SelectableWrapper>,
        val: 'Next',

    }];


    const composeLine = (statRoll, hiLo) => {

        const attributeCodes = [
            'Current HP!', // Reserved for round 4+
            'Smash!', // Low Smash is 50%, high smash is 100%
            'ID',
            'level',
            'description length',
            'sort by description',
            'name length',
            'sort by name',
            'collection name length',
            'sort by collection name',
            'doppleganger' // Special
        ]



        let retVal = "";

        if (statRoll === 10) {
            retVal += `Ump calls highlander rules! There can be only one...\n`;
            if (hiLo === 0) {
                retVal += `A Team sees a doppleganger but proves to be non-fungible. B Team's copy is KO'd!`;
            } else {
                retVal += `B Team found the imposter! A Team's copy is KO'd!`;
            }

        } else if (statRoll > 1) {
            retVal += `Ump pulls the first flag. It's '${attributeCodes[statRoll]}'\n`;
            retVal += `The second flag is '${hiLo === 0 ? 'low' : 'high'}'!`

        } else if (statRoll == 0) {
            retVal += `Ump eyes everybody's healthbars suspiciously...\n`;
            retVal += `The second flag is' ${hiLo === 0 ? 'low' : 'high'}'!`
        } else if (statRoll == 1) {
            retVal += `Ump's winding up!\n`;
            retVal += `${hiLo === 0 ? `Whiff... it only connects halfway.` : `It's super effective! KO!`}!`
        }



        return retVal;

    }




    // TOOD: add list of previous matches

    const vsMenuHandler = async (cmd) => {
        switch (cmd) {
            case 'Next':
                setCurrLine(Math.min(+currLine + 1, BattleData.lines.length));



                break;

        }

    };


    console.log("PLAYER", BattleData);

    return props.data ?
        <Container>
            <Row>
                <Col style={{ textAlign: 'center' }} >
                    <h1 style={{ fontSize: '1.8rem' }}>{homeTeam.substring(homeTeam.indexOf(",") + 1)}</h1>
                    <h2 style={{ fontSize: '1.3rem' }}>Contest on {props.data.header.battleDate}</h2>

                </Col>
            </Row>

            <Row>
                <Col>
                    <Container>
                        <Row>
                            <Col>
                                <BattleGrid3x2 data={homeTeamData} hp={homeTeamRoundData} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>vs. {awayTeamName}</Col>
                        </Row>
                        <Row>
                            <Col>
                                <BattleGrid3x2 data={awayTeamData} hp={awayTeamRoundData} />
                            </Col>
                        </Row>



                    </Container>

                </Col>
                <Col>
                    <ScrollContainer>
                        <h2>ROUND  {currLine + 1}</h2>
                        {currLineText}
                        <SFXMenu setkey="matchsfx" mainMenuHandler={vsMenuHandler} selectableObjects={selectableObjects} onCancel={() => { }} />

                    </ScrollContainer>

                </Col>
            </Row>
        </Container>

        : <></>;


};

export default BattlePlayer;