import Cord from "@/app/classes/Cord";
import { makeBoard } from "./makeBoard";
import * as r from "../src/app/ruleset/ruleset";
import _ from "lodash";
import Board from "@/app/components/Board";
import { KingStore, Move } from "../types/types";
import { isCheck } from "./isCheck";

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

      postBoardBuildDetails = forceMove(
        _.cloneDeep(board),
        move,
        whiteKing,
        blackKing
      );
      board = postBoardBuildDetails.board;
      let isWhite = movedPiece.pieceColor == "white" ? true : false;
      let moveIsKing = movedPiece.piece.name == "King";
      let endCord = board[move.end.y][move.end.x]
      let check = isCheck(board, "white", whiteKing.cords);
      check ? (whiteKing.check = true) : (whiteKing.check = false);
      check = isCheck(board, "black", blackKing.cords);
      check ? (blackKing.check = true) : (blackKing.check = false);

      if (moveIsKing) {
        if (isWhite) {
          let check = isCheck(board, "white", endCord);
          check ? (whiteKing.check = true) : (whiteKing.check = false);
          postBoardBuildDetails.whiteKing.cords = endCord
        } else {
          let check = isCheck(board, "white", endCord);
          check ? (blackKing.check = true) : (whiteKing.check = false);
          postBoardBuildDetails.blackKing.cords = endCord

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
  return {  postBoardBuildDetails, castleConditions };
}
function forceMove(
  board: Cord[][],
  move: Move,
  whiteKing: KingStore,
  blackKing: KingStore
) {
  let start = board[move.start.y][move.start.x];
  let end = board[move.end.y][move.end.x];
  let pieceName = start.piece.name;
  if (pieceName == "Pawn") {
    board = tryEnPassant(_.cloneDeep(board), start, end);
  }
  if (pieceName == "King") {
    board = tryCastle(_.cloneDeep(board), start, end);
  }
  board = movePiece(_.cloneDeep(board), start, end);
  //Pawn to Upgrade
  if (move.upgrade) {
    board[move.end.y][move.end.x].piece = r[move.upgrade as keyof typeof r];
  }
  let pawnToEnPassant = null;
  return {
    board: board,
    whiteKing: whiteKing,
    blackKing: blackKing,
    pawnToEnPassant: pawnToEnPassant,
  };
}
function clickHighlighted(boardCopy: Cord[][], tile: Cord, hiPiece: Cord) {}

function tryCastle(board: Cord[][], start: Cord, end: Cord) {
  if (start.x - end.x == 2 || end.x - start.x == 2) {
    let direction = start.x - end.x == 2 ? "left" : "right";
    if (direction == "left") {
      board = movePiece(
        _.cloneDeep(board),
        board[start!.y][start!.x - 4],
        board[start!.y][start!.x - 1]
      );
    } else {
      board = movePiece(
        _.cloneDeep(board),
        board[start!.y][start!.x + 3],
        board[start!.y][start!.x + 1]
      );
    }
  }
  return board;
}
function tryEnPassant(board: Cord[][], start: Cord, end: Cord) {
  let diagonalMove = end.x != start.x;
  let takeEmpty = end.piece.name == "None";
  if (diagonalMove && takeEmpty) {
    board[start.y][end.x].piece = r.None;
  }
  return board;
}
function movePiece(board: Cord[][], start: Cord, end: Cord) {
  board[end.y][end.x].piece = start!.piece;
  board[end.y][end.x].pieceColor = start!.pieceColor;
  board[start!.y][start!.x].piece = r.None;
  board[start!.y][start!.x].pieceColor = "None";

  return board;
}
