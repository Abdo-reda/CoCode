import {Server} from 'socket.io';
import {writeFile, appendFile, truncate, statSync } from 'node:fs';

writeFile('test.txt', '', _ => {});

export default function createWebSocketServer() {
  //TODO: for now I will hardcode the port ... I guess ...
  const wsServer = new Server(8899, {
    connectTimeout: 45000, //The number of ms before disconnecting a client that has not successfully joined a namespace.
    // path: 'string', //this path must match in both the client and server, can be used for security stuff later.
    // serveClient: false,    //Whether to serve the client files, the default is true for some reason?.
    // allowRequest: () => {}, //this is a callback function that receives a given handshake or upgrade request as its first parameter, and can decide whether to continue or not.
    cors: {
      origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5173'],
    }, //you can allow origins here, even allow stuff depending on whether production or development
    // maxHttpBufferSize: 1e6 (1MB), max data that can be sent in a single messege
    // pingInterval: 25000, //how often to ping the client
    // pingTimeout: 20000, //how long to wait for a ping response
  });
  console.log('---- sockets');
  wsServer.on('connection', socket => {
    console.log('a user connected', socket.id);
    socket.on('client-add', (content, _) => {
      console.log('client-add', content);
      appendFile('test.txt', content, _ => {});
    });
    socket.on('client-del', (content, _) => {
      console.log('client-del', content);
      const numBytes = statSync('test.txt').size - Buffer.byteLength(content, 'utf8');
      truncate('test.txt', numBytes, _ => {});
    });
  });

  return wsServer;
}

// const io = new Server()

//-----------------------

// const express = require('express');
// const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);

// io.on('connection', (socket) => {
//   console.log('a user connected');
// });

// server.listen(3000, () => {
//   console.log('listening on *:3000');
// });

//-----------------------

// const io = require("socket.io");
// const server = io.listen(3000);
// server.on("connection", function(socket) {
//   console.log("user connected");
//   socket.emit("welcome", "welcome man");
// });
