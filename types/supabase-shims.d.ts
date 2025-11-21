declare module "@supabase/ssr" {
  export const createBrowserClient: any
  export const createServerClient: any
}

declare module "next/headers" {
  export const cookies: any
}

declare var process: any


