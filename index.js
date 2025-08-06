const http = require("http");
const { Server } = require("socket.io");
const process = require("process");
require("dotenv").config();
const app = require("./app");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("socket.io client connected");

  socket.on("message", (message) => {
    socket.broadcast.emit("message", message);
  });
  socket.on("join_room", ({ module, moduleId }) => {
    const room = `${module}-${moduleId}`;
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("socket.io client disconnected");
  });
  socket.on("error", (error) => {
    console.log(`socket.io error message: ${error.message}`);
  });
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(` Server running on port ${port}`);
});
