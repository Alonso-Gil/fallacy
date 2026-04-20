import { Bell, Languages, Lock, Palette, Shield, User } from "lucide-react";

import { Section } from "./SettingsDialog.types";

export const SETTINGS_SECTIONS: Section[] = [
  { id: "appearance", icon: Palette },
  { id: "language", icon: Languages },
  { id: "notifications", icon: Bell },
  { id: "privacy", icon: Shield },
  { id: "security", icon: Lock },
  { id: "account", icon: User }
];
