let socket;

export const setSocketInstance = (socketInstance) => {
  socket = socketInstance;
};

export const subscribeToMessages = () => {
  socket.on("newMessage", (newMessage) => {
    console.log("New incoming message:", newMessage); // 👀 See if this runs
  
    const selectedUser = store.getState().messages.selectedUser;
    if (!selectedUser || newMessage.senderId !== selectedUser._id) return;
  
    store.dispatch({
      type: "messages/addMessageExternally",
      payload: newMessage,
    });
  });
};

export const unsubscribeFromMessages = () => {
  if (!socket) return;
  socket.off("newMessage");
};
