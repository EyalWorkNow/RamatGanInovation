
import { useState, useEffect, useCallback } from 'react';
import { Suggestion, SuggestionCategory, SuggestionType, Comment } from './types';
import { api } from './api';

const LIKED_KEY = 'ramat_gan_user_liked_ids_v3';
const VISITOR_ID_KEY = 'ramat_gan_visitor_id';

export const useSuggestions = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [userLikedIds, setUserLikedIds] = useState<string[]>([]);
  const [visitorId, setVisitorId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.fetchSuggestions();
      if (result.error) {
        setError(result.error);
      } else {
        setSuggestions(result.data || []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch suggestions");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let vid = localStorage.getItem(VISITOR_ID_KEY);
    if (!vid) {
      vid = Math.floor(1000 + Math.random() * 9000).toString();
      localStorage.setItem(VISITOR_ID_KEY, vid);
    }
    setVisitorId(vid);

    const likedSaved = localStorage.getItem(LIKED_KEY);
    if (likedSaved) {
      setUserLikedIds(JSON.parse(likedSaved));
    }

    loadData();
  }, [loadData]);

  const addSuggestion = async (title: string, problem: string, solution: string, impact: string, category: SuggestionCategory, type: SuggestionType) => {
    setIsSyncing(true);
    try {
      const newPost = await api.createSuggestion({
        title, problem, solution, impact, category, type,
        author: `סטודנט #${visitorId}`
      });
      setSuggestions(prev => [newPost, ...prev]);
    } catch (err: any) {
      console.error("Add suggestion failed", err);
      throw err;
    } finally {
      setIsSyncing(false);
    }
  };

  const likeSuggestion = async (id: string) => {
    const hasLiked = userLikedIds.includes(id);
    let newLikedIds = hasLiked 
      ? userLikedIds.filter(likedId => likedId !== id)
      : [...userLikedIds, id];
    
    setUserLikedIds(newLikedIds);
    localStorage.setItem(LIKED_KEY, JSON.stringify(newLikedIds));

    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, likes: hasLiked ? s.likes - 1 : s.likes + 1 } : s));
    await api.likeSuggestion(id, !hasLiked);
  };

  const addComment = async (suggestionId: string, content: string) => {
    setIsSyncing(true);
    try {
      const newComment = await api.addComment(suggestionId, content, `סטודנט #${visitorId}`);
      setSuggestions(prev => prev.map(s => s.id === suggestionId ? { ...s, comments: [...(s.comments || []), newComment] } : s));
    } catch (err: any) {
      console.error("Add comment failed", err);
      throw err;
    } finally {
      setIsSyncing(false);
    }
  };

  const incrementViews = (id: string) => {
    api.incrementViews(id);
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, views: s.views + 1 } : s));
  };

  return { 
    suggestions, 
    userLikedIds, 
    visitorId, 
    isLoading, 
    isSyncing,
    error,
    addSuggestion, 
    likeSuggestion, 
    addComment, 
    incrementViews,
    refresh: loadData
  };
};
