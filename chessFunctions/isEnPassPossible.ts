import Cord from "@/app/classes/Cord";

export function isEnPassPossible(start: Cord, pawnToEnPassant: Cord|null|undefined) {
    if(pawnToEnPassant == null||pawnToEnPassant==undefined){
        return false
    }
    if (
      start.piece.name == "Pawn" &&
      pawnToEnPassant.pieceColor != start.pieceColor &&
      start.y == (start.pieceColor == "white" ? 3 : 4) &&
      (start.x == pawnToEnPassant.x - 1 || start.x == pawnToEnPassant.x + 1)
    ) {
      return true;
    }
    return false;
  }
  