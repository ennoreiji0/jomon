'use client'

import { useState } from "react";
import NormalButton from "./NormalButton"

interface SendProps {
  handleSend: (content: string) => void; 
}

export default function Send({handleSend}: SendProps){
  const [message, setMessage] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const choices = [
    "💬 「落ち着け。まずは飲料水の確保だ」",
    "💬 「文明を舐めるな。お前、今どこにいる？」",
    "💬 「電気系統のヒューズを確認しろ」"
  ];

  return (
    // 🌟 全体を flex flex-col にして、上から順番に並べる
    <div className="bg-slate-800 border-t border-slate-700 w-full flex flex-col">
      
      {/* 💬 1. 入力欄エリア（これが常に上側、つまりチャット履歴のすぐ下にくる） */}
      <div className="p-4 flex gap-2 items-center">
        <input 
          type="text"
          className="flex-1 p-3 rounded-xl bg-slate-900 text-white text-sm outline-none cursor-pointer border border-slate-700 focus:border-teal-500 caret-transparent"
          placeholder="タップして指示を選択..."
          readOnly               
          onClick={() => setIsOpen(!isOpen)} // タップで下の選択肢を開閉
          value={message}
          onChange={(e) => { setMessage(e.target.value) }}
        />

        <NormalButton
          onClick={() => {
            if (!message) return; 
            handleSend(message)
            setMessage('')
            setIsOpen(false) 
          }}
        >
          ↑
        </NormalButton>
      </div>

      {/* 📜 2. 選択肢エリア（これが下側。開くと入力欄の下にびょーんと広がる） */}
      {isOpen && (
        // 入力欄と区別がつくように、少しだけ背景を暗く（bg-slate-850〜900）し、上に細い線を引くと綺麗だぞ
        <div className="p-3 bg-slate-900 border-t border-slate-700 flex flex-col gap-2 max-h-48 overflow-y-auto">
          <p className="text-xs text-slate-400 font-bold px-1 mb-1">送信する指示を選択：</p>
          {choices.map((choice, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setMessage(choice)} 
              className={`w-full p-2.5 rounded-lg text-left text-sm font-medium transition-colors ${
                message === choice 
                  ? 'bg-teal-600 text-white font-bold' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {choice}
            </button>
          ))}
        </div>
      )}

    </div>
  )
}