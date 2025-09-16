import React from 'react';
import {
  Box,
  Typography,
  Link
} from '@mui/material';
import { styled } from '@mui/material/styles';

const TextCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 0),
  borderBottom: '1px solid #e0e0e0',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.grey[50],
  },
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const ArticleTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  lineHeight: 1.3,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
  textTransform: 'uppercase',
  '&:hover': {
    color: '#c60800',
  },
}));

const ArticleExcerpt = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '1rem',
  lineHeight: 1.5,
  marginBottom: theme.spacing(2),
}));

const MetaInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1),
}));

const DateText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.9rem',
}));

const ReadMoreLink = styled(Link)(({ theme }) => ({
  color: '#c60800',
  textDecoration: 'none',
  fontSize: '0.9rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

interface TextOnlyCardProps {
  id: number;
  title: string;
  excerpt?: string;
  date: string;
  onClick?: () => void;
}

const TextOnlyCard: React.FC<TextOnlyCardProps> = ({
  title,
  excerpt,
  date,
  onClick
}) => {
  return (
    <TextCard onClick={onClick}>
      <ArticleTitle variant="h2">
        {title}
      </ArticleTitle>
      {excerpt && (
        <ArticleExcerpt variant="body1">
          {excerpt}
        </ArticleExcerpt>
      )}
      <MetaInfo>
        <DateText variant="body2">
          {date}
        </DateText>
        <ReadMoreLink>
          READ MORE →
        </ReadMoreLink>
      </MetaInfo>
    </TextCard>
  );
};

export default TextOnlyCard;