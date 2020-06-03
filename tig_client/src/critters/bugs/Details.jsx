import React, { useState, useEffect } from 'react';
import { critterService } from '@/_services';


function Details({ match }) {
    const { path } = match;
    const { bug_id } = match.params;
    const [bug, setBug] = useState(null);

    useEffect(() => {
        critterService.getBug(bug_id).then(x => setBug(x));
    }, []);
    
    return (
        <div className="designs">
            <h1 className="display-5">Critter details</h1>
        <div className="jumbotron">
            <img src={bug? bug.image_uri: null} alt="Card image"/>
            <p><span className="lead">Name: </span><span>{bug? format_string(bug['file-name']): 'undefined'}</span></p>
            <p><span className="lead">Price: </span><span>{bug? bug.price + ' bells': 'undefined'}</span></p>
            <p><span className="lead">Phrase in museum: </span><span>{bug? bug['museum-phrase']: 'undefined'}</span></p>
            
        </div>
        
    </div>
    );
}

function format_string(str) {
    let ch = str.charAt(0).toUpperCase() + str.slice(1);
    return ch.replace('_', ' ');
}

export { Details };