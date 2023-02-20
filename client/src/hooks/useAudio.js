// Adapted from https://stackoverflow.com/questions/47686345/playing-sound-in-react-js
import { useState, useEffect } from "react";
import useKeyPress from "./useKeyPress";

const useAudio = (audioArray, loop) => {


    const [audio, setAudio] = useState(new Audio(audioArray[0]));
    const [playing, setPlaying] = useState(false);
    const [track, setTrack] = useState(0);

    audio.volume = 0.5;

    const toggle = (play) => { setPlaying(play) };

    useEffect(() => {
        playing ? audio.play() : audio.pause();
    },
        [playing]
    );

    const skip = () => {


        setTrack(state => state + 1 % audioArray.length);

        audio.src = audioArray[(track + 1) % audioArray.length];
        audio.play();
        console.log("Now Playing: " + audioArray[(track + 1) % audioArray.length]);
        setPlaying(true);
    };


    useEffect(() => {
        audio.addEventListener('ended', () => {
            // TODO: Sync issue here, should be a reducer
            // setTrack(state => state + 1 % audioArray.length);
            // setAudio(new Audio(audioArray[track + 1 % audioArray.length]));
            // setPlaying(true);
            if (loop) {
                skip();
            }

        });
        return () => {
            audio.removeEventListener('ended', () => setPlaying(false));
        };
    }, []);

    return [playing, toggle, skip];
};

export default useAudio;