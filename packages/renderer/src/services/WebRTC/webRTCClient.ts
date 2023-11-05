import { ref, type Ref } from "vue";
import { PeerRTC, RTCConfig, dmpInstance } from "/@/services/WebRTC/webRTCService";
import type { IClient } from "/@/utils/interfaces/clientInterface";
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { firestore } from "/@/services/firebaseService";
import { type SupportedLanguages } from "@shared/utils/enums/supportedLanguagesEnum";
import {v4 as uuidv4} from 'uuid';

export class ClientPeerRTC extends PeerRTC implements IClient {
  public connectionState: Ref<string> = ref('');
  public isConnected: Ref<boolean> = ref(false);
  public peerConnection = new RTCPeerConnection(RTCConfig);
  private codeChannel: RTCDataChannel | null = null;
  private executeChannel: RTCDataChannel | null = null;
  uuid: string = '';
  name: string = 'Client';
  content: Ref<string> = ref('');

  constructor() {
    super();
    this.listenToPeerConnectionEvent();
    this.setupDataChannels();
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
    this.roomId = roomId;
    const roomRef = doc(firestore, 'rooms', roomId);
    const hostOffersRef = collection(roomRef, 'hostOffers');
    const hostOffersSnapshot = await getDocs(query(hostOffersRef, where('info.used', '==', false)));

    console.log(hostOffersSnapshot);
    if (hostOffersSnapshot.empty) throw new Error('No Host offer found');

    const hostOffer = hostOffersSnapshot.docs[0];
    await updateDoc(doc(hostOffersRef, hostOffer.id), {'info.used': true});
    this.collectIceCandidates(
      this.peerConnection,
      roomRef,
      `answerCandidates-${this.uuid}`,
      `offerCandidates-${this.uuid}`,
    );
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
  }

  public setInfo(clientName: string) {
    this.name = clientName;
    if (!this.uuid) this.uuid = uuidv4();
  }

  //TODO: need to fix this to manage multiple data channels.
  private setupDataChannels(): void {
    this.peerConnection.addEventListener('datachannel', (event: RTCDataChannelEvent) => {
      console.log('----- on data channel', event);
      // event.channel.label //I could use label based on the uuid.
      //so in the signaling step (using the signaling server) I can send the uuid of the client to the host, which then can be used to create a new unique data channel for that client.

      switch (event.channel.label) {
        case 'codeChannel':
          this.setupCodeChannel(event.channel);
          break;
        case 'executeChannel':
          this.setupExecuteChannel(event.channel);
          break;
        default:
          break;
      }
    });
  }

  private setupCodeChannel(codeChannel: RTCDataChannel): void {
    this.codeChannel = codeChannel;
    //TODO: either manual connection of channels., or use an id or naem of the channel to manage multiple peers.

    // Set up event listeners and handle data channel events
    this.codeChannel.onmessage = (event: MessageEvent<string>) => {
      console.log(event.data, 'received'); //TODO: this should be used to recieve input from the host. (the host code)
    };

    this.codeChannel.onopen = () => {
      console.log('Code channel opened.');
    };

    this.codeChannel.onclose = () => {
      console.log('Code channel closed.');
    };
  }

  private setupExecuteChannel(executeChannel: RTCDataChannel): void {
    this.executeChannel = executeChannel;

    // Set up event listeners and handle data channel events
    this.executeChannel.onmessage = (event: MessageEvent<string>) => {
      console.log(event.data, 'received'); //TODO: this should be used to recieve input from the host. (return of the code execution)
    };

    this.executeChannel.onopen = () => {
      console.log('Execute channel opened.');
    };

    this.executeChannel.onclose = () => {
      console.log('Execute channel closed.');
    };
  }

  /**
   * Sends text to the peer using codeChannel.
   * @param text string
   */
  public sendCode(channelData: string): void {
    console.log('--- sending data:', channelData);
    if (this.codeChannel && this.codeChannel.readyState === 'open')
      this.codeChannel.send(channelData);
  }


  /**
   * Sends execution command to the host using executeChannel.
   * @param text SupportedLanguages
   */
  public executeCode(executionData: SupportedLanguages): void {
    console.log('--- sending data:', executionData);
    if (this.executeChannel && this.executeChannel.readyState === 'open')
      this.executeChannel.send(executionData);
  }

  public destroy(): void {
    //Could this be moved to the parent class?
    this.codeChannel?.close();
    this.executeChannel?.close();
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
