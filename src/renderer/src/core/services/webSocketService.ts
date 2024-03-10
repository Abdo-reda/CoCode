import type {Socket} from 'socket.io-client';
import IO from 'socket.io-client';
import {ref, reactive} from 'vue';
import type {IClient} from '@renderer/core/interfaces/clientInterface';
// import {newClient} from './clientService';
// import { v4 as uuidv4 } from 'uuid';
import { IHost } from '@renderer/core/interfaces/hostInterface';
import useElectron from '../composables/useElectron';

//TODO: this fucking file is a mess, should seperate into seperate classes, composables and so on ...

const electronService = useElectron();
const lowerAlphabet = Array.from({length: 26}, (_, i) => String.fromCharCode(97 + i));
const upperAlphabet = Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i));
const numbers = Array.from({length: 10}, (_, i) => i.toString());
const codesMap: string[] = [...lowerAlphabet, ...upperAlphabet, ...numbers, '@', '#'];
const reverseCodesMap: Record<string, number> = {};

codesMap.forEach((char, index) => {
  reverseCodesMap[char] = index;
});

// function dec2bin(dec: number) {
//   return (dec >>> 0).toString(2);
// }

function addressToIp(ipAddress: string): number {
  const segments = ipAddress.split('.').map(segment => parseInt(segment));
  let ip32Bit = 0;
  segments.forEach((value, index) => {
    ip32Bit = ip32Bit | (value << (8 * (3 - index)));
  });
  return ip32Bit;
}

function ipToRoomNum(ip32Bit: number): number[] {
  const roomNumbers = [];
  for (let i = 0; i < 6; i++) {
    const curNum = (ip32Bit >>> (30 - i * 6)) & 0b111111;
    roomNumbers.push(curNum);
  }
  return roomNumbers;
}

function roomNumToRoomCode(roomNumbers: number[]): string {
  return roomNumbers.map(num => codesMap[num]).join('');
}

function roomCodeToRoomNum(roomCode: string): number[] {
  const codes = roomCode.split('');
  const roomNumbers = codes.map(code => reverseCodesMap[code]);
  return roomNumbers;
}

function roomNumToIp(roomNumbers: number[]): number {
  let ip32Bit = 0;
  roomNumbers.forEach((value, index) => {
    ip32Bit = ip32Bit | (value << (6 * (5 - index)));
  });
  return ip32Bit;
}

function ipToAddress(ip32Bit: number): string {
  let address = '';
  for (let i = 0; i < 4; i++) {
    address += (i === 0 ? '' : '.') + ((ip32Bit >>> (8 * (3 - i))) & 255).toString();
  }
  return address;
}

export const isConnected = ref(false);
export const connectError = reactive({
  error: false,
  message: '',
});


/**
 * Gets the room code from a given ip address.
 * The process is address --> ip (32bit) --> roomNumbers --> roomCode
 * @param address: string
 * @returns roomCode: string
 */
export function getRoomCode(address: string): string {
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
export function getAddress(roomCode: string): string {
  const roomNumbers = roomCodeToRoomNum(roomCode);
  const ip32Bit = roomNumToIp(roomNumbers);
  const address = ipToAddress(ip32Bit);

  return address;
}

export class HostPeerWS implements IHost {

  name: string = 'Host';
  roomId: string = '';
  isHosting: boolean = false;

  public async hostRoom(): Promise<string> {
    //TODO: if the host is already hosting, then there is no need to host again.
    //FIX THIS TO MAKE AN ASYNC FUNCTION !! don't forget to try and catch
    electronService.hostServer();
    return 'temp'; 
  }

  public destroy(): void {
    // electronService.closeServer();
    // do other stuff to close the connection and clean yourself up BOY!
  }
}


//TODO: fix later, make it implements IClient
export class ClientPeerWS {

  clientSocket: Socket = IO(); //Dummy Socket or null? can I use the same socket object to connect to another port or http?
  isConnected: boolean = false;
  name: string = '';
  uuid: string = '';
  connectError = reactive({
    error: false,
    message: '',
  });
  
  
  private PORT = 8899;
  

  constructor() {}


  /**
   * Tries to connect the client to the host socket and subscribes to socket events.
   * @param clientName : string
   * @param roomCode : string
   * @returns
   */
  public async connect(clientName: string, roomCode: string): Socket {
    this.setInfo(clientName);
    this.clientSocket = this.connectSocket(roomCode);
    //Subscribe to the socket events, however
      //if everytime we are creating a new oscket object, then we need to register for the events everytime.
      //otherwise, we only to register once.
    return this.clientSocket;
  }

  /**
   * Tries to establish a socket connection with the host.
   * @param roomCode: string
   * @returns socket: Socket
   */
  private connectSocket(roomCode: string): Socket {
    //TODO: check if the client is already connected to the same address, if so, then no need to connect them again, maybe then only update their name.
    const address = getAddress(roomCode);
    const socket = IO(`ws://${address}:${this.PORT}`, {
      timeout: 15000,
      secure: false,
    });
    return socket;
  }


  private registerSocketEvents(): void {

    const clientName = this.clientInfo.name;
    this.clientSocket.on('connect', () => {
      console.log(`${clientName} connected to socket ${this.clientSocket.id}`);
      const createdClient: IClient = newClient(clientName);
      this.clientSocket.emit('client-join', createdClient);
      clientRef.uuid = createdClient.uuid;
      isConnected.value = true;
    });

    this.clientSocket.on('disconnect', _ => {
      console.log(`${clientName} has disconnected from socket ${this.clientSocket.id}`);
      isConnected.value = false;
    });

    this.clientSocket.on('connect_error', error => {
      console.log(`${clientName} error connecting on socket`);
      isConnected.value = false;
      connectError.error = true;
      connectError.message = error.message;
      this.clientSocket.disconnect();
    });

    this.clientSocket.io.on('reconnect_attempt', () => {
      // current reconnection attempt is starting ...
      console.log(`${clientName} is attempting to reconnect on socket`);
    });

    this.clientSocket.io.on('reconnect_error', _ => {
      // current reconnect attempt failed
      console.log(`${clientName} reconnection attempt failed`);
    });

    this.clientSocket.io.on('reconnect_failed', () => {
      // all reconnection attemps have failed
      console.log(`${clientName} all reconnection attempt have failed`);
    });

    this.clientSocket.io.on('reconnect', () => {
      // successful reconnection
      console.log(`${clientName} successful reconnection`);
    });
  }

  private setInfo(clientName: string) {
    this.clientInfo.name = clientName;
    if (this.clientInfo.uuid === '') this.clientInfo.uuid = crypto.randomUUID(); //uuidv4();
  }

}
