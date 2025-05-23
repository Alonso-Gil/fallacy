import { AppParametersStoreValues } from "./appParameters.store.types";
import { StoreInitialValues } from "types/common.types";

export const defaultValues: StoreInitialValues<AppParametersStoreValues> = {
  appParameters: undefined,
  setAppParameters: () => {}
};
