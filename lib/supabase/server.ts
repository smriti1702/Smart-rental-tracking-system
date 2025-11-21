import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xxhjxfwqqlavimegvzgu.supabase.co"
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4aGp4ZndxcWxhdmltZWd2emd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNzg5MzQsImV4cCI6MjA3MTk1NDkzNH0.bzJFeUlr9PeJW-xj0a2WfoeQ-yPSdGKl8jlwIf_jW-E"

  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}
