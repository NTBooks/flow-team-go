
import react, { useEffect, useState } from "react";
import useKeyPress from "../hooks/useKeyPress";
import NESTabs from "./NESTabs";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import useAudio from "../hooks/useAudio";
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
   
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const Fade = styled.div`
position: absolute;
width: 100%;
height:100%;
padding: 0 0 0 0;
margin: 0 0 0 0;
  ${props => props.out ?
    `display: none;`
    : `display: inline-block;`
  }
  animation: ${props => props.out ? fadeOut : fadeIn} 1s linear;
`;

const OuterBezel = styled.div`
width: 40rem;
height: 40rem;
position:relative;
background: #FDF8FE;
color: #2F3332;
opacity: 0.9;
margin: 2rem auto 0 auto;
border-radius: 1rem;
box-shadow: 0px 0px 1rem #FFFFFF;
`

const GameScreen = (props) => {

  const navigate = useNavigate();

  const location = useLocation();
  console.log(location);


  const rightPress = useKeyPress("ArrowRight");
  const leftPress = useKeyPress("ArrowLeft");
  const currWallet = useSelector(state => state.gamestate.gallery);

  const selectableObjects = [`/${currWallet}/a_team`, `/${currWallet}/b_team`, '/options', '/about'];
  const pathnamepart = location.pathname.substring(location.pathname.lastIndexOf("/"));

  const [selectedIndex, setSelectedIndex] = useState(0);


  const SFXState = useSelector(state => state.gamestate.sfx_toggle);


  const pageTurn = useAudio([require('url:../../public/sfx/PageTurn.wav')], false)[2];

  // todo: set current path on gamestate and then use dispatch to watch it. Router should set that path.
  useEffect(() => {
    setSelectedIndex(selectableObjects.findIndex(x => x.substring(x.lastIndexOf("/")) === pathnamepart));
  }, [location]);

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
    <Fade>
      {!props.hideTabs && <NESTabs currTab={selectedIndex + 1} setTab={setSelectedIndex} />}
      {props.children}
    </Fade>
  </OuterBezel>;

}

export default GameScreen;