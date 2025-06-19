import React from 'react';
import FeaturedSlider from '../FeaturedSlider';
import { HomepageProps, SlideData, Article, Comment } from '../../types';
import './Homepage.css';

const Homepage: React.FC<HomepageProps> = ({ className = '' }) => {
  
  const featuredArticles: SlideData[] = [
    {
      id: 1,
      title: "REVIEW: EUREKA DAY AT THE SEYMOUR CENTRE",
      date: "June 1, 2025",
      image: "https://picsum.photos/800/400?random=1",
      category: "REVIEW"
    },
    {
      id: 2,
      title: "SHREDDED TRUST: NATIONALS AND LIBERALS CLASH",
      date: "May 26, 2025",
      image: "https://picsum.photos/800/400?random=2", 
      category: "NEWS"
    },
    {
      id: 3,
      title: "USYD STUDENTS DEMAND UNIVERSITY CUT TIES",
      date: "October 15, 2024",
      image: "https://picsum.photos/800/400?random=3",
      category: "NEWS"
    }
  ];

  const newsArticles: Article[] = [
    {
      id: 1,
      title: "SHREDDED TRUST: NATIONALS AND LIBERALS CLASH AFTER HISTORIC ELECTION",
      date: "May 26, 2025",
      comments: 0,
      image: "https://picsum.photos/400/250?random=4",
      excerpt: "Labor's unexpected huge win on May 3 has exploded the federal coalition creating a fracture between the National and Liberal..."
    },
    {
      id: 2,
      title: "USYD STUDENTS DEMAND UNIVERSITY CUT TIES WITH ISRAEL",
      date: "October 15, 2024",
      comments: 0,
      image: "https://picsum.photos/400/250?random=5"
    },
    {
      id: 3,
      title: "TAIWAN'S INDIGENOUS WONDER WOMAN RUNS IN ELECTION",
      date: "January 12, 2024",
      comments: 0,
      image: "https://picsum.photos/400/250?random=6"
    },
    {
      id: 4,
      title: "LE CYGNE: HAYDN SKINNER AND HIS BELOVED CELLO",
      date: "July 12, 2024",
      comments: 0,
      image: "https://picsum.photos/400/250?random=7"
    }
  ];

  const artsArticles: Article[] = [
    {
      id: 1,
      title: "REVIEW: SKANK SINATRA AT QTOPIA, DARLINGHURST",
      date: "June 15, 2025",
      comments: 0,
      image: "https://picsum.photos/400/250?random=4",
      excerpt: "It's hard to imagine Skank Sinatra (the alter persona of Jens Radda) as anything other than a glamorous, over-the-top cabaret queen..."
    },
    {
      id: 2,
      title: "SUANIME BRINGS WUTHERING WAVES CELEBRATION TO USYD CAMPUS",
      date: "June 15, 2025",
      comments: 1,
      image: "https://picsum.photos/400/250?random=4",
      excerpt: "Game lovers, cosplayers and visitors joined Sydney University Anime Society for a Wuthering Waves game-themed event celebrating its first anniversary at..."
    },
    {
      id: 3,
      title: "REVIEW: L'HOTEL AT THE FOUNDRY, STAR CASINO",
      date: "June 13, 2025",
      comments: 0,
      image: "https://picsum.photos/400/250?random=4",
      excerpt: "Check into another world when you book yourself into L'Hotel. It's a head-spinning mix of burlesque, cabaret and circus expertise with..."
    },
    {
      id: 4,
      title: "REVIEW: EUREKA DAY AT THE SEYMOUR CENTRE",
      date: "June 1, 2025",
      comments: 0,
      image: "https://picsum.photos/400/250?random=4",
      excerpt: "'This is Our Happy Place' declares the sign on the classroom where the school's Executive Committee (all parent volunteers, of..."
    }
  ];

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
    <div className={`homepage ${className}`}>
      <FeaturedSlider slides={featuredArticles} />

      <div className="main-layout">
        <div className="content-columns">
          {/* Main Content */}
          <main className="main-content">
            {/* News Section */}
            <section className="news-section">
              <h2 className="section-title">NEWS</h2>
              <div className="articles-grid">
                {newsArticles.map((article: Article, index: number) => (
                  <article key={article.id} className={`article-item ${index === 0 ? 'featured-article' : ''}`}>
                    <div className="article-image">
                      <img src={article.image} alt={article.title} />
                    </div>
                    <div className="article-content">
                      <h3 className="article-title">{article.title}</h3>
                      {article.excerpt && <p className="article-excerpt">{article.excerpt}</p>}
                      <div className="article-meta">
                        <span className="article-date">{article.date}</span>
                        <span className="article-comments">💬 {article.comments}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Arts and Entertainment Section */}
            <section className="arts-section">
              <h2 className="section-title">ARTS AND ENTERTAINMENT</h2>
              <div className="articles-grid">
                {artsArticles.map((article: Article) => (
                  <article key={article.id} className="article-item">
                    <div className="article-image">
                      <img src={article.image} alt={article.title} />
                    </div>
                    <div className="article-content">
                      <h3 className="article-title">{article.title}</h3>
                      {article.excerpt && <p className="article-excerpt">{article.excerpt}</p>}
                      <div className="article-meta">
                        <span className="article-date">{article.date}</span>
                        <span className="article-comments">💬 {article.comments}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </main>

          {/* Sidebar */}
          <aside className="sidebar">
            {/* Search */}
            <div className="sidebar-section">
              <div className="search-bar">
                <input type="text" placeholder="Search" />
                <button type="submit">🔍</button>
              </div>
            </div>

            {/* Follow Us */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">FOLLOW US</h3>
              <div className="social-icons">
                <a href="#" className="social-icon facebook">📘</a>
                <a href="#" className="social-icon instagram">📷</a>
                <a href="#" className="social-icon twitter">🐦</a>
                <a href="#" className="social-icon youtube">📺</a>
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
        </div>
      </div>
    </div>
  );
};

export default Homepage;