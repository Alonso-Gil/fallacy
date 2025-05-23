// AppParameters store types

import { AppParameters } from "@fallacy/types";

import { StoreSetState } from "types/common.types";

export interface AppParametersStoreValues {
  appParameters: AppParameters | undefined;
  setAppParameters: StoreSetState<AppParameters | undefined>;
  reset: () => void;
}
