import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "creativewritinggroupprompts.firebaseapp.com",
  projectId: "creativewritinggroupprompts",
  storageBucket: "creativewritinggroupprompts.firebasestorage.app",
  messagingSenderId: "36048745350",
  appId: "1:36048745350:web:c9613a0720d2f355113207"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth();