
import react, { useEffect, useState } from "react";
import useKeyPress from "../hooks/useKeyPress";
// Make width 200 rem, then everyting inside is scaled. To scale the box set the REM?

import styled from 'styled-components';
import NESTabs from "./NESTabs";
import { useNavigate } from "react-router-dom";



const OuterBezel = styled.div`
width: 40rem;
height: 40rem;

background: #FDF8FE;
color: #2F3332;
opacity: 0.9;
margin: 0 auto 0 auto;
border-radius: 1rem;
box-shadow: 0px 0px 1rem #FFFFFF;
`

const GameScreen = (props) => {

    const navigate = useNavigate();

    const [selectedIndex, setSelectedIndex] = useState(0);

    const rightPress = useKeyPress("ArrowRight");
    const leftPress = useKeyPress("ArrowLeft");

    const selectableObjects = ['/a_team', '/b_team', '/options', '/about'];

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

        // TODO: navigate between the panes
        console.log(selectableObjects[selectedIndex]);
        if (!props.hideTabs) {
            navigate(selectableObjects[selectedIndex]);
        }
    }, [selectedIndex]);


    return <OuterBezel>
        {!props.hideTabs && <NESTabs currTab={selectedIndex + 1} setTab={setSelectedIndex} />}
        {props.children}
    </OuterBezel>;

}

export default GameScreen;