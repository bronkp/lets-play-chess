import { useRouter } from "next/navigation";
import styles from "../page.module.css"
import React, { useState } from "react";
import { FaChessPawn } from "react-icons/fa6";

const CreateBoard: React.FC = () => {
  const [loading,setLoading]=useState(false)
  const router = useRouter();
  async function createGame() {
    setLoading(true)
    let data = await fetch("/api/create").then((body) => {
      return body.json();
    });
    router.push("/game/" + data.game_id);
  }
  return (
    <div className={styles["create-container"]}>
  <h1><FaChessPawn color="black" fontSize="3em"/>Easy Chess<FaChessPawn color="black" fontSize="3em"/></h1>
      
      <button
      disabled={loading}
        onClick={() => {
          createGame();
        }}
      >
        {loading?"Loading...":"Create Game"}
      </button>
    </div>
  );
};

export default CreateBoard;
