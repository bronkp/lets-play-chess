import Cord from "@/app/classes/Cord";
import * as r from "../src/app/ruleset/ruleset"
import { Move, MoveCord } from "../types/types";
export function isCheck(boardCopy: Cord[][], pieceColor: string, king: Cord) {
    let queenMoves = r.Queen.getRules();
    let moves = queenMoves(pieceColor, king.x, king.y, boardCopy);
    let knightMoves = r.Knight.getRules();
    moves = [...moves, ...knightMoves(pieceColor, king.x, king.y, boardCopy)];
    let check = false;
    for (let i = 0; i < moves.length; i++) {
      let search = boardCopy[moves[i].y][moves[i].x] as Cord;
      //if piece isnt blank and of the opposite color
      if (search.piece.name != "None" && search.pieceColor != pieceColor) {
        //gets enemy moves
        let enemyMoves = search.getPossibleMoves(boardCopy);
        //checks if piece has a move to take the king and returns true or false
        check = enemyMoves.some((x: MoveCord) => {
          if (x.x == king.x && x.y == king.y) {
            return true;
          }
          return false;
        });
      }
      if (check == true) return true;
    }
    return check;
  }