import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessages } from "../redux/messagesSlice";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";
import { subscribeToMessages, unsubscribeFromMessages } from "../lib/messageSocketHelpers";

const ChatContainer = () => {
  const messages = useSelector((state) => state.messages.messages);
  const selectedUser = useSelector((state) => state.messages.selectedUser);
  const isMessagesLoading = useSelector(
    (state) => state.messages.isMessagesLoading
  );
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  console.log("Authenticated User", authUser);

  console.log("Selected user in ChatContainer:", selectedUser);

  useEffect(() => {
    if (!selectedUser?._id) return;
  
    dispatch(getMessages(selectedUser._id));
  
    unsubscribeFromMessages(); // cleanup previous
    subscribeToMessages();     // setup new
  
    return () => unsubscribeFromMessages(); // cleanup on unmount
  }, [selectedUser._id, dispatch]);
  

  if (isMessagesLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          if (!message || !message.senderId) return null;
          return (
            <div
              key={message._id}
              className={`chat ${
                message.senderId === authUser._id ? "chat-end" : "chat-start"
              }`}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble flex flex-col gap-2 p-2">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          );
        })}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
