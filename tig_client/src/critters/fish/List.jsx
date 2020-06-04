import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {critterService } from '@/_services';

function List({ match }) {
    const { path } = match;

    const [fishies, setFish] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        critterService.getAllFish().then(x => setFish(x));
    }, []);

    let fish_info_tab = []
    for(var fish in fishies) {
        fish_info_tab.push(fishies[fish])
    }

    const handleChange = e => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        const results = fish_info_tab.filter(info =>
            format_string(info['file-name']).toLowerCase().includes(searchTerm)
        );
        setSearchResults(results);
      }, [searchTerm]);

    return (
        <>
        <div className="input-group md-form form-sm form-1 pl-0">
            <input className="form-control my-0 py-1" type="text" placeholder="Search" aria-label="Search" value={searchTerm}
            onChange={handleChange} />
        </div>
        <div className="card-columns">
            {searchResults && searchResults.length != 0 && searchResults.map(fish =>
                <div className="card" key={fish.id}>
                    <img src={fish.image_uri} className="card-img-top" alt="Card image"/>
                    <div className="card-body">
                        <h5 className="card-text">Name: {format_string(fish['file-name'])}</h5>
                        <p className="card-text">Price: {fish.price}</p>
                        <p>{fish.availability.isAllYear? 
                        <span className="badge badge-pill badge-secondary text-monospace">All year</span>
                        :
                        <span className="badge badge-pill badge-secondary text-monospace">Not all year</span>
                        }
                        {fish.availability.isAllDay? 
                        <span className="badge badge-pill badge-secondary text-monospace">All day</span>
                        :
                        <span className="badge badge-pill badge-secondary text-monospace">Not all day</span>
                        }</p>
                        <Link to={`${path}/details/${fish.id}`} className="stretched-link btn btn-lg btn-outline-secondary">More</Link>
                    </div>
                </div>
                )} 
                {searchResults && searchResults.length == 0 && fish_info_tab && fish_info_tab.map(fish =>
                <div className="card" key={fish.id}>
                    <img src={fish.image_uri} className="card-img-top" alt="Card image"/>
                    <div className="card-body">
                        <h5 className="card-text">Name: {format_string(fish['file-name'])}</h5>
                        <p className="card-text">Price: {fish.price}</p>
                        <p>{fish.availability.isAllYear? 
                        <span className="badge badge-pill badge-secondary text-monospace">All year</span>
                        :
                        <span className="badge badge-pill badge-secondary text-monospace">Not all year</span>
                        }
                        {fish.availability.isAllDay? 
                        <span className="badge badge-pill badge-secondary text-monospace">All day</span>
                        :
                        <span className="badge badge-pill badge-secondary text-monospace">Not all day</span>
                        }</p>
                        <Link to={`${path}/details/${fish.id}`} className="stretched-link btn btn-lg btn-outline-secondary">More</Link>
                    </div>
                </div>
                )} 
        </div>
    </>
    );
}

function format_string(str) {
    let ch = str.charAt(0).toUpperCase() + str.slice(1);
    return ch.replace('_', ' ');
}

export { List };