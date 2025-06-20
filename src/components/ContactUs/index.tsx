import React, { useState, useEffect } from 'react';
import WordPressPagesService from '../../services/wordpressPagesService';
import type { FormattedPage, FormattedComment } from '../../services/wordpressPagesService';
import Sidebar from '../Sidebar';
import './ContactUs.css';

interface ContactUsData {
  page: FormattedPage | null;
  comments: FormattedComment[];
}

const ContactUs: React.FC = () => {
  const [contactUsData, setContactUsData] = useState<ContactUsData>({ page: null, comments: [] });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContactUsPage = async () => {
      try {
        const pagesService = new WordPressPagesService();
        const result = await pagesService.getPageWithComments('contact-us');
        
        if (result.page) {
          setContactUsData(result);
          setError(null);
        } else {
          setError('Contact Us page not found');
        }
      } catch (err) {
        console.error('Error loading Contact Us page:', err);
        setError('Failed to load Contact Us page');
      }
    };

    // Start loading immediately
    loadContactUsPage();
  }, []);

  const stripHtmlTags = (html: string): string => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const createMarkup = (content: string) => {
    return { __html: content };
  };

  if (error || !contactUsData.page) {
    return (
      <div className="contact-us-container">
        <div className="contact-us-layout">
          <div className="contact-us-main">
            <div className="contact-us-content">
              <h1 className="page-title">Contact Us</h1>
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

  const { page, comments } = contactUsData;

  return (
    <div className="contact-us-container">
      <div className="contact-us-layout">
        <div className="contact-us-main">
          <div className="contact-us-content">
            <h1 className="page-title">{page.title}</h1>
            
            <div 
              className="wordpress-content"
              dangerouslySetInnerHTML={createMarkup(page.content)}
            />
          </div>

          {comments.length > 0 && (
            <div className="contact-us-comments">
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

export default ContactUs;