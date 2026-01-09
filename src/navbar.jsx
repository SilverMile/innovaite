import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import './App.css';
import userIcon from './assets/user-icon.svg';
import { getStoredUser } from './utils/userStorage';

const Navvybar = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const existingUser = getStoredUser();
    if (existingUser) {
      setCurrentUser(existingUser);
    }
  }, []);

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
        {currentUser && (
  <Link to="/points" className="user-points">
    <span className="points">0</span>
  </Link>
)}


        {currentUser ? (
          <Link to="/account" className="user-icon">
            <img src={userIcon} alt="User Icon" />
          </Link>
        ) : (
          <Link to="/login" className="login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navvybar;
