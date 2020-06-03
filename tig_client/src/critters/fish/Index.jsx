import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { List } from './List';
import { Details } from './Details';

function Fish({ match }) {
    const { path } = match;
    
    return (
        <div className="p-5">
            <div>
            <Switch>
                    <Route exact path={path} component={List} />
                    <Route path={`${path}/details/:fish_id`} component={Details} />
                </Switch>
            </div>
        </div>
    );
}

export { Fish };