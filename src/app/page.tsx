"use client"

import { useEffect, useState } from "react";
import Board from "./components/Board";
import { IconContext } from "react-icons";

export default function Home() {


  return (
    <>
    <IconContext.Provider value={{ style: { height:"3em",width:"3em" } }}>

<div style={{display:"flex", flexDirection:"column", justifyContent:"center",alignItems:"center"}}>

    <Board/> 
</div>

    </IconContext.Provider>
    </>
      
  );
}
