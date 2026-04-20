import { LucideIcon } from "lucide-react";
import { ReactElement } from "react";

import { SectionId } from "store/settingsDialog/settingsDialog.store.types";

export interface SettingsDialogProps {
  children: ReactElement;
}

export interface Section {
  id: SectionId;
  icon: LucideIcon;
}
