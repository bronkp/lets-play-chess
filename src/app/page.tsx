"use client"
import { IconContext } from "react-icons";
import CreateBoard from "./components/CreateBoard";
import { FaChessPawn } from "react-icons/fa6";
import TiledBackground from "./components/TiledBackground";

export default function Home() {


  return (
    <>
  <TiledBackground/>
<CreateBoard/>
    </>
      
  );
}
