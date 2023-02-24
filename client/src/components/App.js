
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
import styled from "styled-components";
import GalleryLoader from "./GalleryLoader";
import BattleMode from "./BattleMode";

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
        path: "/:gallery",
        element: <><GameScreen><TeamPane letter="A" key="teamA" /></GameScreen></>,
    },
    {
        path: "/:gallery/a_team",
        element: <><GameScreen><TeamPane letter="A" key="teamA" /></GameScreen></>,
    },
    {
        path: "/:gallery/b_team",
        element: <><GameScreen><TeamPane letter="B" key="teamB" /></GameScreen></>,
    },
    {
        path: "/versus",
        element: <><GameScreen><BattleMode /></GameScreen></>,
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

                <GalleryLoader />
            </Layout>

        </HelmetProvider>);
}

export default App;