import React, { useState, useEffect } from 'react';
import ImageGallerySlider from '../ImageGallerySlider';
import WordPressNewsService from '../../services/wordpressNewsService';
import './Footer.css';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title?: string;
  date?: string;
}

const Footer: React.FC = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  // Fallback images
  const fallbackImages: GalleryImage[] = [
    {
      id: 1,
      src: "https://picsum.photos/200/150?random=1",
      alt: "Review: Skank Sinatra",
      title: "REVIEW: SKANK",
      date: "June 15, 2025"
    },
    {
      id: 2,
      src: "https://picsum.photos/200/150?random=2",
      alt: "SU Anime Society",
      title: "SU ANIME",
      date: "June 15, 2025"
    },
    {
      id: 3,
      src: "https://picsum.photos/200/150?random=3",
      alt: "Arts Review",
      title: "ARTS REVIEW",
      date: "June 13, 2025"
    },
    {
      id: 4,
      src: "https://picsum.photos/200/150?random=4",
      alt: "Music Concert",
      title: "MUSIC",
      date: "June 1, 2025"
    },
    {
      id: 5,
      src: "https://picsum.photos/200/150?random=5",
      alt: "Theatre Review",
      title: "THEATRE",
      date: "May 28, 2025"
    },
    {
      id: 6,
      src: "https://picsum.photos/200/150?random=6",
      alt: "Film Festival",
      title: "FILM",
      date: "May 25, 2025"
    },
    {
      id: 7,
      src: "https://picsum.photos/200/150?random=7",
      alt: "Cultural Event",
      title: "CULTURE",
      date: "May 20, 2025"
    },
    {
      id: 8,
      src: "https://picsum.photos/200/150?random=8",
      alt: "Exhibition",
      title: "EXHIBITION",
      date: "May 15, 2025"
    },
    {
      id: 9,
      src: "https://picsum.photos/200/150?random=9",
      alt: "Performance",
      title: "PERFORMANCE",
      date: "May 10, 2025"
    },
    {
      id: 10,
      src: "https://picsum.photos/200/150?random=10",
      alt: "Gallery Opening",
      title: "GALLERY",
      date: "May 5, 2025"
    }
  ];

  // Fetch WordPress images
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        // Start with fallback images
        setGalleryImages(fallbackImages);
        
        // Delay footer loading by 2 seconds to avoid concurrent requests
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const newsService = WordPressNewsService.getInstance();
        const articles = await newsService.getLatestNewsForSlider(10);
        
        if (articles && articles.length > 0) {
          const transformedImages: GalleryImage[] = articles.map(article => ({
            id: article.id,
            src: article.image,
            alt: article.title,
            title: article.title.toUpperCase(),
            date: article.date
          }));
          setGalleryImages(transformedImages);
        }
      } catch (error) {
        console.warn('Error fetching gallery images (using fallback):', error instanceof Error ? error.message : error);
        // Fallback images already set above, no need to do anything else
      }
    };

    fetchGalleryImages();
  }, []);

  return (
    <footer className="footer">
      {/* Image Gallery Slider at the top */}
      <div className="footer-gallery-section">
        <div className="footer-gallery-container">
          <ImageGallerySlider 
            images={galleryImages}
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