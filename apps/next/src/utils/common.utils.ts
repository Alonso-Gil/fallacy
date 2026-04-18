// Common utility functions
import { StorePreviousValue, StoreSetState } from "types/common.types";

export const getStoreSetState = <T = unknown>(
  payload: Parameters<StoreSetState<T>>[0],
  prev: T
): T => {
  let nextValue: T;
  if (typeof payload === "function") {
    nextValue = (payload as StorePreviousValue<T>)(prev);
  } else {
    nextValue = payload;
  }
  return nextValue;
};
