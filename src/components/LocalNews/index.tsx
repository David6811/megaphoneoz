import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardMedia, CardContent, Pagination, Button, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import NewsServiceManager, { FormattedNewsArticle, FormattedComment } from '../../services/newsServiceManager';
import { Article, Comment } from '../../types';

// Styled components following Material-First strategy
const StyledCard = styled(Card)(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  },
}));

const StyledCardMedia = styled(CardMedia)({
  height: 200,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

const ArticleTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  lineHeight: 1.3,
  marginBottom: theme.spacing(1),
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}));

const ArticleExcerpt = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}));

const ArticleMeta = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 'auto',
  paddingTop: theme.spacing(1),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const SidebarSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
}));

const SidebarTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  fontSize: '1.1rem',
}));

const SocialIcons = styled(Box)({
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
});

const SocialIcon = styled('a')(() => ({
  display: 'inline-block',
  width: '40px',
  height: '40px',
  borderRadius: '4px',
  color: 'white',
  textDecoration: 'none',
  textAlign: 'center',
  lineHeight: '40px',
  fontSize: '16px',
  fontWeight: 'bold',
  transition: 'opacity 0.2s ease-in-out',
  '&:hover': {
    opacity: 0.8,
  },
  '&.facebook': {
    backgroundColor: '#3b5998',
  },
  '&.instagram': {
    backgroundColor: '#e4405f',
  },
  '&.twitter': {
    backgroundColor: '#1da1f2',
  },
  '&.youtube': {
    backgroundColor: '#ff0000',
  },
  '&.flickr': {
    backgroundColor: '#ff0084',
  },
}));

const RecentList = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  '& li': {
    marginBottom: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  '& a': {
    textDecoration: 'none',
    color: theme.palette.text.primary,
    fontSize: '0.9rem',
    lineHeight: 1.4,
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}));

// Loading skeleton component
const ArticleSkeleton: React.FC = () => (
  <StyledCard>
    <Skeleton variant="rectangular" height={200} />
    <CardContent>
      <Skeleton variant="text" height={32} width="90%" />
      <Skeleton variant="text" height={20} width="100%" />
      <Skeleton variant="text" height={20} width="80%" />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Skeleton variant="text" width={100} />
        <Skeleton variant="text" width={60} />
      </Box>
      <Skeleton variant="rectangular" height={36} width={120} sx={{ mt: 2 }} />
    </CardContent>
  </StyledCard>
);

// Empty state component
const EmptyState: React.FC<{ category: string }> = ({ category }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 8,
      textAlign: 'center',
      color: 'text.secondary'
    }}
  >
    <Typography variant="h5" gutterBottom>
      📰
    </Typography>
    <Typography variant="h6" gutterBottom>
      No articles found
    </Typography>
    <Typography variant="body2">
      There are currently no articles available in {category}.
    </Typography>
  </Box>
);

interface LocalNewsProps {
  className?: string;
}

