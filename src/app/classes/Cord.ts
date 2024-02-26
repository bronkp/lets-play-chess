import Piece from "./Piece";

export default class Cord {
    x: number;
    y: number;
    tileColor: string;
    pieceColor: string;
    piece:  Piece;
    highlighted: Boolean;
    constructor(tileColor: string,piece: Piece,pieceColor:string,x: number,y: number){
      this.x = x;
      this.y = y;
      this.tileColor = tileColor;
      this.piece = piece
      this.highlighted = false;
      this.pieceColor = pieceColor;
    }
    getPossibleMoves(board:Cord[][]){
      let getMoves = this.piece.getRules()
      return getMoves(this.pieceColor,this.x,this.y,board)
      
    }
  }