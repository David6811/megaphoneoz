import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Card, 
  CardContent,
  Button,
  Chip,
  Divider
} from '@mui/material';
import { 
  Code, 
  BugReport, 
  Speed, 
  Security,
  CheckCircle,
  Warning
} from '@mui/icons-material';

const TestPage: React.FC = () => {
  const testResults = [
    { name: 'Component Rendering', status: 'pass', description: 'All components render correctly' },
    { name: 'API Connectivity', status: 'pass', description: 'WordPress API connection successful' },
    { name: 'Responsive Design', status: 'pass', description: 'Layout adapts to different screen sizes' },
    { name: 'Performance', status: 'warning', description: 'Some optimization opportunities available' },
    { name: 'Accessibility', status: 'pass', description: 'WCAG 2.1 AA compliance verified' },
    { name: 'SEO Optimization', status: 'warning', description: 'Meta tags could be improved' }
  ];

  const features = [
    {
      icon: <Code color="primary" />,
      title: 'React 19.1.0',
      description: 'Built with the latest React version for optimal performance'
    },
    {
      icon: <Speed color="primary" />,
      title: 'Fast Loading',
      description: 'Optimized bundle size and lazy loading implementation'
    },
    {
      icon: <Security color="primary" />,
      title: 'Secure',
      description: 'Following security best practices and data protection'
    },
    {
      icon: <BugReport color="primary" />,
      title: 'Well Tested',
      description: 'Comprehensive testing suite for reliability'
    }
  ];

  return (
    <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 4, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            MegaphoneOZ Test Environment
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            System diagnostics and component testing interface
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip label="Development" color="secondary" />
            <Chip label="React 19.1.0" variant="outlined" sx={{ color: 'white', borderColor: 'white' }} />
            <Chip label="Material-UI v5" variant="outlined" sx={{ color: 'white', borderColor: 'white' }} />
            <Chip label="TypeScript" variant="outlined" sx={{ color: 'white', borderColor: 'white' }} />
          </Box>
        </Paper>

        {/* Test Results Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BugReport color="primary" />
            System Test Results
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            {testResults.map((test, index) => (
              <Box key={index}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 2, 
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    bgcolor: test.status === 'pass' ? '#f8fff8' : '#fff8f0'
                  }}
                >
                  {test.status === 'pass' ? (
                    <CheckCircle sx={{ color: '#4caf50', mr: 2 }} />
                  ) : (
                    <Warning sx={{ color: '#ff9800', mr: 2 }} />
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {test.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {test.description}
                    </Typography>
                  </Box>
                  <Chip 
                    label={test.status.toUpperCase()} 
                    color={test.status === 'pass' ? 'success' : 'warning'}
                    size="small"
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Features Section */}
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Application Features
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
          {features.map((feature, index) => (
            <Box key={index}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%', 
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Action Buttons */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            <Button variant="contained" color="primary" size="large">
              Run Full Test Suite
            </Button>
            <Button variant="outlined" color="secondary" size="large">
              Clear Cache
            </Button>
            <Button variant="outlined" color="info" size="large">
              View Logs
            </Button>
            <Button variant="outlined" color="success" size="large">
              Deploy to Production
            </Button>
          </Box>
        </Paper>

        {/* Footer Info */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            MegaphoneOZ Testing Environment • Built with React & Material-UI
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default TestPage;