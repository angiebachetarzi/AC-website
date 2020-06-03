import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {critterService } from '@/_services';

function List({ match }) {
    const { path } = match;
    const [bugs, setBugs] = useState(null);

    useEffect(() => {
        critterService.getAllBugs().then(x => setBugs(x));
    }, []);

    let bugs_info_tab = []
    for(var bug in bugs) {
        bugs_info_tab.push(bugs[bug])
    }

    return (
            <div className="card-columns">
            {bugs_info_tab && bugs_info_tab.map(bug =>
                <div className="card" key={bug.id}>
                    <img src={bug.image_uri} className="card-img-top" alt="Card image"/>
                    <div className="card-body">
                        <h5 className="card-title">Name: {bug['file-name'].replace('_', ' ')}</h5>
                        <p className="card-text">Price: {bug.price}</p>
                        <Link to={`${path}/details/${bug.id}`} className="stretched-link btn btn-sm btn-primary">More</Link>
                    </div>
                </div>
                )}  
            </div>
    );
}

export { List };