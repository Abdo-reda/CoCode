import {Server} from 'socket.io';
// import { networkInterfaces  } from 'os';


export default function createWebSocketServer() {
  
  //TODO: for now I will hardcode the port ... I guess ...
  //TODO: I will check whether the server has been created successfully or not later  ...
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

  return wsServer;
}

// export function getIpAddress () {

//   // const nets = networkInterfaces();
//   // const addresses = Object.create(null);
//   // for (const name of Object.keys(nets)) {
//   //   for (const net of nets[name] ?? []) {
//   //       const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
//   //       if (net.family === familyV4Value && !net.internal) {
//   //           if (!addresses[name]) {
//   //             addresses[name] = [];
//   //           }
//   //           addresses[name].push(net.address);
//   //       }
//   //   }
//   // }

// }