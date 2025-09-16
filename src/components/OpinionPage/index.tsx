import React, { useState, useEffect } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NewsServiceManager, { FormattedNewsArticle } from '../../services/newsServiceManager';
import NewsCard from '../NewsCard';

const OpinionPage: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<FormattedNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpinionContent = async () => {
      try {
        const newsService = NewsServiceManager.getInstance();
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

  const handleArticleClick = (article: FormattedNewsArticle) => {
    navigate(`/article/${article.id}`, { 
      state: { 
        article: article,
        categoryTitle: article.category || 'OPINION'
      } 
    });
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
        Opinion
      </Typography>

      {loading ? (
        <Typography>Loading opinion pieces...</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {articles.length > 0 ? (
            articles.map((article) => (
              <NewsCard
                key={article.id}
                id={article.id}
                title={article.title}
                excerpt={article.excerpt}
                image={article.image}
                date={article.date}
                comments={article.commentCount || 0}
                onClick={() => handleArticleClick(article)}
              />
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