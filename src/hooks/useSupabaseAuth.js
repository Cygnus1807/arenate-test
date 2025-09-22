import { useCallback, useEffect, useState } from 'react';
import supabase from '../utils/supabase';

export const useSupabaseAuth = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const usingMock = !supabase;

  useEffect(() => {
    let mounted = true;

    if (!supabase) {
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    const initialise = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;
      if (error) {
        setAuthError(error.message);
      }
      setSession(data?.session ?? null);
      setLoading(false);
    };

    initialise();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signInWithEmail = useCallback(async ({ email, password }) => {
    if (!supabase) {
      return { error: new Error('Supabase is not configured.') };
    }
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
    }
    return { error };
  }, []);

  const signUpWithEmail = useCallback(async ({ email, password }) => {
    if (!supabase) {
      return { error: new Error('Supabase is not configured.') };
    }
    setAuthError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setAuthError(error.message);
    }
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) {
      return { error: new Error('Supabase is not configured.') };
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAuthError(error.message);
    }
    return { error };
  }, []);

  return {
    session,
    loading,
    authError,
    usingMock,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };
};
