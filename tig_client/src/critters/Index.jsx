import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Fish } from './fish';
import { Bugs } from './bugs';

import './Index.css';

function Critters({ match }) {
    const { path } = match;
    
    return (
        <div className="p-5">
            <div className="container-full-bg">
            <Switch>
                <Route path={`${path}/fish`} component={Fish} />
                <Route path={`${path}/bugs`} component={Bugs} />
            </Switch>
            </div>
        </div>
    );
}

export { Critters };