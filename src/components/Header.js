import React, { useState } from 'react';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    {
      title: 'NEWS',
      items: ['Politics', 'Local News', 'International', 'Breaking News']
    },
    {
      title: 'LIFESTYLE',
      items: ['Food & Drink', 'Travel', 'Health', 'Fashion']
    },
    {
      title: 'ARTS & ENTERTAINMENT',
      items: ['Music', 'Theatre', 'Film', 'Books', 'Visual Arts']
    },
    {
      title: 'OPINION',
      items: ['Editorial', 'Opinion Pieces', 'Letters']
    }
  ];

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="logo-section">
          <h1 className="site-logo">
            <span className="logo-text">MEGAPHONE</span>
            <span className="logo-accent">OZ</span>
          </h1>
        </div>
        
        <nav className="main-navigation">
          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          
          <ul className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''}`}>
            <li className="nav-item">
              <a href="/" className="nav-link">HOME</a>
            </li>
            {menuItems.map((section, index) => (
              <li key={index} className="nav-item dropdown">
                <a href="#" className="nav-link">{section.title}</a>
                <ul className="dropdown-menu">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <a href="#" className="dropdown-link">{item}</a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            <li className="nav-item">
              <a href="/about" className="nav-link">ABOUT US</a>
            </li>
            <li className="nav-item">
              <a href="/contact" className="nav-link">CONTACT</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;