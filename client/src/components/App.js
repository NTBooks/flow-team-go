
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


    return (
        <HelmetProvider>
            <Layout>

                <RouterProvider router={router} />

            </Layout>
        </HelmetProvider>);
}

export default App;