import type {DocumentData, DocumentReference} from 'firebase/firestore';
import {
  addDoc,
  collection,
  onSnapshot,
} from 'firebase/firestore';
import {diff_match_patch} from 'diff-match-patch';

export const dmpInstance = new diff_match_patch();

//config webRTC - stun & turn servers
export const RTCConfig = {
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

