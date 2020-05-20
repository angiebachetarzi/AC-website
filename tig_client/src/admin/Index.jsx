import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Users } from './users';

function Admin({ match }) {
    const { path } = match;

    return (
        <div >
            <div className="container">
                <Switch>
                    <Route path={`${path}/users`} component={Users} />
                </Switch>
            </div>
        </div>
    );
}

export { Admin };