'use client'
import Chat from "@/components/Chat";
import Send from "@/components/Send";
import { ChatInfo } from "@/lib/types";
import { useEffect, useState } from "react";

export default function Home(){
  const [chat, setChat] = useState<ChatInfo[]>([]);

  useEffect(() => {
    setChat([{
      id: 1,
      user_id: 'npc',
      username: '神崎',
      content: "繋がった……！お願い助けて！電気が止まって街がおかしいの。",
    }]);
  }, []);

  const handleSend = (content: string) => {
    setChat((prev) => {
      const currentChat = prev ?? [];
      const nextId = currentChat.length + 1;
      return [
        ...currentChat, 
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
    // 🌟 外側の p-3 を削除して、w-full（横幅100%）に！
    <div className="bg-slate-900 w-full h-[100svh] flex flex-col overflow-hidden">
      
      {/* 📜 チャット履歴エリア */}
      {/* 画面全体の余白（p-4）は、このチャットが見えるエリアだけに持たせる */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <Chat chatData={chat ?? []} />
      </main>

      {/* 💬 入力欄エリア：これが画面下部にびょーんと横いっぱいに広がる */}
      {/* w-full で横幅全開、sticky bottom-0 で最下部に完全固定！ */}
      <footer className="sticky bottom-0 left-0 w-full z-10">
        <Send handleSend={handleSend}/>
      </footer>

    </div>
  )
} 