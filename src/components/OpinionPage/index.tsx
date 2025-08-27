import React, { useState, useEffect } from 'react';
import { Box, Typography, Container } from '@mui/material';
import WordPressNewsService, { FormattedNewsArticle } from '../../services/wordpressNewsService';

const OpinionPage: React.FC = () => {
  const [articles, setArticles] = useState<FormattedNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpinionContent = async () => {
      try {
        const newsService = WordPressNewsService.getInstance();
        const opinionArticles = await newsService.getLatestNewsByCategory('opinion', 10);
        setArticles(opinionArticles);
      } catch (error) {
        console.error('Error loading opinion articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpinionContent();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" sx={{ 
        mb: 4, 
        fontSize: '2.5rem', 
        fontWeight: 700,
        textTransform: 'uppercase',
        color: '#c60800'
      }}>
        Opinion
      </Typography>

      {loading ? (
        <Typography>Loading opinion pieces...</Typography>
      ) : (
        <Box sx={{ display: 'grid', gap: 3 }}>
          {articles.length > 0 ? (
            articles.map((article) => (
              <Box key={article.id} sx={{ 
                p: 3, 
                border: '1px solid #eee',
                borderRadius: 2,
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}>
                <Typography variant="h4" component="h2" sx={{ 
                  mb: 2, 
                  fontWeight: 600,
                  fontSize: '1.5rem'
                }}>
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {article.date} • Opinion
                </Typography>
                <Typography variant="body1">
                  {article.excerpt}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body1" color="text.secondary">
              No opinion articles found. Content will be loaded from WordPress when available.
            </Typography>
          )}
        </Box>
      )}
    </Container>
  );
};

export default OpinionPage;