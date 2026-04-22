import { User } from "@supabase/supabase-js";

import { StoreSetState } from "types/common.types";

export interface AuthStoreValues {
  user: User | null;
  sessionResolved: boolean;
  setUser: StoreSetState<User | null>;
  reset: () => void;
}
