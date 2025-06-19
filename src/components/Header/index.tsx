import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, useTheme, Box, Container, Menu, MenuItem, Fade, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { HeaderProps, NavigationItem, NavigationDropdownItem } from '../../types';

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [newsAnchorEl, setNewsAnchorEl] = useState<null | HTMLElement>(null);
  const [lifestyleAnchorEl, setLifestyleAnchorEl] = useState<null | HTMLElement>(null);
  const [artsAnchorEl, setArtsAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();

  const navigationItems: NavigationItem[] = [
    { label: 'Home', href: '/' },
    { label: 'News', href: '#', hasDropdown: true },
    { label: 'Lifestyle', href: '#', hasDropdown: true },
    { label: 'Arts and Entertainment', href: '#', hasDropdown: true },
    { label: 'Opinion', href: '/opinion' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'About Us', href: '/about' },
    { label: 'Coming Up', href: '/coming-up' },
  ];

  const newsCategories = [
    { label: 'Local', href: '/news/local' },
    { label: 'National', href: '/news/national' },
    { label: 'World', href: '/news/world' },
    { label: 'Features', href: '/news/features' },
    { label: 'Environment', href: '/news/environment' },
    { label: 'Media', href: '/news/media' },
  ];

  const lifestyleCategories = [
    { label: 'Food and Wine', href: '/lifestyle/food-wine', hasSubmenu: true, submenu: [
      { label: 'Restaurant Reviews', href: '/lifestyle/food-wine/restaurant-reviews' },
      { label: 'Wine Match', href: '/lifestyle/food-wine/wine-match' },
    ]},
    { label: 'Sport', href: '/lifestyle/sport' },
    { label: 'Travel', href: '/lifestyle/travel' },
  ];

  const artsCategories = [
    { label: 'Theatre', href: '/arts/theatre', hasSubmenu: true, submenu: [
      { label: 'Reviews', href: '/arts/theatre/reviews' },
    ]},
    { label: 'Film', href: '/arts/film' },
    { label: 'Music', href: '/arts/music' },
    { label: 'Galleries', href: '/arts/galleries', hasSubmenu: true, submenu: [
      { label: 'Exhibitions', href: '/arts/galleries/exhibitions' },
      { label: 'Eye On The Street', href: '/arts/galleries/eye-on-the-street' },
    ]},
    { label: 'Books', href: '/arts/books' },
    { label: 'Drawn and Quartered', href: '/arts/drawn-and-quartered' },
  ];

  const handleMenuToggle = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNewsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNewsAnchorEl(event.currentTarget);
  };

  const handleLifestyleClick = (event: React.MouseEvent<HTMLElement>) => {
    setLifestyleAnchorEl(event.currentTarget);
  };

  const handleArtsClick = (event: React.MouseEvent<HTMLElement>) => {
    setArtsAnchorEl(event.currentTarget);
  };

  const handleNewsClose = () => {
    setNewsAnchorEl(null);
  };

  const handleLifestyleClose = () => {
    setLifestyleAnchorEl(null);
  };

  const handleArtsClose = () => {
    setArtsAnchorEl(null);
  };

  const renderMenuItems = (categories: NavigationDropdownItem[], onClose: () => void) => {
    return categories.map((category, index) => (
      <React.Fragment key={index}>
        <MenuItem 
          onClick={onClose}
          component="a"
          href={category.href}
          sx={{ 
            textDecoration: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>{category.label}</span>
          {category.hasSubmenu && <ChevronRightIcon sx={{ fontSize: '1rem', ml: 1 }} />}
        </MenuItem>
        {category.hasSubmenu && category.submenu && (
          <Box sx={{ pl: 2 }}>
            {category.submenu.map((subitem, subIndex) => (
              <MenuItem 
                key={subIndex}
                onClick={onClose}
                component="a"
                href={subitem.href}
                sx={{ 
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              >
                • {subitem.label}
              </MenuItem>
            ))}
          </Box>
        )}
        {index < categories.length - 1 && category.hasSubmenu && (
          <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', my: 0.5 }} />
        )}
      </React.Fragment>
    ));
  };

  return (
    <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: 50 }} className={className}>
      <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', p: 0 }}>
        <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', color: theme.palette.text.primary }}>
          <Toolbar sx={{ justifyContent: 'space-between', py: 2.5, px: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h1" sx={{ fontSize: '2rem', color: theme.palette.primary.main }}>
                📢
              </Typography>
              <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                  fontWeight: 900, 
                  fontSize: '1.875rem', 
                  letterSpacing: '0.1em', 
                  margin: 0,
                  fontFamily: '"Roboto", sans-serif'
                }}
              >
                <span style={{ color: theme.palette.secondary.main }}>MEGAPHONE</span>
                <span style={{ color: theme.palette.primary.main }}>OZ</span>
              </Typography>
            </Box>
            <IconButton
              onClick={handleMenuToggle}
              aria-label="Toggle menu"
              sx={{ 
                color: theme.palette.primary.main,
                display: { xs: 'none', md: 'flex' }
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        
        <Box 
          component="nav" 
          sx={{ 
            width: '100vw',
            backgroundColor: theme.palette.primary.main,
            position: 'relative',
            marginLeft: 'calc(-50vw + 50%)',
            height: '60px'
          }}
        >
          <Box 
            component="ul" 
            sx={{ 
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0,
              backgroundColor: theme.palette.primary.main,
              width: '100%',
              height: '60px'
            }}
          >
            {navigationItems.map((item, index) => (
              <Box component="li" key={index} sx={{ position: 'relative' }}>
                <Box 
                  component={item.hasDropdown ? "button" : "a"}
                  href={!item.hasDropdown ? item.href : undefined}
                  onClick={item.label === 'News' ? handleNewsClick : item.label === 'Lifestyle' ? handleLifestyleClick : item.label === 'Arts and Entertainment' ? handleArtsClick : undefined}
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    px: 3,
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    letterSpacing: '0.05em',
                    textTransform: 'capitalize',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    height: '60px',
                    transition: 'background-color 0.3s ease',
                    border: item.hasDropdown ? 'none' : undefined,
                    background: item.hasDropdown ? 'transparent' : undefined,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ExpandMoreIcon sx={{ ml: 0.5, fontSize: '1rem' }} />
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* News Dropdown Menu */}
        <Menu
          anchorEl={newsAnchorEl}
          open={Boolean(newsAnchorEl)}
          onClose={handleNewsClose}
          TransitionComponent={Fade}
          MenuListProps={{
            'aria-labelledby': 'news-button',
          }}
          PaperProps={{
            sx: {
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              minWidth: 200,
              '& .MuiMenuItem-root': {
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 500,
                padding: '12px 24px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              },
            },
          }}
        >
          {newsCategories.map((category, index) => (
            <MenuItem 
              key={index} 
              onClick={handleNewsClose}
              component="a"
              href={category.href}
              sx={{ textDecoration: 'none' }}
            >
              {category.label}
            </MenuItem>
          ))}
        </Menu>

        {/* Lifestyle Dropdown Menu */}
        <Menu
          anchorEl={lifestyleAnchorEl}
          open={Boolean(lifestyleAnchorEl)}
          onClose={handleLifestyleClose}
          TransitionComponent={Fade}
          MenuListProps={{
            'aria-labelledby': 'lifestyle-button',
          }}
          PaperProps={{
            sx: {
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              minWidth: 250,
              '& .MuiMenuItem-root': {
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 500,
                padding: '12px 24px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              },
            },
          }}
        >
          {renderMenuItems(lifestyleCategories, handleLifestyleClose)}
        </Menu>

        {/* Arts and Entertainment Dropdown Menu */}
        <Menu
          anchorEl={artsAnchorEl}
          open={Boolean(artsAnchorEl)}
          onClose={handleArtsClose}
          TransitionComponent={Fade}
          MenuListProps={{
            'aria-labelledby': 'arts-button',
          }}
          PaperProps={{
            sx: {
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              minWidth: 250,
              '& .MuiMenuItem-root': {
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 500,
                padding: '12px 24px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              },
            },
          }}
        >
          {renderMenuItems(artsCategories, handleArtsClose)}
        </Menu>
      </Container>
    </Box>
  );
};

export default Header;