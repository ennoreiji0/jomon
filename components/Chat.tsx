'use client'

import { ChatInfo } from "@/lib/types"
import Fukidashi from "./Fukidashi"

export default function Chat({
  chatData
}:{
  chatData:ChatInfo[]|undefined
}){
  
  return (
    chatData?.map((data)=>(
      <Fukidashi 
        key={data.id}
        content={data.content}
        username={data.username}
      />
    ))
  )
}