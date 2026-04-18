// Auth store
import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { getStoreSetState } from "utils/common.utils";
import { defaultValues } from "./auth.store.helpers";
import { AuthStoreValues } from "./auth.store.types";

export const useAuthStore = create<AuthStoreValues>()(
  devtools(
    (set, get) => {
      const store: AuthStoreValues = {
        ...defaultValues,
        setUser: payload => {
          const prev = get().user;
          const user = getStoreSetState(payload, prev);
          set({ user }, false, {
            type: "setUser",
            payload
          });
        },
        reset: () => set({ ...defaultValues }, false, { type: "reset" })
      };
      return store;
    },
    { name: "Auth Store" }
  )
);
