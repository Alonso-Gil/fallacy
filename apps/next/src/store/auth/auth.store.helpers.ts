import { StoreInitialValues } from "types/common.types";
import { AuthStoreValues } from "./auth.store.types";

export const defaultValues: StoreInitialValues<AuthStoreValues> = {
  user: null,
  sessionResolved: false
};
