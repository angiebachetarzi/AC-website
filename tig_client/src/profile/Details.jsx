import React from 'react';
import { Link } from 'react-router-dom';

import { accountService } from '@/_services';

function Details({ match }) {
    const { path } = match;
    const user = accountService.userValue;

    return (
        <div className="profile clear-body">
            <h2>My Profile</h2>
            <p><strong>Username: </strong> {user.creatorID}</p>
            <p><strong>Email: </strong> {user.email}</p>
            <p><strong>Island code: </strong> {user.friendCode}</p>
            <p><Link to={`${path}/update`}>Update Profile</Link></p>
        </div>
    );
}

export { Details };