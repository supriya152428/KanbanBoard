import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let tasks = [];

io.on("connection", (socket) => {
  console.log("Client connected");

  // send all tasks initially
  socket.emit("sync:tasks", tasks);

  socket.on("task:create", (task) => {
    tasks.push(task);
    io.emit("task:create", task);
  });

  socket.on("task:move", ({ id, newColumn }) => {
    tasks = tasks.map(t =>
      t.id === id ? { ...t, column: newColumn } : t
    );
    const updated = tasks.find(t => t.id === id);
    io.emit("task:update", updated);
  });

  socket.on("task:delete", (id) => {
    tasks = tasks.filter(t => t.id !== id);
    io.emit("task:delete", id);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(4001, () => {
  console.log("Backend running on 4001");
});
