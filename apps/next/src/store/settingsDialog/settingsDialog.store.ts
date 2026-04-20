import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { getStoreSetState } from "utils/common.utils";
import { defaultValues } from "./settingsDialog.store.helpers";
import { SettingsDialogStoreValues } from "./settingsDialog.store.types";

export const useSettingsDialogStore = create<SettingsDialogStoreValues>()(
  devtools(
    (set, get) => {
      const store: SettingsDialogStoreValues = {
        ...defaultValues,
        setIsOpen: payload => {
          const prev = get().isOpen;
          const isOpen = getStoreSetState(payload, prev);
          set({ isOpen }, false, {
            type: "setIsOpen",
            payload
          });
        },
        setSelectedSetting: payload => {
          const prev = get().selectedSetting;
          const selectedSetting = getStoreSetState(payload, prev);
          set({ selectedSetting }, false, {
            type: "setSelectedSetting",
            payload
          });
        },
        reset: () => set({ ...defaultValues }, false, { type: "reset" })
      };
      return store;
    },
    { name: "Settings Dialog Store" }
  )
);
