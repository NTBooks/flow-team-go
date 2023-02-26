import React, { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useDispatch, useStore } from 'react-redux';
import styled from 'styled-components';
import { gameActions } from '../store/gamestate';
import BattleGrid3x2 from './BattleGrid3x2';
import BattlePlayer from './BattlePlayer';
import GalleryEnterModal from './GalleryEnterModal';
import LoginModal from './LoginModal';
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

const BattleLobby = (props) => {
    //props.data contains the battle data
    const BattleHeader = props.data;
    const dispatch = useDispatch();

    const updateMatchList = async () => {
        const fres = await fetch('/v1/getmatchlist', { method: 'GET', headers: { 'authorization': unboundGameState.jwt, 'content-type': 'application/json' } });
        if (fres.status !== 200) {
            setBattleError("Server error.")
            return;
        }

        const fresjson = await fres.json();
        setMatchList(fresjson);
    };

    useEffect(() => {
        updateMatchList();
        if (props.data) {
            const headerData = JSON.parse(BattleHeader.teamData[0].team);
            setBgridData(headerData);

            let matches = true;
            const stateVal = [...unboundGameState.team_a, ...unboundGameState.team_b];
            headerData.forEach((x, i) => {
                if (x.id != stateVal[i].id || x.collection != stateVal[i].collection) {
                    console.log("MISMATCH", x);
                    matches = false;
                }
            })
            setBgridDataMatches(matches);
        }
    }, [])


    const unboundGameState = useStore().getState().gamestate;

    const [battleError, setBattleError] = useState();

    const [playerModeData, setPlayerModeData] = useState();
    const [showLogin, setShowLogin] = useState();
    const [showGallery, setShowGallery] = useState();

    const [matchList, setMatchList] = useState();
    const [uploadingTeam, setUploadingTeam] = useState();

    const [bgridData, setBgridData] = useState();
    const [bgridDataMatches, setBgridDataMatches] = useState();

    let selectableObjects = unboundGameState.jwt ? [{
        ctrl:
            <SelectableWrapper>
                <NormalLabel>
                    Upload Changes
                </NormalLabel>
            </SelectableWrapper>,
        val: 'Upload'
    },
    {
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
    }] : [{
        ctrl:
            <SelectableWrapper>
                <SystemLabel>
                    Unlock with PIN
                </SystemLabel>

            </SelectableWrapper>,
        val: 'Unlock',

    }];

    if (bgridDataMatches) {
        selectableObjects = [...selectableObjects.filter(x => x.val !== 'Upload')]
    }

    if (matchList) {
        selectableObjects = [...selectableObjects, ...matchList.map(x => {
            return {
                ctrl:
                    <SelectableWrapper>
                        <div style={{ width: '16rem', top: '1rem', position: 'relative', backgroundColor: '#CCCCCC' }}>
                            <span style={{ fontSize: '0.5rem' }}> {(new Date(x.battleDate)).toGMTString()}</span>
                            <br />
                            <span style={x.winner == 1 ? { fontSize: '0.7rem', color: '#CC0000' } : { fontSize: '0.7rem' }}>{x.winner == 1 ? 'WIN' : 'LOSE'} </span><span style={{ fontSize: '0.7rem' }}>vs. {x.teamBGalleryID.split(",")[1]}</span>
                        </div>

                    </SelectableWrapper>,
                val: 'Replay-' + x.id,

            }
        })]
    }

    const vsMenuHandler = async (cmd) => {
        switch (cmd.split("-")[0]) {
            case 'Unlock':

                if (!unboundGameState.jwt) {
                    setShowLogin(true);
                    return;
                }

                break;
            case 'Random':

                const fres = await fetch('/v1/randombattle', { method: 'GET', headers: { 'authorization': unboundGameState.jwt, 'content-type': 'application/json' } });
                if (fres.status !== 200) {
                    setBattleError("Server error.")
                    return;
                }

                const fresjson = await fres.json();

                console.log("PLAYERMODE", fresjson);
                setPlayerModeData(fresjson);

                fresjson.statChanges.forEach((x) => {
                    dispatch(gameActions.removeNFTStats({ id: x.id }));
                })
                break;
            case 'VS Match':
                dispatch(gameActions.disableKeylisteners({ set: true }));
                if (unboundGameState.jwt) {
                    setShowGallery(true);
                    return;
                } else {
                    setShowLogin(true);
                    return;
                }
                break;
            case 'Replay':
                const fres2 = await fetch('/v1/replaybattle/' + cmd.split("-")[1], { method: 'GET', headers: { 'authorization': unboundGameState.jwt, 'content-type': 'application/json' } });
                if (fres2.status !== 200) {
                    setBattleError("Server error.")
                    return;
                }

                const fres2json = await fres2.json();

                console.log("REPLAY", fres2json);
                setPlayerModeData(fres2json);
                break;
            case 'Upload':
                uploadTeam();
                break;
        }

    };

    const uploadTeam = async () => {

        setBattleError();
        setUploadingTeam(true);
        setBgridData();

        const submitTeamResult = await fetch('/v1/submitteam/' + unboundGameState.gallery, { method: 'GET', headers: { 'authorization': unboundGameState.jwt } });

        if (submitTeamResult.status !== 200) {
            setBattleError(submitTeamResult);
            return;
        }

        const resultDetail = await submitTeamResult.json();

        console.log("BLAH", JSON.stringify(resultDetail.team), JSON.stringify([...unboundGameState.team_a, ...unboundGameState.team_b]));

        if (resultDetail.message === 'SUCCESS') {
            setUploadingTeam(false);
            setBgridData(resultDetail.team);

        }

        let matches = true;
        const stateVal = [...unboundGameState.team_a, ...unboundGameState.team_b];
        resultDetail.team.forEach((x, i) => {
            if (x.id != stateVal[i].id || x.collection != stateVal[i].collection) {
                console.log("MISMATCH", x);
                matches = false;
            }
        })

        setBgridDataMatches(matches);
    }

    const closeHandler = async (galleryName) => {

        setBattleError();

        const fres = await fetch('/v1/vsbattle/' + galleryName, { method: 'GET', headers: { 'authorization': unboundGameState.jwt, 'content-type': 'application/json' } });
        if (fres.status !== 200) {
            const jsonRes = await fres.json();
            setBattleError(jsonRes ? jsonRes.message : "Server error.")
            return;
        }

        const fresjson = await fres.json();

        setPlayerModeData(fresjson);
    }


    return playerModeData ?
        <BattlePlayer data={playerModeData} onFinished={() => {
            setPlayerModeData(0); updateMatchList(); props.onRefreshTeam();
        }} />
        :
        BattleHeader ?

            <Container>
                <Row>
                    <Col style={{ textAlign: 'center' }} >
                        <h1 style={{ fontSize: '1.8rem' }}>{BattleHeader.teamData[0].userName.substring(BattleHeader.teamData[0].userName.indexOf(",") + 1)}</h1>
                        <h2 style={{ fontSize: '1.3rem' }}>Owned by {BattleHeader.wallet[0].alias}</h2>

                    </Col>
                </Row>
                {!uploadingTeam &&
                    <Row>
                        <Col>
                            <Container>
                                <Row>
                                    <Col style={{ color: '#CC0000', textAlign: 'center', paddingTop: '1.2rem' }}>Uploaded Cloud Arena Team</Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <BattleGrid3x2 data={bgridData} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>{BattleHeader.teamData[0].team.userName}</Col>
                                </Row>

                                {battleError && <Alert>{battleError}</Alert>}
                            </Container>

                        </Col>
                        <Col>
                            <ScrollContainer>

                                <SFXMenu setkey="matchsfx" mainMenuHandler={vsMenuHandler} selectableObjects={selectableObjects} onCancel={() => { }} />
                                <LoginModal show={showLogin} onClose={() => { setShowLogin(false); dispatch(gameActions.disableKeylisteners({ set: false })); }} />
                            </ScrollContainer>

                        </Col>
                    </Row>
                }
                <GalleryEnterModal show={showGallery} onClose={(e) => { closeHandler(e); setShowGallery(false); dispatch(gameActions.disableKeylisteners({ set: false })); }} />
            </Container>

            : <></>;
};

export default BattleLobby;