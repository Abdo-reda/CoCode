import type { Socket } from 'socket.io-client';
import IO from 'socket.io-client';

const lowerAlphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
const upperAlphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
const numbers = Array.from({ length: 10 }, (_, i) => i.toString());

const codesMap: string[] = [...lowerAlphabet, ...upperAlphabet, ...numbers, '@', '#'];

const reverseCodesMap: Record<string, number> = {};
codesMap.forEach((char, index) => {
  reverseCodesMap[char] = index;
});

const PORT = 8899;

function dec2bin(dec: number) {
  return (dec >>> 0).toString(2);
}


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
  console.log(ip32Bit, dec2bin(ip32Bit));
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
    const socket = IO(`ws://${address}:${PORT}`);  //TODO: should it be https longpolling or ws or wss?
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
      socket.emit('client-join', {
        clientName: clientName,
      });
    });

    socket.on('disconnect', (_) => {
      console.log(`${clientName} has disconnected from socket ${socket.id}`);
    });

    socket.on('connect_error', (_) => {
      console.log(`${clientName} error connecting on socket ${socket.id}`);
    });

    return socket;
}
