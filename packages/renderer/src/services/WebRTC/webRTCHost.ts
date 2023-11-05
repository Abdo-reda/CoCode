import { ref, type Ref } from "vue";
import { PeerRTC, RTCConfig, dmpInstance } from "/@/services/WebRTC/webRTCService";
import type { IHost, IClientInfo } from "/@/utils/interfaces/hostInterface";
import { addDoc, collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { firestore } from "/@/services/firebaseService";
import { type SupportedLanguages } from "@shared/utils/enums/supportedLanguagesEnum";

export class HostPeerRTC extends PeerRTC implements IHost {
  //I will organize this later, but every host has
  name: string = 'Host';
  isHosting: boolean = false;

  clientList: Ref<Map<string, IClientInfo>> = ref(new Map()); //NO NEED TO HAVE TWO DIFFERNT MAPS, also no need to have uuid as the clientInfo, but its f
  clientsContent: Ref<Map<string, string>> = ref(new Map());

  peerConnectionList: RTCPeerConnection[] = [];
  codeChannelsList: RTCDataChannel[] = [];
  executeChannelsList: RTCDataChannel[] = [];

  currentPeerCount = 0;
  curPeerConnection: RTCPeerConnection | null = null;
  curOffer: any = null;
  curCodeChannel: RTCDataChannel | null = null;
  curExecuteChannel: RTCDataChannel | null = null;

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
    this.codeChannelsList.forEach(codeChannel => codeChannel.close());
    this.executeChannelsList.forEach(executeChannel => executeChannel.close());
    this.peerConnectionList.forEach(peerConnection => peerConnection.close());
    deleteDoc(doc(firestore, 'rooms', this.roomId));
    //unsubscribe from the onSnapshot listener
    //unsubscribe from the onIceCandidate listener
    //unsubscribe from the peerConnection listeners generally ...
    //make sure that the object is cleared from memory somehow ...
  }

  private async createPeerConnection(): Promise<void> {
    this.curPeerConnection = new RTCPeerConnection(RTCConfig);
    this.peerConnectionList.push(this.curPeerConnection);
    this.curCodeChannel = this.curPeerConnection.createDataChannel('codeChannel');
    this.curExecuteChannel = this.curPeerConnection.createDataChannel('executeChannel'); //TODO: make this an enum please
    this.codeChannelsList.push(this.curCodeChannel);
    this.executeChannelsList.push(this.curExecuteChannel);
    this.curOffer = await this.curPeerConnection.createOffer();
    this.curPeerConnection.setLocalDescription(this.curOffer);

    const hostObj = {
      info: {used: false},
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

    onSnapshot(clientCollectionRef, snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          this.collectIceCandidates(
            this.curPeerConnection!,
            this.roomRef,
            `offerCandidates-${data.info.uuid}`,
            `answerCandidates-${data.info.uuid}`,
          );
          this.clientList.value.set(data.info.uuid, data.info);
          this.listenToCodeChannel(data.info.uuid);
          this.listenToExecuteChannel(data.info.uuid);
          this.curPeerConnection!.setRemoteDescription(new RTCSessionDescription(data.answer));

          this.createPeerConnection();
        }
      });
    });
  }

  private listenToCodeChannel(clientUUID: string): void {
    this.curCodeChannel!.onmessage = (event: MessageEvent<string>) => {
      //TODO: create a type for this. and please return the eslint back to what it was and please fucking create branches and issues, what happened, we were better than this.
      console.log('---- receiving data:', event.data);
      console.log(event);
      const patches = dmpInstance.patch_fromText(event.data);
      console.log('=========== initial value', this.clientsContent.value.get(clientUUID), patches);
      this.clientsContent.value.set(
        clientUUID,
        dmpInstance.patch_apply(
          patches,
          this.clientsContent.value.get(clientUUID) ?? "",
        )[0],
      );
    };

    this.curCodeChannel!.onopen = () => {
      console.log('Code channel opened.');
    };

    this.curCodeChannel!.onclose = () => {
      console.log('Code channel closed.');
    };
  }

  private listenToExecuteChannel(clientUUID: string): void {
    this.curExecuteChannel!.onmessage = (event: MessageEvent<SupportedLanguages>) => {
      console.log('---- receiving execution message data:', event.data);
      console.log(event);
      const language = event.data;
      console.log(`Client ${clientUUID} wants to execute code with language ${language}`);
      //Execute Code depending on the language
      //Wait for execution to be done somehow, and then send reponse, either await or maybe do a function or something ..
    };

    this.curExecuteChannel!.onopen = () => {
      console.log('Execute channel opened.');
    };

    this.curExecuteChannel!.onclose = () => {
      console.log('Execute channel closed.');
    };
  }
}
