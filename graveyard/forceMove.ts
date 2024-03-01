//should be identical for forceComplexMove, trying to consolidate shared functions
// function forceMove(
//     board: Cord[][],
//     move: Move,
//     whiteKing: KingStore,
//     blackKing: KingStore
//   ) {
//     let start = board[move.start.y][move.start.x];
//     let end = board[move.end.y][move.end.x];
//     let pieceName = start.piece.name;
//     if (pieceName == "Pawn") {
//       board = tryEnPassant(_.cloneDeep(board), start, end);
//     }
//     if (pieceName == "King") {
//       board = tryCastle(_.cloneDeep(board), start, end);
//     }
//     board = movePiece(_.cloneDeep(board), start, end);
//     //Pawn to Upgrade
//     if (move.upgrade) {
//       board[move.end.y][move.end.x].piece = r[move.upgrade as keyof typeof r];
//     }
//     let pawnToEnPassant = null;
  
//     if (pieceName == "Pawn") {
//       let moveTwice = start.y - end.y == 2 || start.y - end.y == -2;
//       if (moveTwice) {
//         pawnToEnPassant = board[end.y][end.x];
//       }
//     }
//     return {
//       board: board,
//       whiteKing: whiteKing,
//       blackKing: blackKing,
//       pawnToEnPassant: pawnToEnPassant,
//     } as BoardInfo;
//   }