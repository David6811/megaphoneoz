import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';

interface CommentFormProps {
  onSubmit: (formData: {
    author_name: string;
    author_email: string;
    content: string;
  }) => Promise<void>;
  buttonText?: string;
  placeholder?: string;
  compact?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  buttonText = 'Add Comment',
  placeholder = 'Write your comment...',
  compact = false
}) => {
  const [formData, setFormData] = useState({
    author_name: '',
    author_email: '',
    content: ''
  });
  const [saveInfo, setSaveInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load saved user info from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('megaphone_comment_name');
    const savedEmail = localStorage.getItem('megaphone_comment_email');
    
    if (savedName || savedEmail) {
      setFormData(prev => ({
        ...prev,
        author_name: savedName || '',
        author_email: savedEmail || ''
      }));
      setSaveInfo(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.author_name.trim() || !formData.author_email.trim() || !formData.content.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await onSubmit(formData);
      
      // Save user info if requested
      if (saveInfo) {
        localStorage.setItem('megaphone_comment_name', formData.author_name);
        localStorage.setItem('megaphone_comment_email', formData.author_email);
      }

      // Reset form content but keep name/email if saving info
      setFormData(prev => ({
        ...prev,
        content: ''
      }));
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    if (error) setError(null);
  };

  return (
    <Box>
      {!compact && (
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          {buttonText}
        </Typography>
      )}
      
      {!compact && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Your email address will not be published. Required fields are marked <span style={{ color: 'red' }}>*</span>
        </Typography>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Comment submitted successfully!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: compact ? 2 : 3 }}>
        {!compact && (
          <>
            <TextField
              label="Name *"
              value={formData.author_name}
              onChange={handleInputChange('author_name')}
              required
              size={compact ? 'small' : 'medium'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f5f5f5',
                  '& fieldset': {
                    border: '1px solid #ddd',
                  },
                },
              }}
            />
            <TextField
              label="Email *"
              type="email"
              value={formData.author_email}
              onChange={handleInputChange('author_email')}
              required
              size={compact ? 'small' : 'medium'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f5f5f5',
                  '& fieldset': {
                    border: '1px solid #ddd',
                  },
                },
              }}
            />
          </>
        )}
        
        {compact && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              placeholder="Name *"
              value={formData.author_name}
              onChange={handleInputChange('author_name')}
              required
              size="small"
              sx={{ flex: 1 }}
            />
            <TextField
              placeholder="Email *"
              type="email"
              value={formData.author_email}
              onChange={handleInputChange('author_email')}
              required
              size="small"
              sx={{ flex: 1 }}
            />
          </Box>
        )}

        <TextField
          multiline
          rows={compact ? 3 : 6}
          placeholder={placeholder}
          value={formData.content}
          onChange={handleInputChange('content')}
          required
          size={compact ? 'small' : 'medium'}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#f5f5f5',
              '& fieldset': {
                border: '1px solid #ddd',
              },
            },
          }}
        />

        {!compact && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <input
              type="checkbox"
              id="save-info"
              checked={saveInfo}
              onChange={(e) => setSaveInfo(e.target.checked)}
            />
            <label htmlFor="save-info" style={{ fontSize: '0.875rem', color: '#666' }}>
              Save my name and email for next time
            </label>
          </Box>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{
            alignSelf: 'flex-start',
            backgroundColor: '#c60800',
            px: 4,
            py: compact ? 1 : 1.5,
            fontSize: compact ? '0.8rem' : '0.9rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            '&:hover': {
              backgroundColor: '#a00600'
            },
            '&:disabled': {
              backgroundColor: '#999',
              color: 'white'
            }
          }}
        >
          {isSubmitting ? 'Submitting...' : buttonText}
        </Button>
      </Box>
    </Box>
  );
};

export default CommentForm;