import { CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
export async function GET() {
    const cookieStore = cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SERVICE_KEY!,
        {
            cookies: {
              get(name: string) {
                return cookieStore.get(name)?.value
              },
              set(name: string, value: string, options: CookieOptions) {
                cookieStore.set({ name, value, ...options })
              },
              remove(name: string, options: CookieOptions) {
                cookieStore.set({ name, value: '', ...options })
              },
            },
          }
      )
      let data = await supabase.from("Sessions").insert({last_move:[]}).select()
     
    return Response.json({message:data!.data![0].id})
  }