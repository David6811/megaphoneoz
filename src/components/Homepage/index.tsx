import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FeaturedSlider from '../FeaturedSlider';
import { HomepageProps, SlideData, Article, Comment } from '../../types';
import WordPressNewsService, { FormattedNewsArticle } from '../../services/wordpressNewsService';
import { SimpleAuthSidebar } from '../Auth/SimpleAuthSidebar';
import './Homepage.css';

const Homepage: React.FC<HomepageProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [featuredArticles, setFeaturedArticles] = useState<SlideData[]>([]);
  const [newsArticles, setNewsArticles] = useState<Article[]>([]);
  const [artsArticles, setArtsArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback data
  const fallbackFeaturedArticles: SlideData[] = [
    {
      id: 1,
      title: "REVIEW: EUREKA DAY AT THE SEYMOUR CENTRE",
      date: "June 1, 2025",
      image: "",
      category: "REVIEW"
    },
    {
      id: 2,
      title: "SHREDDED TRUST: NATIONALS AND LIBERALS CLASH",
      date: "May 26, 2025",
      image: "", 
      category: "NEWS"
    },
    {
      id: 3,
      title: "USYD STUDENTS DEMAND UNIVERSITY CUT TIES",
      date: "October 15, 2024",
      image: "",
      category: "NEWS"
    }
  ];

  const fallbackNewsArticles: Article[] = [
    {
      id: 1,
      title: "SHREDDED TRUST: NATIONALS AND LIBERALS CLASH AFTER HISTORIC ELECTION",
      date: "May 26, 2025",
      comments: 0,
      image: "",
      excerpt: "Labor's unexpected huge win on May 3 has exploded the federal coalition creating a fracture between the National and Liberal..."
    },
    {
      id: 2,
      title: "USYD STUDENTS DEMAND UNIVERSITY CUT TIES WITH ISRAEL",
      date: "October 15, 2024",
      comments: 0,
      image: ""
    },
    {
      id: 3,
      title: "TAIWAN'S INDIGENOUS WONDER WOMAN RUNS IN ELECTION",
      date: "January 12, 2024",
      comments: 0,
      image: ""
    },
    {
      id: 4,
      title: "LE CYGNE: HAYDN SKINNER AND HIS BELOVED CELLO",
      date: "July 12, 2024",
      comments: 0,
      image: ""
    }
  ];

  const fallbackArtsArticles: Article[] = [
    {
      id: 1,
      title: "REVIEW: SKANK SINATRA AT QTOPIA, DARLINGHURST",
      date: "June 15, 2025",
      comments: 0,
      image: "",
      excerpt: "It's hard to imagine Skank Sinatra (the alter persona of Jens Radda) as anything other than a glamorous, over-the-top cabaret queen..."
    },
    {
      id: 2,
      title: "SUANIME BRINGS WUTHERING WAVES CELEBRATION TO USYD CAMPUS",
      date: "June 15, 2025",
      comments: 1,
      image: "",
      excerpt: "Game lovers, cosplayers and visitors joined Sydney University Anime Society for a Wuthering Waves game-themed event celebrating its first anniversary at..."
    },
    {
      id: 3,
      title: "REVIEW: L'HOTEL AT THE FOUNDRY, STAR CASINO",
      date: "June 13, 2025",
      comments: 0,
      image: "",
      excerpt: "Check into another world when you book yourself into L'Hotel. It's a head-spinning mix of burlesque, cabaret and circus expertise with..."
    },
    {
      id: 4,
      title: "REVIEW: EUREKA DAY AT THE SEYMOUR CENTRE",
      date: "June 1, 2025",
      comments: 0,
      image: "",
      excerpt: "'This is Our Happy Place' declares the sign on the classroom where the school's Executive Committee (all parent volunteers, of..."
    }
  ];

  // Transform WordPress news data to component format
  const transformNewsData = (wpArticles: FormattedNewsArticle[]): { slides: SlideData[], articles: Article[] } => {
    const slides: SlideData[] = wpArticles.slice(0, 5).map(article => ({
      id: article.id,
      title: article.title,
      date: article.date,
      image: article.image,
      category: article.category
    }));

    // For NEWS section: 1 featured article + 3 sidebar articles = 4 total
    const articles: Article[] = wpArticles.slice(0, 4).map(article => ({
      id: article.id,
      title: article.title,
      date: article.date,
      image: article.image,
      excerpt: article.excerpt,
      comments: 0, // WordPress doesn't provide comment count in this endpoint
      category: article.category,
      content: article.content,
      author: article.author
    }));

    return { slides, articles };
  };

  // Fetch WordPress news data
  useEffect(() => {
    let isCancelled = false;
    
    const fetchNewsData = async () => {
      // Start with fallback data immediately
      if (!isCancelled) {
        setFeaturedArticles(fallbackFeaturedArticles);
        setNewsArticles(fallbackNewsArticles);
        setArtsArticles(fallbackArtsArticles);
        setLoading(false);
      }
      
      try {
        const newsService = WordPressNewsService.getInstance();
        
        // Add timeout to prevent hanging
        const fetchWithTimeout = async (promise: Promise<any>, timeoutMs: number = 8000) => {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
          );
          return Promise.race([promise, timeoutPromise]);
        };
        
        // Fetch general news with timeout
        try {
          const wpArticles = await fetchWithTimeout(
            newsService.getLatestNewsForSlider(9)
          );
          
          if (wpArticles && wpArticles.length > 0 && !isCancelled) {
            const { slides, articles } = transformNewsData(wpArticles);
            setFeaturedArticles(slides);
            setNewsArticles(articles);
            console.log('Successfully loaded WordPress news articles:', wpArticles.length);
          } else if (!isCancelled) {
            console.warn('No WordPress articles found, keeping fallback data');
          }
        } catch (newsError) {
          console.error('Error loading WordPress news (using fallback):', newsError);
        }

        // Fetch arts and entertainment articles with timeout
        try {
          const artsArticles = await fetchWithTimeout(
            newsService.getLatestNewsByCategory('arts-entertainment', 4)
          );
          
          if (artsArticles && artsArticles.length > 0 && !isCancelled) {
            const transformedArtsArticles: Article[] = artsArticles.map((article: FormattedNewsArticle) => ({
              id: article.id,
              title: article.title,
              date: article.date,
              image: article.image,
              excerpt: article.excerpt,
              comments: 0,
              category: article.category,
              content: article.content,
              author: article.author
            }));
            setArtsArticles(transformedArtsArticles);
            console.log('Successfully loaded WordPress arts articles:', artsArticles.length);
          } else if (!isCancelled) {
            console.warn('No WordPress arts articles found, keeping fallback data');
          }
        } catch (artsError) {
          if (!isCancelled) {
            console.error('Error loading WordPress arts articles (using fallback):', artsError);
          }
        }
        
      } catch (error) {
        if (!isCancelled) {
          console.error('Error loading WordPress news (using fallback):', error);
        }
      }
    };

    fetchNewsData();
    
    return () => {
      isCancelled = true;
    };
  }, []);

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

  const handleArticleClick = (article: Article) => {
    // Pass the full article data via state instead of just slug
    navigate(`/article/${article.id}`, { 
      state: { 
        article: article,
        categoryTitle: article.category || 'NEWS'
      } 
    });
  };

  // Initialize with fallback data immediately
  if (loading) {
    // Show content immediately with fallback data
    return (
      <div className={`homepage ${className}`}>
        <div className="main-layout">
          <div className="top-content">
            <div className="main-column">
              <div className="featured-content">
                <FeaturedSlider slides={fallbackFeaturedArticles} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className={`homepage ${className}`}>
      <div className="main-layout">
        <div className="top-content">
          {/* Left Column - Featured Slider + News */}
          <div className="main-column">
            <div className="featured-content">
              <FeaturedSlider slides={featuredArticles} />
            </div>
            
            {/* News Section */}
            <section className="news-section">
              <h2 className="section-title">NEWS</h2>
              <div className="articles-grid">
                {/* Featured Article */}
                <article className="article-item featured-article">
                  <div className="article-image">
                    <img src={newsArticles[0].image} alt={newsArticles[0].title} />
                  </div>
                  <div className="article-content">
                    <h3 className="article-title" onClick={() => handleArticleClick(newsArticles[0])} style={{ cursor: 'pointer' }}>{newsArticles[0].title}</h3>
                    {newsArticles[0].excerpt && <p className="article-excerpt">{newsArticles[0].excerpt}</p>}
                    <div className="article-meta">
                      <span className="article-date">{newsArticles[0].date}</span>
                      <span className="article-comments">💬 {newsArticles[0].comments}</span>
                    </div>
                  </div>
                </article>
                
                {/* Sidebar Articles */}
                <div className="articles-sidebar">
                  {newsArticles.slice(1).map((article: Article) => (
                    <article key={article.id} className="article-item">
                      <div className="article-image">
                        <img src={article.image} alt={article.title} />
                      </div>
                      <div className="article-content">
                        <h3 className="article-title" onClick={() => handleArticleClick(article)} style={{ cursor: 'pointer' }}>{article.title}</h3>
                        <div className="article-meta">
                          <span className="article-date">{article.date}</span>
                          <span className="article-comments">💬 {article.comments}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* Arts and Entertainment Section */}
            <section className="arts-section">
              <h2 className="section-title">ARTS AND ENTERTAINMENT</h2>
              <div className="arts-articles-grid">
                {artsArticles.map((article: Article) => (
                  <article key={article.id} className="article-item">
                    <div className="article-image">
                      <img src={article.image} alt={article.title} />
                    </div>
                    <div className="article-content">
                      <h3 className="article-title" onClick={() => handleArticleClick(article)} style={{ cursor: 'pointer' }}>{article.title}</h3>
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
          </div>

          {/* Right Column - Sidebar */}
          <aside className="sidebar">
            {/* Search */}
            <div className="sidebar-section">
              <form className="search-bar" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const searchTerm = formData.get('search') as string;
                if (searchTerm?.trim()) {
                  navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
                }
              }}>
                <input type="text" name="search" placeholder="Search articles..." />
                <button type="submit">🔍</button>
              </form>
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

            {/* Auth Section */}
            <SimpleAuthSidebar />


            {/* Recent Articles */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">RECENT ARTICLES</h3>
              <ul className="recent-list">
                {recentArticles.map((article: string, index: number) => (
                  <li key={index}><a href="/articles" role="button" tabIndex={0}>{article}</a></li>
                ))}
              </ul>
            </div>

            {/* Recent Comments */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">RECENT COMMENTS</h3>
              <ul className="recent-comments">
                {recentComments.map((comment: Comment, index: number) => (
                  <li key={index}>
                    <strong>{comment.author}</strong> on <a href="/posts" role="button" tabIndex={0}>{comment.post}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Best of the Rest */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">BEST OF THE REST</h3>
              <ul className="best-of-list">
                {bestOfRest.map((item: string, index: number) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'center' }}><img src="https://megaphoneoz.com/wp-content/uploads/2015/05/MegaphoneGravatar.jpg" alt="Megaphone Icon" style={{ width: 16, height: 16, marginRight: 8 }} /><a href="/news" role="button" tabIndex={0}>{item}</a></li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Homepage;