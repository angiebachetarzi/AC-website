import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { accountService, designService,alertService } from '@/_services';

import './Index.css';

function Details({ history, match }) {
    const { path } = match;
    const { design_id } = match.params;
    const user = accountService.userValue, [design, setDesign] = useState(null);

    useEffect(() => {
        designService.getDesign(design_id).then(x => setDesign(x));
    }, []);

    function delDesign(design_id) {
        design.isDeleting = true;
        designService.deleteDesign(user.id, design_id)
        .then(() => {
            alertService.success('Delete successful', { keepAfterRouteChange: true });
            history.push('..');
        })
        .catch(error => {
            design.isDeleting = false;
            alertService.error(error);
        });
    }

    return (
        <div className="designs">
            <h1 className="display-5">Design details</h1>
        <div className="jumbotron" id="profileDetails">
            <img src={design? design.designImage: null} alt="Card image"/>
            <p><span className="lead">Design name: </span><span>{design? design.designName: null}</span></p>
            <p><span className="lead">Design ID: </span><span>{design? design.designID: null}</span></p>
            <p><span className="lead">Design type: </span><span>{design? design.designType: null}</span></p>
            {
                design && design.userID.id == user.id? <Link to={`../edit/${design? design.designID: null}`} className="btn btn-sm btn-primary">Edit</Link> : null
            }
            {
                design && design.userID.id == user.id? <button onClick={() => delDesign(design? design.designID: null)} disabled={design? design.isDeleting : null} className="btn btn-sm btn-danger" >
                                                        {design && design.isDeleting 
                                                            ? <span className="spinner-border spinner-border-sm"></span>
                                                            : <span>Delete</span>
                                                        }
                                                    </button>
                                                    : null
            }
            
        </div>
        
    </div>
    );
}

export { Details };