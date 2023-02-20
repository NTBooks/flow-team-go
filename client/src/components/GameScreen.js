import React from 'react';

// Make width 200 rem, then everyting inside is scaled. To scale the box set the REM?

import styled from 'styled-components';


const OuterBezel = styled.div`
width: 40rem;
height: 40rem;
border: thin solid #2F3332;
background: #FDF8FE;
color: #2F3332;
`

const GameScreen = (props) => {

    return <OuterBezel>{props.children}</OuterBezel>;

}

export default GameScreen;