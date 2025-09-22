import { useState } from 'react';
import { formatDate } from '../../utils/formatDate';

const MAX_LENGTH = 500;

const CommunityPostsSection = ({
  posts,
  loading,
  error,
  onCreate,
  posting,
  canPost,
  currentUserId,
  onDelete,
  deleting,
}) => {
  const [draft, setDraft] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!onCreate) {
      return;
    }
    const { error: postError } = await onCreate(draft);
    if (!postError) {
      setDraft('');
    }
  };

  return (
    <section className="border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-4xl space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Community posts</h2>
            <p className="mt-2 text-sm text-gray-600">
              Share meetups, squad ideas, or resources with other participants.
            </p>
          </div>

          {canPost && (
            <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={3}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                placeholder="What do you want to tell the community?"
                disabled={posting}
                maxLength={MAX_LENGTH}
              />
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{draft.length}/{MAX_LENGTH}</span>
                <button
                  type="submit"
                  disabled={posting || draft.trim().length === 0}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {posting ? 'Posting...' : 'Post update'}
                </button>
              </div>
            </form>
          )}

          {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

          <div className="space-y-4">
            {loading ? (
              <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                Loading posts...
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-md border border-dashed border-gray-200 bg-white px-4 py-6 text-center text-sm text-gray-500">
                No posts yet. Be the first to start the conversation!
              </div>
            ) : (
              posts.map((post) => (
                <article key={post.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {post.author?.full_name || 'Community member'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(post.created_at, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {onDelete && currentUserId && post.author_id === currentUserId && (
                      <button
                        type="button"
                        onClick={() => onDelete(post.id)}
                        disabled={deleting}
                        className="rounded border border-gray-200 px-2 py-1 text-xs font-semibold text-gray-500 transition hover:border-red-400 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deleting ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                  </div>
                  <p className="mt-3 whitespace-pre-line text-sm text-gray-700">{post.content}</p>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityPostsSection;
