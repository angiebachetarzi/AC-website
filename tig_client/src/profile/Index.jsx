import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Details } from './Details';

import './Index.css';

function Profile({ match }) {
    const { path } = match;
    
    return (
        <div className="p-5">
            <div className="container-full-bg">
                <Switch>
                    <Route exact path={path} component={Details} />
                </Switch>
            </div>
        </div>
    );
}

export { Profile };