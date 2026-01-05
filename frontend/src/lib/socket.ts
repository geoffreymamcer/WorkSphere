import { io } from "socket.io-client";
import { config } from "../config/config";

// Singleton socket instance
export const socket = io(config.API_URL, {
  autoConnect: false, // Wait for auth
  withCredentials: true,
});

export const connectSocket = (token: string) => {
  socket.auth = { token };
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
