import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Avatar, 
  Chip, 
  Divider,
  IconButton,
  TextField,
  Skeleton,
  CardMedia,
  Alert,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WordPressNewsService, { FormattedNewsArticle, FormattedComment } from '../../services/wordpressNewsService';
import { Comment } from '../../types';

const ArticleContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const ArticleHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

// FeaturedImage component removed - WordPress content includes images in correct positions

const ArticleContent = styled(Box)(({ theme }) => ({
  fontFamily: '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: '15px', // Match original WordPress
  lineHeight: 1.6,
  color: '#444444', // Match original WordPress
  textAlign: 'left', // Professional left alignment, not justify
  marginBottom: theme.spacing(4),
  
  '& p': {
    marginBottom: '16px',
    lineHeight: 1.6,
    fontSize: '15px',
    color: '#444444',
    fontWeight: 400,
  },
  
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    fontFamily: '"Roboto", sans-serif',
    fontWeight: 700,
    color: '#444444',
    marginTop: '24px',
    marginBottom: '12px',
    lineHeight: 1.3,
  },
  
  '& h1': { fontSize: '30px' },
  '& h2': { fontSize: '26px' },
  '& h3': { fontSize: '22px' },
  '& h4': { fontSize: '18px' },
  '& h5': { fontSize: '16px' },
  '& h6': { fontSize: '13px' },
  
  '& blockquote': {
    borderLeft: '4px solid #c60800',
    paddingLeft: theme.spacing(3),
    marginLeft: 0,
    marginRight: 0,
    marginTop: '24px',
    marginBottom: '24px',
    fontStyle: 'italic',
    fontSize: '16px',
    color: '#666666',
    backgroundColor: '#f9f9f9',
    padding: '20px 24px',
    borderRadius: '0 4px 4px 0',
  },
  
  '& a': {
    color: '#c60800',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  
  '& strong, & b': {
    fontWeight: 700,
    color: '#333333',
  },
  
  '& em, & i': {
    fontStyle: 'italic',
  },
  // WordPress image alignment styles - Smart layout based on image size
  '& .wp-caption': {
    maxWidth: '100% !important',
    height: 'auto',
    marginBottom: '20px',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    
    // Smart layout: Wide images get full width, narrow images float right
    '&[style*="width: 1024px"], &[style*="width: 1034px"]': {
      // Large images get full width
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      textAlign: 'center',
      marginBottom: '30px',
      marginTop: '20px',
      maxWidth: '90%',
      float: 'none !important',
      clear: 'both',
    },
    
    // Default behavior for smaller images - float right
    '&.alignnone, &:not(.aligncenter):not(.alignleft):not(.alignright)': {
      float: 'right',
      marginLeft: theme.spacing(3),
      marginBottom: theme.spacing(2),
      maxWidth: '45%',
      clear: 'right',
      
      // But if image is too wide, make it full width
      '@media (max-width: 1200px)': {
        float: 'none',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: '90%',
        textAlign: 'center',
      },
    },
    
    '&.alignright': {
      float: 'right',
      marginLeft: theme.spacing(3),
      marginBottom: theme.spacing(2),
      maxWidth: '45%',
      clear: 'right',
    },
    
    '&.alignleft': {
      float: 'left',
      marginRight: theme.spacing(3),
      marginBottom: theme.spacing(2),
      maxWidth: '45%',
      clear: 'left',
    },
    
    '&.aligncenter': {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      textAlign: 'center',
      maxWidth: '90%',
      float: 'none',
      clear: 'both',
    },
  },
  '& .wp-caption img': {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  '& .wp-caption-text': {
    fontSize: '13px',
    fontStyle: 'italic',
    color: '#666666',
    padding: '12px 16px',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderTop: '1px solid rgba(0,0,0,0.1)',
    marginTop: 0,
    lineHeight: 1.4,
    fontFamily: '"Roboto", sans-serif',
  },
  // General image styles for WordPress content
  '& img': {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '4px',
    '&.alignright': {
      float: 'right',
      marginLeft: theme.spacing(3),
      marginBottom: theme.spacing(2),
      maxWidth: '50%',
    },
    '&.alignleft': {
      float: 'left',
      marginRight: theme.spacing(3),
      marginBottom: theme.spacing(2),
      maxWidth: '50%',
    },
    '&.aligncenter': {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  // Clear floats after content
  '&::after': {
    content: '""',
    display: 'table',
    clear: 'both',
  },
}));

const AuthorCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),
  backgroundColor: theme.palette.grey[50],
}));

