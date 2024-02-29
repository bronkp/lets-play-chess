import { useRouter } from 'next/navigation'
import React from 'react'

const CreateBoard:React.FC = () => {
  const router = useRouter()
    async function createGame(){
      let data = await fetch("/api/create").then((body)=>{return body.json()})
      console.log(data)
      router.push("/game/"+data.game_id)
      }
  return (
    <div>Home

<button onClick={()=>{
createGame()
   }}>Create Game</button>


    </div>
  )
}

export default CreateBoard