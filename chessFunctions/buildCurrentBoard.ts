import Cord from "@/app/classes/Cord";
import { makeBoard } from "./makeBoard";
import * as r from "../src/app/ruleset/ruleset";
import _ from "lodash";
import { BoardInfo, KingStore, Move } from "../types/types";
import { isCheck } from "./isCheck";
import { forceComplexMove } from './forceComplexMove';

export function buildCurrentBoard(moves: Move[]) {
  let board = makeBoard();
  let postBoardBuildDetails;
  let whiteKing = {
    cords: new Cord("dark", r.King, "white", 4, 7),
    check: false,
  };
  let blackKing = {
    cords: new Cord("light", r.King, "black", 4, 0),
    check: false,
  };
  let castleConditions = {
    black: { left: true, king: true, right: true },
    white: { left: true, king: true, right: true },
  };
  if (moves.length) {
    for (let i = 0; i < moves.length; i++) {
      let move = moves[i];
      let movedPiece = board[move.start.y][move.start.x];
      if (movedPiece.piece.name == "King") {
        castleConditions[
          movedPiece.pieceColor as keyof typeof castleConditions
        ].king = false;
      } else if (movedPiece.piece.name == "Rook") {
        if (movedPiece.x == 0) {
          castleConditions[
            movedPiece.pieceColor as keyof typeof castleConditions
          ].left = false;
        } else if (movedPiece.x == 7) {
          castleConditions[
            movedPiece.pieceColor as keyof typeof castleConditions
          ].right = false;
        }
      }

      postBoardBuildDetails = forceComplexMove(
        _.cloneDeep(board),
        move,
        whiteKing,
        blackKing
      );
      board = postBoardBuildDetails.board;
      let isWhite = movedPiece.pieceColor == "white" ? true : false;
      let moveIsKing = movedPiece.piece.name == "King";
      let endCord = board[move.end.y][move.end.x];
      let check = isCheck(board, "white", whiteKing.cords);
      check ? (whiteKing.check = true) : (whiteKing.check = false);
      check = isCheck(board, "black", blackKing.cords);
      check ? (blackKing.check = true) : (blackKing.check = false);
      if (moveIsKing) {
        if (isWhite) {
          let check = isCheck(board, "white", endCord);
          check ? (whiteKing.check = true) : (whiteKing.check = false);
          postBoardBuildDetails.whiteKing.cords = endCord;
        } else {
          let check = isCheck(board, "black", endCord);
          check ? (blackKing.check = true) : (blackKing.check = false);
          postBoardBuildDetails.blackKing.cords = endCord;
        }
      }
    }
  } else {
    postBoardBuildDetails = {
      board: board,
      whiteKing: whiteKing,
      blackKing: blackKing,
      pawnToEnPassant: null,
    };
  }
  return { postBoardBuildDetails, castleConditions };
}

