import React from 'react';

import { accountService } from '@/_services';

import './Index.css'

function Home() {
    const user = accountService.userValue;
    
    return (
        <div className="home">
            <div className="container">
                <h2>Hi {user.username}!</h2>
                <p>You're logged in!!</p>
            </div>
        </div>
    );
}

export { Home };