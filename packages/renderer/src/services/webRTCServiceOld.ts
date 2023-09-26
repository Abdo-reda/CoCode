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


export class Peer {

  public peerConnection = new RTCPeerConnection(config);
  protected codeChannel: any;

  constructor() {
    this.registerPeerConnectionListeners();
  }

  private registerPeerConnectionListeners() {
    this.peerConnection.addEventListener('icegatheringstatechange', () => {
      console.log(`ICE gathering state changed: ${this.peerConnection.iceGatheringState}`);
    });

    this.peerConnection.addEventListener('connectionstatechange', () => {
      console.log(`Connection state change: ${this.peerConnection.connectionState}`);
    });

    this.peerConnection.addEventListener('signalingstatechange', () => {
      console.log(this.peerConnection);
      console.log(`Signaling state change: ${this.peerConnection.signalingState}`);
    });

    this.peerConnection.addEventListener('iceconnectionstatechange', () => {
      console.log(`ICE connection state change: ${this.peerConnection.iceConnectionState}`);
    });

    this.peerConnection.addEventListener('icecandidateerror', () => {
      console.log('ICE connection error, restartIee method?:');
      this.peerConnection.restartIce();
    });

    this.peerConnection.addEventListener('negotiationneeded', () => {
      console.log('Negiotation needed ....');
    });
  }

  //I think this will only work for a peer, the ice candidates remoteName will change depending from one peer to another ... (use a uuid? see how fireship did it?)
  protected async collectIceCandidates(
    roomRef: DocumentReference<DocumentData, DocumentData>,
    localName: string,
    remoteName: string,
  ) {
    const localCandidateCollection = collection(roomRef, localName);

    // If local peer finds an ice candidate(a possible route), send it signaling server and store it in its collection.
    this.peerConnection.addEventListener('icecandidate', event => {
      if (event.candidate === null) return;
        console.log('adding candidate', event.candidate);
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
}

export class HostPeer extends Peer {

  constructor() {
    super();
    this.setupCodeChannel();
  }


  public async hostRoom2() {
    const callRef = await doc(collection(firestore, 'calls'));
    const offerCandidates = await collection(callRef,  'offerCandidates');
    const answerCandidates = await collection(callRef,  'answerCandidates');

    console.log('---- id', callRef.id);

    //update candidates
    this.peerConnection.onicecandidate = event => {
      event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
    };

    const offerDesc = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offerDesc);
    //automatically start creating ice


    const offer = {
      sdp: offerDesc.sdp,
      type: offerDesc.type,
    };

    await setDoc(callRef, {offer});

    //set answer
    onSnapshot(callRef, (snapshot) => {
      const data = snapshot.data();
      if (!this.peerConnection.currentRemoteDescription && data?.answer) {
        const answerDesc = new RTCSessionDescription(data.answer);
        this.peerConnection.setRemoteDescription(answerDesc);
      }
    });

    //add candidates
    onSnapshot(answerCandidates, (snapshot) => {
      snapshot.docChanges().forEach( (change) => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          this.peerConnection.addIceCandidate(candidate);
        }
      });
    });

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
        console.log('Set remote description: ', data.answer);
        const answer = new RTCSessionDescription(data.answer);
        await this.peerConnection.setRemoteDescription(answer);
      }
    });


    return roomId;
  }

  private setupCodeChannel(): void {
    console.log('--- host listening ..');

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

export class ClientPeer extends Peer {

  constructor() {
    super();
    this.setupCodeChannel();
  }


  public async joinRoom2(callId: string) {
    const callRef = await doc(collection(firestore, 'calls'), callId);
    const offerCandidates = await collection(callRef,  'offerCandidates');
    const answerCandidates = await collection(callRef,  'answerCandidates');

    this.peerConnection.onicecandidate = event => {
      event.candidate && addDoc(answerCandidates, event.candidate.toJSON());
    };

    const callData = (await getDoc(callRef)).data();

    const offerDesc = callData!.offer;

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offerDesc));

    const answerDesc = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answerDesc);

    const answer = {
      type: answerDesc.type,
      sdp: answerDesc.sdp,
    };

    await updateDoc(callRef, {answer});

    onSnapshot(offerCandidates, (snapshot) => {
      snapshot.docChanges().forEach( (change) => {
        console.log(change);
        if (change.type === 'added') {
          const data = change.doc.data();
          this.peerConnection.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });

    this.codeChannel.onmessage = (event: any) => {
      const receivedData = event.data;
      console.log('Received data:', receivedData);
    };

    // this.codeChannel.send('please fucking send someth')

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
    console.log('--- joining', roomId);
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
  public sendCode(text: string): void {
    console.log('---- sending text', this.codeChannel);
    this.codeChannel.send(text);
  }


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
