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
    
    const sessionData = await supabase.from("Players").select().eq("id",game_id)
    if(!sessionData.data){
        return Response.json({error:"No session"})
    }
    let ownerId = sessionData.data[0].owner
    let guestId = sessionData.data[0].guest
    if(!ownerId||!guestId){
        return Response.json({error:"Missing a player"})
    }
    if(ownerId!=userId){
        return Response.json({error:"You are not the owner of this session"})
    }   
    else{
        let res = await supabase.from("Sessions").update({started:true}).eq("id",game_id)
        return  Response.json({message:"Success"})
    }
  }