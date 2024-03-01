//original function on single player board
//very similar copy found in chess functions now, may delete

// function castle(boardCopy: Cord[][], direction: string) {
//     if (direction == "left") {
//       boardCopy = movePiece(
//         boardCopy[hiPiece!.y][hiPiece!.x - 1],
//         boardCopy,
//         boardCopy[hiPiece!.y][hiPiece!.x - 4]
//       );
//     } else {
//       boardCopy = movePiece(
//         boardCopy[hiPiece!.y][hiPiece!.x + 1],
//         boardCopy,
//         boardCopy[hiPiece!.y][hiPiece!.x + 3]
//       );
//     }
//     return boardCopy;
//   }