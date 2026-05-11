import { create } from "zustand";

import type { RoomSessionStoreValues } from "./roomSession.store.types";

const defaultSession = {
  roomId: null,
  token: null,
  userId: null,
  role: null,
  sfuEnabled: false
};

export const useRoomSessionStore = create<RoomSessionStoreValues>()(set => ({
  session: defaultSession,
  setSession: session => set({ session }),
  clearSession: () => set({ session: defaultSession })
}));
