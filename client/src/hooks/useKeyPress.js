/* Adapted from: https://stackoverflow.com/questions/42036865/react-how-to-navigate-through-list-by-arrow-keys */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const useKeyPress = function (targetKey) {
    const [keyPressed, setKeyPressed] = useState(false);

    const disableKeylisteners = useSelector(state => state.gamestate.disableKeylisteners);

    React.useEffect(() => {
        function downHandler(e) {

            if (disableKeylisteners) return;

            if (e.key === targetKey) {
                e.preventDefault();
                setKeyPressed(true);
            }

        }

        const upHandler = (e) => {

            if (disableKeylisteners) return;

            if (e.key === targetKey) {
                e.preventDefault();
                setKeyPressed(false);
            }
        };

        function fakeHandler(e) {

            if (e.key === targetKey) {
                setKeyPressed(true);
            }

            // Add a fake delay
            setTimeout(() => {
                if (e.key === targetKey) {
                    setKeyPressed(false);
                }
            }, 10);
        }

        window.addEventListener("keydown", downHandler);
        window.addEventListener("keyup", upHandler);

        document.addEventListener("fakekeypress", fakeHandler);

        return () => {
            window.removeEventListener("keydown", downHandler);
            window.removeEventListener("keyup", upHandler);
            document.removeEventListener("fakekeypress", fakeHandler);
        };
    }, [targetKey, disableKeylisteners]);

    return keyPressed;
};

export default useKeyPress;