import type { Socket } from 'socket.io-client';
import IO from 'socket.io-client';
import { ref, reactive } from 'vue';
import electronService from './electronService';
import type { IClient} from './clientService';
import { newClient } from './clientService';

const lowerAlphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
const upperAlphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
const numbers = Array.from({ length: 10 }, (_, i) => i.toString());

const codesMap: string[] = [...lowerAlphabet, ...upperAlphabet, ...numbers, '@', '#'];

const reverseCodesMap: Record<string, number> = {};
codesMap.forEach((char, index) => {
  reverseCodesMap[char] = index;
});

const PORT = 8899;
let clientSocket: Socket;

// function dec2bin(dec: number) {
//   return (dec >>> 0).toString(2);
// }

function addressToIp(ipAddress: string): number
{
  const segments = ipAddress.split('.').map(segment => parseInt(segment));
  let ip32Bit = 0;
  segments.forEach((value, index) => {
    ip32Bit = ip32Bit | (value << 8*(3-index));
  });
  return ip32Bit >>> 0;
}


function ipToRoomNum(ip32Bit: number): number[]
{
  const roomNumbers = [];
  for (let i = 0; i < 6; i++) {
    const curNum = (ip32Bit >>> (30 - (i * 6))) & 0b111111;
    roomNumbers.push(curNum);
  }
  return roomNumbers;
}


function roomNumToRoomCode(roomNumbers: number[]): string
{
  return roomNumbers.map(num => codesMap[num]).join('');
}


function roomCodeToRoomNum(roomCode: string): number[]
{
  const codes = roomCode.split('');
  const roomNumbers = codes.map(code => reverseCodesMap[code]);
  return roomNumbers;
}


function roomNumToIp(roomNumbers: number[]): number
{
  let ip32Bit = 0;
  roomNumbers.forEach((value, index) => {
    ip32Bit = ip32Bit | (value << 6*(5-index));
  });
  return ip32Bit >>> 0;
}


function ipToAddress(ip32Bit: number): string
{
  let address = '';
  for (let i =0; i<4; i++) {
    address +=  ((i===0) ? '' : '.') + ((ip32Bit >>> (8* (3-i) )) & 255).toString();
  }
  return address;
}

export const isConnected = ref(false);
export const connectError = reactive({
  error: false,
  message: '',
});
export const clientRef = reactive<IClient>({
  name: '',
  uuid: '',
  content: '',
});

/**
 * Gets the room code from a given ip address.
 * The process is address --> ip (32bit) --> roomNumbers --> roomCode
 * @param address: string
 * @returns roomCode: string
*/
export function getRoomCode(address: string): string
{
  const ip32Bit = addressToIp(address);
  const roomNumbers = ipToRoomNum(ip32Bit);
  const roomCode = roomNumToRoomCode(roomNumbers);
  return roomCode;
}

/**
 * Gets the ip address from a given room code.
 * The process is roomCode --> roomNumbers --> ip (32bit) --> address
 * @param roomCode: string
 * @returns
*/
export function getAddress(roomCode: string): string
{
    const roomNumbers = roomCodeToRoomNum(roomCode);
    const ip32Bit = roomNumToIp(roomNumbers);
    const address = ipToAddress(ip32Bit);

    return address;
}

/**
 * Tries to establish a socket connection with the host.
 * @param roomCode: string
 * @returns socket: Socket
 */
export function connectSocket(roomCode: string): Socket
{
    const address = getAddress(roomCode);
    const socket = IO(`ws://${address}:${PORT}`, {
      timeout: 15000,
    });  //TODO: should it be https longpolling or ws or wss?
    return socket;
}

/**
 * Tries to connect the client to the host socket and subscribes to socket events.
 * @param clientName : string
 * @param roomCode : string
 * @returns
 */
export function connectClient(clientName: string, roomCode: string): Socket
{
    const socket = connectSocket(roomCode);
    socket.on('connect', () => {
      console.log(`${clientName} connected to socket ${socket.id}`);
      const createdClient: IClient = newClient(clientName);
      socket.emit('client-join', createdClient);
      clientRef.uuid = createdClient.uuid;
      isConnected.value = true;
    });

    socket.on('disconnect', (_) => {
      console.log(`${clientName} has disconnected from socket ${socket.id}`);
      isConnected.value = false;
    });

    socket.on('connect_error', (error) => {
      console.log(`${clientName} error connecting on socket`);
      isConnected.value = false;
      connectError.error = true;
      connectError.message = error.message;
      socket.disconnect();
    });

    socket.io.on('reconnect_attempt', () => {
      // current reconnection attempt is starting ...
      console.log(`${clientName} is attempting to reconnect on socket`);
    });

    socket.io.on('reconnect_error', (_) => {
      // current reconnect attempt failed
      console.log(`${clientName} reconnection attempt failed`);
    });

    socket.io.on('reconnect_failed', () => {
      // all reconnection attemps have failed 
      console.log(`${clientName} all reconnection attempt have failed`);
    });
    
    socket.io.on('reconnect', () => {
      // successful reconnection
      console.log(`${clientName} successful reconnection`);
    });

    clientSocket = socket;
    return socket;
}

export function getClientSocket(): Socket
{
  return clientSocket;
}

export function hostServer() {
  electronService.hostServer();
}
