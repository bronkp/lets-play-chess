import { CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { makeBoard } from "../../../../chessFunctions/makeBoard";
import { buildCurrentBoard } from "../../../../chessFunctions/buildCurrentBoard";
import { isMoveLegal } from "../../../../chessFunctions/isMoveLegal";
import { NextRequest } from "next/server";
type GamePayLoad = {
  game_id:string
}
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
  const data:GamePayLoad = await req.json()  
  let game_id = data!.game_id
  let entries = await supabase.from("Sessions").select().eq("id", game_id);
  let game_data = entries.data![0];
  let moves = game_data.moves;
  let turn = game_data.turn;
  let board;
  let whiteKing;
  let blackKing;
  let pawnToEnPassant
  let castleCons
  if (moves) {
    let { postBoardBuildDetails, castleConditions } = buildCurrentBoard(moves);
    board = postBoardBuildDetails?.board;
    whiteKing = postBoardBuildDetails?.whiteKing;
    blackKing = postBoardBuildDetails?.blackKing;
    castleCons = castleConditions
    pawnToEnPassant = postBoardBuildDetails?.pawnToEnPassant
  }
  return Response.json({
    board: board,
    turn: turn,
    whiteKing: whiteKing,
    blackKing: blackKing,
    moves: moves,
    game_ready: game_data.game_ready,
    castleConditions:castleCons,
    pawnToEnPassant:pawnToEnPassant,
    started: game_data.started,
    owner_color:game_data.owner,
    mate:game_data?.mate
  });
}
