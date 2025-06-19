import React, { useState, useEffect } from 'react';
import './FeaturedSlider.css';

const FeaturedSlider = ({ slides = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (!slides || slides.length === 0) return null;

  const currentSlideData = slides[currentSlide];

  return (
    <section className="featured-slider">
      <div className="slider-container">
        <div className="slide active">
          <img 
            src={currentSlideData.image} 
            alt={currentSlideData.title}
            className="slide-image"
          />
          <div className="slide-overlay">
            <div className="slide-content">
              <div className="slide-date">{currentSlideData.date}</div>
              <div className="slide-category">{currentSlideData.category}</div>
              <h2 className="slide-title">{currentSlideData.title}</h2>
            </div>
          </div>
        </div>
        
        {slides.length > 1 && (
          <div className="slider-nav">
            <button 
              className="nav-btn prev" 
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              ❮
            </button>
            <button 
              className="nav-btn next" 
              onClick={nextSlide}
              aria-label="Next slide"
            >
              ❯
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedSlider;