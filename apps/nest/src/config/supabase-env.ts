export const resolveSupabaseUrl = (): string | undefined => {
  const u =
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  return u || undefined;
};

export const resolveSupabaseAnonKey = (): string | undefined => {
  const k =
    process.env.SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return k || undefined;
};

export const isSupabaseAuthConfigured = (): boolean =>
  Boolean(resolveSupabaseUrl() && resolveSupabaseAnonKey());
