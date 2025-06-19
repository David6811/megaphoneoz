import React, { useState, useEffect } from 'react';
import { FeaturedSliderProps, SlideData } from '../types';
import './FeaturedSlider.css';

const FeaturedSlider: React.FC<FeaturedSliderProps> = ({ slides = [] }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    if (slides.length > 1) {
      const timer: NodeJS.Timeout = setInterval(() => {
        setCurrentSlide((prev: number) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  const nextSlide = (): void => {
    setCurrentSlide((prev: number) => (prev + 1) % slides.length);
  };

  const prevSlide = (): void => {
    setCurrentSlide((prev: number) => (prev - 1 + slides.length) % slides.length);
  };

  if (!slides || slides.length === 0) return null;

  const currentSlideData: SlideData = slides[currentSlide];

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
              type="button"
            >
              ❮
            </button>
            <button 
              className="nav-btn next" 
              onClick={nextSlide}
              aria-label="Next slide"
              type="button"
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