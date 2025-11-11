import { cookies } from "next/headers";
import {
  createRouteHandlerClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";

import type { Database } from "./types";

export function createServerSupabaseClient() {
  return createServerComponentClient<Database>({ cookies });
}

export function createRouteSupabaseClient() {
  return createRouteHandlerClient<Database>({ cookies });
}
