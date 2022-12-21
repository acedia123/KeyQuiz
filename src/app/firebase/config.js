// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore/lite';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyDxeKRXQ_szP35YH-PPI61yKQ3WSw-JTIo',
    authDomain: 'key-quiz-6b611.firebaseapp.com',
    projectId: 'key-quiz-6b611',
    storageBucket: 'key-quiz-6b611.appspot.com',
    messagingSenderId: '552451753969',
    appId: '1:552451753969:web:31cbcd62b143f041d2a650',
    measurementId: 'G-B706JPGDPH',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
