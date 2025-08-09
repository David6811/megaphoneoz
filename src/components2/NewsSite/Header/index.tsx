import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Chip,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Public,
  Business,
  Sports,
  TheaterComedy,
  Science,
  HealthAndSafety,
  Computer,
  Close,
  WbSunny,
  ExpandMore
} from '@mui/icons-material';

interface NewsHeaderProps {
  recentNews?: string[];
}

const NewsHeader: React.FC<NewsHeaderProps> = ({ recentNews = [] }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState<null | HTMLElement>(null);
  

  const navigationItems = [
    { 
      label: 'Home', 
      icon: <Home />, 
      path: '/',
      hasDropdown: false
    },
    { 
      label: 'News', 
      icon: <Public />, 
      path: '/news',
      hasDropdown: false
    },
    { 
      label: 'Lifestyle', 
      icon: <HealthAndSafety />, 
      path: '/lifestyle',
      hasDropdown: false
    },
    { 
      label: 'Arts and Entertainment', 
      icon: <TheaterComedy />, 
      path: '/arts-entertainment',
      hasDropdown: false
    },
    { 
      label: 'Opinion', 
      icon: <Science />, 
      path: '/opinion',
      hasDropdown: false
    },
    { 
      label: 'Contact Us', 
      icon: <Computer />, 
      path: '/contact',
      hasDropdown: false
    },
    { 
      label: 'About Us', 
      icon: <Business />, 
      path: '/about',
      hasDropdown: false
    },
    { 
      label: 'Coming Up', 
      icon: <Sports />, 
      path: '/coming-up',
      hasDropdown: false
    }
  ];

  const currentTime = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit'
  });

  const breakingNews = "BREAKING: Local Community Events and Cultural Celebrations This Weekend";

  const handleMenuClose = () => {
    setUserMenuAnchor(null);
    setLanguageMenuAnchor(null);
  };


  return (
    <>
      {/* Breaking News Bar */}
      <Box sx={{ bgcolor: '#d32f2f', color: 'white', py: 0.5, overflow: 'hidden' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              label="BREAKING NEWS" 
              size="small" 
              sx={{ 
                bgcolor: 'white', 
                color: '#d32f2f', 
                fontWeight: 'bold',
                fontSize: '0.7rem'
              }}
            />
            <Box sx={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  display: 'inline-block',
                  animation: 'scroll 30s linear infinite',
                  fontWeight: 500,
                  '@keyframes scroll': {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(-100%)' }
                  }
                }}
              >
                {breakingNews}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Header */}
      <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 2 }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 2, minHeight: 80, display: 'flex', alignItems: 'center' }}>
            {/* Mobile Menu Button */}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ display: { lg: 'none' }, mr: 2 }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 'fit-content' }}>
              <Typography
                variant="h4"
                component="div"
                sx={{
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.5px',
                  cursor: 'pointer'
                }}
              >
                MEGAPHONE OZ
              </Typography>
              <Box sx={{ ml: 3, display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="caption" color="text.secondary">
                  {currentTime}
                </Typography>
              </Box>
            </Box>

            {/* Recent News Sidebar */}
            <Box sx={{ 
              display: { xs: 'none', lg: 'flex' }, 
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              mx: 6,
              maxWidth: 400,
              minWidth: 300
            }}>
              <Typography variant="overline" sx={{ 
                fontSize: '0.7rem', 
                fontWeight: 'bold', 
                color: '#d32f2f',
                mb: 1,
                letterSpacing: 0.5
              }}>
                RECENT NEWS
              </Typography>
              <Box sx={{ 
                bgcolor: '#f8f9fa', 
                borderRadius: 2, 
                px: 2,
                py: 1, 
                width: '100%',
                height: 36,
                overflow: 'hidden',
                border: '1px solid #e0e0e0'
              }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    animation: 'scrollNews 25s linear infinite',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: 'text.primary',
                    lineHeight: '20px',
                    '@keyframes scrollNews': {
                      '0%': { transform: 'translateX(100%)' },
                      '100%': { transform: 'translateX(-100%)' }
                    }
                  }}
                >
                  {recentNews.length > 0 
                    ? recentNews.join(' • ') 
                    : 'SHREDDED TRUST: NATIONALS AND LIBERALS CLASH • USYD STUDENTS DEMAND UNIVERSITY CUT TIES • REVIEW: EUREKA DAY AT THE SEYMOUR CENTRE • TAIWAN\'S INDIGENOUS WONDER WOMAN RUNS'
                  }
                </Typography>
              </Box>
            </Box>

            {/* Weather Info */}
            <Box sx={{ 
              display: { xs: 'none', lg: 'flex' }, 
              alignItems: 'center', 
              gap: 0.5,
              minWidth: 'fit-content'
            }}>
              <WbSunny color="warning" fontSize="small" />
              <Typography variant="caption" fontWeight={500}>
                Sydney 22°C
              </Typography>
            </Box>

          </Toolbar>
        </Container>
      </AppBar>

      {/* Desktop Navigation - Modern Design */}
      <Box sx={{ 
        display: { xs: 'none', lg: 'block' }, 
        bgcolor: 'white',
        borderBottom: '2px solid #f0f0f0',
        position: 'sticky',
        top: 0,
        zIndex: 1099
      }}>
        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 0.5,
            py: 0
          }}>
            {navigationItems.map((item, index) => (
              <Box key={index} sx={{ position: 'relative' }}>
                <Button
                  sx={{
                    color: 'text.primary',
                    textTransform: 'none',
                    minWidth: 'auto',
                    px: 3,
                    py: 2,
                    borderRadius: 0,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'transparent',
                      color: '#1976d2',
                      '&::after': {
                        width: '100%'
                      }
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '0%',
                      height: '3px',
                      bgcolor: '#1976d2',
                      transition: 'width 0.3s ease'
                    }
                  }}
                >
                  {item.label}
                </Button>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Enhanced Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: { 
            width: 340,
            background: 'linear-gradient(180deg, #1976d2 0%, #1565c0 100%)',
            color: 'white'
          }
        }}
      >
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.2)'
        }}>
          <Typography variant="h5" fontWeight="bold" sx={{ color: 'white' }}>
            MEGAPHONE OZ
          </Typography>
          <IconButton 
            onClick={() => setMobileMenuOpen(false)} 
            sx={{ 
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <Close />
          </IconButton>
        </Box>
        <List sx={{ pt: 2, px: 1 }}>
          {navigationItems.map((item, index) => (
            <ListItem 
              key={index} 
              sx={{ 
                cursor: 'pointer',
                borderRadius: 2,
                mb: 1,
                mx: 1,
                transition: 'all 0.2s ease',
                '&:hover': { 
                  bgcolor: 'rgba(255,255,255,0.15)',
                  transform: 'translateX(8px)'
                }
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ 
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'white'
                }}
              />
              {item.hasDropdown && (
                <ExpandMore sx={{ 
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '20px'
                }} />
              )}
            </ListItem>
          ))}
        </List>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mx: 2, my: 2 }} />
        <Box sx={{ p: 3 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            {currentTime}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <WbSunny sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Sydney 22°C
            </Typography>
          </Box>
        </Box>
      </Drawer>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { mt: 1.5, minWidth: 220, borderRadius: 2 }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>U</Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold">Username</Typography>
            <Typography variant="caption" color="text.secondary">
              user@example.com
            </Typography>
          </Box>
        </Box>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>Bookmarks</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>Settings</MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.5, color: 'error.main' }}>Sign Out</MenuItem>
      </Menu>

      {/* Language Menu */}
      <Menu
        anchorEl={languageMenuAnchor}
        open={Boolean(languageMenuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { mt: 1.5, borderRadius: 2 }
        }}
      >
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>🇺🇸 English</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>🇦🇺 Australian English</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>🇬🇧 British English</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>🇨🇦 Canadian English</MenuItem>
      </Menu>
    </>
  );
};

export default NewsHeader;