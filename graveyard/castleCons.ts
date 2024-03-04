//online board castleMoves
// function castleMoves(
//     boardCopy: Cord[][],
//     pieceColor: string,
//     tile: Cord,
//     king: KingStore
//   ) {
//     //setting color variable
//     let side = castleCon[pieceColor as keyof typeof castleCon];
//     //Castle cannot occur if in check or if king has moved
//     if (king.check || !side.king) return [];
//     //moves to be returned
//     let moves = [];
//     //left rook hasnt moved yet
//     if (side.left) {
//       //both tiles must be empty
//       if (
//         boardCopy[tile.y][tile.x - 1].piece.name == "None" &&
//         boardCopy[tile.y][tile.x - 2].piece.name == "None"
//       ) {
//         //king not allowed to move through a check when moving double spaces, first checks for check
//         //in one move then two
//         let checkSearch = _.cloneDeep(boardCopy);
//         checkSearch = movePiece(
//           checkSearch[tile.y][tile.x - 1],
//           checkSearch,
//           checkSearch[tile.y][tile.x]
//         );
//         let check = isCheck(
//           checkSearch,
//           pieceColor,
//           checkSearch[tile.y][tile.x - 1]
//         );
//         if (!check) {
//           let checkSearch = _.cloneDeep(boardCopy);
//           checkSearch = movePiece(
//             checkSearch[tile.y][tile.x - 2],
//             checkSearch,
//             checkSearch[tile.y][tile.x]
//           );
//           check = isCheck(
//             checkSearch,
//             pieceColor,
//             checkSearch[tile.y][tile.x - 2]
//           );
//         }
//         //if both cases pass as not checking the king
//         !check && moves.push({ x: tile.x - 2, y: tile.y });
//       }
//     }
//     //right rook hasnt moved yet
//     if (side.right) {
//       //both tiles must be empty
//       if (
//         boardCopy[tile.y][tile.x + 1].piece.name == "None" &&
//         boardCopy[tile.y][tile.x + 2].piece.name == "None"
//       ) {
//         //king not allowed to move through a check when moving double spaces, first checks for check
//         //in one move then two
//         let checkSearch = _.cloneDeep(boardCopy);
//         checkSearch = movePiece(
//           checkSearch[tile.y][tile.x + 1],
//           checkSearch,
//           checkSearch[tile.y][tile.x]
//         );
//         let check = isCheck(
//           checkSearch,
//           pieceColor,
//           checkSearch[tile.y][tile.x + 1]
//         );
//         if (!check) {
//           let checkSearch = _.cloneDeep(boardCopy);
//           checkSearch = movePiece(
//             checkSearch[tile.y][tile.x + 2],
//             checkSearch,
//             checkSearch[tile.y][tile.x]
//           );
//           check = isCheck(
//             checkSearch,
//             pieceColor,
//             checkSearch[tile.y][tile.x + 2]
//           );
//         }
//         //if both cases pass as not checking the king
//         !check && moves.push({ x: tile.x + 2, y: tile.y });
//       }
//     }

//     return moves;
//   }

//server castleMoves
// function castleMoves(
//     boardCopy: Cord[][],
//     pieceColor: string,
//     tile: Cord,
//     king: KingStore,
//     castleCon: any
//   ) {
//     //setting color variable
//     let side = castleCon[pieceColor as keyof typeof castleCon];
//     //Castle cannot occur if in check or if king has moved
//     if (king.check || !side.king) return [];
//     //moves to be returned
//     let moves = [];
//     //left rook hasnt moved yet
//     if (side.left) {
//       //both tiles must be empty
//       if (
//         boardCopy[tile.y][tile.x - 1].piece.name == "None" &&
//         boardCopy[tile.y][tile.x - 2].piece.name == "None"
//       ) {
//         //king not allowed to move through a check when moving double spaces, first checks for check
//         //in one move then two
//         let checkSearch = _.cloneDeep(boardCopy);
//         checkSearch = movePiece(
//           checkSearch[tile.y][tile.x - 1],
//           checkSearch,
//           checkSearch[tile.y][tile.x]
//         );
//         let check = isCheck(
//           checkSearch,
//           pieceColor,
//           checkSearch[tile.y][tile.x - 1]
//         );
//         if (!check) {
//           let checkSearch = _.cloneDeep(boardCopy);
//           checkSearch = movePiece(
//             checkSearch[tile.y][tile.x - 2],
//             checkSearch,
//             checkSearch[tile.y][tile.x]
//           );
//           check = isCheck(
//             checkSearch,
//             pieceColor,
//             checkSearch[tile.y][tile.x - 2]
//           );
//         }
//         //if both cases pass as not checking the king
//         !check && moves.push({ x: tile.x - 2, y: tile.y });
//       }
//     }
//     //right rook hasnt moved yet
//     if (side.right) {
//       //both tiles must be empty
//       if (
//         boardCopy[tile.y][tile.x + 1].piece.name == "None" &&
//         boardCopy[tile.y][tile.x + 2].piece.name == "None"
//       ) {
//         //king not allowed to move through a check when moving double spaces, first checks for check
//         //in one move then two
//         let checkSearch = _.cloneDeep(boardCopy);
//         checkSearch = movePiece(
//           checkSearch[tile.y][tile.x + 1],
//           checkSearch,
//           checkSearch[tile.y][tile.x]
//         );
//         let check = isCheck(
//           checkSearch,
//           pieceColor,
//           checkSearch[tile.y][tile.x + 1]
//         );
//         if (!check) {
//           let checkSearch = _.cloneDeep(boardCopy);
//           checkSearch = movePiece(
//             checkSearch[tile.y][tile.x + 2],
//             checkSearch,
//             checkSearch[tile.y][tile.x]
//           );
//           check = isCheck(
//             checkSearch,
//             pieceColor,
//             checkSearch[tile.y][tile.x + 2]
//           );
//         }
//         //if both cases pass as not checking the king
//         !check && moves.push({ x: tile.x + 2, y: tile.y });
//       }
//     }
  
//     return moves;
//   }