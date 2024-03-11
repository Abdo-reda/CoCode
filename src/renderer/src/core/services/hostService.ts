import { HostPeerRTC } from './webRTCService';
import { HostPeerWS } from './webSocketService';
import { IHost } from '@renderer/core/interfaces/hostInterface'

let hostWebRTC: HostPeerRTC | null = null;
let hostWebSockets: HostPeerWS | null = null;


export function GetHost(): IHost | null {
    return hostWebRTC ?? hostWebSockets; 
}

/**
 * Returns a webRTC host instance, if one doesn't exist it will destroy any other existing host instances and a new create one.
 * @returns IHost
 */
export function GetHostWebRTC(): IHost {
    if (hostWebRTC) return hostWebRTC;
    if (hostWebSockets) {
        hostWebSockets.destroy();
        hostWebSockets = null;
    }
    hostWebRTC = new HostPeerRTC();
    return hostWebRTC;
}

/**
 * Returns a websocket host instance, if one doesn't exist it will destroy any other existing host instances and a new create one.
 * @returns IHost
 */
export function GetHostWebSockets(): IHost {
    if (hostWebSockets) return hostWebSockets;
    if (hostWebRTC) {
        hostWebRTC.destroy();
        hostWebRTC = null;
    }
    hostWebSockets = new HostPeerWS();
    return hostWebSockets
}

export function DestroyHost(): void {
    if (hostWebRTC) {
        hostWebRTC.destroy();
        hostWebRTC = null;
    }
    if (hostWebSockets) {
        hostWebSockets.destroy();
        hostWebSockets = null;
    }
}
