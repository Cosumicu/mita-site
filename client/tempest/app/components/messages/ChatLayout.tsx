"use client";
import { useState } from "react";
import ChatSidebar from "./ChatSideBar";
import ChatWindow from "./ChatWindow";

export default function ChatLayout() {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  return (
    <div className="fixed top-25 left-0 right-0 bottom-0 flex border rounded-none overflow-hidden bg-gradient-to-br from-gray-50 to-white shadow-xl">
      <ChatSidebar
        onSelectConversation={(id) => setSelectedConversationId(id)}
        selectedId={selectedConversationId || undefined}
      />
      <div className="flex-1 flex flex-col">
        <ChatWindow conversationId={selectedConversationId} />
      </div>
    </div>
  );
}
