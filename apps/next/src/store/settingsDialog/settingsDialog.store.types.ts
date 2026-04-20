import { StoreSetState } from "types/common.types";

export type SectionId =
  | "appearance"
  | "language"
  | "notifications"
  | "privacy"
  | "security"
  | "account";

export interface SettingsDialogStoreValues {
  isOpen: boolean;
  selectedSetting: SectionId;
  setIsOpen: StoreSetState<boolean>;
  setSelectedSetting: StoreSetState<SectionId>;
  reset: () => void;
}
