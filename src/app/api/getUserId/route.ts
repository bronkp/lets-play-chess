import { CookieOptions, createServerClient } from "@supabase/ssr";
import { randomUUID } from "crypto";
import { uniqueId } from "lodash";
import { cookies, headers } from "next/headers";
import { NextRequest } from "next/server";
export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SERVICE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );
  const body = await req.json();
  let game_id = body!.game_id;
  let session_id;
  let color;
  let role;
  let data = await supabase.from("Players").select().eq("id", game_id);
  let game = data.data![0];
  let isOwner = false
  if (game.owner && game.guest) {
    return Response.json({ error: "both ids exist" });
  } else if (!game.owner) {
    session_id = randomUUID();
    isOwner = true
    let data = await supabase
      .from("Players")
      .update({ owner: session_id })
      .eq("id", game_id);
    role = "owner";
  } else {
    session_id = randomUUID();
    let data = await supabase
      .from("Players")
      .update({ guest: session_id })
      .eq("id", game_id);
    let ready = await supabase
      .from("Sessions")
      .update({ game_ready: true })
      .eq("id", game_id);
    role = "guest";
  }
  if(isOwner){
    if(game.white=="owner"){
      color = "white"
    }else{
      color = "black"
    }
  }else{
    if(game.white!="owner"){
      color = "white"
    }else{
      color = "black"
    }
  }
 
  return Response.json({ id: session_id, role: role, color: color });
}