const SocialShare = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));


interface ArticleDetailProps {
  className?: string;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ className = '' }) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [article, setArticle] = useState<FormattedNewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<FormattedNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<FormattedComment[]>([]);
  const [newComment, setNewComment] = useState({ name: '', email: '', website: '', comment: '' });
  const [saveInfo, setSaveInfo] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Generate dynamic author info based on article data
  const generateAuthorInfo = (article: FormattedNewsArticle | null) => {
    if (!article) return {
      name: 'MegaphoneOZ Editorial Team',
      email: 'editorial@megaphoneoz.com',
      bio: 'The MegaphoneOZ editorial team brings you the latest news and insights from Australia and around the world.',
      image: '',
      initials: 'MO'
    };

    // Use real WordPress author data if available
    if (article.author) {
      const author = article.author;
      console.log('Using WordPress author data:', author);
      console.log('Author avatar URLs:', author.avatar_urls);
      
      const authorInfo = {
        name: author.name.toUpperCase(),
        email: `EMAIL AUTHOR`, // WordPress doesn't expose email in public API
        bio: author.description || `${author.name} is a contributor to MegaphoneOZ, bringing you quality journalism and insightful coverage.`,
        image: author.avatar_urls['96'] || author.avatar_urls['48'] || author.avatar_urls['24'] || '',
        initials: author.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
      };
      
      console.log('Generated author info:', authorInfo);
      return authorInfo;
    }

    // Fallback to category-based profiles if no real author data
    const category = article.category.toLowerCase();
    const authorProfiles: { [key: string]: any } = {
      'news': {
        name: 'TARYN PRIADKO',
        email: 'taryn.priadko@megaphoneoz.com',
        bio: 'Taryn Priadko is an experienced journalist covering breaking news and current affairs. With a focus on investigative reporting, she brings important stories to light for the Australian community.',
        image: 'https://picsum.photos/150/150?random=1',
        initials: 'TP'
      },
      'local': {
        name: 'SARAH MITCHELL',
        email: 'sarah.mitchell@megaphoneoz.com', 
        bio: 'Sarah Mitchell specializes in local community news and human interest stories. She has been covering Sydney and surrounding areas for over 8 years.',
        image: 'https://picsum.photos/150/150?random=2',
        initials: 'SM'
      },
      'arts': {
        name: 'JAMES COOPER',
        email: 'james.cooper@megaphoneoz.com',
        bio: 'James Cooper is our arts and entertainment correspondent, reviewing theatre, film, music and cultural events across Australia.',
        image: 'https://picsum.photos/150/150?random=3', 
        initials: 'JC'
      },
      'lifestyle': {
        name: 'EMMA DAVIDSON',
        email: 'emma.davidson@megaphoneoz.com',
        bio: 'Emma Davidson covers lifestyle, travel, and food & wine for MegaphoneOZ. Her reviews and travel guides help readers discover the best experiences.',
        image: 'https://picsum.photos/150/150?random=4',
        initials: 'ED'
      },
      'opinion': {
        name: 'MICHAEL WONG',
        email: 'michael.wong@megaphoneoz.com',
        bio: 'Michael Wong is a political commentator and opinion writer, offering thoughtful analysis on current events and policy matters.',
        image: 'https://picsum.photos/150/150?random=5',
        initials: 'MW'
      }
    };

    return authorProfiles[category] || {
      name: 'TARYN PRIADKO',
      email: 'taryn.priadko@megaphoneoz.com', 
      bio: 'Taryn Priadko is an experienced journalist covering breaking news and current affairs. With a focus on investigative reporting, she brings important stories to light for the Australian community.',
      image: 'https://picsum.photos/150/150?random=1',
      initials: 'TP'
    };
  };

  // Generate article content based on the article data
  const generateArticleContent = (article: FormattedNewsArticle | null) => {
    if (!article) {
      console.log('No article data available for content generation');
      return '';
    }

    // Use real WordPress content if available, otherwise expand excerpt
    if (article.content && article.content.trim() !== '') {
      console.log('Using WordPress content, length:', article.content.length);
      return article.content;
    }

    console.log('WordPress content not available, using fallback content');
    // Fallback: expand the excerpt into a fuller article
    const expandedContent = `
      <p>${article.excerpt}</p>
      
      <p>This story continues to develop as more information becomes available. Our editorial team is committed to providing accurate and timely reporting on issues that matter to our community.</p>

      <h3>Background</h3>
      
      <p>This article represents ongoing coverage in the ${article.category.toLowerCase()} category. We encourage readers to stay informed about developments in this area as they may impact the broader community.</p>

      <h3>Community Impact</h3>
      
      <p>Stories like these highlight the importance of staying informed about current events and their potential effects on our daily lives. We will continue to monitor this situation and provide updates as they become available.</p>

      <p>For more information and the latest updates, please continue following MegaphoneOZ's comprehensive coverage of this and other important stories.</p>
    `;

    return expandedContent;
  };

  const mockComments: Comment[] = [
    {
      author: 'Sarah Chen',
      post: 'This happened to my roommate last semester. She was so scared she almost sent $5000 before I convinced her to call the police first. These scammers are getting more sophisticated.',
      date: 'March 15, 2024',
      email: 'sarah.chen@email.com'
    },
    {
      author: 'David Liu',
      post: 'Thank you for raising awareness about this. My university should do more to warn international students about these scams.',
      date: 'March 14, 2024', 
      email: 'david.liu@email.com'
    }
  ];

  // Load saved user info from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('megaphone_comment_name');
    const savedEmail = localStorage.getItem('megaphone_comment_email');
    const savedWebsite = localStorage.getItem('megaphone_comment_website');
    
    if (savedName || savedEmail || savedWebsite) {
      setNewComment({
        name: savedName || '',
        email: savedEmail || '',
        website: savedWebsite || '',
        comment: ''
      });
      setSaveInfo(true);
    }
  }, []);

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        setLoading(true);
        const newsService = WordPressNewsService.getInstance();
        
        // First try to get article data from WordPress API using the ID
        if (id) {
          console.log(`ArticleDetail: Fetching article ${id} from WordPress API`);
          const wordpressArticle = await newsService.getPostById(parseInt(id));
          
          if (wordpressArticle) {
            console.log('ArticleDetail: Successfully fetched WordPress article:', wordpressArticle);
            setArticle(wordpressArticle);
          } else {
            console.warn(`ArticleDetail: Could not fetch article ${id} from WordPress`);
          }
        }
        
        // If no WordPress data and we have navigation state, use that as fallback
        if (!article) {
          const locationState = location.state as { article?: any, categoryTitle?: string };
          
          if (locationState?.article) {
            console.log('ArticleDetail: Using fallback data from navigation state');
            const passedArticle = locationState.article;
            
            const formattedArticle: FormattedNewsArticle = {
              id: passedArticle.id,
              title: passedArticle.title,
              date: passedArticle.date,
              excerpt: passedArticle.excerpt || '',
              image: passedArticle.image || '',
              category: passedArticle.category || 'NEWS',
              slug: passedArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
              link: `https://megaphoneoz.com/article/${passedArticle.id}`,
              content: passedArticle.content,
              author: passedArticle.author
            };
            
            setArticle(formattedArticle);
          }
        }
        
        // Always fetch related articles
        const related = await newsService.getLatestNewsForSlider(4);
        setRelatedArticles(related.slice(0, 3));
        
        // Fetch real comments for this article after we have the article data
        // Use the current article state or get it from the API
        let currentArticleId: number | null = null;
        
        if (id) {
          currentArticleId = parseInt(id);
        } else if (location.state && (location.state as any).article) {
          currentArticleId = (location.state as any).article.id;
        }
        
        if (currentArticleId) {
          try {
            const articleComments = await newsService.fetchCommentsByPostId(currentArticleId);
            const formattedComments: FormattedComment[] = articleComments.map(comment => ({
              id: comment.id,
              postId: comment.post,
              authorName: comment.author_name,
              content: comment.content.rendered.replace(/<[^>]*>/g, ''), // Strip HTML
              date: new Date(comment.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }),
              avatarUrl: comment.author_avatar_urls['48'] || comment.author_avatar_urls['96'] || comment.author_avatar_urls['24'] || '',
              authorUrl: comment.author_url || undefined,
              status: comment.status
            }));
            setComments(formattedComments);
            console.log(`Successfully loaded ${formattedComments.length} comments for article ${currentArticleId}`);
          } catch (error) {
            console.error('Error loading comments, using fallback:', error);
            // Convert mockComments to FormattedComment format as fallback
            const fallbackComments: FormattedComment[] = mockComments.map((comment, index) => ({
              id: index + 1,
              postId: currentArticleId || 0,
              authorName: comment.author,
              content: comment.post,
              date: comment.date || 'March 15, 2024',
              avatarUrl: '',
              authorUrl: undefined, // Fallback comments don't have website URLs
              status: 'approve' // Fallback comments are treated as approved
            }));
            setComments(fallbackComments);
          }
        }
        
      } catch (error) {
        console.error('Error fetching article data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleData();
  }, [id, location.state]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleShare = (platform: string) => {
    if (!article) return;
    
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(article.title);
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${text}&body=${url}`;
        break;
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!article) {
      setSubmitError('Article not found');
      return;
    }

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const newsService = WordPressNewsService.getInstance();
      
      const submittedComment = await newsService.submitComment(
        article.id,
        newComment.name,
        newComment.email,
        newComment.comment,
        newComment.website || undefined
      );

      if (submittedComment) {
        // Convert WordPress comment to our FormattedComment format
        const formattedComment: FormattedComment = {
          id: submittedComment.id,
          postId: submittedComment.post,
          authorName: submittedComment.author_name,
          content: submittedComment.content.rendered.replace(/<[^>]*>/g, ''), // Strip HTML
          date: new Date(submittedComment.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          avatarUrl: submittedComment.author_avatar_urls['48'] || submittedComment.author_avatar_urls['96'] || submittedComment.author_avatar_urls['24'] || '',
          authorUrl: submittedComment.author_url || undefined,
          status: submittedComment.status
        };

        // Add comment to the list (usually goes to moderation first)
        setComments([formattedComment, ...comments]);
        setSubmitSuccess(true);
        setNewComment({ name: '', email: '', website: '', comment: '' });
        
        // Save user info if requested
        if (saveInfo) {
          localStorage.setItem('megaphone_comment_name', newComment.name);
          localStorage.setItem('megaphone_comment_email', newComment.email);
          localStorage.setItem('megaphone_comment_website', newComment.website);
        }

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);

        console.log('Comment submitted successfully:', formattedComment);
      } else {
        throw new Error('Failed to submit comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('Failed to submit comment. Please try again.');
      }
      
      // Clear error message after 10 seconds
      setTimeout(() => {
        setSubmitError(null);
      }, 10000);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleRelatedClick = (relatedArticle: FormattedNewsArticle) => {
    // Pass the related article data via state
    navigate(`/article/${relatedArticle.id}`, { 
      state: { 
        article: {
          id: relatedArticle.id,
          title: relatedArticle.title,
          date: relatedArticle.date,
          excerpt: relatedArticle.excerpt,
          image: relatedArticle.image,
          category: relatedArticle.category
        },
        categoryTitle: relatedArticle.category || 'NEWS'
      } 
    });
  };

  if (loading) {
    return (
      <ArticleContainer className={className}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
            <Box sx={{ flex: { md: '2 1 0%' } }}>
              <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={400} sx={{ mb: 3 }} />
              <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
              <Skeleton variant="text" height={200} />
            </Box>
            <Box sx={{ flex: { md: '1 1 0%' } }}>
              <Skeleton variant="rectangular" height={300} />
            </Box>
          </Box>
        </Container>
      </ArticleContainer>
    );
  }

  if (!article) {
    return (
      <ArticleContainer className={className}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" gutterBottom>
              Article Not Found
            </Typography>
            <Button variant="contained" onClick={handleBackClick} startIcon={<ArrowBackIcon />}>
              Go Back
            </Button>
          </Box>
        </Container>
      </ArticleContainer>
    );
  }

  return (
    <ArticleContainer className={className}>
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          {/* Main Content */}
          <Box>
            {/* Back Button */}
            <Button 
              startIcon={<ArrowBackIcon />} 
              onClick={handleBackClick}
              sx={{ mb: 3 }}
              variant="outlined"
            >
              Back to Articles
            </Button>

            <ArticleHeader>
              {/* Category and Date */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip label={article.category} color="primary" size="small" />
                <Typography variant="body2" color="text.secondary">
                  {article.date}
                </Typography>
              </Box>

              {/* Title */}
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  fontFamily: '"Roboto", sans-serif',
                  fontWeight: 700, 
                  fontSize: '25px', // Match WordPress
                  color: '#444444',
                  lineHeight: 1.3,
                  marginBottom: '20px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {article.title}
              </Typography>

              {/* Author Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar 
                  src={generateAuthorInfo(article).image} 
                  sx={{ width: 40, height: 40 }}
                >
                  {generateAuthorInfo(article).initials}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {generateAuthorInfo(article).name}
                  </Typography>
                </Box>
              </Box>

              {/* Featured Image - removed because WordPress content already includes images in correct positions */}
            </ArticleHeader>

            {/* Article Content */}
            <ArticleContent 
              dangerouslySetInnerHTML={{ __html: generateArticleContent(article) }}
              ref={(el: HTMLDivElement | null) => {
                // Smart image layout: Check image widths and adjust layout
                if (el) {
                  const images = el.querySelectorAll('.wp-caption');
                  images.forEach((caption) => {
                    const img = caption.querySelector('img');
                    if (img) {
                      img.onload = () => {
                        const naturalWidth = img.naturalWidth;
                        const parentWidth = el.clientWidth;
                        
                        // If image is wider than 70% of container, make it full width
                        if (naturalWidth > parentWidth * 0.7) {
                          (caption as HTMLElement).style.float = 'none';
                          (caption as HTMLElement).style.display = 'block';
                          (caption as HTMLElement).style.marginLeft = 'auto';
                          (caption as HTMLElement).style.marginRight = 'auto';
                          (caption as HTMLElement).style.maxWidth = '90%';
                          (caption as HTMLElement).style.textAlign = 'center';
                          (caption as HTMLElement).style.clear = 'both';
                        }
                      };
                    }
                  });
                }
              }}
            />

            {/* Social Share */}
            <SocialShare>
              <Typography variant="body2" fontWeight={600}>
                Share this article:
              </Typography>
              <IconButton onClick={() => handleShare('twitter')} color="primary">
                <TwitterIcon />
              </IconButton>
              <IconButton onClick={() => handleShare('facebook')} color="primary">
                <FacebookIcon />
              </IconButton>
              <IconButton onClick={() => handleShare('email')} color="primary">
                <EmailIcon />
              </IconButton>
            </SocialShare>

            <Divider sx={{ my: 4 }} />

            {/* Author Card */}
            <AuthorCard>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'text.primary', mb: 3 }}>
                  ABOUT THE AUTHOR
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                  <Avatar 
                    src={generateAuthorInfo(article).image}
                    sx={{ width: 80, height: 80 }}
                  >
                    {generateAuthorInfo(article).initials}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ color: '#c60800', fontWeight: 700 }}>
                      {generateAuthorInfo(article).name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {generateAuthorInfo(article).bio}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </AuthorCard>

            {/* Related Articles - moved below article content */}
            <Box sx={{ mt: 6, mb: 6 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'text.primary', mb: 3 }}>
                RELATED ARTICLES
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                {relatedArticles.map((relatedArticle) => (
                  <Card
                    key={relatedArticle.id}
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                      },
                    }}
                    onClick={() => handleRelatedClick(relatedArticle)}
                  >
                    {relatedArticle.image && (
                      <CardMedia
                        component="img"
                        height={140}
                        image={relatedArticle.image}
                        alt={relatedArticle.title}
                        sx={{ objectFit: 'cover' }}
                      />
                    )}
                    <CardContent>
                      <Typography variant="body2" fontWeight={600} sx={{ mb: 1, lineHeight: 1.3 }}>
                        {relatedArticle.title.length > 60 
                          ? `${relatedArticle.title.substring(0, 60)}...` 
                          : relatedArticle.title
                        }
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {relatedArticle.date}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>

            {/* Comments Section */}
            <Box sx={{ mt: 6 }}>
              <Typography variant="h5" gutterBottom>
                Comments ({comments.length})
              </Typography>

              {/* Comments List */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <Card key={comment.id} sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Avatar 
                          src={comment.avatarUrl} 
                          sx={{ width: 40, height: 40 }}
                        >
                          {comment.authorName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            {comment.authorUrl ? (
                              <Typography 
                                variant="subtitle2" 
                                fontWeight={600}
                                component="a"
                                href={comment.authorUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ 
                                  color: '#c60800',
                                  textDecoration: 'none',
                                  '&:hover': {
                                    textDecoration: 'underline'
                                  }
                                }}
                              >
                                {comment.authorName}
                              </Typography>
                            ) : (
                              <Typography variant="subtitle2" fontWeight={600}>
                                {comment.authorName}
                              </Typography>
                            )}
                            <Typography variant="caption" color="text.secondary">
                              {comment.date}
                            </Typography>
                            {comment.status === 'hold' && (
                              <Chip 
                                label="Awaiting Moderation" 
                                size="small" 
                                sx={{ 
                                  backgroundColor: '#fff3cd',
                                  color: '#856404',
                                  fontSize: '0.7rem',
                                  height: 20
                                }}
                              />
                            )}
                          </Box>
                          <Typography variant="body2">
                            {comment.content}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  ))
                ) : (
                  <Card sx={{ p: 3 }}>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      No comments yet. Be the first to comment!
                    </Typography>
                  </Card>
                )}
              </Box>

              {/* Comment Form */}
              <Card sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'text.primary', mb: 3 }}>
                  ADD A COMMENT
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Your email address will not be published. Required fields are marked <span style={{ color: 'red' }}>*</span>
                </Typography>
                
                {/* Success Message */}
                {submitSuccess && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Comment submitted successfully! Your comment is awaiting moderation and will appear once approved.
                  </Alert>
                )}
                
                {/* Error Message */}
                {submitError && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {submitError}
                  </Alert>
                )}
                <Box component="form" onSubmit={handleCommentSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    placeholder="Name"
                    required
                    value={newComment.name}
                    onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f5f5f5',
                        borderRadius: 0,
                        '& fieldset': {
                          border: 'none',
                        },
                      },
                    }}
                  />
                  <TextField
                    placeholder="Email"
                    type="email"
                    required
                    value={newComment.email}
                    onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f5f5f5',
                        borderRadius: 0,
                        '& fieldset': {
                          border: 'none',
                        },
                      },
                    }}
                  />
                  <TextField
                    placeholder="Website"
                    value={newComment.website}
                    onChange={(e) => setNewComment({ ...newComment, website: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f5f5f5',
                        borderRadius: 0,
                        '& fieldset': {
                          border: 'none',
                        },
                      },
                    }}
                  />
                  <TextField
                    multiline
                    rows={6}
                    required
                    value={newComment.comment}
                    onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f5f5f5',
                        borderRadius: 0,
                        '& fieldset': {
                          border: 'none',
                        },
                      },
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <input
                      type="checkbox"
                      id="save-info"
                      checked={saveInfo}
                      onChange={(e) => setSaveInfo(e.target.checked)}
                    />
                    <label htmlFor="save-info" style={{ fontSize: '0.875rem', color: '#666' }}>
                      Save my name, email, and website in this browser for the next time I comment.
                    </label>
                  </Box>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={submitLoading}
                    startIcon={submitLoading ? <CircularProgress size={20} color="inherit" /> : null}
                    sx={{ 
                      alignSelf: 'flex-start',
                      backgroundColor: '#c60800',
                      borderRadius: 0,
                      px: 4,
                      py: 1.5,
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      '&:hover': {
                        backgroundColor: '#a00600'
                      },
                      '&:disabled': {
                        backgroundColor: '#999',
                        color: 'white'
                      }
                    }}
                  >
                    {submitLoading ? 'SUBMITTING...' : 'ADD COMMENT'}
                  </Button>
                </Box>
              </Card>
            </Box>
          </Box>
        </Box>
      </Container>
    </ArticleContainer>
  );
};

export default ArticleDetail;