const LocalNews: React.FC<LocalNewsProps> = ({ className = '' }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [recentComments, setRecentComments] = useState<FormattedComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryTitle, setCategoryTitle] = useState('NEWS ARCHIVE');
  const location = useLocation();
  const navigate = useNavigate();
  const articlesPerPage = 6;

  // WordPress category ID mapping based on actual WordPress categories API (Total: 35 categories)
  const getCategoryIdFromPath = (path: string): { categoryId: number | null, title: string } => {
    const pathMappings: { [key: string]: { categoryId: number, title: string } } = {
      // News categories (Parent: News ID: 3)
      '/category/news/localnews': { categoryId: 4, title: 'LOCAL NEWS' },
      '/category/news/nationalnews': { categoryId: 5, title: 'NATIONAL NEWS' },
      '/category/news/worldnews': { categoryId: 6, title: 'WORLD NEWS' },
      '/category/news/featurednews/': { categoryId: 7, title: 'FEATURES' },
      '/category/news/environment': { categoryId: 16, title: 'ENVIRONMENT' },
      '/category/media/': { categoryId: 17, title: 'MEDIA' },
      
      // Lifestyle categories (Parent: Lifestyle ID: 29)
      '/category/lifestyle/sport/': { categoryId: 18, title: 'SPORT' },
      '/category/lifestyle/travel/': { categoryId: 31, title: 'TRAVEL' },
      '/category/lifestyle/foodwine/restaurantreviews': { categoryId: 20, title: 'RESTAURANT REVIEWS' },
      '/category/lifestyle/foodwine/winematch/': { categoryId: 21, title: 'WINE MATCH' },
      
      // Arts & Entertainment categories (Parent: Arts and Entertainment ID: 9)
      '/category/artsentertainment/theatre/theatrereviews/': { categoryId: 32, title: 'THEATRE REVIEWS' },
      '/category/artsentertainment/filmreviews/': { categoryId: 11, title: 'FILM REVIEWS' },
      '/category/artsentertainment/galleries/exhibitions/': { categoryId: 14, title: 'GALLERY EXHIBITIONS' },
      '/category/artsentertainment/galleries/eyeonthestreet/': { categoryId: 15, title: 'EYE ON THE STREET' },
      '/category/artsentertainment/books/': { categoryId: 30, title: 'BOOKS' },
      '/category/artsentertainment/videogames/': { categoryId: 125, title: 'VIDEO GAMES' },
      '/category/artsentertainment/games/': { categoryId: 1696, title: 'GAMES' },
      
      // Other main categories
      '/category/opinion/': { categoryId: 8, title: 'OPINION' },
      '/category/trending/': { categoryId: 60, title: 'TRENDING' },
      '/category/front-page/': { categoryId: 47, title: 'FRONT PAGE' },
      '/coming-up': { categoryId: 1258, title: 'COMING UP' }
    };

    // Try exact match first
    let mapping = pathMappings[path];
    if (mapping) {
      return mapping;
    }

    // Try without trailing slash
    const pathWithoutSlash = path.endsWith('/') ? path.slice(0, -1) : path;
    mapping = pathMappings[pathWithoutSlash];
    if (mapping) {
      return mapping;
    }

    // Try with trailing slash
    const pathWithSlash = path.endsWith('/') ? path : path + '/';
    mapping = pathMappings[pathWithSlash];
    if (mapping) {
      return mapping;
    }

    // Fallback for non-category paths
    if (path.includes('/opinion')) {
      return { categoryId: null, title: 'OPINION' };
    }
    
    return { categoryId: null, title: 'NEWS ARCHIVE' };
  };

  // Fallback data for local news - Extended to demonstrate pagination
  const fallbackArticles: Article[] = [
    {
      id: 1,
      title: "COUNCIL APPROVES NEW COMMUNITY CENTER PROJECT",
      date: "August 20, 2025",
      comments: 5,
      image: "",
      excerpt: "The local council unanimously voted to approve funding for a new community center that will serve residents across multiple neighborhoods...",
      category: "Local"
    },
    {
      id: 2,
      title: "LOCAL SCHOOLS REPORT INCREASED ENROLLMENT",
      date: "August 18, 2025",
      comments: 12,
      image: "",
      excerpt: "District schools are seeing a significant uptick in student enrollment for the upcoming academic year, prompting discussions about resource allocation...",
      category: "Education"
    },
    {
      id: 3,
      title: "FARMERS MARKET EXPANDS TO WEEKEND OPERATION",
      date: "August 15, 2025",
      comments: 8,
      image: "",
      excerpt: "The popular weekly farmers market will now operate on both Saturday and Sunday, bringing fresh local produce to more residents...",
      category: "Community"
    },
    {
      id: 4,
      title: "ROAD CONSTRUCTION PROJECT BEGINS NEXT MONTH",
      date: "August 12, 2025",
      comments: 15,
      image: "",
      excerpt: "Major infrastructure improvements are planned for the downtown area, with construction expected to begin in September and continue through spring...",
      category: "Infrastructure"
    },
    {
      id: 5,
      title: "NEW LIBRARY BRANCH OPENS IN WESTERN DISTRICT",
      date: "August 10, 2025",
      comments: 7,
      image: "",
      excerpt: "The newest branch of the public library system officially opened its doors, providing essential services to underserved areas of the community...",
      category: "Community"
    },
    {
      id: 6,
      title: "LOCAL BUSINESS ASSOCIATION HOSTS NETWORKING EVENT",
      date: "August 8, 2025",
      comments: 3,
      image: "",
      excerpt: "Small business owners gathered for the monthly networking breakfast to discuss challenges and opportunities in the current economic climate...",
      category: "Business"
    },
    {
      id: 7,
      title: "COMMUNITY GARDEN PROJECT SEEKS VOLUNTEERS",
      date: "August 5, 2025",
      comments: 11,
      image: "",
      excerpt: "A new community garden initiative is looking for volunteers to help transform an unused lot into a thriving green space for all residents...",
      category: "Community"
    },
    {
      id: 8,
      title: "LOCAL FIRE DEPARTMENT RECEIVES NEW EQUIPMENT",
      date: "August 3, 2025",
      comments: 6,
      image: "",
      excerpt: "The fire department has received state-of-the-art rescue equipment that will enhance their ability to respond to emergencies throughout the region...",
      category: "Safety"
    },
    {
      id: 9,
      title: "SUMMER FESTIVAL PLANNING COMMITTEE MEETS",
      date: "August 1, 2025",
      comments: 4,
      image: "",
      excerpt: "Organizers are finalizing details for the annual summer festival, which promises to be the biggest community celebration in years...",
      category: "Events"
    },
    {
      id: 10,
      title: "NEW BIKE PATHS CONNECT NEIGHBORHOODS",
      date: "July 28, 2025",
      comments: 9,
      image: "",
      excerpt: "A network of new bike paths has been completed, providing safe cycling routes that connect residential areas to the downtown business district...",
      category: "Infrastructure"
    },
    {
      id: 11,
      title: "YOUTH SPORTS PROGRAM REGISTRATION OPENS",
      date: "July 25, 2025",
      comments: 13,
      image: "",
      excerpt: "Registration is now open for fall youth sports programs, with new options including soccer, basketball, and tennis for children ages 6-16...",
      category: "Sports"
    },
    {
      id: 12,
      title: "LOCAL ARTIST WINS NATIONAL COMPETITION",
      date: "July 22, 2025",
      comments: 8,
      image: "",
      excerpt: "A local artist has been recognized with a prestigious national award for their innovative sculpture that will be displayed in the town square...",
      category: "Arts"
    },
    {
      id: 13,
      title: "SENIOR CENTER EXPANDS PROGRAMS",
      date: "July 20, 2025",
      comments: 5,
      image: "",
      excerpt: "The senior center is adding new fitness classes, computer training, and social activities to better serve the growing senior population...",
      category: "Community"
    }
  ];

  const recentArticles: string[] = [
    "COUNCIL APPROVES NEW COMMUNITY CENTER PROJECT",
    "LOCAL SCHOOLS REPORT INCREASED ENROLLMENT",
    "FARMERS MARKET EXPANDS TO WEEKEND OPERATION",
    "ROAD CONSTRUCTION PROJECT BEGINS NEXT MONTH",
    "NEW LIBRARY BRANCH OPENS IN WESTERN DISTRICT",
    "LOCAL BUSINESS ASSOCIATION HOSTS NETWORKING EVENT",
    "COMMUNITY GARDEN PROJECT SEEKS VOLUNTEERS"
  ];

  const fallbackRecentComments: Comment[] = [
    { author: "Sarah M.", post: "Council Approves New Community Center Project" },
    { author: "Mike Johnson", post: "Local Schools Report Increased Enrollment" },
    { author: "Emma Wilson", post: "Farmers Market Expands to Weekend Operation" },
    { author: "Tom Chen", post: "Road Construction Project Begins Next Month" },
    { author: "Lisa Brown", post: "New Library Branch Opens in Western District" }
  ];

  const bestOfRest: string[] = [
    "Community Development Plans",
    "Local Housing Market Update",
    "Public Transport Improvements",
    "Environmental Initiatives",
    "Youth Programs Expansion",
    "Senior Services Review",
    "Parks and Recreation Updates",
    "Economic Development News",
    "Cultural Events Calendar",
    "Health Services Announcement",
    "Education Board Meeting Notes",
    "Municipal Budget Overview"
  ];

  // Transform WordPress news data to component format
  const transformNewsData = (wpArticles: FormattedNewsArticle[]): Article[] => {
    return wpArticles.map(article => ({
      id: article.id,
      title: article.title,
      date: article.date,
      image: article.image,
      excerpt: article.excerpt,
      comments: article.commentCount || 0, // Use real comment count from WordPress
      commentCount: article.commentCount || 0,
      category: article.category || 'Local',
      content: article.content,
      author: article.author
    }));
  };

  // Fetch WordPress news data based on current URL
  useEffect(() => {
    let isCancelled = false;
    
    const fetchCategoryNews = async () => {
      const { categoryId, title } = getCategoryIdFromPath(location.pathname);
      
      // Update page title based on URL
      setCategoryTitle(title);
      
      // Log the mapping for debugging
      console.log('LocalNews: URL mapping result:', { 
        pathname: location.pathname, 
        categoryId, 
        title 
      });
      
      // Start with fallback data immediately
      if (!isCancelled) {
        setArticles(fallbackArticles);
        setTotalPages(Math.ceil(fallbackArticles.length / articlesPerPage));
        setLoading(false);
      }
      // Only fetch from WordPress if we have a category ID
      if (!categoryId) {
        console.log('No category ID found for path:', location.pathname);
        console.log('getCategoryIdFromPath function returned:', { categoryId, title });
        setLoading(false);
        setArticles([]);
        return;
      }
      
      // Set loading state while fetching
      setLoading(true);
      setArticles([]);
      
      try {
        const newsService = NewsServiceManager.getInstance();
        
        // Add timeout to prevent hanging
        const fetchWithTimeout = async (promise: Promise<any>, timeoutMs: number = 8000) => {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
          );
          return Promise.race([promise, timeoutPromise]);
        };
        
        // Fetch category news with timeout
        try {
          console.log(`Fetching articles for category ID: ${categoryId}, title: ${title}, path: ${location.pathname}`);
          const wpArticles = await fetchWithTimeout(
            newsService.getLatestNewsByCategoryId(categoryId, 18)
          );
          
          console.log('WordPress API response:', wpArticles);
          if (!isCancelled) {
            if (wpArticles && wpArticles.length > 0) {
              const transformedArticles = transformNewsData(wpArticles);
              console.log('Transformed articles:', transformedArticles);
              setArticles(transformedArticles);
              setTotalPages(Math.ceil(transformedArticles.length / articlesPerPage));
              console.log(`Successfully loaded ${wpArticles.length} WordPress articles for ${title}`);
            } else {
              console.warn(`No WordPress articles found for ${title}, received:`, wpArticles);
              setArticles([]);
              setTotalPages(1);
            }
            setLoading(false);
          }
        } catch (newsError) {
          if (!isCancelled) {
            console.error(`Error loading WordPress articles for ${title}:`, newsError);
            setArticles(fallbackArticles); // Only use fallback on error
            setTotalPages(Math.ceil(fallbackArticles.length / articlesPerPage));
            setLoading(false);
          }
        }
        
      } catch (error) {
        if (!isCancelled) {
          console.error(`Error loading WordPress articles for ${title}:`, error);
          setArticles(fallbackArticles); // Only use fallback on error
          setTotalPages(Math.ceil(fallbackArticles.length / articlesPerPage));
          setLoading(false);
        }
      }
    };

    // Fetch recent comments
    const fetchRecentComments = async () => {
      try {
        const newsService = NewsServiceManager.getInstance();
        const comments = await newsService.fetchRecentComments(5);
        
        if (comments && comments.length > 0 && !isCancelled) {
          setRecentComments(comments);
          console.log(`Successfully loaded ${comments.length} recent comments`);
        } else if (!isCancelled) {
          console.warn('No recent comments found, keeping fallback data');
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Error loading recent comments (using fallback):', error);
        }
      }
    };

    fetchCategoryNews();
    fetchRecentComments();
    
    return () => {
      isCancelled = true;
    };
  }, [location.pathname]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleArticleClick = (article: Article) => {
    console.log('LocalNews: Navigating to article:', {
      id: article.id,
      title: article.title,
      url: `/article/${article.id}`
    });
    
    // Pass the full article data via state instead of just slug
    navigate(`/article/${article.id}`, { 
      state: { 
        article: article,
        categoryTitle: categoryTitle
      } 
    });
  };

  // Calculate articles for current page
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  return (
    <Box className={className} sx={{ py: 4, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Main Content */}
          <Box sx={{ flex: { md: '2 1 0%' } }}>
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontWeight: 700, 
                  color: 'primary.main',
                  mb: 2,
                  borderBottom: 3,
                  borderColor: 'primary.main',
                  display: 'inline-block',
                  pb: 1
                }}
              >
                {categoryTitle}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Stay informed with the latest news and updates
              </Typography>
            </Box>

            {/* Articles Grid */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 3,
              mb: 4 
            }}>
              {loading ? (
                // Show loading skeletons
                Array.from({ length: 6 }).map((_, index) => (
                  <ArticleSkeleton key={`skeleton-${index}`} />
                ))
              ) : currentArticles.length > 0 ? (
                // Show actual articles
                currentArticles.map((article) => (
                  <Box key={article.id}>
                    <StyledCard>
                      {article.image && (
                        <StyledCardMedia
                          image={article.image}
                          title={article.title}
                        />
                      )}
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <ArticleTitle variant="h6">
                          {article.title}
                        </ArticleTitle>
                        {article.excerpt && (
                          <ArticleExcerpt variant="body2">
                            {article.excerpt}
                          </ArticleExcerpt>
                        )}
                        <ArticleMeta>
                          <Typography variant="caption" color="text.secondary">
                            {article.date}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            💬 {article.comments}
                          </Typography>
                        </ArticleMeta>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          sx={{ mt: 2, alignSelf: 'flex-start' }}
                          onClick={() => handleArticleClick(article)}
                        >
                          Continue reading
                        </Button>
                      </CardContent>
                    </StyledCard>
                  </Box>
                ))
              ) : (
                // Show empty state
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <EmptyState category={categoryTitle.toLowerCase()} />
                </Box>
              )}
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </Box>

          {/* Sidebar */}
          <Box sx={{ flex: { md: '1 1 0%' } }}>
            {/* Search */}
            <SidebarSection>
              <Box 
                component="form"
                onSubmit={(e: React.FormEvent) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const searchTerm = formData.get('search') as string;
                  if (searchTerm?.trim()) {
                    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
                  }
                }}
                sx={{ display: 'flex', gap: 1 }}
              >
                <Box
                  component="input"
                  type="text"
                  name="search"
                  placeholder="Search articles..."
                  sx={{
                    flex: 1,
                    p: 1,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    fontSize: '0.875rem',
                  }}
                />
                <Button type="submit" variant="contained" size="small">🔍</Button>
              </Box>
            </SidebarSection>

            {/* Follow Us */}
            <SidebarSection>
              <SidebarTitle>FOLLOW US</SidebarTitle>
              <SocialIcons>
                <SocialIcon href="http://www.facebook.com/MegaphoneOz" target="_blank" rel="noopener noreferrer" className="facebook">f</SocialIcon>
                <SocialIcon href="https://www.flickr.com/photos/megaphoneoz/" target="_blank" rel="noopener noreferrer" className="flickr">fl</SocialIcon>
                <SocialIcon href="http://instagram.com/megaphoneoz/" target="_blank" rel="noopener noreferrer" className="instagram">📷</SocialIcon>
                <SocialIcon href="https://twitter.com/MegaphoneOZ" target="_blank" rel="noopener noreferrer" className="twitter">t</SocialIcon>
                <SocialIcon href="https://www.youtube.com/channel/UCsp_yc-87m1D5BnUYCoxTAw" target="_blank" rel="noopener noreferrer" className="youtube">▶</SocialIcon>
              </SocialIcons>
            </SidebarSection>

            {/* Recent Articles */}
            <SidebarSection>
              <SidebarTitle>RECENT ARTICLES</SidebarTitle>
              <RecentList>
                {recentArticles.map((article, index) => (
                  <li key={index}>
                    <Box component="button" sx={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left', p: 0, fontSize: 'inherit', lineHeight: 'inherit', fontFamily: 'inherit' }}>{article}</Box>
                  </li>
                ))}
              </RecentList>
            </SidebarSection>

            {/* Recent Comments */}
            <SidebarSection>
              <SidebarTitle>RECENT COMMENTS</SidebarTitle>
              <RecentList>
                {recentComments.length > 0 ? recentComments.map((comment) => (
                  <li key={comment.id}>
                    <strong>{comment.authorName}</strong> on{' '}
                    <Box 
                      component="button" 
                      sx={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'inherit', 
                        cursor: 'pointer', 
                        textAlign: 'left', 
                        p: 0, 
                        fontSize: 'inherit', 
                        lineHeight: 'inherit', 
                        fontFamily: 'inherit',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {comment.content.length > 50 ? `${comment.content.substring(0, 50)}...` : comment.content}
                    </Box>
                    <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'text.secondary' }}>
                      {comment.date}
                    </Typography>
                  </li>
                )) : (
                  // Fallback comments if WordPress data is not available
                  fallbackRecentComments.map((comment, index) => (
                    <li key={index}>
                      <strong>{comment.author}</strong> on{' '}
                      <Box component="button" sx={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left', p: 0, fontSize: 'inherit', lineHeight: 'inherit', fontFamily: 'inherit' }}>{comment.post}</Box>
                    </li>
                  ))
                )}
              </RecentList>
            </SidebarSection>

            {/* Best of the Rest */}
            <SidebarSection>
              <SidebarTitle>BEST OF THE REST</SidebarTitle>
              <RecentList>
                {bestOfRest.map((item, index) => (
                  <li key={index}>
                    <Box component="img" src="https://megaphoneoz.com/wp-content/uploads/2015/05/MegaphoneGravatar.jpg" alt="Megaphone Icon" sx={{ width: 16, height: 16, mr: 1, verticalAlign: 'middle' }} />
                    <Box component="button" sx={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left', p: 0, fontSize: 'inherit', lineHeight: 'inherit', fontFamily: 'inherit' }}>{item}</Box>
                  </li>
                ))}
              </RecentList>
              <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="body2">
                  <a href="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                    MegaphoneOz Users: Login
                  </a>
                </Typography>
              </Box>
            </SidebarSection>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LocalNews;