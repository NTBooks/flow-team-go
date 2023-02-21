/* Adapted from: https://stackoverflow.com/questions/42036865/react-how-to-navigate-through-list-by-arrow-keys */
import React, { cloneElement, useState, useEffect } from 'react';

const useKeyPress = function (targetKey) {
    const [keyPressed, setKeyPressed] = useState(false);


    React.useEffect(() => {
        function downHandler(e) {

            if (e.key === targetKey) {
                e.preventDefault();
                setKeyPressed(true);
            }

        }

        const upHandler = (e) => {

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


            // window.dispatchEvent(new KeyboardEvent('keydown', {
            //     'key': e.key
            // }));

            // window.dispatchEvent(new KeyboardEvent('keyup', {
            //     'key': e.key
            // }));

            console.log("FAKE KEY: " + e.key);
        }

        window.addEventListener("keydown", downHandler);
        window.addEventListener("keyup", upHandler);

        document.addEventListener("fakekeypress", fakeHandler);

        return () => {
            window.removeEventListener("keydown", downHandler);
            window.removeEventListener("keyup", upHandler);
            document.removeEventListener("fakekeypress", fakeHandler);
        };
    }, [targetKey]);

    return keyPressed;
};

export default useKeyPress;