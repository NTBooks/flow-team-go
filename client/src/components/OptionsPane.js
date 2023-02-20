import React, { cloneElement, useState, useEffect } from 'react';
import SelectableWrapper from './SelectableWrapper';

import useKeyPress from '../hooks/useKeyPress';
import { Container, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { gameActions } from '../store/gamestate';
import useAudio from '../hooks/useAudio';
import AudioPlayer from './AudioPlayer';

const OptionsLabel = styled.span`
font-size: 1.5rem;
position: relative;
top: 0.3rem;
`

const OptionsPane = (props) => {

    const [selectedIndex, setSelectedIndex] = useState(0);

    const dispatch = useDispatch();

    const BGMState = useSelector(state => state.gamestate.bgm_toggle);
    const SFXState = useSelector(state => state.gamestate.sfx_toggle);

    // const [BGMPlayer, setBGMPlayer] = useState();

    // const audioFiles = [
    //     require('url:../../public/bgm/MuteCityFluff.mp3'),
    //     require('url:../../public/bgm/DankTank.mp3'),
    //     require('url:../../public/bgm/DolphinWavvves.mp3'),
    //     require('url:../../public/bgm/BeachBump.mp3'),
    //     require('url:../../public/bgm/sixampier.mp3')

    // ]

    // const [playing, toggle, skip] = useAudio(audioFiles);

    const blip = useAudio([require('url:../../public/sfx/Move.wav')], false)[2];
    const huzuh = useAudio([require('url:../../public/sfx/Select.wav')], false)[2];

    const downPress = useKeyPress("ArrowDown");
    const upPress = useKeyPress("ArrowUp");

    useEffect(() => {
        if (selectableObjects.length && upPress) {
            if (SFXState && selectedIndex > 0)
                blip();
            setSelectedIndex(prevState => (prevState > 0 ? prevState - 1 : prevState));
        }
    }, [upPress]);

    useEffect(() => {
        if (selectableObjects.length && downPress) {
            if (SFXState && selectedIndex < selectableObjects.length - 1)
                blip();
            setSelectedIndex(prevState => prevState < selectableObjects.length - 1 ? prevState + 1 : prevState);
        }
    }, [downPress]);

    // TODO: add row and col based selection with other arrow directions
    // TODO: add keys for A/B

    const selectableObjects = [
        <SelectableWrapper key={'bgm'} onClick={(e) => { setSelectedIndex(0) }} isSelected={selectedIndex == 0}><OptionsLabel> BGM </OptionsLabel></SelectableWrapper>,
        <SelectableWrapper key={'sfx'} onClick={(e) => { setSelectedIndex(1) }} isSelected={selectedIndex == 1}><OptionsLabel> SFX </OptionsLabel></SelectableWrapper>,
        <SelectableWrapper key={'demo'} onClick={(e) => { setSelectedIndex(2) }} isSelected={selectedIndex == 2}><OptionsLabel> Load Demo </OptionsLabel></SelectableWrapper>


    ];

    return <>


        <h3 style={{ margin: '3rem', fontSize: '3rem' }} className='title'>Options</h3>

        <div className={'nes-container with-title'} style={{ margin: '3rem' }}>
            <h3 className='title' style={{ fontSize: '2rem', marginTop: '-2.5rem' }}>Sound Settings</h3>


            {selectableObjects[0]}
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
            </Container>

        </div>

        <div className={'nes-container with-title'} style={{ margin: '3rem' }}>
            <h3 className='title' style={{ fontSize: '2rem', marginTop: '-2.5rem' }}>Demo Mode</h3>

            {selectableObjects[2]}
        </div>


    </>;
}

export default OptionsPane;
