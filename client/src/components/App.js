
import Layout from "./Layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import GameScreen from "./GameScreen";
import ComponentTester from "./ComponentTester";
import TeamPane from "./TeamPane";
import OptionsPane from "./OptionsPane";
import Intro from "./Intro";
import AudioPlayer from "./AudioPlayer";
import AboutPane from "./AboutPane";


const router = createBrowserRouter([
    {
        path: "/",
        element: <><GameScreen hideTabs={true}><Intro /></GameScreen></>,
    },
    {
        path: "/test",
        element: <><GameScreen>Test<ComponentTester /></GameScreen></>,
    },
    {
        path: "/g/:gallery",
        element: <></>,
    },
    {
        path: "/a_team",
        element: <><GameScreen><TeamPane letter="A" /></GameScreen></>,
    },
    {
        path: "/b_team",
        element: <><GameScreen><TeamPane letter="B" /></GameScreen></>,
    },
    {
        path: "/options",
        element: <><GameScreen><OptionsPane /></GameScreen></>,
    },
    {
        path: "/about",
        element: <><GameScreen><AboutPane /></GameScreen></>,
    },

    // TODO: routes for /g/gallery/a_team
    // TODO: routes for /g/gallery/b_team
    // TODO: routes for /options

]);

const App = () => {


    return (
        <HelmetProvider>
            <Layout>
                <AudioPlayer loop={true} />
                <RouterProvider router={router} />

            </Layout>
        </HelmetProvider>);
}

export default App;