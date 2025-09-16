import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Collapse,
  Chip
} from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import { SupabaseComment } from '../../types';
import CommentForm from './CommentForm';

interface CommentItemProps {
  comment: SupabaseComment;
  replies?: SupabaseComment[];
  onReply: (parentId: number, content: string, authorName: string, authorEmail: string) => Promise<void>;
  level?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  replies = [], 
  onReply, 
  level = 0 
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const handleReplySubmit = async (formData: {
    author_name: string;
    author_email: string;
    content: string;
  }) => {
    await onReply(comment.id, formData.content, formData.author_name, formData.author_email);
    setShowReplyForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Box
      sx={{
        ml: level * 4,
        mb: 2,
        border: level > 0 ? '1px solid #e0e0e0' : 'none',
        borderLeft: level > 0 ? '3px solid #c60800' : 'none',
        pl: level > 0 ? 2 : 0,
        borderRadius: level > 0 ? 1 : 0,
        backgroundColor: level > 0 ? '#fafafa' : 'transparent'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
        <Avatar sx={{ width: 40, height: 40, bgcolor: '#c60800' }}>
          {getInitials(comment.author_name || 'Anonymous')}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              {comment.author_name || 'Anonymous'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(comment.created_at)}
            </Typography>
            {comment.status === 'pending' && (
              <Chip
                label="Pending Approval"
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
          <Typography variant="body2" sx={{ mb: 2 }}>
            {comment.content}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              size="small"
              startIcon={<ReplyIcon />}
              onClick={() => setShowReplyForm(!showReplyForm)}
              sx={{
                color: '#c60800',
                fontSize: '0.8rem',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(198, 8, 0, 0.04)'
                }
              }}
            >
              Reply
            </Button>
            {replies.length > 0 && (
              <Button
                size="small"
                onClick={() => setShowReplies(!showReplies)}
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.8rem',
                  textTransform: 'none'
                }}
              >
                {showReplies ? 'Hide' : 'Show'} {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      <Collapse in={showReplyForm}>
        <Box sx={{ ml: 6, mb: 2 }}>
          <CommentForm
            onSubmit={handleReplySubmit}
            buttonText="Reply"
            placeholder="Write your reply..."
            compact
          />
        </Box>
      </Collapse>

      <Collapse in={showReplies}>
        <Box>
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              level={level + 1}
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export default CommentItem;