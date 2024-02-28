import Cord from "@/app/classes/Cord";

export type MoveCord = {
    x: number;
    y: number;
  };
export type Move = {
    start: MoveCord;
    end: MoveCord;
    upgrade?:string;
  };
export type KingStore = {
    cords: Cord;
    check: Boolean;
  };