import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../../../credentials/firebase/firebaseConfig';
import myFunc from './tempService';
import {temp2, temp1} from './tempService';

//---- config firebase

export const firebaseApp = initializeApp(firebaseConfig);
export const firestore = getFirestore(firebaseApp);
