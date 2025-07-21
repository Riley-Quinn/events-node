const http = require("http");
const process = require("process");
require("dotenv").config();
const app = require("./app");

// Create HTTP server
const server = http.createServer(app);

// Start the HTTP server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(` Server running on port ${port}`);
});
