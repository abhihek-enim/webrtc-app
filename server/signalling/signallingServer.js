module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("A user is connected ", socket.id);

    // handle room joining
    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", socket.id);
    });

    // Handle signalling data
    socket.on("signal", ({ roomId, data }) => {
      socket.to(roomId).emit("signal", { senderId: socket.id, data });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};
