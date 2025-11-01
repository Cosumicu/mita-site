"use client";

import { useAppSelector, useAppDispatch } from "@/app/lib/hooks";
import { getConversationList } from "@/app/lib/features/messages/messageSlice";
import { useEffect } from "react";
import { Avatar } from "antd";
import useApp from "antd/es/app/useApp";

type Props = {
  onSelectConversation: (id: string) => void;
  selectedId?: string;
};

export default function ChatSidebar({
  onSelectConversation,
  selectedId,
}: Props) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { data: conversationList, loading: conversationListLoading } =
    useAppSelector((state) => state.message.conversationList);

  useEffect(() => {
    dispatch(getConversationList());
  }, [dispatch]);

  if (conversationListLoading)
    return <div className="p-6 text-gray-600">Loading conversations...</div>;

  return (
    <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 h-full">
      <div className="flex-1 overflow-y-auto">
        {conversationList.length === 0 && (
          <div className="p-6 text-gray-500 text-center">
            No conversations yet
          </div>
        )}
        {conversationList.map((conv) => {
          const isMe = conv.landlord.id == user?.id;
          return (
            <div
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={`p-5 transition-all duration-200 cursor-pointer border-b border-gray-100 ${
                conv.id === selectedId
                  ? "bg-blue-50 hover:bg-blue-100"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="flex gap-2">
                <div>
                  {" "}
                  <Avatar
                    size="large"
                    src={
                      isMe
                        ? conv.guest.profile_picture
                        : conv.landlord.profile_picture
                    }
                  ></Avatar>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-lg">
                    {isMe ? conv.guest.username : conv.landlord.username}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    Reservation: {conv.reservation?.id}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
