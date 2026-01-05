import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { boardRepository } from "../repositories/board.repository";

interface AuthSocket extends Socket {
  user?: { userId: string; email: string };
}

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PATCH", "DELETE"],
      credentials: true,
    },
  });

  io.use((socket: AuthSocket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET as string) as {
        userId: string;
        email: string;
      };
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket: AuthSocket) => {
    console.log(`User connected: ${socket.user?.userId}`);

    // Join Board Room
    socket.on("join:board", async (boardId: string) => {
      if (!socket.user) return;

      // Security: Check if user has access to this board
      const hasAccess = await boardRepository.hasAccess(
        boardId,
        socket.user.userId
      );
      if (hasAccess) {
        socket.join(`board:${boardId}`);
        console.log(`User ${socket.user.userId} joined board:${boardId}`);
      } else {
        socket.emit("error", "Unauthorized access to board");
      }
    });

    // Leave Board Room
    socket.on("leave:board", (boardId: string) => {
      socket.leave(`board:${boardId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
};

// Helper to emit events from services
export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
