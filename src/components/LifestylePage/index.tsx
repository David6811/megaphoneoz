import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Container } from '@mui/material';
import NewsServiceManager, { FormattedNewsArticle } from '../../services/newsServiceManager';

const LifestylePage: React.FC = () => {
  const { category, subcategory } = useParams<{ category: string; subcategory?: string }>();
  const [articles, setArticles] = useState<FormattedNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLifestyleContent = async () => {
      try {
        const newsService = NewsServiceManager.getInstance();
        let categoryArticles: FormattedNewsArticle[] = [];

        // Try to get articles for specific lifestyle category
        const searchCategory = subcategory || category || 'lifestyle';
        categoryArticles = await newsService.getLatestNewsByCategory(searchCategory, 10);

        setArticles(categoryArticles);
      } catch (error) {
        console.error('Error loading lifestyle articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLifestyleContent();
  }, [category, subcategory]);

  const getPageTitle = () => {
    if (subcategory) {
      return subcategory.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
    if (category) {
      return category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
    return 'Lifestyle';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" sx={{ 
        mb: 4, 
        fontSize: '2.5rem', 
        fontWeight: 700,
        textTransform: 'uppercase',
        color: '#c60800'
      }}>
        {getPageTitle()}
      </Typography>

      {loading ? (
        <Typography>Loading lifestyle content...</Typography>
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
                  {article.date} • {article.category}
                </Typography>
                <Typography variant="body1">
                  {article.excerpt}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body1" color="text.secondary">
              No articles found for this category. Content will be loaded from WordPress when available.
            </Typography>
          )}
        </Box>
      )}
    </Container>
  );
};

export default LifestylePage;