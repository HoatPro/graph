import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import App from './pages/App';
import configureStore from "./redux/store";
import * as serviceWorker from './serviceWorker';
import {Provider} from 'react-redux';
import {CookiesProvider} from 'react-cookie';

ReactDOM.render(
    <CookiesProvider>
        <BrowserRouter>
            <Provider store={configureStore()}>
                <App/>
            </Provider>
        </BrowserRouter>
    </CookiesProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
