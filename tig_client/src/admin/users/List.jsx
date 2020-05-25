import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { accountService } from '@/_services';

import './Index.css';

function List({ match }) {
    const { path } = match;
    const [users, setUsers] = useState(null);

    useEffect(() => {
        accountService.getAll().then(x => setUsers(x));
    }, []);

    function deleteUser(id) {
        setUsers(users.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        accountService.delete(id).then(() => {
            setUsers(users => users.filter(x => x.id !== id));
        });
    }

    return (
        <div className = "users">
            <h2>Managing Users</h2>
            <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Add User</Link>
            <div className="table-responsive">
                <table className="table table-hover">
                <thead>
                        <tr>
                            <th>Creator ID</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Friend code</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && users.map(user =>
                            <tr key={user.id}>
                                <td>{user.creatorID}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.friendCode}</td>
                                <td>
                                    <Link to={`${path}/edit/${user.id}`} className="btn btn-sm btn-primary">Edit</Link>
                                    <button onClick={() => deleteUser(user.id)} className="btn btn-sm btn-danger" disabled={user.isDeleting}>
                                        {user.isDeleting 
                                            ? <span className="spinner-border spinner-border-sm"></span>
                                            : <span>Delete</span>
                                        }
                                    </button>
                                </td>
                            </tr>
                        )}
                        {/* {!users &&
                            <tr>
                                <td colSpan="4" className="text-center">
                                    <span className="spinner-border spinner-border-lg align-center"></span>
                                </td>
                            </tr>
                        } */}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export { List };