const http = require("http");
const { Server } = require("socket.io");
const process = require("process");
require("dotenv").config();
const app = require("./app");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  }),
});
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

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(` Server running on port ${port}`);
});
