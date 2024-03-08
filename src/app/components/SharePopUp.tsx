import React from "react";
import styles from "../page.module.css";
type SharePopUpProps = {
  link: string;
  role: string;
  userId: string;
  userColor: string;
  setUserColor: any;
  gameIsReady: Boolean;
};
const SharePopUp: React.FC<SharePopUpProps> = ({
  link,
  role,
  userId,
  userColor,
  setUserColor,
  gameIsReady,
}) => {
  async function swapSides() {
    let body = JSON.stringify({ userId: userId, game_id: link });
    let data = await fetch("/api/swap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
    });
    let res = await data.json();
    if (res.error) {
      console.log("Error", res.error);
    }
  }
  async function startGame() {
    let body = JSON.stringify({ userId: userId, game_id: link });
    let data = await fetch("/api/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
    });
    let res = await data.json();
    if (res.error) {
      console.log("Error", res.error);
    }
  }
  return (
    <>
      <div className={styles["pop-up-background" as keyof typeof styles]}></div>
      <div className={styles["pop-up-view" as keyof typeof styles]}>
        {role == "owner" ? <h1>Owner</h1> : <h1>Guest</h1>}
        <p>You are playing as {userColor}</p>
        {role == "owner" && (
          <>
            <div className={styles.row}>
              <button
                onClick={() => {
                  swapSides();
                }}
              >
                Swap Team Colors
              </button>
              {gameIsReady && (
                <button
                  onClick={() => {
                    startGame();
                  }}
                >
                  Start Game
                </button>
              )}
            </div>
          </>
        )}
        <p>
          {gameIsReady ? "Ready to start" : "Waiting for opponent to join..."}
        </p>
        {role == "owner" && <h1>Send Link To Opponent:</h1>}
        {role == "owner" && <p>/game/{link}</p>}
      </div>
    </>
  );
};

export default SharePopUp;
