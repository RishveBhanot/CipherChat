import { connectSocket } from "./socket";
import { setOnlineUsers } from "../redux/authSlice";
import { setSocketInstance, subscribeToMessages } from "./messageSocketHelpers";

export const initializeSocketEvents = (userId, dispatch) => {
  const socket = connectSocket(userId);

  if (!socket) return;

  setSocketInstance(socket);

  subscribeToMessages();

  socket.on("getOnlineUsers", (userIds) => {
    dispatch(setOnlineUsers(userIds));
  });
};
