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
            <h1 className="display-5">Profile</h1>
            <p><span className="lead">Email: </span><span>{user.email}</span></p>
            <p><span className="lead">Creator ID: </span><span>{user.creatorID}</span></p>
            <p><span className="lead">Friend code: </span><span>{user.friendCode}</span></p>
            <p><a className="lead" href="#">Need to update your profile? Contact us at weloveyou@jk.com!</a></p>
        </div>
        <div className="card-deck">
        {designs && designs.map(design =>
            <div className="card" key={design.designID}>
                <img src={design.designImage} alt="Card image"/>
                <div className="card-body">
                <h5 className="card-title">{design.designName}</h5>
                <p className="card-text">{design.designType}</p>
                <Link to={`designs/details/${design.designID}`} className="stretched-link btn btn-sm btn-primary">More</Link>
                </div>
            </div>
            )} 
        </div>
    </>
    );
}

export { Details };