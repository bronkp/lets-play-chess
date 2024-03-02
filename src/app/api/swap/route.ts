import { CookieOptions, createServerClient } from '@supabase/ssr';
import { randomUUID } from 'crypto';
import { uniqueId } from 'lodash';
import { cookies, headers } from 'next/headers';
import { NextRequest } from 'next/server';
export async function POST(req:  NextRequest) {
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
    const body = await req.json()
    const game_id = body.game_id
    const userId = body.userId
    const userData = await supabase.from("Players").select().eq("id",game_id)

    const original = await supabase.from("Sessions").select().eq("id",game_id)
    const originalData = original?.data?.[0]
    const owner = userData.data?.[0]!.owner
    let ownerColor = originalData.owner
    if(owner!=userId){
        return Response.json({error:"You are not owner of this session."})
    }
    if(ownerColor=="white"){
        let data = await supabase.from("Sessions").update({owner:"black",guest:"white"}).eq("id",game_id)
        return Response.json({owner:"black"})
    
    }else{
        let data = await supabase.from("Sessions").update({owner:"white",guest:"black"}).eq("id",game_id)
        
        return Response.json({owner:"white"})
    }
    
  }