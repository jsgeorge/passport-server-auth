const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const router = require("./router");
const mongoose = require("mongoose");
const cors = require("cors");
//require("dotenv").config();

//mongo DB
mongoose.connect(
  "mongodb://localhost:27017/auth" || "mongodb://localhost/react/auth"
);

//App setup
app.use(morgan("combined"));
app.use(cors());
app.use(bodyParser.json({ type: "*/*" }));
router(app);

//Server Setup
const port = process.env.PORT || 3002;
const server = http.createServer(app);
server.listen(port);
console.log("Server listening on:", port);
