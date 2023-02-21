import React, { useEffect, useState } from 'react';
import styled, { keyframes } from "styled-components";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useAudio from '../hooks/useAudio';
import useKeyPress from '../hooks/useKeyPress';
import SelectableWrapper from './SelectableWrapper';
import { gameActions } from '../store/gamestate';

// todo: right and left arrows navigate pages

const FadeContainer = styled.div`
opacity: 1;
transition: opacity ease-out 1s;
`

const CenterDivContainer = styled.div`
padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height:100%;
`

const TopContainer = styled.div`
  padding: 2rem 0 6rem 0;
  
`

const TitleImage = styled.div`
width: 100%;
height: 20rem;
margin-top:2rem;
background-size: contain;
background-position: center center;
image-rendering: pixelated;
background-image: url(${require("../../public/ai_art/TitleScreen.png")});
background-repeat: no-repeat;
`

const FlexItem = styled.div`

  width: 100%;
  height: 2rem;
  text-align: center;
`
const Intro = (props) => {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [exiting, setIsExiting] = useState(false);

    // useEffect(() => {

    //     setTimeout(() => {
    //         navigate('/a_team');
    //     }, 3000);

    // }, []);

    const SFXState = useSelector(state => state.gamestate.sfx_toggle);
    const blip = useAudio([require('url:../../public/sfx/Move.wav')], false)[2];
    const huzuh = useAudio([require('url:../../public/sfx/Select.wav')], false)[2];

    const [selectedIndex, setSelectedIndex] = useState(0);

    const downPress = useKeyPress("ArrowDown");
    const upPress = useKeyPress("ArrowUp");

    useEffect(() => {

        if (!exiting && selectableObjects.length && upPress) {
            if (SFXState && selectedIndex > 0)
                blip();
            setSelectedIndex(prevState => (prevState > 0 ? prevState - 1 : prevState));
        }
    }, [upPress]);

    useEffect(() => {
        if (!exiting && selectableObjects.length && downPress) {
            if (SFXState && selectedIndex < selectableObjects.length - 1)
                blip();
            setSelectedIndex(prevState => prevState < selectableObjects.length - 1 ? prevState + 1 : prevState);
        }
    }, [downPress]);

    const setNetworkHandler = (network) => {

        if (!exiting) {
            setIsExiting(true);
            dispatch(gameActions.setNetwork(network));
            dispatch(gameActions.toggleBGM({ set: network === '/demo' ? true : false }));
            dispatch(gameActions.toggleSFX({ set: network === '/demo' ? true : false }));
            setTimeout(() => {
                navigate('/a_team');
            }, 2000);
            // navigate('/a_team');
        }


    };

    // TODO: add row and col based selection with other arrow directions
    // TODO: add keys for A/B

    const selectableObjects = [
        { ctrl: <SelectableWrapper> MAINNET LOGIN </SelectableWrapper>, val: 'http://access.mainnet.nodes.onflow.org:9000/' },
        { ctrl: <SelectableWrapper> TESTNET LOGIN </SelectableWrapper>, val: 'http://access.devnet.nodes.onflow.org:9000/' },
        { ctrl: <SelectableWrapper> DEMO MODE </SelectableWrapper>, val: '/demo' }

    ];

    return <FadeContainer style={{ opacity: exiting ? 0 : 1 }}>
        <TitleImage />
        <TopContainer><FlexItem>2023 Nick Tantillo<br />released under MIT license.</FlexItem></TopContainer>
        {selectableObjects.map((x, i) => {

            const onCl = (e) => { console.log(i); setSelectedIndex(+i) };
            if (selectedIndex == i)
                return <FlexItem><div>{React.cloneElement(selectableObjects[i].ctrl, { key: 'intro' + i, isSelected: true, onClick: (e) => { onCl(); setNetworkHandler(selectableObjects[i].val); } })}</div></FlexItem>;

            return <FlexItem><div>{React.cloneElement(selectableObjects[i].ctrl, { key: 'intro' + i, onClick: (e) => { onCl(); setNetworkHandler(selectableObjects[i].val); } })}</div></FlexItem>;

        })}


    </FadeContainer>;


}

export default Intro;