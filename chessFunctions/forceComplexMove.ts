import Cord from "@/app/classes/Cord";
import { KingStore, Move } from "../types/types";
import { tryEnPassant } from "./tryEnPassant";
import { simpleMove } from "./simpleMove";
import _ from "lodash";
import { tryCastle } from "./tryCastle";
import * as r from "../src/app/ruleset/ruleset";
import { isCheck } from "./isCheck";
export function forceComplexMove(
  board: Cord[][],
  move: Move,
  whiteKing: KingStore,
  blackKing: KingStore
) {
  let movedPieceColor = board[move.start.y][move.start.x].pieceColor
  let movedPieceName = board[move.start.y][move.start.x].piece.name
  let start = board[move.start.y][move.start.x];
  let end = board[move.end.y][move.end.x];
  let pieceName = start.piece.name;
  if (pieceName == "Pawn") {
    board = tryEnPassant(_.cloneDeep(board), start, end);
  }
  if (pieceName == "King") {
    board = tryCastle(_.cloneDeep(board), start, end);
  }
  board = simpleMove(_.cloneDeep(board), start, end);
  //Pawn to Upgrade
  if (move.upgrade) {
    board[move.end.y][move.end.x].piece = r[move.upgrade as keyof typeof r];
  }
  let pawnToEnPassant = null;
  if (pieceName == "Pawn") {
    let moveTwice = start.y - end.y == 2 || start.y - end.y == -2;
    if (moveTwice) {
      pawnToEnPassant = board[end.y][end.x];
    }
  }
  let isWhite = movedPieceColor == "white" ? true : false;
  let moveIsKing = movedPieceName == "King";
  let endCord = board[move.end.y][move.end.x];
  let check = isCheck(board, "white", whiteKing.cords);
  check ? (whiteKing.check = true) : (whiteKing.check = false);
  check = isCheck(board, "black", blackKing.cords);
  check ? (blackKing.check = true) : (blackKing.check = false);
  if (moveIsKing) {
    if (isWhite) {
      let check = isCheck(board, "white", endCord);
      check ? (whiteKing.check = true) : (whiteKing.check = false);
      whiteKing.cords = endCord;
    } else {
      let check = isCheck(board, "black", endCord);
      check ? (blackKing.check = true) : (blackKing.check = false);
      blackKing.cords = endCord;
    }
  }

  return {
    board: board,
    whiteKing: whiteKing,
    blackKing: blackKing,
    pawnToEnPassant: pawnToEnPassant,
  };
}
