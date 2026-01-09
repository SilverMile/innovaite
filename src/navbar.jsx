import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import userIcon from './assets/user-icon.svg';


const Navvybar = () => {
  return (
    <nav className="Navvybar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          Dihvik Dihtwani
        </Link>
      </div>
      <div className="navbar-center">
        <ul className="nav-links">
          <li>
            <Link to="/map">Map</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-right">
        <Link to="/points" className="user-points">
          <span className="points">0</span>
        </Link>
        <Link to="/account" className="user-icon">
          <img src={userIcon} alt="User Icon" />
        </Link>
      </div>
    </nav>
  );
};

export default Navvybar;
