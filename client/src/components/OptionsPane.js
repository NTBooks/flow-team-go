import React, { Children, cloneElement, useState, useEffect } from 'react';
import SelectableWrapper from './SelectableWrapper';

import useKeyPress from '../hooks/useKeyPress';
import { Container, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { gameActions } from '../store/gamestate';
import useAudio from '../hooks/useAudio';
import AudioPlayer from './AudioPlayer';
import { useNavigate, useLocation } from "react-router-dom";
import SFXMenu from './SFXMenu';
import RegisterModal from './RegisterModal';
import LoginModal from './LoginModal';
import Alert from 'react-bootstrap/Alert';

const OptionsLabel = styled.span`
font-size: 1.5rem;

`
const OnOffLabel = styled.div`
position: relative;
left: 2rem;
top:0.3rem;
`

const OptionsPane = (props) => {


    const dispatch = useDispatch();

    const BGMState = useSelector(state => state.gamestate.bgm_toggle);
    const SFXState = useSelector(state => state.gamestate.sfx_toggle);
    const JWT = useSelector(state => state.gamestate.jwt);

    const [showRegister, setShowRegister] = useState();
    const [showLogin, setShowLogin] = useState();


    const huzuh = useAudio([require('url:../../public/sfx/Select.wav')], false)[2];


    const navigate = useNavigate();

    console.log("DRAW OPTIONS");



    const menuHandler = (command) => {
        switch (command) {
            case 'BGM':
                dispatch(gameActions.toggleBGM({ set: !BGMState }));
                return;
            case 'SFX':

                dispatch(gameActions.toggleSFX({ set: !SFXState }));

                return;
            case 'New Team':
                dispatch(gameActions.setGalleryData({ data: null }));
                navigate("/");
                return;
            case 'Set Pin':
                // TODO: Implement this

                dispatch(gameActions.disableKeylisteners({ set: true }));
                setShowRegister(true);

                return;
            case 'Login':
                // TODO: Implement this
                dispatch(gameActions.disableKeylisteners({ set: true }));
                setShowLogin(true);

                return;
        }
    };


    const selectableObjects2 = [
        {
            ctrl: <SelectableWrapper key={'bgm'} style={{ height: '3rem' }}>
                <Container>

                    <Row style={{ position: 'relative', top: '0.4rem' }}>
                        <Col xs={2}><OptionsLabel> BGM </OptionsLabel></Col>
                        <Col xs={5} onClick={() => { dispatch(gameActions.toggleBGM({ set: true })); }}><OnOffLabel>[{BGMState ? 'X' : ' '}] ON</OnOffLabel></Col>
                        <Col xs={5} onClick={() => { dispatch(gameActions.toggleBGM({ set: false })); }}><OnOffLabel>[{!BGMState ? 'X' : ' '}] OFF</OnOffLabel></Col>
                    </Row>
                </Container>

            </SelectableWrapper>, val: 'BGM'
        },
        {
            ctrl: <SelectableWrapper key={'sfx'} style={{ height: '3rem' }}>
                <Container>
                    <Row style={{ position: 'relative', top: '0.4rem' }}>
                        <Col xs={2}><OptionsLabel> SFX </OptionsLabel></Col>
                        <Col xs={5} onClick={() => { dispatch(gameActions.toggleSFX({ set: true })); huzuh(); }}><OnOffLabel>[{SFXState ? 'X' : ' '}] ON</OnOffLabel></Col>
                        <Col xs={5} onClick={() => { dispatch(gameActions.toggleSFX({ set: false })) }}><OnOffLabel>[{!SFXState ? 'X' : ' '}] OFF</OnOffLabel></Col>
                    </Row>
                </Container></SelectableWrapper>, val: 'SFX'
        }



    ];

    if (JWT) {
        selectableObjects2.push({
            ctrl: <SelectableWrapper key={'pin'} style={{ paddingTop: '1rem', color: "#0000cc" }}> <OptionsLabel style={{ position: 'relative', top: '0.4rem' }}> Change PIN </OptionsLabel>

            </SelectableWrapper>, val: 'Set Pin'
        })
    } else {
        selectableObjects2.push({
            ctrl: <SelectableWrapper key={'login'} style={{ paddingTop: '1rem', color: "#cc0000" }}> <OptionsLabel style={{ position: 'relative', top: '0.4rem' }}> Login with PIN </OptionsLabel>

            </SelectableWrapper>, val: 'Login'
        })
    }

    selectableObjects2.push({ ctrl: <SelectableWrapper key={'new'} style={{ paddingTop: '1rem' }}> <OptionsLabel style={{ position: 'relative', top: '0.4rem' }}> New Team </OptionsLabel>  </SelectableWrapper>, val: 'New Team' })


    // TODO: Use SFXMenu to cut down on code reuse
    return <>


        <h3 style={{ margin: '1rem 1rem 1rem 1rem', fontSize: '3rem' }} className='title'>Options</h3>

        <div className={'nes-container with-title'} style={{ margin: '3rem 3rem 1rem 3rem' }}>
            <h3 className='title' style={{ fontSize: '1.5rem', marginTop: '-2.5rem' }}>System</h3>

            <SFXMenu setkey="optsfx" mainMenuHandler={menuHandler} selectableObjects={selectableObjects2} exiting={false} />


        </div>

        <Alert className={'nes-container with-title'} style={{ width: '30rem', padding: '1rem 1rem 1rem 0', margin: '1rem auto 0 auto', textAlign: 'center' }}>
            Setting a PIN will let you edit this team even if you clear your local save or switch devices.
        </Alert>
        <RegisterModal show={showRegister} onClose={() => { setShowRegister(false); dispatch(gameActions.disableKeylisteners({ set: false })); }} />
        <LoginModal show={showLogin} onClose={() => { setShowLogin(false); dispatch(gameActions.disableKeylisteners({ set: false })); }} />
    </>;
}

export default React.memo(OptionsPane);
