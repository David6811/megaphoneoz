import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardMedia, CardContent, Pagination, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import WordPressNewsService, { FormattedNewsArticle } from '../../services/wordpressNewsService';
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
  '-webkit-line-clamp': 3,
  '-webkit-box-orient': 'vertical',
  overflow: 'hidden',
}));

const ArticleExcerpt = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
  display: '-webkit-box',
  '-webkit-line-clamp': 3,
  '-webkit-box-orient': 'vertical',
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

interface LocalNewsProps {
  className?: string;
}

const LocalNews: React.FC<LocalNewsProps> = ({ className = '' }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const articlesPerPage = 12;

  // Fallback data for local news
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

  const recentComments: Comment[] = [
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
      comments: 0, // WordPress doesn't provide comment count in this endpoint
      category: article.category || 'Local'
    }));
  };

  // Fetch WordPress news data for local category
  useEffect(() => {
    let isCancelled = false;
    
    const fetchLocalNews = async () => {
      // Start with fallback data immediately
      if (!isCancelled) {
        setArticles(fallbackArticles);
        setTotalPages(Math.ceil(fallbackArticles.length / articlesPerPage));
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
        
        // Fetch local news with timeout
        try {
          const wpArticles = await fetchWithTimeout(
            newsService.getLatestNewsByCategory('local', 20)
          );
          
          if (wpArticles && wpArticles.length > 0 && !isCancelled) {
            const transformedArticles = transformNewsData(wpArticles);
            setArticles(transformedArticles);
            setTotalPages(Math.ceil(transformedArticles.length / articlesPerPage));
            console.log('Successfully loaded WordPress local news articles:', wpArticles.length);
          } else if (!isCancelled) {
            console.warn('No WordPress local news found, keeping fallback data');
          }
        } catch (newsError) {
          console.error('Error loading WordPress local news (using fallback):', newsError);
        }
        
      } catch (error) {
        if (!isCancelled) {
          console.error('Error loading WordPress local news (using fallback):', error);
        }
      }
    };

    fetchLocalNews();
    
    return () => {
      isCancelled = true;
    };
  }, []);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                LOCAL NEWS ARCHIVE
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Stay informed with the latest news from your local community
              </Typography>
            </Box>

            {/* Articles Grid */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 3,
              mb: 4 
            }}>
              {currentArticles.map((article) => (
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
                      >
                        Continue reading
                      </Button>
                    </CardContent>
                  </StyledCard>
                </Box>
              ))}
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
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Box
                  component="input"
                  type="text"
                  placeholder="Search"
                  sx={{
                    flex: 1,
                    p: 1,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    fontSize: '0.875rem',
                  }}
                />
                <Button variant="contained" size="small">🔍</Button>
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
                {recentComments.map((comment, index) => (
                  <li key={index}>
                    <strong>{comment.author}</strong> on{' '}
                    <Box component="button" sx={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left', p: 0, fontSize: 'inherit', lineHeight: 'inherit', fontFamily: 'inherit' }}>{comment.post}</Box>
                  </li>
                ))}
              </RecentList>
            </SidebarSection>

            {/* Best of the Rest */}
            <SidebarSection>
              <SidebarTitle>BEST OF THE REST</SidebarTitle>
              <RecentList>
                {bestOfRest.map((item, index) => (
                  <li key={index}>
                    📰 <Box component="button" sx={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left', p: 0, fontSize: 'inherit', lineHeight: 'inherit', fontFamily: 'inherit' }}>{item}</Box>
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