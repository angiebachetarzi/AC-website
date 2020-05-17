import React from 'react';
import API from "../utils/API";
import '../styles/header.css';


class Header extends React.Component {

  disconnect = () => {
    API.logout();
    window.location = "/";
  };

  render() {
    return (
      <div className="container-fluid">
       <h1>The Islander's Guide</h1>
       <nav className="navbar-expand-lg justify-content-center">
        <button className="btn navbar-nav-link">Home</button>
        <button className="btn navbar-nav-link">Designs</button>
        <button className="btn navbar-nav-link" >Critters</button>
        <button className="btn navbar-nav-link">Turnip</button>
        <button className="btn navbar-nav-link" onClick={this.disconnect} id="logoff">Log off</button>
      </nav>
       
      </div>
    );
  }

}


export default Header;
