import React from 'react';
import './navbar.css';
import userIcon from './assets/user-icon.svg';


const Navvybar = () => {
  return (
    <nav className="Navvybar">
      <div className="navbar-left">
        <a href="/" className="logo">
          Dihvik Dihtwani
        </a>
      </div>
      <div className="navbar-center">
        <ul className="nav-links">
          <li>
            <a href="/map">Map</a>
          </li>
        </ul>
      </div>
      <div className="navbar-right">
        <a href="/points" className="user-points">
          <span className="points">0</span>
        </a>
        <a href="/account" className="user-icon">
  <img src={userIcon} alt="User Icon" />
</a>

      </div>
    </nav>
  );
};

export default Navvybar;
