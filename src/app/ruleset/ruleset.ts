import Cord from "../classes/Cord";
import Piece from "../classes/Piece";

const Pawn = new Piece(
  (pieceColor: string, x: number, y: number, board: Cord[][]) => {
    let moves = [];
    let search = pieceColor == "white" ? -1 : 1;
    //out of bound top or bottom
    if (y + search > 7 || y + search < 0) return [];
    //left search
    if (
      x - 1 >= 0 &&
      board[y + search][x - 1]?.piece.name != "None" &&
      board[y + search][x - 1]?.pieceColor != pieceColor
    ) {
      moves.push({ x: x - 1, y: y + search });
    }
    //right search
    if (
      x + 1 <= 7 &&
      board[y + search][x + 1].piece.name != "None" &&
      board[y + search][x + 1]?.pieceColor != pieceColor
    ) {
      moves.push({ x: x + 1, y: y + search });
    }
    if (board[y + search][x].piece.name == "None") {
      moves.push({ x: x, y: y + search });
      //double move if pawn in starting position
      if (y==(pieceColor=="white"?6:1)&&board[y + search*2][x].piece.name == "None") {
        moves.push({ x: x, y: y + search*2 });
      }
    }



    return moves;
  },
  "Pawn"
);
const Bishop = new Piece(
  (pieceColor: string, x: number, y: number, board: Cord[][]) => {
    //sub function the checks if you hit a piece to halt directional search
    //returns a boolean for whether it hits and the coordinate if it should be added to moves
    //if hits piece and not same color should add to list then stop
    function checkHit(searchX: number, searchY: number) {
      let search = board[searchY][searchX];
      let cont = true;
      let res;
      if (search.piece.name != "None") {
        cont = false;
        if (search.pieceColor != pieceColor) {
          res = { x: searchX, y: searchY };
        }
      } else {
        res = { x: searchX, y: searchY };
      }
      return { res, cont };
    }

    let moves = [];
    let searchX = x + 1;
    let searchY = y - 1;
    //up right search
    while (true) {
      if (searchY < 0 || searchX > 7) {
        break;
      }
      let { res, cont } = checkHit(searchX, searchY);
      res && moves.push(res);
      searchX++;
      searchY--;
      if (!cont) {
        break;
      }
    }
    //up left search
    searchX = x - 1;
    searchY = y - 1;
    while (true) {
      if (searchY < 0 || searchX < 0) {
        break;
      }
      let { res, cont } = checkHit(searchX, searchY);
      res && moves.push(res);
      searchX--;
      searchY--;
      if (!cont) {
        break;
      }
    }
    //down right
    searchX = x + 1;
    searchY = y + 1;
    while (true) {
      if (searchY > 7 || searchX > 7) {
        break;
      }
      let { res, cont } = checkHit(searchX, searchY);
      res && moves.push(res);
      searchX++;
      searchY++;
      if (!cont) {
        break;
      }
    }

    //down left
    searchX = x - 1;
    searchY = y + 1;
    while (true) {
      if (searchY > 7 || searchX < 0) {
        break;
      }
      let { res, cont } = checkHit(searchX, searchY);
      res && moves.push(res);
      searchX--;
      searchY++;
      if (!cont) {
        break;
      }
    }

    return moves;
  },
  "Bishop"
);
const Knight = new Piece(
  (pieceColor: string, x: number, y: number, board: Cord[][]) => {
    let moves = [
      { x: x - 1, y: y - 2 },
      { x: x - 1, y: y + 2 },
      { x: x - 2, y: y + 1 },
      { x: x - 2, y: y - 1 },
      { x: x + 2, y: y - 1 },
      { x: x + 2, y: y + 1 },
      { x: x + 1, y: y - 2 },
      { x: x + 1, y: y + 2 },
    ];
    moves = moves.filter((i) => {
      try {
        let search = board[i.y][i.x];
        if (search.piece.name == "None" || search.pieceColor != pieceColor) {
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    });
    return moves;
  },
  "Knight"
);
const Rook = new Piece(
  (pieceColor: string, x: number, y: number, board: Cord[][]) => {
    let moves = [];
    //down search
    for (let search = y + 1; search < 8; search++) {
      let tile = board[search][x];
      if (tile.piece.name != None.name) {
        //checking if piece is of another color for take
        tile.pieceColor != pieceColor && moves.push({ x: x, y: search });
        break;
      } else {
        moves.push({ x: x, y: search });
      }
    }
    //up search
    for (let search = y - 1; search >= 0; search--) {
      let tile = board[search][x];
      if (tile.piece.name != None.name) {
        //checking if piece is of another color for take
        tile.pieceColor != pieceColor && moves.push({ x: x, y: search });
        break;
      } else {
        moves.push({ x: x, y: search });
      }
    }

    //right search
    for (let search = x + 1; search < 8; search++) {
      let tile = board[y][search];
      if (tile.piece.name != None.name) {
        //checking if piece is of another color for take
        tile.pieceColor != pieceColor && moves.push({ x: search, y: y });
        break;
      } else {
        moves.push({ x: search, y: y });
      }
    }
    //left search
    for (let search = x - 1; search >= 0; search--) {
      let tile = board[y][search];
      if (tile.piece.name != None.name) {
        //checking if piece is of another color for take
        tile.pieceColor != pieceColor && moves.push({ x: search, y: y });
        break;
      } else {
        moves.push({ x: search, y: y });
      }
    }
    return moves;
  },
  "Rook"
);
const Queen = new Piece(
  (pieceColor: string, x: number, y: number, board: Cord[][]) => {
    let rookMoves = Rook.rules(pieceColor, x, y, board);
    let bishopMoves = Bishop.rules(pieceColor, x, y, board);
    return [...rookMoves, ...bishopMoves];
  },
  "Queen"
);
const King = new Piece(
  (pieceColor: string, x: number, y: number, board: Cord[][]) => {
    let moves = [];
    for (let i = 0; i < 3; i++) {
      for (let w = 0; w < 3; w++) {
        try {
          let search = board[y - 1 + i][x - 1 + w];
          if (search.piece.name == "None" || search.pieceColor != pieceColor) {
            moves.push({ x: x - 1 + w, y: y - 1 + i });
          }
        } catch (error) {}
      }
    }
   // console.log('kingmoves',moves)
    return moves;
  },
  "King"
);
const None = new Piece(
  (pieceColor: string, x: number, y: number, board: Cord[][]) => {
    return ["abc"];
  },
  "None"
);
export { Pawn, Bishop, Knight, Rook, King, Queen, None };
