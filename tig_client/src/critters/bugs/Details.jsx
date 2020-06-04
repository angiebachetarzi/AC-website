import React, { useState, useEffect } from 'react';
import { critterService } from '@/_services';


function Details({ match }) {
    const { path } = match;
    const { bug_id } = match.params;
    const [bug, setBug] = useState(null);

    useEffect(() => {
        critterService.getBug(bug_id).then(x => setBug(x));
    }, []);

    const availability = bug? bug.availability: null;
    const north_availability = (bug && availability)? availability['month-array-northern']: null;
    const south_availability = (bug && availability)? availability['month-array-southern']: null;

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
            <img src={bug? bug.image_uri: null} alt="Card image"/>
            <p><span className="font-weight-bold">Name: </span><span>{bug? format_string(bug['file-name']): 'undefined'}</span></p>
            <p><span className="font-weight-bold">Price: </span><span>{bug? bug.price + ' bells': 'undefined'}</span></p>
            <p><span className="font-weight-bold">Northen islands availability: </span>
            {bug && north_availability.map(num => 
            <span key={num} className="badge badge-pill badge-secondary text-monospace">{monthNumToName(num)}</span>
            )}</p>
            <p><span className="font-weight-bold">Southern islands availability: </span>
            {bug && south_availability.map(num => 
            <span key={num} className="badge badge-pill badge-secondary text-monospace">{monthNumToName(num)}</span>
            )}</p>
            <p><span className="font-weight-bold">Time: </span><span>{(bug && availability.time)? availability.time: 'All day'}</span></p>
            <p><span className="font-weight-bold">Location: </span><span>{bug? availability.location: 'undefined'}</span></p>
            <p><span className="font-weight-bold">Rarity: </span><span>{bug? availability.rarity: 'undefined'}</span></p>
            <blockquote className="blockquote">
                <p className="mb-0">{bug? bug['museum-phrase']: 'undefined'}</p>
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