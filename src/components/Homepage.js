import React from 'react';
import FeaturedSlider from './FeaturedSlider';
import './Homepage.css';

const Homepage = () => {

  const featuredArticles = [
    {
      id: 1,
      title: "REVIEW: EUREKA DAY AT THE SEYMOUR CENTRE",
      date: "June 1, 2025",
      image: "/api/placeholder/600/400",
      category: "REVIEW"
    }
  ];

  const newsArticles = [
    {
      id: 1,
      title: "SHREDDED TRUST: NATIONALS AND LIBERALS CLASH AFTER HISTORIC ELECTION",
      date: "May 26, 2025",
      comments: 0,
      image: "/api/placeholder/400/250",
      excerpt: "Labor's unexpected huge win on May 3 has exploded the federal coalition creating a fracture between the National and Liberal..."
    },
    {
      id: 2,
      title: "USYD STUDENTS DEMAND UNIVERSITY CUT TIES WITH ISRAEL",
      date: "October 15, 2024",
      comments: 0,
      image: "/api/placeholder/400/250"
    },
    {
      id: 3,
      title: "TAIWAN'S INDIGENOUS WONDER WOMAN RUNS IN ELECTION",
      date: "January 12, 2024",
      comments: 0,
      image: "/api/placeholder/400/250"
    },
    {
      id: 4,
      title: "LE CYGNE: HAYDN SKINNER AND HIS BELOVED CELLO",
      date: "July 12, 2024",
      comments: 0,
      image: "/api/placeholder/400/250"
    }
  ];

  const artsArticles = [
    {
      id: 1,
      title: "REVIEW: SKANK SINATRA AT QTOPIA, DARLINGHURST",
      date: "June 15, 2025",
      comments: 0,
      image: "/api/placeholder/400/250",
      excerpt: "It's hard to imagine Skank Sinatra (the alter persona of Jens Radda) as anything other than a glamorous, over-the-top cabaret queen..."
    },
    {
      id: 2,
      title: "SUANIME BRINGS WUTHERING WAVES CELEBRATION TO USYD CAMPUS",
      date: "June 15, 2025",
      comments: 1,
      image: "/api/placeholder/400/250",
      excerpt: "Game lovers, cosplayers and visitors joined Sydney University Anime Society for a Wuthering Waves game-themed event celebrating its first anniversary at..."
    },
    {
      id: 3,
      title: "REVIEW: L'HOTEL AT THE FOUNDRY, STAR CASINO",
      date: "June 13, 2025",
      comments: 0,
      image: "/api/placeholder/400/250",
      excerpt: "Check into another world when you book yourself into L'Hotel. It's a head-spinning mix of burlesque, cabaret and circus expertise with..."
    },
    {
      id: 4,
      title: "REVIEW: EUREKA DAY AT THE SEYMOUR CENTRE",
      date: "June 1, 2025",
      comments: 0,
      image: "/api/placeholder/400/250",
      excerpt: "'This is Our Happy Place' declares the sign on the classroom where the school's Executive Committee (all parent volunteers, of..."
    }
  ];

  const recentArticles = [
    "REVIEW: HAIRSPRAY",
    "BACH ETERNAL PLAYS ON",
    "REVIEW: SKANK SINATRA AT QTOPIA, DARLINGHURST",
    "SUANIME BRINGS WUTHERING WAVES CELEBRATION TO USYD CAMPUS",
    "REVIEW: L'HOTEL AT THE FOUNDRY, STAR CASINO",
    "REVIEW: EUREKA DAY AT THE SEYMOUR CENTRE",
    "SHREDDED TRUST: NATIONALS AND LIBERALS CLASH AFTER HISTORIC ELECTION"
  ];

  const recentComments = [
    { author: "Zen", post: "SUAnime Brings Wuthering Waves Celebration to USYD Campus" },
    { author: "Навруува акот", post: "Food Review: Khanom House Delivers Subtle Sweet Indulgence" },
    { author: "Catherine", post: "Food Review: Khanom House Delivers Subtle Sweet Indulgence" },
    { author: "Nicole", post: "Food Review: Khanom House Delivers Subtle Sweet Indulgence" },
    { author: "bob", post: "REVIEW: GASLIGHT AT ROSLYN PACKER THEATRE, SYDNEY" }
  ];

  const bestOfRest = [
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
    <div className="homepage">
      <FeaturedSlider slides={featuredArticles} />

      <div className="main-layout">
        <div className="content-columns">
          {/* Main Content */}
          <main className="main-content">
            {/* News Section */}
            <section className="news-section">
              <h2 className="section-title">NEWS</h2>
              <div className="articles-grid">
                {newsArticles.map((article, index) => (
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
                {artsArticles.map((article) => (
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
                  <img src="/api/placeholder/300/200" alt="Video thumbnail" />
                  <div className="play-button">▶</div>
                </div>
              </div>
            </div>

            {/* Recent Articles */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">RECENT ARTICLES</h3>
              <ul className="recent-list">
                {recentArticles.map((article, index) => (
                  <li key={index}><a href="#">{article}</a></li>
                ))}
              </ul>
            </div>

            {/* Recent Comments */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">RECENT COMMENTS</h3>
              <ul className="recent-comments">
                {recentComments.map((comment, index) => (
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
                {bestOfRest.map((item, index) => (
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