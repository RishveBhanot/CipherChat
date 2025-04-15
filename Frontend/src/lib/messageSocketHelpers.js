let socket;
let reduxStore; // We'll assign it dynamically.

export const setSocketInstance = (socketInstance) => {
  socket = socketInstance;
};

export const setReduxStore = (store) => {
  reduxStore = store;
};

export const subscribeToMessages = () => {
  socket.on("newMessage", (newMessage) => {
    console.log("New incoming message:", newMessage);

    const selectedUser = reduxStore.getState().messages.selectedUser;
    if (!selectedUser || newMessage.senderId !== selectedUser._id) return;

    reduxStore.dispatch({
      type: "messages/addMessageExternally",
      payload: newMessage,
    });
  });
};

export const unsubscribeFromMessages = () => {
  if (!socket) return;
  socket.off("newMessage");
};
