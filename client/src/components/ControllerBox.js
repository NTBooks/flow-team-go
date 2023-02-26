import React from 'react';
import styled from 'styled-components';

const ControllerPanel = styled.div`
position: relative;
width: 40rem;
margin: 0 auto 0 auto;
padding-top: 3rem;
`

const ControllerCross = styled.div`
width: 10rem;
height: 10rem;
top: 10%;
margin-left: 10%;
opacity: 0.8;
position: absolute;
background-image: url(${require('../../public/ControllerCross.svg')});
`

const ControllerAButton = styled.div`
width: 5rem;
height: 5rem;
top: 50%;
left: 60%;
opacity: 0.8;
position: absolute;
background-image: url(${require('../../public/CircleButton.svg')});
`

const ControllerBButton = styled.div`
width: 5rem;
height: 5rem;
top: 20%;
left: 80%;
opacity: 0.8;
position: absolute;
background-image: url(${require('../../public/CircleButton.svg')});
`


const ControllerUpButton = styled.div`
width: 4rem;
height: 5rem;
top: -10%;
left: 30%;
opacity: 0;
position: absolute;
background-color: red;
`
const ControllerDownButton = styled.div`
width: 4rem;
height: 5rem;
top: 60%;
left: 30%;
opacity: 0;
position: absolute;
background-color: blue;
`
const ControllerLeftButton = styled.div`
width: 5rem;
height: 5rem;
top: 25%;
left: -20%;
opacity: 0;
position: absolute;
background-color: green;
`

const ControllerRightButton = styled.div`
width: 5rem;
height: 5rem;
top: 25%;
left: 70%;
opacity: 0;
position: absolute;
background-color: pink;
`

const ControllerBox = () => {
    const simulateKey = (key) => {
        var evt = document.createEvent("Event");
        evt.initEvent("fakekeypress", true, true);
        evt.key = key;
        document.dispatchEvent(evt);
    }

    return <ControllerPanel className="controllerbox">
        <ControllerCross>
            <ControllerUpButton onClick={(e) => { simulateKey('ArrowUp') }} />
            <ControllerDownButton onClick={(e) => { simulateKey('ArrowDown') }} />
            <ControllerLeftButton onClick={(e) => { simulateKey('ArrowLeft') }} />
            <ControllerRightButton onClick={(e) => { simulateKey('ArrowRight') }} />
        </ControllerCross>
        <ControllerAButton onClick={(e) => { simulateKey('a') }} />
        <ControllerBButton onClick={(e) => { simulateKey('b') }} />
    </ControllerPanel>
}

export default ControllerBox;