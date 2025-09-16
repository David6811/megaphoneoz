import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Typography, Box, Card, CardContent, CardMedia, CircularProgress, Alert } from '@mui/material';
import { supabase } from '../../config/supabase';
import Sidebar from '../Sidebar';

interface Article {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  image?: string;
  created_at: string;
  category: string;
  status: string;
}

interface CategoryPageProps {
  title?: string;
  description?: string;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ title, description }) => {
  const location = useLocation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simple URL to category name mapping (matching database values)
  const URL_TO_CATEGORY: { [key: string]: string } = {
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
    
    const categoryName = URL_TO_CATEGORY[location.pathname];
    return categoryName || 'Category';
  };

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('=== 简化分类查询 ===');
        console.log('当前URL:', location.pathname);
        
        // 直接从映射表获取分类名
        const categoryName = URL_TO_CATEGORY[location.pathname];
        console.log('映射到分类:', categoryName);
        
        if (!categoryName) {
          console.log('❌ 未找到分类映射');
          setArticles([]);
          return;
        }

        console.log('🔍 查询数据库，分类:', categoryName);
        
        // 直接用分类名查询，不需要任何 ID 转换
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('category', categoryName)  // 直接使用分类名
          .eq('status', 'publish')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ 数据库查询错误:', error);
          setArticles([]);
          setError('Failed to load articles. Please try again later.');
        } else {
          console.log('✅ 找到文章:', data?.length || 0, '篇');
          setArticles(data || []);
        }
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
              <Box sx={{ mb: 4 }}>
                {articles.map((article) => (
                  <Card 
                    key={article.id}
                    sx={{ 
                      display: 'flex',
                      mb: 3,
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                      }
                    }}
                    onClick={() => window.location.href = `/article/${article.id}`}
                  >
                    {/* 左侧图片 */}
                    {article.image && (
                      <CardMedia
                        component="img"
                        sx={{ 
                          width: { xs: 120, sm: 160, md: 200 },
                          height: { xs: 90, sm: 120, md: 150 },
                          objectFit: 'cover',
                          flexShrink: 0
                        }}
                        image={article.image}
                        alt={article.title}
                      />
                    )}
                    
                    {/* 右侧内容 */}
                    <CardContent sx={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column',
                      p: { xs: 2, sm: 3 }
                    }}>
                      <Typography variant="h6" component="h2" gutterBottom sx={{ 
                        fontWeight: 600,
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mb: 1
                      }}>
                        {article.title}
                      </Typography>
                      
                      {article.excerpt && (
                        <Typography variant="body2" color="text.secondary" sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: { xs: 2, sm: 3 },
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 2,
                          flexGrow: 1
                        }}>
                          {article.excerpt.replace(/<[^>]*>/g, '')}
                        </Typography>
                      )}
                      
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mt: 'auto'
                      }}>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(article.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                        <Typography variant="caption" color="primary.main" sx={{ fontWeight: 'bold' }}>
                          READ MORE →
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
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