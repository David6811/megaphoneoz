import React from 'react';
import './Sidebar.css';

interface Comment {
  author: string;
  post: string;
}

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
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

  const bestOfRest: string[] = [
    "Why the press is losing",
    "The Cambridge Analytica Files",
    "Lies spread faster than truth",
    "The future of journalism",
    "Facebook's two years of hell",
    "Social confidence crucial to democracy",
    "Freakorn",
    "Is fake news political persuasion?",
    "Long live the moguls",
    "The New Fourth Estate",
    "Snow Fall",
    "Funding attacks on climate science",
    "Journos onTwitter",
    "Arctic sea ice melts"
  ];

  return (
    <aside className={`sidebar ${className}`}>
      {/* Search */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">SEARCH</h3>
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
          <button type="submit">🔍</button>
        </div>
      </div>

      {/* Follow Us */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">FOLLOW US</h3>
        <div className="social-icons">
          <a href="http://www.facebook.com/MegaphoneOz" target="_blank" rel="noopener noreferrer" className="social-icon facebook">f</a>
          <a href="https://www.flickr.com/photos/megaphoneoz/" target="_blank" rel="noopener noreferrer" className="social-icon flickr">fl</a>
          <a href="http://instagram.com/megaphoneoz/" target="_blank" rel="noopener noreferrer" className="social-icon instagram">📷</a>
          <a href="https://twitter.com/MegaphoneOZ" target="_blank" rel="noopener noreferrer" className="social-icon twitter">t</a>
          <a href="https://www.youtube.com/channel/UCsp_yc-87m1D5BnUYCoxTAw" target="_blank" rel="noopener noreferrer" className="social-icon youtube">▶</a>
        </div>
      </div>

      {/* Featured Video */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">JAYA BALENDRA: EXPOSED LUNA PARK GHOST TRAIN FIRE</h3>
        <div className="video-player">
          <div className="video-thumbnail">
            <img src="https://picsum.photos/300/200?random=10" alt="Video thumbnail" />
            <div className="play-button">▶</div>
          </div>
        </div>
      </div>

      {/* Recent Articles */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">RECENT ARTICLES</h3>
        <ul className="recent-list">
          {recentArticles.map((article: string, index: number) => (
            <li key={index}><a href="#">{article}</a></li>
          ))}
        </ul>
      </div>

      {/* Recent Comments */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">RECENT COMMENTS</h3>
        <ul className="recent-comments">
          {recentComments.map((comment: Comment, index: number) => (
            <li key={index}>
              <strong>{comment.author}</strong> on <a href="#">{comment.post}</a>
            </li>
          ))}
        </ul>
      </div>

      {/* Best of the Rest */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">BEST OF THE REST</h3>
        <ul className="best-of-list">
          {bestOfRest.map((item: string, index: number) => (
            <li key={index}>📰 <a href="#">{item}</a></li>
          ))}
        </ul>
        <div className="login-link">
          <a href="#">MegaphoneOz Users: Login</a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;