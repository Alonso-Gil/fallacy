// Auth store
import { getStoreSetState } from "utils/common.utils";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { defaultValues } from "./appParameters.store.helpers";
import { AppParametersStoreValues } from "./appParameters.store.types";

export const useAppParametersStore = create<AppParametersStoreValues>()(
  devtools(
    (set, get) => {
      const store: AppParametersStoreValues = {
        ...defaultValues,
        setAppParameters: payload => {
          const prev = get().appParameters;
          const appParameters = getStoreSetState(payload, prev);
          set({ appParameters }, false, {
            type: "setAppParameters",
            payload
          });
        },
        reset: () => set({ ...defaultValues }, false, { type: "reset" })
      };
      return store;
    },
    { name: "AppParameters Store" }
  )
);
