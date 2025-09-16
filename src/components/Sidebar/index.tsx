import React from 'react';
import './Sidebar.css';
import { SimpleAuthSidebar } from '../Auth/SimpleAuthSidebar';

interface Comment {
  author: string;
  post: string;
}

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const [searchTerm, setSearchTerm] = React.useState('')

  const recentArticles: string[] = [
    "REVIEW: HAIRSPRAY",
    "BACH ETERNAL PLAYS ON",
    "REVIEW: SKANK SINATRA AT QTOPIA, DARLINGHURST",
    "SUANIME BRINGS WUTHERING WAVES CELEBRATION TO USYD CAMPUS",
    "REVIEW: L'HOTEL AT THE FOUNDRY, STAR CASINO",
    "REVIEW: EUREKA DAY AT THE SEYMOUR CENTRE",
    "SHREDDED TRUST: NATIONALS AND LIBERALS CLASH AFTER HISTORIC ELECTION"
  ];

  const recentComments: Comment[] = [
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
      window.location.href = `/search?q=${encodeURIComponent(searchTerm.trim())}`
    }
  }


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
          {recentArticles.map((article: string, index: number) => (
            <li key={index}><a href="/articles" role="button" tabIndex={0}>{article}</a></li>
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