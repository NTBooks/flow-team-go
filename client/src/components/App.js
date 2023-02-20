import react, { useEffect, useState } from "react";
import useKeyPress from "../hooks/useKeyPress";
import Layout from "./Layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import GameScreen from "./GameScreen";
import ComponentTester from "./ComponentTester";

// todo: right and left arrows navigate pages



const router = createBrowserRouter([
    {
        path: "/",
        element: <></>,
    },
    {
        path: "/test",
        element: <><GameScreen>Test<ComponentTester /></GameScreen></>,
    },
    {
        path: "/g/:gallery",
        element: <></>,
    }

    // TODO: routes for /g/gallery/a_team
    // TODO: routes for /g/gallery/b_team
    // TODO: routes for /options

]);

const App = () => {


    const [selectedIndex, setSelectedIndex] = useState(0);

    const rightPress = useKeyPress("ArrowRight");
    const leftPress = useKeyPress("ArrowLeft");

    const selectableObjects = ['/a_team', '/b_team', '/options', '/about'];

    useEffect(() => {
        if (selectableObjects.length && leftPress) {
            setSelectedIndex(prevState => (prevState > 0 ? prevState - 1 : prevState));
        }
    }, [leftPress]);

    useEffect(() => {
        if (selectableObjects.length && rightPress) {
            setSelectedIndex(prevState =>
                prevState < selectableObjects.length - 1 ? prevState + 1 : prevState
            );
        }
    }, [rightPress]);

    useEffect(() => {

        // TODO: navigate between the panes
        console.log(selectableObjects[selectedIndex]);
    }, [selectedIndex]);

    return (
        <HelmetProvider>
            <Layout>

                <RouterProvider router={router} />

            </Layout>
        </HelmetProvider>);
}

export default App;