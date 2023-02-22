import React, { cloneElement, useState, useEffect } from 'react';
import SelectableWrapper from './SelectableWrapper';
import { useSelector } from 'react-redux';
import useAudio from '../hooks/useAudio';
import useKeyPress from '../hooks/useKeyPress';
import GalleryLoader from './GalleryLoader';


const TeamPane = (props) => {



    return <>
        <h1>Team {`${props.letter}`}</h1>

    </>;
}

export default TeamPane;
