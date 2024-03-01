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
import { supabase } from "../../../supa/client";
import { buildCurrentBoard } from "../../../chessFunctions/buildCurrentBoard";
import { error } from "console";
import { simpleMove } from "../../../chessFunctions/simpleMove";
import SharePopUp from "./SharePopUp";
import { SupaBoard } from "../../../types/types";
type KingStore = {
  cords: Cord;
  check: Boolean;
};
type Move = {
  x: number;
  y: number;
};
type LastMove = {
  start: Move;
  end: Move;
};
type BoardProps = {
  params: any;
};
const OnlineBoard: React.FC<BoardProps> = ({ params }) => {
  const [gameReady, setGameReady] = useState(false);
  const [hiPiece, setHiPiece] = useState<Cord | null>();
  const [turnState, setTurnState] = useState(true);
  const [checkMate, setCheckMate] = useState<string|null>("");
  const [pawnToUpgrade, setPawnToUpgrade] = useState<LastMove|null>();
  const [pawnToEnPass, setPawntoEnPass] = useState<null | Cord>();
  const [history, setHistory] = useState<String[]>();
  const [userColor, setUserColor] = useState("");
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
  const [turn, setTurn] = useState("white");
  const [debug, setDebug] = useState(false);
  const [userId, setUserId] = useState("");
  const upgradeKey = {
    Queen: <FaChessQueen />,
    Knight: <FaChessKnight />,
    Bishop: <FaChessBishop />,
    Rook: <FaChessRook />,
  };
  //pass realboard and hipiece as work around for recieving online moves
  async function handleClick(realBoard: Cord[][], tile: Cord, hiPiece: Cord) {
    console.log("here");
    if (pawnToUpgrade != null) {
      return;
    }
    let clickedIsHighlighted = tile.highlighted;
    let clickedPieceName = tile.piece.name;
    let clickedPieceColor = tile.pieceColor;
    let turnColor = turn;
    let boardCopy: Cord[][] = _.cloneDeep(realBoard!);
    if (!clickedIsHighlighted) {
      if (clickedPieceName == "None") {
        boardCopy = clearHighlights(boardCopy);
        setRealBoard(boardCopy);
        return;
      } else if (clickedPieceColor != userColor || clickedPieceColor != turn) {
        return;
      } else {
        boardCopy = handleHighlights(boardCopy, tile);
        setRealBoard(boardCopy);
      }
    } else {
      await handleMoveAttempt(tile, hiPiece, boardCopy);
    }
  }
  async function sendUpgradeMove(key: string) {
    let start = pawnToUpgrade?.start;
    let end = pawnToUpgrade?.end;
    let valid = await sendMove(start!, end!, key);
    setPawnToUpgrade(null);
  }
  async function handleMoveAttempt(
    tile: Cord,
    hiPiece: Cord,
    boardCopy: Cord[][]
  ) {
    let isPawn = hiPiece.piece.name == "Pawn";
    let end = hiPiece.pieceColor == "white" ? 0 : 7;
    let isEnd = tile.y == end;
    if (isPawn && isEnd) {
      setPawnToUpgrade({ start: hiPiece, end: tile });
      setRealBoard(preUpgradeVisual(_.cloneDeep(realBoard!), hiPiece, tile));
    } else {
      let valid = await sendMove(hiPiece, tile, null);
      //valid &&handleHighlightedClick(boardCopy, tile, hiPiece);
    }
  }
  //highlights during click event different function than highlighting board given
  function handleHighlights(boardCopy: Cord[][], tile: Cord) {
    let clickedRowIndex = tile.y;
    let clickedTileIndex = tile.x;
    boardCopy = clearHighlights(boardCopy);
    setHiPiece({ ...tile } as Cord);
    //gets the possible moves from the r object using string as key
    //have to do this because response from server will not contain the functions in the object
    let getMoves =
      r[
        boardCopy![clickedRowIndex][clickedTileIndex].piece
          .name as keyof typeof r
      ].getRules();
    let possible = getMoves(tile.pieceColor, tile.x, tile.y, boardCopy);
    //checking en passant possibility
    if (isEnPassPossible({ ...tile } as Cord)) {
      //adds en passant to move list, changing y based on color
      possible.push({
        x: pawnToEnPass?.x,
        y: pawnToEnPass!.y + (tile.pieceColor == "white" ? -1 : +1),
      });
    }
    if (tile.piece.name == "King") {
      let moves = castleMoves(
        boardCopy,
        tile.pieceColor,
        tile,
        tile.pieceColor == "white" ? whtKing : blkKing
      );
      if (moves) {
        possible = [...possible, ...moves];
      }
    }

    //goes through each possible move and highlights them
    boardCopy = highlightPieces(
      possible,
      boardCopy,
      tile?.pieceColor == "white" ? whtKing : blkKing,
      { ...tile } as Cord
    );
    return boardCopy;
  }
  function updateKingState(
    whiteK: KingStore,
    blackK: KingStore,
    clickedTile: Cord,
    highlightedPieceColor: string
  ) {
    if (highlightedPieceColor == "black") {
      setBlkKing({
        ...blkKing,
        cords: { ...clickedTile } as Cord,
      });
      blackK = {
        ...blkKing,
        cords: { ...clickedTile } as Cord,
      };
      setCastleCon({
        ...castleCon,
        black: { ...castleCon.black, king: false },
      });
    }
    if (highlightedPieceColor == "white") {
      setWhtKing({
        ...whtKing,
        cords: { ...clickedTile } as Cord,
      });
      whiteK = {
        ...whtKing,
        cords: { ...clickedTile } as Cord,
      };
      setCastleCon({
        ...castleCon,
        white: { ...castleCon.white, king: false },
      });
    }
    setHiPiece(null);
    return { whiteK, blackK };
  }
  function updateRookState(
    highlightedTileIndex: number,
    highlightedPieceColor: string
  ) {
    let rookInStartingPosition =
      highlightedTileIndex == 0 || highlightedTileIndex == 7;
    let rookInLeftPosition = highlightedTileIndex == 0;
    let rookInRightPosition = highlightedTileIndex == 7;
    if (highlightedPieceColor == "black" && rookInStartingPosition) {
      rookInLeftPosition &&
        setCastleCon({
          ...castleCon,
          black: { ...castleCon.black, left: false },
        });
      rookInRightPosition &&
        setCastleCon({
          ...castleCon,
          black: { ...castleCon.black, right: false },
        });
    } else if (rookInStartingPosition) {
      rookInLeftPosition &&
        setCastleCon({
          ...castleCon,
          white: { ...castleCon.white, left: false },
        });
      rookInRightPosition &&
        setCastleCon({
          ...castleCon,
          white: { ...castleCon.white, right: false },
        });
    }
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
      isMate(boardCopy, "white", whiteKing) && setCheckMate("white");
    } else if (blackCheck) {
      isMate(boardCopy, "black", blackKing) && setCheckMate("black");
    }
  }
 
  //checks if en passant is possible
  function isEnPassPossible(tile: Cord) {
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
          let getMoves =
            r[
              boardCopy![search.y][search.x].piece.name as keyof typeof r
            ].getRules();

          let moves = getMoves(
            search.pieceColor,
            search.x,
            search.y,
            boardCopy
          );
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
    console.log("here", boardCopy, possible);
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
        new Cord((x + y) % 2 == 0 ? "light" : "dark", order[x], "white", x, y)
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
  function castleMoves(
    boardCopy: Cord[][],
    pieceColor: string,
    tile: Cord,
    king: KingStore
  ) {
    //setting color variable
    let side = castleCon[pieceColor as keyof typeof castleCon];
    //Castle cannot occur if in check or if king has moved
    if (king.check || !side.king) return [];
    //moves to be returned
    let moves = [];
    //left rook hasnt moved yet
    if (side.left) {
      //both tiles must be empty
      if (
        boardCopy[tile.y][tile.x - 1].piece.name == "None" &&
        boardCopy[tile.y][tile.x - 2].piece.name == "None"
      ) {
        //king not allowed to move through a check when moving double spaces, first checks for check
        //in one move then two
        let checkSearch = _.cloneDeep(boardCopy);
        checkSearch = movePiece(
          checkSearch[tile.y][tile.x - 1],
          checkSearch,
          checkSearch[tile.y][tile.x]
        );
        let check = isCheck(
          checkSearch,
          pieceColor,
          checkSearch[tile.y][tile.x - 1]
        );
        if (!check) {
          let checkSearch = _.cloneDeep(boardCopy);
          checkSearch = movePiece(
            checkSearch[tile.y][tile.x - 2],
            checkSearch,
            checkSearch[tile.y][tile.x]
          );
          check = isCheck(
            checkSearch,
            pieceColor,
            checkSearch[tile.y][tile.x - 2]
          );
        }
        //if both cases pass as not checking the king
        !check && moves.push({ x: tile.x - 2, y: tile.y });
      }
    }
    //right rook hasnt moved yet
    if (side.right) {
      //both tiles must be empty
      if (
        boardCopy[tile.y][tile.x + 1].piece.name == "None" &&
        boardCopy[tile.y][tile.x + 2].piece.name == "None"
      ) {
        //king not allowed to move through a check when moving double spaces, first checks for check
        //in one move then two
        let checkSearch = _.cloneDeep(boardCopy);
        checkSearch = movePiece(
          checkSearch[tile.y][tile.x + 1],
          checkSearch,
          checkSearch[tile.y][tile.x]
        );
        let check = isCheck(
          checkSearch,
          pieceColor,
          checkSearch[tile.y][tile.x + 1]
        );
        if (!check) {
          let checkSearch = _.cloneDeep(boardCopy);
          checkSearch = movePiece(
            checkSearch[tile.y][tile.x + 2],
            checkSearch,
            checkSearch[tile.y][tile.x]
          );
          check = isCheck(
            checkSearch,
            pieceColor,
            checkSearch[tile.y][tile.x + 2]
          );
        }
        //if both cases pass as not checking the king
        !check && moves.push({ x: tile.x + 2, y: tile.y });
      }
    }

    return moves;
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
        let getMoves =
          r[
            boardCopy![search.y][search.x].piece.name as keyof typeof r
          ].getRules();
        let enemyMoves = getMoves(
          search.pieceColor,
          search.x,
          search.y,
          boardCopy
        );

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
  // function handleEnemyMove(move) {
  //   console.log(move);
  //   let boardCopy = _.cloneDeep(realBoard);
  //   let start = move.start;
  //   let end = boardCopy[move.end.y][move.end.x];
  //   boardCopy = highlightPieces([end], boardCopy!, whtKing, end);
  //   console.log(boardCopy);
  //   handleClick(boardCopy, end, boardCopy[start.y][start.x]);
  // }

  // useEffect(() => {
  //   console.log(
  //     "last",
  //     JSON.stringify(lastLocalMove),
  //     JSON.stringify(lastMove)
  //   );
  //   if (lastMove && realBoard) {
  //     JSON.stringify(lastLocalMove) != JSON.stringify(lastMove) &&
  //       handleEnemyMove(lastMove);
  //   }
  // }, [lastMove]);

  const [realBoard, setRealBoard] = useState<Cord[][]>();

  async function legalMove() {
    let data = await fetch("/api/move", {
      headers: {
        game_id: params.game_id,
        turn: "white",
        move: JSON.stringify({
          end: {
            x: 7,
            y: 5,
          },
          start: {
            x: 6,
            y: 7,
          },
        }),
      },
    }).then((body) => {
      return body.json();
    });
    setRealBoard(data.message);
  }
  async function sendMove(
    start: Cord | Move,
    end: Cord | Move,
    upgrade: null | string
  ) {
    console.log("sendmove details", upgrade);
    let body = JSON.stringify(
      {
        userId: userId,
        game_id: params.game_id,
        pawnUpgrade: upgrade,
        turn: "white",
        move: JSON.stringify({
          end: {
            x: end.x,
            y: end.y,
          },
          start: {
            x: start.x,
            y: start.y,
          },
        }),
      }

    )
    let data = await fetch("/api/move", {
      method:"POST",
      headers: {
        'Content-Type': 'application/json',
      },body:body
    }).then((body) => {
      return body.json();
    });
    console.log(data.error);
    if (data.error) {
      console.log(data.error);
      return false;
    } else {
      console.log(data, "move made");
      return true;
    }
  }
  async function getBoard() {
    let body = JSON.stringify({
      game_id: params.game_id,
    });
    let board = await fetch("/api/getBoard", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: body,
    }).then((body) => {
      return body.json();
    });
    console.log(board.game_ready, "here", board);
    if (board.game_ready) {
      setGameReady(true);
    }
    if (board.board) {
      //console.log(board.board?"a":"b")
      setRealBoard(board.board);
      setTurn(board.turn);
      setWhtKing(board?.whiteKing);
      setBlkKing(board?.blackKing);
      setPawntoEnPass(board.pawnToEnPassant);
      console.log("recieved", board);
      setCastleCon(board.castleConditions);
      let moves = board.moves;
      if (moves) {
        let moveHistory = formatHistory(moves);
        setHistory(moveHistory);
      }
    } else {
      makeNew();
    }
  }
  useEffect(() => {
    let board = getBoard();
  }, []);

  useEffect(() => {
    console.log("yoyo", params.game_id);
    let channel = supabase.channel("game_move");

    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Sessions",
          filter: "id=eq." + params.game_id,
        },
        (payload) => {
          handleIncomingMove(payload.new as SupaBoard);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);
  function formatHistory(moves: LastMove[]) {
    let moveHistory = [];
    for (let i = 0; i < moves.length; i++) {
      let move = moves[i];
      let start = move.start;
      let end = move.end;
      let startPosition = String.fromCharCode(97 + start.x!) + (start.y! + 1);
      let endPosition = String.fromCharCode(97 + end.x) + (end.y + 1);
      //end of move turn section
      moveHistory.push(`${startPosition} => ${endPosition}`);
    }
    return moveHistory;
  }
  function handleIncomingMove(sessionData:SupaBoard) {
    if (sessionData.game_ready) setGameReady(true);
    let moves = sessionData.moves as LastMove[];
    let moveHistory = formatHistory(moves);
    setHistory(moveHistory);
    let { postBoardBuildDetails, castleConditions } = buildCurrentBoard(moves);
    setCastleCon(castleConditions);
    let board = postBoardBuildDetails?.board;
    console.log(postBoardBuildDetails?.blackKing);
    setWhtKing(postBoardBuildDetails?.whiteKing!);
    setBlkKing(postBoardBuildDetails?.blackKing!);
    setRealBoard(board);
    setTurn(sessionData.turn);
    setCheckMate(sessionData.mate);
    setPawntoEnPass(postBoardBuildDetails?.pawnToEnPassant);
  }
  async function getUserId() {
    let userColor = sessionStorage.getItem("user_color");
    let gameId = sessionStorage.getItem("game_id");
    let sessionId = sessionStorage.getItem("session_id");
    let body = JSON.stringify({
      game_id: params.game_id,
    });
    if (gameId != params.game_id || !sessionId || !userColor) {
      sessionStorage.setItem("game_id", params.game_id);
      let data = await fetch("/api/getUserId", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
      }).then((data) => {
        return data.json();
      });
      if (data.error) {
        console.log(data.error);
        //TODO: SET ERROR RESULT
      } else {
        sessionStorage.setItem("session_id", data.id);
        sessionStorage.setItem("user_color", data.color);
        setUserId(data.id);
        setUserColor(data.color);
      }
    } else if (sessionId) {
      setUserId(sessionId);
      setUserColor(userColor);
    }
  }
  useEffect(() => {
    getUserId();
  }, []);

  // async function cheat() {
  //   let data = await fetch("/api/move", {
  //     headers: {
  //       userId: userId,
  //       game_id: params.game_id,
  //       pawnUpgrade: null,
  //       turn: "white",
  //       move: JSON.stringify({
  //         end: {
  //           x: 2,
  //           y: 7,
  //         },
  //         start: {
  //           x: 4,
  //           y: 7,
  //         },
  //       }),
  //     },
  //   }).then((body) => {
  //     return body.json();
  //   });
  //   console.log(data);
  // }
  function preUpgradeVisual(board: Cord[][], start: Cord, end: Cord) {
    board = simpleMove(board, start, end);
    board = clearHighlights(board);
    return board;
  }
  return (
    <>
      {!gameReady && <SharePopUp link={params.game_id} />}
      {pawnToUpgrade?.end!.x!} {pawnToUpgrade?.end!.y!}
      <div className={styles["button-container"]}>
        <div>
          {turn == "white" ? "White's" : "Black's"} Turn {debug && "* DEBUG"}
        </div>
        {/* <button
          onClick={() => {
            cheat();
          }}
        >
          Cheat
        </button> */}
        <button
          onClick={() => {
            setDebug(!debug);
          }}
        >
          Debug Info
        </button>
        {debug && <p>User: {userId}</p>}
        {debug && <p>Game: {params.game_id}</p>}

        {checkMate && (
          <h1>Game Over: {checkMate == "white" ? "Black" : "White"} Has Won</h1>
        )}
      </div>
      <div className={styles["wide-container"]}>
        <h1>{userColor == turn ? "Your Turn" : "Opponent's Turn"}</h1>
        <div className={styles["board-container" as keyof typeof styles]}>
          <div className={styles.column}>
            <div className={styles.row}>
              <div
                style={{ backgroundColor: "rgb(168, 165, 165)" }}
                className={styles.tile}
              ></div>
              {(userColor == "white"
                ? ["A", "B", "C", "D", "E", "F", "G", "H"]
                : ["A", "B", "C", "D", "E", "F", "G", "H"].reverse()
              ).map((cord, key) => (
                <div
                  key={key}
                  style={{
                    color: "white",
                    backgroundColor:
                      key % 2 ? "rgb(168, 165, 165)" : "rgb(140, 140, 140)",
                  }}
                  className={styles.tile}
                >
                  {cord}
                </div>
              ))}
            </div>
            {realBoard &&
              (userColor == "white"
                ? realBoard
                : _.cloneDeep(realBoard).reverse()
              )?.map((row: Cord[], index) => (
                <div key={index} className={styles.row}>
                  <div
                    style={{
                      color: "white",
                      backgroundColor:
                        index % 2 ? "rgb(168, 165, 165)" : "rgb(140, 140, 140)",
                    }}
                    className={styles.tile}
                  >
                    {userColor == "white" ? index + 1 : 8 - index}
                  </div>
                  {(userColor == "white"
                    ? row
                    : _.cloneDeep(row).reverse()
                  ).map((tile: Cord, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        !checkMate &&
                          !pawnToUpgrade &&
                          handleClick(realBoard, tile, hiPiece!);
                      }}
                      className={styles.tile}
                      style={{
                        color: tile.pieceColor,
                        cursor: "pointer",
                        backgroundColor:
                          pawnToUpgrade?.end.x == tile.x &&
                          pawnToUpgrade.end.y == tile.y
                            ? "rgb(153, 255, 89)"
                            : (whtKing.check &&
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
            <div className={styles.upgrade}>
              <p>Pawn Upgrade</p>
              {Object.keys(upgradeKey).map((key, index) => (
                <div
                  onClick={() => sendUpgradeMove(key)}
                  style={{
                    cursor: "pointer",
                    color: userColor,
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
            {history?.map((move, key) => (
              <p key={key}>
                {key + 1}. {move}
              </p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default OnlineBoard;
