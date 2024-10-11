// AppParameters store types

import { AppParameters, StoreSetState } from "@/types/common.types";

export interface AppParametersStoreValues {
  appParameters: AppParameters | null;
  setAppParameters: StoreSetState<AppParameters | null>;
  reset: () => void;
}
