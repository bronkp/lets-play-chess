import { CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies,headers } from 'next/headers';
import { makeBoard } from '../../../../chessFunctions/makeBoard';
import { buildCurrentBoard } from '../../../../chessFunctions/buildCurrentBoard';
import { isMoveLegal } from '../../../../chessFunctions/isMoveLegal';
export async function GET() {
    const cookieStore = cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SERVICE_KEY!,
        {
            cookies: {
              get(name: string) {
                return cookieStore.get(name)?.value
              },
              set(name: string, value: string, options: CookieOptions) {
                cookieStore.set({ name, value, ...options })
              },
              remove(name: string, options: CookieOptions) {
                cookieStore.set({ name, value: '', ...options })
              },
            },
          }
      )
      
    let game_id = headers().get('game_id')
    let entries = await supabase.from("Sessions").select().eq("id",game_id)
    let game_data = entries.data![0]
    let moves = game_data.moves
    let turn = game_data.turn
    let board 
    let whiteKing
    let blackKing
    if(moves){

        let {postMoveBoardDetails,castleConditions}= buildCurrentBoard(moves)
        board = postMoveBoardDetails?.board
        whiteKing = postMoveBoardDetails?.whiteKing
        blackKing = postMoveBoardDetails?.blackKing
    }
    return Response.json({board:board,turn:turn,whiteKing:whiteKing,blackKing:blackKing,moves:moves})
        }

