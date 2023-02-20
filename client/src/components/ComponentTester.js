import React, { cloneElement, useState, useEffect } from 'react';
import SelectableWrapper from './SelectableWrapper';

import useKeyPress from '../hooks/useKeyPress';

const ComponentTester = () => {

    const [selectedIndex, setSelectedIndex] = useState(0);

    const downPress = useKeyPress("ArrowDown");
    const upPress = useKeyPress("ArrowUp");

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
        {selectableObjects.map((x, i) => {

            const onCl = (e) => { console.log(i); setSelectedIndex(+i) };
            if (selectedIndex == i)
                return cloneElement(selectableObjects[i], { key: 'so' + i, isSelected: true, onClick: onCl });

            return cloneElement(selectableObjects[i], { key: 'so' + i, onClick: onCl });

        })}
    </>;
}

export default ComponentTester;

// Select a slot, opens bank and select an NFT
// Select options, opens options submenu
// Submenu items can nest

// Add "selected" and "onA" and "onB" controls to components?