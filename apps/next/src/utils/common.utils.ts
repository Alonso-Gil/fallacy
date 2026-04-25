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

export const shouldMockByFlag = (flag: string | undefined): boolean =>
  flag === "true";

export const waitForMockLatency = async (latencyMs: number): Promise<void> => {
  await new Promise(resolve => {
    setTimeout(resolve, latencyMs);
  });
};

export const getBaseUrlFromEnv = (url: string | undefined): string | null => {
  const value = url?.trim();
  return value && value.length > 0 ? value.replace(/\/$/, "") : null;
};

export const buildAuthHeaders = (
  accessToken?: string
): Record<string, string> => {
  if (!accessToken) {
    return { "Content-Type": "application/json" };
  }
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json"
  };
};
