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


    const huzuh = useAudio([require('url:../../public/sfx/Select.wav')], false)[2];


    const navigate = useNavigate();




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
                return;
        }
    };


    const selectableObjects2 = [
        {
            ctrl: <SelectableWrapper key={'bgm'} style={{ height: '3rem' }}>
                <Container>

                    <Row>
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
                    <Row>
                        <Col xs={2}><OptionsLabel> SFX </OptionsLabel></Col>
                        <Col xs={5} onClick={() => { dispatch(gameActions.toggleSFX({ set: true })); huzuh(); }}><OnOffLabel>[{SFXState ? 'X' : ' '}] ON</OnOffLabel></Col>
                        <Col xs={5} onClick={() => { dispatch(gameActions.toggleSFX({ set: false })) }}><OnOffLabel>[{!SFXState ? 'X' : ' '}] OFF</OnOffLabel></Col>
                    </Row>
                </Container></SelectableWrapper>, val: 'SFX'
        },
        { ctrl: <SelectableWrapper key={'new'}> <OptionsLabel> New Team </OptionsLabel>  </SelectableWrapper>, val: 'New Team' },
        { ctrl: <SelectableWrapper key={'pin'}> <OptionsLabel> Set PIN </OptionsLabel>  </SelectableWrapper>, val: 'Set Pin' }

    ];



    // TODO: Use SFXMenu to cut down on code reuse
    return <>


        <h3 style={{ margin: '3rem', fontSize: '3rem' }} className='title'>Options</h3>

        <div className={'nes-container with-title'} style={{ margin: '3rem' }}>
            <h3 className='title' style={{ fontSize: '2rem', marginTop: '-2.5rem' }}>System</h3>

            <SFXMenu setkey="optsfx" mainMenuHandler={menuHandler} selectableObjects={selectableObjects2} exiting={false} />
            {/* {selectableObjects[0]}
            <Container>
                <Row>
                    <Col></Col>
                    <Col onClick={() => { dispatch(gameActions.toggleBGM({ set: true })); }}>[{BGMState ? 'X' : ' '}] ON</Col>
                    <Col onClick={() => { dispatch(gameActions.toggleBGM({ set: false })); }}>[{!BGMState ? 'X' : ' '}] OFF</Col>
                </Row>
            </Container>

            <br />
            {selectableObjects[1]}
            <Container>
                <Row>
                    <Col></Col>
                    <Col onClick={() => { dispatch(gameActions.toggleSFX({ set: true })); huzuh(); }}>[{SFXState ? 'X' : ' '}] ON</Col>
                    <Col onClick={() => { dispatch(gameActions.toggleSFX({ set: false })) }}>[{!SFXState ? 'X' : ' '}] OFF</Col>
                </Row>
            </Container> */}

        </div>
        {/* 
        <div className={'nes-container with-title'} style={{ margin: '3rem' }}>
            <h3 className='title' style={{ fontSize: '2rem', marginTop: '-2.5rem' }}>System</h3>

            {selectableObjects[2]}
            {selectableObjects[3]}
        </div> */}


    </>;
}

export default OptionsPane;
