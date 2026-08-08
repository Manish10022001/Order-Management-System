import { Server, Socket } from "socket.io";
let io: Server;

const getStoreRoom = (storeId: string): string => {
  return `store:${storeId}`;
};

const handleStoreJoin = (socket: Socket, storeId: string) => {
  if (!storeId || typeof storeId !== "string") {
    return;
  }

  const room = getStoreRoom(storeId);

  socket.join(room);

  console.log(`Socket ${socket.id} joined ${room}`);
};

const handleStoreLeave = (socket: Socket, storeId: string) => {
  if (!storeId || typeof storeId !== "string") {
    return;
  }

  const room = getStoreRoom(storeId);

  socket.leave(room);

  console.log(`Socket ${socket.id} left ${room}`);
};

export const initializeSocket = (socketServer: Server) => {
  io = socketServer;
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.on("store:join", (storeId: string) => {
      handleStoreJoin(socket, storeId);
    });

    socket.on("store:leave", (storeId: string) => {
      handleStoreLeave(socket, storeId);
    });
    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id} - ${reason}`);
    });
  });
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};
export const getStoreRoomName = (storeId: string): string => {
  return getStoreRoom(storeId);
};
