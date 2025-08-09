import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, useTheme, useMediaQuery } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { FeaturedSliderProps, SlideData } from '../../types';
import './FeaturedSlider.css';

const FeaturedSlider: React.FC<FeaturedSliderProps> = ({ slides = [] }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

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

  // Touch handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && slides.length > 1) {
      nextSlide();
    }
    if (isRightSwipe && slides.length > 1) {
      prevSlide();
    }
  };

  if (!slides || slides.length === 0) return null;

  const currentSlideData: SlideData = slides[currentSlide];

  // Handle image loading errors
  const handleImageError = (slideIndex: number) => {
    setImageErrors(prev => {
      const newSet = new Set(prev);
      newSet.add(slideIndex);
      return newSet;
    });
  };

  // Responsive height calculation
  const getSliderHeight = () => {
    if (isSmall) return 250;
    if (isMobile) return 300;
    return 400;
  };

  return (
    <Box 
      component="section" 
      sx={{ 
        position: 'relative',
        height: getSliderHeight(),
        overflow: 'hidden',
        mb: 0,
        width: '100%'
      }}
    >
      <Box 
        sx={{ 
          position: 'relative',
          width: '100%',
          height: '100%'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Box sx={{ 
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {!imageErrors.has(currentSlide) && (
            <Box
              component="img"
              src={currentSlideData.image}
              alt={currentSlideData.title}
              onError={() => handleImageError(currentSlide)}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          )}
          {imageErrors.has(currentSlide) && (
            <Box sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5',
              border: '2px dashed #ccc'
            }}>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', px: 2 }}>
                Image unavailable
              </Typography>
            </Box>
          )}
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            p: isSmall ? 2 : isMobile ? 3 : 5,
            color: 'white'
          }}>
            <Box sx={{ maxWidth: 600 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: isSmall ? '13px' : '14px',
                  color: '#ccc',
                  mb: 0.5,
                  display: 'block',
                  fontFamily: 'Roboto'
                }}
              >
                {currentSlideData.date}
              </Typography>
              <Box 
                sx={{ 
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  padding: isSmall ? '3px 8px' : '4px 12px',
                  fontSize: isSmall ? '11px' : '12px',
                  fontWeight: 700,
                  display: 'inline-block',
                  mb: isSmall ? 1 : 1.25,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontFamily: 'Roboto'
                }}
              >
                {currentSlideData.category}
              </Box>
              <Typography 
                variant="h2"
                component="h2"
                sx={{ 
                  fontSize: isSmall ? '20px' : isMobile ? '24px' : '28px',
                  fontWeight: 700,
                  m: 0,
                  lineHeight: 1.2,
                  color: 'white',
                  fontFamily: 'Roboto',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {currentSlideData.title}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {slides.length > 1 && (
          <Box sx={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            px: isSmall ? 2 : isMobile ? 2.5 : 3,
            pointerEvents: 'none'
          }}>
            <IconButton
              onClick={prevSlide}
              aria-label="Previous slide"
              sx={{
                backgroundColor: 'rgba(198, 8, 0, 0.8)',
                color: 'white',
                width: isSmall ? 40 : isMobile ? 45 : 50,
                height: isSmall ? 40 : isMobile ? 45 : 50,
                borderRadius: 0,
                fontSize: isSmall ? '16px' : '18px',
                pointerEvents: 'all',
                transition: 'all 0.3s ease',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: theme.palette.primary.main,
                  transform: 'scale(1.1)'
                },
                '&:active': {
                  transform: 'scale(0.95)'
                }
              }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={nextSlide}
              aria-label="Next slide"
              sx={{
                backgroundColor: 'rgba(198, 8, 0, 0.8)',
                color: 'white',
                width: isSmall ? 40 : isMobile ? 45 : 50,
                height: isSmall ? 40 : isMobile ? 45 : 50,
                borderRadius: 0,
                fontSize: isSmall ? '16px' : '18px',
                pointerEvents: 'all',
                transition: 'all 0.3s ease',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: theme.palette.primary.main,
                  transform: 'scale(1.1)'
                },
                '&:active': {
                  transform: 'scale(0.95)'
                }
              }}
            >
              <ChevronRight />
            </IconButton>
          </Box>
        )}
        
        {/* Slide indicators */}
        {slides.length > 1 && (
          <Box sx={{
            position: 'absolute',
            bottom: isSmall ? 15 : 20,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
            zIndex: 10
          }}>
            {slides.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentSlide(index)}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: index === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'white',
                    transform: 'scale(1.2)'
                  }
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FeaturedSlider;