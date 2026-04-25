"use client";
import { useCallback } from "react";

import {
  type AccessTokenResult,
  getClientAccessToken
} from "lib/auth/getClientAccessToken";

export type { AccessTokenResult };

const useAccessToken = () => {
  const getAccessToken = useCallback(() => getClientAccessToken(), []);

  return { getAccessToken };
};

export default useAccessToken;
