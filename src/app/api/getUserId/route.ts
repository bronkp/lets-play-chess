import { CookieOptions, createServerClient } from '@supabase/ssr';
import { randomUUID } from 'crypto';
import { uniqueId } from 'lodash';
import { cookies, headers } from 'next/headers';
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
    let game_id = headers().get('game_id')
    let session_id 
    let color
      let data = await supabase.from("Players").select().eq("id",game_id)
      let game = data.data![0]
        if(game.white&&game.black){
    return Response.json({error:"both ids exist"})

        }
        else if(!game.white){
            session_id =randomUUID()

            let data = await supabase.from("Players").update({white:session_id}).eq("id",game_id)
            color = "white"
            console.log('userdata',data)
        }else{
            session_id =randomUUID()
            let data = await supabase.from("Players").update({black:session_id}).eq("id",game_id)
            color = "black"
        }

     
    return Response.json({id:session_id, color:color})
  }