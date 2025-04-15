import { connectSocket } from "./socket";
import { setOnlineUsers } from "../redux/authSlice";
import {
  setSocketInstance,
  setReduxStore,      // ✅ NEW
  subscribeToMessages,
} from "./messageSocketHelpers";

export const initializeSocketEvents = (userId, dispatch, store) => {
  const socket = connectSocket(userId);

  if (!socket) return;

  setSocketInstance(socket);
  setReduxStore(store);       // ✅ Pass store to avoid circular import
  subscribeToMessages();

  socket.on("getOnlineUsers", (userIds) => {
    dispatch(setOnlineUsers(userIds));
  });
};
