'use client'
import Chat from "@/components/Chat";
import Send from "@/components/Send";
import { ChatInfo } from "@/lib/types";
import { useEffect, useState, useRef } from "react";
import scenarioData from "@/lib/scenario.json";

// JSONの型定義をアップデート
type ScenarioType = {
  [key: string]: {
    npc_messages: { user_id: string; username: string; content: string }[];
    choices: { text: string; next: string }[];
  }
};

const scenario: ScenarioType = scenarioData;

export default function Home(){
  const [chat, setChat] = useState<ChatInfo[]>([]);
  const [currentScene, setCurrentScene] = useState<string>("start");
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const [sendOK,setSendOK]=useState<boolean>(true)
  // 初期メッセージのセット（最初のシーンのメッセージをすべて入れる）
  useEffect(() => {
    const startMessages = scenario["start"].npc_messages.map((msg, index) => ({
      id: index + 1,
      user_id: msg.user_id,
      username: msg.username,
      content: msg.content,
    }));
    setChat(startMessages);
  }, []);

  // 自動スクロール
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // プレイヤーが選択肢を送信したときの処理
const handleSend = (playerContent: string, nextScene: string) => {
  setSendOK(false)
  // 1. まずプレイヤーの発言を即座に作成して追加
  setChat((prev) => {
    const currentChat = prev ?? [];
    const nextId = currentChat.length + 1;
    
    const playerMsg: ChatInfo = {
      id: nextId,
      user_id: 'player',
      username: 'player',
      content: playerContent
    };

    return [...currentChat, playerMsg];
  });

  // シナリオデータがない、またはメッセージが空ならここで終了
  if (!nextScene || !scenario[nextScene] || !scenario[nextScene].npc_messages.length) {
    setCurrentScene(nextScene);
    return;
  }

  // 2. 次のシーンのNPCメッセージを1個ずつ時間差で追加していく
  const messagesToAdd = scenario[nextScene].npc_messages;
  
  // メッセージを順番に出すための再帰関数
  const addMessageWithDelay = (index: number) => {
    // すべてのメッセージを出し終えたら、シーンのステートを更新して終了
    if (index >= messagesToAdd.length) {
      setCurrentScene(nextScene);
      return;
    }

    // 🌟 1.5秒（1500ミリ秒）遅らせてからメッセージをチャットに追加
    setTimeout(() => {
      setChat((prev) => {
        const currentChat = prev ?? [];
        const nextId = currentChat.length + 1; // 常にその瞬間の最新の末尾IDにする
        
        const currentMsg = messagesToAdd[index];
        const npcMsg: ChatInfo = {
          id: nextId,
          user_id: currentMsg.user_id,
          username: currentMsg.username,
          content: currentMsg.content
        };

        return [...currentChat, npcMsg];
      });

      // 次のメッセージの処理へ（さらに1.5秒後に実行される）
      addMessageWithDelay(index + 1);

    }, 1500); // ⏱️ ここの数字（ミリ秒）を変えれば、返信の速度を調整できるぞ！
  };

  // 最初の1個目のタイマーを起動！
  addMessageWithDelay(0);
  
};

  const currentChoices = scenario[currentScene]?.choices ?? [];

  return (
    <div className="bg-blue-200 w-full h-[100svh] flex flex-col overflow-hidden">
      
      {/* 📜 チャット履歴エリア */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <Chat chatData={chat} />
        <div ref={scrollEndRef} />
      </main>

      {/* 💬 入力欄エリア */}
      <footer className="sticky bottom-0 left-0 w-full z-10">
        <Send sendOK={sendOK} choicesData={currentChoices} handleSend={handleSend}/>
      </footer>

    </div>
  )
}