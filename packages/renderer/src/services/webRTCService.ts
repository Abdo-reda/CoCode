import type {
  DocumentData,
  DocumentReference} from 'firebase/firestore';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {firestore} from '/@/services/firebaseService';
import type { Ref} from 'vue';
import { ref } from 'vue';

//config webRTC - stun & turn servers
const config = {
  iceServers: [
    {
      urls: [
      'stun:stun.l.google.com:19302',
      'stun:stun1.l.google.com:19302',
      'stun:stun2.l.google.com:19302',
      'stun:stun3.l.google.com:19302',
      'stun:stun4.l.google.com:19302',
    ],
    },
  ],
  iceCandidatePoolSize: 10,
};

// 'stun:stun.services.mozilla.com:3478',

let hostPeerInstance: HostPeerRTC|null = null;
let clientPeerInstance: ClientPeerRTC|null = null;

export function GetHostPeer(): HostPeerRTC {
  if (!hostPeerInstance) hostPeerInstance = new HostPeerRTC();
  return hostPeerInstance;
}

export function GetClientPeer(): ClientPeerRTC {
  if (!clientPeerInstance) clientPeerInstance = new ClientPeerRTC();
  return clientPeerInstance;
}

export class PeerRTC {
  public peerConnection = new RTCPeerConnection(config);
  protected codeChannel: any;
  public connectionState: Ref<string> = ref('');

  constructor() {
    this.registerPeerConnectionListeners();
  }

  //I think this will only work for a peer, the ice candidates remoteName will change depending from one peer to another ... (
  protected async collectIceCandidates(
    roomRef: DocumentReference<DocumentData, DocumentData>,
    localName: string,
    remoteName: string,
  ) {
    const localCandidateCollection = collection(roomRef, localName);

    // If local peer finds an ice candidate(a possible route), send it signaling server and store it in its collection.
    this.peerConnection.addEventListener('icecandidate', event => {
      if (event.candidate === null) return;
        const body = event.candidate!.toJSON();
        addDoc(localCandidateCollection, body);
    });

    // If a remote peer updates its ice collection (possible routes), then add it to my list of ice candidates.
    const remoteCandidateCollection = collection(roomRef, remoteName);
    onSnapshot(remoteCandidateCollection, snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          this.peerConnection.addIceCandidate(candidate);
        }
      });
    });
  }


  private registerPeerConnectionListeners() {

    this.peerConnection.onconnectionstatechange = (_) => {
      this.connectionState.value = this.peerConnection.connectionState;
      //https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/connectionstatechange_event
    };

    // this.peerConnection.addEventListener('icegatheringstatechange', () => {
    //   console.log(`ICE gathering state changed: ${this.peerConnection.iceGatheringState}`);
    // });

    // this.peerConnection.addEventListener('connectionstatechange', () => {
    //   console.log(`Connection state change: ${this.peerConnection.connectionState}`);
    // });

    // this.peerConnection.addEventListener('signalingstatechange', () => {
    //   console.log(this.peerConnection);
    //   console.log(`Signaling state change: ${this.peerConnection.signalingState}`);
    // });

    // this.peerConnection.addEventListener('iceconnectionstatechange', () => {
    //   console.log(`ICE connection state change: ${this.peerConnection.iceConnectionState}`);
    // });

    // this.peerConnection.addEventListener('icecandidateerror', () => {
    //   console.log(`ICE connection error, restartIee method?:`);
    //   this.peerConnection.restartIce()
    // })

    // this.peerConnection.addEventListener('negotiationneeded', () => {
    //   console.log('Negiotation needed ....');
    // })
  }
}

export class HostPeerRTC extends PeerRTC {

  constructor() {
    super();
    this.setupCodeChannel();
  }


  /**
   * Tries to establish a WebRTC connection.
   * Its creates a Room/Offer and sends it to the signaling server.
   * Listens for answers from other Peers.
   * Listens for data channels from other Peers.
   * It also starts sending and storing local and remote ice candidates.
   * @returns a promise<string> containing the roomID
   */
  public async hostRoom(): Promise<string> {

    //generate offer and store in signaling server
    const offer = await this.peerConnection.createOffer();
    const roomWithOffer = {
      offer: {
        type: offer.type,
        sdp: offer.sdp,
      },
    };
    const roomRef = await addDoc(collection(firestore, 'rooms'), roomWithOffer);
    const roomId = roomRef.id;
    console.log('---- Creating room', roomId);

    this.collectIceCandidates(roomRef, 'offerCandidates', 'answerCandidates');
    await this.peerConnection.setLocalDescription(offer);

    //Listen for an answer that will be generated by another Peer, and set it to be the remote dession description.
    onSnapshot(roomRef, async (snapshot: any) => {
      const data = snapshot.data();
      if (!this.peerConnection.currentRemoteDescription && data.answer) {
        const answer = new RTCSessionDescription(data.answer);
        await this.peerConnection.setRemoteDescription(answer);
      }
    });


    return roomId;
  }

  private setupCodeChannel(): void {
    this.codeChannel = this.peerConnection.createDataChannel('codeChannel');

    this.codeChannel.onmessage = (event: any) => {
      console.log(event.data, 'received');
    };

    this.codeChannel.onopen = () => {
      console.log('Code channel opened.');
    };

    this.codeChannel.onclose = () => {
      console.log('Code channel closed.');
    };
  }

}

export class ClientPeerRTC extends PeerRTC {

  constructor() {
    super();
    this.setupCodeChannel();
  }



  /**
   * Tries to establish a WebRTC connection with the host.
   * It gets the offer from the signaling server and creates an answer.
   * It sends the answer to the signaling server.
   * It starts updating remote and local ice candidates list.
   * It creates a dataChannel.
   * @param roomId string
   * @returns promise<void>
   */
  public async joinRoom(roomId: string): Promise<void> {
    //gets offer/room from signaling server
    const roomRef = doc(firestore, 'rooms', roomId);
    const roomSnapshot = await getDoc(roomRef);

    if (!roomSnapshot.exists) return;

    this.collectIceCandidates(roomRef, 'answerCandidates', 'offerCandidates');

    //creates an answer based on the offer and sets it to be the local sdp and sends it to the server
    const offer = roomSnapshot!.data()!.offer;
    await this.peerConnection.setRemoteDescription(offer);
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);


    const roomWithAnswer = {
      answer: {
        type: answer.type,
        sdp: answer.sdp,
      },
    };
    await updateDoc(roomRef, roomWithAnswer);

  }

  /**
   * Sends text to the peer using codeChannel.
   * @param text string
   */
  public sendCode(text: any): void {
    this.codeChannel.send(text);
  }

  //TODO: need to fix this to manage multiple data channels.
  private setupCodeChannel() {
    this.peerConnection.addEventListener('datachannel', (event) =>  {
      console.log('----- on data channel', event);
      this.codeChannel = event.channel;

      // Set up event listeners and handle data channel events
      this.codeChannel.onmessage = (event: any) => {
        console.log(event.data, 'received');
      };

      this.codeChannel.onopen = () => {
        console.log('Code channel opened.');
      };

      this.codeChannel.onclose = () => {
        console.log('Code channel closed.');
      };
    });
  }

}
