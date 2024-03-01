//function originates from original single player board
//probably not necessary and single player board cause move to new function as well
//delete if found to be not needed
// function handleHighlightedClick(
//     boardCopy: Cord[][],
//     tile: Cord,
//     hiPiece: Cord
//   ) {
//     let clickedPieceName = tile.piece.name;
//     let whiteK = { ...whtKing };
//     let blackK = { ...blkKing };
//     let clickedTileIndex = tile.x;
//     let clickedRowIndex = tile.y;
//     let highlightedTileIndex = hiPiece?.x;
//     let highlightedRowIndex = hiPiece?.y;
//     let highlightedPieceColor = hiPiece?.pieceColor;
//     let highlightedPieceName = hiPiece?.piece.name;
//     let moveIsEnPassant =
//       clickedPieceName == "None" &&
//       clickedTileIndex != highlightedTileIndex &&
//       highlightedPieceName == "Pawn";
//     if (moveIsEnPassant) {
//       let enemyIndex =
//         clickedRowIndex + (highlightedPieceColor == "white" ? 1 : -1);
//       let enPassantPieceTakenCord = boardCopy[enemyIndex][clickedTileIndex];
//       enPassantPieceTakenCord.piece = r.None;
//     }
//     setPawntoEnPass(null);
//     if (highlightedPieceName == "King") {
//       let kingMovedTwoSpacesRight =
//         highlightedTileIndex! + 2 == clickedTileIndex;
//       let kingMovedTwoSpacesLeft =
//         highlightedTileIndex! - 2 == clickedTileIndex;
//       if (kingMovedTwoSpacesRight) {
//         boardCopy = castle(boardCopy, "right");
//       } else if (kingMovedTwoSpacesLeft) {
//         boardCopy = castle(boardCopy, "left");
//       }
//     }
//     boardCopy = movePiece(tile, boardCopy, hiPiece!);
//     let endIndex = highlightedPieceColor == "white" ? 0 : 7;
//     let pawnReachedEnd =
//       highlightedPieceName == "Pawn" && clickedRowIndex == endIndex;
//     let startIndex = highlightedPieceColor == "white" ? 6 : 1;
//     let doubleMoveIndex = highlightedPieceColor == "white" ? 4 : 3;
//     let pawnDoubleMoved =
//       highlightedPieceName == "Pawn" &&
//       clickedRowIndex == doubleMoveIndex &&
//       highlightedRowIndex == startIndex;
//     if (pawnReachedEnd) {
//       setPawnToUpgrade({
//         ...boardCopy[clickedRowIndex][clickedTileIndex],
//       } as Cord);
//     } else if (pawnDoubleMoved) {
//       setPawntoEnPass(boardCopy[clickedRowIndex][clickedTileIndex]);
//     } else if (highlightedPieceName == "Rook") {
//       updateRookState(highlightedTileIndex!, highlightedPieceColor!);
//     } else if (highlightedPieceName == "King") {
//       let clickedTile = boardCopy[clickedRowIndex][clickedTileIndex];
//       let update = updateKingState(
//         _.cloneDeep(whiteK),
//         _.cloneDeep(blackK),
//         clickedTile,
//         highlightedPieceColor!
//       );
//       whiteK = update.whiteK;
//       blackK = update.blackK;
//     }
//     let startPosition =
//       String.fromCharCode(97 + highlightedTileIndex!) +
//       (highlightedRowIndex! + 1);
//     let endPosition =
//       String.fromCharCode(97 + clickedTileIndex) + (clickedRowIndex + 1);
//     //end of move turn section
//     setHistory([
//       ...(history ? history : []),
//       `${startPosition} => ${endPosition}`,
//     ]);
//     setTurnState(!turnState);
//     boardCopy = clearHighlights(boardCopy);
//     kingVerify(boardCopy, whiteK, blackK);
//     setHiPiece(null);
//     setRealBoard(boardCopy);
//   }