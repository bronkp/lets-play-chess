import Cord from "@/app/classes/Cord";

export type MoveCord = {
    x: number;
    y: number;
  };
export type Move = {
    start: MoveCord;
    end: MoveCord;
    upgrade?:string;
  };
export type KingStore = {
    cords: Cord;
    check: Boolean;
  };
export type SupaBoard = {
  id:string;
  turn:string;
  moves:Move[];
  mate:string|null;
  game_ready:Boolean;
  started:Boolean;
 owner:string;
  guest:string;
}
export  type BoardInfo={
    
      
  board: Cord[][];
  whiteKing: KingStore;
  blackKing: KingStore;
  pawnToEnPassant: Cord;
  


}