import { useCallback, useEffect, useState } from 'react';
import { createCommunityPost, deleteCommunityPost, fetchCommunityPosts } from '../services/communityRepository';

export const useCommunityPosts = ({ eventId, userId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(Boolean(eventId));
  const [error, setError] = useState(null);
  const [posting, setPosting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadPosts = useCallback(async () => {
    if (!eventId) {
      setPosts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await fetchCommunityPosts({ eventId });
    if (fetchError) {
      setError(fetchError.message ?? 'Unable to load community posts.');
      setPosts([]);
    } else {
      setPosts(data);
    }
    setLoading(false);
  }, [eventId]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const addPost = useCallback(
    async (content) => {
      if (!eventId || !userId) {
        return { error: new Error('You must be signed in to post.') };
      }
      const trimmed = content.trim();
      if (!trimmed) {
        return { error: new Error('Post cannot be empty.') };
      }
      if (trimmed.length > 500) {
        return { error: new Error('Post must be 500 characters or fewer.') };
      }
      setPosting(true);
      setError(null);
      const { error: createError } = await createCommunityPost({ eventId, authorId: userId, content: trimmed });
      if (createError) {
        setError(createError.message ?? 'Unable to publish post.');
        setPosting(false);
        return { error: createError };
      }
      await loadPosts();
      setPosting(false);
      return { error: null };
    },
    [eventId, userId, loadPosts],
  );

  const removePost = useCallback(
    async (postId) => {
      if (!postId || !userId) {
        return { error: new Error('Missing post or user.') };
      }
      setDeleting(true);
      const { error: deleteError } = await deleteCommunityPost({ postId, authorId: userId });
      if (deleteError) {
        setError(deleteError.message ?? 'Unable to delete post.');
        setDeleting(false);
        return { error: deleteError };
      }
      await loadPosts();
      setDeleting(false);
      return { error: null };
    },
    [userId, loadPosts],
  );

  return {
    posts,
    loading,
    error,
    posting,
    deleting,
    addPost,
    removePost,
    refresh: loadPosts,
  };
};
