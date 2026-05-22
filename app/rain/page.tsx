'use client'
import Chat from "@/components/Chat";
import Send from "@/components/Send";
import { ChatInfo } from "@/lib/types";
import { useEffect, useState } from "react";

export default function Home(){
  const [chat,setChat]=useState<ChatInfo[]>()
  useEffect(()=>{
    setChat([{
      id:1,
      user_id:'npc',
      username:'神崎',
      content:"aaa",
    }])
  },[])

const handleSend = (content: string) => {
  setChat((prev) => {
    // 🌟 1. もし prev が undefined だった場合は、空の配列 [] として扱う
    const currentChat = prev ?? [];

    // 2. 空の配列、または既存の配列の長さから次のIDを計算する
    const nextId = currentChat.length + 1;

    // 3. 安全に計算した currentChat を展開する
    return [
      ...currentChat, // 🛑 ここに prev を直接入れるとエラーになるから、安全な currentChat を使う！
      {
        id: nextId,
        user_id: 'player',
        username: 'player',
        content: content
      }
    ];
  });
};

  return (
    <div className="bg-blue-300 w-screen h-screen p-3">
      <Chat chatData={chat}/>
      <Send handleSend={handleSend}/>
    </div>
  )
}

