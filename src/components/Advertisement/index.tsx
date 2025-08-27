import React from 'react';
import { Box, Card, CardContent, Typography, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export interface AdProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  width?: string | number;
  height?: string | number;
  type?: 'banner' | 'square' | 'sidebar';
}

const Advertisement: React.FC<AdProps> = ({
  title = "Advertisement",
  description = "Your ad could be here! Contact us for advertising opportunities.",
  imageUrl = "https://via.placeholder.com/300x250/f0f0f0/666666?text=Advertisement",
  linkUrl = "/advertise",
  width = "100%",
  height = 250,
  type = "sidebar"
}) => {
  const theme = useTheme();

  const adStyles = {
    banner: {
      width: '100%',
      height: 100,
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      padding: theme.spacing(2),
    },
    square: {
      width: 300,
      height: 300,
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sidebar: {
      width: '100%',
      height: height,
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
    }
  };

  return (
    <Card
      sx={{
        ...adStyles[type],
        backgroundColor: '#f8f9fa',
        border: `1px solid ${theme.palette.grey[300]}`,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: theme.shadows[4],
          borderColor: theme.palette.primary.main,
        },
      }}
    >
      <Link
        href={linkUrl}
        sx={{
          textDecoration: 'none',
          color: 'inherit',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: type === 'banner' ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: type === 'banner' ? 'row' : 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: 2,
            width: '100%',
            height: '100%',
            '&:last-child': {
              paddingBottom: theme.spacing(2),
            },
          }}
        >
          {imageUrl && (
            <Box
              component="img"
              src={imageUrl}
              alt={title}
              sx={{
                maxWidth: type === 'banner' ? 100 : '80%',
                maxHeight: type === 'banner' ? 60 : '60%',
                objectFit: 'contain',
                borderRadius: 1,
              }}
            />
          )}
          
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant={type === 'banner' ? 'body2' : 'h6'}
              component="h3"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                marginBottom: 1,
                fontSize: type === 'banner' ? '0.875rem' : '1rem',
              }}
            >
              {title}
            </Typography>
            
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: type === 'banner' ? '0.75rem' : '0.875rem',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: type === 'banner' ? 2 : 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {description}
            </Typography>
          </Box>
        </CardContent>
      </Link>
    </Card>
  );
};

export default Advertisement;