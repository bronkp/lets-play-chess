import { CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { makeBoard } from "../../../../chessFunctions/makeBoard";
import { buildCurrentBoard } from "../../../../chessFunctions/buildCurrentBoard";
import { isMoveLegal } from "../../../../chessFunctions/isMoveLegal";
import { BoardInfo, Move } from "../../../../types/types";
import { isMate } from "../../../../chessFunctions/isMate";
import _ from "lodash";
import { isCheck } from "../../../../chessFunctions/isCheck";
import { forceComplexMove } from "../../../../chessFunctions/forceComplexMove";
import { NextRequest } from "next/server";
import { Blaka } from "next/font/google";
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
    let body =await  req.json()




  if (body.move == null) {
    return Response.json({ error: "no turn sent" });
  }
  let game_id = body.game_id;
  let move = JSON.parse(body.move);
  let user_id = body.userId;
  let entries = await supabase.from("Sessions").select().eq("id", game_id);
  if(!entries.data){
    return Response.json({ error: "No game of matching id found." })
  }
  let game_data = entries.data![0];
  if(!game_data.game_ready){
    return Response.json({ error: "Missing a player! Wait till they join" });

  }
  if(game_data.mate){
    return Response.json({ error: "game is over" });
  }
  let moves = game_data.moves;
  let turn = game_data.turn;
  let session_entries = await supabase
    .from("Players")
    .select()
    .eq("id", game_id);
    let session_info = session_entries.data![0];
    let isAPlayer = session_info.owner == user_id||session_info.guest == user_id
    if(!isAPlayer){
    return Response.json({ error: "You're not a player" });
    }
    let role = user_id==session_info.owner?"owner":"guest"
    if(game_data[role]!=game_data.turn){
      return Response.json({ error: "not your turn!" });
    }


  let {  postBoardBuildDetails, castleConditions } = buildCurrentBoard(moves);

  let board = postBoardBuildDetails?.board;
  let isPawn = board![move?.start.y][move?.start.x].piece.name == "Pawn";
  let end = board![move?.start.y][move?.start.x].pieceColor == "white" ? 0 : 7;
  let pawnToUpgrade;
  let isEnd = move.end.y == end;
  let upgrade = body.pawnUpgrade;
  if (isPawn && isEnd && upgrade == null) {
    return Response.json({ error: "Pawn move did not come with upgrade key" });
  } else if (isPawn && isEnd) {
    let validUpgrades = ["Queen", "Bishop", "Rook", "Knight"];
    if (!validUpgrades.includes(upgrade as string)) {
      return Response.json({ error: "Invalid Upgrade Key" });
    }

    move.upgrade = upgrade as string;
  }
  let legal = isMoveLegal(postBoardBuildDetails! as BoardInfo, turn, move, castleConditions);
  let mate = ""
  if (legal) {
    moves.push(move!);
    let postMove = forceComplexMove(_.cloneDeep(board!),move,postBoardBuildDetails?.whiteKing!,postBoardBuildDetails?.blackKing!)
    let whiteCheck = isCheck(_.cloneDeep(postMove.board!),"white",postBoardBuildDetails?.whiteKing.cords!)
    let blackCheck = isCheck(_.cloneDeep(postMove.board!),"black",postBoardBuildDetails?.blackKing.cords!)
    if(blackCheck){
      let checkMate = isMate(_.cloneDeep(postMove.board!),"black",_.cloneDeep(postBoardBuildDetails!.blackKing))
      if(checkMate){
        mate = "black"
    }}
    else if(whiteCheck){
      let checkMate = isMate(_.cloneDeep(postMove.board!),"white", _.cloneDeep(postBoardBuildDetails!.whiteKing))
      if(checkMate){
        mate = "white"

    }}
    let response = await supabase
      .from("Sessions")
      .update({ moves: moves, turn: turn == "white" ? "black" : "white", mate:mate})
      .eq("id", game_id);
  } else {
    return Response.json({
      error: "Move is not legal, if you believe this is a bug contact me.",
    });
  }

  return Response.json({ message: "success" });

  //let data = await supabase.from("Sessions").update({last_move:JSON.parse(move!)}).eq("id",game_id)
  let user = await supabase.from("Sessions");

  return Response.json({ message: game_data });
}
