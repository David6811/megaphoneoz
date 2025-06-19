import React, { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-50">
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
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
        
        <nav className="w-screen bg-brand-red relative" style={{marginLeft: 'calc(-50vw + 50%)', height: '60px'}}>
          <ul className="list-none m-0 p-0 flex items-center justify-center gap-0 bg-brand-red w-full" style={{height: '60px'}}>
            <li className="relative">
              <a href="/" className="flex items-center px-6 text-white font-roboto font-semibold text-sm tracking-wide capitalize transition-all duration-300 whitespace-nowrap hover:bg-white hover:bg-opacity-10" style={{height: '60px'}}>
                Home
              </a>
            </li>
            <li className="relative">
              <a href="#" className="flex items-center px-6 text-white font-roboto font-semibold text-sm tracking-wide capitalize transition-all duration-300 whitespace-nowrap hover:bg-white hover:bg-opacity-10" style={{height: '60px'}}>
                News
              </a>
            </li>
            <li className="relative">
              <a href="#" className="flex items-center px-6 text-white font-roboto font-semibold text-sm tracking-wide capitalize transition-all duration-300 whitespace-nowrap hover:bg-white hover:bg-opacity-10" style={{height: '60px'}}>
                Lifestyle
              </a>
            </li>
            <li className="relative">
              <a href="#" className="flex items-center px-6 text-white font-roboto font-semibold text-sm tracking-wide capitalize transition-all duration-300 whitespace-nowrap hover:bg-white hover:bg-opacity-10" style={{height: '60px'}}>
                Arts and Entertainment
              </a>
            </li>
            <li className="relative">
              <a href="#" className="flex items-center px-6 text-white font-roboto font-semibold text-sm tracking-wide capitalize transition-all duration-300 whitespace-nowrap hover:bg-white hover:bg-opacity-10" style={{height: '60px'}}>
                Opinion
              </a>
            </li>
            <li className="relative">
              <a href="#" className="flex items-center px-6 text-white font-roboto font-semibold text-sm tracking-wide capitalize transition-all duration-300 whitespace-nowrap hover:bg-white hover:bg-opacity-10" style={{height: '60px'}}>
                Contact Us
              </a>
            </li>
            <li className="relative">
              <a href="#" className="flex items-center px-6 text-white font-roboto font-semibold text-sm tracking-wide capitalize transition-all duration-300 whitespace-nowrap hover:bg-white hover:bg-opacity-10" style={{height: '60px'}}>
                About Us
              </a>
            </li>
            <li className="relative">
              <a href="#" className="flex items-center px-6 text-white font-roboto font-semibold text-sm tracking-wide capitalize transition-all duration-300 whitespace-nowrap hover:bg-white hover:bg-opacity-10" style={{height: '60px'}}>
                Coming Up
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;