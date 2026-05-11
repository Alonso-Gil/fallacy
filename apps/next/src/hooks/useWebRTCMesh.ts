/*
 * DEAD CODE — NOT IN USE
 *
 * useWebRTCMesh was designed for P2P mesh signaling via DOM custom events
 * (webrtc:offer, webrtc:answer, webrtc:ice-candidate). The RealtimeProvider
 * dispatches these events but no consumer reads them because the room page
 * handles WebRTC signaling directly through Supabase Realtime channels.
 *
 * Kept for reference if a unified P2P signaling layer is needed in the future.
 */
export const useWebRTCMesh = () => {
  throw new Error(
    "useWebRTCMesh is not implemented. Use the room page inline P2P logic or Cloudflare SFU instead."
  );
};
