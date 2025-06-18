import React, { useState, useEffect } from 'react';
import './WordPressAPI.css';

const WordPressAPI = () => {
  const [posts, setPosts] = useState([]);
  const [media, setMedia] = useState([]);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = 'https://megaphoneoz.com/wp-json/wp/v2';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch posts
        const postsResponse = await fetch(`${API_BASE}/posts`);
        const postsData = await postsResponse.json();
        setPosts(postsData);

        // Fetch media
        const mediaResponse = await fetch(`${API_BASE}/media`);
        const mediaData = await mediaResponse.json();
        setMedia(mediaData);

        // Fetch comments for each post
        const commentsPromises = postsData.map(async (post) => {
          try {
            const commentsResponse = await fetch(`${API_BASE}/comments?post=${post.id}`);
            const commentsData = await commentsResponse.json();
            return { postId: post.id, comments: commentsData };
          } catch (err) {
            return { postId: post.id, comments: [] };
          }
        });

        const commentsResults = await Promise.all(commentsPromises);
        const commentsMap = {};
        commentsResults.forEach(({ postId, comments }) => {
          commentsMap[postId] = comments;
        });
        setComments(commentsMap);

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

  if (loading) return <div className="loading">Loading WordPress content...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="wordpress-api">
      <h1>MegaphoneOZ WordPress Content</h1>
      
      <section className="media-section">
        <h2>Media Gallery ({media.length} items)</h2>
        <div className="media-grid">
          {media.map(item => (
            <div key={item.id} className="media-item">
              <img 
                src={item.source_url} 
                alt={stripHtml(item.title.rendered)}
                loading="lazy"
              />
              <div className="media-info">
                <h4>{stripHtml(item.title.rendered)}</h4>
                {item.caption.rendered && (
                  <p className="caption">{stripHtml(item.caption.rendered)}</p>
                )}
                <small>ID: {item.id} | {new Date(item.date).toLocaleDateString()}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="posts-section">
        <h2>Recent Posts ({posts.length} posts)</h2>
        {posts.map(post => (
          <article key={post.id} className="post">
            <header className="post-header">
              <h3>{stripHtml(post.title.rendered)}</h3>
              <div className="post-meta">
                <span>Published: {new Date(post.date).toLocaleDateString()}</span>
                <span>Author ID: {post.author}</span>
                <span>Post ID: {post.id}</span>
              </div>
            </header>

            {post.featured_media && getFeaturedImage(post.featured_media) && (
              <div className="featured-image">
                <img 
                  src={getFeaturedImage(post.featured_media)} 
                  alt={stripHtml(post.title.rendered)}
                />
              </div>
            )}

            <div className="post-excerpt">
              {stripHtml(post.excerpt.rendered)}
            </div>

            <div className="post-content">
              <details>
                <summary>View Full Content</summary>
                <div dangerouslySetInnerHTML={{__html: post.content.rendered}} />
              </details>
            </div>

            <div className="post-comments">
              <h4>Comments ({comments[post.id]?.length || 0})</h4>
              {comments[post.id]?.length > 0 ? (
                <div className="comments-list">
                  {comments[post.id].map(comment => (
                    <div key={comment.id} className="comment">
                      <div className="comment-meta">
                        <strong>{comment.author_name}</strong>
                        <span>{new Date(comment.date).toLocaleDateString()}</span>
                      </div>
                      <div className="comment-content">
                        {stripHtml(comment.content.rendered)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-comments">No comments yet</p>
              )}
            </div>

            <div className="post-links">
              <a href={post.link} target="_blank" rel="noopener noreferrer">
                View on MegaphoneOZ
              </a>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default WordPressAPI;