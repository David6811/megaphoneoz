import React, { useState, useEffect } from 'react';
import WordPressPagesService from '../../services/wordpressPagesService';
import type { FormattedPage, FormattedComment } from '../../services/wordpressPagesService';
import Sidebar from '../Sidebar';
import './AboutUs.css';

interface AboutUsData {
  page: FormattedPage | null;
  comments: FormattedComment[];
}

const AboutUs: React.FC = () => {
  const [aboutUsData, setAboutUsData] = useState<AboutUsData>({ page: null, comments: [] });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAboutUsPage = async () => {
      try {
        const pagesService = new WordPressPagesService();
        const result = await pagesService.getPageWithComments('about-us');
        
        if (result.page) {
          setAboutUsData(result);
          setError(null);
        } else {
          setError('About Us page not found');
        }
      } catch (err) {
        console.error('Error loading About Us page:', err);
        setError('Failed to load About Us page');
      }
    };

    // Start loading immediately
    loadAboutUsPage();
  }, []);

  const stripHtmlTags = (html: string): string => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const createMarkup = (content: string) => {
    return { __html: content };
  };

  if (error || !aboutUsData.page) {
    return (
      <div className="about-us-container">
        <div className="about-us-layout">
          <div className="about-us-main">
            <div className="about-us-content">
              <h1 className="page-title">About Us</h1>
              <div className="wordpress-content">
                <p>Loading content...</p>
              </div>
            </div>
          </div>
          <Sidebar />
        </div>
      </div>
    );
  }

  const { page, comments } = aboutUsData;

  return (
    <div className="about-us-container">
      <div className="about-us-layout">
        <div className="about-us-main">
          <div className="about-us-content">
            <h1 className="page-title">{page.title}</h1>
            
            <div 
              className="wordpress-content"
              dangerouslySetInnerHTML={createMarkup(page.content)}
            />
          </div>

          {comments.length > 0 && (
            <div className="about-us-comments">
              <h2 className="comments-title">{comments.length} COMMENTS</h2>
              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-avatar">
                      <img 
                        src={comment.avatarUrl || '/api/placeholder/80/80'} 
                        alt={`${comment.author} avatar`}
                        className="avatar-image"
                      />
                    </div>
                    <div className="comment-main">
                      <div className="comment-header">
                        <div className="comment-meta">
                          <strong className="comment-author">{comment.author.toUpperCase()}</strong>
                          <span className="comment-date">{comment.date}</span>
                          <span className="comment-edit">(Edit)</span>
                        </div>
                        <div className="comment-reply">
                          🔄 Reply
                        </div>
                      </div>
                      <div className="comment-content">
                        {stripHtmlTags(comment.content)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Sidebar />
      </div>
    </div>
  );
};

export default AboutUs;