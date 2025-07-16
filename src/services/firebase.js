// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyBpWWp6yGJGQf-nTdDel7-vWoMk6Ez3dGo',
    authDomain: 'web-intern-monitor.firebaseapp.com',
    projectId: 'web-intern-monitor',
    storageBucket: 'web-intern-monitor.firebasestorage.app',
    messagingSenderId: '10555682557',
    appId: '1:10555682557:web:8463fa55b10b32c4fd9894',
    measurementId: 'G-GWH097JH4K',
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth(app);
  const db = getFirestore(app);
  
  export { auth, db, analytics }; 