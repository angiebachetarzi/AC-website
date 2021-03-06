import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { accountService, designService } from '@/_services';

function Details() {
    const user = accountService.userValue, [designs, setDesigns] = useState(null);

    useEffect(() => {
        designService.getUserDesigns().then(x => setDesigns(x));
    }, []);

    return (
        <>
        <div className="jumbotron" id="profileDetails">
            <p className="lead font-weight-bold">Profile</p>
            <p><span className="lead font-weight-bold">Email: </span><span>{user.email}</span></p>
            <p><span className="lead font-weight-bold">Creator ID: </span><span>{user.creatorID}</span></p>
            <p><span className="lead font-weight-bold">Friend code: </span><span>{user.friendCode}</span></p>
            <p><a className="lead font-weight-bold" href="#">Need to update your profile? Contact us at info@the-islanders-guide.com!</a></p>
        </div>
        <div className="card-columns">
        {designs && designs.map(design =>
            <div className="card" key={design.designID}>
                <img src={design.designImage} className="card-img-top" alt="Card image"/>
                <div className="card-body">
                <h5 className="card-title">{design.designName}</h5>
                <span className="badge badge-pill badge-secondary text-monospace">{design.designType}</span>
                </div>
                <Link to={`designs/details/${design.designID}`} className="stretched-link btn btn-lg btn-outline-secondary">More</Link>
            </div>
            )} 
        </div>
    </>
    );
}

export { Details };