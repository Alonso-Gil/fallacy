export interface RoomSessionState {
  roomId: string | null;
  token: string | null;
  userId: string | null;
  role: "host" | "guest" | null;
  sfuEnabled: boolean;
}

export interface RoomSessionStoreValues {
  session: RoomSessionState;
  setSession: (session: RoomSessionState) => void;
  clearSession: () => void;
}
