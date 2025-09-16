import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Pagination, 
  TextField,
  InputAdornment,
  Skeleton,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NewsServiceManager, { FormattedNewsArticle } from '../../services/newsServiceManager';
import { Article } from '../../types';
import NewsCard from '../NewsCard';

// Loading skeleton component for horizontal layout
const ArticleSkeleton: React.FC = () => (
  <Box sx={{ display: 'flex', height: 200, border: '1px solid #e0e0e0', borderRadius: 1 }}>
    <Skeleton variant="rectangular" width={300} height={200} />
    <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box>
        <Skeleton variant="text" width={80} height={24} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={40} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
      </Box>
      <Skeleton variant="text" width={140} height={20} />
    </Box>
  </Box>
);

interface SearchResultsProps {
  className?: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ className = '' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const articlesPerPage = 6;

  const query = searchParams.get('q') || '';

  // Transform WordPress news data to component format
  const transformNewsData = (wpArticles: FormattedNewsArticle[]): Article[] => {
    return wpArticles.map(article => ({
      id: article.id,
      title: article.title,
      date: article.date,
      image: article.image,
      excerpt: article.excerpt,
      comments: 0, // WordPress search doesn't provide comment count
      category: article.category || 'News',
      content: article.excerpt, // Use excerpt as content for search results
      author: article.author // Use WordPressAuthor object from API or undefined
    }));
  };

  // Perform search
  const performSearch = async (searchTerm: string, page: number = 1) => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const newsManager = NewsServiceManager.getInstance();
      
      // Add timeout to prevent hanging
      const fetchWithTimeout = async (promise: Promise<any>, timeoutMs: number = 8000) => {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
        );
        return Promise.race([promise, timeoutPromise]);
      };

      console.log(`Searching for: "${searchTerm}"`);
      const searchResults = await fetchWithTimeout(
        newsManager.searchPosts(searchTerm, 18) // Get more results to support pagination
      );

      if (searchResults && searchResults.length > 0) {
        const transformedResults = transformNewsData(searchResults);
        setArticles(transformedResults);
        setTotalResults(transformedResults.length);
        setTotalPages(Math.ceil(transformedResults.length / articlesPerPage));
        console.log(`Found ${transformedResults.length} search results`);
      } else {
        setArticles([]);
        setTotalResults(0);
        setTotalPages(1);
        console.log('No search results found');
      }
    } catch (error) {
      console.error('Search error:', error);
      setArticles([]);
      setTotalResults(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
      setCurrentPage(1);
      performSearch(searchQuery.trim(), 1);
    }
  };

  // Handle page change
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle article click
  const handleArticleClick = (article: Article) => {
    navigate(`/article/${article.id}`, { 
      state: { 
        article: article,
        categoryTitle: 'Search Results'
      } 
    });
  };

  // Initialize search from URL parameter
  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      performSearch(query, 1);
    }
  }, [query]);

  // Calculate articles for current page
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  return (
    <Box className={className} sx={{ py: 4, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        {/* Search Header */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700, 
              color: 'primary.main',
              mb: 2
            }}
          >
            Search Results
          </Typography>
          
          {/* Search Form */}
          <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button 
                      type="submit" 
                      variant="contained" 
                      sx={{ minWidth: 'auto', p: 1 }}
                      disabled={loading}
                    >
                      <SearchIcon />
                    </Button>
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 600 }}
            />
          </Box>

          {/* Search Results Info */}
          {query && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="body1" color="text.secondary">
                Search results for:
              </Typography>
              <Chip label={`"${query}"`} variant="outlined" />
              {!loading && (
                <Typography variant="body2" color="text.secondary">
                  ({totalResults} {totalResults === 1 ? 'result' : 'results'} found)
                </Typography>
              )}
            </Box>
          )}
        </Box>

        {/* Search Results */}
        {loading ? (
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            mb: 4 
          }}>
            {Array.from({ length: 6 }).map((_, index) => (
              <ArticleSkeleton key={`skeleton-${index}`} />
            ))}
          </Box>
        ) : currentArticles.length > 0 ? (
          <>
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              mb: 4 
            }}>
              {currentArticles.map((article) => (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        ) : query ? (
          /* No Results */
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
              textAlign: 'center',
            }}
          >
            <SearchIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No results found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              No articles found for "{query}". Try different keywords or check your spelling.
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => {
                setSearchQuery('');
                setSearchParams({});
              }}
            >
              Clear search
            </Button>
          </Box>
        ) : (
          /* Initial State */
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
              textAlign: 'center',
            }}
          >
            <SearchIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Search MegaphoneOZ
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Enter keywords to search for articles, news, and stories.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default SearchResults;