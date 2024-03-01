import Cord from "@/app/classes/Cord";
import * as r from "../src/app/ruleset/ruleset"
import _ from "lodash";
import { isCheck } from "./isCheck";
import { Move } from "../types/types";
type MoveCord = {
    x: number;
    y: number;
  };
  type BoardInfo={
    
      
            board: Cord[][];
            whiteKing: KingStore;
            blackKing: KingStore;
            pawnToEnPassant: Cord;
            
        
  
}

  type CastleConditions={
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
  }
  type KingStore = {
    cords: Cord;
    check: Boolean;
  };
export function isMoveLegal(boardInfo:BoardInfo,turn:string,move:Move,castleConditions:CastleConditions){
  let whiteKing = boardInfo.whiteKing
  let blackKing = boardInfo.blackKing
  let board = boardInfo.board
  let pawnToEnPassant = boardInfo.pawnToEnPassant
  let start= board[move.start.y][move.start.x]
  let clickedRowIndex = start.y;
  let clickedTileIndex = start.x;
  //gets the possible moves from the cord object
  let isPawn = start.piece.name == "Pawn"
  let end = start.pieceColor=="white"?0:7  
  if(isPawn&&move.end.y==end&&move.upgrade==null){
    return false
  }else if(isPawn&&move.end.y==end){
    let validUpgrades = ["Queen","Bishop","Rook","Knight"]
    if(!validUpgrades.includes(move.upgrade as string)){
      return false
    }
  }
  let possible = board![clickedRowIndex][
    clickedTileIndex
  ].getPossibleMoves(board!);
  //checking en passant possibility
    if (isEnPassPossible({ ...start } as Cord,pawnToEnPassant)) {
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

    for(let i = 0; i<possible.length;i++){
        let possibleMove = possible[i]
        if(possibleMove.x == move.end.x&&possibleMove.y==move.end.y){
            return true
        }
    }


    return false;


}


function isEnPassPossible(start: Cord,pawnToEnPassant: Cord) {
    if (
      start.piece.name == "Pawn" &&
      pawnToEnPassant &&
      pawnToEnPassant.pieceColor != start.pieceColor &&
      start.y == (start.pieceColor == "white" ? 3 : 4) &&
      (start.x == pawnToEnPassant.x - 1 || start.x == pawnToEnPassant.x + 1)
    ) {
      return true;
    }
    return false;
  }


function castleMoves(
    boardCopy: Cord[][],
    pieceColor: string,
    tile: Cord,
    king: KingStore,
    castleCon:any,
  ) {
    //setting color variable
    let side = castleCon[pieceColor as keyof typeof castleCon];
    //Castle cannot occur if in check or if king has moved
    if (king.check || !side.king) return [];
    //moves to be returned
    let moves = [];
    //left rook hasnt moved yet
    if (side.left) {
      //both tiles must be empty
      if (
        boardCopy[tile.y][tile.x - 1].piece.name == "None" &&
        boardCopy[tile.y][tile.x - 2].piece.name == "None"
      ) {
        //king not allowed to move through a check when moving double spaces, first checks for check
        //in one move then two
        let checkSearch = _.cloneDeep(boardCopy);
        checkSearch = movePiece(
          checkSearch[tile.y][tile.x - 1],
          checkSearch,
          checkSearch[tile.y][tile.x]
        );
        let check = isCheck(
          checkSearch,
          pieceColor,
          checkSearch[tile.y][tile.x - 1]
        );
        if (!check) {
          let checkSearch = _.cloneDeep(boardCopy);
          checkSearch = movePiece(
            checkSearch[tile.y][tile.x - 2],
            checkSearch,
            checkSearch[tile.y][tile.x]
          );
          check = isCheck(
            checkSearch,
            pieceColor,
            checkSearch[tile.y][tile.x - 2]
          );
        }
        //if both cases pass as not checking the king
        !check && moves.push({ x: tile.x - 2, y: tile.y });
      }
    }
    //right rook hasnt moved yet
    if (side.right) {
      //both tiles must be empty
      if (
        boardCopy[tile.y][tile.x + 1].piece.name == "None" &&
        boardCopy[tile.y][tile.x + 2].piece.name == "None"
      ) {
        //king not allowed to move through a check when moving double spaces, first checks for check
        //in one move then two
        let checkSearch = _.cloneDeep(boardCopy);
        checkSearch = movePiece(
          checkSearch[tile.y][tile.x + 1],
          checkSearch,
          checkSearch[tile.y][tile.x]
        );
        let check = isCheck(
          checkSearch,
          pieceColor,
          checkSearch[tile.y][tile.x + 1]
        );
        if (!check) {
          let checkSearch = _.cloneDeep(boardCopy);
          checkSearch = movePiece(
            checkSearch[tile.y][tile.x + 2],
            checkSearch,
            checkSearch[tile.y][tile.x]
          );
          check = isCheck(
            checkSearch,
            pieceColor,
            checkSearch[tile.y][tile.x + 2]
          );
        }
        //if both cases pass as not checking the king
        !check && moves.push({ x: tile.x + 2, y: tile.y });
      }
    }

    return moves;
}


function movePiece(tile: Cord, boardCopy: Cord[][], moved: Cord) {
        boardCopy[tile.y][tile.x].piece = moved!.piece;
        boardCopy[tile.y][tile.x].pieceColor = moved!.pieceColor;
        boardCopy[moved!.y][moved!.x].piece = r.None;
        boardCopy[moved!.y][moved!.x].pieceColor = "None";
    
        return boardCopy;
      }
    