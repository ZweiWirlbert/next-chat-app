// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDM1AiP1Fx_U9Vc27sfWDDNoEGtlhb5YxQ",
  authDomain: "next-chat-app-eed60.firebaseapp.com",
  projectId: "next-chat-app-eed60",
  storageBucket: "next-chat-app-eed60.appspot.com",
  messagingSenderId: "915765065610",
  appId: "1:915765065610:web:5985e8ff4b30a162337a73",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { db, auth, provider };
