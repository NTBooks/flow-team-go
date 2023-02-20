import React, { useEffect } from 'react';
import styled, { keyframes } from "styled-components";
import { useNavigate } from 'react-router-dom';

// todo: right and left arrows navigate pages

const CenterDivContainer = styled.div`
padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height:100%;
`

const FlexItem = styled.div`

  width: 100%;
  height: 2rem;
  text-align: center;
`
const Intro = (props) => {

    const navigate = useNavigate();

    useEffect(() => {

        setTimeout(() => {
            navigate('/a_team');
        }, 3000);

    }, []);

    return <CenterDivContainer><FlexItem>2023 Nick Tantillo<br />released under MIT license.</FlexItem></CenterDivContainer>;

}

export default Intro;