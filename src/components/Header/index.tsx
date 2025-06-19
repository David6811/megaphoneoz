import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, useTheme, Box, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { HeaderProps, NavigationItem, NavigationDropdownItem } from '../../types';

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [newsAnchorEl, setNewsAnchorEl] = useState<null | HTMLElement>(null);
  const [lifestyleAnchorEl, setLifestyleAnchorEl] = useState<null | HTMLElement>(null);
  const [artsAnchorEl, setArtsAnchorEl] = useState<null | HTMLElement>(null);
  const [hoveredSubmenu, setHoveredSubmenu] = useState<string | null>(null);
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

  const handleNewsEnter = (event: React.MouseEvent<HTMLElement>) => {
    setNewsAnchorEl(event.currentTarget);
  };

  const handleLifestyleEnter = (event: React.MouseEvent<HTMLElement>) => {
    setLifestyleAnchorEl(event.currentTarget);
  };

  const handleArtsEnter = (event: React.MouseEvent<HTMLElement>) => {
    setArtsAnchorEl(event.currentTarget);
  };

  const handleNewsLeave = () => {
    setNewsAnchorEl(null);
  };

  const handleLifestyleLeave = () => {
    setLifestyleAnchorEl(null);
  };

  const handleArtsLeave = () => {
    setArtsAnchorEl(null);
  };

  const renderVerticalMenu = (categories: NavigationDropdownItem[]) => {
    return (
      <Box sx={{ 
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        position: 'relative'
      }}>
        {categories.map((category, index) => (
          <Box 
            key={index} 
            sx={{ position: 'relative' }}
            onMouseEnter={() => setHoveredSubmenu(category.hasSubmenu ? category.label : null)}
            onMouseLeave={() => setHoveredSubmenu(null)}
          >
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              px: 3,
              py: 2,
              cursor: 'pointer',
              borderBottom: index < categories.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}>
              <Box component="a" href={category.href} sx={{ 
                color: 'white',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                flex: 1
              }}>
                {category.label}
              </Box>
              {category.hasSubmenu && (
                <ChevronRightIcon sx={{ fontSize: '1rem', ml: 1 }} />
              )}
            </Box>
            
            {/* Secondary submenu appears to the right */}
            {category.hasSubmenu && hoveredSubmenu === category.label && category.submenu && (
              <Box sx={{
                position: 'absolute',
                left: '100%',
                top: 0,
                backgroundColor: theme.palette.primary.main,
                minWidth: 200,
                boxShadow: '2px 0 10px rgba(0,0,0,0.15)',
                zIndex: 1001
              }}>
                {category.submenu.map((subitem, subIndex) => (
                  <Box key={subIndex} component="a" href={subitem.href} sx={{
                    display: 'block',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    py: 1.5,
                    px: 3,
                    borderBottom: subIndex < category.submenu!.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}>
                    {subitem.label}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    );
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
                  component={item.hasDropdown ? "div" : "a"}
                  href={!item.hasDropdown ? item.href : undefined}
                  onMouseEnter={item.label === 'News' ? handleNewsEnter : item.label === 'Lifestyle' ? handleLifestyleEnter : item.label === 'Arts and Entertainment' ? handleArtsEnter : undefined}
                  onMouseLeave={item.label === 'News' ? handleNewsLeave : item.label === 'Lifestyle' ? handleLifestyleLeave : item.label === 'Arts and Entertainment' ? handleArtsLeave : undefined}
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
                
                {/* Individual dropdown positioned under each menu item */}
                {item.label === 'News' && Boolean(newsAnchorEl) && (
                  <Box sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    zIndex: 1000,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    minWidth: 200
                  }}
                  onMouseEnter={() => setNewsAnchorEl(newsAnchorEl)}
                  onMouseLeave={handleNewsLeave}
                  >
                    <Box sx={{ 
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                    }}>
                      {newsCategories.map((category, catIndex) => (
                        <Box key={catIndex} component="a" href={category.href} sx={{
                          display: 'block',
                          color: 'white',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          px: 3,
                          py: 2,
                          borderBottom: catIndex < newsCategories.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                          }
                        }}>
                          {category.label}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {item.label === 'Lifestyle' && Boolean(lifestyleAnchorEl) && (
                  <Box sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    zIndex: 1000,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    minWidth: 200
                  }}
                  onMouseEnter={() => setLifestyleAnchorEl(lifestyleAnchorEl)}
                  onMouseLeave={handleLifestyleLeave}
                  >
                    {renderVerticalMenu(lifestyleCategories)}
                  </Box>
                )}

                {item.label === 'Arts and Entertainment' && Boolean(artsAnchorEl) && (
                  <Box sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    zIndex: 1000,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    minWidth: 200
                  }}
                  onMouseEnter={() => setArtsAnchorEl(artsAnchorEl)}
                  onMouseLeave={handleArtsLeave}
                  >
                    {renderVerticalMenu(artsCategories)}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>

      </Container>
    </Box>
  );
};

export default Header;