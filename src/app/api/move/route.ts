import { CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies,headers } from 'next/headers';
import { makeBoard } from '../../../../chessFunctions/makeBoard';
import { buildCurrentBoard } from '../../../../chessFunctions/buildCurrentBoard';
import { isMoveLegal } from '../../../../chessFunctions/isMoveLegal';
import { Move } from '../../../../types/types';
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
    if(headers().get('move')==null){
      return Response.json({error:"no turn sent"})
    }  
    let game_id = headers().get('game_id')
    let move =JSON.parse(headers().get('move') as string) as Move
    
    let user_id = headers().get('userId')
    let entries = await supabase.from("Sessions").select().eq("id",game_id)
    let game_data = entries.data![0]
    let moves = game_data.moves
    let turn = game_data.turn
    let session_entries = await supabase.from("Players").select().eq("id",game_id)
    let session_info = session_entries.data![0]
    let correct_id = session_info[turn as keyof typeof session_info]
    if (user_id != correct_id){
      return Response.json({error:"not your turn!"})

    }

    

    
       
      let {postMoveBoardDetails,castleConditions}= buildCurrentBoard(moves)
      
      let board = postMoveBoardDetails?.board 
      let isPawn = board[move?.start.y][move?.start.x].piece.name == "Pawn"
      let end = board[move?.start.y][move?.start.x].pieceColor=="white"?0:7
    let pawnToUpgrade
    let isEnd = move.end.y == end
    let upgrade = headers().get('pawnUpgrade')
    console.log(upgrade)
    if(isPawn&&isEnd&&upgrade==null){
      return Response.json({error:"Pawn move did not come with upgrade key"})
    }else if(isPawn&&isEnd){
      let validUpgrades = ["Queen","Bishop","Rook","Knight"]
      if(!validUpgrades.includes(upgrade as string)){
      return Response.json({error:"Invalid Upgrade Key"})
      }

      move.upgrade = upgrade as string
    }
      let legal = isMoveLegal(postMoveBoardDetails,turn,move,castleConditions)
      if(legal){
        moves.push(move!)
        let response = await supabase.from("Sessions").update({moves:moves,turn:turn=="white"?"black":"white"}).eq("id",game_id)
      }




      return Response.json({message:board})

    



    //let data = await supabase.from("Sessions").update({last_move:JSON.parse(move!)}).eq("id",game_id)
    let user = await supabase.from("Sessions")
    console.log(move)
    
    return Response.json({message:game_data})
        }

