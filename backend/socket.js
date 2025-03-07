const socketIo = require("socket.io");

let io;

module.exports = {
  init: (server) => {
    io = socketIo(server, {
      cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
    });

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  },

  getIo: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};