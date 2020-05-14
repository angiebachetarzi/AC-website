import React from 'react';
import '../styles/header.css';


class Header extends React.Component {

  render() {
    return (
      <div className="header">
       <p id="login">Logged in as </p>
       <p id="logoff"><a href="#log">Log off</a></p>
       <h1>The Islander's Guide</h1>
       <div className="nav">
        <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#critters">Critters</a></li>
            <li><a href="#turnip">Turnip</a></li>
            <li><a href="#designs">Designs</a></li>
        </ul>
       </div>
      </div>
    );
  }

}


export default Header;
