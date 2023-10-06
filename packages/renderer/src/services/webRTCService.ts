import type {DocumentData, DocumentReference} from 'firebase/firestore';
import {addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, where} from 'firebase/firestore';
import {firestore} from '/@/services/firebaseService';
import type {Ref} from 'vue';
import {ref} from 'vue';
import {IClient} from '/@/utils/interfaces/clientInterface';
import {v4 as uuidv4} from 'uuid';
import { IClientInfo, IHost } from '/@/utils/interfaces/hostInterface';
import { diff_match_patch } from 'diff-match-patch';


const dmpInstance = new diff_match_patch();

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
  // iceCandidatePoolSize: 10,
};

// 'stun:stun.services.mozilla.com:3478',

export class PeerRTC {

  roomId: string = '';
  
  constructor() {}

  //I think this will only work for a peer, the ice candidates remoteName will change depending from one peer to another ... (
  protected async collectIceCandidates(
    peerConnection: RTCPeerConnection,
    roomRef: DocumentReference<DocumentData, DocumentData>,
    localName: string,
    remoteName: string,
  ) {
    const localCandidateCollection = collection(roomRef, localName);

    // If local peer finds an ice candidate(a possible route), send it signaling server and store it in its collection.
    peerConnection.addEventListener('icecandidate', event => {
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
          peerConnection.addIceCandidate(candidate);
        }
      });
    });
  }

 
}

export class HostPeerRTC extends PeerRTC implements IHost {
  //I will organize this later, but every host has
  name: string = 'Host';
  isHosting: boolean = false;
  
  clientList: Ref<Map<string, IClientInfo>> = ref(new Map()); //NO NEED TO HAVE TWO DIFFERNT MAPS, also no need to have uuid as the clientInfo, but its f
  clientsCode: Ref<Map<string, string>> = ref(new Map());
  
  peerConnectionList: RTCPeerConnection[] = [];
  codeChannelsList: RTCDataChannel[] = [];
  
  currentPeerCount = 0;
  curPeerConnection: RTCPeerConnection | null = null;
  curOffer: any = null
  curCodeChannel: RTCDataChannel | null = null;

  roomsCollectionRef: any; 
  roomRef: any;


  constructor() {
    super();
    this.roomsCollectionRef = collection(firestore, 'rooms');
    this.roomRef = doc(this.roomsCollectionRef);
  }

  /**
   * Tries to establish a WebRTC connection.
   * Its creates a Room/Offer and sends it to the signaling server.
   * Listens for answers from other Peers.
   * Listens for data channels from other Peers.
   * It also starts sending and storing local and remote ice candidates.
   * @returns a promise<string> containing the roomID or error
   */
  public async hostRoom(): Promise<string> {

    try {
      if (this.isHosting) return this.roomId;
      this.createPeerConnection();
      this.roomId = this.roomRef.id;
      this.listenForClients();
      this.isHosting = true;
      return this.roomId;
    } catch (err: any) {
      console.log('---- Error hosting webRTC', err);
      throw err;
    }
  }

  public destroy(): void {
    this.codeChannelsList.forEach( codeChannel => codeChannel.close());
    this.peerConnectionList.forEach( peerConnection => peerConnection.close());
    deleteDoc(doc(firestore, 'rooms', this.roomId));
    //unsubscribe from the onSnapshot listener
    //unsubscribe from the onIceCandidate listener
    //unsubscribe from the peerConnection listeners generally ...
    //make sure that the object is cleared from memory somehow ...
  }

  private async createPeerConnection(): Promise<void> {
    this.curPeerConnection = new RTCPeerConnection(config);
    this.peerConnectionList.push(this.curPeerConnection);
    this.curCodeChannel = this.curPeerConnection.createDataChannel('codeChannel');
    this.codeChannelsList.push(this.curCodeChannel);
    this.curOffer = await this.curPeerConnection.createOffer();
    this.curPeerConnection.setLocalDescription(this.curOffer);

    const hostObj = {
      info: { used: false },
      offer: {
        type: this.curOffer.type,
        sdp: this.curOffer.sdp,
      },
    };
 
    const hostOffersCollectionRef = collection(this.roomRef, 'hostOffers');
    await addDoc(hostOffersCollectionRef, hostObj);
  }

