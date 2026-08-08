import { type SetAllCookies } from "@supabase/ssr";
import { type NextResponse } from "next/server";

export const applySupabaseCookies = (
  response: NextResponse,
  cookiesToSet: Parameters<SetAllCookies>[0],
  headers?: Parameters<SetAllCookies>[1]
) => {
  cookiesToSet.forEach(({ name, value, options }) => {
    if (options) {
      response.cookies.set(name, value, options);
    } else {
      response.cookies.set(name, value);
    }
  });

  if (headers && typeof headers === "object") {
    Object.entries(headers).forEach(([key, value]) => {
      if (typeof value === "string") {
        response.headers.set(key, value);
      }
    });
  }
};
