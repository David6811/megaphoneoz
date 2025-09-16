import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import NewsServiceManager, { FormattedNewsArticle } from '../../services/newsServiceManager';
import Sidebar from '../Sidebar';
import NewsCard from '../NewsCard';

interface CategoryPageProps {
  title?: string;
  description?: string;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ title, description }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<FormattedNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map URL paths to search categories for NewsServiceManager
  const URL_TO_SEARCH_CATEGORY: { [key: string]: string } = {
    '/category/news/localnews/': 'local',
    '/category/news/nationalnews/': 'national', 
    '/category/news/world/': 'world',
    '/category/news/worldnews/': 'world',
    '/category/news/features/': 'features',
    '/category/news/featurednews/': 'features',
    '/category/news/environment/': 'environment',
    '/category/news/environmentnews/': 'environment',
    '/category/news/media/': 'media',
    '/category/news/medianews/': 'media',
    '/news/local': 'local',
    '/news/national': 'national',
    '/news/world': 'world',
    '/news/features': 'features',
    '/news/environment': 'environment',
    '/news/media': 'media',
    '/category/artsentertainment/theatre/theatrereviews/': 'reviews',
    '/category/artsentertainment/theatre/': 'theatre',
    '/category/artsentertainment/games/': 'games',
    '/category/artsentertainment/games-artsentertainment/': 'games',
    '/category/artsentertainment/film/': 'film',
    '/category/artsentertainment/filmreviews/': 'film',
    '/category/artsentertainment/music/': 'music',
    '/category/artsentertainment/musicreviews/': 'music',
    '/category/artsentertainment/galleries/': 'galleries',
    '/category/artsentertainment/galleries/exhibitions/': 'exhibitions',
    '/category/artsentertainment/galleries/eye-on-the-street/': 'eye-on-the-street',
    '/category/artsentertainment/galleries/eyeonthestreet/': 'eye-on-the-street',
    '/category/artsentertainment/books/': 'books',
    '/category/artsentertainment/drawn-and-quartered/': 'drawn-and-quartered',
    '/category/lifestyle/food-and-wine/': 'food-and-wine',
    '/category/lifestyle/foodandwine/': 'food-and-wine',
    '/category/lifestyle/foodwine/': 'food-and-wine',
    '/category/lifestyle/food-and-wine/restaurant-reviews/': 'restaurant-reviews',
    '/category/lifestyle/foodandwine/restaurant-reviews/': 'restaurant-reviews',
    '/category/lifestyle/foodwine/restaurant-reviews/': 'restaurant-reviews',
    '/category/lifestyle/foodandwine/restaurantreviews/': 'restaurant-reviews',
    '/category/lifestyle/foodwine/restaurantreviews/': 'restaurant-reviews',
    '/category/lifestyle/food-and-wine/wine-match/': 'wine-match',
    '/category/lifestyle/foodandwine/wine-match/': 'wine-match',
    '/category/lifestyle/foodwine/wine-match/': 'wine-match',
    '/category/lifestyle/foodandwine/winematch/': 'wine-match',
    '/category/lifestyle/foodwine/winematch/': 'wine-match',
    '/category/lifestyle/sport/': 'sport',
    '/category/lifestyle/sports/': 'sport',
    '/category/lifestyle/travel/': 'travel',
    '/category/lifestyle/travels/': 'travel',
    '/category/opinion/': 'opinion',
    '/category/media/': 'media',
    '/arts/games': 'games',
    '/arts/theatre': 'theatre',
    '/arts/theatre/reviews': 'reviews',
    '/arts/film': 'film',
    '/arts/music': 'music',
    '/arts/galleries': 'galleries',
    '/arts/galleries/exhibitions': 'exhibitions',
    '/arts/galleries/eye-on-the-street': 'eye-on-the-street',
    '/arts/books': 'books',
    '/arts/drawn-and-quartered': 'drawn-and-quartered',
    '/lifestyle/food-and-wine': 'food-and-wine',
    '/lifestyle/food-and-wine/restaurant-reviews': 'restaurant-reviews',
    '/lifestyle/food-and-wine/wine-match': 'wine-match',
    '/lifestyle/sport': 'sport',
    '/lifestyle/travel': 'travel',
    '/opinion': 'opinion',
    '/localnews': 'local',
    '/drawn-and-quartered': 'drawn-and-quartered',
    '/drawn-and-quartered/': 'drawn-and-quartered'
  };

  // Display title mapping
  const URL_TO_DISPLAY_TITLE: { [key: string]: string } = {
    '/category/news/localnews/': 'News > Local',
    '/category/news/nationalnews/': 'News > National', 
    '/category/news/world/': 'News > World',
    '/category/news/worldnews/': 'News > World',
    '/category/news/features/': 'News > Features',
    '/category/news/featurednews/': 'News > Features',
    '/category/news/environment/': 'News > Environment',
    '/category/news/environmentnews/': 'News > Environment',
    '/category/news/media/': 'News > Media',
    '/category/news/medianews/': 'News > Media',
    '/news/local': 'News > Local',
    '/news/national': 'News > National',
    '/news/world': 'News > World',
    '/news/features': 'News > Features',
    '/news/environment': 'News > Environment',
    '/news/media': 'News > Media',
    '/category/artsentertainment/theatre/theatrereviews/': 'Arts and Entertainment > Theatre > Reviews',
    '/category/artsentertainment/theatre/': 'Arts and Entertainment > Theatre',
    '/category/artsentertainment/games/': 'Arts and Entertainment > Games',
    '/category/artsentertainment/games-artsentertainment/': 'Arts and Entertainment > Games',
    '/category/artsentertainment/film/': 'Arts and Entertainment > Film',
    '/category/artsentertainment/filmreviews/': 'Arts and Entertainment > Film',
    '/category/artsentertainment/music/': 'Arts and Entertainment > Music',
    '/category/artsentertainment/musicreviews/': 'Arts and Entertainment > Music',
    '/category/artsentertainment/galleries/': 'Arts and Entertainment > Galleries',
    '/category/artsentertainment/galleries/exhibitions/': 'Arts and Entertainment > Galleries > Exhibitions',
    '/category/artsentertainment/galleries/eye-on-the-street/': 'Arts and Entertainment > Galleries > Eye On The Street',
    '/category/artsentertainment/galleries/eyeonthestreet/': 'Arts and Entertainment > Galleries > Eye On The Street',
    '/category/artsentertainment/books/': 'Arts and Entertainment > Books',
    '/category/artsentertainment/drawn-and-quartered/': 'Arts and Entertainment > Drawn and Quartered',
    '/category/lifestyle/food-and-wine/': 'Lifestyle > Food and Wine',
    '/category/lifestyle/foodandwine/': 'Lifestyle > Food and Wine',
    '/category/lifestyle/foodwine/': 'Lifestyle > Food and Wine',
    '/category/lifestyle/food-and-wine/restaurant-reviews/': 'Lifestyle > Food and Wine > Restaurant Reviews',
    '/category/lifestyle/foodandwine/restaurant-reviews/': 'Lifestyle > Food and Wine > Restaurant Reviews',
    '/category/lifestyle/foodwine/restaurant-reviews/': 'Lifestyle > Food and Wine > Restaurant Reviews',
    '/category/lifestyle/foodandwine/restaurantreviews/': 'Lifestyle > Food and Wine > Restaurant Reviews',
    '/category/lifestyle/foodwine/restaurantreviews/': 'Lifestyle > Food and Wine > Restaurant Reviews',
    '/category/lifestyle/food-and-wine/wine-match/': 'Lifestyle > Food and Wine > Wine Match',
    '/category/lifestyle/foodandwine/wine-match/': 'Lifestyle > Food and Wine > Wine Match',
    '/category/lifestyle/foodwine/wine-match/': 'Lifestyle > Food and Wine > Wine Match',
    '/category/lifestyle/foodandwine/winematch/': 'Lifestyle > Food and Wine > Wine Match',
    '/category/lifestyle/foodwine/winematch/': 'Lifestyle > Food and Wine > Wine Match',
    '/category/lifestyle/sport/': 'Lifestyle > Sport',
    '/category/lifestyle/sports/': 'Lifestyle > Sport',
    '/category/lifestyle/travel/': 'Lifestyle > Travel',
    '/category/lifestyle/travels/': 'Lifestyle > Travel',
    '/category/opinion/': 'Opinion',
    '/category/media/': 'News > Media',
    '/arts/games': 'Arts and Entertainment > Games',
    '/arts/theatre': 'Arts and Entertainment > Theatre',
    '/arts/theatre/reviews': 'Arts and Entertainment > Theatre > Reviews',
    '/arts/film': 'Arts and Entertainment > Film',
    '/arts/music': 'Arts and Entertainment > Music',
    '/arts/galleries': 'Arts and Entertainment > Galleries',
    '/arts/galleries/exhibitions': 'Arts and Entertainment > Galleries > Exhibitions',
    '/arts/galleries/eye-on-the-street': 'Arts and Entertainment > Galleries > Eye On The Street',
    '/arts/books': 'Arts and Entertainment > Books',
    '/arts/drawn-and-quartered': 'Arts and Entertainment > Drawn and Quartered',
    '/lifestyle/food-and-wine': 'Lifestyle > Food and Wine',
    '/lifestyle/food-and-wine/restaurant-reviews': 'Lifestyle > Food and Wine > Restaurant Reviews',
    '/lifestyle/food-and-wine/wine-match': 'Lifestyle > Food and Wine > Wine Match',
    '/lifestyle/sport': 'Lifestyle > Sport',
    '/lifestyle/travel': 'Lifestyle > Travel',
    '/opinion': 'Opinion',
    '/localnews': 'News > Local',
    '/drawn-and-quartered': 'Arts and Entertainment > Drawn and Quartered',
    '/drawn-and-quartered/': 'Arts and Entertainment > Drawn and Quartered'
  };

  // Get display title from URL mapping
  const getDisplayTitle = (): string => {
    if (title) return title;
    
    const displayTitle = URL_TO_DISPLAY_TITLE[location.pathname];
    return displayTitle || 'Category';
  };

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('=== 简化分类查询 ===');
        console.log('当前URL:', location.pathname);
        
        // 从映射表获取搜索分类
        const searchCategory = URL_TO_SEARCH_CATEGORY[location.pathname];
        console.log('映射到搜索分类:', searchCategory);
        
        if (!searchCategory) {
          console.log('❌ 未找到分类映射');
          setArticles([]);
          return;
        }

        console.log('🔍 使用 NewsServiceManager 查询分类:', searchCategory);
        
        // 使用 NewsServiceManager，就像搜索结果页面一样
        const newsManager = NewsServiceManager.getInstance();
        const categoryArticles = await newsManager.getLatestNewsByCategory(searchCategory, 10);

        console.log('✅ 找到文章:', categoryArticles?.length || 0, '篇');
        if (categoryArticles && categoryArticles.length > 0) {
          console.log('📸 检查图片URL:', categoryArticles.map(article => ({
            id: article.id,
            title: article.title,
            image: article.image
          })));
        }
        setArticles(categoryArticles || []);
      } catch (err) {
        console.error('❌ 查询异常:', err);
        setError('Failed to load articles. Please try again later.');
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [location.pathname]);

  const displayTitle = getDisplayTitle();

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={48} />
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Main Content */}
          <Box sx={{ flex: { md: '2 1 0%' } }}>
            {/* Page Header */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontWeight: 700, 
                  color: 'primary.main',
                  mb: 2,
                  borderBottom: 3,
                  borderColor: 'primary.main',
                  display: 'inline-block',
                  pb: 1
                }}
              >
                {displayTitle}
              </Typography>
              {description && (
                <Typography variant="body1" color="text.secondary">
                  {description}
                </Typography>
              )}
            </Box>

            {/* Error State */}
            {error && (
              <Alert severity="error" sx={{ mb: 4 }}>
                {error}
              </Alert>
            )}

            {/* Articles List */}
            {articles.length === 0 ? (
              <Box textAlign="center" sx={{ py: 8 }}>
                <Typography variant="h5" gutterBottom color="text.secondary">
                  No articles found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  There are currently no articles in this category. Please check back later.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                {articles.map((article) => (
                  <NewsCard
                    key={article.id}
                    id={article.id}
                    title={article.title}
                    excerpt={article.excerpt}
                    image={article.image}
                    date={article.date}
                    comments={0}
                    onClick={() => navigate(`/article/${article.id}`)}
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* Sidebar */}
          <Box sx={{ flex: { md: '1 1 0%' } }}>
            <Sidebar />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CategoryPage;