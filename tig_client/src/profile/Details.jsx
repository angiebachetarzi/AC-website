import React from 'react';
import { Link } from 'react-router-dom';

import { accountService } from '@/_services';

function Details({ match }) {
    const { path } = match;
    const user = accountService.userValue;

    return (
        <div className="profile">
            <h2>My Profile</h2>
            <p><strong>Username: </strong> {user.username}</p>
            <p><strong>Email: </strong> {user.email}</p>
            <p><strong>Island code: </strong> {user.islandCode}</p>
            <p><Link to={`${path}/update`}>Update Profile</Link></p>
        </div>
    );
}

export { Details };