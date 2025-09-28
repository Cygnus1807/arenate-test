import { useEffect, useState } from 'react';

const LoginPage = ({
  onSubmit,
  onSignUp,
  loading = false,
  error,
  mockMode = false,
  successMessage,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [mode, setMode] = useState('signin');

  useEffect(() => {
    if (successMessage) {
      setMode('signin');
    }
  }, [successMessage]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    if (!email || !password) {
      setFormError('Enter both email and password.');
      return;
    }
    if (mode === 'signin') {
      await onSubmit({ email, password });
    } else {
      await onSignUp({ email, password });
    }
  };

  const disabled = loading || mockMode;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-gray-800">
          {mode === 'signin' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {mode === 'signin'
            ? 'Sign in to manage Hillside Engineering College events.'
            : 'Join the campus events network in just a few steps.'}
        </p>
        {mockMode && (
          <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
            Supabase credentials are missing, so authentication is disabled.
          </div>
        )}
        {error && !mockMode && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}
        {successMessage && mode === 'signin' && (
          <div className="mt-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            {successMessage}
          </div>
        )}
        {formError && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</div>
        )}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              autoComplete="email"
              disabled={disabled}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="password">
              {mode === 'signin' ? 'Password' : 'Create password'}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              disabled={disabled}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={disabled}
            className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? mode === 'signin'
                ? 'Signing in…'
                : 'Creating account…'
              : mode === 'signin'
              ? 'Sign in'
              : 'Sign up'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          {mode === 'signin' ? (
            <button
              type="button"
              className="font-semibold text-green-600 hover:text-green-700"
              onClick={() => setMode('signup')}
              disabled={mockMode}
            >
              Need an account? Sign up
            </button>
          ) : (
            <button
              type="button"
              className="font-semibold text-green-600 hover:text-green-700"
              onClick={() => setMode('signin')}
              disabled={mockMode}
            >
              Have an account? Sign in
            </button>
          )}
        </div>
        <p className="mt-6 text-xs text-gray-400">
          Use Supabase Auth email/password credentials. Add students from the Supabase dashboard or let them sign up here.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
