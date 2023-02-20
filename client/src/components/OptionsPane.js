import React, { cloneElement, useState, useEffect } from 'react';
import SelectableWrapper from './SelectableWrapper';

import useKeyPress from '../hooks/useKeyPress';

const TeamPane = (props) => {

    const [selectedIndex, setSelectedIndex] = useState(0);

    const downPress = useKeyPress("ArrowDown");
    const upPress = useKeyPress("ArrowUp");
    const spacePress = useKeyPress("Space");
    const aPress = useKeyPress("KeyA");

    useEffect(() => {
        if (selectableObjects.length && upPress) {
            setSelectedIndex(prevState => (prevState > 0 ? prevState - 1 : prevState));
        }
    }, [upPress]);

    useEffect(() => {
        if (selectableObjects.length && downPress) {
            setSelectedIndex(prevState =>
                prevState < selectableObjects.length - 1 ? prevState + 1 : prevState
            );
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
