import React, { cloneElement, useState, useEffect } from 'react';
import SelectableWrapper from './SelectableWrapper';
import { useSelector } from 'react-redux';
import useAudio from '../hooks/useAudio';

import useKeyPress from '../hooks/useKeyPress';

const TeamPane = (props) => {

    const SFXState = useSelector(state => state.gamestate.sfx_toggle);
    const blip = useAudio([require('url:../../public/sfx/Move.wav')], false)[2];
    const huzuh = useAudio([require('url:../../public/sfx/Select.wav')], false)[2];

    const [selectedIndex, setSelectedIndex] = useState(0);

    const downPress = useKeyPress("ArrowDown");
    const upPress = useKeyPress("ArrowUp");

    useEffect(() => {
        console.log("TEAM UP KEY PRESS");
        if (selectableObjects.length && upPress) {
            if (SFXState && selectedIndex > 0)
                blip();
            setSelectedIndex(prevState => (prevState > 0 ? prevState - 1 : prevState));
        }
    }, [upPress]);

    useEffect(() => {
        console.log("TEAM DOWN KEY PRESS");
        if (selectableObjects.length && downPress) {
            if (SFXState && selectedIndex < selectableObjects.length - 1)
                blip();
            setSelectedIndex(prevState => prevState < selectableObjects.length - 1 ? prevState + 1 : prevState);
        }
    }, [downPress]);

    // TODO: add row and col based selection with other arrow directions
    // TODO: add keys for A/B

    const selectableObjects = [
        <SelectableWrapper> Hello1 </SelectableWrapper>,
        <SelectableWrapper> Hello2 </SelectableWrapper>

    ];

    return <>
        <h1>Team {`${props.letter}`}</h1>
        {selectableObjects.map((x, i) => {

            const onCl = (e) => { console.log(i); setSelectedIndex(+i) };
            if (selectedIndex == i)
                return cloneElement(selectableObjects[i], { key: 'so' + i, isSelected: true, onClick: onCl });

            return cloneElement(selectableObjects[i], { key: 'so' + i, onClick: onCl });

        })}
    </>;
}

export default TeamPane;
