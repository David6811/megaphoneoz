import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Chip,
  useTheme 
} from '@mui/material';

interface ExampleCardProps {
  title: string;
  image: string;
  category: string;
  date: string;
  excerpt?: string;
}

// Example component demonstrating Material-First, Tailwind-Second strategy
const ExampleCard: React.FC<ExampleCardProps> = ({ 
  title, 
  image, 
  category, 
  date, 
  excerpt 
}) => {
  const theme = useTheme();

  return (
    <Card 
      elevation={2}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        }
      }}
    >
      {/* Material handles the layout and structure */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          // Use Tailwind ONLY for aspect ratio (Material doesn't provide this)
          className="aspect-video"
          image={image}
          alt={title}
          sx={{ 
            objectFit: 'cover',
            backgroundColor: theme.palette.grey[200]
          }}
        />
        
        {/* Material handles positioning and styling */}
        <Chip
          label={category}
          size="small"
          sx={{
            position: 'absolute',
            top: theme.spacing(1),
            left: theme.spacing(1),
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontWeight: 600,
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Material typography with theme values */}
        <Typography 
          variant="h6" 
          component="h3"
          sx={{ 
            fontWeight: 600,
            lineHeight: 1.3,
            marginBottom: 1,
            color: theme.palette.text.primary
          }}
        >
          {title}
        </Typography>

        {excerpt && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              marginBottom: 'auto',
              lineHeight: 1.5 
            }}
          >
            {excerpt}
          </Typography>
        )}

        {/* Material spacing and typography */}
        <Box sx={{ marginTop: 2, paddingTop: 1 }}>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              fontSize: '0.75rem',
              fontWeight: 500 
            }}
          >
            {date}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ExampleCard;

/*
STRATEGY DEMONSTRATION:

✅ Material-First:
- Card, CardContent, CardMedia for structure
- Typography with Material variants
- Box for layout with sx prop
- Theme values for colors, spacing, typography
- Material hover effects and transitions

⚠️ Tailwind-Second (minimal usage):
- aspect-video utility (Material doesn't provide aspect ratios)
- Could add backdrop-blur if needed for overlays
- Could add custom animations that Material doesn't have

❌ Avoided:
- Tailwind colors (use theme.palette instead)
- Tailwind spacing (use theme.spacing instead)  
- Tailwind typography (use Material Typography variants)
- Tailwind flexbox (use Material Box with sx)
*/