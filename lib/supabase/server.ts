import { cookies } from "next/headers";
import {
  createServerComponentClient,
  createRouteHandlerClient,
} from "@supabase/auth-helpers-nextjs";

import type { Database } from "./types";

export function createServerSupabaseClient() {
  return createServerComponentClient<Database>({
    cookies: () => cookies(),
  });
}

export function createRouteSupabaseClient() {
  return createRouteHandlerClient<Database>({
    cookies: () => cookies(),
  });
}
