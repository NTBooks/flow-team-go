import { Fragment } from "react";
import App from "./App";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from 'react-router-dom';
import store from './store/index';
import { Provider } from 'react-redux';

import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Fragment>

    <HelmetProvider>
        <BrowserRouter>
            <Provider store={store}>
                <App />
            </Provider>
        </BrowserRouter>
    </HelmetProvider>
</Fragment>);
