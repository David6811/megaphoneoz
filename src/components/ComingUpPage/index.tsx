import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const ComingUpPage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" sx={{ 
        mb: 4, 
        fontSize: '2.5rem', 
        fontWeight: 700,
        textTransform: 'uppercase',
        color: '#c60800'
      }}>
        Coming Up
      </Typography>

      <Box sx={{ 
        p: 4, 
        border: '1px solid #eee',
        borderRadius: 2,
        textAlign: 'center'
      }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Upcoming Events & Features
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Stay tuned for upcoming events, features, and special coverage from MegaphoneOZ.
          This page will be updated with the latest information about what's coming next.
        </Typography>
      </Box>
    </Container>
  );
};

export default ComingUpPage;