import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Container } from '@mui/material';
import NewsServiceManager, { FormattedNewsArticle } from '../../services/newsServiceManager';

interface NewsPageProps {
  category?: string;
}

const NewsPage: React.FC<NewsPageProps> = () => {
  const { category } = useParams<{ category: string }>();
  const [articles, setArticles] = useState<FormattedNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryNews = async () => {
      try {
        const newsService = NewsServiceManager.getInstance();
        let categoryArticles: FormattedNewsArticle[] = [];

        if (category) {
          categoryArticles = await newsService.getLatestNewsByCategory(category, 10);
        } else {
          categoryArticles = await newsService.getLatestNewsForSlider(10);
        }

        setArticles(categoryArticles);
      } catch (error) {
        console.error('Error loading news articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryNews();
  }, [category]);

  const getCategoryTitle = () => {
    if (!category) return 'News';
    return category.charAt(0).toUpperCase() + category.slice(1);
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
        {getCategoryTitle()}
      </Typography>

      {loading ? (
        <Typography>Loading articles...</Typography>
      ) : (
        <Box sx={{ display: 'grid', gap: 3 }}>
          {articles.map((article) => (
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
          ))}
        </Box>
      )}
    </Container>
  );
};

export default NewsPage;