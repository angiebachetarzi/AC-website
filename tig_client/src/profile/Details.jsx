import React, { useState, useEffect } from 'react';
import { accountService, designService } from '@/_services';

function Details({ match }) {
    const { path } = match;
    const user = accountService.userValue, [designs, setDesigns] = useState(null);

    useEffect(() => {
        designService.getUserDesigns().then(x => setDesigns(x));
    }, []);

    function deleteDesign(design_id) {
        setDesigns(designs.map(x => {
            if (x.design_id === design_id) { x.isDeleting = true; }
            return x;
        }));
        designService.delete(design_id).then(() => {
            setDesigns(designs => designs.filter(x => x.design_id !== design_id));
        });
    }

    return (
        <>
        <div className="jumbotron" id="profileDetails">
            <h1 className="display-5">Profile</h1>
            <p><span className="lead">Email: </span><span>{user.email}</span></p>
            <p><span className="lead">Creator ID: </span><span>{user.creatorID}</span></p>
            <p><span className="lead">Friend code: </span><span>{user.friendCode}</span></p>
            <p><a className="lead">Need to update your profile? Contact us!</a></p>
        </div>
        <div className="card-deck">
        {designs && designs.map(design =>
            <div className="card" key={design.designID}>
                <img src={design.designImage} className="card-img-top" alt="Card image"/>
                <div className="card-body">
                <h5 className="card-title">{design.designName}</h5>
                <p className="card-text">{design.designType}</p>
                <a href="#" className="stretched-link"></a>
                </div>
            </div>
            )} 
        </div>
    </>
    );
}

export { Details };