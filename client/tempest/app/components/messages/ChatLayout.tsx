"use client";
import { useState } from "react";
import ChatSidebar from "./ChatSideBar";
import ChatWindow from "./ChatWindow";

export default function ChatLayout() {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  return (
    <div className="flex h-[80vh] border rounded-2xl overflow-hidden bg-white shadow">
      <ChatSidebar
        onSelectConversation={(id) => setSelectedConversationId(id)}
        selectedId={selectedConversationId || undefined}
      />
      <div className="flex-1">
        <ChatWindow conversationId={selectedConversationId} />
      </div>
    </div>
  );
}
