import React, { cloneElement, useEffect, useState } from 'react';
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
