import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import { env } from "../config/env";
import { SOCKET_EVENTS } from "@inkspire/shared";

export function initSocketServer(httpServer: HttpServer): SocketServer {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: env.WEB_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    socket.on("post:join", (postId: string) => {
      socket.join(`post:${postId}`);
    });

    socket.on("post:leave", (postId: string) => {
      socket.leave(`post:${postId}`);
    });

    socket.on("user:join", (userId: string) => {
      socket.join(`user:${userId}`);
    });

    socket.on(
      SOCKET_EVENTS.USER_TYPING,
      ({
        postId,
        userId,
        name,
      }: {
        postId: string;
        userId: string;
        name: string;
      }) => {
        socket
          .to(`post:${postId}`)
          .emit(SOCKET_EVENTS.USER_TYPING, { userId, name });
      },
    );

    socket.on("disconnect", () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

let _io: SocketServer;
export function setIO(io: SocketServer) {
  _io = io;
}
export function getIO(): SocketServer {
  if (!_io) throw new Error("Socket.io not initialised");
  return _io;
}
