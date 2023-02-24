import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useAudio from '../hooks/useAudio';
import useKeyPress from '../hooks/useKeyPress';
import styled from 'styled-components';

const FlexItem = React.memo(styled.div`

  width: 100%;
  min-height: 2rem;
  text-align: center;
`);

const SFXMenu = (props) => {

    const selectableObjects = props.selectableObjects;
    const mainMenuHandler = props.mainMenuHandler;
    const exiting = props.exiting;

    const SFXState = useSelector(state => state.gamestate.sfx_toggle);
    const blip = useAudio([require('url:../../public/sfx/Move.wav')], false)[2];
    const huzuh = useAudio([require('url:../../public/sfx/Select.wav')], false)[2];
    const cancel = useAudio([require('url:../../public/sfx/Cancel.wav')], false)[2];

    const [selectedIndex, setSelectedIndex] = useState(0);

    const downPress = useKeyPress("ArrowDown");
    const upPress = useKeyPress("ArrowUp");
    const aPress = useKeyPress("a");
    const bPress = useKeyPress("b");
    const enterPress = useKeyPress("Enter");
    const spacePress = useKeyPress("Space");

    useEffect(() => {

        if (!exiting && selectableObjects.length && upPress) {
            if (SFXState && selectedIndex > 0)
                blip();
            setSelectedIndex(prevState => (prevState > 0 ? prevState - 1 : prevState));
            document.getElementById("flex" + (selectedIndex - 1))?.scrollIntoView();
        }
    }, [upPress]);

    useEffect(() => {
        if (!exiting && selectableObjects.length && downPress) {
            if (SFXState && selectedIndex < selectableObjects.length - 1)
                blip();
            setSelectedIndex(prevState => prevState < selectableObjects.length - 1 ? prevState + 1 : prevState);
            document.getElementById("flex" + (selectedIndex - 1))?.scrollIntoView();

        }
    }, [downPress]);

    useEffect(() => {
        if (!exiting && selectableObjects.length && (aPress || enterPress || spacePress)) {
            if (SFXState && selectedIndex < selectableObjects.length - 1)
                huzuh();

            mainMenuHandler(selectableObjects[selectedIndex].val);
            //setSelectedIndex(prevState => prevState < selectableObjects.length - 1 ? prevState + 1 : prevState);
        }
    }, [aPress, enterPress, spacePress]);

    useEffect(() => {

        if (!exiting && bPress) {

            cancel();
            //setSelectedIndex(prevState => prevState < selectableObjects.length - 1 ? prevState + 1 : prevState);

            if (props.onCancel) {
                props.onCancel();
            }
        }
    }, [bPress]);

    const retVal = selectableObjects.map((x, i) => {

        const onCl = (e) => { console.log(i); setSelectedIndex(+i) };
        if (selectedIndex == i)
            return <FlexItem style={selectableObjects[i].ctrl.props.style} key={(props.setkey ? props.setkey : 'flex') + i} id={'flex' + i}>{React.cloneElement(selectableObjects[i].ctrl, { key: 'menu' + i, isSelected: true, onClick: (e) => { onCl(); mainMenuHandler(selectableObjects[i].val); } })}</FlexItem>;

        return <FlexItem style={selectableObjects[i].ctrl.props.style} key={(props.setkey ? props.setkey : 'flex') + i} id={'flex' + i}>{React.cloneElement(selectableObjects[i].ctrl, { key: 'menu' + i, onClick: (e) => { onCl(); mainMenuHandler(selectableObjects[i].val); } })}</FlexItem>;

    });



    return <> {retVal}</>;


}

export default React.memo(SFXMenu);