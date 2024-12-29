const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const signallingServer = require("./signalling/signallingServer");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

//  signalling server
signallingServer(io);

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
