import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, useTheme, Box, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { HeaderProps, NavigationItem } from '../types';

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const theme = useTheme();

  const navigationItems: NavigationItem[] = [
    { label: 'Home', href: '/' },
    { label: 'News', href: '#' },
    { label: 'Lifestyle', href: '#' },
    { label: 'Arts and Entertainment', href: '#' },
    { label: 'Opinion', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'About Us', href: '#' },
    { label: 'Coming Up', href: '#' },
  ];

  const handleMenuToggle = (): void => {
    setIsMenuOpen(!isMenuOpen);
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
                  component="a"
                  href={item.href} 
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
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  {item.label}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Header;