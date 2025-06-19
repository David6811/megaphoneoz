import React, { useState } from 'react';
import { HeaderProps, NavigationItem } from '../types';

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const navigationItems: NavigationItem[] = [
    { label: 'Home', href: '/' },
    { label: 'News', href: '#' },
    { label: 'Lifestyle', href: '#' },
    { label: 'Arts and Entertainment', href: '#' },
    { label: 'Opinion', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'About Us', href: '#' },
    { label: 'Coming Up', href: '#' },
  ];

  const handleMenuToggle = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuStyle: React.CSSProperties = {
    marginLeft: 'calc(-50vw + 50%)',
    height: '60px'
  };

  const linkStyle: React.CSSProperties = {
    height: '60px'
  };

  return (
    <header className={`bg-white sticky top-0 z-50 ${className}`}>
      <div className="max-w-6xl mx-auto flex flex-col p-0">
        <div className="flex items-center justify-between py-5 px-5 bg-white">
          <div className="flex items-center gap-2">
            <div className="text-4xl text-brand-red">📢</div>
            <h1 className="font-roboto font-black text-3xl tracking-wider m-0">
              <span className="text-brand-gray">MEGAPHONE</span>
              <span className="text-brand-red">OZ</span>
            </h1>
          </div>
          <button 
            className="hidden md:hidden lg:hidden text-2xl text-brand-red cursor-pointer p-1 md:block"
            onClick={handleMenuToggle}
            aria-label="Toggle menu"
            type="button"
          >
            ☰
          </button>
        </div>
        
        <nav className="w-screen bg-brand-red relative" style={menuStyle}>
          <ul className="list-none m-0 p-0 flex items-center justify-center gap-0 bg-brand-red w-full" style={linkStyle}>
            {navigationItems.map((item, index) => (
              <li key={index} className="relative">
                <a 
                  href={item.href} 
                  className="flex items-center px-6 text-white font-roboto font-semibold text-sm tracking-wide capitalize transition-all duration-300 whitespace-nowrap hover:bg-white hover:bg-opacity-10" 
                  style={linkStyle}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;