import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navigation.css';

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const getNavLinkClass = ({ isActive }) => isActive ? "links active-link" : "links";
  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
      <nav className="navbar">
          <button className={`menu-toggle ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
          </button>
          <div className={`nav-links ${isOpen ? 'active' : ''}`}>
              <NavLink to="/" className={getNavLinkClass} onClick={closeMenu}>About Me</NavLink>
              <NavLink to="/portfolio" className={getNavLinkClass} onClick={closeMenu}>Portfolio</NavLink>
              <NavLink to="/contact" className={getNavLinkClass} onClick={closeMenu}>Contact</NavLink>
              <NavLink to="/resume" className={getNavLinkClass} onClick={closeMenu}>Resume</NavLink>
          </div>
      </nav>
  );
}

export default Navigation;