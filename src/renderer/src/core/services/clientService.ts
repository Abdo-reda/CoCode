import { ClientPeerRTC } from './webRTCService';
// import { ClientPeerWS } from './webSocketService';
import { IClient } from '@renderer/core/interfaces/clientInterface'

let clientWebRTC: ClientPeerRTC | null = null;
let clientWebSockets: ClientPeerRTC | null = null; //TODO: change to ClientPeerWS

export function GetClient(): IClient | null {
    return clientWebRTC ?? clientWebSockets; 
}

/**
 * Returns a webRTC host instance, if one doesn't exist it will destroy any other existing host instances and a new create one.
 * @returns IHost
 */
export function GetClientWebRTC(): IClient {
    if (clientWebRTC) return clientWebRTC;
    if (clientWebSockets) {
        clientWebSockets.destroy();
        clientWebSockets = null;
    }
    clientWebRTC = new ClientPeerRTC();
    return clientWebRTC;
}

/**
 * Returns a websocket host instance, if one doesn't exist it will destroy any other existing host instances and a new create one.
 * @returns IHost
 */
export function GetClientWebSockets(): IClient {
    if (clientWebSockets) return clientWebSockets;
    if (clientWebRTC) {
        clientWebRTC.destroy();
        clientWebRTC = null;
    }
    clientWebSockets = new ClientPeerRTC(); //TODO: change to ClientPeerWS
    return clientWebSockets
}

export function DestroyClient(): void {
    if (clientWebRTC) {
        clientWebRTC.destroy();
        clientWebRTC = null;
    }
    if (clientWebSockets) {
        clientWebSockets.destroy();
        clientWebSockets = null;
    }
}


//This probably doesn't need to be reactive, every client class will have a client object singlton instance which we can use throughout the session. so we probably don't need the stuff below
// const clientRef = reactive<IClient>({
//     name: '',
//     uuid: '',
// });

// export default function getClient(name: string): IClient
// {
//     if (clientRef.uuid = '') {
//         clientRef.name = name;
//         clientRef.uuid = uuidv4();
//         return clientRef;
//     }

//     return clientRef;
// }