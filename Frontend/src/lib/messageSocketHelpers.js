import { store } from "../redux/store"; // Import your configured Redux store

let socket;

export const setSocketInstance = (socketInstance) => {
  socket = socketInstance;
};

export const subscribeToMessages = () => {
  if (!socket) return;

  socket.on("newMessage", (newMessage) => {
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
