import React, { useState } from 'react';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="logo-section">
          <div className="logo-area">
            <div className="logo-icon">📢</div>
            <h1 className="site-logo">
              <span className="logo-text">MEGAPHONE</span>
              <span className="logo-accent">OZ</span>
            </h1>
          </div>
          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
        
        <nav className="main-navigation">
          
          <ul className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''}`}>
            <li className="nav-item">
              <a href="/" className="nav-link">Home</a>
            </li>
            <li className="nav-item dropdown">
              <a href="#" className="nav-link">News</a>
            </li>
            <li className="nav-item dropdown">
              <a href="#" className="nav-link">Lifestyle</a>
            </li>
            <li className="nav-item dropdown">
              <a href="#" className="nav-link">Arts and Entertainment</a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">Opinion</a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">Contact Us</a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">About Us</a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">Coming Up</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;