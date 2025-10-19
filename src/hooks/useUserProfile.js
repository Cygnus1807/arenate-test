import { useCallback, useEffect, useState } from 'react';
import supabase from '../utils/supabase';

const PROFILE_TABLE = 'profiles';

const EXTENDED_COLUMNS = [
  'id',
  'email',
  'full_name',
  'department',
  'graduation_year',
  'phone',
  'interests',
  'bio',
  'college_unique_id',
  'college_email',
  'updated_at',
  'created_at',
];

const BASE_COLUMNS = EXTENDED_COLUMNS.filter((column) => !['college_unique_id', 'college_email'].includes(column));

const columnsToSelect = (useExtended) => (useExtended ? EXTENDED_COLUMNS : BASE_COLUMNS).join(', ');

const isMissingColumnError = (error) => error?.code === '42703';

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
        collegeId: row.college_unique_id ?? '',
        collegeEmail: row.college_email ?? '',
        updatedAt: row.updated_at ?? null,
        createdAt: row.created_at ?? null,
      }
    : null;

const mapValuesToViewModel = (values = {}, user) => ({
  id: user?.id ?? null,
  email: user?.email ?? '',
  fullName: values.fullName ?? '',
  department: values.department ?? '',
  graduationYear: values.graduationYear ?? '',
  phone: values.phone ?? '',
  interests: values.interests ?? '',
  bio: values.bio ?? '',
  collegeId: values.collegeId ?? '',
  collegeEmail: values.collegeEmail ?? '',
  updatedAt: new Date().toISOString(),
  createdAt: null,
});

export const useUserProfile = (user) => {
  const usingMock = !supabase;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(!!user);
  const [error, setError] = useState(null);
  const [supportsExtendedProfile, setSupportsExtendedProfile] = useState(true);

  const loadProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    if (usingMock) {
      setProfile((current) => current ?? mapValuesToViewModel({}, user));
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const desiredColumns = columnsToSelect(supportsExtendedProfile);
    const { data, error: selectError } = await supabase
      .from(PROFILE_TABLE)
      .select(desiredColumns)
      .eq('id', user.id)
      .maybeSingle();

    if (selectError) {
      if (supportsExtendedProfile && isMissingColumnError(selectError)) {
        setSupportsExtendedProfile(false);
        const fallback = await supabase
          .from(PROFILE_TABLE)
          .select(columnsToSelect(false))
          .eq('id', user.id)
          .maybeSingle();
        if (fallback.error && fallback.error.code !== 'PGRST116') {
          setError(fallback.error.message);
        }
        setProfile(mapToViewModel(fallback.data));
        setLoading(false);
        return;
      }
      if (selectError.code !== 'PGRST116') {
        setError(selectError.message);
      }
      setProfile(null);
      setLoading(false);
      return;
    }

    setProfile(mapToViewModel(data));
    setLoading(false);
  }, [user, supportsExtendedProfile, usingMock]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const saveProfile = useCallback(
    async (values) => {
      if (!user) {
        return { error: new Error('Supabase unavailable or user missing.') };
      }

      if (usingMock) {
        setProfile(mapValuesToViewModel(values, user));
        return { error: null };
      }
      const basePayload = {
        id: user.id,
        email: user.email,
        full_name: values.fullName ?? null,
        department: values.department ?? null,
        graduation_year: values.graduationYear ? Number(values.graduationYear) : null,
        phone: values.phone ?? null,
        interests: values.interests ?? null,
        bio: values.bio ?? null,
        college_unique_id: values.collegeId ?? null,
        college_email: values.collegeEmail ?? null,
        updated_at: new Date().toISOString(),
      };

      const composePayload = (useExtended) => {
        if (useExtended) {
          return basePayload;
        }
        // eslint-disable-next-line no-unused-vars
        const { college_unique_id, college_email, ...rest } = basePayload;
        return rest;
      };

      const attemptSave = async (useExtended) =>
        supabase
          .from(PROFILE_TABLE)
          .upsert(composePayload(useExtended), { onConflict: 'id' })
          .select(columnsToSelect(useExtended))
          .maybeSingle();

      const { data, error } = await attemptSave(supportsExtendedProfile);

      if (error) {
        if (supportsExtendedProfile && isMissingColumnError(error)) {
          setSupportsExtendedProfile(false);
          const fallback = await attemptSave(false);
          if (fallback.error) {
            return { error: fallback.error };
          }
          setProfile(
            mapToViewModel(
              fallback.data ?? {
                ...composePayload(false),
                created_at: profile?.createdAt ?? null,
              },
            ),
          );
          return { error: null };
        }
        return { error };
      }

      setProfile(
        mapToViewModel(
          data ?? {
            ...composePayload(supportsExtendedProfile),
            created_at: profile?.createdAt ?? null,
          },
        ),
      );
      return { error: null };
    },
    [user, profile, supportsExtendedProfile, usingMock],
  );

  return {
    profile,
    loading,
    error,
    saveProfile,
    refresh: loadProfile,
  };
};
