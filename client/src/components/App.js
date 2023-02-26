
import { HelmetProvider } from 'react-helmet-async';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AboutPane from "./AboutPane";
import AudioPlayer from "./AudioPlayer";
import BattleMode from "./BattleMode";
import ComponentTester from "./ComponentTester";
import GalleryLoader from "./GalleryLoader";
import GameScreen from "./GameScreen";
import Intro from "./Intro";
import Layout from "./Layout";
import OptionsPane from "./OptionsPane";
import TeamPane from "./TeamPane";

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