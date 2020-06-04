import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {critterService } from '@/_services';

function List({ match }) {
    const { path } = match;
    const [bugs, setBugs] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        critterService.getAllBugs().then(x => setBugs(x));
    }, []);

    let bugs_info_tab = []
    for(var bug in bugs) {
        bugs_info_tab.push(bugs[bug])
    }

    const handleChange = e => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        const results = bugs_info_tab.filter(info =>
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
            {searchResults && searchResults.length != 0 && searchResults.map(bug =>
                <div className="card" key={bug.id}>
                    <img src={bug.image_uri} className="card-img-top" alt="Card image"/>
                    <div className="card-body">
                        <p className="card-text">Name: {format_string(bug['file-name'])}</p>
                        <p className="card-text">Price: {bug.price} bells</p>
                        <p>{bug.availability.isAllYear? 
                        <span className="badge badge-pill badge-secondary text-monospace">All year</span>
                        :
                        <span className="badge badge-pill badge-secondary text-monospace">Not all year</span>
                        }
                        {bug.availability.isAllDay? 
                        <span className="badge badge-pill badge-secondary text-monospace">All day</span>
                        :
                        <span className="badge badge-pill badge-secondary text-monospace">Not all day</span>
                        }</p>
                        <Link to={`${path}/details/${bug.id}`} className="stretched-link btn btn-lg btn-outline-secondary">More</Link>
                    </div>
                </div>
                )} 
                {searchResults && searchResults.length == 0 && bugs_info_tab && bugs_info_tab.map(bug =>
                <div className="card" key={bug.id}>
                    <img src={bug.image_uri} className="card-img-top" alt="Card image"/>
                    <div className="card-body">
                        <p className="card-text">Name: {format_string(bug['file-name'])}</p>
                        <p className="card-text">Price: {bug.price} bells</p>
                        <p>{bug.availability.isAllYear? 
                        <span className="badge badge-pill badge-secondary text-monospace">All year</span>
                        :
                        <span className="badge badge-pill badge-secondary text-monospace">Not all year</span>
                        }
                        {bug.availability.isAllDay? 
                        <span className="badge badge-pill badge-secondary text-monospace">All day</span>
                        :
                        <span className="badge badge-pill badge-secondary text-monospace">Not all day</span>
                        }</p>
                        <Link to={`${path}/details/${bug.id}`} className="stretched-link btn btn-lg btn-outline-secondary">More</Link>
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