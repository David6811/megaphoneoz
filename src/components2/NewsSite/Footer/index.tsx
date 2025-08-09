import React from 'react';
import {
  Box,
  Container,
  Typography
} from '@mui/material';

const NewsFooter: React.FC = () => {
  return (
    <Box component="footer" sx={{ bgcolor: '#1a1a1a', color: 'white', py: 3, mt: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="grey.400">
            Megaphone Oz Copyright © 2025.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default NewsFooter;