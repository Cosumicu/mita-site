"use client";

import { useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/lib/hooks";
import {
  getConversationMessages,
  createMessage,
} from "@/app/lib/features/messages/messageSlice";

type Props = {
  conversationId: string | null;
};

export default function ChatWindow({ conversationId }: Props) {
  const dispatch = useAppDispatch();
  const { messageList, isLoading } = useAppSelector((state) => state.message);
  const { user } = useAppSelector((state) => state.user);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [text, setText] = useState("");

  // Load messages when conversation changes
  useEffect(() => {
    if (conversationId) {
      dispatch(getConversationMessages(conversationId));
    }
  }, [dispatch, conversationId]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  const handleSend = async () => {
    if (!conversationId || !text.trim()) return;

    await dispatch(createMessage({ conversationId, text }));
    setText("");
  };

  if (!conversationId)
    return (
      <div className="flex items-center justify-center w-full h-full text-gray-500">
        Select a conversation to start chatting
      </div>
    );

  return (
    <div className="flex flex-col w-full h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading && <div>Loading messages...</div>}
        {messageList.map((msg) => {
          const isMine = msg.sender?.id === user?.id;
          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-3 py-2 rounded-2xl max-w-xs ${
                  isMine
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Box */}
      <div className="border-t p-3 flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend(); // send on Enter
          }}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
