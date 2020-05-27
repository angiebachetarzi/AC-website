import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {designService } from '@/_services';

function List() {
    const [designs, setDesigns] = useState(null);

    useEffect(() => {
        designService.getAllDesigns().then(x => setDesigns(x));
    }, []);

    return (
        <div className="card-deck">
        {designs && designs.map(design =>
            <div className="card" key={design.designID}>
                <img src={design.designImage} className="card-img-top" alt="Card image"/>
                <div className="card-body">
                <h5 className="card-title">{design.designName}</h5>
                <p className="card-text">{design.designType}</p>
                <Link to={`designs/details/${design.designID}`} className="stretched-link btn btn-sm btn-primary">More</Link>
                </div>
            </div>
            )} 
        </div>
    );
}

export { List };