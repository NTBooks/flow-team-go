import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useAudio from '../hooks/useAudio';
import useKeyPress from '../hooks/useKeyPress';

const AudioPlayer = (props) => {
    const audioFiles = props.file ? [props.file] : [
        require('url:../../public/bgm/BeachBump.mp3'),
        require('url:../../public/bgm/MuteCityFluff.mp3'),
        require('url:../../public/bgm/DolphinWavvves.mp3'),
        require('url:../../public/bgm/DankTank.mp3'),
        require('url:../../public/bgm/sixampier.mp3')

    ];

    const [playing, toggle, skip] = useAudio(audioFiles, props.loop);
    const BGMState = useSelector(state => state.gamestate.bgm_toggle);

    useEffect(() => {

        if (BGMState) {
            skip();
        } else {
            toggle(false);
        }

    }, [BGMState]);

    const sPress = useKeyPress("s");

    useEffect(() => {
        if (BGMState && sPress) {
            skip();
        }
    }, [sPress]);

    return <></>;

}
export default AudioPlayer;

