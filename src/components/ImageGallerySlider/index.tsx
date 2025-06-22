import React, { useState, useEffect } from 'react';
import './ImageGallerySlider.css';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title?: string;
  date?: string;
}

interface ImageGallerySliderProps {
  images?: GalleryImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  visibleCount?: number;
}

const ImageGallerySlider: React.FC<ImageGallerySliderProps> = ({
  images = [],
  autoPlay = true,
  autoPlayInterval = 3000,
  visibleCount = 8
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Default fallback images if none provided
  const defaultImages: GalleryImage[] = [
    {
      id: 1,
      src: "https://picsum.photos/200/150?random=1",
      alt: "Review: Skank Sinatra",
      title: "REVIEW: SKANK"
    },
    {
      id: 2,
      src: "https://picsum.photos/200/150?random=2",
      alt: "SU Anime Society",
      title: "SU ANIME"
    },
    {
      id: 3,
      src: "https://picsum.photos/200/150?random=3",
      alt: "Arts Review",
      title: "ARTS REVIEW"
    },
    {
      id: 4,
      src: "https://picsum.photos/200/150?random=4",
      alt: "Music Concert",
      title: "MUSIC"
    },
    {
      id: 5,
      src: "https://picsum.photos/200/150?random=5",
      alt: "Theatre Review",
      title: "THEATRE"
    },
    {
      id: 6,
      src: "https://picsum.photos/200/150?random=6",
      alt: "Film Festival",
      title: "FILM"
    },
    {
      id: 7,
      src: "https://picsum.photos/200/150?random=7",
      alt: "Cultural Event",
      title: "CULTURE"
    },
    {
      id: 8,
      src: "https://picsum.photos/200/150?random=8",
      alt: "Exhibition",
      title: "EXHIBITION"
    },
    {
      id: 9,
      src: "https://picsum.photos/200/150?random=9",
      alt: "Performance",
      title: "PERFORMANCE"
    },
    {
      id: 10,
      src: "https://picsum.photos/200/150?random=10",
      alt: "Gallery Opening",
      title: "GALLERY"
    }
  ];

  const galleryImages = images.length > 0 ? images : defaultImages;
  const totalImages = galleryImages.length;
  const maxIndex = Math.max(0, totalImages - visibleCount);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || totalImages <= visibleCount) return;

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => 
        prevIndex >= maxIndex ? 0 : prevIndex + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, maxIndex, totalImages, visibleCount]);

  const goToPrevious = () => {
    setCurrentIndex(prevIndex => 
      prevIndex <= 0 ? maxIndex : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex => 
      prevIndex >= maxIndex ? 0 : prevIndex + 1
    );
  };

  // Don't show navigation if all images fit
  const showNavigation = totalImages > visibleCount;

  const selectImage = (image: GalleryImage) => {
    setSelectedImage(selectedImage?.id === image.id ? null : image);
  };

  return (
    <div className="image-gallery-slider">
      <div className="gallery-container">
        {showNavigation && (
          <button 
            className="gallery-nav-btn gallery-prev" 
            onClick={goToPrevious}
            aria-label="Previous images"
          >
            &#8249;
          </button>
        )}
        
        <div className="gallery-viewport">
          <div 
            className="gallery-track"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`
            }}
          >
            {galleryImages.map((image) => (
              <div key={image.id} className={`gallery-item ${selectedImage?.id === image.id ? 'expanded' : ''}`}>
                <div 
                  className={`gallery-image-container ${selectedImage?.id === image.id ? 'selected' : ''}`}
                  onClick={() => selectImage(image)}
                >
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="gallery-image"
                  />
                  {image.title && !selectedImage && (
                    <div className="gallery-overlay">
                      <span className="gallery-title">{image.title}</span>
                    </div>
                  )}
                </div>
                {selectedImage?.id === image.id && (
                  <div className="gallery-text-area">
                    <h3 className="gallery-expanded-title">{image.title}</h3>
                    <p className="gallery-expanded-date">{image.date || "June 15, 2025"}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {showNavigation && (
          <button 
            className="gallery-nav-btn gallery-next" 
            onClick={goToNext}
            aria-label="Next images"
          >
            &#8250;
          </button>
        )}
      </div>

    </div>
  );
};

export default ImageGallerySlider;