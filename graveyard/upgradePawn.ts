//original pawn upgrade
// function upgradePawn(piece: string) {
//     let boardCopy = _.cloneDeep(realBoard!);
//     boardCopy[pawnToUpgrade!.y][pawnToUpgrade!.x].piece =
//       r[piece as keyof typeof r];
//     setRealBoard(boardCopy);
//     setPawnToUpgrade(null);
//     kingVerify(boardCopy, whtKing, blkKing);
//   }