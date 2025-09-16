import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CommentIcon from '@mui/icons-material/Comment';

const HorizontalCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  minHeight: 200,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  },
  cursor: 'pointer',
  marginBottom: theme.spacing(3),
  border: '1px solid #e0e0e0',
  overflow: 'hidden', // 确保子元素不会超出边框
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    height: 'auto',
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  width: 300,
  flexShrink: 0,
  backgroundColor: theme.palette.grey[200],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  alignSelf: 'stretch', // 拉伸到父容器高度
  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: 200,
    alignSelf: 'auto',
  },
}));

const StyledImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block', // 移除默认的inline间隙
});

const PlaceholderBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.grey[300],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.grey[500],
  fontSize: '0.9rem',
  textAlign: 'center',
  backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
  backgroundSize: '20px 20px',
  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
}));

const ContentSection = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2, 3),
  flex: 1,
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
}));

const ContentMain = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: 'auto', // 让这部分内容紧凑，MetaInfo自动推到底部
});


const ArticleTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.25rem',
  lineHeight: 1.3,
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  textTransform: 'uppercase',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}));

const ArticleExcerpt = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.9rem',
  lineHeight: 1.5,
  marginBottom: 0, // 移除底部间距，让内容更紧凑
  display: '-webkit-box',
  WebkitLineClamp: 5,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}));

const MetaInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: theme.spacing(1.5), // 添加顶部间距，与内容分开
  alignSelf: 'flex-end', // 确保推到底部
  width: '100%',
}));

const DateText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.85rem',
}));

const CommentInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  color: theme.palette.text.secondary,
}));


interface NewsCardProps {
  id: number;
  title: string;
  excerpt?: string;
  image?: string;
  date: string;
  comments?: number;
  onClick?: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  excerpt,
  image,
  date,
  comments = 0,
  onClick
}) => {
  return (
    <HorizontalCard onClick={onClick}>
      <ImageContainer>
        {image && image.trim() !== '' ? (
          <StyledImage 
            src={image} 
            alt={title}
            onError={(e) => {
              // If image fails to load, hide it and show placeholder
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const container = target.parentElement;
              if (container) {
                const placeholder = container.querySelector('.placeholder-fallback');
                if (placeholder) {
                  (placeholder as HTMLElement).style.display = 'flex';
                }
              }
            }}
          />
        ) : null}
        <PlaceholderBox 
          className="placeholder-fallback"
          sx={{ 
            display: image && image.trim() !== '' ? 'none' : 'flex' 
          }}
        >
          📰
        </PlaceholderBox>
      </ImageContainer>
      <ContentSection>
        <ContentMain>
          <ArticleTitle variant="h5">
            {title}
          </ArticleTitle>
          {excerpt && (
            <ArticleExcerpt variant="body2">
              {excerpt}
            </ArticleExcerpt>
          )}
        </ContentMain>
        <MetaInfo>
          <DateText variant="body2">
            {date}
          </DateText>
          {comments !== undefined && (
            <CommentInfo>
              <CommentIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                {comments}
              </Typography>
            </CommentInfo>
          )}
        </MetaInfo>
      </ContentSection>
    </HorizontalCard>
  );
};

export default NewsCard;