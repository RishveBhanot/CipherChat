import { connectSocket } from "./socket";
import { setOnlineUsers } from "../redux/authSlice";

export const initializeSocketEvents = (userId, dispatch) => {
  const socket = connectSocket(userId);

  if (!socket) return;

  socket.on("getOnlineUsers", (userIds) => {
    dispatch(setOnlineUsers(userIds));
  });
};
