import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { SimpleAuthSidebar } from '../Auth/SimpleAuthSidebar';
import { supabase } from '../../config/supabase';

interface Comment {
  author: string;
  post: string;
}

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [recentArticles, setRecentArticles] = useState<{id: number, title: string}[]>([])
  const [recentComments, setRecentComments] = useState<Comment[]>([])
  const navigate = useNavigate()

  // Fallback data
  const fallbackRecentArticles: {id: number, title: string}[] = [
    { id: 1, title: "REVIEW: HAIRSPRAY" },
    { id: 2, title: "BACH ETERNAL PLAYS ON" },
    { id: 3, title: "REVIEW: SKANK SINATRA AT QTOPIA, DARLINGHURST" },
    { id: 4, title: "SUANIME BRINGS WUTHERING WAVES CELEBRATION TO USYD CAMPUS" },
    { id: 5, title: "REVIEW: L'HOTEL AT THE FOUNDRY, STAR CASINO" },
    { id: 6, title: "REVIEW: EUREKA DAY AT THE SEYMOUR CENTRE" },
    { id: 7, title: "SHREDDED TRUST: NATIONALS AND LIBERALS CLASH AFTER HISTORIC ELECTION" }
  ];

  const fallbackRecentComments: Comment[] = [
    { author: "Zen", post: "SUAnime Brings Wuthering Waves Celebration to USYD Campus" },
    { author: "Навруува акот", post: "Food Review: Khanom House Delivers Subtle Sweet Indulgence" },
    { author: "Catherine", post: "Food Review: Khanom House Delivers Subtle Sweet Indulgence" },
    { author: "Nicole", post: "Food Review: Khanom House Delivers Subtle Sweet Indulgence" },
    { author: "bob", post: "REVIEW: GASLIGHT AT ROSLYN PACKER THEATRE, SYDNEY" }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // Navigate to search results page or filter content
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  // Fetch dynamic data from Supabase
  useEffect(() => {
    let isCancelled = false;

    const fetchSidebarData = async () => {
      // Start with fallback data immediately
      if (!isCancelled) {
        setRecentArticles(fallbackRecentArticles);
        setRecentComments(fallbackRecentComments);
      }

      try {
        // Fetch recent articles from Supabase
        const { data: recentPosts, error: recentError } = await supabase
          .from('posts')
          .select('id, title')
          .eq('status', 'publish')
          .order('created_at', { ascending: false })
          .limit(7);

        if (!recentError && recentPosts && recentPosts.length > 0 && !isCancelled) {
          const recentArticlesData = recentPosts.map(post => ({
            id: post.id,
            title: post.title
          }));
          setRecentArticles(recentArticlesData);
          console.log('📰 Sidebar: Successfully loaded Recent Articles from Supabase:', recentArticlesData.length);
        }

        // Fetch recent comments from Supabase
        const { data: comments, error: commentsError } = await supabase
          .from('comments')
          .select(`
            id,
            author_name,
            created_at,
            posts!inner (
              id,
              title
            )
          `)
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(5);

        if (!commentsError && comments && comments.length > 0 && !isCancelled) {
          const formattedComments: Comment[] = comments.map((comment: any) => ({
            author: comment.author_name,
            post: comment.posts.title
          }));
          setRecentComments(formattedComments);
          console.log('💬 Sidebar: Successfully loaded Recent Comments from Supabase:', formattedComments.length);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Sidebar: Error loading dynamic data (using fallback):', error);
        }
      }
    };

    fetchSidebarData();

    return () => {
      isCancelled = true;
    };
  }, []);


  return (
    <aside className={`sidebar ${className}`}>
      {/* Search */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">Search</h3>
        <form className="search-bar" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>
      </div>

      {/* Follow Us */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">Follow Us</h3>
        <div className="social-icons">
          <a href="http://www.facebook.com/MegaphoneOz" target="_blank" rel="noopener noreferrer" className="social-icon facebook">f</a>
          <a href="https://www.flickr.com/photos/megaphoneoz/" target="_blank" rel="noopener noreferrer" className="social-icon flickr">fl</a>
          <a href="http://instagram.com/megaphoneoz/" target="_blank" rel="noopener noreferrer" className="social-icon instagram">📷</a>
          <a href="https://twitter.com/MegaphoneOZ" target="_blank" rel="noopener noreferrer" className="social-icon twitter">t</a>
          <a href="https://www.youtube.com/channel/UCsp_yc-87m1D5BnUYCoxTAw" target="_blank" rel="noopener noreferrer" className="social-icon youtube">▶</a>
        </div>
      </div>

      {/* Auth Section */}
      <SimpleAuthSidebar />



      {/* Recent Articles */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">Recent Articles</h3>
        <ul className="recent-list">
          {recentArticles.map((article, index: number) => (
            <li key={index}>
              <a 
                href={`/article/${article.id}`} 
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/article/${article.id}`);
                }}
                role="button" 
                tabIndex={0}
                style={{cursor: 'pointer'}}
              >
                {article.title}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Comments */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">Recent Comments</h3>
        <ul className="recent-comments">
          {recentComments.map((comment: Comment, index: number) => (
            <li key={index}>
              <strong>{comment.author}</strong> on <a href="/posts" role="button" tabIndex={0}>{comment.post}</a>
            </li>
          ))}
        </ul>
      </div>

    </aside>
  );
};

export default Sidebar;