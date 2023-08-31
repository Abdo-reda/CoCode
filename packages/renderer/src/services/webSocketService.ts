import IO from 'socket.io-client';

const lowerAlphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
const upperAlphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
const numbers = Array.from({ length: 10 }, (_, i) => i.toString());

const roomCharacters: string[] = [...lowerAlphabet, ...upperAlphabet, ...numbers, '@', '#'];

const reverseRoomCharacter: Record<string, number> = {};
roomCharacters.forEach((char, index) => {
    reverseRoomCharacter[char] = index;
});

export function getRoomCode(address: string) {
    const numbers = address.split('.');
    const roomCode = numbers.map(num => roomCharacters[parseInt(num)]).join('');
    return roomCode;
}

export function getAddress(roomCode: string){
    const chars = roomCode.split('');
    const address = chars.map(char => reverseRoomCharacter[char]).join('.');
    return address;
}

export function connectSocket(roomCode: string) {
    console.log(getRoomCode('127.0.0.1'));
    console.log('client is trying to connect ...');
    console.log('address', getAddress(roomCode));
    const socket = IO('http://127.0.0.1:8899'); //this address will depend on the server
    return socket;
}
