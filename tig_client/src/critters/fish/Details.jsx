import React, { useState, useEffect } from 'react';
import { critterService } from '@/_services';


function Details({ match }) {
    const { path } = match;
    const { fish_id } = match.params;
    const [fish, setFish] = useState(null);

    useEffect(() => {
        critterService.getFish(fish_id).then(x => setFish(x));
    }, []);

    const availability = fish? fish.availability: null;
    const north_availability = (fish && availability)? availability['month-array-northern']: null;
    const south_availability = (fish && availability)? availability['month-array-southern']: null;

    const months = [
        'January', 'February', 'March', 'April', 'May',
        'June', 'July', 'August', 'September',
        'October', 'November', 'December'
        ];
    
    function monthNumToName(monthnum) {
        return months[monthnum - 1] || '';
    }

    return (
        <div className="critters">
            <h1 className="display-5">Critter details</h1>
        <div className="jumbotron">
            <img src={fish? fish.image_uri: null} alt="Card image"/>
            <p><span className="font-weight-bold">Name: </span><span>{fish? format_string(fish['file-name']): 'undefined'}</span></p>
            <p><span className="font-weight-bold">Price: </span><span>{fish? fish.price + ' bells': 'undefined'}</span></p>
            <p><span className="font-weight-bold">Northen islands availability: </span>
            {fish && north_availability.map(num => 
            <span key={num} className="badge badge-pill badge-secondary text-monospace">{monthNumToName(num)}</span>
            )}</p>
            <p><span className="font-weight-bold">Southern islands availability: </span>
            {fish && south_availability.map(num => 
            <span key={num} className="badge badge-pill badge-secondary text-monospace">{monthNumToName(num)}</span>
            )}</p>
            <p><span className="font-weight-bold">Time: </span><span>{(fish && availability.time)? availability.time: 'All day'}</span></p>
            <p><span className="font-weight-bold">Location: </span><span>{fish? availability.location: 'undefined'}</span></p>
            <p><span className="font-weight-bold">Rarity: </span><span>{fish? availability.rarity: 'undefined'}</span></p>
            <blockquote className="blockquote">
                <p className="mb-0">{fish? fish['museum-phrase']: 'undefined'}</p>
                <footer className="blockquote-footer">Blathers The Owl</footer>
            </blockquote>
            
        </div>
        
    </div>
    );
}

function format_string(str) {
    let ch = str.charAt(0).toUpperCase() + str.slice(1);
    return ch.replace('_', ' ');
}

export { Details };