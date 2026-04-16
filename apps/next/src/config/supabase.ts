export const getSupabasePublicKey = (): string | undefined =>
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
  undefined;

export const isSupabaseConfigured = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = getSupabasePublicKey();
  return Boolean(url && key);
};
