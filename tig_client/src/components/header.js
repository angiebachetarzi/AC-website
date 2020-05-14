import React from 'react';
import '../styles/header.css';


class Header extends React.Component {

  render() {
    return (
      <div className="container-fluid">
       <h1>The Islander's Guide</h1>
       <nav className="navbar-expand-lg justify-content-center">
        <button className="btn navbar-nav-link">Home</button>
        <button className="btn navbar-nav-link">Designs</button>
        <button className="btn navbar-nav-link" >Critters</button>
        <button className="btn navbar-nav-link">Turnip</button>
        <button className="btn navbar-nav-link" id="logoff">Log off</button>
      </nav>
       
      </div>
    );
  }

}


export default Header;
