import React, { useState, useEffect } from 'react';
import { critterService } from '@/_services';


function Details({ match }) {
    const { path } = match;
    const { fish_id } = match.params;
    const [fish, setFish] = useState(null);

    useEffect(() => {
        critterService.getFish(fish_id).then(x => setFish(x));
    }, []);

    return (
        <div className="designs">
            <h1 className="display-5">Critter details</h1>
        <div className="jumbotron">
            <img src={fish? fish.image_uri: null} alt="Card image"/>
            <p><span className="lead">Name: </span><span>{fish? fish['file-name'].replace('_', ' '): 'undefined'}</span></p>
            <p><span className="lead">Price: </span><span>{fish? fish.price: 'undefined'}</span></p>
            <p><span className="lead">Phrase in museum: </span><span>{fish? fish['museum-phrase']: 'undefined'}</span></p>
            
        </div>
        
    </div>
    );
}

export { Details };