  private listenForClients(): void {
    const clientCollectionRef = collection(this.roomRef, 'clientCollection');
      
    onSnapshot(clientCollectionRef, (snapshot) => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
            
          let data = change.doc.data();
          this.collectIceCandidates(
            this.curPeerConnection!,
            this.roomRef,
            `offerCandidates-${data.info.uuid}`,
            `answerCandidates-${data.info.uuid}`,
          );
          this.clientList.value.set(data.info.uuid, data.info);
          this.listenToCodeChannel(data.info.uuid);
          this.curPeerConnection!.setRemoteDescription(new RTCSessionDescription(data.answer));

          this.createPeerConnection();
        }
      });
    });
  }



  private listenToCodeChannel(clientUUID: string): void {
    this.curCodeChannel!.onmessage = (event: any) => {
      console.log('---- receiving data:', event.data);
      console.log(event);
      let patches = dmpInstance.patch_fromText(event.data);
      this.clientsCode.value.set(
        clientUUID,
        dmpInstance.patch_apply(patches, this.clientsCode.value.get(clientUUID) ?? '')[0],
      );
    };

    this.curCodeChannel!.onopen = () => {
      console.log('Code channel opened.');
    };

    this.curCodeChannel!.onclose = () => {
      console.log('Code channel closed.');
    };
  }
}

export class ClientPeerRTC extends PeerRTC implements IClient {
  
  public connectionState: Ref<string> = ref('');
  public isConnected: Ref<boolean> = ref(false);
  public peerConnection = new RTCPeerConnection(config);
  protected codeChannel: RTCDataChannel | null = null;
  uuid: string = '';
  name: string = 'Client';
  content: Ref<string> = ref('');

  constructor() {
    super();
    this.listenToPeerConnectionEvent();
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
    try {

      this.roomId = roomId;
      const roomRef = doc(firestore, 'rooms', roomId);
      const hostOffersRef = collection(roomRef, 'hostOffers');
      const hostOffersSnapshot = await getDocs(query(hostOffersRef, where('info.used', '==', false)));

      console.log(hostOffersSnapshot);
      if (hostOffersSnapshot.empty) 
        throw new Error("No Host offer found");

      
      const hostOffer = hostOffersSnapshot.docs[0];      
      await updateDoc(doc(hostOffersRef, hostOffer.id), {'info.used': true});
      this.collectIceCandidates(this.peerConnection, roomRef, `answerCandidates-${this.uuid}`, `offerCandidates-${this.uuid}`);
      const offer = hostOffer!.data()!.offer;
      await this.peerConnection.setRemoteDescription(offer);
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
  
      const clientCollectionRef = collection(roomRef, 'clientCollection');

      const clientObj = {
        info: {
          name: this.name,
          uuid: this.uuid,
        },
        answer: {
          type: answer.type,
          sdp: answer.sdp,
        },
      };

      await addDoc(clientCollectionRef, clientObj);
    } catch (err: any) {
      throw err;
    }
  }
  
  public setInfo(clientName: string) {
    this.name = clientName;
    if (!this.uuid) this.uuid = uuidv4();
  }

  
  /**
   * Sends text to the peer using codeChannel.
   * @param text string
   */
  public sendCode(content: string): void {
    console.log('--- sending data:', content);
    if (this.codeChannel && this.codeChannel.readyState === 'open') this.codeChannel.send(content);
  }

  //TODO: need to fix this to manage multiple data channels.
  private setupCodeChannel() {
    this.peerConnection.addEventListener('datachannel', event => {
      console.log('----- on data channel', event);
      // event.channel.label //I could use label based on the uuid.
      //so in the signaling step (using the signaling server) I can send the uuid of the client to the host, which then can be used to create a new unique data channel for that client.
      this.codeChannel = event.channel;
      //TODO: either manual connection of channels., or use an id or naem of the channel to manage multiple peers.

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

  public destroy(): void { //Could this be moved to the parent class?
    this.codeChannel?.close();
    this.peerConnection.close();
    //unsubscribe from the onSnapshot listener
    //unsubscribe from the onIceCandidate listener
    //unsubscribe from the peerConnection listeners generally ...
    //make sure that the object is cleared from memory somehow ... 
  }

  private listenToPeerConnectionEvent() {
    this.peerConnection.onconnectionstatechange = _ => {
      this.connectionState.value = this.peerConnection.connectionState;
      if (this.peerConnection.connectionState === 'connected') this.isConnected.value = true;
      if (
        this.peerConnection.connectionState === 'disconnected' ||
        this.peerConnection.connectionState === 'closed'
      )
        this.isConnected.value = false;
      //https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/connectionstatechange_event
    };
  }

}
