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
        <div>
            <nav className="navbar navbar-expand navbar-dark ">
                <div className="navbar-nav">
                    <NavLink exact to="/" className="nav-item nav-link col-md-6"><button className="btn btn-default active">Home</button></NavLink>
                    <NavLink to="/profile" className="nav-item nav-link col-md-6"><button className="btn btn-default">Profile</button></NavLink>
                    <NavLink to="/designs" className="nav-item nav-link col-md-6"><button className="btn btn-default">Designs</button></NavLink>
                    {user.role === Role.Admin &&
                        <NavLink to="/admin/users" className="nav-item nav-link col-md-6"><button className="btn btn-default">Users</button></NavLink>
                    }
                    <a onClick={accountService.logout} className="nav-item nav-link col-md-6"><button className="btn btn-default">Logout</button></a>
                </div>
            </nav>
            
        </div>
    );
}
export { Nav }; 