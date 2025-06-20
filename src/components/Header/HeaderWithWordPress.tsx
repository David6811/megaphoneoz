import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, useTheme, Box, Container, Drawer, List, ListItem, ListItemText, useMediaQuery, Collapse } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { HeaderProps, NavigationItem, NavigationDropdownItem } from '../../types';
import WordPressMenuService from '../../services/wordpressMenuService';

const HeaderWithWordPress: React.FC<HeaderProps> = ({ className = '' }) => {
  const [newsAnchorEl, setNewsAnchorEl] = useState<null | HTMLElement>(null);
  const [lifestyleAnchorEl, setLifestyleAnchorEl] = useState<null | HTMLElement>(null);
  const [artsAnchorEl, setArtsAnchorEl] = useState<null | HTMLElement>(null);
  const [hoveredSubmenu, setHoveredSubmenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});
  const [menuData, setMenuData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Fallback data (current hardcoded menu) in case WordPress fails
  const fallbackNavigationItems: NavigationItem[] = [
    { label: 'Home', href: '/' },
    { label: 'News', href: '#', hasDropdown: true },
    { label: 'Lifestyle', href: '#', hasDropdown: true },
    { label: 'Arts and Entertainment', href: '#', hasDropdown: true },
    { label: 'Opinion', href: '/opinion' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'About Us', href: '/about' },
    { label: 'Coming Up', href: '/coming-up' },
  ];

  const fallbackNewsCategories = [
    { label: 'Local', href: '/news/local' },
    { label: 'National', href: '/news/national' },
    { label: 'World', href: '/news/world' },
    { label: 'Features', href: '/news/features' },
    { label: 'Environment', href: '/news/environment' },
    { label: 'Media', href: '/news/media' },
  ];

  const fallbackLifestyleCategories = [
    { label: 'Food and Wine', href: '/lifestyle/food-wine', hasSubmenu: true, submenu: [
      { label: 'Restaurant Reviews', href: '/lifestyle/food-wine/restaurant-reviews' },
      { label: 'Wine Match', href: '/lifestyle/food-wine/wine-match' },
    ]},
    { label: 'Sport', href: '/lifestyle/sport' },
    { label: 'Travel', href: '/lifestyle/travel' },
  ];

  const fallbackArtsCategories = [
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

  // Fetch WordPress menu data on component mount
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const menuService = new WordPressMenuService();
        const data = await menuService.getFormattedMenuData();
        
        if (data) {
          setMenuData(data);
          console.log('Successfully loaded WordPress menu data:', data);
        } else {
          console.warn('Failed to load WordPress menu data, using fallback');
          setMenuData({
            navigationItems: fallbackNavigationItems,
            newsCategories: fallbackNewsCategories,
            lifestyleCategories: fallbackLifestyleCategories,
            artsCategories: fallbackArtsCategories
          });
        }
      } catch (error) {
        console.error('Error loading WordPress menu:', error);
        // Use fallback data
        setMenuData({
          navigationItems: fallbackNavigationItems,
          newsCategories: fallbackNewsCategories,
          lifestyleCategories: fallbackLifestyleCategories,
          artsCategories: fallbackArtsCategories
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  // Use WordPress data if available, otherwise fallback
  const navigationItems: NavigationItem[] = menuData?.navigationItems || fallbackNavigationItems;
  const newsCategories: NavigationDropdownItem[] = menuData?.newsCategories || fallbackNewsCategories;
  const lifestyleCategories: NavigationDropdownItem[] = menuData?.lifestyleCategories || fallbackLifestyleCategories;
  const artsCategories: NavigationDropdownItem[] = menuData?.artsCategories || fallbackArtsCategories;

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setExpandedMenus({});
  };

  const toggleSubmenu = (menuLabel: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuLabel]: !prev[menuLabel]
    }));
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

  // Show loading state
  if (loading) {
    return (
      <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: 50 }} className={className}>
        <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', color: theme.palette.text.primary, height: 180 }}>
          <Container maxWidth="xl" sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography>Loading menu...</Typography>
          </Container>
        </AppBar>
      </Box>
    );
  }

  return (
    <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: 50 }} className={className}>
      <Box sx={{ display: 'flex', flexDirection: 'column', p: 0 }}>
        <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', color: theme.palette.text.primary, height: 180, width: '100%' }}>
          <Container maxWidth="xl" sx={{ height: '100%', display: 'flex', p: 0 }}>
            <Toolbar sx={{ 
              justifyContent: 'space-between', 
              py: 4, 
              px: 2.5,
              height: 180,
              alignItems: 'center',
              flexDirection: 'row',
              gap: 0,
              width: '100%'
            }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              width: isMobile ? '100%' : 'auto',
              justifyContent: isMobile ? 'space-between' : 'flex-start'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  component="img"
                  src="/cropped-Megaphone-OZ-Logo-02-2.jpg"
                  alt="MegaphoneOZ Logo"
                  sx={{
                    height: isMobile ? '60px' : '80px',
                    width: 'auto',
                    objectFit: 'contain'
                  }}
                />
                <Typography 
                  variant="h1" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 900, 
                    fontSize: '2.5rem', 
                    letterSpacing: '0.1em', 
                    margin: 0,
                    fontFamily: '"Roboto", sans-serif'
                  }}
                >
                  <span style={{ color: theme.palette.secondary.main }}>MEGAPHONE</span>
                  <span style={{ color: theme.palette.primary.main }}>OZ</span>
                </Typography>
              </Box>
              {isMobile && (
                <IconButton
                  onClick={toggleMobileMenu}
                  aria-label="Toggle menu"
                  sx={{ 
                    color: theme.palette.primary.main,
                    fontSize: '2rem'
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
            </Toolbar>
          </Container>
        </AppBar>
        
        {!isMobile && (
          <Box 
            component="nav" 
            sx={{ 
              width: '100%',
              backgroundColor: theme.palette.primary.main,
              height: '60px'
            }}
          >
          <Container maxWidth="xl" sx={{ height: '100%', display: 'flex', p: 0 }}>
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
          </Container>
        </Box>
        )}

        {/* Mobile Drawer Menu */}
        <Drawer
          anchor="left"
          open={mobileMenuOpen}
          onClose={closeMobileMenu}
          sx={{
            '& .MuiDrawer-paper': {
              width: 280,
              backgroundColor: 'white',
              pt: 2
            }
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            px: 2, 
            pb: 2,
            borderBottom: '1px solid #eee'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
              Menu
            </Typography>
            <IconButton onClick={closeMobileMenu}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {navigationItems.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem 
                  component={item.hasDropdown ? "div" : "a"}
                  href={!item.hasDropdown ? item.href : undefined}
                  onClick={item.hasDropdown ? () => toggleSubmenu(item.label) : closeMobileMenu}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'rgba(198, 8, 0, 0.05)' }
                  }}
                >
                  <ListItemText 
                    primary={item.label}
                    sx={{ 
                      '& .MuiTypography-root': { 
                        fontWeight: 600,
                        color: theme.palette.text.primary
                      }
                    }}
                  />
                  {item.hasDropdown && (
                    expandedMenus[item.label] ? 
                      <ExpandLessIcon sx={{ color: theme.palette.primary.main }} /> :
                      <ExpandMoreIcon sx={{ color: theme.palette.primary.main }} />
                  )}
                </ListItem>
                
                {/* Mobile Submenus with Collapse */}
                {item.hasDropdown && (
                  <Collapse in={expandedMenus[item.label]} timeout="auto" unmountOnExit>
                    <Box sx={{ pl: 2, backgroundColor: '#f5f5f5' }}>
                      {item.label === 'News' && newsCategories.map((category, catIndex) => (
                        <ListItem 
                          key={catIndex}
                          component="a" 
                          href={category.href}
                          onClick={closeMobileMenu}
                          sx={{ py: 1 }}
                        >
                          <ListItemText 
                            primary={category.label}
                            sx={{ 
                              '& .MuiTypography-root': { 
                                fontSize: '0.9rem',
                                color: theme.palette.text.secondary
                              }
                            }}
                          />
                        </ListItem>
                      ))}
                      
                      {item.label === 'Lifestyle' && lifestyleCategories.map((category, catIndex) => (
                        <Box key={catIndex}>
                          <ListItem 
                            component={category.hasSubmenu ? "div" : "a"}
                            href={!category.hasSubmenu ? category.href : undefined}
                            onClick={category.hasSubmenu ? () => toggleSubmenu(`${item.label}-${category.label}`) : closeMobileMenu}
                            sx={{ py: 1, cursor: 'pointer' }}
                          >
                            <ListItemText 
                              primary={category.label}
                              sx={{ 
                                '& .MuiTypography-root': { 
                                  fontSize: '0.9rem',
                                  color: theme.palette.text.secondary
                                }
                              }}
                            />
                            {category.hasSubmenu && (
                              expandedMenus[`${item.label}-${category.label}`] ?
                                <ExpandLessIcon sx={{ fontSize: '1rem', color: theme.palette.primary.main }} /> :
                                <ExpandMoreIcon sx={{ fontSize: '1rem', color: theme.palette.primary.main }} />
                            )}
                          </ListItem>
                          {category.hasSubmenu && category.submenu && (
                            <Collapse in={expandedMenus[`${item.label}-${category.label}`]} timeout="auto" unmountOnExit>
                              <Box sx={{ pl: 2, backgroundColor: '#eeeeee' }}>
                                {category.submenu.map((subitem, subIndex) => (
                                  <ListItem 
                                    key={subIndex}
                                    component="a" 
                                    href={subitem.href}
                                    onClick={closeMobileMenu}
                                    sx={{ py: 0.5, pl: 4 }}
                                  >
                                    <ListItemText 
                                      primary={subitem.label}
                                      sx={{ 
                                        '& .MuiTypography-root': { 
                                          fontSize: '0.8rem',
                                          color: theme.palette.text.disabled
                                        }
                                      }}
                                    />
                                  </ListItem>
                                ))}
                              </Box>
                            </Collapse>
                          )}
                        </Box>
                      ))}
                      
                      {item.label === 'Arts and Entertainment' && artsCategories.map((category, catIndex) => (
                        <Box key={catIndex}>
                          <ListItem 
                            component={category.hasSubmenu ? "div" : "a"}
                            href={!category.hasSubmenu ? category.href : undefined}
                            onClick={category.hasSubmenu ? () => toggleSubmenu(`${item.label}-${category.label}`) : closeMobileMenu}
                            sx={{ py: 1, cursor: 'pointer' }}
                          >
                            <ListItemText 
                              primary={category.label}
                              sx={{ 
                                '& .MuiTypography-root': { 
                                  fontSize: '0.9rem',
                                  color: theme.palette.text.secondary
                                }
                              }}
                            />
                            {category.hasSubmenu && (
                              expandedMenus[`${item.label}-${category.label}`] ?
                                <ExpandLessIcon sx={{ fontSize: '1rem', color: theme.palette.primary.main }} /> :
                                <ExpandMoreIcon sx={{ fontSize: '1rem', color: theme.palette.primary.main }} />
                            )}
                          </ListItem>
                          {category.hasSubmenu && category.submenu && (
                            <Collapse in={expandedMenus[`${item.label}-${category.label}`]} timeout="auto" unmountOnExit>
                              <Box sx={{ pl: 2, backgroundColor: '#eeeeee' }}>
                                {category.submenu.map((subitem, subIndex) => (
                                  <ListItem 
                                    key={subIndex}
                                    component="a" 
                                    href={subitem.href}
                                    onClick={closeMobileMenu}
                                    sx={{ py: 0.5, pl: 4 }}
                                  >
                                    <ListItemText 
                                      primary={subitem.label}
                                      sx={{ 
                                        '& .MuiTypography-root': { 
                                          fontSize: '0.8rem',
                                          color: theme.palette.text.disabled
                                        }
                                      }}
                                    />
                                  </ListItem>
                                ))}
                              </Box>
                            </Collapse>
                          )}
                        </Box>
                      ))}
                    </Box>
                  </Collapse>
                )}
              </React.Fragment>
            ))}
          </List>
        </Drawer>

      </Box>
    </Box>
  );
};

export default HeaderWithWordPress;