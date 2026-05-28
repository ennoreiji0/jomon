'use client'
import Chat from "@/components/Chat";
import Send from "@/components/Send";
import { ChatInfo } from "@/lib/types";
import { useEffect, useState, useRef } from "react";
import scenarioData from "@/lib/scenario.json";

type ScenarioType = {
  [key: string]: {
    npc_messages: { username: string; content: string; next?:string }[];
    choices: { text: string; next: string }[];
  }
};

const scenario: ScenarioType = scenarioData;

export default function Home(){
  const [chat, setChat] = useState<ChatInfo[]>([]);
  const [currentScene, setCurrentScene] = useState<string>("start");
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const [sendOK, setSendOK] = useState<boolean>(true);

  const hasLaunched = useRef(false);

  // 【新設】指定したシーンのNPCメッセージを時間差でチャットに追加する共通関数
  const triggerSceneMessages = (targetScene: string, isInitial: boolean = false) => {
    // もしターゲットのシーンデータやセリフがなければ即終了
    if (!targetScene || !scenario[targetScene] || !scenario[targetScene].npc_messages.length) {
      setCurrentScene(targetScene);
      setSendOK(true);
      return;
    }

    const messagesToAdd = scenario[targetScene].npc_messages;

    const addMessageWithDelay = (index: number) => {
      // すべてのメッセージを出し終えたら、シーンを確定させてロック解除
      if (index >= messagesToAdd.length) {
        setCurrentScene(targetScene);
        setSendOK(true); 
        return;
      }

      // 1.5秒遅らせてメッセージを1件ずつ追加
      setTimeout(() => {
        setChat((prev) => {
          const currentChat = prev ?? [];
          const nextId = currentChat.length + 1;
          
          const currentMsg = messagesToAdd[index];
          const npcMsg: ChatInfo = {
            id: nextId,
            username: currentMsg.username,
            content: currentMsg.content
          };

          return [...currentChat, npcMsg];
        });

        // 再帰的に次のメッセージへ
        addMessageWithDelay(index + 1);
      }, isInitial && index === 0 ? 500 : 1500); // 🌟最初の1件目だけ、ゲーム起動時は少し早め(0.5秒)に喋らせる演出だ
    };

    // タイマー起動
    addMessageWithDelay(0);
  };

// 開幕の処理：startシーンのメッセージをじわじわ出す
  useEffect(() => {
    // 🌟【修正】もしすでに実行済みなら、2回目は何もしないで無視する
    if (hasLaunched.current) return;
    hasLaunched.current = true; // 1回目が走ったらフラグを立てる

    setSendOK(false); // 演出中は入力をロック
    triggerSceneMessages("start", true);
  }, []);

  // 自動スクロール
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // プレイヤーが選択肢を送信したときの処理
  const handleSend = (playerContent: string, nextScene: string) => {
    // 送信をロック！
    setSendOK(false);

    // 1. まずプレイヤーの発言を即座に追加
    setChat((prev) => {
      const currentChat = prev ?? [];
      const nextId = currentChat.length + 1;
      
      const playerMsg: ChatInfo = {
        id: nextId,
        username: 'player',
        content: playerContent
      };

      return [...currentChat, playerMsg];
    });

    // 2. 次のシーンのメッセージを時間差で起動
    triggerSceneMessages(nextScene);
    const memo=scenario[nextScene].npc_messages[scenario[nextScene].npc_messages.length-1].next
    if(memo){
      triggerSceneMessages(memo);
    }
  };

  const currentChoices = scenario[currentScene]?.choices ?? [];

  return (
    <div className="bg-blue-200 w-full h-[100svh] flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <Chat chatData={chat} />
        <div ref={scrollEndRef} />
      </main>

      <footer className="sticky bottom-0 left-0 w-full z-10">
        <Send sendOK={sendOK} choicesData={currentChoices} handleSend={handleSend}/>
      </footer>
    </div>
  );
}