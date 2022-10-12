const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const app = express();

const port = 3000;

const server = http.createServer(app);

const serverSocket = new Server(server);

app.use(express.static(__dirname));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const roomId = 1;

class User {
  constructor(id) {
    this.id = id;
    this.xPos = 0;
    this.yPos = 0;
  }
  setPosX(change) {
    this.xPos += change;
  }
  setPosY(change) {
    this.yPos += change;
  }
}

class Room {
  constructor() {
    this.id = 1;
    this.userSet = new Set();
  }
  addUser(user) {
    this.userSet.add(user);
  }
  delUser(user) {
    this.userSet.delete(user);
  }
}
const room = new Room();

setInterval(()=>serverSocket.to(room.id).emit("status", JSON.stringify(Array.from(room.userSet))), 100);

serverSocket.on("connection", (clientSocket) => {
  console.log("Socket connection established", clientSocket.id);
  clientSocket.join(roomId);
  const user = new User(clientSocket.id);
  room.addUser(user);
  clientSocket.on("disconnect", () => {
    console.log("Socket disconnection!", clientSocket.id);
    room.delUser(user);
  });

  clientSocket.on("left", () => {
    user.setPosX(1);
  });
  clientSocket.on("right", () => {
    user.setPosX(-1);
  });
  clientSocket.on("up", () => {
    user.setPosY(1);
  });
  clientSocket.on("down", () => {
    user.setPosY(-1);
  });
});

server.listen(port, () => {
  console.log("server open...");
});
