import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Container } from '@mui/material';
import NewsServiceManager, { FormattedNewsArticle } from '../../services/newsServiceManager';
import NewsCard from '../NewsCard';

interface NewsPageProps {
  category?: string;
}

const NewsPage: React.FC<NewsPageProps> = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
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
    const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
    return `News > ${formattedCategory}`;
  };

  const handleArticleClick = (article: FormattedNewsArticle) => {
    navigate(`/article/${article.id}`, { 
      state: { 
        article: article,
        categoryTitle: article.category || 'NEWS'
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
        {getCategoryTitle()}
      </Typography>

      {loading ? (
        <Typography>Loading articles...</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {articles.map((article) => (
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
          ))}
        </Box>
      )}
    </Container>
  );
};

export default NewsPage;