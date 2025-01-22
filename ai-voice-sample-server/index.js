const express = require("express");
const https = require("https");
const fs = require("fs");
const app = express();
require("dotenv").config();
const cors = require("cors");
const CallingRouter = require("./routes/CallingRoute");

const port = process.env.PORT || 4001;
//const host = process.env.HOST || "localhost";

// Middleware
// app.use(express.json());
app.use(cors());

// Routes
app.use("/voiceAgent", CallingRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// HTTPS options
// const options = {
//   key: fs.readFileSync("./server.key"),
//   cert: fs.readFileSync("./server.cert"),
// };

// // Create HTTPS server
// const server = https.createServer(options, app);

// // Start the server
// server.listen(port, host, () => {
//   console.log(`Server is listening at https://${host}:${port}`);
// });

app.listen(port, () => {
  console.log(`Server is listening at ${port}`);
});
