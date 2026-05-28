'use client'

export default function Fukidashi({
  content,
  username,
}: {
  content: string;
  username: string | null | undefined;
}) {
  const isMe = 'player' === username;
  const hasUsername = username && username.trim() !== "";

  return (
    <div className="w-full"> 
      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-1`}>
        <div className="flex flex-col max-w-[75%]">
          {!isMe && hasUsername && (
            <span className="text-sm text-slate-800 ml-1 leading-none mb-0.5">
              {username}
            </span>
          )}

          <div className={`
            p-2 rounded-lg w-fit break-words
            ${isMe 
              ? 'bg-green-600 text-white' 
              : 'bg-white text-black border border-gray-200'}
          `}>
            <p className="m-0 p-0 leading-normal text-xl">
              {content.trim()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}