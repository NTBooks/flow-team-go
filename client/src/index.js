import { Fragment } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from 'react-redux';
import App from "./components/App";
import store from './store/index';

import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Fragment>
    <HelmetProvider>
        <Provider store={store}>
            <App />
        </Provider>
    </HelmetProvider>
</Fragment>);
