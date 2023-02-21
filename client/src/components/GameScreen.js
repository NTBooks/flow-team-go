
import react, { useEffect, useState } from "react";
import useKeyPress from "../hooks/useKeyPress";
// Make width 200 rem, then everyting inside is scaled. To scale the box set the REM?

import styled from 'styled-components';
import NESTabs from "./NESTabs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useAudio from "../hooks/useAudio";

const OuterBezel = styled.div`
width: 40rem;
height: 40rem;

background: #FDF8FE;
color: #2F3332;
opacity: 0.9;
margin: 2rem auto 0 auto;
border-radius: 1rem;
box-shadow: 0px 0px 1rem #FFFFFF;
`

const GameScreen = (props) => {

    const navigate = useNavigate();

    const [selectedIndex, setSelectedIndex] = useState(0);

    const rightPress = useKeyPress("ArrowRight");
    const leftPress = useKeyPress("ArrowLeft");

    const selectableObjects = ['/a_team', '/b_team', '/options', '/about'];


    const SFXState = useSelector(state => state.gamestate.sfx_toggle);

    const pageTurn = useAudio([require('url:../../public/sfx/PageTurn.wav')], false)[2];

    useEffect(() => {
        if (selectableObjects.length && leftPress) {
            setSelectedIndex(prevState => (prevState > 0 ? prevState - 1 : prevState));
        }
    }, [leftPress]);

    useEffect(() => {
        if (selectableObjects.length && rightPress) {
            setSelectedIndex(prevState =>
                prevState < selectableObjects.length - 1 ? prevState + 1 : prevState
            );
        }
    }, [rightPress]);

    useEffect(() => {

        if (!props.hideTabs) {
            if (SFXState) {
                pageTurn();
            }
            navigate(selectableObjects[selectedIndex]);
        }
    }, [selectedIndex]);


    return <OuterBezel>
        {!props.hideTabs && <NESTabs currTab={selectedIndex + 1} setTab={setSelectedIndex} />}
        {props.children}
    </OuterBezel>;

}

export default GameScreen;