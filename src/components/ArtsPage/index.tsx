import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Container } from '@mui/material';
import NewsServiceManager, { FormattedNewsArticle } from '../../services/newsServiceManager';
import NewsCard from '../NewsCard';

const ArtsPage: React.FC = () => {
  const { category, subcategory } = useParams<{ category: string; subcategory?: string }>();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<FormattedNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtsContent = async () => {
      try {
        const newsService = NewsServiceManager.getInstance();
        let categoryArticles: FormattedNewsArticle[] = [];

        // Try to get articles for arts and entertainment
        const searchCategory = subcategory || category || 'arts-entertainment';
        categoryArticles = await newsService.getLatestNewsByCategory(searchCategory, 10);

        setArticles(categoryArticles);
      } catch (error) {
        console.error('Error loading arts articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtsContent();
  }, [category, subcategory]);

  const getPageTitle = () => {
    if (subcategory) {
      return subcategory.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
    if (category) {
      return category.charAt(0).toUpperCase() + category.slice(1);
    }
    return 'Arts and Entertainment';
  };

  const handleArticleClick = (article: FormattedNewsArticle) => {
    navigate(`/article/${article.id}`, { 
      state: { 
        article: article,
        categoryTitle: article.category || 'ARTS'
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
        {getPageTitle()}
      </Typography>

      {loading ? (
        <Typography>Loading arts content...</Typography>
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
                category={article.category}
                date={article.date}
                comments={article.commentCount || 0}
                onClick={() => handleArticleClick(article)}
              />
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

export default ArtsPage;