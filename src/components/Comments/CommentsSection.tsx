import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { SupabaseComment, CommentFormData } from '../../types';
import { commentService } from '../../services/commentService';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

interface CommentsSectionProps {
  postId: number;
}

interface CommentTree {
  comment: SupabaseComment;
  replies: CommentTree[];
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<SupabaseComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadComments();
  }, [postId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const commentsData = await commentService.getCommentsByPostId(postId);
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const buildCommentTree = (comments: SupabaseComment[]): CommentTree[] => {
    const commentMap = new Map<number, CommentTree>();
    const rootComments: CommentTree[] = [];

    // First, create all comment nodes
    comments.forEach(comment => {
      commentMap.set(comment.id, {
        comment,
        replies: []
      });
    });

    // Then, build the tree structure
    comments.forEach(comment => {
      const commentNode = commentMap.get(comment.id)!;
      
      if (comment.parent_id && commentMap.has(comment.parent_id)) {
        // This is a reply, add it to its parent's replies
        const parentNode = commentMap.get(comment.parent_id)!;
        parentNode.replies.push(commentNode);
      } else {
        // This is a root comment
        rootComments.push(commentNode);
      }
    });

    return rootComments;
  };

  const handleAddComment = async (formData: {
    author_name: string;
    author_email: string;
    content: string;
  }) => {
    const commentData: CommentFormData = {
      author_name: formData.author_name,
      author_email: formData.author_email,
      content: formData.content
    };

    const newComment = await commentService.addComment(postId, commentData);
    if (newComment) {
      setComments(prev => [...prev, newComment]);
    }
  };

  const handleReply = async (
    parentId: number,
    content: string,
    authorName: string,
    authorEmail: string
  ) => {
    const commentData: CommentFormData = {
      author_name: authorName,
      author_email: authorEmail,
      content: content,
      parent_id: parentId
    };

    const newComment = await commentService.addComment(postId, commentData);
    if (newComment) {
      setComments(prev => [...prev, newComment]);
    }
  };

  const renderCommentTree = (commentTree: CommentTree[], level = 0) => {
    return commentTree.map(({ comment, replies }) => (
      <CommentItem
        key={comment.id}
        comment={comment}
        replies={replies.map(r => r.comment)}
        onReply={handleReply}
        level={level}
      />
    ));
  };

  const commentTree = buildCommentTree(comments);
  const approvedComments = comments.filter(c => c.status === 'approved');

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        Comments ({approvedComments.length})
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Add New Comment Form */}
      <Card sx={{ p: 3, mb: 4 }}>
        <CommentForm onSubmit={handleAddComment} buttonText="Add Comment" />
      </Card>

      <Divider sx={{ mb: 4 }} />

      {/* Comments List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {commentTree.length > 0 ? (
          renderCommentTree(commentTree)
        ) : (
          <Card sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              No comments yet. Be the first to comment!
            </Typography>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default CommentsSection;