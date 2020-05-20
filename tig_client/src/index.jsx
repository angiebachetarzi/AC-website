import React from 'react';
import { Router } from 'react-router-dom';
import { render } from 'react-dom';

import { history } from './_helpers';
import { App } from './app';

import './index.css';

render(
    <Router history={history}>
        <App />
    </Router>,
    document.getElementById('app')
);