import Cord from "@/app/classes/Cord";
import * as r from "../src/app/ruleset/ruleset"
export function tryEnPassant(board: Cord[][], start: Cord, end: Cord) {
    let diagonalMove = end.x != start.x;
    let takeEmpty = end.piece.name == "None";
    if (diagonalMove && takeEmpty) {
      board[start.y][end.x].piece = r.None;
    }
    return board;
  }