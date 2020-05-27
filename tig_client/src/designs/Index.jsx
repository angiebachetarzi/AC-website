import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { List } from './List';
import { UploadUpdate } from './UploadUpdate';
import { Details } from './Details';

import './Index.css';

function Designs({ match }) {
    const { path } = match;
    
    return (
        <div className="p-5">
            <div className="container-full-bg">
            <Switch>
                    <Route exact path={path} component={List} />
                    <Route path={`${path}/details/:design_id`} component={Details} />
                    <Route path={`${path}/upload`} component={UploadUpdate} />
                    <Route path={`${path}/edit/:design_id`} component={UploadUpdate} />
                </Switch>
            </div>
        </div>
    );
}

export { Designs };