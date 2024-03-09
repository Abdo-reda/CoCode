import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

//TODO: make this a class/service? maybe inject in the plugins, also fix the firebase config.
export const firebaseApp = initializeApp({
    apiKey: import.meta.env.RENDERER_VITE_FIREBASE_API_KEY,
    authDomain: 'cocode-d837d.firebaseapp.com',
    projectId: 'cocode-d837d',
    storageBucket: 'cocode-d837d.appspot.com',
    messagingSenderId: '107882499142',
    appId: import.meta.env.RENDERER_VITE_FIREBASE_APP_ID,
});
export const firestore = getFirestore(firebaseApp);
