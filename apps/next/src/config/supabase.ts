/**
 * Variables en `.env.local`: `NEXT_PUBLIC_SUPABASE_URL` y una clave pública
 * (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` recomendada, o `NEXT_PUBLIC_SUPABASE_ANON_KEY` legacy).
 *
 * @see https://supabase.com/docs/guides/api/api-keys
 */
export function getSupabasePublicKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    undefined
  );
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = getSupabasePublicKey();
  return Boolean(url && key);
}
