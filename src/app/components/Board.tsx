import React, { useEffect, useState } from "react";
import Cord from "../classes/Cord";
import * as r from "../ruleset/ruleset";
import styles from "../page.module.css";
import _ from "lodash";
import {
  FaChessBishop,
  FaChessKing,
  FaChessKnight,
  FaChessPawn,
  FaChessQueen,
  FaChessRook,
} from "react-icons/fa6";
type KingStore = {
  cords: Cord;
  check: Boolean;
};
type Move = {
  x: number;
  y: number;
};
const Board: React.FC = () => {
  const [realBoard, setRealBoard] = useState<Cord[][]>();
  const [hiPiece, setHiPiece] = useState<Cord | null>();
  const [turnState, setTurnState] = useState(true);
  const [pawnToUpgrade, setPawnToUpgrade] = useState<Cord | null>();
  const [pawnToEnPass, setPawntoEnPass] = useState<Cord | null>();
  const [history,setHistory] = useState<String[]>()
  const [blkKing, setBlkKing] = useState<KingStore>({
    cords: new Cord("light", r.King, "black", 4, 0),
    check: false,
  });
  const [castleCon, setCastleCon] = useState({
    black: { left: true, king: true, right: true },
    white: { left: true, king: true, right: true },
  });
  // const [turn, setTurn] = useState(true);
  const [whtKing, setWhtKing] = useState<KingStore>({
    cords: new Cord("light", r.King, "white", 4, 7),
    check: false,
  });
  const [debug, setDebug] =useState(false)
  const upgradeKey = {
    Bishop: <FaChessBishop />,
    Queen: <FaChessQueen />,
    Rook: <FaChessRook />,
    Knight: <FaChessKnight />,
  };
  function handleClick(tile: Cord) {
    if (pawnToUpgrade != null) {
      return;
    }
    //lets player deselect piece by clicking an empty spot
    if (!tile.highlighted) {
      if(tile.piece.name == "None"){
        let boardCopy = _.cloneDeep(realBoard!);
        clearHighlights(boardCopy);
        setRealBoard(boardCopy);
        return;
      }
      if(tile.pieceColor != (turnState?"white":"black")&&!debug){
        return;
      }
    }
    
    let boardCopy: Cord[][] = [...realBoard!];

    //needs seperate variable because we set new king cords and have to check them after in the same function
    let whiteK = { ...whtKing };
    let blackK = { ...blkKing };
    let x = tile.x;
    let y = tile.y;
    if (boardCopy[y][x].highlighted) {
      //checks that an en passant move has been played to remove backwards pawn. en passant should
      //have already been validated during highlight function
      if (
        boardCopy[y][x].piece.name == "None" &&
        boardCopy[y][x].x != hiPiece?.x &&
        hiPiece?.piece.name == "Pawn"
      ) {
        boardCopy[y + (hiPiece.pieceColor == "white" ? 1 : -1)][x].piece =
          r.None;
      }
      setPawntoEnPass(null);
      //checks if a castle move has been played to move the rook aswell
       if(hiPiece!.piece.name=="King"){
        if(hiPiece!.x+2==tile.x){
          boardCopy = castle(boardCopy,"right")
        }
        else if (hiPiece!.x-2==tile.x){
          boardCopy = castle(boardCopy,"left")
        }
       }
      boardCopy = movePiece(tile, boardCopy, hiPiece!);
      //checking for pawn reaching en
      if (
        hiPiece?.piece.name == "Pawn" &&
        tile.y == (hiPiece.pieceColor == "white" ? 0 : 7)
      ) {
        setPawnToUpgrade({ ...boardCopy[tile.y][tile.x] } as Cord);
      }
      //checking for pawn double move for possible en passant
      if (
        hiPiece?.piece.name == "Pawn" &&
        tile.y == (hiPiece.pieceColor == "white" ? 4 : 3)&&hiPiece.y == (hiPiece.pieceColor == "white" ? 6 : 1                                      )
      ) {
        setPawntoEnPass(boardCopy[y][x]);
      }
      //setting rook to moved for castling variable
      if(hiPiece?.piece.name == "Rook"){
        let x = hiPiece.x
        if (hiPiece.pieceColor == "black"&&(x==0||x==7)) {
          x==0&&setCastleCon({...castleCon,black:{...castleCon.black,left:false}})
          x==7&&setCastleCon({...castleCon,black:{...castleCon.black,right:false}})
        }
        else if(hiPiece.x==0||hiPiece.x==7) {
          x==0&&setCastleCon({...castleCon,white:{...castleCon.white,left:false}})
          x==7&&setCastleCon({...castleCon,white:{...castleCon.white,right:false}})
        }
      }
      else if (hiPiece?.piece.name == "King") {
        if (hiPiece.pieceColor == "black") {
          setBlkKing({
            ...blkKing,
            cords: { ...boardCopy[tile.y][tile.x] } as Cord,
          });
          blackK = {
            ...blkKing,
            cords: { ...boardCopy[tile.y][tile.x] } as Cord,
          };
          setCastleCon({...castleCon,black:{...castleCon.black,king:false}})
        }
        if (hiPiece.pieceColor == "white") {
          setWhtKing({
            ...whtKing,
            cords: { ...boardCopy[tile.y][tile.x] } as Cord,
          });
          whiteK = {
            ...whtKing,
            cords: { ...boardCopy[tile.y][tile.x] } as Cord,
          };
          setCastleCon({...castleCon,white:{...castleCon.white,king:false}})

        }
        //saves king cords for easy use when checking for mates
        setHiPiece(null);
      }
    //end of move turn section
     setHistory([...history?history:[],`${String.fromCharCode(97 + hiPiece!.x)+(hiPiece!.y+1)} => ${String.fromCharCode(97 + tile.x)+(tile.y+1)}`]) 
    setTurnState(!turnState)

      boardCopy = clearHighlights(boardCopy);
      kingVerify(boardCopy, whiteK, blackK);
      setHiPiece(null);
    } else if (boardCopy[y][x].piece.name == "None") {
      return;
    } else {
      boardCopy = clearHighlights(boardCopy);
      setHiPiece({ ...tile } as Cord);
      //gets the possible moves from the cord object
      let possible = boardCopy![y][x].getPossibleMoves(boardCopy!);
      //checking en passant possibility
      if (isEnPassPossible({ ...tile } as Cord)) {
        //adds en passant to move list, changing y based on color
        possible.push({
          x: pawnToEnPass?.x,
          y: pawnToEnPass!.y + (tile.pieceColor == "white" ? -1 : +1),
        });
      }
      if(tile.piece.name=="King"){
        let moves = castleMoves(boardCopy,tile.pieceColor,tile,tile.pieceColor=="white"?whtKing:blkKing)
        console.log(moves)
        if(moves){
         possible = [...possible, ...moves]}
      }

      //goes through each possible move and highlights them
      boardCopy = highlightPieces(
        possible,
        boardCopy,
        tile?.pieceColor == "white" ? whtKing : blkKing,
        { ...tile } as Cord
      );
    }
    setRealBoard(boardCopy);
  }
  //checks for check mates and checks for red highlighting and winning the game
  function kingVerify(
    boardCopy: Cord[][],
    whiteKing: KingStore,
    blackKing: KingStore
  ) {
    let whiteCheck = isCheck(boardCopy, "white", whiteKing.cords);
    let blackCheck = isCheck(boardCopy, "black", blackKing.cords);
    setBlkKing({
      ...blackKing,
      check: blackCheck,
    });

    setWhtKing({
      ...whiteKing,
      check: whiteCheck,
    });
    if (whiteCheck) {
      isMate(boardCopy, "white", whiteKing) && alert("checkmate");
    } else if (blackCheck) {
      isMate(boardCopy, "black", blackKing) && alert("checkmate");
    }
  }
  function upgradePawn(piece: string) {
    let boardCopy = _.cloneDeep(realBoard!);
    boardCopy[pawnToUpgrade!.y][pawnToUpgrade!.x].piece =
      r[piece as keyof typeof r];
    setRealBoard(boardCopy);
    setPawnToUpgrade(null);
    kingVerify(boardCopy, whtKing, blkKing);
  }
  //moves the rook piece in case of a castle
  function castle(boardCopy:Cord[][],direction:string){
    if(direction == "left"){
         boardCopy = movePiece(boardCopy[hiPiece!.y][hiPiece!.x-1],boardCopy,boardCopy[hiPiece!.y][hiPiece!.x-4])
    }
    else{
      boardCopy = movePiece(boardCopy[hiPiece!.y][hiPiece!.x+1],boardCopy,boardCopy[hiPiece!.y][hiPiece!.x+3])
    }
    return boardCopy
  }
  //checks if en passant is possible
  function isEnPassPossible( tile: Cord) {
    if (
      tile.piece.name == "Pawn" &&
      pawnToEnPass &&
      pawnToEnPass.pieceColor != tile.pieceColor &&
      tile.y == (tile.pieceColor == "white" ? 3 : 4) &&
      (tile.x == pawnToEnPass.x - 1 || tile.x == pawnToEnPass.x + 1)
    ) {
      return true;
    }
    return false;
  }
  //Goes through each possible move the checked kings pieces could make to see if any
  //moves removes the check. Returns a boolean of if king is mated
  function isMate(boardCopy: Cord[][], pieceColor: string, king: KingStore) {
    //for rows on the board
    for (let row = 0; row < 8; row++) {
      //for each tile in a row
      for (let tile = 0; tile < 8; tile++) {
        //cordinate being checked
        let search = boardCopy![row][tile];
        //piece is of search color
        if (search.piece.name != "None" && search.pieceColor == pieceColor) {
          //all moves a piece could make
          let moves = search.getPossibleMoves(_.cloneDeep(boardCopy!));
          //for each move of possible moves
          for (let move = 0; move < moves.length; move++) {
            let copy = _.cloneDeep(boardCopy!);
            let moveTile = copy[moves[move].y][moves[move].x];
            //makes board for testing check
            copy = movePiece(moveTile, copy, search);
            //checks if king piece is being moved to give updated king cordinate
            let check = isCheck(
              copy,
              pieceColor,
              search.piece.name == "King" ? moveTile : king.cords
            );
            if (!check) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }
  function highlightPieces(
    possible: Move[],
    boardCopy: Cord[][],
    king: KingStore,
    tile: Cord
  ) {
    //filters out moves that would put own king in check
    possible = possible.filter((move: Move) => {
      //lodash deep copy cause no native way to copy object with methods
      let copy = _.cloneDeep(boardCopy!);

      copy = movePiece(copy[move.y][move.x], copy, tile);

      //if not in check, checks if the piece being moved is a king because the cordinate
      //will change for each possible move
      return !isCheck(
        copy,
        tile.pieceColor,
        tile.piece.name == "King" ? copy[move.y][move.x] : king.cords
      );
    });
    //highlights all possible moves
    possible.map((move: Move) => {
      boardCopy[move.y][move.x].highlighted = true;
    });
    return boardCopy;
  }
  //tile:position to be moved to
  //moved: piece to be moved
  function movePiece(tile: Cord, boardCopy: Cord[][], moved: Cord) {
    boardCopy[tile.y][tile.x].piece = moved!.piece;
    boardCopy[tile.y][tile.x].pieceColor = moved!.pieceColor;
    boardCopy[moved!.y][moved!.x].piece = r.None;
    boardCopy[moved!.y][moved!.x].pieceColor = "None";

    return boardCopy;
  }

  function makeNew() {
    setHistory([])
    setTurnState(true)
    setWhtKing({
      cords: new Cord("light", r.King, "white", 4, 7),
      check: false,
    });
    setBlkKing({
      cords: new Cord("light", r.King, "black", 4, 0),
      check: false,
    });
    setCastleCon({
      black: { left: true, king: true, right: true },
      white: { left: true, king: true, right: true },
    });
    setPawnToUpgrade(null);
    let newBoard = [];
    let row = [];
    let y = 0;
    let order = [
      r.Rook,
      r.Knight,
      r.Bishop,
      r.Queen,
      r.King,
      r.Bishop,
      r.Knight,
      r.Rook,
    ];
    for (let x = 0; x < 8; x++) {
      row.push(
        new Cord((x + y) % 2 == 0 ? "light" : "dark", order[x], "black", x, y)
      );
    }
    newBoard.push(row);
    row = [];
    y++;
    for (let x = 0; x < 8; x++) {
      row.push(
        new Cord((x + y) % 2 == 0 ? "light" : "dark", r.Pawn, "black", x, y)
      );
    }
    newBoard.push(row);
    row = [];
    y++;
    for (let i = 0; i < 4; i++) {
      for (let x = 0; x < 8; x++) {
        row.push(
          new Cord((x + y) % 2 == 0 ? "light" : "dark", r.None, "None", x, y)
        );
      }
      newBoard.push(row);
      row = [];
      y++;
    }
    for (let x = 0; x < 8; x++) {
      row.push(
        new Cord((x + y) % 2 == 0 ? "light" : "dark", r.Pawn, "white", x, y)
      );
    }
    newBoard.push(row);
    row = [];
    y++;
    for (let x = 0; x < 8; x++) {
      row.push(
        new Cord(
          (x + y) % 2 == 0 ? "light" : "dark",
          order[x],
          "white",
          x,
          y
        )
      );
    }
    newBoard.push(row);
    row = [];
    y++;
    setRealBoard(newBoard);
  }
  function clearHighlights(boardCopy: Cord[][]) {
    for (let row = 0; row < boardCopy.length; row++) {
      for (let tile = 0; tile < boardCopy[row].length; tile++) {
        if (boardCopy[row][tile].highlighted) {
          boardCopy[row][tile].highlighted = false;
        }
      }
    }
    return boardCopy;
  }
  function castleMoves(boardCopy: Cord[][], pieceColor: string,tile:Cord,king:KingStore) {
    //setting color variable
    let side = castleCon[pieceColor as keyof typeof castleCon]
    //Castle cannot occur if in check or if king has moved
    if(king.check||!side.king)return []
    //moves to be returned
    let moves = []
    //left rook hasnt moved yet
    if(side.left){
      //both tiles must be empty
      if(boardCopy[tile.y][tile.x-1].piece.name=="None"&&boardCopy[tile.y][tile.x-2].piece.name=="None"){
       //king not allowed to move through a check when moving double spaces, first checks for check
        //in one move then two
        let checkSearch = _.cloneDeep(boardCopy)
        checkSearch = movePiece(checkSearch[tile.y][tile.x-1],checkSearch,checkSearch[tile.y][tile.x])
        let check = isCheck(checkSearch,pieceColor,checkSearch[tile.y][tile.x-1])
        if(!check){
          let checkSearch = _.cloneDeep(boardCopy)
        checkSearch = movePiece(checkSearch[tile.y][tile.x-2],checkSearch,checkSearch[tile.y][tile.x])
        check = isCheck(checkSearch,pieceColor,checkSearch[tile.y][tile.x-2])
        }
        //if both cases pass as not checking the king
        !check&&moves.push( {x:tile.x-2,y:tile.y})

      }
    }
    //right rook hasnt moved yet
    if(side.right){
      //both tiles must be empty
      if(boardCopy[tile.y][tile.x+1].piece.name=="None"&&boardCopy[tile.y][tile.x+2].piece.name=="None"){
        //king not allowed to move through a check when moving double spaces, first checks for check
        //in one move then two
        let checkSearch = _.cloneDeep(boardCopy)
        checkSearch = movePiece(checkSearch[tile.y][tile.x+1],checkSearch,checkSearch[tile.y][tile.x])
        let check = isCheck(checkSearch,pieceColor,checkSearch[tile.y][tile.x+1])
        if(!check){
          let checkSearch = _.cloneDeep(boardCopy)
        checkSearch = movePiece(checkSearch[tile.y][tile.x+2],checkSearch,checkSearch[tile.y][tile.x])
        check = isCheck(checkSearch,pieceColor,checkSearch[tile.y][tile.x+2])
        }
        //if both cases pass as not checking the king
        !check&&moves.push( {x:tile.x+2,y:tile.y})
      }
    }
    
    return moves
  }
  function isCheck(boardCopy: Cord[][], pieceColor: string, king: Cord) {
    let queenMoves = r.Queen.getRules();
    let moves = queenMoves(pieceColor, king.x, king.y, boardCopy);
    let knightMoves = r.Knight.getRules();
    moves = [...moves, ...knightMoves(pieceColor, king.x, king.y, boardCopy)];
    let check = false;
    for (let i = 0; i < moves.length; i++) {
      let search = boardCopy[moves[i].y][moves[i].x] as Cord;
      //if piece isnt blank and of the opposite color
      if (search.piece.name != "None" && search.pieceColor != pieceColor) {
        //gets enemy moves
        let enemyMoves = search.getPossibleMoves(boardCopy);
        //checks if piece has a move to take the king and returns true or false
        check = enemyMoves.some((x: Move) => {
          if (x.x == king.x && x.y == king.y) {
            return true;
          }
          return false;
        });
      }
      if (check == true) break;
    }
    return check;
  }

  useEffect(() => {
    makeNew();
  }, []);
  return (
    <>
      <div className={styles["button-container"]}>

      
    
    <div>{turnState?"White's":"Black's"} Turn {debug&& "* DEBUG"}</div>
      <button
        onClick={() => console.log("Board", realBoard, "Selected", hiPiece)}
      >
        Debug Info
      </button>
      <button onClick={()=>{setDebug(!debug)}}>Debug Move</button>
      <button onClick={() => makeNew()}>New Board</button>
      </div>
      <div className={styles["board-container" as keyof typeof styles]}>
      <div className={styles.column}>
      <div className={styles.row}>
        <div style={{backgroundColor:"rgb(168, 165, 165)"}} className={styles.tile}></div>
        {["A","B","C","D","E","F","G","H"].map((cord,key)=>(
          <div key={key} style={{color:"white",backgroundColor:key%2?"rgb(168, 165, 165)":"rgb(140, 140, 140)",}} className={styles.tile}>{cord}</div>
)
        )}
</div>
        {realBoard?.map((row: Cord[], index) => (
          <div key={index} className={styles.row}>
          <div style={{color:"white",backgroundColor:index%2?"rgb(168, 165, 165)":"rgb(140, 140, 140)",}} className={styles.tile}>{index+1}</div>
            {row.map((tile: Cord, index) => (
              <div
                key={index}
                onClick={() => handleClick(tile)}
                className={styles.tile}
                style={{
                  color: tile.pieceColor,
                  cursor: "pointer",
                  backgroundColor:
                    (whtKing.check &&
                      tile.x == whtKing.cords.x &&
                      tile.y == whtKing.cords.y) ||
                    (blkKing.check &&
                      tile.x == blkKing.cords.x &&
                      tile.y == blkKing.cords.y)
                      ? "rgb(255, 82, 90)"
                      : tile.highlighted
                      ? "rgb(101, 197, 252)"
                      : tile.tileColor == "light"
                      ? "rgb(255, 206, 153)"
                      : "rgb(77, 48, 17)",
                }}
              >
                {tile.piece.name != "None" &&
                  {
                    Pawn: <FaChessPawn />,
                    Bishop: <FaChessBishop />,
                    King: <FaChessKing />,
                    Queen: <FaChessQueen />,
                    Rook: <FaChessRook />,
                    Knight: <FaChessKnight />,
                  }[tile.piece.name]}
              </div>
            ))}
          </div>
        ))}
      </div>

      {pawnToUpgrade && (
        <div
        className={styles.upgrade}
        >
          {Object.keys(upgradeKey).map((key, index) => (
            <div
              onClick={() => upgradePawn(key)}
              style={{
                cursor:"pointer",
                color: pawnToUpgrade.pieceColor,
              }}
              key={index}
            >
              {upgradeKey[key as keyof typeof upgradeKey]}
            </div>
          ))}
        </div>
      )}
      <div className={styles.history}>
              <h2>Move History</h2>
      {history?.map((move,key)=>(
        <p>{key+1}. {move}</p>
        ))}
        </div>
      </div>
    </>
  );
};

export default Board;
