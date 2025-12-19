
import { createClient } from '@supabase/supabase-js';
import { Suggestion, SuggestionCategory, SuggestionType, SuggestionStatus, Comment } from './types';

const SUPABASE_URL = 'https://pkylnbeczyxphjgunkdi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Ta8xF4k5Bll5GmhazWJGbg_FVVxLJUe';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export interface ApiResult<T> {
  data?: T;
  error?: string;
}

class SupabaseServer {
  async fetchSuggestions(): Promise<ApiResult<Suggestion[]>> {
    try {
      const { data, error } = await supabase
        .from('suggestions')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        return { error: error.message };
      }
      return { data: data || [] };
    } catch (err: any) {
      return { error: err.message || 'Unknown network error' };
    }
  }

  async createSuggestion(data: Omit<Suggestion, 'id' | 'createdAt' | 'status' | 'likes' | 'views' | 'comments'>): Promise<Suggestion> {
    const newSuggestion = {
      ...data,
      createdAt: Date.now(),
      status: SuggestionStatus.PENDING,
      likes: 0,
      views: 0,
      comments: []
    };

    const { data: insertedData, error } = await supabase
      .from('suggestions')
      .insert([newSuggestion])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error.message);
      throw new Error(error.message);
    }
    return insertedData;
  }

  async likeSuggestion(id: string, isAdding: boolean): Promise<number> {
    try {
      const { data: current, error: fetchError } = await supabase
        .from('suggestions')
        .select('likes')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const newLikes = isAdding ? (current?.likes || 0) + 1 : Math.max(0, (current?.likes || 0) - 1);

      const { error: updateError } = await supabase
        .from('suggestions')
        .update({ likes: newLikes })
        .eq('id', id);

      if (updateError) throw updateError;
      
      return newLikes;
    } catch (err: any) {
      console.error('Error updating likes:', err.message);
      return 0;
    }
  }

  async addComment(suggestionId: string, content: string, author: string): Promise<Comment> {
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      author,
      createdAt: Date.now()
    };

    const { data: current, error: fetchError } = await supabase
      .from('suggestions')
      .select('comments')
      .eq('id', suggestionId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    const updatedComments = [...(current?.comments || []), newComment];

    const { error: updateError } = await supabase
      .from('suggestions')
      .update({ comments: updatedComments })
      .eq('id', suggestionId);

    if (updateError) {
      throw new Error(updateError.message);
    }
    return newComment;
  }

  async incrementViews(id: string): Promise<void> {
    try {
      const { data: current, error: fetchError } = await supabase
        .from('suggestions')
        .select('views')
        .eq('id', id)
        .single();

      if (fetchError) return;

      await supabase
        .from('suggestions')
        .update({ views: (current?.views || 0) + 1 })
        .eq('id', id);
    } catch (err: any) {
      console.debug('Silent view increment fail:', err.message);
    }
  }
}

export const api = new SupabaseServer();
