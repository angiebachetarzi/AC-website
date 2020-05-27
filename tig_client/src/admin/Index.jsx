import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Users } from './users';

function Admin({ match }) {
    const { path } = match;

    return (
        <div className="p-5">
            <div className="container-full-bg">
                <Switch>
                    <Route path={`${path}/users`} component={Users} />
                </Switch>
            </div>
        </div>
    );
}

export { Admin };