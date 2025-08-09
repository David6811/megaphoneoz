import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardMedia, 
  CardContent, 
  Paper, 
  TextField, 
  Button,
  Chip,
  Avatar,
  IconButton,
  Stack,
  Divider,
  Tab,
  Tabs,
  LinearProgress
} from '@mui/material';
import { 
  TrendingUp, 
  Schedule, 
  Share, 
  Bookmark, 
  Facebook, 
  Twitter, 
  Instagram, 
  YouTube,
  Notifications,
  Search,
  Language,
  WbSunny,
  ShowChart,
  Comment,
  Visibility,
  Person,
  BusinessCenter,
  Sports,
  TheaterComedy,
  HealthAndSafety,
  Science,
  Computer,
  Public,
  Menu,
  Close
} from '@mui/icons-material';
import { HomepageProps, SlideData, Article } from '../../types';
import WordPressNewsService, { FormattedNewsArticle } from '../../services/wordpressNewsService';
import ImageGallerySlider from '../../components/ImageGallerySlider';

const NewHomepage: React.FC<HomepageProps> = () => {
  const [featuredArticles, setFeaturedArticles] = useState<SlideData[]>([]);
  const [newsArticles, setNewsArticles] = useState<Article[]>([]);
  const [artsArticles, setArtsArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Professional fallback data
  const fallbackFeaturedArticles: SlideData[] = [
    {
      id: 1,
      title: "Global Economic Summit Addresses Climate Finance Initiative",
      date: "2 hours ago",
      image: "https://picsum.photos/1400/700?random=1",
      category: "WORLD"
    },
    {
      id: 2,
      title: "Breakthrough in Renewable Energy Technology Announced",
      date: "4 hours ago",
      image: "https://picsum.photos/1400/700?random=2", 
      category: "TECHNOLOGY"
    },
    {
      id: 3,
      title: "Healthcare Innovation Receives Multi-Billion Investment",
      date: "6 hours ago",
      image: "https://picsum.photos/1400/700?random=3",
      category: "HEALTH"
    }
  ];

  const fallbackNewsArticles: Article[] = [
    {
      id: 1,
      title: "Market Analysis: Tech Stocks Surge Following AI Breakthrough",
      date: "30 minutes ago",
      comments: 247,
      image: "https://picsum.photos/800/400?random=4",
      excerpt: "Leading technology companies see unprecedented growth as artificial intelligence capabilities reach new milestones, transforming multiple industries and creating significant market opportunities."
    },
    {
      id: 2,
      title: "International Trade Agreement Reshapes Pacific Economic Zone",
      date: "1 hour ago", 
      comments: 189,
      image: "https://picsum.photos/800/400?random=5",
      excerpt: "Comprehensive trade deal between twelve Pacific nations promises to revolutionize commerce, reduce tariffs, and establish new frameworks for digital trade in the region."
    },
    {
      id: 3,
      title: "Scientific Breakthrough in Cancer Research Shows Promise",
      date: "2 hours ago",
      comments: 312,
      image: "https://picsum.photos/800/400?random=6",
      excerpt: "International research consortium announces significant progress in targeted therapy development, offering new hope for patients with previously untreatable conditions."
    },
    {
      id: 4,
      title: "Climate Action Summit Produces Landmark Environmental Accord",
      date: "3 hours ago",
      comments: 456,
      image: "https://picsum.photos/800/400?random=7",
      excerpt: "World leaders commit to ambitious carbon reduction targets and establish new international framework for environmental accountability and sustainable development."
    },
    {
      id: 5,
      title: "Education Technology Revolution Transforms Global Learning",
      date: "4 hours ago",
      comments: 178,
      image: "https://picsum.photos/800/400?random=8",
      excerpt: "Advanced digital platforms and AI-powered personalized learning systems are being adopted by educational institutions worldwide, promising enhanced outcomes."
    },
    {
      id: 6,
      title: "Space Exploration Initiative Announces Mars Mission Timeline",
      date: "5 hours ago",
      comments: 523,
      image: "https://picsum.photos/800/400?random=9",
      excerpt: "International space consortium reveals detailed plans for human Mars colonization, including advanced life support systems and sustainable habitat construction."
    }
  ];

  const fallbackArtsArticles: Article[] = [
    {
      id: 1,
      title: "Venice Biennale Showcases Revolutionary Digital Art Installations",
      date: "1 hour ago",
      comments: 89,
      image: "https://picsum.photos/600/400?random=10",
      excerpt: "Cutting-edge digital artists present immersive experiences that blend virtual reality with traditional artistic expression, creating unprecedented viewer engagement."
    },
    {
      id: 2,
      title: "Broadway Revival Season Breaks Box Office Records",
      date: "3 hours ago",
      comments: 156,
      image: "https://picsum.photos/600/400?random=11",
      excerpt: "Classic musical revivals and innovative new productions attract record audiences, signaling a renaissance in live theatrical entertainment."
    },
    {
      id: 3,
      title: "International Film Festival Celebrates Independent Cinema",
      date: "5 hours ago",
      comments: 203,
      image: "https://picsum.photos/600/400?random=12",
      excerpt: "Emerging filmmakers from around the world present groundbreaking narratives that challenge conventional storytelling and address contemporary social issues."
    }
  ];

  const categories = [
    { label: 'World', icon: <Public />, value: 'world' },
    { label: 'Politics', icon: <BusinessCenter />, value: 'politics' },
    { label: 'Business', icon: <ShowChart />, value: 'business' },
    { label: 'Technology', icon: <Computer />, value: 'technology' },
    { label: 'Sports', icon: <Sports />, value: 'sports' },
    { label: 'Entertainment', icon: <TheaterComedy />, value: 'entertainment' },
    { label: 'Health', icon: <HealthAndSafety />, value: 'health' },
    { label: 'Science', icon: <Science />, value: 'science' }
  ];

  const breakingNews = [
    "BREAKING: Global climate accord signed by 195 nations",
    "URGENT: Major breakthrough in quantum computing announced", 
    "DEVELOPING: International trade summit reaches historic agreement",
    "LATEST: Space mission successfully launches toward Mars"
  ];

  const trendingTopics = [
    { title: "Climate Summit", count: 15420, trend: '+12%' },
    { title: "AI Revolution", count: 12847, trend: '+8%' },
    { title: "Market Analysis", count: 9632, trend: '+15%' },
    { title: "Space Exploration", count: 8451, trend: '+22%' },
    { title: "Global Health", count: 7239, trend: '+5%' }
  ];

  const weatherData = {
    location: "Sydney, AU",
    temperature: "22°C",
    condition: "Sunny",
    humidity: "65%"
  };

  const stockData = [
    { symbol: "ASX", value: "7,842.1", change: "+1.2%" },
    { symbol: "NASDAQ", value: "15,632.8", change: "+0.8%" },
    { symbol: "DOW", value: "35,421.7", change: "-0.3%" }
  ];

  // Gallery images for the slider
  const galleryImages = [
    {
      id: 1,
      src: "https://picsum.photos/200/150?random=1",
      alt: "Review: Skank Sinatra",
      title: "REVIEW: SKANK",
      date: "June 15, 2025"
    },
    {
      id: 2,
      src: "https://picsum.photos/200/150?random=2",
      alt: "SU Anime Society",
      title: "SU ANIME",
      date: "June 15, 2025"
    },
    {
      id: 3,
      src: "https://picsum.photos/200/150?random=3",
      alt: "Arts Review",
      title: "ARTS REVIEW",
      date: "June 13, 2025"
    },
    {
      id: 4,
      src: "https://picsum.photos/200/150?random=4",
      alt: "Music Concert",
      title: "MUSIC",
      date: "June 1, 2025"
    },
    {
      id: 5,
      src: "https://picsum.photos/200/150?random=5",
      alt: "Theatre Review",
      title: "THEATRE",
      date: "May 28, 2025"
    },
    {
      id: 6,
      src: "https://picsum.photos/200/150?random=6",
      alt: "Film Festival",
      title: "FILM",
      date: "May 25, 2025"
    },
    {
      id: 7,
      src: "https://picsum.photos/200/150?random=7",
      alt: "Cultural Event",
      title: "CULTURE",
      date: "May 20, 2025"
    },
    {
      id: 8,
      src: "https://picsum.photos/200/150?random=8",
      alt: "Exhibition",
      title: "EXHIBITION",
      date: "May 18, 2025"
    },
    {
      id: 9,
      src: "https://picsum.photos/200/150?random=9",
      alt: "Performance",
      title: "PERFORMANCE",
      date: "May 15, 2025"
    },
    {
      id: 10,
      src: "https://picsum.photos/200/150?random=10",
      alt: "Gallery Opening",
      title: "GALLERY",
      date: "May 12, 2025"
    }
  ];

  // Transform WordPress news data
  const transformNewsData = (wpArticles: FormattedNewsArticle[]): { slides: SlideData[], articles: Article[] } => {
    const slides: SlideData[] = wpArticles.slice(0, 3).map(article => ({
      id: article.id,
      title: article.title,
      date: article.date,
      image: article.image,
      category: article.category
    }));

    const articles: Article[] = wpArticles.slice(0, 8).map(article => ({
      id: article.id,
      title: article.title,
      date: article.date,
      image: article.image,
      excerpt: article.excerpt,
      comments: Math.floor(Math.random() * 500) + 50,
      category: article.category
    }));

    return { slides, articles };
  };

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setFeaturedArticles(fallbackFeaturedArticles);
        setNewsArticles(fallbackNewsArticles);
        setArtsArticles(fallbackArtsArticles);
        setLoading(false);
        
        const newsService = WordPressNewsService.getInstance();
        
        const wpArticles = await newsService.getLatestNewsForSlider(12);
        if (wpArticles && wpArticles.length > 0) {
          const { slides, articles } = transformNewsData(wpArticles);
          setFeaturedArticles(slides);
          setNewsArticles(articles);
        }

        const artsArticles = await newsService.getLatestNewsByCategory('arts-entertainment', 3);
        if (artsArticles && artsArticles.length > 0) {
          const transformedArtsArticles: Article[] = artsArticles.map(article => ({
            id: article.id,
            title: article.title,
            date: article.date,
            image: article.image,
            excerpt: article.excerpt,
            comments: Math.floor(Math.random() * 300) + 20,
            category: article.category
          }));
          setArtsArticles(transformedArtsArticles);
        }
        
      } catch (error) {
        console.error('Error loading WordPress news:', error);
      }
    };

    fetchNewsData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 300 }}>
            Loading Global News Network
          </Typography>
          <LinearProgress sx={{ width: 300, mx: 'auto' }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      {/* Breaking News Ticker */}
      <Box sx={{ bgcolor: '#d32f2f', color: 'white', py: 1, overflow: 'hidden', borderBottom: '3px solid #b71c1c' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              label="BREAKING NEWS" 
              size="small" 
              sx={{ 
                bgcolor: 'white', 
                color: '#d32f2f', 
                fontWeight: 'bold',
                fontSize: '0.75rem',
                letterSpacing: '0.5px'
              }}
            />
            <Box sx={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  display: 'inline-block',
                  animation: 'scroll 40s linear infinite',
                  fontWeight: 500,
                  '@keyframes scroll': {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(-100%)' }
                  }
                }}
              >
                {breakingNews.join(' • ')}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Professional Navigation Header */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0', position: 'sticky', top: 0, zIndex: 1000 }}>
        <Container maxWidth="xl">
          <Box sx={{ py: 2 }}>
            {/* Top Bar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  GLOBAL NEWS NETWORK
                </Typography>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WbSunny fontSize="small" color="warning" />
                    <Typography variant="caption" sx={{ fontWeight: 500 }}>
                      {weatherData.location}: {weatherData.temperature}
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  {stockData.map((stock, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                        {stock.symbol}
                      </Typography>
                      <Typography variant="caption" color={stock.change.startsWith('+') ? 'success.main' : 'error.main'}>
                        {stock.change}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton size="small">
                  <Language />
                </IconButton>
                <IconButton size="small">
                  <Search />
                </IconButton>
                <IconButton size="small" sx={{ display: { md: 'none' } }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  {mobileMenuOpen ? <Close /> : <Menu />}
                </IconButton>
              </Box>
            </Box>

            {/* Category Navigation */}
            <Box sx={{ display: { xs: mobileMenuOpen ? 'block' : 'none', md: 'block' } }}>
              <Tabs 
                value={activeCategory} 
                onChange={(_, newValue) => setActiveCategory(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ 
                  borderBottom: '1px solid #e0e0e0',
                  '& .MuiTab-root': { 
                    minHeight: 48,
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.9rem'
                  }
                }}
              >
                {categories.map((category, index) => (
                  <Tab 
                    key={index}
                    icon={category.icon} 
                    label={category.label}
                    iconPosition="start"
                    sx={{ gap: 1 }}
                  />
                ))}
              </Tabs>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* Main Content */}
          <Box sx={{ flex: { lg: '2.5' } }}>
            {/* Hero Article */}
            <Card sx={{ mb: 4, overflow: 'hidden', position: 'relative' }}>
              <Box sx={{ position: 'relative', height: 600 }}>
                <CardMedia
                  component="img"
                  height="600"
                  image={featuredArticles[0]?.image}
                  alt={featuredArticles[0]?.title}
                  sx={{ objectFit: 'cover' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                    color: 'white',
                    p: 4
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={featuredArticles[0]?.category} 
                      size="small"
                      sx={{ 
                        bgcolor: '#1976d2', 
                        color: 'white',
                        fontWeight: 'bold',
                        letterSpacing: '0.5px'
                      }}
                    />
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, lineHeight: 1.2 }}>
                    {featuredArticles[0]?.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24 }}>
                          <Person fontSize="small" />
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          News Desk
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Schedule fontSize="small" />
                        <Typography variant="body2">
                          {featuredArticles[0]?.date}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                        <Share fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                        <Bookmark fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Card>

            {/* Featured Stories Grid */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', borderLeft: '4px solid #1976d2', pl: 2 }}>
                Top Stories
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                {newsArticles.slice(0, 4).map((article, index) => (
                  <Card 
                    key={article.id}
                    sx={{ 
                      height: '100%', 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        transform: 'translateY(-4px)', 
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)' 
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height={index < 2 ? "220" : "180"}
                      image={article.image}
                      alt={article.title}
                    />
                    <CardContent sx={{ p: 3 }}>
                      <Typography 
                        variant={index < 2 ? "h6" : "subtitle1"} 
                        sx={{ 
                          fontWeight: 'bold', 
                          mb: 2, 
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {article.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {article.excerpt}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {article.date}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Comment fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {article.comments}
                            </Typography>
                          </Box>
                          <IconButton size="small" color="primary">
                            <Share fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>

            {/* Latest News List */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', borderLeft: '4px solid #1976d2', pl: 2 }}>
                Latest Updates
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {newsArticles.slice(4).map((article) => (
                  <Card 
                    key={article.id}
                    sx={{ 
                      display: 'flex', 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': { bgcolor: '#f8f9fa', boxShadow: 2 }
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{ width: 240, height: 140, flexShrink: 0 }}
                      image={article.image}
                      alt={article.title}
                    />
                    <CardContent sx={{ flex: 1, p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, lineHeight: 1.3 }}>
                        {article.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {article.excerpt}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {article.date}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Visibility fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {Math.floor(Math.random() * 5000) + 1000}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Comment fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {article.comments}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>

            {/* Arts & Culture Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', borderLeft: '4px solid #f57c00', pl: 2 }}>
                Arts & Culture
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                {artsArticles.map((article) => (
                  <Card 
                    key={article.id}
                    sx={{ 
                      height: '100%', 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="180"
                      image={article.image}
                      alt={article.title}
                    />
                    <CardContent sx={{ p: 2.5 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: '1rem', lineHeight: 1.3 }}>
                        {article.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {article.excerpt}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {article.date}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Comment fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {article.comments}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Professional Sidebar */}
          <Box sx={{ flex: { lg: '1' } }}>
            {/* Search Widget */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Search News
              </Typography>
              <TextField
                fullWidth
                placeholder="Search global news..."
                variant="outlined"
                size="small"
                slotProps={{
                  input: {
                    endAdornment: (
                      <IconButton edge="end">
                        <Search />
                      </IconButton>
                    ),
                  },
                }}
                sx={{ mb: 2 }}
              />
              <Button 
                fullWidth 
                variant="contained" 
                sx={{ textTransform: 'none', fontWeight: 500 }}
              >
                Advanced Search
              </Button>
            </Paper>

            {/* Trending Topics */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp color="primary" />
                Trending Now
              </Typography>
              <Stack spacing={2}>
                {trendingTopics.map((topic, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                    <Box>
                      <Typography variant="body2" sx={{ cursor: 'pointer', fontWeight: 500, '&:hover': { color: 'primary.main' } }}>
                        #{topic.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {topic.count.toLocaleString()} mentions
                      </Typography>
                    </Box>
                    <Chip 
                      size="small" 
                      label={topic.trend} 
                      color={topic.trend.startsWith('+') ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </Box>
                ))}
              </Stack>
            </Paper>

            {/* Newsletter Subscription */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white' }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                Daily Briefing
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                Get today's top stories delivered to your inbox every morning
              </Typography>
              <TextField
                fullWidth
                placeholder="Your email address"
                variant="outlined"
                size="small"
                sx={{ 
                  mb: 2, 
                  bgcolor: 'white', 
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'white'
                  }
                }}
              />
              <Button 
                fullWidth 
                variant="contained" 
                sx={{ 
                  bgcolor: 'white', 
                  color: 'primary.main', 
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: 'grey.100' }
                }}
                startIcon={<Notifications />}
              >
                Subscribe Free
              </Button>
            </Paper>

            {/* Social Media */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Follow Us
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <IconButton 
                  component="a" 
                  href="http://www.facebook.com/MegaphoneOz" 
                  target="_blank"
                  sx={{ bgcolor: '#1877F2', color: 'white', '&:hover': { bgcolor: '#166FE5' } }}
                >
                  <Facebook />
                </IconButton>
                <IconButton 
                  component="a" 
                  href="https://twitter.com/MegaphoneOZ" 
                  target="_blank"
                  sx={{ bgcolor: '#1DA1F2', color: 'white', '&:hover': { bgcolor: '#1A91DA' } }}
                >
                  <Twitter />
                </IconButton>
                <IconButton 
                  component="a" 
                  href="http://instagram.com/megaphoneoz/" 
                  target="_blank"
                  sx={{ bgcolor: '#E4405F', color: 'white', '&:hover': { bgcolor: '#D73A56' } }}
                >
                  <Instagram />
                </IconButton>
                <IconButton 
                  component="a" 
                  href="https://www.youtube.com/channel/UCsp_yc-87m1D5BnUYCoxTAw" 
                  target="_blank"
                  sx={{ bgcolor: '#FF0000', color: 'white', '&:hover': { bgcolor: '#E60000' } }}
                >
                  <YouTube />
                </IconButton>
              </Box>
            </Paper>

            {/* Most Read */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Most Read Today
              </Typography>
              <Stack spacing={2}>
                {newsArticles.slice(0, 5).map((article, index) => (
                  <Box key={article.id} sx={{ display: 'flex', gap: 2, cursor: 'pointer', p: 1, borderRadius: 1, '&:hover': { bgcolor: 'grey.50' } }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: '0.875rem', fontWeight: 'bold' }}>
                      {index + 1}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 'bold', 
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          '&:hover': { color: 'primary.main' }
                        }}
                      >
                        {article.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          {article.date}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          • {article.comments} comments
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>

            {/* Weather Widget */}
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                <WbSunny color="warning" />
                Weather
              </Typography>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                  {weatherData.temperature}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {weatherData.condition}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {weatherData.location}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Humidity: {weatherData.humidity}
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
        
        {/* Image Gallery Slider */}
        <Box sx={{ mt: 6, py: 4, bgcolor: 'white', borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', borderLeft: '4px solid #1976d2', pl: 2 }}>
            Featured Gallery
          </Typography>
          <ImageGallerySlider 
            images={galleryImages}
            autoPlay={true}
            autoPlayInterval={3000}
            visibleCount={8}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default NewHomepage;