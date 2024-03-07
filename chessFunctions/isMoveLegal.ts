import Cord from "@/app/classes/Cord";
import * as r from "../src/app/ruleset/ruleset";
import _ from "lodash";
import { isCheck } from "./isCheck";
import { Move } from "../types/types";
import { forceComplexMove } from "./forceComplexMove";
import { simpleMove } from "./simpleMove";
import { castleMoves } from "./castleMoves";
import { isEnPassPossible } from "./isEnPassPossible";
type MoveCord = {
  x: number;
  y: number;
};
type BoardInfo = {
  board: Cord[][];
  whiteKing: KingStore;
  blackKing: KingStore;
  pawnToEnPassant: Cord;
};

type CastleConditions = {
  black: {
    left: boolean;
    king: boolean;
    right: boolean;
  };
  white: {
    left: boolean;
    king: boolean;
    right: boolean;
  };
};
type KingStore = {
  cords: Cord;
  check: Boolean;
};
export function isMoveLegal(
  boardInfo: BoardInfo,
  turn: string,
  move: Move,
  castleConditions: CastleConditions
) {
  let startCord = boardInfo.board[move.start.y][move.start.x]
  let endCord = boardInfo.board[move.end.y][move.end.x]
  //checking for put in check
  let fakeBoard = simpleMove(
    _.cloneDeep(boardInfo.board),
    startCord,
    endCord
    
  );
  let whiteKing = boardInfo.whiteKing;
  let blackKing = boardInfo.blackKing;
  let moveIsKing = boardInfo.board[move.start.y][move.start.x].piece.name == "King"
  let color = boardInfo.board[move.start.y][move.start.x].pieceColor
  let kingToSearch = moveIsKing?fakeBoard[endCord.y][endCord.x]:color=="white"?whiteKing.cords:blackKing.cords
  let putsInCheck = isCheck(fakeBoard,color, kingToSearch)
  if(putsInCheck){
    return false
  }
  let board = boardInfo.board;
  let pawnToEnPassant = boardInfo.pawnToEnPassant;
  let start = board[move.start.y][move.start.x];
  let clickedRowIndex = start.y;
  let clickedTileIndex = start.x;
  //gets the possible moves from the cord object
  let isPawn = start.piece.name == "Pawn";
  let end = start.pieceColor == "white" ? 0 : 7;
  if (isPawn && move.end.y == end && move.upgrade == null) {
    return false;
  } else if (isPawn && move.end.y == end) {
    let validUpgrades = ["Queen", "Bishop", "Rook", "Knight"];
    if (!validUpgrades.includes(move.upgrade as string)) {
      return false;
    }
  }
  let possible = board![clickedRowIndex][clickedTileIndex].getPossibleMoves(
    board!
  );
  //checking en passant possibility
  if (isEnPassPossible({ ...start } as Cord, pawnToEnPassant)) {
    //adds en passant to move list, changing y based on color
    possible.push({
      x: pawnToEnPassant?.x,
      y: pawnToEnPassant!.y + (start.pieceColor == "white" ? -1 : +1),
    });
  }
  if (start.piece.name == "King") {
    let moves = castleMoves(
      board,
      start.pieceColor,
      start,
      start.pieceColor == "white" ? whiteKing : blackKing,
      castleConditions
    );
    if (moves) {
      possible = [...possible, ...moves];
    }
  }

  //goes through each possible move and highlights them

  for (let i = 0; i < possible.length; i++) {
    let possibleMove = possible[i];
    if (possibleMove.x == move.end.x && possibleMove.y == move.end.y) {
      return true;
    }
  }

  return false;
}






