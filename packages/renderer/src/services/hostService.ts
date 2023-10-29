import { HostPeerRTC } from '/@/services/WebRTC/webRTCHostPeer';
import { HostPeerWS } from './webSocketService';
import { type IHost } from '/@/utils/interfaces/hostInterface'

let hostRTCInstance: HostPeerRTC | null = null;
let hostWSInstance: HostPeerWS | null = null;


export function GetHost(): IHost | null {
    return hostRTCInstance ?? hostWSInstance;
}

/**
 * Returns a webRTC host instance, if one doesn't exist it will destroy any other existing host instances and a new create one.
 * @returns IHost
 */
export function GetHostWebRTC(): IHost {
    if (hostRTCInstance) return hostRTCInstance;
    if (hostWSInstance) {
        hostWSInstance.destroy();
        hostWSInstance = null;
    }
    hostRTCInstance = new HostPeerRTC();
    return hostRTCInstance;
}

/**
 * Returns a websocket host instance, if one doesn't exist it will destroy any other existing host instances and a new create one.
 * @returns IHost
 */
export function GetHostWebSockets(): IHost {
    if (hostWSInstance) return hostWSInstance;
    if (hostRTCInstance) {
        hostRTCInstance.destroy();
        hostRTCInstance = null;
    }
    hostWSInstance = new HostPeerWS();
    return hostWSInstance;
}

export function DestroyHost(): void {
    if (hostRTCInstance) {
        hostRTCInstance.destroy();
        hostRTCInstance = null;
    }
    if (hostWSInstance) {
        hostWSInstance.destroy();
        hostWSInstance = null;
    }
}
