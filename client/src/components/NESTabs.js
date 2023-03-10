import React from 'react';
import styled from 'styled-components';

const OverlapTabContainer = styled.div`
position: relative;
height: 3rem;
background-color: #F7D51D;
width: 100%;
border-radius: 1rem 1rem 0 0;
`;

const OverlapTab = styled.div`
position: absolute;
height: 3rem;
top:0;
left: 0;
color: white;
font-size: 1.4rem;
width: ${props => (props.width ? props.width : `100%`)};
background-color: ${props => (props.color ? props.color : `transparent`)};
transition: width ease-out .5s;
padding-left: 3rem;
white-space: nowrap;
border-radius: 1rem 0 0 0;
padding-top:0.5rem;
`;

const StubImage = styled.img`
position: absolute;
right: -1rem;
height: 3rem;
top: 0;
image-rendering: pixelated;
`;

const RText = styled.div`
display: inline-block;
position:absolute;
right:1rem;
padding-top:0.7rem;
font-size: 0.7rem;
top: 0.5rem;
color:#fff1e8;
text-shadow: 0.1rem 0.1rem 0.1rem #111111;
`;

const RTextImage = styled.img`
position: absolute;
height: 2rem;
top: 0;
right: 3rem;
image-rendering: pixelated;
`;

const CollapseImage = styled.img`
position: absolute;
height: 2rem;
top: 0.5rem;
right: -0.5rem;
z-index: 10001;
image-rendering: pixelated;
`;

const NESTabs = (props) => {

    const currTab = props.currTab ? props.currTab : 1;
    const collapsedA = <CollapseImage src={require("../../public/AButton.png")}></CollapseImage>;
    const collapsedB = <CollapseImage src={require("../../public/BButton.png")}></CollapseImage>;
    const collapsedOpt = <CollapseImage src={require("../../public/Wrench.png")}></CollapseImage>;
    const collapsedVS = <CollapseImage src={require("../../public/GearButton.png")}></CollapseImage>;

    return <OverlapTabContainer>
        <RText onClick={(e) => { props.setTab(4) }}>PAGE<RTextImage src={require("../../public/SmControllerRight.png")}></RTextImage></RText>
        <OverlapTab onClick={(e) => { props.setTab(3) }} style={{ left: '9rem' }} width={currTab < 5 ? '24rem' : '2rem'} color="#212529">{currTab == 4 ? 'Options' : ''}{collapsedOpt}<StubImage src={require("../../public/TabStubSlate.png")}></StubImage></OverlapTab>
        <OverlapTab onClick={(e) => { props.setTab(2) }} style={{ left: '6rem' }} width={currTab < 4 ? '22rem' : '2rem'} color="#209CEE">{currTab == 3 ? 'Versus' : ''}{collapsedVS}<StubImage src={require("../../public/TabStubBU.png")}></StubImage></OverlapTab>
        <OverlapTab onClick={(e) => { props.setTab(1) }} style={{ left: '3rem' }} width={currTab < 3 ? '19rem' : '2rem'} color="#92CC41">{currTab == 2 ? 'Standby' : ''}{collapsedB}<StubImage src={require("../../public/TabStubGR.png")}></StubImage></OverlapTab>
        <OverlapTab onClick={(e) => { props.setTab(0) }} width={currTab == 1 ? '14rem' : '2rem'} color="#E76E55">{currTab == 1 ? 'Champs' : ''
        }{collapsedA}<StubImage src={require("../../public/TabStubR.png")}></StubImage></OverlapTab>
    </OverlapTabContainer >
}

export default NESTabs;