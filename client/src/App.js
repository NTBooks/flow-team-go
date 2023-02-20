import Layout from "./Layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';

const router = createBrowserRouter([
    {
        path: "/",
        element: <></>,
    },
    {
        path: "/g/:gallery",
        element: <></>,
    }

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