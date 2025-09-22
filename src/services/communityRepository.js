import supabase from '../utils/supabase';

const POST_FIELDS = 'id, event_id, author_id, content, created_at, updated_at, author:profiles(full_name)';

const ensureClient = () => {
  if (!supabase) {
    throw new Error('Supabase client is not configured.');
  }
};

export const fetchCommunityPosts = async ({ eventId }) => {
  try {
    ensureClient();
  } catch (clientError) {
    return { data: [], error: clientError };
  }

  const { data, error } = await supabase
    .from('community_posts')
    .select(POST_FIELDS)
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  return { data: data ?? [], error };
};

export const createCommunityPost = async ({ eventId, authorId, content }) => {
  try {
    ensureClient();
  } catch (clientError) {
    return { error: clientError };
  }

  const payload = {
    event_id: eventId,
    author_id: authorId,
    content,
  };

  const { data, error } = await supabase
    .from('community_posts')
    .insert(payload)
    .select(POST_FIELDS)
    .single();

  return { data, error };
};

export const deleteCommunityPost = async ({ postId, authorId }) => {
  try {
    ensureClient();
  } catch (clientError) {
    return { error: clientError };
  }

  const { error } = await supabase
    .from('community_posts')
    .delete()
    .eq('id', postId)
    .eq('author_id', authorId);

  return { error };
};
