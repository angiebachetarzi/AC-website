import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {critterService } from '@/_services';

function List({ match }) {
    const { path } = match;

    const [fishies, setFish] = useState(null);

    useEffect(() => {
        critterService.getAllFish().then(x => setFish(x));
    }, []);

    let fishies_info_tab = []
    for(var fish in fishies) {
        fishies_info_tab.push(fishies[fish])
    }

    return (
        <div className="card-columns">
            {fishies_info_tab && fishies_info_tab.map(fish =>
                <div className="card" key={fish.id}>
                    <img src={fish.image_uri} className="card-img-top" alt="Card image"/>
                    <div className="card-body">
                        <h5 className="card-title">Name: {fish['file-name'].replace('_', ' ')}</h5>
                        <p className="card-text">Price: {fish.price}</p>
                        <Link to={`${path}/details/${fish.id}`} className="stretched-link btn btn-sm btn-primary">More</Link>
                    </div>
                </div>
                )}  
        </div>
    );
}

export { List };