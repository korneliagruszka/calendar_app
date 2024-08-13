import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDQdDL5GtaYqiownFTUh8kAjT2pcOCNBwg",
    authDomain: "calendar-app-b906e.firebaseapp.com",
    projectId: "calendar-app-b906e",
    storageBucket: "calendar-app-b906e.appspot.com",
    messagingSenderId: "85797352977",
    appId: "1:85797352977:web:387bda7e60d4a903e0a3b0",
    measurementId: "G-4CRW32X000"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db, analytics };