import Cord from "@/app/classes/Cord";
import * as r from "../src/app/ruleset/ruleset"
export function simpleMove( boardCopy: Cord[][], start: Cord,end: Cord) {
    boardCopy[end.y][end.x].piece = start!.piece;
    boardCopy[end.y][end.x].pieceColor = start!.pieceColor;
    boardCopy[start!.y][start!.x].piece = r.None;
    boardCopy[start!.y][start!.x].pieceColor = "None";

    return boardCopy;
  }