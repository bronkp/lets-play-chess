import Cord from "./Cord";

export default class Board {
    board: Cord[][];
    turn: string;
    constructor(cordinates:Cord[][]){
      this.board = cordinates;
      this.turn = "white";
    }
    onClick(cord:Cord){
      //if not highlighted piece
      //TODO: CHECK THAT PIECE IS TURN COLOR
      this.#highlightMoves(cord)
    }
    #highlightMoves(cord:Cord){
      
      let moves = cord.getPossibleMoves(this.board)
      for(let i=0;i<moves.length;i++){
        //set cord highlights to true
      }
    }}