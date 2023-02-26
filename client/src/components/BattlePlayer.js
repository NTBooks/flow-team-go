import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useStore } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BattleGrid3x2 from './BattleGrid3x2';
import SelectableWrapper from './SelectableWrapper';
import SFXMenu from './SFXMenu';

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

const NormalLabel = styled.div`
width: 16rem;
text-align: left;
`

const Stat = styled.span`
color: #00CC00;
text-transform: uppercase;
font-size:1.2em;
`

const High = styled.span`
color: #CC0000;
font-size:1.2em;
`

const Low = styled.span`
color: #0000FF;
font-size:1.2em;
`

const BattlePlayer = (props) => {
    //props.data contains the battle data
    const BattleData = props.data;

    const homeTeam = props.data?.header[0]?.teamAGalleryID;
    const awayTeam = props.data?.header[0]?.teamBGalleryID;

    const homeTeamName = props.data?.teamAData[0].userName.split(",")[1];
    const awayTeamName = props.data?.teamBData[0].userName.split(",")[1];

    const homeTeamData = props.data ? JSON.parse(props.data.teamAData[0].team) : null;
    const awayTeamData = props.data ? JSON.parse(props.data.teamBData[0].team) : null;

    const battleDate = props.data ? new Date(props.data.header[0].battleDate).toGMTString() : '';

    const unboundGameState = useStore().getState().gamestate;

    const [currLine, setCurrLine] = useState(0);
    const [currLineText, setCurrLineText] = useState();

    const [homeTeamRoundData, setHomeTeamRoundData] = useState();
    const [awayTeamRoundData, setAwayTeamRoundData] = useState();

    useEffect(() => {
        if (!BattleData)
            return;

        if (+currLine >= BattleData.lines.length) {
            const compose = composeLine(-2, 0, homeTeamRoundData, awayTeamRoundData, null);
            setCurrLineText(compose);
            return;
        }

        const currLineContent = BattleData.lines[currLine];
        const currDeltas = JSON.parse(currLineContent.idStatsDeltas);

        setHomeTeamRoundData(currDeltas.A);
        setAwayTeamRoundData(currDeltas.B);

        if (currLineContent) {
            const compose = composeLine(currLineContent.statRoll, currLineContent.highestLowestRoll, homeTeamRoundData, awayTeamRoundData, currDeltas);
            setCurrLineText(compose);
        }

    }, [currLine]);

    const selectableObjects = [{
        ctrl:
            <SelectableWrapper>
                <SystemLabel>
                    Press 'A'
                </SystemLabel>

            </SelectableWrapper>,
        val: 'Next',
    },
    {
        ctrl:
            <SelectableWrapper>
                <NormalLabel>
                    Skip
                </NormalLabel>


            </SelectableWrapper>,
        val: 'Skip',
    }];

    const composeLine = (statRoll, hiLo, homePrev, awayPrev, currDeltas) => {
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

        const changedIndexes = [];

        if (currDeltas) {
            // find affected entities
            homePrev?.forEach((prev, i) => {
                if (prev.hp != currDeltas.A[i].hp) {
                    changedIndexes.push({ team: 'A', index: i, hp: currDeltas.A[i].hp });
                }

            });

            awayPrev?.forEach((prev, i) => {
                if (prev.hp != currDeltas.B[i].hp) {
                    changedIndexes.push({ team: 'B', index: i, hp: currDeltas.B[i].hp });
                }

            });
        }

        let retVal = (<p>
            {statRoll === -2 && homeTeamRoundData && awayTeamRoundData &&
                <><p>Ump signals <Stat>match complete!</Stat></p>
                    <p style={{ fontSize: '3rem' }}>
                        {
                            ([...homeTeamRoundData, ...awayTeamRoundData].reduce((curr, acc) => { return curr + acc.hp }, 0) === 0) ?
                                <Stat style={{ animation: `hueshiftcss 2s linear infinite` }}>Draw!</Stat> :
                                homeTeamRoundData.reduce((curr, acc) => { return curr + acc.hp }, 0) === 0 ?
                                    <Stat style={{ animation: `hueshiftcss 2s linear infinite` }}>Away Team Wins!</Stat> :
                                    <Stat style={{ animation: `hueshiftcss 2s linear infinite` }}>Home Team Wins!</Stat>
                        }</p>
                </>}
            {statRoll === -1 &&
                <>Ump signals <Stat>match start!</Stat>
                </>}
            {statRoll === 10 &&
                <>Ump calls highlander rules! There can be only one...
                    {hiLo === 0 ?
                        <>A Team found the imposter!</>
                        :
                        <>B Team found the imposter!</>
                    }
                </>}
            {statRoll > 1 && statRoll < 10 && <><p>Ump pulls out the flags.</p>
                <p>The {hiLo === 0 ? <Low>LOWEST</Low> : <High>HIGEST</High>} <Stat>{attributeCodes[statRoll]}</Stat> get hit!</p></>}
            {statRoll === 0 && <>Ump eyes everybody's healthbars suspiciously...
                <p>Player with {hiLo === 0 ? <Low>LOW</Low> : <High>HIGH</High>} health take a hit!</p></>}
            {statRoll === 1 && <>
                <p>Ump's winding up for sneak attack!</p>

                {hiLo === 0 ?
                    <p>Whiff... it only connects halfway.</p> :
                    <p style={{ color: `#CC0000` }}>It's super effective! KO!</p>
                }
            </>}
            {changedIndexes.map(x => {
                const teamData = x.team === 'A' ? homeTeamData : awayTeamData;
                const nameFinder = unboundGameState.nftStats.find(y => y.nftid == teamData[x.index].id && y.collection == teamData[x.index].collection);

                return <p style={x.hp > 0 ? {} : { animation: `hueshiftcss 2s linear infinite` }}><span style={x.team === 'A' ? { color: '#CCCC00' } : { color: '#00CCCC' }}>Team {x.team}'s </span>
                    {nameFinder?.parsed?.name ? nameFinder.parsed.name : "Member " + (x.index + 1)}
                    {x.hp > 0 ?
                        ` is hit!` :
                        ` KO'd!`
                    }
                </p>
            })}
        </p>);

        return retVal;
    }

    const vsMenuHandler = async (cmd) => {
        switch (cmd) {
            case 'Next':
                setCurrLine(Math.min(+currLine + 1, BattleData.lines.length));

                if (currLine === BattleData.lines.length) {
                    props.onFinished();
                }
                break;
            case 'Skip':
                props.onFinished();
                break;
        }
    };

    return props.data ?
        <Container>
            <Row>
                <Col style={{ textAlign: 'center' }} >
                    <h1 style={{ fontSize: '1.8rem' }}>{homeTeam.substring(homeTeam.indexOf(",") + 1)}</h1>
                    <h2 style={{ fontSize: '0.8rem' }}>Contest on {battleDate}</h2>

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