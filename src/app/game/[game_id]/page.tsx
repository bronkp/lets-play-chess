"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../../supa/client";
import OnlineBoard from "@/app/components/OnlineBoard";
import Cord from "@/app/classes/Cord";
import { IconContext } from "react-icons";
import SharePopUp from "@/app/components/SharePopUp";
type Move = {
  x: number;
  y: number;
};
export default function Page({ params }: { params: { game_id: string } }) {
  

  return (
    <>
      <div>
        <IconContext.Provider value={{ style: { height:"3em",width:"3em" } }}> 

        {/* <button onClick={()=>sendMove()}>Send</button> */}
        <OnlineBoard
          params={params}
          />
          </IconContext.Provider>
      </div>
    </>
  );
}
