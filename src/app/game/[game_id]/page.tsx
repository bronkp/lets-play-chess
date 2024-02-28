"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../../supa/client";
import OnlineBoard from "@/app/components/OnlineBoard";
import Cord from "@/app/classes/Cord";
type Move = {
  x: number;
  y: number;
};
export default function Page({ params }: { params: { game_id: string } }) {
  
  return (
    <>
      <div>
        {/* <button onClick={()=>sendMove()}>Send</button> */}
        <OnlineBoard
          params={params}
        />
        <p>{params.game_id}</p>
      </div>
    </>
  );
}
