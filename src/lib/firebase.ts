// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: 'studio-9939174514-e81e1',
  appId: '1:1045806260007:web:daed0fcec0d35d88101302',
  apiKey: 'AIzaSyAXuoFvsun5zEIQ-HGe_Whr9bNLcfmhmDI',
  authDomain: 'studio-9939174514-e81e1.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '1045806260007',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
