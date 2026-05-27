'use client'

import { useState } from "react";
import NormalButton from "./NormalButton"
import { send } from "process";

// 🌟 Propsの型定義を、新しいJSONの構造（オブジェクトの配列）に書き換える
interface SendProps {
  sendOK:boolean;
  choicesData: { text: string; next: string }[];
  handleSend: (content: string, nextScene: string) => void; 
}

// 🌟 引数で choicesData をしっかり受け取る
export default function Send({sendOK, choicesData, handleSend }: SendProps){
  const [message, setMessage] = useState<string>('')
  const [nextSceneId, setNextSceneId] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)

  // ❌ 元々ここにあった const choices = [...] は完全に削除してOK！

  return (
    <div className="bg-blue-300 w-full flex flex-col">
      
      {/* 1. 入力欄エリア */}
      <div className="p-4 flex gap-2 items-center">
        <input
          disabled={!sendOK}
          className="flex-1 p-3 rounded-xl bg-blue-400 text-white text-sm outline-none cursor-pointer border border-slate-700 focus:border-teal-500 caret-transparent"
                         
          onClick={() => setIsOpen(!isOpen)}
          value={message}
          readOnly
          placeholder={sendOK?"タップして入力":"返信を待っています..."}
        />

        <NormalButton
          onClick={() => {
            if (!message) return; 
            handleSend(message, nextSceneId)
            setMessage('')
            setNextSceneId('')
            setIsOpen(false) 
          }}
        >
          ↑
        </NormalButton>
      </div>

      {/* 2. 選択肢エリア */}
      {isOpen && (
        <div className="p-3 bg-blue-200 border-t border-slate-700 flex flex-col gap-2 max-h-48 overflow-y-auto">
          <p className="text-xs text-slate-400 font-bold px-1 mb-1">送信する指示を選択：</p>
          
          {/* 🌟 古い choices ではなく、新しく受け取った choicesData を map で回す */}
          {choicesData.map((choice, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setMessage(choice.text)
                setNextSceneId(choice.next)
              }} 
              className={`w-full p-2.5 rounded-lg text-left text-sm font-medium transition-colors ${
                message === choice.text 
                  ? 'bg-teal-600 text-white font-bold' 
                  : 'bg-blue-300 text-slate-800 hover:bg-slate-600'
              }`}
            >
              {choice.text}
            </button>
          ))}
        </div>
      )}

    </div>
  )
}