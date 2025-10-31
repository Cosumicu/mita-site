"use client";

import { useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/lib/hooks";
import {
  getConversationMessages,
  addMessage,
} from "@/app/lib/features/messages/messageSlice";
import Avatar from "antd/es/avatar/Avatar";

type Props = { conversationId: string | null };

export default function ChatWindow({ conversationId }: Props) {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { messageList, isLoading } = useAppSelector((state) => state.message);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [text, setText] = useState("");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    dispatch(getConversationMessages(conversationId));

    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${conversationId}/`);

    ws.onopen = () => console.log("WebSocket connected!");
    ws.onclose = () => console.log("WebSocket closed.");
    ws.onerror = (e) => console.error("WebSocket error:", e);

    // This block of code is a listener
    // Every time backend call [chat_message], this code runs
    // NOTE:
    // websockets always returns a string, therefore, we parse it
    // ======================================================
    ws.onmessage = (event) => {
      const { type, ...message } = JSON.parse(event.data);
      dispatch(addMessage(message)); // appends the message into the [conversationMessages]
    };
    // ======================================================

    socketRef.current = ws;
    return () => ws.close();
  }, [conversationId, dispatch]);

  const isConnected = () => socketRef.current?.readyState === WebSocket.OPEN;

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log("WebSocket connected?", isConnected());
  //   }, 2000);
  //   return () => clearInterval(interval);
  // }, []);

  const handleSend = () => {
    if (!socketRef.current || !text.trim() || !user) return;

    socketRef.current.send(
      JSON.stringify({
        conversation_id: conversationId,
        sender_id: user.id,
        text,
      })
    );

    setText("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 mb-10">
        {isLoading && <div>Loading messages...</div>}

        {messageList.map((msg) => {
          const isMe = msg.sender.id === user?.id;
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              {!isMe && (
                <Avatar size="large" src={msg.sender.profile_picture}></Avatar>
              )}
              <div
                className={`px-3 py-2 rounded-2xl max-w-xs ${
                  isMe ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
                }`}
              >
                {msg.text}
              </div>
              {isMe && (
                <Avatar size="large" src={msg.sender.profile_picture}></Avatar>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="fixed bg-white bottom-0 border-t p-3 flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type a message..."
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
