import _ from 'lodash';
import { simpleMove } from './simpleMove';
import Cord from '@/app/classes/Cord';
export function tryCastle(board: Cord[][], start: Cord, end: Cord) {
    if (start.x - end.x == 2 || end.x - start.x == 2) {
      let direction = start.x - end.x == 2 ? "left" : "right";
      if (direction == "left") {
        board = simpleMove(
          _.cloneDeep(board),
          board[start!.y][start!.x - 4],
          board[start!.y][start!.x - 1]
        );
      } else {
        board = simpleMove(
          _.cloneDeep(board),
          board[start!.y][start!.x + 3],
          board[start!.y][start!.x + 1]
        );
      }
    }
    return board;
  }