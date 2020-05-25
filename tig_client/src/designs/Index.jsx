import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { List } from './List';
import { Upload } from './Upload';

import './Index.css';

function Designs({ match }) {
    const { path } = match;
    
    return (
        <div className="p-5">
            <div className="container-full-bg">
            <Switch>
                    <Route exact path={path} component={List} />
                    <Route exact path={`${path}/upload`} component={Upload} />
                </Switch>
            </div>
        </div>
    );
}

export { Designs };