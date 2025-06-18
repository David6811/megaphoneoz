import React, { useState, useEffect } from 'react';
import './Homepage.css';

const Homepage = () => {
  const [posts, setPosts] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = 'https://megaphoneoz.com/wp-json/wp/v2';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [postsResponse, mediaResponse] = await Promise.all([
          fetch(`${API_BASE}/posts?per_page=10`),
          fetch(`${API_BASE}/media`)
        ]);

        const postsData = await postsResponse.json();
        const mediaData = await mediaResponse.json();
        
        setPosts(postsData);
        setMedia(mediaData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getFeaturedImage = (featuredMediaId) => {
    const mediaItem = media.find(item => item.id === featuredMediaId);
    return mediaItem ? mediaItem.source_url : null;
  };

  const stripHtml = (html) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  if (loading) return <div className="loading">Loading latest articles...</div>;
  if (error) return <div className="error">Error loading content: {error}</div>;

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 7);
  const sidebarPosts = posts.slice(7);

  return (
    <div className="homepage">
      {/* Featured Article Section */}
      {featuredPost && (
        <section className="featured-section">
          <div className="featured-article">
            {featuredPost.featured_media && getFeaturedImage(featuredPost.featured_media) && (
              <div className="featured-image">
                <img 
                  src={getFeaturedImage(featuredPost.featured_media)} 
                  alt={stripHtml(featuredPost.title.rendered)}
                />
                <div className="featured-overlay">
                  <div className="featured-content">
                    <h2 className="featured-title">
                      {stripHtml(featuredPost.title.rendered)}
                    </h2>
                    <p className="featured-excerpt">
                      {truncateText(stripHtml(featuredPost.excerpt.rendered), 150)}
                    </p>
                    <div className="featured-meta">
                      <span className="post-date">{formatDate(featuredPost.date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <div className="content-wrapper">
        {/* Main Content Area */}
        <main className="main-content">
          <section className="recent-articles">
            <h3 className="section-title">LATEST ARTICLES</h3>
            <div className="articles-grid">
              {recentPosts.map(post => (
                <article key={post.id} className="article-card">
                  {post.featured_media && getFeaturedImage(post.featured_media) && (
                    <div className="article-image">
                      <img 
                        src={getFeaturedImage(post.featured_media)} 
                        alt={stripHtml(post.title.rendered)}
                      />
                    </div>
                  )}
                  <div className="article-content">
                    <h4 className="article-title">
                      {stripHtml(post.title.rendered)}
                    </h4>
                    <p className="article-excerpt">
                      {truncateText(stripHtml(post.excerpt.rendered), 120)}
                    </p>
                    <div className="article-meta">
                      <span className="post-date">{formatDate(post.date)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <h4 className="sidebar-title">RECENT POSTS</h4>
            <div className="sidebar-posts">
              {sidebarPosts.map(post => (
                <div key={post.id} className="sidebar-post">
                  {post.featured_media && getFeaturedImage(post.featured_media) && (
                    <div className="sidebar-post-image">
                      <img 
                        src={getFeaturedImage(post.featured_media)} 
                        alt={stripHtml(post.title.rendered)}
                      />
                    </div>
                  )}
                  <div className="sidebar-post-content">
                    <h5 className="sidebar-post-title">
                      {truncateText(stripHtml(post.title.rendered), 60)}
                    </h5>
                    <span className="sidebar-post-date">{formatDate(post.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h4 className="sidebar-title">FOLLOW US</h4>
            <div className="social-links">
              <a href="#" className="social-link facebook">Facebook</a>
              <a href="#" className="social-link twitter">Twitter</a>
              <a href="#" className="social-link instagram">Instagram</a>
              <a href="#" className="social-link youtube">YouTube</a>
            </div>
          </div>

          <div className="sidebar-section">
            <h4 className="sidebar-title">CATEGORIES</h4>
            <div className="categories-list">
              <a href="#" className="category-link">News</a>
              <a href="#" className="category-link">Lifestyle</a>
              <a href="#" className="category-link">Arts & Entertainment</a>
              <a href="#" className="category-link">Opinion</a>
              <a href="#" className="category-link">Music</a>
              <a href="#" className="category-link">Theatre</a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Homepage;