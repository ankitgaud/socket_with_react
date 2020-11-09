const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require('cors')
const bodyParser = require('body-parser') 


const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

let name_spaces = ["namespace", "namespace1"]

var nsp = io.of(`/${name_spaces[0]}`);
nsp.on('connection', function(socket) {
    console.log("someone connected!")
   socket.on('text2', function(data) {
    nsp.emit('text3', data);
 })
});



server.listen(port, () => console.log(`Listening on port ${port}`));