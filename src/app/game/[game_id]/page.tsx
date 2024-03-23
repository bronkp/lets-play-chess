"use client";
import OnlineBoard from "@/app/components/OnlineBoard";
import { IconContext } from "react-icons";

export default function Page({ params }: { params: { game_id: string } }) {
  

  return (
    <>
      <div >
        <IconContext.Provider value={{  style: {minWidth:"2.2rem",minHeight:"2.2rem", maxHeight:"3vw",maxWidth:"3vw" } }}> 

        {/* <button onClick={()=>sendMove()}>Send</button> */}
        <OnlineBoard
          params={params}
          />
          </IconContext.Provider>
      </div>
    </>
  );
}
