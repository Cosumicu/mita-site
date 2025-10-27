"use client";
import { useAppSelector, useAppDispatch } from "@/app/lib/hooks";
import { getConversationList } from "@/app/lib/features/messages/messageSlice";
import { useEffect } from "react";

type Props = {
  onSelectConversation: (id: string) => void;
  selectedId?: string;
};

export default function ChatSidebar({
  onSelectConversation,
  selectedId,
}: Props) {
  const dispatch = useAppDispatch();
  const { conversationList, isLoading } = useAppSelector(
    (state) => state.message
  );

  useEffect(() => {
    dispatch(getConversationList());
  }, [dispatch]);

  if (isLoading) return <div className="p-4">Loading conversations...</div>;

  return (
    <div className="w-full md:w-1/3 border-r border-gray-200 h-full overflow-y-auto">
      {conversationList.length === 0 && (
        <div className="p-4 text-gray-500">No conversations yet</div>
      )}
      {conversationList.map((conv) => (
        <div
          key={conv.id}
          onClick={() => onSelectConversation(conv.id)}
          className={`p-4 cursor-pointer hover:bg-gray-100 ${
            conv.id === selectedId ? "bg-gray-100" : ""
          }`}
        >
          <p className="font-semibold text-gray-800">
            {conv.landlord?.username || conv.guest?.username}
          </p>
          <p className="text-sm text-gray-500 truncate">
            Reservation: {conv.reservation?.id}
          </p>
        </div>
      ))}
    </div>
  );
}
