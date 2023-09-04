import {Server} from 'socket.io';
import {createServer} from 'https';
import {readFileSync} from 'fs';
// import { networkInterfaces  } from 'os';


export default function createWebSocketServer() {
  
  const privateKey = readFileSync('certificates/key.pem', 'utf8'); //fs.readFileSync('key.pem', 'utf8');
  const certificate = readFileSync('certificates/cert.pem', 'utf8');
  const credentials = { key: privateKey, cert: certificate, passphrase: 'secure' };
  // console.log('creating server ...', credentials);

  const httpsServer = createServer(credentials);
  const wsServer = new Server(httpsServer,{
      connectTimeout: 45000, //The number of ms before disconnecting a client that has not successfully joined a namespace.
      // path: 'string', //this path must match in both the client and server, can be used for security stuff later.
      // serveClient: false,    //Whether to serve the client files, the default is true for some reason?.
      // allowRequest: () => {}, //this is a callback function that receives a given handshake or upgrade request as its first parameter, and can decide whether to continue or not.
      cors: {
        origin: process.env.NODE_ENV === 'production' ? false : ['*'], //TODO: this is only for testing ... //http://localhost:5173  //https://abdo-reda.github.io/CoCode/
      }, //you can allow origins here, even allow stuff depending on whether production or development
      // maxHttpBufferSize: 1e6 (1MB), max data that can be sent in a single messege
      // pingInterval: 25000, //how often to ping the client
      // pingTimeout: 20000, //how long to wait for a ping response
  });

  httpsServer.listen(8899);

  // var ca = fs.readFileSync('YOUR SSL CA').toString();

  //TODO: for now I will hardcode the port ... I guess ...
  //TODO: I will check whether the server has been created successfully or not later  ...
  // const wsServer = new Server(8899, );



  return wsServer;
}

/* -------------- 



// var io = require('socket.io').listen(3456,{key:privateKey,cert:certificate,ca:ca});

*/


/* ------------------

    var options = {
        key: fs.readFileSync('./test_key.key'),
        cert: fs.readFileSync('./test_cert.crt'),
        ca: fs.readFileSync('./test_ca.crt'),

        requestCert: false,
        rejectUnauthorized: false
    }

    var server = https.createServer(options, app);
    server.listen(8080);

*/

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