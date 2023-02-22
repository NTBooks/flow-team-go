import React from 'react';
import styled from 'styled-components';

const PixelContainer = styled.div`
background-image: URL('${require('../../public/PixelFrame.png')}');
image-rendering: pixelated;
background-size: contain;
 height: 11rem;
  width: 36rem; 
  background-repeat: no-repeat;
margin: 0.1rem auto 0.1rem auto;
opacity: 0.8;
`


const TeamPane = (props) => {



    return <>
        <h1>Team {`${props.letter}`}</h1>
        <PixelContainer />
        <PixelContainer />
        <PixelContainer />
    </>;
}

export default TeamPane;
