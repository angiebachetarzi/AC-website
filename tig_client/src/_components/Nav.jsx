import React, { useState, useEffect } from 'react';
import { NavLink, Route } from 'react-router-dom';

import { Role } from '@/_helpers';
import { accountService } from '@/_services';

import './Nav.css';

function Nav() {
    const [user, setUser] = useState({});

    useEffect(() => {
        const subscription = accountService.user.subscribe(x => setUser(x));
        return subscription.unsubscribe;
    }, []);

    // only show nav when logged in
    if (!user) return null;

    return (
        <nav className="navbar nav-justified navbar-expand-lg navbar-dark">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                <NavLink className="nav-item nav-link active" to="/">Profile</NavLink>
                <NavLink className="nav-item nav-link active" to="/designs">Designs</NavLink>
                <NavLink className="nav-item nav-link active" to="/designs/upload">Upload</NavLink>
                {user.role === Role.Admin &&
                    <NavLink to="/admin/users" className="nav-item nav-link active">Users</NavLink>
                }
                <a className="nav-item nav-link" href= "#" onClick={accountService.logout}>Logout</a>
                </div>
            </div>
        </nav>
    );
}
export { Nav }; 