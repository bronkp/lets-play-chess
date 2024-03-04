import _ from "lodash";
import { simpleMove } from "./simpleMove";
import { isCheck } from "./isCheck";
import { KingStore } from "../types/types";
import Cord from "@/app/classes/Cord";

export function castleMoves(
    boardCopy: Cord[][],
    pieceColor: string,
    tile: Cord,
    king: KingStore,
    castleCon: any
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
        checkSearch = simpleMove(
            checkSearch,
            checkSearch[tile.y][tile.x],
            checkSearch[tile.y][tile.x - 1],
        );
        let check = isCheck(
          checkSearch,
          pieceColor,
          checkSearch[tile.y][tile.x - 1]
        );
        if (!check) {
          let checkSearch = _.cloneDeep(boardCopy);
          checkSearch = simpleMove(
              checkSearch,
              checkSearch[tile.y][tile.x],
              checkSearch[tile.y][tile.x - 2],
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
        checkSearch = simpleMove(
            checkSearch,
            checkSearch[tile.y][tile.x],
            checkSearch[tile.y][tile.x + 1],
        );
        let check = isCheck(
          checkSearch,
          pieceColor,
          checkSearch[tile.y][tile.x + 1]
        );
        if (!check) {
          let checkSearch = _.cloneDeep(boardCopy);
          checkSearch =simpleMove(
              checkSearch,
              checkSearch[tile.y][tile.x],
              checkSearch[tile.y][tile.x + 2],
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