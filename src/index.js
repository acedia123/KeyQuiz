import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.scss';
import App from './App';
import './app/i18n';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from './app/redux/store';

ReactDOM.render(
    <Provider store={configureStore()}>
        <Router>
            <App />
        </Router>
    </Provider>,
    document.getElementById('root'),
);
