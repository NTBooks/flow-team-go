import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useAudio from '../hooks/useAudio';
import useKeyPress from '../hooks/useKeyPress';
import styled from 'styled-components';

const FlexItem = styled.div`

  width: 100%;
  height: 2rem;
  text-align: center;
`

const SFXMenu = (props) => {

    const selectableObjects = props.selectableObjects;
    const mainMenuHandler = props.mainMenuHandler;
    const exiting = props.exiting;

    const SFXState = useSelector(state => state.gamestate.sfx_toggle);
    const blip = useAudio([require('url:../../public/sfx/Move.wav')], false)[2];
    const huzuh = useAudio([require('url:../../public/sfx/Select.wav')], false)[2];

    const [selectedIndex, setSelectedIndex] = useState(0);

    const downPress = useKeyPress("ArrowDown");
    const upPress = useKeyPress("ArrowUp");

    useEffect(() => {

        if (!exiting && selectableObjects.length && upPress) {
            if (SFXState && selectedIndex > 0)
                blip();
            setSelectedIndex(prevState => (prevState > 0 ? prevState - 1 : prevState));
        }
    }, [upPress]);

    useEffect(() => {
        if (!exiting && selectableObjects.length && downPress) {
            if (SFXState && selectedIndex < selectableObjects.length - 1)
                blip();
            setSelectedIndex(prevState => prevState < selectableObjects.length - 1 ? prevState + 1 : prevState);
        }
    }, [downPress]);

    return <> {selectableObjects.map((x, i) => {

        const onCl = (e) => { console.log(i); setSelectedIndex(+i) };
        if (selectedIndex == i)
            return <FlexItem key={'flex' + i}><div>{React.cloneElement(selectableObjects[i].ctrl, { key: 'menu' + i, isSelected: true, onClick: (e) => { onCl(); mainMenuHandler(selectableObjects[i].val); } })}</div></FlexItem>;

        return <FlexItem key={'flex' + i}><div>{React.cloneElement(selectableObjects[i].ctrl, { key: 'menu' + i, onClick: (e) => { onCl(); mainMenuHandler(selectableObjects[i].val); } })}</div></FlexItem>;

    })}</>;


}

export default SFXMenu;