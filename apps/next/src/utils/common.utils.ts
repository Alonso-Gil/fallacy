// Common utility functions
import { StorePreviousValue, StoreSetState } from "types/common.types";

export const getStoreSetState = <T = unknown>(
  payload: Parameters<StoreSetState<T>>[0],
  prev: T
): T => {
  let selectedBillingData: StorePreviousValue<T> | T;
  if (typeof payload === "function") {
    selectedBillingData = (payload as StorePreviousValue<T>)(prev);
  } else {
    selectedBillingData = payload;
  }
  return selectedBillingData;
};
