/*
 * DEAD CODE — NOT IN USE
 *
 * useRoomRealtime was intended to bridge the RealtimeProvider context
 * to components that need Supabase Realtime channel access. It is unused
 * because the room page manages Supabase channels directly.
 *
 * Kept for reference if the RealtimeProvider pattern is revived.
 */
export const useRoomRealtime = () => {
  throw new Error(
    "useRoomRealtime is not implemented. The room page manages Realtime channels directly."
  );
};
