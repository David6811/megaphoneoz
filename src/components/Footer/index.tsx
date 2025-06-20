import React from 'react';
import ImageGallerySlider from '../ImageGallerySlider';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      {/* Image Gallery Slider at the top */}
      <div className="footer-gallery-section">
        <div className="footer-gallery-container">
          <ImageGallerySlider 
            autoPlay={true}
            autoPlayInterval={3000}
            visibleCount={8}
          />
        </div>
      </div>

      <div className="footer-content">
        {/* French Film Festival Section */}
        <div className="footer-section french-film">
          <h3 className="footer-title">FRENCH FILM FESTIVAL</h3>
          <div className="film-festival-image">
            <img 
              src="https://picsum.photos/400/250?random=festival" 
              alt="French Film Festival" 
            />
          </div>
        </div>

        {/* Newsletter Subscription Section */}
        <div className="footer-section newsletter">
          <h3 className="footer-title">YOUR MEGAPHONE OZ SUSCRIBE HERE!</h3>
          <div className="newsletter-form">
            <input 
              type="email" 
              placeholder="@" 
              className="newsletter-input"
            />
            <button className="newsletter-btn">SUBSCRIBE</button>
          </div>
          
          {/* Social Media Icons */}
          <div className="social-media-row">
            <a href="https://facebook.com/megaphoneoz" className="social-icon facebook">f</a>
            <a href="https://flickr.com/megaphoneoz" className="social-icon flickr">flickr</a>
            <a href="https://instagram.com/megaphoneoz" className="social-icon instagram">📷</a>
            <a href="https://twitter.com/megaphoneoz" className="social-icon twitter">🐦</a>
            <a href="https://youtube.com/megaphoneoz" className="social-icon youtube">▶</a>
          </div>
        </div>

        {/* Popular Posts Section */}
        <div className="footer-section popular-posts">
          <h3 className="footer-title">POPULAR POSTS</h3>
          <div className="popular-post">
            <div className="post-image">
              <img 
                src="https://picsum.photos/100/60?random=post1" 
                alt="Popular post" 
              />
            </div>
            <div className="post-content">
              <h4 className="post-title">FOOD REVIEW: KHANOM HOUSE DELIVERS SUBTLE SWEET INDULGENCE</h4>
              <div className="post-meta">
                <span className="post-date">May 24, 2025</span>
                <span className="post-comments">💬 3</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p className="copyright">
          <strong>Megaphone Oz</strong> Copyright © 2025.
        </p>
      </div>
    </footer>
  );
};

export default Footer;