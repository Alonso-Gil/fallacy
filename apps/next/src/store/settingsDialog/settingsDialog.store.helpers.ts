import { StoreInitialValues } from "types/common.types";
import { SettingsDialogStoreValues } from "./settingsDialog.store.types";

export const defaultValues: StoreInitialValues<SettingsDialogStoreValues> = {
  isOpen: false,
  selectedSetting: "appearance"
};
