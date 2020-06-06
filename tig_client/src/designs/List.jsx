import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {designService } from '@/_services';

function List() {
    const [designs, setDesigns] = useState(null);

    useEffect(() => {
        designService.getAllDesigns().then(x => setDesigns(x));
    }, []);

    return (
        <div className="card-columns">
        {designs && designs.map(design =>
            <div className="card mb-3" key={design.designID}>
                <img src={design.designImage} className="card-img-top" alt="Card image"/>
                <div className="card-body">
                <h5 className="card-title">{design.designName}</h5>
                <span className="badge badge-pill badge-secondary text-monospace">{design.designType}</span>
                </div>
                <Link to={`designs/details/${design.designID}`} className="stretched-link btn btn-lg btn-outline-secondary">More</Link>
            </div>
            )} 
        </div>
    );
}

export { List };