'use client'

import { useState } from "react";
import NormalButton from "./NormalButton"

interface SendProps {
  handleSend: (content: string) => void; 
}

export default function Send({handleSend}:SendProps){
  const [message,setMessage]=useState<string>('')
  return (
    <div>
      <input type="text"
        className="bg-slate-50"
        onChange={(e)=>{setMessage(e.target.value)}}
        value={message}
      />
      <NormalButton
        onClick={()=>{
          handleSend(message)
          setMessage('')
        }}
      >↑</NormalButton>
    </div>
  )
}