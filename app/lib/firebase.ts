import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBqTgeX45Pvq8nT6JaS1eWbX3V8adBvl_g",
  authDomain: "ram-thakur-mandir.firebaseapp.com",
  projectId: "ram-thakur-mandir",
  storageBucket: "ram-thakur-mandir.firebasestorage.app",
  messagingSenderId: "811432812018",
  appId: "1:811432812018:web:36986304bb400e28955f6b",
};

const app =
  !getApps().length
    ? initializeApp(firebaseConfig)
    : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;