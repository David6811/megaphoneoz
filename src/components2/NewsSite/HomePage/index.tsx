import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  CardMedia,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Stack
} from '@mui/material';
import {
  Search,
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  Person,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material';
import ImageGallerySlider from '../../../components/ImageGallerySlider';

const NewsHomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Banner carousel data
  const bannerSlides = [
    {
      id: 1,
      title: "Local Film Festival Showcases Independent Cinema",
      image: "https://picsum.photos/1200/400?random=1",
      category: "Arts & Entertainment"
    },
    {
      id: 2,
      title: "Community Garden Project Brings Neighbors Together",
      image: "https://picsum.photos/1200/400?random=2",
      category: "Lifestyle"
    },
    {
      id: 3,
      title: "New Art Gallery Opens in Downtown District", 
      image: "https://picsum.photos/1200/400?random=3",
      category: "Arts & Entertainment"
    }
  ];

  // Main news (1 left + 3 right)
  const mainNews = {
    featured: {
      id: 1,
      title: "Cultural Festival Celebrates Diversity in Local Community",
      excerpt: "Annual multicultural festival brings together residents from various backgrounds to celebrate art, food, and traditions in the heart of the city.",
      image: "https://picsum.photos/600/400?random=4",
      date: "2 hours ago",
      comments: 45
    },
    sideNews: [
      {
        id: 2,
        title: "Local Restaurant Wins National Culinary Award",
        image: "https://picsum.photos/300/200?random=5",
        date: "4 hours ago"
      },
      {
        id: 3,
        title: "Street Art Project Transforms City Walls",
        image: "https://picsum.photos/300/200?random=6", 
        date: "6 hours ago"
      },
      {
        id: 4,
        title: "Community Theatre Announces New Season",
        image: "https://picsum.photos/300/200?random=7",
        date: "8 hours ago"
      }
    ]
  };

  // Recent articles
  const recentArticles = [
    {
      id: 1,
      title: "Weekend Markets Feature Local Artisans",
      excerpt: "Discover unique handmade crafts and local produce at this week's community markets.",
      date: "1 day ago",
      comments: 12
    },
    {
      id: 2, 
      title: "Music Festival Planning Committee Seeks Volunteers",
      excerpt: "Help organize the annual summer music festival that brings together local and touring acts.",
      date: "2 days ago",
      comments: 8
    },
    {
      id: 3,
      title: "New Bike Paths Connect Suburban Communities",
      excerpt: "Infrastructure improvements make cycling safer and more accessible for residents.",
      date: "3 days ago", 
      comments: 23
    }
  ];

  // Arts and Entertainment
  const artsEntertainment = [
    {
      id: 1,
      title: "Gallery Opening: Contemporary Local Artists",
      image: "https://picsum.photos/250/150?random=8",
      date: "Tomorrow, 7 PM"
    },
    {
      id: 2,
      title: "Jazz Night at the Community Center",
      image: "https://picsum.photos/250/150?random=9", 
      date: "Friday, 8 PM"
    },
    {
      id: 3,
      title: "Book Reading: Local Author's New Novel",
      image: "https://picsum.photos/250/150?random=10",
      date: "Saturday, 3 PM"
    }
  ];

  // Recent comments
  const recentComments = [
    {
      id: 1,
      author: "Sarah M.",
      comment: "Great coverage of the festival! Looking forward to next year.",
      article: "Cultural Festival Celebrates...",
      time: "5 minutes ago"
    },
    {
      id: 2,
      author: "Mike D.",
      comment: "The new bike paths are fantastic for family rides.",
      article: "New Bike Paths Connect...",
      time: "1 hour ago"
    },
    {
      id: 3,
      author: "Emma L.",
      comment: "Can't wait to try that award-winning restaurant!",
      article: "Local Restaurant Wins...",
      time: "2 hours ago"
    }
  ];

  // Popular posts
  const popularPosts = [
    "Summer Events Guide 2024",
    "Best Local Coffee Shops",
    "Community Garden Tips",
    "Weekend Family Activities",
    "Local Business Spotlight"
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

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  return (
    <Box sx={{ 
      bgcolor: '#ffffff', 
      minHeight: '100vh', 
      pt: 6 
    }}>
      <Container maxWidth="xl">
        {/* Banner Carousel */}
        <Box sx={{ mb: 5, position: 'relative' }}>
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 1, 
              overflow: 'hidden',
              position: 'relative',
              bgcolor: 'transparent'
            }}
          >
            <Box sx={{ position: 'relative', height: 400 }}>
              <CardMedia
                component="img"
                height="400"
                image={bannerSlides[currentSlide].image}
                alt={bannerSlides[currentSlide].title}
                sx={{ objectFit: 'cover' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  color: 'white',
                  p: 4
                }}
              >
                <Box sx={{ 
                  display: 'inline-block',
                  bgcolor: '#1976d2', 
                  color: 'white',
                  px: 2,
                  py: 0.5,
                  mb: 2,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5
                }}>
                  {bannerSlides[currentSlide].category}
                </Box>
                <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
                  {bannerSlides[currentSlide].title}
                </Typography>
              </Box>
            </Box>

            {/* Navigation Arrows */}
            <IconButton
              onClick={prevSlide}
              sx={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
              }}
            >
              <ArrowBack />
            </IconButton>
            <IconButton
              onClick={nextSlide}
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
              }}
            >
              <ArrowForward />
            </IconButton>

            {/* Pagination Dots */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 1
              }}
            >
              {bannerSlides.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: currentSlide === index ? 'white' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Box>

        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* Main Content */}
          <Box sx={{ flex: 2 }}>
            {/* Search Box */}
            <Box sx={{ mb: 5 }}>
              <TextField
                fullWidth
                placeholder="Search news, politics, sports, business..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#999' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f8f9fa',
                    border: 'none',
                    '& fieldset': {
                      border: 'none'
                    },
                    '&:hover': {
                      bgcolor: '#f0f1f2'
                    },
                    '&.Mui-focused': {
                      bgcolor: 'white',
                      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
                    }
                  }
                }}
              />
            </Box>

            {/* Video Section */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#1976d2' }}>
                🎬 Featured Video
              </Typography>
              <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
                <iframe
                  width="100%"
                  height="400"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Featured Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: '12px' }}
                />
              </Box>
              <Box sx={{ mt: 3, p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: '#1976d2' }}>
                  Australia's Cultural Diversity: A Celebration of Unity
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Discover the rich tapestry of Australian culture through the stories of our diverse communities.
                </Typography>
                <Typography variant="caption" color="primary.main" fontWeight="600">
                  Duration: 3:32 • 15.2K views • Published 2 days ago
                </Typography>
              </Box>
            </Paper>

            {/* Latest News */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 4, color: '#333' }}>
                Latest News
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                {/* Featured News (Left) */}
                <Box sx={{ flex: 2 }}>
                  <Box sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)' }, transition: 'transform 0.2s ease' }}>
                    <CardMedia
                      component="img"
                      height="250"
                      image={mainNews.featured.image}
                      alt={mainNews.featured.title}
                      sx={{ borderRadius: 1, mb: 2 }}
                    />
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 2, color: '#333', lineHeight: 1.2 }}>
                      {mainNews.featured.title}
                    </Typography>
                    <Typography variant="body1" color="#666" sx={{ mb: 2, lineHeight: 1.6 }}>
                      {mainNews.featured.excerpt}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" color="#999" sx={{ fontSize: '0.9rem' }}>
                        {mainNews.featured.date}
                      </Typography>
                      <Typography variant="body2" color="#999" sx={{ fontSize: '0.9rem' }}>
                        {mainNews.featured.comments} comments
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Side News (Right) */}
                <Box sx={{ flex: 1, ml: 4 }}>
                  <Stack spacing={3}>
                    {mainNews.sideNews.map((article) => (
                      <Box key={article.id} sx={{ display: 'flex', cursor: 'pointer', '&:hover h6': { color: '#1976d2' }, transition: 'all 0.2s ease' }}>
                        <CardMedia
                          component="img"
                          sx={{ width: 120, height: 80, borderRadius: 1, mr: 2 }}
                          image={article.image}
                          alt={article.title}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: '#333', fontSize: '1rem', lineHeight: 1.3 }}>
                            {article.title}
                          </Typography>
                          <Typography variant="body2" color="#999" sx={{ fontSize: '0.85rem' }}>
                            {article.date}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Box>

            {/* More News */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 4, color: '#333' }}>
                More News
              </Typography>
              <Stack spacing={2}>
                {recentArticles.map((article) => (
                  <Box key={article.id}>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: '#333', fontSize: '1rem', lineHeight: 1.3 }}>
                      {article.title}
                    </Typography>
                    <Typography variant="body2" color="#666" sx={{ mb: 1, lineHeight: 1.4 }}>
                      {article.excerpt}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="caption" color="#999">
                        {article.date}
                      </Typography>
                      <Typography variant="caption" color="#999">
                        {article.comments} comments
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Arts & Entertainment */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 4, color: '#333' }}>
                Arts & Entertainment
              </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                  {artsEntertainment.map((event) => (
                    <Box key={event.id} sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)' }, transition: 'transform 0.3s ease' }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={event.image}
                        alt={event.title}
                        sx={{ borderRadius: 1, mb: 2 }}
                      />
                      <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: '#333', lineHeight: 1.3, fontSize: '1rem' }}>
                        {event.title}
                      </Typography>
                      <Typography variant="body2" color="#999" sx={{ fontSize: '0.85rem' }}>
                        {event.date}
                      </Typography>
                    </Box>
                  ))}
                </Box>
            </Box>
          </Box>

          {/* Sidebar */}
          <Box sx={{ flex: 1 }}>
            {/* Social Media */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#333' }}>
                  Follow Us
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <IconButton sx={{ 
                    bgcolor: '#f8f9fa', 
                    color: '#1877F2', 
                    width: 44, 
                    height: 44,
                    borderRadius: 2,
                    '&:hover': { bgcolor: '#1877F2', color: 'white', transform: 'translateY(-2px)' },
                    transition: 'all 0.2s ease'
                  }}>
                    <Facebook />
                  </IconButton>
                  <IconButton sx={{ 
                    bgcolor: '#f8f9fa', 
                    color: '#1DA1F2', 
                    width: 44, 
                    height: 44,
                    borderRadius: 2,
                    '&:hover': { bgcolor: '#1DA1F2', color: 'white', transform: 'translateY(-2px)' },
                    transition: 'all 0.2s ease'
                  }}>
                    <Twitter />
                  </IconButton>
                  <IconButton sx={{ 
                    bgcolor: '#f8f9fa', 
                    color: '#E4405F', 
                    width: 44, 
                    height: 44,
                    borderRadius: 2,
                    '&:hover': { bgcolor: '#E4405F', color: 'white', transform: 'translateY(-2px)' },
                    transition: 'all 0.2s ease'
                  }}>
                    <Instagram />
                  </IconButton>
                  <IconButton sx={{ 
                    bgcolor: '#f8f9fa', 
                    color: '#FF0000', 
                    width: 44, 
                    height: 44,
                    borderRadius: 2,
                    '&:hover': { bgcolor: '#FF0000', color: 'white', transform: 'translateY(-2px)' },
                    transition: 'all 0.2s ease'
                  }}>
                    <YouTube />
                  </IconButton>
                </Box>
            </Box>

            {/* Recent Comments */}
            <Box sx={{ mb: 5 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: '#333' }}>
                Recent Comments
              </Typography>
              <List sx={{ p: 0 }}>
                {recentComments.map((comment) => (
                  <ListItem key={comment.id} sx={{ px: 0, alignItems: 'flex-start' }}>
                    <ListItemAvatar>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        <Person fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="bold">
                          {comment.author}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            {comment.comment}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            on "{comment.article}" • {comment.time}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Editor's Choice */}
            <Box sx={{ mb: 5 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: '#333' }}>
                Editor's Choice
              </Typography>
                <Stack spacing={3}>
                  <Box sx={{ cursor: 'pointer', '&:hover': { transform: 'translateX(4px)' }, transition: 'transform 0.2s ease' }}>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5, color: '#333', fontSize: '0.95rem', lineHeight: 1.4 }}>
                      Sydney Restaurant Wins International Culinary Award
                    </Typography>
                    <Typography variant="caption" color="#666">
                      Local cuisine gains global recognition
                    </Typography>
                  </Box>
                  <Box sx={{ cursor: 'pointer', '&:hover': { transform: 'translateX(4px)' }, transition: 'transform 0.2s ease' }}>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5, color: '#333', fontSize: '0.95rem', lineHeight: 1.4 }}>
                      Independent Music Venues See Revival
                    </Typography>
                    <Typography variant="caption" color="#666">
                      Live music returns to Australian cities
                    </Typography>
                  </Box>
                  <Box sx={{ cursor: 'pointer', '&:hover': { transform: 'translateX(4px)' }, transition: 'transform 0.2s ease' }}>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5, color: '#333', fontSize: '0.95rem', lineHeight: 1.4 }}>
                      Urban Agriculture Transforms Communities
                    </Typography>
                    <Typography variant="caption" color="#666">
                      Community gardens promote sustainable living
                    </Typography>
                  </Box>
                </Stack>
            </Box>

            {/* Most Read */}
            <Box sx={{ mb: 5 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: '#333' }}>
                Most Read
              </Typography>
              <Stack spacing={2}>
                {popularPosts.map((post, index) => (
                  <Box key={index} sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: 1.5, 
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateX(4px)' },
                    transition: 'transform 0.2s ease'
                  }}>
                    <Typography variant="h6" sx={{ 
                      minWidth: 20, 
                      color: index < 3 ? '#1976d2' : '#666',
                      fontWeight: 'bold',
                      fontSize: '1rem'
                    }}>
                      {index + 1}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      flex: 1, 
                      color: '#333',
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      lineHeight: 1.3
                    }}>
                      {post}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>


            {/* Newsletter */}
            <Box sx={{ mb: 5 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: '#333' }}>
                Newsletter
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: '#666', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Get the latest Australian news delivered to your inbox.
              </Typography>
              <TextField
                size="small"
                placeholder="Enter email address"
                fullWidth
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f8f9fa',
                    border: 'none',
                    '& fieldset': {
                      border: 'none'
                    },
                    '&:hover': {
                      bgcolor: '#f0f1f2'
                    },
                    '&.Mui-focused': {
                      bgcolor: 'white',
                      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
                    }
                  }
                }}
              />
              <Button 
                variant="contained" 
                fullWidth
                sx={{
                  borderRadius: 2,
                  bgcolor: '#1976d2',
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  py: 1,
                  '&:hover': {
                    bgcolor: '#1565c0',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                Subscribe
              </Button>
            </Box>

            {/* Events */}
            <Box sx={{ mb: 5 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: '#333' }}>
                Upcoming Events
              </Typography>
              <Box sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)' }, transition: 'transform 0.2s ease' }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5, color: '#333', fontSize: '1rem', lineHeight: 1.3 }}>
                  Australian Film Festival 2025
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: '#666', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Celebrating the best of Australian cinema with premieres, industry panels, and awards ceremony.
                </Typography>
                <Typography variant="caption" color="#999" sx={{ display: 'block', mb: 0.5, fontSize: '0.85rem' }}>
                  March 15-22, 2025
                </Typography>
                <Typography variant="caption" color="#999" sx={{ fontSize: '0.85rem' }}>
                  Various venues, Sydney
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Image Gallery Slider */}
        <Box sx={{ mt: 4, py: 3, bgcolor: 'white', borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#333', textAlign: 'center' }}>
            FEATURED GALLERY
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

export default NewsHomePage;