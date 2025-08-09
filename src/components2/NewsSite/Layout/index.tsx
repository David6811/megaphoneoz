import React from 'react';
import { Box } from '@mui/material';
import NewsHeader from '../Header';
import NewsFooter from '../Footer';

interface NewsLayoutProps {
  children: React.ReactNode;
  recentNews?: string[];
}

const NewsLayout: React.FC<NewsLayoutProps> = ({ children, recentNews }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NewsHeader recentNews={recentNews} />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <NewsFooter />
    </Box>
  );
};

export default NewsLayout;