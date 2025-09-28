import { useCallback, useEffect, useState } from 'react';
import supabase from '../utils/supabase';

const PROFILE_TABLE = 'profiles';

const mapToViewModel = (row) =>
  row
    ? {
        id: row.id,
        email: row.email ?? '',
        fullName: row.full_name ?? '',
        department: row.department ?? '',
        graduationYear: row.graduation_year ?? '',
        phone: row.phone ?? '',
        interests: row.interests ?? '',
        bio: row.bio ?? '',
        updatedAt: row.updated_at ?? null,
        createdAt: row.created_at ?? null,
      }
    : null;

export const useUserProfile = (user) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(!!user);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(async () => {
    if (!supabase || !user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from(PROFILE_TABLE)
      .select('id, email, full_name, department, graduation_year, phone, interests, bio, updated_at, created_at')
      .eq('id', user.id)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      setError(error.message);
    }
    setProfile(mapToViewModel(data));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const saveProfile = useCallback(
    async (values) => {
      if (!supabase || !user) {
        return { error: new Error('Supabase unavailable or user missing.') };
      }
      const payload = {
        id: user.id,
        email: user.email,
        full_name: values.fullName ?? null,
        department: values.department ?? null,
        graduation_year: values.graduationYear ? Number(values.graduationYear) : null,
        phone: values.phone ?? null,
        interests: values.interests ?? null,
        bio: values.bio ?? null,
        updated_at: new Date().toISOString(),
      };
      const { data, error } = await supabase
        .from(PROFILE_TABLE)
        .upsert(payload, { onConflict: 'id' })
        .select('id, email, full_name, department, graduation_year, phone, interests, bio, updated_at, created_at')
        .maybeSingle();
      if (!error) {
        setProfile(mapToViewModel(data ?? { ...payload, created_at: profile?.createdAt ?? null }));
      }
      return { error };
    },
    [user, profile],
  );

  return {
    profile,
    loading,
    error,
    saveProfile,
    refresh: loadProfile,
  };
};
