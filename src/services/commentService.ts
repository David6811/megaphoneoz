import { supabase } from '../config/supabase';
import { SupabaseComment, CommentFormData } from '../types';

export class CommentService {
  async getCommentsByPostId(postId: number): Promise<SupabaseComment[]> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .eq('status', 'approved')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getCommentsByPostId:', error);
      return [];
    }
  }

  async addComment(postId: number, commentData: CommentFormData): Promise<SupabaseComment | null> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          author_name: commentData.author_name,
          author_email: commentData.author_email,
          content: commentData.content,
          parent_id: commentData.parent_id || null,
          status: 'approved'
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding comment:', error);
        throw new Error('Failed to add comment');
      }

      return data;
    } catch (error) {
      console.error('Error in addComment:', error);
      throw error;
    }
  }

  async getCommentReplies(parentId: number): Promise<SupabaseComment[]> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('parent_id', parentId)
        .eq('status', 'approved')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comment replies:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getCommentReplies:', error);
      return [];
    }
  }

  async getCommentThread(postId: number): Promise<SupabaseComment[]> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .eq('status', 'approved')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comment thread:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getCommentThread:', error);
      return [];
    }
  }
}

export const commentService = new CommentService();