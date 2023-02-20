import React from 'react';
import styled, { keyframes } from 'styled-components';

// TODO: Animate X position when changing



const OverlapTabContainer = styled.div`
position: relative;
height: 2rem;
background-color: #F7D51D;
width: 100%;
border-radius: 1rem 1rem 0 0;
`;

const OverlapTab = styled.div`
position: absolute;
height: 2rem;
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
`;

const StubImage = styled.img`
position: absolute;
right: -1rem;
height: 2rem;
top: 0;
image-rendering: pixelated;

`

const RText = styled.div`
display: inline-block;
position:absolute;
right:0;
`

const NESTabs = (props) => {



    // set widths based on current tab
    const currTab = props.currTab ? props.currTab : 1;

    return <OverlapTabContainer>
        <RText onClick={(e) => { props.setTab(3) }}>?</RText>
        <OverlapTab onClick={(e) => { props.setTab(2) }} style={{ left: '6rem' }} width={currTab < 4 ? '30rem' : '2rem'} color="#209CEE">{currTab == 3 && 'Options'}<StubImage src={require("../../public/TabStubBU.png")}></StubImage></OverlapTab>
        <OverlapTab onClick={(e) => { props.setTab(1) }} style={{ left: '3rem' }} width={currTab < 3 ? '24rem' : '2rem'} color="#92CC41">{currTab == 2 && 'Team B'}<StubImage src={require("../../public/TabStubGR.png")}></StubImage></OverlapTab>
        <OverlapTab onClick={(e) => { props.setTab(0) }} width={currTab == 1 ? '18rem' : '2rem'} color="#E76E55">{currTab == 1 && 'Team A'}<StubImage src={require("../../public/TabStubR.png")}></StubImage></OverlapTab>
    </OverlapTabContainer >

}

export default NESTabs;