import { CookieOptions, createServerClient } from "@supabase/ssr";
import { randomUUID } from "crypto";
import { uniqueId } from "lodash";
import { cookies, headers } from "next/headers";
import { useSearchParams } from "next/navigation";
import { NextRequest } from "next/server";
export async function GET(req: NextRequest) {
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
  const authHeader = req.headers.get('authorization');
  if(authHeader!=process.env.CRON_KEY ){
  return Response.json({ error: "incorrect key" });
  }
  let yesterday = new Date(
    new Date().setDate(new Date().getDate() - 1)
  ).toISOString();
  let data = await supabase
    .from("Sessions")
    .delete()
    .lte("created_at", yesterday);
  return Response.json({ message: "cleared" });
}
