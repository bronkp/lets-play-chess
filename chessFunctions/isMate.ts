import Cord from "@/app/classes/Cord";
import { KingStore } from "../types/types";
import _ from "lodash";
import { isCheck } from "./isCheck";
import { simpleMove } from "./simpleMove";
import * as r from "../src/app/ruleset/ruleset"
export function isMate(board: Cord[][],pieceColor: string,king: KingStore){
        //for rows on the board
        for (let row = 0; row < 8; row++) {
          //for each tile in a row
          for (let tile = 0; tile < 8; tile++) {
            //cordinate being checked
            let start = board![row][tile];
            //piece is of search color
            if (start.piece.name != "None" && start.pieceColor == pieceColor) {
              //all moves a piece could make
              let getMoves =r[
            board![start.y][start.x].piece
              .name as keyof typeof r
          ].getRules();
        
    
              let moves = getMoves(start.pieceColor, start.x, start.y, board);
              //for each move of possible moves
              for (let move = 0; move < moves.length; move++) {
                let copy = _.cloneDeep(board!);
                let moveTile = copy[moves[move].y][moves[move].x];
                //makes board for testing check
                copy = simpleMove(_.cloneDeep(copy),start,moveTile );
                //checks if king piece is being moved to give updated king cordinate
                let check = isCheck(
                  copy,
                  pieceColor,
                  start.piece.name == "King" ? moveTile : king.cords
                );
                if(!check){
                }
                if (!check) {
                  return false;
                }
              }
            }
          }
        }
        return true;
      
}